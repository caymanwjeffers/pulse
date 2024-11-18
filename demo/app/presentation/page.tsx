"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  AlertCircle,
  BarChart2,
  Cpu,
  Play,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react"

interface Slide {
  icon: JSX.Element
  title: string
  subtitle: string
}

const slides: Slide[] = [
  {
    icon: <Zap className="w-12 h-12" />,
    title: "Introducing Pulse",
    subtitle: "Real-time monitoring for modern applications",
  },
  {
    icon: <AlertCircle className="w-12 h-12" />,
    title: "The Challenge",
    subtitle: "Complex systems need real-time visibility",
  },
  {
    icon: <BarChart2 className="w-12 h-12" />,
    title: "The Reality",
    subtitle: "Delayed insights lead to missed opportunities",
  },
  {
    icon: <Cpu className="w-12 h-12" />,
    title: "Pulse Solution",
    subtitle: "Instant visibility into your application's heartbeat",
  },
  {
    icon: <Settings className="w-12 h-12" />,
    title: "How It Works",
    subtitle: "Advanced monitoring with simple integration",
  },
  {
    icon: <TrendingUp className="w-12 h-12" />,
    title: "Real Impact",
    subtitle: "Measurable improvements in response time and efficiency",
  },
  {
    icon: <Play className="w-12 h-12" />,
    title: "Live Demo",
    subtitle: "See Pulse in action",
  },
]

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((curr) => curr + 1)
    }
  }

  const previousSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide((curr) => curr - 1)
    }
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
      <div className="absolute top-4 right-4 text-sm">
        {currentSlide + 1} / {slides.length}
      </div>

      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="text-center max-w-3xl mx-auto px-4"
      >
        <div className="flex justify-center mb-8">
          {slides[currentSlide].icon}
        </div>

        <h1 className="text-4xl font-bold mb-4">
          {slides[currentSlide].title}
        </h1>

        <p className="text-xl text-gray-300">{slides[currentSlide].subtitle}</p>
      </motion.div>

      <div className="fixed bottom-8 left-0 right-0 flex justify-center gap-4">
        <button
          onClick={previousSlide}
          disabled={currentSlide === 0}
          className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  )
}
