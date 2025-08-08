import { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useRestaurants } from '../contexts/RestaurantsContext'
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
  BanknotesIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [userName, setUserName] = useState('User')
  const { restaurants } = useRestaurants()

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

  // Calculate real data from restaurants
  const activeRestaurants = restaurants?.filter(r => !r.deleted) || []
  
  // Generate simple daily data for the last 7 days (less data for performance)
  const generateDailyData = () => {
    const data = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Generate realistic daily data
      const baseOrders = Math.floor(Math.random() * 50) + 150 // 150-200 orders per day
      const avgOrderValue = Math.random() * 10 + 40 // €40-50 per order
      const dailyTurnover = baseOrders * avgOrderValue
      
      data.push({
        date: date.toLocaleDateString('nl-NL', { month: 'short', day: 'numeric' }),
        orders: baseOrders,
        turnover: dailyTurnover,
      })
    }
    
    return data
  }

  const dailyData = generateDailyData()
  
  // Calculate totals
  const totalTurnover = dailyData.reduce((sum, day) => sum + day.turnover, 0)
  const totalOrders = dailyData.reduce((sum, day) => sum + day.orders, 0)
  const avgOrderValue = totalTurnover / totalOrders
  const activeRestaurantsCount = activeRestaurants.length

  // Calculate additional metrics
  const totalUsers = 17 // Based on your example
  const currentUsers = 17 // All users active
  const targetOrders = 155 // Target order count
  const currentOrders = 14 // Current orders
  const targetPayments = 10 // Target payment count  
  const currentPayments = 8 // Current payments
  const serviceFees = totalTurnover * 0.027 // 2.7% service fee
  const totalRestaurantsTarget = 11 // Target restaurant count

  // Splitty admin panel styled cards
  const stats = [
    {
      title: 'Totale Omzet',
      value: formatCurrency(totalTurnover),
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-green-600',
      description: 'Deze maand'
    },
    {
      title: 'Actieve Restaurants',
      value: activeRestaurantsCount,
      subValue: `van ${totalRestaurantsTarget} totaal`,
      change: `${Math.round((activeRestaurantsCount / totalRestaurantsTarget) * 100)}%`,
      trend: 'progress',
      icon: BuildingStorefrontIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-emerald-600',
      progressValue: (activeRestaurantsCount / totalRestaurantsTarget) * 100,
      progressColor: 'bg-emerald-500',
      description: 'Onboarding voortgang'
    },
    {
      title: 'Team Leden',
      value: currentUsers,
      subValue: `van ${totalUsers} actief`,
      change: '100%',
      trend: 'progress',
      icon: UsersIcon,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      changeColor: 'text-green-600',
      progressValue: (currentUsers / totalUsers) * 100,
      progressColor: 'bg-teal-500',
      description: 'Alle teamleden actief'
    },
    {
      title: 'Bestellingen',
      value: totalOrders.toLocaleString(),
      change: '+18.7%',
      trend: 'up',
      icon: ShoppingBagIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-green-600',
      description: 'Deze week'
    },
    {
      title: 'Betalingen Verwerkt',
      value: currentPayments,
      subValue: `van ${targetPayments} lopend`,
      change: `${Math.round((currentPayments / targetPayments) * 100)}%`,
      trend: 'progress',
      icon: CreditCardIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeColor: 'text-orange-600',
      progressValue: (currentPayments / targetPayments) * 100,
      progressColor: 'bg-orange-500',
      description: 'Betalings status'
    },
    {
      title: 'Splitty Revenue',
      value: formatCurrency(serviceFees),
      change: '+15.3%',
      trend: 'up',
      icon: BanknotesIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-green-600',
      description: 'Service fees'
    },
    {
      title: 'Gemiddelde Bestelling',
      value: formatCurrency(avgOrderValue),
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      changeColor: 'text-red-600',
      description: 'Per transactie'
    },
  ]

  const openQuotations = [
    { id: 1, restaurant: 'The Golden Fork', amount: '€2,450', date: '2 uur geleden', status: 'urgent' },
    { id: 2, restaurant: 'Bella Vista', amount: '€1,890', date: '5 uur geleden', status: 'pending' },
    { id: 3, restaurant: 'Ocean Breeze', amount: '€3,200', date: '1 dag geleden', status: 'pending' },
  ]

  const bestPerformingRestaurants = activeRestaurants.slice(0, 5).map((restaurant, index) => ({
    id: restaurant.id,
    name: restaurant.name,
    revenue: formatCurrency((index + 1) * 2450 + Math.random() * 1000),
    transactions: Math.floor(Math.random() * 100) + 150,
    rating: (4.5 + Math.random() * 0.4).toFixed(1)
  }))

  const partners = [
    { name: 'Stripe', type: 'Payment Provider', status: 'active', icon: '💳' },
    { name: 'Mollie', type: 'Payment Provider', status: 'active', icon: '💰' },
    { name: 'Lightspeed', type: 'POS Integration', status: 'active', icon: '🖥️' },
    { name: 'Square', type: 'POS Integration', status: 'pending', icon: '📱' },
  ]

  // Find max values for chart scaling
  const maxOrders = Math.max(...dailyData.map(d => d.orders))
  const maxTurnover = Math.max(...dailyData.map(d => d.turnover))

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#111827] mb-1">
              {greeting}, {userName}
            </h1>
            <p className="text-[#6B7280] mb-6">
              Hier zijn de inzichten van vandaag
            </p>
            <div className="flex flex-wrap gap-3 items-center">
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="px-4 py-2.5 rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-colors"
              >
                <option value="all">Alle Restaurants</option>
                <option value="amsterdam">Amsterdam</option>
                <option value="rotterdam">Rotterdam</option>
                <option value="utrecht">Utrecht</option>
              </select>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2.5 rounded-lg border bg-white border-gray-200 text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-20 transition-colors"
              >
                <option value="today">Vandaag</option>
                <option value="week">Deze Week</option>
                <option value="month">Deze Maand</option>
                <option value="year">Dit Jaar</option>
              </select>
            </div>
          </div>

          {/* Splitty Admin Stats Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="rounded-xl p-6 transition-all duration-200 hover:shadow-md bg-white shadow-sm border border-gray-100"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  {stat.change && (
                    <div className={`flex items-center text-sm font-medium ${stat.changeColor}`}>
                      {stat.trend === 'up' && <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />}
                      {stat.trend === 'down' && <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />}
                      {stat.change}
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div>
                  <h3 className="text-sm font-medium text-[#6B7280] mb-1">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline space-x-2">
                    <p className="text-2xl font-bold text-[#111827]">
                      {stat.value}
                    </p>
                    {stat.subValue && (
                      <span className="text-sm text-[#6B7280] font-normal">
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                  
                  {/* Progress Bar */}
                  {stat.trend === 'progress' && (
                    <div className="mt-3">
                      <div className="w-full rounded-full h-2 bg-gray-100">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${stat.progressColor}`}
                          style={{ width: `${stat.progressValue}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {stat.description && (
                    <p className="text-xs text-[#6B7280] mt-2">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#111827]">Analytics Dashboard</h2>
              <span className="text-sm text-[#6B7280] bg-gray-50 px-3 py-1 rounded-full">
                Afgelopen 7 dagen
              </span>
            </div>
            
            {/* Analytics Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Analytics KPI Cards */}
              <div className="lg:col-span-1 space-y-4">
                {/* Weekly Revenue */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-50">
                      <CreditCardIcon className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                      +8.2%
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1 text-[#111827]">
                    {formatCurrency(totalTurnover)}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Week omzet
                  </div>
                </div>

                {/* Weekly Orders */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-teal-50">
                      <ShoppingBagIcon className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">
                      +12.5%
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1 text-[#111827]">
                    {totalOrders}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Week bestellingen
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-orange-50">
                      <ChartBarIcon className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="text-xs px-2 py-1 bg-orange-50 text-orange-700 rounded-full font-medium">
                      -2.1%
                    </div>
                  </div>
                  <div className="text-2xl font-bold mb-1 text-[#111827]">
                    {formatCurrency(avgOrderValue)}
                  </div>
                  <div className="text-sm text-[#6B7280]">
                    Gem. bestelling
                  </div>
                </div>
              </div>

              {/* Chart Section */}
              <div className="lg:col-span-3">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#111827]">
                        Dagelijkse Prestaties
                      </h3>
                      <p className="text-sm text-[#6B7280] mt-1">
                        Bestellingen en omzet trend
                      </p>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-emerald-500 rounded mr-2" />
                        <span className="text-[#6B7280]">Bestellingen</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-teal-500 rounded mr-2" />
                        <span className="text-[#6B7280]">Omzet</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Chart */}
                  <div className="h-64 relative">
                    <div className="h-full flex items-end justify-between space-x-3 px-4">
                      {dailyData.map((day, index) => {
                        const orderHeight = Math.max((day.orders / maxOrders) * 200, 8)
                        const turnoverHeight = Math.max((day.turnover / maxTurnover) * 200, 8)
                        
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center group">
                            <div className="w-full flex justify-center space-x-2 mb-3 relative">
                              {/* Orders Bar */}
                              <div className="relative">
                                <div 
                                  className="bg-emerald-500 w-6 rounded-t-lg transition-all duration-300 group-hover:bg-emerald-600 shadow-sm"
                                  style={{ height: `${orderHeight}px` }}
                                />
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                  {day.orders} bestellingen
                                </div>
                              </div>
                              
                              {/* Turnover Bar */}
                              <div className="relative">
                                <div 
                                  className="bg-teal-500 w-6 rounded-t-lg transition-all duration-300 group-hover:bg-teal-600 shadow-sm"
                                  style={{ height: `${turnoverHeight}px` }}
                                />
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                  {formatCurrency(day.turnover)}
                                </div>
                              </div>
                            </div>
                            <div className="text-xs text-[#6B7280] font-medium">
                              {day.date}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Open Quotations - Clean White Card */}
            <div className="rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Open Aanvragen
                </h2>
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {openQuotations.map((quote) => (
                  <div 
                    key={quote.id} 
                    className="rounded-lg p-4 transition-all bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#111827]">
                        {quote.restaurant}
                      </h3>
                      {quote.status === 'urgent' && (
                        <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-emerald-600">
                        {quote.amount}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {quote.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 font-medium rounded-lg transition-all bg-emerald-600 text-white hover:bg-emerald-700">
                Bekijk Alle Aanvragen
              </button>
            </div>

            {/* Best Performing Restaurants - Clean White Card */}
            <div className="lg:col-span-2 rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Best Presterende Restaurants
                </h2>
                <StarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-[#6B7280]">
                      <th className="pb-3 font-medium">Restaurant</th>
                      <th className="pb-3 font-medium">Omzet</th>
                      <th className="pb-3 font-medium">Transacties</th>
                      <th className="pb-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#111827]">
                    {bestPerformingRestaurants.map((restaurant, index) => (
                      <tr 
                        key={restaurant.id} 
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="py-3.5 font-medium">{restaurant.name}</td>
                        <td className="py-3.5 font-semibold text-emerald-600">
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
          <div className="mt-6 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#111827]">
                Partners & Integraties
              </h2>
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="rounded-lg p-4 transition-all bg-gray-50 hover:bg-gray-100 border border-gray-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{partner.icon}</span>
                    <div>
                      <h3 className="font-medium text-[#111827]">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {partner.type}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    partner.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      partner.status === 'active' 
                        ? 'bg-green-600'
                        : 'bg-orange-600'
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