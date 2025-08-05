import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
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
        return <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded':
        return 'bg-[#2BE89A]/20 text-[#2BE89A]'
      case 'failed':
        return 'bg-red-500/20 text-red-400'
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const handleExport = () => {
    console.log('Exporting payments...')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Betalingen' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Betalingen</h1>
                <p className="text-[#BBBECC] mt-1">Beheer alle betalingstransacties</p>
              </div>
              <div className="flex gap-3">
                <Link
                  href="/payments/payouts"
                  className="inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                >
                  <BanknotesIcon className="-ml-1 mr-2 h-5 w-5 text-[#BBBECC]" />
                  Bekijk Uitbetalingen
                </Link>
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                >
                  <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-[#BBBECC]" />
                  Exporteer
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                    <CreditCardIcon className="h-6 w-6 text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Betalingen</p>
                    <p className="text-2xl font-bold text-white">{filteredPayments.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#2BE89A]/20">
                    <CheckCircleIcon className="h-6 w-6 text-[#2BE89A]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Geslaagd</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredPayments.filter(p => p.status === 'succeeded').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <ChartBarIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Bedrag</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalAmount)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-500/20">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Mislukt</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredPayments.filter(p => p.status === 'failed').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label htmlFor="search" className="sr-only">
                    Zoeken
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-[#BBBECC]" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
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
                    className="block w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
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
                    className="block w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
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
            <div className="overflow-x-auto bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
              <table className="min-w-full divide-y divide-[#2a2d3a]">
                <thead className="bg-[#0A0B0F]">
                  <tr>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Betaling ID
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Bestelling
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Restaurant
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Bedrag
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Methode
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                      Datum
                    </th>
                    <th scope="col" className="relative px-6 py-4">
                      <span className="sr-only">Bekijk</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#1c1e27] divide-y divide-[#2a2d3a]">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#0A0B0F] transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                        {payment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#BBBECC]">
                        <Link
                          href={`/orders/${payment.orderId}`}
                          className="text-[#2BE89A] hover:text-[#4FFFB0] transition-colors"
                        >
                          #{payment.orderId}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                        {payment.restaurant}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-[#2BE89A]">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#BBBECC]">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                          {payment.method}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                          {getStatusIcon(payment.status)}
                          <span className="ml-1 capitalize">
                            {payment.status === 'succeeded' ? 'Geslaagd' : 
                             payment.status === 'failed' ? 'Mislukt' : 
                             'In Behandeling'}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-[#BBBECC]">
                        {formatDate(payment.created)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/payments/${payment.id}`}
                          className="text-[#2BE89A] hover:text-[#4FFFB0] transition-colors"
                        >
                          Bekijk
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Table Footer */}
              <div className="bg-[#0A0B0F] px-6 py-4 border-t border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-[#BBBECC]">
                    Toont <span className="font-medium text-white">{filteredPayments.length}</span> betalingen
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            {filteredPayments.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <CreditCardIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
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