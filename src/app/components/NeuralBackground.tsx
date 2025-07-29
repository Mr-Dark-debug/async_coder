import React, { useEffect, useRef } from 'react'
import { useTheme } from './ThemeProvider'
interface Point {
  x: number
  y: number
  vx: number
  vy: number
  connections: Point[]
}
export function NeuralBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const pointsRef = useRef<Point[]>([])
  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
  })
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight * 1.2
      initPoints()
    }
    const initPoints = () => {
      const points: Point[] = []
      const numPoints = Math.floor((canvas.width * canvas.height) / 15000)
      for (let i = 0; i < numPoints; i++) {
        points.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          connections: [],
        })
      }
      // Pre-compute connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            points[i].connections.push(points[j])
          }
        }
      }
      pointsRef.current = points
    }
    const drawNetwork = () => {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const isDark = theme === 'dark'
      const pointColor = isDark
        ? 'rgba(255, 255, 255, 0.5)'
        : 'rgba(10, 10, 12, 0.5)'
      const lineColor = isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(10, 10, 12, 0.1)'
      const activeLineColor = isDark
        ? 'rgba(0, 194, 255, 0.4)'
        : 'rgba(242, 77, 51, 0.4)'
      // Update and draw points
      pointsRef.current.forEach((point) => {
        // Update position
        point.x += point.vx
        point.y += point.vy
        // Bounce on edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1
        // Draw connections
        point.connections.forEach((connectedPoint) => {
          const dx = point.x - connectedPoint.x
          const dy = point.y - connectedPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < 150) {
            // Check if mouse is near this line
            let isActive = false
            if (mouseRef.current.active) {
              const mx = mouseRef.current.x
              const my = mouseRef.current.y
              // Calculate distance from mouse to line
              const lineLength = distance
              const lineDirection = {
                x: dx / lineLength,
                y: dy / lineLength,
              }
              const v1 = {
                x: mx - point.x,
                y: my - point.y,
              }
              const v2 = {
                x: mx - connectedPoint.x,
                y: my - connectedPoint.y,
              }
              const dot1 = v1.x * lineDirection.x + v1.y * lineDirection.y
              const dot2 = v2.x * -lineDirection.x + v2.y * -lineDirection.y
              isActive =
                dot1 > 0 &&
                dot2 > 0 &&
                Math.abs(v1.x * lineDirection.y - v1.y * lineDirection.x) < 50
            }
            ctx.beginPath()
            ctx.moveTo(point.x, point.y)
            ctx.lineTo(connectedPoint.x, connectedPoint.y)
            ctx.strokeStyle = isActive ? activeLineColor : lineColor
            ctx.lineWidth = isActive ? 1.5 : 0.5
            ctx.stroke()
          }
        })
        // Draw point
        ctx.beginPath()
        ctx.arc(point.x, point.y, 2, 0, Math.PI * 2)
        ctx.fillStyle = pointColor
        ctx.fill()
      })
    }
    const animate = () => {
      drawNetwork()
      requestAnimationFrame(animate)
    }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }
    const handleMouseLeave = () => {
      mouseRef.current.active = false
    }
    window.addEventListener('resize', resizeCanvas)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)
    resizeCanvas()
    animate()
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [theme])
  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-[120vh] -z-10 opacity-40"
    />
  )
}
