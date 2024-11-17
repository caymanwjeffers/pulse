// Utility function to generate random dates within a range
function randomDate(start: Date, end: Date) {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
}

// Generate ticket and event data
export const customerTickets = [
  {
    username: "sarah_dev",
    userId: "USR001",
    message:
      "The search results aren't showing relevant results for my team's projects. I've tried using specific keywords but still getting unrelated matches.",
    category: "Search Functionality",
    timestamp: new Date(2024, 10, 15),
  },
  {
    username: "alex_startup",
    userId: "USR002",
    message:
      "Having issues with the checkout process. My team wants to upgrade to premium, but we only have 3 people and it requires 5 seats minimum.",
    category: "Checkout Process",
    timestamp: new Date(2024, 10, 16),
  },
  {
    username: "tech_lead_maria",
    userId: "USR003",
    message:
      "The chat interface is great, but sometimes it takes too long to load previous conversations. Can this be optimized?",
    category: "Loading Times",
    timestamp: new Date(2024, 10, 17),
  },
  {
    username: "david_pm",
    userId: "USR004",
    message:
      "Love the new chat interface features! The response suggestions are incredibly helpful for our daily standups.",
    category: "Chat Interface",
    timestamp: new Date(2024, 10, 18),
  },
  {
    username: "startup_sam",
    userId: "USR005",
    message:
      "We're a small team of 2 and the minimum seat requirement is preventing us from accessing the premium features we need.",
    category: "Pricing",
    timestamp: new Date(2024, 10, 19),
  },
  {
    username: "rachel_ux",
    userId: "USR006",
    message:
      "Search is returning old archived projects even when I specifically filter for active ones. This is making it hard to find current work.",
    category: "Search Functionality",
    timestamp: new Date(2024, 10, 20),
  },
  {
    username: "mike_engineer",
    userId: "USR007",
    message:
      "The loading time for the analytics dashboard has improved significantly. Great work on the optimization!",
    category: "Loading Times",
    timestamp: new Date(2024, 10, 21),
  },
  {
    username: "product_lisa",
    userId: "USR008",
    message:
      "The checkout process is much smoother now. Really appreciate the clear pricing breakdown per feature.",
    category: "Checkout Process",
    timestamp: new Date(2024, 10, 22),
  },
  {
    username: "james_startup",
    userId: "USR009",
    message:
      "We're getting timeout errors when trying to search through our document repository. This is blocking our team's workflow.",
    category: "Search Functionality",
    timestamp: new Date(2024, 10, 23),
  },
  {
    username: "emma_tech",
    userId: "USR010",
    message:
      "The chat interface's new AI suggestions are spot on! Though sometimes they take a while to load.",
    category: "Chat Interface",
    timestamp: new Date(2024, 10, 24),
  },
];

// Define subscription plans
const subscriptionPlans = {
  FREE: { name: "Free", cost: 0 },
  BASIC: { name: "Basic", cost: 15 },
  PRO: { name: "Pro", cost: 30 },
  ENTERPRISE: { name: "Enterprise", cost: 100 },
};

// Generate Mixpanel events for each user
export const mixpanelEvents = customerTickets.flatMap((ticket) => {
  const userPlan =
    Object.values(subscriptionPlans)[Math.floor(Math.random() * 4)];
  const accountCreationDate = randomDate(
    new Date(2023, 0, 1),
    new Date(2024, 6, 1)
  );
  const baseEventTime = new Date(2024, 10, 16); // November 16, 2024

  // Generate events based on the ticket category
  let events: { eventName: string; timestamp: Date }[] = [];

  switch (ticket.category) {
    case "Search Functionality":
      events = [
        {
          eventName: "search_initiated",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 5),
        },
        {
          eventName: "search_results_viewed",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 4),
        },
        {
          eventName: "search_filter_applied",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 3),
        },
        {
          eventName: "search_error_occurred",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 2),
        },
      ];
      break;

    case "Checkout Process":
      events = [
        {
          eventName: "pricing_page_viewed",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 10),
        },
        {
          eventName: "upgrade_button_clicked",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 8),
        },
        {
          eventName: "seat_selection_changed",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 6),
        },
        {
          eventName: "checkout_started",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 4),
        },
      ];
      break;

    case "Chat Interface":
      events = [
        {
          eventName: "chat_opened",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 15),
        },
        {
          eventName: "message_sent",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 12),
        },
        {
          eventName: "ai_suggestion_received",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 10),
        },
        {
          eventName: "suggestion_accepted",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 8),
        },
      ];
      break;

    case "Loading Times":
      events = [
        {
          eventName: "page_load_started",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 20),
        },
        {
          eventName: "content_loading",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 18),
        },
        {
          eventName: "page_fully_loaded",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 15),
        },
      ];
      break;

    case "Pricing":
      events = [
        {
          eventName: "pricing_page_viewed",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 25),
        },
        {
          eventName: "feature_comparison_viewed",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 20),
        },
        {
          eventName: "upgrade_button_clicked",
          timestamp: new Date(baseEventTime.getTime() - 1000 * 60 * 15),
        },
      ];
      break;
  }

  // Add user attributes to each event
  return events.map((event, index) => ({
    userId: ticket.userId,
    ...event,
    userAttributes: {
      teamSize: index < 4 ? 3 : 25, // First 4 events get team size of 3, rest get 25
      subscriptionPlan: userPlan.name,
      planCost: userPlan.cost,
      accountCreationDate: accountCreationDate.toISOString(),
    },
  }));
});
