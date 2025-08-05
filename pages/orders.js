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
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30">
          <CheckCircleIcon className="h-4 w-4 mr-1.5" />
          Voltooid
        </span>
      )
    }
    
    return (
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
          <ClockIcon className="h-4 w-4 mr-1.5" />
          Actief
        </span>
        <div className="w-20 bg-[#0A0B0F] rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-[#BBBECC]">{Math.round(progress)}%</span>
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
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: "Alle Splitty's" }]} />

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Alle Splitty Transacties</h1>
                <p className="text-[#BBBECC] mt-1">Real-time overzicht van alle Splitty betalingen</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-2 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white hover:bg-[#2a2d3a] transition"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Vernieuwen
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                >
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Exporteren
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Restaurant Bestellingen</p>
                    <p className="text-2xl font-bold text-white mt-1">{activeCount}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
                    <ClockIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Transacties Vandaag</p>
                    <p className="text-2xl font-bold text-white mt-1">{todayTransactions}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                    <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Totaal via Splitty</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Transactie Omzet</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(todayTransactionRevenue)}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-lg">
                    <CurrencyEuroIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-[#BBBECC]" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="Zoek op Splitty ID, restaurant of tafel..."
                    />
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select
                    value={restaurantFilter}
                    onChange={(e) => setRestaurantFilter(e.target.value)}
                    className="px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                  >
                    <option value="all">Alle Restaurants</option>
                    {restaurants.filter(r => !r.deleted).map(restaurant => (
                      <option key={restaurant.id} value={restaurant.id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                  <div className="flex bg-[#0A0B0F] rounded-lg p-1">
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
                            ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black'
                            : 'text-[#BBBECC] hover:text-white'
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
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#0A0B0F] border-b border-[#2a2d3a]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Splitty ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Tafel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Gasten
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Totaal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Betaald
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Tijd
                      </th>
                      <th className="relative px-6 py-4">
                        <span className="sr-only">Acties</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2d3a]">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-[#0A0B0F] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                              <ArrowsRightLeftIcon className="h-4 w-4 text-black" />
                            </div>
                            <span className="ml-3 text-sm font-medium text-white">{order.id}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BuildingStorefrontIcon className="h-5 w-5 text-[#BBBECC] mr-2" />
                            <span className="text-sm text-white">{order.restaurant}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                          {order.table}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <UserGroupIcon className="h-4 w-4 text-[#BBBECC] mr-2" />
                            <span className="text-sm text-white">{order.paidGuests}/{order.guests}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-semibold text-white">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${order.paid >= order.total ? 'text-[#2BE89A]' : 'text-yellow-400'}`}>
                            {formatCurrency(order.paid)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(order.status, order.remaining, order.total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-[#BBBECC]">
                            <CalendarIcon className="h-4 w-4 mr-1.5" />
                            {formatDate(order.created)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            href={`/orders/${order.id}`}
                            className="inline-flex items-center px-3 py-1.5 bg-[#0A0B0F] text-[#2BE89A] border border-[#2BE89A]/30 rounded-lg hover:bg-[#2BE89A]/10 transition"
                          >
                            Bekijk
                            <svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredOrders.length > 0 && (
                <div className="bg-[#0A0B0F] px-6 py-4 border-t border-[#2a2d3a]">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#BBBECC]">
                      <span className="font-medium text-white">{filteredOrders.length}</span> Splitty transacties gevonden
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] p-12 text-center">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-[#BBBECC] mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Geen Splitty transacties gevonden</h3>
                <p className="text-[#BBBECC]">Probeer je filters aan te passen of selecteer een ander restaurant</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}