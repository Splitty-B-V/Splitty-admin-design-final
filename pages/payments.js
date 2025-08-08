import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useTheme } from '../contexts/ThemeContext'
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline'

export default function Payments() {
  const { darkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateRange, setDateRange] = useState('last30days')

  const payments = [
    {
      id: 'pay_1N8K9L2eZvKYlo',
      orderId: 223,
      restaurant: 'Limon B.V.',
      amount: 3.9,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-20T11:49:00'),
    },
    {
      id: 'pay_2M7J8K1dYuJXkn',
      orderId: 257,
      restaurant: 'Limon B.V.',
      amount: 12.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T17:51:00'),
    },
    {
      id: 'pay_3L6I7J0cXtIWjm',
      orderId: 247,
      restaurant: 'Limon B.V.',
      amount: 38.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T13:02:00'),
    },
    {
      id: 'pay_4K5H6I9bWsHVil',
      orderId: 272,
      restaurant: 'Limon B.V.',
      amount: 43.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-03T12:28:00'),
    },
    {
      id: 'pay_5J4G5H8aVrGUhk',
      orderId: 191,
      restaurant: 'Limon B.V.',
      amount: 7.4,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-13T14:58:00'),
    },
    {
      id: 'pay_6I3F4G7zUqFTgj',
      orderId: 292,
      restaurant: 'Limon B.V.',
      amount: 114.3,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-03T20:11:00'),
    },
    {
      id: 'pay_7H2E3F6yTpESfi',
      orderId: 216,
      restaurant: 'Limon B.V.',
      amount: 48.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-19T13:51:00'),
    },
    {
      id: 'pay_8G1D2E5xSoDReh',
      orderId: 179,
      restaurant: 'Limon B.V.',
      amount: 6.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-27T18:05:00'),
    },
    {
      id: 'pay_9F0C1D4wRnCQdg',
      orderId: 178,
      restaurant: 'Limon B.V.',
      amount: 39.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-27T17:19:00'),
    },
    {
      id: 'pay_0E9B0C3vQmBPcf',
      orderId: 251,
      restaurant: 'Limon B.V.',
      amount: 7.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-01T14:54:00'),
    },
    {
      id: 'pay_1D8A9B2uPlAObe',
      orderId: 306,
      restaurant: 'Limon B.V.',
      amount: 115.0,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-04T20:34:00'),
    },
    {
      id: 'pay_2C7Z8A1tOkZNad',
      orderId: 315,
      restaurant: 'Limon B.V.',
      amount: 70.1,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-09T23:06:00'),
    },
    {
      id: 'pay_3B6Y7Z0sNjYMzc',
      orderId: 185,
      restaurant: 'Viresh Kewalbansing',
      amount: 48.8,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-06-11T10:10:00'),
    },
    {
      id: 'pay_4A5X6Y9rMiXLyb',
      orderId: 257,
      restaurant: 'Limon B.V.',
      amount: 9.0,
      method: 'stripe',
      status: 'pending',
      created: new Date('2025-07-10T14:30:00'),
    },
    {
      id: 'pay_5Z4W5X8qLhWKxa',
      orderId: 233,
      restaurant: 'Viresh Kewalbansing',
      amount: 1.5,
      method: 'stripe',
      status: 'failed',
      created: new Date('2025-06-25T15:45:00'),
    },
    {
      id: 'pay_6Y3V4W7pKgVJwz',
      orderId: 176,
      restaurant: 'Limon B.V.',
      amount: 22.5,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-05-26T10:15:00'),
    },
    {
      id: 'pay_7X2U3V6oJfUIvy',
      orderId: 330,
      restaurant: 'Limon B.V.',
      amount: 10.3,
      method: 'stripe',
      status: 'pending',
      created: new Date('2025-07-15T16:20:00'),
    },
    {
      id: 'pay_8W1T2U5nIeTHux',
      orderId: 339,
      restaurant: 'Limon B.V.',
      amount: 24.7,
      method: 'stripe',
      status: 'succeeded',
      created: new Date('2025-07-30T21:00:00'),
    },
  ]

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.orderId.toString().includes(searchQuery) ||
      payment.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    
    // Date range filter
    const now = new Date()
    const paymentDate = new Date(payment.created)
    let matchesDate = true
    
    if (dateRange === 'today') {
      matchesDate = paymentDate.toDateString() === now.toDateString()
    } else if (dateRange === 'last7days') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      matchesDate = paymentDate >= weekAgo
    } else if (dateRange === 'last30days') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      matchesDate = paymentDate >= monthAgo
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const totalAmount = filteredPayments
    .filter(p => p.status === 'succeeded')
    .reduce((sum, payment) => sum + payment.amount, 0)

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2).replace('.', ',')}`
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircleIcon className={`h-4 w-4 ${darkMode ? 'text-[#2BE89A]' : 'text-green-500'}`} />
      case 'failed':
        return <XCircleIcon className={`h-4 w-4 ${darkMode ? 'text-red-400' : 'text-red-500'}`} />
      case 'pending':
        return <ClockIcon className={`h-4 w-4 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return darkMode ? 'bg-[#2BE89A]/10 text-[#2BE89A]' : 'bg-green-50 text-green-700'
      case 'failed':
        return darkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700'
      case 'pending':
        return darkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
      default:
        return darkMode ? 'bg-gray-500/10 text-gray-400' : 'bg-gray-100 text-gray-700'
    }
  }

  const handleExport = () => {
    console.log('Exporting payments...')
  }

  return (
    <Layout>
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Betalingen' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'} mb-1`}>
                  Betalingen
                </h1>
                <p className={`${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  Beheer alle betalingstransacties
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/payments/payouts"
                  className={`inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    darkMode 
                      ? 'border border-[#2a2d3a] text-white bg-[#1c1e27] hover:bg-[#252833]'
                      : 'border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <BanknotesIcon className={`-ml-1 mr-2 h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                  Bekijk Uitbetalingen
                </Link>
                <button
                  type="button"
                  onClick={handleExport}
                  className={`inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                    darkMode 
                      ? 'border border-[#2a2d3a] text-white bg-[#1c1e27] hover:bg-[#252833]'
                      : 'border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <ArrowDownTrayIcon className={`-ml-1 mr-2 h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                  Exporteer
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]" : "p-3 rounded-lg bg-green-100"}>
                    <CreditCardIcon className={darkMode ? "h-6 w-6 text-black" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      TOTAAL BETALINGEN
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {filteredPayments.length}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-[#2BE89A]/20" : "p-3 rounded-lg bg-green-50"}>
                    <CheckCircleIcon className={darkMode ? "h-6 w-6 text-[#2BE89A]" : "h-6 w-6 text-green-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      GESLAAGD
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {filteredPayments.filter(p => p.status === 'succeeded').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-blue-500/20" : "p-3 rounded-lg bg-blue-100"}>
                    <ChartBarIcon className={darkMode ? "h-6 w-6 text-blue-400" : "h-6 w-6 text-blue-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      TOTAAL BEDRAG
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {formatCurrency(totalAmount)}
                    </p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-red-500/20" : "p-3 rounded-lg bg-red-50"}>
                    <ExclamationTriangleIcon className={darkMode ? "h-6 w-6 text-red-400" : "h-6 w-6 text-red-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      MISLUKT
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {filteredPayments.filter(p => p.status === 'failed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className={`p-6 rounded-xl ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Zoeken
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className={`h-5 w-5 ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-400'
                      }`} />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`block w-full pl-12 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                          : 'bg-[#F9FAFB] border-gray-200 text-[#111827] placeholder-gray-500 focus:ring-green-500 focus:border-transparent hover:border-gray-300'
                      }`}
                      placeholder="Zoek op betaling ID, bestelling ID, of restaurant..."
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <select
                    id="status"
                    name="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition ${
                      darkMode
                        ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
                        : 'bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300'
                    }`}
                  >
                    <option value="all">Alle Statussen</option>
                    <option value="succeeded">Geslaagd</option>
                    <option value="pending">In Behandeling</option>
                    <option value="failed">Mislukt</option>
                  </select>
                  <select
                    id="dateRange"
                    name="dateRange"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className={`block w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 cursor-pointer transition ${
                      darkMode
                        ? 'bg-[#0A0B0F] border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
                        : 'bg-[#F9FAFB] border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300'
                    }`}
                  >
                    <option value="today">Vandaag</option>
                    <option value="last7days">Afgelopen 7 Dagen</option>
                    <option value="last30days">Afgelopen 30 Dagen</option>
                    <option value="all">Alle Tijd</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payments Table */}
            <div className={`overflow-x-auto rounded-xl ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <table className="min-w-full divide-y ${darkMode ? 'divide-[#2a2d3a]' : 'divide-gray-200'}">
                <thead className={darkMode ? 'bg-[#0A0B0F]' : 'bg-gray-50'}>
                  <tr>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Betaling ID
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Bestelling
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Restaurant
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Bedrag
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Methode
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Status
                    </th>
                    <th scope="col" className={`px-6 py-4 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      Datum
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Bekijk</span>
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'bg-[#1c1e27] divide-[#2a2d3a]' : 'bg-white divide-gray-200'}`}>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className={`transition-colors ${
                      darkMode ? 'hover:bg-[#0A0B0F]' : 'hover:bg-gray-50'
                    }`}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/orders/${payment.orderId}`}
                          className={`transition-colors ${
                            darkMode ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          #{payment.orderId}
                        </Link>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {payment.restaurant}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        darkMode ? 'text-[#2BE89A]' : 'text-green-600'
                      }`}>
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                          darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status === 'succeeded' ? 'Geslaagd' : 
                             payment.status === 'failed' ? 'Mislukt' : 
                             'In Behandeling'}
                          </span>
                        </span>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                      }`}>
                        {formatDate(payment.created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/payments/${payment.id}`}
                          className={`transition-colors ${
                            darkMode ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                          }`}
                        >
                          Bekijk
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Table Footer */}
              <div className={`px-6 py-4 border-t ${
                darkMode 
                  ? 'bg-[#0A0B0F] border-[#2a2d3a]'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div className={`text-sm ${
                    darkMode ? 'text-[#BBBECC]' : 'text-gray-600'
                  }`}>
                    Toont <span className={`font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>{filteredPayments.length}</span> betalingen
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className={`text-center py-16 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <CreditCardIcon className={`mx-auto h-12 w-12 ${
                  darkMode ? 'text-[#BBBECC]' : 'text-gray-400'
                }`} />
                <p className={`mt-4 ${
                  darkMode ? 'text-[#BBBECC]' : 'text-gray-600'
                }`}>
                  Geen betalingen gevonden die voldoen aan je criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}