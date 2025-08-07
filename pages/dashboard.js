import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useTheme } from '../contexts/ThemeContext'
import {
  BuildingStorefrontIcon,
  UsersIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [userName, setUserName] = useState('User')
  const { darkMode } = useTheme()

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Goedemorgen')
    else if (hour < 18) setGreeting('Goedemiddag')
    else setGreeting('Goedenavond')
    
    // Get user name from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || 'User'
      setUserName(storedUserName)
    }
  }, [])

  const stats = [
    {
      title: 'OMZET',
      value: '€54,892',
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-green-600',
      chartData: [40, 45, 38, 50, 42, 65, 58, 70, 65, 80, 75, 90],
    },
    {
      title: 'RESTAURANTS',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: BuildingStorefrontIcon,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      changeColor: 'text-green-600',
      chartData: [30, 35, 40, 35, 45, 50, 48, 55, 60, 58, 65, 70],
    },
    {
      title: 'TRANSACTIES',
      value: '3,428',
      change: '+18.7%',
      trend: 'up',
      icon: ShoppingBagIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-green-600',
      chartData: [50, 55, 45, 60, 58, 65, 70, 75, 80, 85, 90, 95],
    },
    {
      title: 'WINSTMARGE',
      value: '28.4%',
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeColor: 'text-red-600',
      chartData: [80, 75, 78, 70, 72, 68, 65, 63, 60, 58, 55, 52],
    },
  ]

  const openQuotations = [
    { id: 1, restaurant: 'The Golden Fork', amount: '€2,450', date: '2 uur geleden', status: 'urgent' },
    { id: 2, restaurant: 'Bella Vista', amount: '€1,890', date: '5 uur geleden', status: 'pending' },
    { id: 3, restaurant: 'Ocean Breeze', amount: '€3,200', date: '1 dag geleden', status: 'pending' },
  ]

  const bestPerformingRestaurants = [
    { id: 1, name: 'The Urban Kitchen', revenue: '€12,450', transactions: 245, rating: 4.8 },
    { id: 2, name: 'Sunset Terrace', revenue: '€10,890', transactions: 198, rating: 4.9 },
    { id: 3, name: 'Green Garden Bistro', revenue: '€9,650', transactions: 176, rating: 4.7 },
    { id: 4, name: 'Harbor Lights', revenue: '€8,920', transactions: 165, rating: 4.6 },
    { id: 5, name: 'Mountain View Cafe', revenue: '€7,540', transactions: 142, rating: 4.8 },
  ]

  const partners = [
    { name: 'Stripe', type: 'Payment Provider', status: 'active', icon: '💳' },
    { name: 'Mollie', type: 'Payment Provider', status: 'active', icon: '💰' },
    { name: 'Lightspeed', type: 'POS Integration', status: 'active', icon: '🖥️' },
    { name: 'Square', type: 'POS Integration', status: 'pending', icon: '📱' },
  ]

  return (
    <Layout>
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'} mb-1`}>
              {greeting}, {userName}
            </h1>
            <p className={`${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'} mb-6`}>
              Hier zijn de inzichten van vandaag
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className={`px-4 py-2.5 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#1c1e27] border-[#2a2d3a] text-white' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-colors`}
              >
                <option value="all">Alle Restaurants</option>
                <option value="amsterdam">Amsterdam</option>
                <option value="rotterdam">Rotterdam</option>
                <option value="utrecht">Utrecht</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className={`px-4 py-2.5 rounded-lg border ${
                  darkMode 
                    ? 'bg-[#1c1e27] border-[#2a2d3a] text-white' 
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                } focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-colors`}
              >
                <option value="today">Vandaag</option>
                <option value="week">Deze Week</option>
                <option value="month">Deze Maand</option>
                <option value="year">Dit Jaar</option>
              </select>
            </div>
          </div>

          {/* Stats Grid - Clean White Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className={`rounded-xl p-6 transition-all duration-200 hover:shadow-md ${
                  darkMode 
                    ? 'bg-[#1c1e27] border border-[#2a2d3a]' 
                    : 'bg-white shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${darkMode ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]' : stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${darkMode ? 'text-white' : stat.iconColor}`} />
                  </div>
                  <div className={`flex items-center text-sm font-medium ${
                    darkMode 
                      ? (stat.trend === 'up' ? 'text-[#2BE89A]' : 'text-red-400')
                      : stat.changeColor
                  }`}>
                    {stat.trend === 'up' ? (
                      <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <h3 className={`text-xs font-medium mb-1 ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  {stat.title}
                </h3>
                <p className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                  {stat.value}
                </p>
                <div className="h-10 flex items-end space-x-1">
                  {stat.chartData.map((value, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t transition-all ${
                        darkMode 
                          ? 'bg-gradient-to-t from-[#2BE89A]/20 to-[#2BE89A]/50'
                          : 'bg-gradient-to-t from-emerald-100 to-emerald-200'
                      }`}
                      style={{ height: `${(value / 100) * 40}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Open Quotations - Clean White Card */}
            <div className={`rounded-xl p-6 ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]' 
                : 'bg-white shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                  Open Aanvragen
                </h2>
                <DocumentTextIcon className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
              </div>
              <div className="space-y-3">
                {openQuotations.map((quote) => (
                  <div 
                    key={quote.id} 
                    className={`rounded-lg p-4 transition-all ${
                      darkMode 
                        ? 'bg-[#0A0B0F] hover:bg-[#1a1c25]' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                        {quote.restaurant}
                      </h3>
                      {quote.status === 'urgent' && (
                        <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`font-semibold ${
                        darkMode ? 'text-[#2BE89A]' : 'text-emerald-600'
                      }`}>
                        {quote.amount}
                      </span>
                      <span className={`flex items-center ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                      }`}>
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {quote.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className={`w-full mt-4 py-2.5 font-medium rounded-lg transition-all ${
                darkMode 
                  ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black hover:opacity-90' 
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}>
                Bekijk Alle Aanvragen
              </button>
            </div>

            {/* Best Performing Restaurants - Clean White Card */}
            <div className={`lg:col-span-2 rounded-xl p-6 ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]' 
                : 'bg-white shadow-sm'
            }`}>
              <div className="flex items-center justify-between mb-5">
                <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                  Best Presterende Restaurants
                </h2>
                <StarIcon className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className={`text-left text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      <th className="pb-3 font-medium">Restaurant</th>
                      <th className="pb-3 font-medium">Omzet</th>
                      <th className="pb-3 font-medium">Transacties</th>
                      <th className="pb-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody className={darkMode ? 'text-white' : 'text-[#111827]'}>
                    {bestPerformingRestaurants.map((restaurant, index) => (
                      <tr 
                        key={restaurant.id} 
                        className={`${
                          darkMode 
                            ? 'border-t border-[#2a2d3a]' 
                            : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="py-3.5 font-medium">{restaurant.name}</td>
                        <td className={`py-3.5 font-semibold ${
                          darkMode ? 'text-[#2BE89A]' : 'text-emerald-600'
                        }`}>
                          {restaurant.revenue}
                        </td>
                        <td className="py-3.5">{restaurant.transactions}</td>
                        <td className="py-3.5">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium">{restaurant.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Partners Section - Clean White Cards */}
          <div className={`mt-6 rounded-xl p-6 ${
            darkMode 
              ? 'bg-[#1c1e27] border border-[#2a2d3a]' 
              : 'bg-white shadow-sm'
          }`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                Partners & Integraties
              </h2>
              <UserGroupIcon className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className={`rounded-lg p-4 transition-all ${
                    darkMode 
                      ? 'bg-[#0A0B0F] hover:bg-[#1a1c25]' 
                      : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{partner.icon}</span>
                    <div>
                      <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                        {partner.name}
                      </h3>
                      <p className={`text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                        {partner.type}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    partner.status === 'active' 
                      ? darkMode 
                        ? 'bg-[#2BE89A]/20 text-[#2BE89A]' 
                        : 'bg-green-100 text-green-700'
                      : darkMode
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      partner.status === 'active' 
                        ? darkMode ? 'bg-[#2BE89A]' : 'bg-green-600'
                        : darkMode ? 'bg-yellow-400' : 'bg-orange-600'
                    }`} />
                    {partner.status === 'active' ? 'Actief' : 'In afwachting'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}