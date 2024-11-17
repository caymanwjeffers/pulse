import { Router } from "express";
import Anthropic from "@anthropic-ai/sdk";
import { customerTickets, mixpanelEvents } from "./data";

const apiRouter = Router();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

async function callAnthropic(message: string) {
  try {
    const response = await anthropic.messages.create({
      model: "claude-3-sonnet",
      max_tokens: 1024,
      messages: [{ role: "user", content: message }],
    });
    return response;
  } catch (error) {
    console.error("Anthropic API Error:", error);
    throw error;
  }
}

async function findRelevantData(query: string) {
  const message = await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the IDs of the most relevant items:
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}
  
  Return only a JSON object with two arrays: 'ticketIds' and 'eventIds' containing the relevant userIds.`);

  // Parse the response to extract relevant data
  const relevantData = JSON.parse((message.content[0] as any).text);
  console.log(JSON.stringify(relevantData, null, 2));

  return relevantData;
}

async function generateResponse(query: string, relevantData: any) {
  const message = await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the answer with supporting evidence:
  ${JSON.stringify(relevantData, null, 2)}
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}
  
  Return a JSON object with two fields: 'answer' and 'supportingEvidence'.`);

  const answer = (message.content[0] as any).text;
  return answer;
}

// Replace the empty route with the query processing logic
apiRouter.post("/analyze", async (req, res) => {
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
