import Link from 'next/link'
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

export default function Breadcrumb({ items }) {
  return (
    <nav className="mb-5" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 flex-shrink-0 text-gray-600" />
            {index === items.length - 1 ? (
              <span className="ml-1 font-medium text-white" aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className="ml-1 text-gray-400 hover:text-white transition-colors duration-200"
              >
                {item.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}