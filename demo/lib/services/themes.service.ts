import { analyzeSentiment } from "./sentiment.service"

export async function extractThemeDescription(
  messages: string[]
): Promise<string> {
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

export async function generateRecurringThemes(sentimentTrends: any) {
  return Promise.all(
    sentimentTrends.map(async (trend: any) => ({
      theme: trend.category,
      mentions: trend.mentions,
      trend: trend.avgSentiment > 0 ? "up" : "down",
      sentiment: trend.avgSentiment,
      description: await extractThemeDescription(trend.messages),
    }))
  ).then((themes) => themes.sort((a, b) => b.mentions - a.mentions).slice(0, 5))
}
