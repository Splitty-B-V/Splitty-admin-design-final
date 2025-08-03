import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
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
} from '@heroicons/react/24/outline'

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('active')

  const orders = [
    { id: 257, restaurant: 'Limon B.V.', table: 'Table 1004', total: 21.8, remaining: 9.0, status: 'in_progress', created: new Date('2025-07-01T17:51:00') },
    { id: 317, restaurant: 'Limon B.V.', table: 'Table 435', total: 43.2, remaining: 43.2, status: 'in_progress', created: new Date('2025-07-10T12:58:00') },
    { id: 233, restaurant: 'Viresh Kewalbansing', table: 'Table 5', total: 35.75, remaining: 34.25, status: 'in_progress', created: new Date('2025-06-25T13:41:00') },
    { id: 295, restaurant: 'Limon B.V.', table: 'Table 1002', total: 63.6, remaining: 63.6, status: 'in_progress', created: new Date('2025-07-04T09:32:00') },
    { id: 296, restaurant: 'Limon B.V.', table: 'Table 806', total: 480.10, remaining: 480.10, status: 'in_progress', created: new Date('2025-07-04T09:45:00') },
    { id: 176, restaurant: 'Limon B.V.', table: 'Table 808', total: 141.5, remaining: 119.0, status: 'in_progress', created: new Date('2025-05-25T23:21:00') },
    { id: 341, restaurant: 'Anatolii Restaurant', table: 'Table 6', total: 48.8, remaining: 48.8, status: 'in_progress', created: new Date('2025-07-31T00:42:00') },
    { id: 231, restaurant: 'Limon B.V.', table: 'Table 811', total: 67.8, remaining: 67.8, status: 'in_progress', created: new Date('2025-06-24T13:45:00') },
    { id: 334, restaurant: 'Limon B.V.', table: 'Table 324', total: 439.50, remaining: 439.50, status: 'in_progress', created: new Date('2025-07-30T16:29:00') },
    { id: 340, restaurant: 'Limon B.V.', table: 'Table 222', total: 30.0, remaining: 30.0, status: 'in_progress', created: new Date('2025-07-30T21:49:00') },
    { id: 345, restaurant: 'Anatolii Restaurant', table: 'Table 8', total: 48.8, remaining: 48.8, status: 'in_progress', created: new Date('2025-07-31T15:45:00') },
    { id: 337, restaurant: 'Anatolii Restaurant', table: 'Table 5', total: 123.4, remaining: 123.4, status: 'in_progress', created: new Date('2025-07-30T18:33:00') },
    { id: 339, restaurant: 'Limon B.V.', table: 'Table 412', total: 176.20, remaining: 151.50, status: 'in_progress', created: new Date('2025-07-30T20:17:00') },
    { id: 330, restaurant: 'Limon B.V.', table: 'Table 1001', total: 147.15, remaining: 136.85, status: 'in_progress', created: new Date('2025-07-15T13:38:00') },
    { id: 343, restaurant: 'Anatolii Restaurant', table: 'Table 8', total: 48.8, remaining: 0, status: 'completed', created: new Date('2025-07-31T11:16:00') },
    { id: 344, restaurant: 'Anatolii Restaurant', table: 'Table 8', total: 48.8, remaining: 0, status: 'completed', created: new Date('2025-07-31T15:17:00') },
  ]

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toString().includes(searchQuery) ||
      order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && order.status === 'in_progress') ||
      (statusFilter === 'completed' && order.status === 'completed')
    
    return matchesSearch && matchesStatus
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
        <div className="w-20 bg-[#0F1117] rounded-full h-2">
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
    console.log('Refreshing orders...')
  }

  const handleExport = () => {
    console.log('Exporting orders...')
  }

  const activeCount = orders.filter(o => o.status === 'in_progress').length
  const completedCount = orders.filter(o => o.status === 'completed').length
  const totalRevenue = orders.reduce((sum, order) => sum + (order.total - order.remaining), 0)

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Bestellingen' }]} />

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Bestellingen</h1>
                <p className="text-[#BBBECC] mt-1">Beheer alle restaurant bestellingen</p>
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
                    <p className="text-[#BBBECC] text-sm">Actieve Bestellingen</p>
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
                    <p className="text-[#BBBECC] text-sm">Voltooid Vandaag</p>
                    <p className="text-2xl font-bold text-white mt-1">{completedCount}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                    <CheckCircleIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Totaal Bestellingen</p>
                    <p className="text-2xl font-bold text-white mt-1">{orders.length}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                    <HashtagIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#BBBECC] text-sm">Omzet Vandaag</p>
                    <p className="text-2xl font-bold text-white mt-1">{formatCurrency(totalRevenue)}</p>
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
                      className="block w-full pl-10 pr-3 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="Zoek op bestelnummer, restaurant of tafel..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-[#BBBECC]" />
                  <div className="flex bg-[#0F1117] rounded-lg p-1">
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
                  <thead className="bg-[#0F1117] border-b border-[#2a2d3a]">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Bestelnr
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Restaurant
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Tafel
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Totaal
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Openstaand
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
                      <tr key={order.id} className="hover:bg-[#0F1117] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                              <HashtagIcon className="h-4 w-4 text-white" />
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
                          <span className="text-sm font-semibold text-white">{formatCurrency(order.total)}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`text-sm font-semibold ${order.remaining > 0 ? 'text-orange-400' : 'text-[#2BE89A]'}`}>
                            {formatCurrency(order.remaining)}
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
                            className="inline-flex items-center px-3 py-1.5 bg-[#0F1117] text-[#2BE89A] border border-[#2BE89A]/30 rounded-lg hover:bg-[#2BE89A]/10 transition"
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
                <div className="bg-[#0F1117] px-6 py-4 border-t border-[#2a2d3a]">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#BBBECC]">
                      <span className="font-medium text-white">{filteredOrders.length}</span> bestellingen gevonden
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredOrders.length === 0 && (
              <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] p-12 text-center">
                <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-[#BBBECC] mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Geen bestellingen gevonden</h3>
                <p className="text-[#BBBECC]">Probeer je zoekfilters aan te passen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}