import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

import { customerTickets, mixpanelEvents } from "@/lib/data"

async function callAnthropic(message: string) {
  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY!,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
      }
    )
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Anthropic API Error:", {
        status: error.response?.status,
        data: error.response?.data,
      })
    }
    throw error
  }
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json()

    const relevantData = await findRelevantData(query)
    const response = await generateResponse(query, relevantData)

    return NextResponse.json({ answer: response })
  } catch (error) {
    console.error("Error processing query:", error)
    return NextResponse.json(
      { error: "Failed to process query" },
      { status: 500 }
    )
  }
}

async function findRelevantData(query: string) {
  const message = await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the IDs of the most relevant items:
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}
  
  Return only a JSON object with two arrays: 'ticketIds' and 'eventIds' containing the relevant userIds.`)

  // Parse the response to extract relevant data
  const relevantData = JSON.parse((message.content[0] as any).text)
  console.log(JSON.stringify(relevantData, null, 2))

  return relevantData
}

async function generateResponse(query: string, relevantData: any) {
  const message = await callAnthropic(`Given this query: "${query}"
  
  Analyze these data sources and return the answer with supporting evidence:
  ${JSON.stringify(relevantData, null, 2)}
  
  Customer Tickets:
  ${JSON.stringify(customerTickets, null, 2)}
  
  Analytics Events:
  ${JSON.stringify(mixpanelEvents, null, 2)}
  
  Return a JSON object with two fields: 'answer' and 'supportingEvidence'.`)

  const answer = (message.content[0] as any).text

  // just return the answer
  return answer
}
