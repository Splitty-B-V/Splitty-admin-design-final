import { useState } from 'react'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import { useRestaurants } from '../../contexts/RestaurantsContext'
import { useTheme } from '../../contexts/ThemeContext'
import {
  MagnifyingGlassIcon,
  ArrowDownTrayIcon,
  BanknotesIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  BuildingStorefrontIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyEuroIcon,
  ChartBarIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline'

export default function Payouts() {
  const { darkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const { restaurants } = useRestaurants()

  // Generate payouts dynamically based on FULLY ONBOARDED active restaurants only
  const generatePayoutsForRestaurants = () => {
    const basePayouts = []
    // Only include restaurants that are active, not deleted, AND fully onboarded
    const activeRestaurants = restaurants.filter(r => !r.deleted && r.isOnboarded)
    
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
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
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
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'} mb-1`}>Restaurant Uitbetalingen</h1>
                <p className={`${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Compleet overzicht van alle restaurant uitbetalingen en transacties</p>
              </div>
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]" : "p-3 rounded-lg bg-green-100"}>
                    <ChartBarIcon className={darkMode ? "h-6 w-6 text-black" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>TOTAAL UITBETALINGEN</p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{filteredPayouts.length}</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-[#2BE89A]/20" : "p-3 rounded-lg bg-green-100"}>
                    <CheckCircleIcon className={darkMode ? "h-6 w-6 text-[#2BE89A]" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>UITBETAALD</p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{formatCurrency(totalPaid)}</p>
                  </div>
                </div>
              </div>
              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-yellow-500/20" : "p-3 rounded-lg bg-yellow-100"}>
                    <ClockIcon className={darkMode ? "h-6 w-6 text-yellow-400" : "h-6 w-6 text-yellow-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>IN BEHANDELING</p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>{formatCurrency(totalPending)}</p>
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
                    <BuildingLibraryIcon className={darkMode ? "h-6 w-6 text-blue-400" : "h-6 w-6 text-blue-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>RESTAURANTS</p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {new Set(filteredPayouts.map(p => p.restaurantId)).size}
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
                      <MagnifyingGlassIcon className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`block w-full pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                          : 'bg-[#F9FAFB] border border-gray-200 text-[#111827] placeholder-gray-500 focus:ring-green-500 focus:border-transparent hover:border-gray-300'
                      }`}
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
                    className={`block w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 cursor-pointer transition ${
                      darkMode
                        ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white focus:ring-[#2BE89A] focus:border-transparent'
                        : 'bg-[#F9FAFB] border border-gray-200 text-[#111827] focus:ring-green-500 focus:border-transparent hover:border-gray-300'
                    }`}
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
                  className={`rounded-lg transition-all ${
                    darkMode
                      ? 'bg-[#1c1e27] border border-[#2a2d3a] hover:border-[#3a3d4a]'
                      : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className={`text-base font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {payout.restaurant}
                        </h3>
                        <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {payout.id}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        payout.status === 'paid'
                          ? darkMode 
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-green-50 text-green-700'
                          : darkMode
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-yellow-50 text-yellow-700'
                      }`}>
                        {payout.status === 'paid' ? (
                          <>
                            <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                            Uitbetaald
                          </>
                        ) : (
                          <>
                            <ClockIcon className="h-3.5 w-3.5 mr-1" />
                            In Behandeling
                          </>
                        )}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Bedrag
                        </p>
                        <p className={`text-lg font-semibold mt-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {formatCurrency(payout.amount)}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Periode
                        </p>
                        <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {payout.period}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Bestellingen
                        </p>
                        <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {payout.ordersCount}
                        </p>
                      </div>
                      
                      <div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Bankrekening
                        </p>
                        <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {payout.bankAccount}
                        </p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className={`mt-4 pt-4 border-t flex items-center justify-between ${
                      darkMode ? 'border-[#2a2d3a]' : 'border-gray-200'
                    }`}>
                      <div className="flex items-center gap-4 text-xs">
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          Aangemaakt: {formatDate(payout.created)}
                        </span>
                        <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                          Verwacht: {formatDate(payout.arrival)}
                        </span>
                      </div>
                      
                      <Link
                        href={`/payments/payouts/${payout.id}`}
                        className={`text-sm font-medium transition-colors ${
                          darkMode 
                            ? 'text-green-400 hover:text-green-300'
                            : 'text-green-600 hover:text-green-700'
                        }`}
                      >
                        Details →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredPayouts.length === 0 && (
              <div className={`text-center py-16 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <BanknotesIcon className={`mx-auto h-12 w-12 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                <p className={`mt-4 ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
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