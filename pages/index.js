import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.push('/login')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Redirecting...</h1>
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-splitty border-t-transparent animate-spin"></div>
      </div>
    </div>
  )
}