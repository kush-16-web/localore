// src/hooks/useColorThief.tsx
import { useEffect, useState, useRef } from "react"
import * as ColorThief from "colorthief"

/**
 * Receives an image URL and returns the dominant colour as
 *   - rgb   → [r, g, b]
 *   - css   → `rgba(r,g,b,0.6)`
 *   - loading flag
 */
export function useColorThief(imgSrc: string) {
  const [rgb, setRgb] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!imgSrc) return

    const img = new Image()
    img.crossOrigin = "anonymous"                // needed for external URLs
    img.src = imgSrc
    img.onload = () => {
      try {
        const thief = new (ColorThief as any)()
        // `getColor` returns [r,g,b]
        const color = thief.getColor(img) as number[]
        setRgb(color)
      } catch (e) {
        console.warn("ColorThief failed →", e)
      } finally {
        setLoading(false)
      }
    }
    img.onerror = () => {
      console.warn("Image failed to load for colour extraction")
      setLoading(false)
    }
  }, [imgSrc])

  // Convert to CSS rgba string (0.6 opacity is a nice overlay)
  const css = rgb.length === 3 ? `rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.6)` : ""

  return { rgb, css, loading, imgRef }
}
