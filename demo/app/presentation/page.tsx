"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  AlertCircle,
  BarChart2,
  Lightbulb,
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
    icon: <Zap className="w-[10vh] h-[10vh]" />,
    title: "Introducing Pulse",
    subtitle:
      "Extracting actionable product insights from customer communications across all channels.",
  },
  {
    icon: <AlertCircle className="w-[10vh] h-[10vh]" />,
    title: "The Challenge",
    subtitle:
      "Growing companies struggle to maintain deep customer insights needed for effective product decisions.",
  },
  {
    icon: <BarChart2 className="w-[10vh] h-[10vh]" />,
    title: "The Reality",
    subtitle:
      "Scaling companies with limited resources and large user bases have a wealth of untapped customer insights scattered across many different communication channels.",
  },
  {
    icon: <Lightbulb className="w-[10vh] h-[10vh]" />,
    title: "Pulse Is The Solution",
    subtitle:
      "Customer insights distilled into actionable product insights, using artificial intelligence.",
  },
  {
    icon: <Settings className="w-[10vh] h-[10vh]" />,
    title: "How It Works",
    subtitle:
      "Our AI analyzes and categorizes customer feedback across channels, combining it with analytics data to deliver validated, actionable insights.",
  },
  {
    icon: <TrendingUp className="w-[10vh] h-[10vh]" />,
    title: "Real Impact",
    subtitle:
      "Better product decisions, faster. Improved customer satisfaction and experience.",
  },
  {
    icon: <Play className="w-[10vh] h-[10vh]" />,
    title: "Live Demo",
    subtitle: "See Pulse in action",
  },
]

export default function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()

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

  const handleDemoClick = () => {
    if (currentSlide === slides.length - 1) {
      // Animate out
      document.body.style.overflow = "hidden" // Prevent scrolling during animation
      const element = document.querySelector(".presentation-container")
      if (element instanceof HTMLElement) {
        element.style.pointerEvents = "none" // Prevent multiple clicks
      }

      // Navigate after animation completes
      setTimeout(() => {
        document.body.style.overflow = "" // Reset overflow style
        router.push("/")
      }, 500)
    }
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = "" // Reset overflow on unmount
    }
  }, [])

  return (
    <motion.div
      onClick={handleDemoClick}
      className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white p-4 presentation-container ${
        currentSlide === slides.length - 1 ? "cursor-pointer" : ""
      }`}
      exit={{
        opacity: 0,
        y: "-5vh",
        transition: { duration: 0.5 },
      }}
    >
      <div className="absolute top-[2vh] right-[2vh] text-base">
        {currentSlide + 1} / {slides.length}
      </div>

      <motion.div
        key={currentSlide}
        initial={{ opacity: 0, y: "5vh" }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: "-5vh" }}
        className="text-center w-full max-w-[90%] lg:max-w-[80%] mx-auto"
      >
        <div className="flex justify-center mb-[4vh]">
          {slides[currentSlide].icon}
        </div>

        <h1 className="text-[5vh] font-bold mb-[2vh]">
          {slides[currentSlide].title}
        </h1>

        <p className="text-[2.5vh] text-gray-300">
          {slides[currentSlide].subtitle}
        </p>
      </motion.div>

      <div className="fixed bottom-[4vh] left-0 right-0 flex justify-center gap-[2vh]">
        <button
          onClick={previousSlide}
          disabled={currentSlide === 0}
          className="px-[2vh] py-[1vh] bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="px-[2vh] py-[1vh] bg-white/10 rounded-lg hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </motion.div>
  )
}
