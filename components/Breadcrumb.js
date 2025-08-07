import Link from 'next/link'
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useTheme } from '../contexts/ThemeContext'

export default function Breadcrumb({ items }) {
  const { darkMode } = useTheme()
  
  return (
    <nav className="mb-5" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 text-sm">
        <li>
          <Link
            href="/dashboard"
            className={`${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors duration-200`}
          >
            <HomeIcon className="h-4 w-4" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={item.name} className="flex items-center">
            <ChevronRightIcon className={`h-4 w-4 flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
            {index === items.length - 1 ? (
              <span className={`ml-1 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`} aria-current="page">
                {item.name}
              </span>
            ) : (
              <Link
                href={item.href}
                className={`ml-1 ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors duration-200`}
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