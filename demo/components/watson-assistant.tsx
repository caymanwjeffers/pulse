"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    watsonAssistantChatOptions: {
      integrationID: string
      region: string
      serviceInstanceID: string
      onLoad: (instance: any) => Promise<void>
    }
  }
}

export function WatsonAssistant() {
  useEffect(() => {
    window.watsonAssistantChatOptions = {
      integrationID: "b5e07110-5304-4611-948b-5e335a88eed6",
      region: "au-syd",
      serviceInstanceID: "be4224e4-538c-4563-a85d-715962b8fa80",
      onLoad: async (instance) => {
        await instance.render()
      },
    }

    const t = document.createElement("script")
    t.src = `https://web-chat.global.assistant.watson.appdomain.cloud/versions/latest/WatsonAssistantChatEntry.js`
    document.head.appendChild(t)
  }, [])

  return null
}
