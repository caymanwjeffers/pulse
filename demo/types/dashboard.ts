export type SentimentTrend = {
  feature: string
  trend: string
}

export type RecurringTheme = {
  theme: string
  mentions: number
  trend: "up" | "down"
  sentiment: number
  description: string
}

export type KnowledgeInsight = {
  title: string
  importance: "high" | "medium" | "low"
  summary: string
  recommendations: string[]
}

export type DashboardData = {
  sentimentTrends: {
    positive: SentimentTrend
    negative: SentimentTrend
  }
  recurringThemes: RecurringTheme[]
  insights: {
    knowledge: KnowledgeInsight[]
  }
}
