import EmbeddableChart from "@/components/EmbeddableChart"

export default function ChartPage() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <EmbeddableChart />
      </div>
    </div>
  )
}
