import "@anthropic-ai/sdk/shims/node";
import { json, Request, Response, Router, text } from "express";
import axios from "axios";
import { customerTickets, mixpanelEvents } from "./data";
import Anthropic from "@anthropic-ai/sdk";
import nodeFetch from "node-fetch";
import https from "https";

const apiRouter = Router();
apiRouter.use(json(), text());

const MAX_TOKENS = 8192;

async function callAnthropic(message: string) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    maxRetries: 0,
    fetch: (url, init) => {
      console.log("Starting request to:", url);
      return nodeFetch(url, {
        ...init,
        agent: new https.Agent({
          keepAlive: true,
          timeout: 60000,
          family: 4,
        }),
      });
    },
  });

  try {
    const response = await anthropic.messages.create(
      {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: MAX_TOKENS,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "content-type": "application/json",
        },
      }
    );
    console.log("Anthropic response:", response.content);

    return (response.content[0] as any).text;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Anthropic API Error:",
        error.response?.data || error.message
      );
    }
    throw error;
  }
}

async function findRelevantData(query: string) {
  return await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the IDs of the most relevant items:
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}`);
}

async function generateResponse(query: string, relevantData: any) {
  return await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the answer with supporting evidence:
  ${JSON.stringify(relevantData, null, 2)}
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}
  
  Return a concise answer without including any user information your response. 
  This response should be simple and easy to understand and formatted to communicate to a non-technical product manager user.`);
}

type QueryRequest = Request<
  {},
  {},
  {
    query: string;
  }
>;

type QueryResponse = Response<{
  answer?: string;
  error?: string;
}>;

// Replace the empty route with the query processing logic
apiRouter.post("/analyze", async (req: QueryRequest, res: QueryResponse) => {
  try {
    const { query } = req.body;
    const relevantData = await findRelevantData(query);
    const response = await generateResponse(query, relevantData);

    res.json({ answer: response });
  } catch (error) {
    console.error("Error processing query:", error);
    res.status(500).json({ error: "Failed to process query" });
  }
});

export default apiRouter;
