// src/hooks/useColorThief.tsx
import { useEffect, useState } from "react"
import { getColorSync, getPaletteSync } from "colorthief"

/**
 * Extracts colours from an image using colorthief v3.
 *   - rgb     → dominant colour as [r, g, b]
 *   - palette → up to N colours as [[r,g,b], ...]
 *   - css     → dominant colour as `rgb(r g b)`
 *   - loading flag
 */
export function useColorThief(imgSrc: string) {
  const [rgb, setRgb] = useState<number[]>([])
  const [palette, setPalette] = useState<number[][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!imgSrc) return

    let cancelled = false

    const img = new Image()
    img.crossOrigin = "anonymous" // needed for external URLs
    img.src = imgSrc
    img.onload = () => {
      if (cancelled) return
      try {
        const dominant = getColorSync(img)
        const colors = getPaletteSync(img, { colorCount: 4 })
        setRgb(dominant?.array() ?? [])
        setPalette((colors ?? []).map((c) => c.array()))
      } catch {
        // tainted canvas / CORS issues — fall back silently
      } finally {
        setLoading(false)
      }
    }
    img.onerror = () => {
      if (!cancelled) setLoading(false)
    }

    return () => {
      cancelled = true
    }
  }, [imgSrc])

  const css = rgb.length === 3 ? `rgb(${rgb[0]} ${rgb[1]} ${rgb[2]})` : ""

  return { rgb, palette, css, loading }
}
