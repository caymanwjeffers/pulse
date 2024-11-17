import { NextRequest, NextResponse } from "next/server"
import { Anthropic } from "@anthropic-ai/sdk"

import { AnalyticsEvent, CustomerTicket } from "@/types/api"
import { customerTickets, mixpanelEvents } from "@/lib/data"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

type QueryResponse = {
  answer: string
  supportingEvidence: {
    tickets?: CustomerTicket[]
    events?: AnalyticsEvent[]
    summary?: string
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    // First, find relevant tickets and events
    const relevantData = await findRelevantData(query)

    // Then, generate the answer with supporting evidence
    const response = await generateResponse(query, relevantData)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    )
  }
}

async function findRelevantData(query: string) {
  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Given this query: "${query}"
        
        Analyze these data sources and return the IDs of the most relevant items:
        
        Customer Tickets:
        ${JSON.stringify(customerTickets, null, 2)}
        
        Analytics Events:
        ${JSON.stringify(mixpanelEvents, null, 2)}
        
        Return only a JSON object with two arrays: 'ticketIds' and 'eventIds' containing the relevant userIds.`,
      },
    ],
  })

  // Parse the response to extract relevant data
  const relevantData = JSON.parse((message.content[0] as any).text)

  return relevantData
}

async function generateResponse(query: string, relevantData: any) {
  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    messages: [
      {
        role: "user",
        content: `Given this query: "${query}"
        
        Analyze these data sources and return the answer with supporting evidence:
        
        Customer Tickets:
        ${JSON.stringify(customerTickets, null, 2)}
        
        Analytics Events:
        ${JSON.stringify(mixpanelEvents, null, 2)}
        
        Return a JSON object with two fields: 'answer' and 'supportingEvidence'.`,
      },
    ],
  })

  const answer = (message.content[0] as any).text

  // Parse the response to extract supporting evidence
  const supportingEvidence = JSON.parse(answer)

  return {
    answer,
    supportingEvidence,
  }
}
