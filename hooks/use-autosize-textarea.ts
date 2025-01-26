import { useEffect, useRef } from "react"

interface UseAutosizeTextAreaProps {
  ref: React.RefObject<HTMLTextAreaElement>
  maxHeight?: number
  borderWidth?: number
  dependencies?: any[]
}

export function useAutosizeTextArea({
  ref,
  maxHeight = Number.POSITIVE_INFINITY,
  borderWidth = 0,
  dependencies = [],
}: UseAutosizeTextAreaProps) {
  const previousHeight = useRef<number>(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const resize = () => {
      element.style.height = "auto"
      const newHeight = Math.min(element.scrollHeight + borderWidth * 2, maxHeight)

      if (newHeight !== previousHeight.current) {
        element.style.height = `${newHeight}px`
        previousHeight.current = newHeight
      }
    }

    resize()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, maxHeight, borderWidth, ...dependencies])
}

