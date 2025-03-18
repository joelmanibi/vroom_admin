import { useState, useCallback } from 'react'

export function useExpandedItems() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = useCallback((title: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }, [])

  return { expandedItems, toggleItem }
}
