import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  ClockIcon,
  UserGroupIcon,
  CurrencyEuroIcon,
  TableCellsIcon,
  ChartBarIcon,
  BuildingStorefrontIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export default function Tables() {
  const [searchQuery, setSearchQuery] = useState('')
  const { restaurants } = useRestaurants()

  // Generate active tables for each restaurant
  const generateActiveTables = () => {
    const tables = []
    const activeRestaurants = restaurants.filter(r => !r.deleted)
    
    activeRestaurants.forEach(restaurant => {
      // Generate random number of active tables per restaurant
      const numActiveTables = Math.floor(Math.random() * 8) + 2
      
      for (let i = 0; i < numActiveTables; i++) {
        const tableNumber = Math.floor(Math.random() * 50) + 1
        const guests = Math.floor(Math.random() * 8) + 1
        const amount = Math.floor(Math.random() * 300) + 20 + Math.random()
        const paidPercentage = Math.random()
        const remaining = amount * (1 - paidPercentage)
        const durationMinutes = Math.floor(Math.random() * 180) + 15
        const durationHours = Math.floor(durationMinutes / 60)
        const durationMins = durationMinutes % 60
        
        tables.push({
          id: `T-${restaurant.id}-${tableNumber}`,
          restaurant: restaurant.name,
          restaurantId: restaurant.id,
          tableNumber: tableNumber.toString(),
          guests: guests,
          orderId: Math.floor(Math.random() * 1000) + 100,
          amount: amount,
          remaining: remaining,
          duration: durationHours > 0 ? `${durationHours}h ${durationMins}m` : `${durationMins}m`,
          status: 'active',
          lastActivity: new Date(Date.now() - durationMinutes * 60 * 1000),
        })
      }
    })
    
    return tables
  }
  
  const activeTables = generateActiveTables()
  
  // Group tables by restaurant
  const tablesByRestaurant = activeTables.reduce((acc, table) => {
    if (!acc[table.restaurantId]) {
      acc[table.restaurantId] = {
        restaurant: table.restaurant,
        restaurantId: table.restaurantId,
        tables: []
      }
    }
    acc[table.restaurantId].tables.push(table)
    return acc
  }, {})
  
  const oldActiveTables = [
    {
      id: 'T-1001',
      restaurant: 'Limon B.V.',
      tableNumber: '1001',
      guests: 4,
      orderId: 330,
      amount: 147.15,
      remaining: 136.85,
      duration: '2h 15m',
      status: 'active',
      lastActivity: new Date('2025-07-15T13:38:00'),
    },
    {
      id: 'T-1002',
      restaurant: 'Limon B.V.',
      tableNumber: '1002',
      guests: 2,
      orderId: 295,
      amount: 63.6,
      remaining: 63.6,
      duration: '45m',
      status: 'active',
      lastActivity: new Date('2025-07-04T09:32:00'),
    },
    {
      id: 'T-806',
      restaurant: 'Limon B.V.',
      tableNumber: '806',
      guests: 8,
      orderId: 296,
      amount: 480.10,
      remaining: 480.10,
      duration: '1h 30m',
      status: 'active',
      lastActivity: new Date('2025-07-04T09:45:00'),
    },
    {
      id: 'T-808',
      restaurant: 'Limon B.V.',
      tableNumber: '808',
      guests: 6,
      orderId: 176,
      amount: 141.5,
      remaining: 119.0,
      duration: '3h 10m',
      status: 'active',
      lastActivity: new Date('2025-05-25T23:21:00'),
    },
    {
      id: 'T-811',
      restaurant: 'Limon B.V.',
      tableNumber: '811',
      guests: 3,
      orderId: 231,
      amount: 67.8,
      remaining: 67.8,
      duration: '1h 05m',
      status: 'active',
      lastActivity: new Date('2025-06-24T13:45:00'),
    },
    {
      id: 'T-324',
      restaurant: 'Limon B.V.',
      tableNumber: '324',
      guests: 12,
      orderId: 334,
      amount: 439.50,
      remaining: 439.50,
      duration: '2h 45m',
      status: 'active',
      lastActivity: new Date('2025-07-30T16:29:00'),
    },
    {
      id: 'T-412',
      restaurant: 'Limon B.V.',
      tableNumber: '412',
      guests: 5,
      orderId: 339,
      amount: 176.20,
      remaining: 151.50,
      duration: '1h 20m',
      status: 'active',
      lastActivity: new Date('2025-07-30T20:17:00'),
    },
    {
      id: 'T-222',
      restaurant: 'Limon B.V.',
      tableNumber: '222',
      guests: 2,
      orderId: 340,
      amount: 30.0,
      remaining: 30.0,
      duration: '30m',
      status: 'active',
      lastActivity: new Date('2025-07-30T21:49:00'),
    },
    {
      id: 'T-6',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '6',
      guests: 4,
      orderId: 341,
      amount: 48.8,
      remaining: 48.8,
      duration: '50m',
      status: 'active',
      lastActivity: new Date('2025-07-31T00:42:00'),
    },
    {
      id: 'T-8',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '8',
      guests: 3,
      orderId: 345,
      amount: 48.8,
      remaining: 48.8,
      duration: '25m',
      status: 'active',
      lastActivity: new Date('2025-07-31T15:45:00'),
    },
    {
      id: 'T-5',
      restaurant: 'Anatolii Restaurant',
      tableNumber: '5',
      guests: 6,
      orderId: 337,
      amount: 123.40,
      remaining: 123.40,
      duration: '1h 15m',
      status: 'active',
      lastActivity: new Date('2025-07-30T18:33:00'),
    },
    {
      id: 'T-50',
      restaurant: 'Viresh Kewalbansing',
      tableNumber: '50',
      guests: 2,
      orderId: 233,
      amount: 35.75,
      remaining: 34.25,
      duration: '40m',
      status: 'active',
      lastActivity: new Date('2025-06-25T13:41:00'),
    },
    {
      id: 'T-1004',
      restaurant: 'Limon B.V.',
      tableNumber: '1004',
      guests: 3,
      orderId: 257,
      amount: 21.8,
      remaining: 9.0,
      duration: '55m',
      status: 'active',
      lastActivity: new Date('2025-07-01T17:51:00'),
    },
    {
      id: 'T-435',
      restaurant: 'Limon B.V.',
      tableNumber: '435',
      guests: 4,
      orderId: 317,
      amount: 43.20,
      remaining: 43.20,
      duration: '35m',
      status: 'active',
      lastActivity: new Date('2025-07-10T12:58:00'),
    },
  ]

  const filteredRestaurants = Object.values(tablesByRestaurant).filter(group => {
    const matchesSearch = 
      group.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.tables.some(table => 
        table.tableNumber.includes(searchQuery) ||
        table.orderId.toString().includes(searchQuery)
      )
    return matchesSearch
  })

  const formatCurrency = (amount) => {
    return `€${amount.toFixed(2).replace('.', ',')}`
  }

  const getStatusColor = (remaining, total) => {
    const percentage = (remaining / total) * 100
    if (percentage === 100) return 'bg-yellow-500/20 text-yellow-400'
    if (percentage > 50) return 'bg-orange-500/20 text-orange-400'
    return 'bg-[#2BE89A]/20 text-[#2BE89A]'
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Actieve Tafels' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Actieve Tafels</h1>
                <p className="text-[#BBBECC] mt-1">Overzicht van alle actieve tafels per restaurant</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
              >
                <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-[#BBBECC]" />
                Ververs
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                    <TableCellsIcon className="h-6 w-6 text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Actieve Tafels</p>
                    <p className="text-2xl font-bold text-white">{activeTables.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <UserGroupIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Gasten</p>
                    <p className="text-2xl font-bold text-white">
                      {activeTables.reduce((sum, table) => sum + table.guests, 0)}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <ChartBarIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Bedrag</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(activeTables.reduce((sum, table) => sum + table.amount, 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-yellow-500/20">
                    <CurrencyEuroIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Nog Te Betalen</p>
                    <p className="text-2xl font-bold text-white">
                      {formatCurrency(activeTables.reduce((sum, table) => sum + table.remaining, 0))}
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
                      placeholder="Zoek op restaurant, tafel nummer, of bestelling ID..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurants with Active Tables */}
            <div className="space-y-6">
              {filteredRestaurants.map((group) => (
                <div key={group.restaurantId} className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                  <div className="p-6 border-b border-[#2a2d3a]">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BuildingStorefrontIcon className="h-6 w-6 text-[#2BE89A] mr-3" />
                        <div>
                          <h2 className="text-xl font-bold text-white">{group.restaurant}</h2>
                          <p className="text-sm text-[#BBBECC]">{group.tables.length} actieve tafels</p>
                        </div>
                      </div>
                      <Link
                        href={`/restaurants/${group.restaurantId}`}
                        className="inline-flex items-center px-4 py-2 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white hover:bg-[#1a1c25] transition"
                      >
                        Restaurant Profiel
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {group.tables.map((table) => (
                        <div
                          key={table.id}
                          className="bg-[#0A0B0F] rounded-xl border border-[#2a2d3a] overflow-hidden hover:border-[#2BE89A]/30 transition-all duration-200"
                        >
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-white">
                                  Tafel {table.tableNumber}
                                </h3>
                                <p className="text-sm text-[#BBBECC]">{table.restaurant}</p>
                              </div>
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                  table.remaining,
                                  table.amount
                                )}`}
                              >
                                {table.remaining === table.amount ? 'Onbetaald' : 'Gedeeltelijk'}
                              </span>
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm">
                                <span className="text-[#BBBECC]">Bestelling #</span>
                                <span className="text-white font-medium">{table.orderId}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#BBBECC]">Gasten</span>
                                <span className="text-white font-medium">{table.guests}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#BBBECC]">Bedrag</span>
                                <span className="text-white font-medium">{formatCurrency(table.amount)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#BBBECC]">Resterend</span>
                                <span className="text-yellow-400 font-medium">
                                  {formatCurrency(table.remaining)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-[#BBBECC]">Duur</span>
                                <span className="text-white font-medium flex items-center">
                                  <ClockIcon className="h-4 w-4 mr-1" />
                                  {table.duration}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-[#2a2d3a]">
                              <Link
                                href={`/orders/${table.orderId}`}
                                className="w-full inline-flex justify-center items-center px-4 py-2.5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
                              >
                                Bekijk Bestelling
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <TableCellsIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
                  Geen actieve tafels gevonden die voldoen aan je criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}