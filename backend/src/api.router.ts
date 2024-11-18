import "@anthropic-ai/sdk/shims/node";
import { json, Request, Response, Router, text } from "express";
import axios from "axios";
import { customerTickets, mixpanelEvents } from "./data";
import Anthropic from "@anthropic-ai/sdk";
import nodeFetch from "node-fetch";
import https from "https";
import { Client as NotionClient } from "@notionhq/client";

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
  
  Analyze these data sources and return the data from the most relevant items:
  
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
  You are speaking to a non-technical product manager user, and your response should be short and simple while still including necessary information/insights.`);
}

const createNotionTask = async (data: any): Promise<string> => {
  const message = await callAnthropic(
    `Given this data: ${JSON.stringify(data)}
    
    Create a nicely formatted notion task with simple markdown. 
    It should be formatted with acceptance criteria and have a specific ask and clear language a quick backstory on what the customer complaint or need is that supports the creation fo the ticket.
    
    Additionally, the task must be returned as ONLY JSON with a title (short and concise) and a description (longer and more detailed).

    Return ONLY the JSON, nothing else.
    `
  );

  const parsed = JSON.parse(message);
  const { title, description } = parsed;

  const notion = new NotionClient({
    auth: process.env.NOTION_API_KEY,
  });

  const response = await notion.pages.create({
    parent: { database_id: process.env.NOTION_DATABASE_ID! },
    properties: {
      Name: {
        title: [{ text: { content: title } }],
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [{ type: "text", text: { content: description } }],
        },
      },
    ],
  });

  return `https://notion.so/${response.id.replace(/-/g, "")}`;
};

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

type AddTaskRequest = Request<
  {},
  {},
  {
    data: any;
  }
>;

type AddTaskResponse = Response<{
  link?: string;
  error?: string;
}>;

// Add a task to the Notion database
apiRouter.post(
  "/addTask",
  async (req: AddTaskRequest, res: AddTaskResponse) => {
    const { data } = req.body;
    try {
      const link = await createNotionTask(data);
      res.json({ link });
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

export default apiRouter;
