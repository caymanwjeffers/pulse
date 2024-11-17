import { NextResponse } from "next/server"

import { DashboardData } from "@/types/dashboard"
import { customerTickets, mixpanelEvents } from "@/lib/data"
import { analyzeEventsForInsights } from "@/lib/services/insights.service"
import { calculateSentimentTrends } from "@/lib/services/sentiment.service"
import { generateRecurringThemes } from "@/lib/services/themes.service"

export async function GET() {
  try {
    const sentimentTrends = await calculateSentimentTrends(customerTickets)
    const recurringThemes = await generateRecurringThemes(sentimentTrends)
    const insights = await analyzeEventsForInsights(mixpanelEvents)

    const sortedTrends = sentimentTrends.sort(
      (a, b) => b.avgSentiment - a.avgSentiment
    )

    const dashboardData: DashboardData = {
      sentimentTrends: {
        positive: {
          feature: sortedTrends[0].category,
          trend: `${(sortedTrends[0].avgSentiment * 100).toFixed(1)}%`,
        },
        negative: {
          feature: sortedTrends[sortedTrends.length - 1].category,
          trend: `${(
            sortedTrends[sortedTrends.length - 1].avgSentiment * 100
          ).toFixed(1)}%`,
        },
      },
      recurringThemes,
      insights,
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error("Error generating dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to generate dashboard data" },
      { status: 500 }
    )
  }
}
