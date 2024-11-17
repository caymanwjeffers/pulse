import { Anthropic } from "@anthropic-ai/sdk"

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function analyzeSentiment(text: string): Promise<number> {
  const prompt = `As an expert in analyzing SaaS customer communications, evaluate the sentiment of this customer message. 
Consider factors like:
- Technical issues or bugs (-1)
- Feature requests (neutral to slightly positive)
- Praise or success stories (+1)
- Service disruptions (-1)
- Onboarding challenges (slightly negative)
- Billing concerns (-1)
- Integration feedback (context dependent)

Return only a number between -1 and 1`

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20241022",
    max_tokens: 100,
    messages: [{ role: "user", content: prompt + `\n\nMessage: "${text}"` }],
  })

  const sentiment = parseFloat((message.content[0] as any).text.trim())
  return isNaN(sentiment) ? 0 : sentiment
}

export async function calculateSentimentTrends(tickets: any[]) {
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

  return Object.entries(categorySentiments).map(([category, data]) => ({
    category,
    avgSentiment:
      data.sentiments.reduce((a, b) => a + b, 0) / data.sentiments.length,
    mentions: data.count,
    messages: data.messages,
  }))
}
