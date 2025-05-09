"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import type { Chamado } from "../../types"

interface CategoryChartProps {
  tickets: Chamado[]
}

const CategoryChart: React.FC<CategoryChartProps> = ({ tickets }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Helper function to count tickets by category
  const countTicketsByCategory = (tickets: Chamado[]) => {
    const counts = {
      hardware: 0,
      software: 0,
      rede: 0,
      acesso: 0,
      outro: 0,
    }

    tickets.forEach((ticket) => {
      counts[ticket.categoria]++
    })

    return counts
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return

    const categoryData = countTicketsByCategory(tickets)

    // Mock chart implementation - in a real app, you'd use a library like Chart.js
    const drawChart = () => {
      const width = canvasRef.current!.width
      const height = canvasRef.current!.height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Get total for percentage calculations
      const total = Object.values(categoryData).reduce((acc, val) => acc + val, 0)
      if (total === 0) return

      // Colors for each category
      const colors = {
        hardware: "#2563eb", // Blue
        software: "#059669", // Green
        rede: "#d97706", // Amber
        acesso: "#7c3aed", // Purple
        outro: "#6b7280", // Gray
      }

      // Chart settings
      const barHeight = 30
      const barGap = 15
      const marginLeft = 90
      const marginTop = 20
      const chartWidth = width - marginLeft - 40

      // Draw category bars
      let y = marginTop
      Object.entries(categoryData).forEach(([category, count]) => {
        const percentage = (count / total) * 100
        const barWidth = (count / total) * chartWidth

        // Draw category label
        ctx.fillStyle = "#374151"
        ctx.font = "14px sans-serif"
        ctx.textAlign = "right"
        ctx.fillText(category.charAt(0).toUpperCase() + category.slice(1), marginLeft - 10, y + barHeight / 2 + 4)

        // Draw bar background
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(marginLeft, y, chartWidth, barHeight)

        // Draw bar
        ctx.fillStyle = colors[category as keyof typeof colors]
        ctx.fillRect(marginLeft, y, barWidth, barHeight)

        // Draw count and percentage
        ctx.fillStyle = "#ffffff"
        ctx.font = "bold 12px sans-serif"
        ctx.textAlign = "left"
        if (barWidth > 50) {
          // Only draw text inside bar if there's enough space
          ctx.fillText(`${count} (${Math.round(percentage)}%)`, marginLeft + 10, y + barHeight / 2 + 4)
        } else {
          ctx.fillStyle = "#374151"
          ctx.fillText(`${count} (${Math.round(percentage)}%)`, marginLeft + barWidth + 5, y + barHeight / 2 + 4)
        }

        y += barHeight + barGap
      })
    }

    drawChart()
  }, [tickets])

  return (
    <div className="bg-white p-5 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Chamados por Categoria</h3>
      <canvas ref={canvasRef} width={500} height={250} className="w-full" />
    </div>
  )
}

export default CategoryChart
