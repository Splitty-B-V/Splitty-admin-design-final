import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
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
      gradient: 'from-[#2BE89A] to-[#4FFFB0]',
      chartData: [40, 45, 38, 50, 42, 65, 58, 70, 65, 80, 75, 90],
    },
    {
      title: 'RESTAURANTS',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: BuildingStorefrontIcon,
      gradient: 'from-[#FF6B6B] to-[#FF8E53]',
      chartData: [30, 35, 40, 35, 45, 50, 48, 55, 60, 58, 65, 70],
    },
    {
      title: 'TRANSACTIES',
      value: '3,428',
      change: '+18.7%',
      trend: 'up',
      icon: ShoppingBagIcon,
      gradient: 'from-[#4ECDC4] to-[#44A08D]',
      chartData: [50, 55, 45, 60, 58, 65, 70, 75, 80, 85, 90, 95],
    },
    {
      title: 'WINSTMARGE',
      value: '28.4%',
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      gradient: 'from-[#667EEA] to-[#764BA2]',
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
      <div className="min-h-screen bg-[#0A0B0F]">

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {greeting} {userName} - Hier zijn de inzichten van vandaag
            </h1>
            <div className="flex flex-wrap gap-4 items-center">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="bg-[#1c1e27] border border-[#2a2d3a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A]"
              >
                <option value="all">Alle Restaurants</option>
                <option value="amsterdam">Amsterdam</option>
                <option value="rotterdam">Rotterdam</option>
                <option value="utrecht">Utrecht</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#1c1e27] border border-[#2a2d3a] text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A]"
              >
                <option value="today">Vandaag</option>
                <option value="week">Deze Week</option>
                <option value="month">Deze Maand</option>
                <option value="year">Dit Jaar</option>
              </select>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.gradient}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-[#2BE89A]' : 'text-red-400'}`}>
                    {stat.trend === 'up' ? <ArrowTrendingUpIcon className="h-4 w-4 mr-1" /> : <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                    {stat.change}
                  </div>
                </div>
                <h3 className="text-[#BBBECC] text-sm mb-1">{stat.title}</h3>
                <p className="text-2xl font-bold text-white mb-3">{stat.value}</p>
                <div className="h-12 flex items-end space-x-1">
                  {stat.chartData.map((value, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-gradient-to-t from-[#2BE89A]/20 to-[#2BE89A]/50 rounded-t"
                      style={{ height: `${(value / 100) * 48}px` }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Open Quotations */}
            <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Open Aanvragen</h2>
                <DocumentTextIcon className="h-5 w-5 text-[#BBBECC]" />
              </div>
              <div className="space-y-3">
                {openQuotations.map((quote) => (
                  <div key={quote.id} className="bg-[#0A0B0F] rounded-lg p-4 hover:bg-[#1a1c25] transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-white">{quote.restaurant}</h3>
                      {quote.status === 'urgent' && (
                        <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full">Urgent</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#2BE89A] font-semibold">{quote.amount}</span>
                      <span className="text-[#BBBECC] flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {quote.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-opacity">
                Bekijk Alle Aanvragen
              </button>
            </div>

            {/* Best Performing Restaurants */}
            <div className="lg:col-span-2 bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-white">Best Presterende Restaurants</h2>
                <StarIcon className="h-5 w-5 text-[#BBBECC]" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-[#BBBECC]">
                      <th className="pb-3">Restaurant</th>
                      <th className="pb-3">Omzet</th>
                      <th className="pb-3">Transacties</th>
                      <th className="pb-3">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="text-white">
                    {bestPerformingRestaurants.map((restaurant) => (
                      <tr key={restaurant.id} className="border-t border-[#2a2d3a]">
                        <td className="py-3">{restaurant.name}</td>
                        <td className="py-3 text-[#2BE89A] font-semibold">{restaurant.revenue}</td>
                        <td className="py-3">{restaurant.transactions}</td>
                        <td className="py-3">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                            {restaurant.rating}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Partners Section */}
          <div className="mt-6 bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Partners & Integraties</h2>
              <UserGroupIcon className="h-5 w-5 text-[#BBBECC]" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, index) => (
                <div key={index} className="bg-[#0A0B0F] rounded-lg p-4 hover:bg-[#1a1c25] transition-colors">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{partner.icon}</span>
                    <div>
                      <h3 className="font-medium text-white">{partner.name}</h3>
                      <p className="text-sm text-[#BBBECC]">{partner.type}</p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    partner.status === 'active' 
                      ? 'bg-[#2BE89A]/20 text-[#2BE89A]' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    <SparklesIcon className="h-3 w-3 mr-1" />
                    {partner.status === 'active' ? 'Actief' : 'In Afwachting'}
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