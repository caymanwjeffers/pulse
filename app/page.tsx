"use client"

import { useState } from "react"
import { initialDashboardData } from "@/constants/dashboard"
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  FileText,
  TrendingUp,
} from "lucide-react"

import { DashboardData } from "@/types/dashboard"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function IndexPage() {
  const [dashboardData, setDashboardData] =
    useState<DashboardData>(initialDashboardData)

  return (
    <section className="container py-6 space-y-8">
      {/* Sentiment Trends */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <TrendingUp className="text-green-600" />
              Positive Feedback Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-green-700">
              Users are very happy with the{" "}
              {dashboardData.sentimentTrends.positive.feature}
              <Badge className="ml-2 bg-green-200 text-green-800">
                {dashboardData.sentimentTrends.positive.trend}
              </Badge>
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <TrendingUp className="text-red-600 rotate-180" />
              Trending Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700">
              Users expressing frustration with{" "}
              {dashboardData.sentimentTrends.negative.feature}
              <Badge className="ml-2 bg-red-200 text-red-800">
                {dashboardData.sentimentTrends.negative.trend}
              </Badge>
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Key Product Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Key Product Insights</CardTitle>
          <CardDescription>
            Critical business findings and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dashboardData.insights.knowledge.map((doc, index) => (
            <Card
              key={index}
              className={`border-l-4 ${
                doc.importance === "high"
                  ? "border-l-destructive"
                  : "border-l-primary"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {doc.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{doc.summary}</p>
                <div className="space-y-2">
                  {doc.recommendations.map((rec, i) => (
                    <Alert key={i} variant="default">
                      <AlertTitle>Recommendation {i + 1}</AlertTitle>
                      <AlertDescription>{rec}</AlertDescription>
                    </Alert>
                  ))}
                </div>
                <div className="flex gap-2 mt-6">
                  <Button variant="outline">View Details</Button>
                  <Button>
                    Take Action <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {/* Recurring Themes */}
      <Card>
        <CardHeader>
          <CardTitle>Recurring Feedback Themes</CardTitle>
          <CardDescription>
            Recently discussed topics from user feedback
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.recurringThemes.map((theme, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded hover:bg-muted/50 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{theme.theme}</h3>
                  <p className="text-sm text-muted-foreground">
                    {theme.mentions} mentions • {theme.description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {theme.trend === "up" ? (
                    <ArrowUp className="text-green-500" />
                  ) : (
                    <ArrowDown className="text-red-500" />
                  )}
                  <Badge
                    className={`${
                      theme.sentiment > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                    variant={theme.sentiment > 0 ? "default" : "destructive"}
                  >
                    {theme.sentiment > 0 ? "Positive" : "Negative"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
