import { Anthropic } from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function analyzeEventsForInsights(events: any[]) {
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
                  title: { type: "string" },
                  importance: {
                    type: "string",
                    enum: ["high", "medium", "low"],
                  },
                  summary: { type: "string" },
                  recommendations: { type: "array", items: { type: "string" } },
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

  return JSON.parse(message.content[0] as any).text
}
