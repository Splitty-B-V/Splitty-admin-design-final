import Link from 'next/link'

export default function Custom404() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-splitty mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-4">Page Not Found</h2>
        <p className="text-xl text-gray-300 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-splitty hover:bg-splitty-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-splitty"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  )
}