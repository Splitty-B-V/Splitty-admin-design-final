import { useState, useEffect } from 'react'
import Layout from '../components/Layout'

export default function DebugStorage() {
  const [storageData, setStorageData] = useState({})
  
  useEffect(() => {
    // Get all localStorage data
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('onboarding_')) {
        try {
          data[key] = JSON.parse(localStorage.getItem(key))
        } catch (e) {
          data[key] = localStorage.getItem(key)
        }
      }
    }
    setStorageData(data)
  }, [])
  
  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F] p-8">
        <h1 className="text-2xl font-bold text-white mb-6">Debug: Onboarding Storage Data</h1>
        
        <div className="space-y-4">
          {Object.entries(storageData).map(([key, value]) => (
            <div key={key} className="bg-[#1c1e27] p-4 rounded-lg border border-[#2a2d3a]">
              <h2 className="text-lg font-semibold text-[#2BE89A] mb-2">{key}</h2>
              <pre className="text-sm text-white overflow-auto">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
          
          {Object.keys(storageData).length === 0 && (
            <p className="text-[#BBBECC]">No onboarding data found in localStorage</p>
          )}
        </div>
        
        <div className="mt-8">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#2BE89A] text-black rounded-lg"
          >
            Refresh
          </button>
        </div>
      </div>
    </Layout>
  )
}