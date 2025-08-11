import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  BuildingStorefrontIcon,
  HashtagIcon,
  CalendarIcon,
  FunnelIcon,
  UserGroupIcon,
  ArrowsRightLeftIcon,
} from '@heroicons/react/24/outline'

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [restaurantFilter, setRestaurantFilter] = useState('all')
  const { restaurants } = useRestaurants()

  // Generate splitty transactions dynamically from all restaurants
  const generateSplittyTransactions = () => {
    const transactions = []
    const activeRestaurants = restaurants.filter(r => !r.deleted)
    const now = new Date()
    
    // Generate recent transactions for each restaurant
    activeRestaurants.forEach((restaurant) => {
      const numTransactions = Math.floor(Math.random() * 8) + 2 // 2-10 transactions per restaurant
      
      for (let i = 0; i < numTransactions; i++) {
        const hoursAgo = Math.random() * 48 // Within last 48 hours
        const created = new Date(now - hoursAgo * 60 * 60 * 1000)
        const total = Math.floor(Math.random() * 200 + 20) + Math.random()
        const paidPercentage = Math.random()
        const paid = total * paidPercentage
        const remaining = total - paid
        const numGuests = Math.floor(Math.random() * 6) + 2
        
        transactions.push({
          id: `SP${restaurant.id}${i}${Math.floor(Math.random() * 1000)}`,
          restaurant: restaurant.name,
          restaurantId: restaurant.id,
          table: `Tafel ${Math.floor(Math.random() * 20) + 1}`,
          total: total,
          paid: paid,
          remaining: remaining,
          guests: numGuests,
          paidGuests: Math.floor(numGuests * paidPercentage),
          status: remaining < 0.01 ? 'completed' : 'in_progress',
          created: created,
          paymentMethod: Math.random() > 0.5 ? 'iDEAL' : 'Creditcard',
        })
      }
    })
    
    return transactions.sort((a, b) => b.created - a.created)
  }
  
  const orders = generateSplittyTransactions()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && order.status === 'in_progress') ||
      (statusFilter === 'completed' && order.status === 'completed')
    
    const matchesRestaurant =
      restaurantFilter === 'all' || order.restaurantId === parseInt(restaurantFilter)
    
    return matchesSearch && matchesStatus && matchesRestaurant
  })

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2)}`
  }

  const formatDate = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minuten geleden`
    if (diffHours < 24) return `${diffHours} uur geleden`
    if (diffDays < 7) return `${diffDays} dagen geleden`
    
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const getStatusBadge = (status, remaining, total) => {
    const progress = ((total - remaining) / total) * 100
    
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
          <CheckCircleIcon className="h-4 w-4 mr-1.5" />
          Voltooid
        </span>
      )
    }
    
    return (
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
          <ClockIcon className="h-4 w-4 mr-1.5" />
          Actief
        </span>
        <div className="w-20 rounded-full h-2 bg-gray-200">
          <div 
            className="h-2 rounded-full transition-all duration-300 bg-green-600"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-gray-600">{Math.round(progress)}%</span>
      </div>
    )
  }

  const handleRefresh = () => {
    // Force re-render by updating state
    setSearchQuery('')
    setStatusFilter('all')
    setRestaurantFilter('all')
    
    // Simulate data refresh
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  const handleExport = () => {
    console.log('Exporting orders...')
  }

  const activeCount = orders.filter(o => o.status === 'in_progress').length
  const completedCount = orders.filter(o => o.status === 'completed').length
  const totalRevenue = orders.reduce((sum, order) => sum + order.paid, 0)
  const todayTransactions = orders.filter(o => {
    const today = new Date()
    return o.created.toDateString() === today.toDateString()
  }).length
  // Calculate transaction revenue (€0.70 per split payment)
  const todayTransactionRevenue = todayTransactions * 0.70

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: "Alle Splitty's" }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827] mb-1">
                  Alle Splitty Transacties
                </h1>
                <p className="text-[#6B7280]">
                  Real-time overzicht van alle Splitty betalingen
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2.5 rounded-lg transition-all border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm"
                >
                  <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
                  Vernieuwen
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2.5 font-medium rounded-lg transition bg-green-600 text-white hover:bg-green-700 shadow-sm"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5" />
                  Exporteren
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-100">
                    <ClockIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">ACTIEVE BESTELLINGEN</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{activeCount}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-green-100">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">TRANSACTIES VANDAAG</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{todayTransactions}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-100">
                    <UserGroupIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">TOTAAL VIA SPLITTY</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{formatCurrency(totalRevenue)}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-xl bg-white shadow-sm">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-100">
                    <CurrencyEuroIcon className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-xs font-medium uppercase tracking-wider text-[#6B7280]">TRANSACTIE OMZET</p>
                    <p className="text-2xl font-bold mt-2 text-[#111827]">{formatCurrency(todayTransactionRevenue)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className={`p-6 rounded-xl ${
              false 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition bg-[#F9FAFB] border-gray-200 text-[#111827] placeholder-gray-500 focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                      placeholder="Zoek op Splitty ID, restaurant of tafel..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    className="px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300"
                  >
                    <option value="all">Alle Restaurants</option>
                    {restaurants.filter(r => !r.deleted).map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex rounded-lg p-1 bg-gray-100">
                    {[
                      { value: 'active', label: 'Actief' },
                      { value: 'completed', label: 'Voltooid' },
                      { value: 'all', label: 'Alle' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setStatusFilter(option.value)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                          statusFilter === option.value
                            ? 'bg-green-600 text-white'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Splitty ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tafel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Gasten
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Totaal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Betaald
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Tijd
                      </th>
                      <th className="relative px-6 py-4">
                        <span className="sr-only">Acties</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-green-100 rounded-lg">
                              <ArrowsRightLeftIcon className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="ml-3 text-sm font-medium text-[#111827]">{order.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BuildingStorefrontIcon className="h-5 w-5 mr-2 text-gray-500" />
                            <span className="text-sm text-[#111827]">{order.restaurant}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-[#111827]">
                          {order.table}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 mr-2 text-gray-500" />
                            <span className="text-sm text-[#111827]">{order.paidGuests}/{order.guests}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-[#111827]">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${
                            order.paid >= order.total 
                              ? 'text-green-600'
                              : 'text-yellow-600'
                          }`}>
                            {formatCurrency(order.paid)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status, order.remaining, order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <CalendarIcon className="h-4 w-4 mr-1.5" />
                            {formatDate(order.created)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex gap-2 justify-end">
                            <Link
                              href={`/restaurants/${order.restaurantId}/orders/${order.id.slice(2)}`}
                              className="text-green-600 hover:text-green-700 text-xs font-medium"
                            >
                              Order
                            </Link>
                            <span className="text-gray-300 text-xs">|</span>
                            <Link
                              href={`/restaurants/${order.restaurantId}/payments/${order.id.slice(2)}`}
                              className="text-green-600 hover:text-green-700 text-xs font-medium"
                            >
                              Betaling
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredOrders.length > 0 && (
                <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{filteredOrders.length}</span> Splitty transacties gevonden
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 rounded-xl bg-white shadow-sm">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">Geen Splitty transacties gevonden</h3>
                <p className="text-gray-600">Probeer je filters aan te passen of selecteer een ander restaurant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}