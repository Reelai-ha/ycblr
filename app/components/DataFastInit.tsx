'use client'

import { useEffect } from 'react'

export default function DataFastInit() {
  useEffect(() => {
    const init = async () => {
      try {
        const { initDataFast } = await import('datafast')
        await initDataFast({
          websiteId: 'dfid_e62iErDJsMkVu7XniqC0r',
        })
      } catch (err) {
        console.error('Failed to initialize DataFast:', err)
      }
    }
    init()
  }, [])
  return null
}
