import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import { useRestaurants } from '../../contexts/RestaurantsContext'
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

export default function Payouts() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { restaurants } = useRestaurants()

  // Generate payouts dynamically based on active restaurants
  const generatePayoutsForRestaurants = () => {
    const basePayouts = []
    const activeRestaurants = restaurants.filter(r => !r.deleted)
    
    // Use restaurant ID as seed for consistent random values
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000
      return x - Math.floor(x)
    }
    
    activeRestaurants.forEach((restaurant, index) => {
      const seed = restaurant.id
      
      // Generate only the most recent payout for each restaurant
      const amount = Math.floor(seededRandom(seed) * 2500 + 500) + (seededRandom(seed + 1) * 99) / 100
      basePayouts.push({
        id: `po_${restaurant.id}_${Math.floor(seededRandom(seed + 20) * 100000)}`,
        restaurant: restaurant.name,
        restaurantId: restaurant.id,
        amount: amount,
        bankAccount: `****${Math.floor(1000 + seededRandom(seed + 2) * 9000)}`,
        status: index < 2 ? 'pending' : 'paid',
        created: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000)),
        arrival: new Date(Date.now() - (index * 2 * 24 * 60 * 60 * 1000) + (2 * 24 * 60 * 60 * 1000)),
        ordersCount: Math.floor(seededRandom(seed + 3) * 40 + 5),
        period: '26 jul - 1 aug',
      })
    })
    
    return basePayouts.sort((a, b) => b.created - a.created)
  }

  const payouts = generatePayoutsForRestaurants()

  const filteredPayouts = payouts.filter((payout) => {
    const matchesSearch =
      payout.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payout.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const totalPaid = filteredPayouts
    .filter(p => p.status === 'paid')
    .reduce((sum, payout) => sum + payout.amount, 0)

  const totalPending = filteredPayouts
    .filter(p => p.status === 'pending')
    .reduce((sum, payout) => sum + payout.amount, 0)

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2).replace('.', ',')}`
  }

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  const handleExport = () => {
    console.log('Exporting payouts...')
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { name: 'Betalingen', href: '/payments' },
                { name: 'Uitbetalingen' },
              ]}
            />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Uitbetalingen</h1>
                <p className="text-[#BBBECC] mt-1">Beheer restaurant uitbetalingen en transacties</p>
              </div>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
              >
                <ArrowDownTrayIcon className="-ml-1 mr-2 h-5 w-5 text-[#BBBECC]" />
                Exporteer
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                    <ChartBarIcon className="h-6 w-6 text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Uitbetalingen</p>
                    <p className="text-2xl font-bold text-white">{filteredPayouts.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#2BE89A]/20">
                    <CheckCircleIcon className="h-6 w-6 text-[#2BE89A]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Uitbetaald</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalPaid)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-500/20">
                    <ClockIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">In Behandeling</p>
                    <p className="text-2xl font-bold text-white">{formatCurrency(totalPending)}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <BuildingLibraryIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Restaurants</p>
                    <p className="text-2xl font-bold text-white">
                      {new Set(filteredPayouts.map(p => p.restaurantId)).size}
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
                      className="block w-full pl-12 pr-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="Zoek op uitbetaling ID of restaurant..."
                    />
                  </div>
                </div>
                <div>
                  <select
                    id="status"
                    name="status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="block w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                  >
                    <option value="all">Alle Statussen</option>
                    <option value="paid">Uitbetaald</option>
                    <option value="pending">In Behandeling</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payouts List */}
            <div className="space-y-4">
              {filteredPayouts.map((payout) => (
                <div
                  key={payout.id}
                  className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden hover:border-[#2BE89A]/30 transition-all duration-200 group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-[#2BE89A] transition-colors">
                          {payout.restaurant}
                        </h3>
                        <p className="text-sm text-[#BBBECC]">{payout.id}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          payout.status === 'paid'
                            ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {payout.status === 'paid' ? (
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ClockIcon className="h-4 w-4 mr-1" />
                        )}
                        {payout.status === 'paid' ? 'Uitbetaald' : 'In Behandeling'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-[#0F1117] rounded-lg p-3 border border-[#2a2d3a]">
                        <p className="text-sm text-[#BBBECC] mb-1">Bedrag</p>
                        <p className="text-xl font-bold text-[#2BE89A]">{formatCurrency(payout.amount)}</p>
                      </div>
                      <div className="bg-[#0F1117] rounded-lg p-3 border border-[#2a2d3a]">
                        <p className="text-sm text-[#BBBECC] mb-1">Periode</p>
                        <p className="text-sm text-white font-medium">{payout.period}</p>
                      </div>
                      <div className="bg-[#0F1117] rounded-lg p-3 border border-[#2a2d3a]">
                        <p className="text-sm text-[#BBBECC] mb-1">Bestellingen</p>
                        <p className="text-sm text-white font-medium">{payout.ordersCount} bestellingen</p>
                      </div>
                      <div className="bg-[#0F1117] rounded-lg p-3 border border-[#2a2d3a]">
                        <p className="text-sm text-[#BBBECC] mb-1">Bankrekening</p>
                        <p className="text-sm text-white font-medium">{payout.bankAccount}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#2a2d3a] flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center text-[#BBBECC]">
                          <CalendarIcon className="h-4 w-4 mr-1" />
                          Aangemaakt: {formatDate(payout.created)}
                        </div>
                        <div className="flex items-center text-[#BBBECC]">
                          <BanknotesIcon className="h-4 w-4 mr-1" />
                          Aankomst: {formatDate(payout.arrival)}
                        </div>
                      </div>
                      <Link
                        href={`/payments/payouts/${payout.id}`}
                        className="text-[#2BE89A] hover:text-[#4FFFB0] text-sm font-medium transition-colors"
                      >
                        Bekijk Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPayouts.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <BanknotesIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
                  Geen uitbetalingen gevonden die voldoen aan je criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}