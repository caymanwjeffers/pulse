import { NextResponse } from "next/server"
import { Anthropic } from "@anthropic-ai/sdk"

import { customerTickets, mixpanelEvents } from "@/lib/data"

export interface CustomerTicket {
  category: string
  message: string
  timestamp: string
}

export interface MixpanelEvent {
  eventName: string
  userAttributes: {
    teamSize: number
    subscriptionPlan: string
    planCost: number
    accountCreationDate: string
  }
  timestamp: Date
  userId: string
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

async function analyzeSentiment(text: string): Promise<number> {
  const prompt = `As an expert in analyzing SaaS customer communications, evaluate the sentiment of this customer message. 
Consider factors like:
- Technical issues or bugs (-1)
- Feature requests (neutral to slightly positive)
- Praise or success stories (+1)
- Service disruptions (-1)
- Onboarding challenges (slightly negative)
- Billing concerns (-1)
- Integration feedback (context dependent)

Return only a number between -1 and 1, where:
-1 = severe issues, customer frustration, or churn risk
0 = neutral feedback or standard feature requests
1 = highly positive, indicating customer success and satisfaction

Message to analyze: "${text}"`

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20241022",
    max_tokens: 100,
    messages: [{ role: "user", content: prompt }],
  })

  const sentiment = parseFloat((message.content[0] as any).text.trim())
  return isNaN(sentiment) ? 0 : sentiment
}

async function calculateSentimentTrends(tickets: typeof customerTickets) {
  const categorySentiments: Record<
    string,
    {
      sentiments: number[]
      messages: string[]
      count: number
    }
  > = {}

  for (const ticket of tickets) {
    if (!categorySentiments[ticket.category]) {
      categorySentiments[ticket.category] = {
        sentiments: [],
        messages: [],
        count: 0,
      }
    }
    const sentiment = await analyzeSentiment(ticket.message)
    categorySentiments[ticket.category].sentiments.push(sentiment)
    categorySentiments[ticket.category].messages.push(ticket.message)
    categorySentiments[ticket.category].count++
  }

  return Object.entries(categorySentiments).map(([category, data]) => {
    const avgSentiment =
      data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length
    return {
      category,
      avgSentiment,
      mentions: data.count,
      messages: data.messages,
    }
  })
}

async function extractThemeDescription(messages: string[]): Promise<string> {
  // Find the message with the strongest sentiment
  const messageSentiments = await Promise.all(
    messages.map(async (msg) => ({
      message: msg,
      sentiment: Math.abs(await analyzeSentiment(msg)),
    }))
  )

  const strongestMessage = messageSentiments.sort(
    (a, b) => b.sentiment - a.sentiment
  )[0].message

  return strongestMessage.slice(0, 50) + "..."
}

async function analyzeEventsWithClaude(events: MixpanelEvent[]) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })

  const eventSummary = events
    .map((e) => `${e.eventName}: ${JSON.stringify(e.userAttributes)}`)
    .join("\n")

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    tools: [
      {
        name: "analyze_events",
        description:
          "Analyze event data and provide insights using well-structured JSON.",
        input_schema: {
          type: "object",
          properties: {
            knowledge: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "Title of the insight",
                  },
                  importance: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                    description: "Importance level of the insight",
                  },
                  summary: {
                    type: "string",
                    description: "Detailed explanation of the insight",
                  },
                  recommendations: {
                    type: "array",
                    items: { type: "string" },
                    description: "List of actionable recommendations",
                  },
                },
                required: ["title", "importance", "summary", "recommendations"],
              },
            },
          },
          required: ["knowledge"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "analyze_events" },
    messages: [
      {
        role: "user",
        content: `Analyze these user events and identify key patterns and insights. Focus on:
1. User behavior patterns
2. Potential churn risks
3. Upgrade opportunities
4. Feature usage trends

Events:\n${eventSummary}`,
      },
    ],
  })

  try {
    // The response will now be properly structured according to our schema
    return JSON.parse(message.content[0] as any).text
  } catch (error) {
    console.error("Failed to parse Claude's response:", error)
    return {
      knowledge: [
        {
          title: "Error Analyzing Data",
          importance: "high",
          summary: "Failed to analyze event data",
          recommendations: ["Review raw event data manually"],
        },
      ],
    }
  }
}

async function generateDashboardInsights(
  sentimentTrends: any,
  recurringThemes: any
) {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    tools: [
      {
        name: "generate_insights",
        description: "Generate dashboard insights using well-structured JSON.",
        input_schema: {
          type: "object",
          properties: {
            sentimentTrends: {
              type: "object",
              properties: {
                positive: {
                  type: "object",
                  properties: {
                    feature: { type: "string" },
                    trend: { type: "string" },
                  },
                },
                negative: {
                  type: "object",
                  properties: {
                    feature: { type: "string" },
                    trend: { type: "string" },
                  },
                },
              },
            },
            recurringThemes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  theme: { type: "string" },
                  mentions: { type: "number" },
                  trend: { type: "string", enum: ["up", "down"] },
                  sentiment: { type: "number" },
                  description: { type: "string" },
                },
              },
            },
          },
          required: ["sentimentTrends", "recurringThemes"],
        },
      },
    ],
    tool_choice: { type: "tool", name: "generate_insights" },
    messages: [
      {
        role: "user",
        content: `Generate dashboard insights based on these trends:
        
Sentiment Trends:
${JSON.stringify(sentimentTrends, null, 2)}

Recurring Themes:
${JSON.stringify(recurringThemes, null, 2)}`,
      },
    ],
  })

  try {
    return JSON.parse(message.content[0] as any).text
  } catch (error) {
    console.error("Failed to parse insights:", error)
    return {
      sentimentTrends: {
        positive: { feature: "Error", trend: "0%" },
        negative: { feature: "Error", trend: "0%" },
      },
      recurringThemes: [],
    }
  }
}

export async function GET() {
  try {
    const sentimentTrends = await calculateSentimentTrends(customerTickets)
    const eventInsights = await analyzeEventsWithClaude(mixpanelEvents)

    // Find most positive and negative trends
    const sortedTrends = sentimentTrends.sort(
      (a, b) => b.avgSentiment - a.avgSentiment
    )
    const positiveTrend = sortedTrends[0]
    const negativeTrend = sortedTrends[sortedTrends.length - 1]

    // Calculate recurring themes
    const recurringThemes = await Promise.all(
      sentimentTrends.map(async (trend) => ({
        theme: trend.category,
        mentions: trend.mentions,
        trend: trend.avgSentiment > 0 ? "up" : "down",
        sentiment: trend.avgSentiment,
        description: await extractThemeDescription(trend.messages),
      }))
    ).then((themes) =>
      themes.sort((a, b) => b.mentions - a.mentions).slice(0, 5)
    )

    const dashboardData = await generateDashboardInsights(
      sentimentTrends,
      recurringThemes
    )

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error generating dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to generate dashboard data" },
      { status: 500 }
    )
  }
}

function analyzeTeamSizeIssues(
  tickets: typeof customerTickets
): Promise<string> {
  const teamSizeMessages = tickets.filter(
    (t) =>
      t.message.toLowerCase().includes("team") &&
      (t.message.toLowerCase().includes("seat") ||
        t.message.toLowerCase().includes("minimum"))
  )

  if (teamSizeMessages.length > 0) {
    // First, calculate all sentiments and wait for them
    return Promise.all(
      teamSizeMessages.map((t) => analyzeSentiment(t.message))
    ).then((sentiments) => {
      const avgSentiment =
        sentiments.reduce((a, b) => a + b, 0) / sentiments.length

      return `Analysis shows ${
        teamSizeMessages.length
      } users reporting team size requirement issues. 
        Overall sentiment is ${avgSentiment < 0 ? "negative" : "positive"}, 
        with ${teamSizeMessages.length} mentions in recent feedback.`
    })
  }

  return Promise.resolve(
    "No significant issues detected with team size requirements."
  )
}

async function generateRecommendations(
  tickets: typeof customerTickets
): Promise<string[]> {
  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  })

  const smallTeamIssues = tickets.filter(
    (t) =>
      t.message.toLowerCase().includes("small team") ||
      t.message.toLowerCase().includes("minimum seat")
  )

  if (smallTeamIssues.length > 0) {
    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 500,
      tools: [
        {
          name: "generate_recommendations",
          description:
            "Generate actionable recommendations based on customer feedback",
          input_schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: { type: "string" },
                description: "List of specific, actionable recommendations",
              },
            },
            required: ["recommendations"],
          },
        },
      ],
      tool_choice: { type: "tool", name: "generate_recommendations" },
      messages: [
        {
          role: "user",
          content: `Generate specific, actionable recommendations based on these customer messages about team size issues:
        ${smallTeamIssues.map((t) => t.message).join("\n")}`,
        },
      ],
    })

    try {
      const response = JSON.parse(message.content[0] as any).text
      return response.recommendations
    } catch (error) {
      console.error("Failed to parse recommendations:", error)
    }
  }

  return ["Monitor user feedback for emerging patterns"]
}
