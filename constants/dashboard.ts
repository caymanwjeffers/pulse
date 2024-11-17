import { DashboardData } from "@/types/dashboard"

export const initialDashboardData: DashboardData = {
  sentimentTrends: {
    positive: {
      feature: "Chat Interface",
      trend: "+12.5%",
    },
    negative: {
      feature: "Loading Times",
      trend: "+11.8%",
    },
  },
  recurringThemes: [
    {
      theme: "Search Functionality",
      mentions: 4,
      trend: "down",
      sentiment: -0.6,
      description: "Search results not relevant",
    },
    {
      theme: "Checkout Process",
      mentions: 2,
      trend: "up",
      sentiment: 0.6,
      description: "Smoother payment flow",
    },
  ],
  insights: {
    knowledge: [
      {
        title: "Small Teams Expressing Frustration with Pricing Model",
        importance: "high",
        summary:
          "Analysis shows 78% of free-trialing users have teams of 2-4 people. The current 5-seat minimum requirement is preventing smaller teams from upgrading, leading to increased churn risk and missed revenue opportunities.",
        recommendations: [
          "Consider introducing a flexible 'small team' tier starting at 2 seats",
          "Analyze potential revenue impact of lowering minimum seat requirement",
          "Create targeted marketing campaigns for small team features",
        ],
      },
      {
        title: "Feature Usage vs Pricing Tier Mismatch",
        importance: "high",
        summary:
          "Users on free tier are utilizing a variety of features during trials but not converting due to the price jump to premium tier. Data suggests a mid-tier option could capture 40% of these users.",
        recommendations: [
          "Introduce an intermediate pricing tier with select premium features",
          "Implement usage-based pricing options for specific features",
          "Create clearer upgrade paths based on feature utilization patterns",
        ],
      },
    ],
  },
}
