export type CustomerTicket = {
  username: string
  userId: string
  message: string
  category: string
  timestamp: Date
}

export type AnalyticsEvent = {
  userId: string
  eventName: string
  timestamp: Date
  userAttributes: {
    teamSize: number
    subscriptionPlan: string
    planCost: number
    accountCreationDate: string
  }
}
