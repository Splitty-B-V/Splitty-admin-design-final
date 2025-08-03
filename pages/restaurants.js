import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  UserGroupIcon,
  StarIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const StripeIcon = () => (
  <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
  </svg>
)

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('')
  const [showInactive, setShowInactive] = useState(false)
  const [showDeleted, setShowDeleted] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const { restaurants } = useRestaurants()

  // Legacy data mapping (can be removed when fully migrated to context)
  const restaurantsWithExtraData = restaurants.map((r, index) => ({
    ...r,
    paymentMethod: 'stripe',
    isActive: r.status === 'active',
    transactions: r.totalOrders,
    rating: 4.5 + (index * 0.1) % 0.5, // Static ratings based on index
  }))

  const filteredRestaurants = restaurantsWithExtraData.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesActive = showInactive || restaurant.isActive
    const matchesDeleted = showDeleted ? restaurant.deleted : !restaurant.deleted
    return matchesSearch && matchesActive && matchesDeleted
  })

  const stats = [
    { label: 'Totaal Restaurants', value: restaurants.filter(r => !r.deleted).length, icon: BuildingStorefrontIcon, color: 'from-[#2BE89A] to-[#4FFFB0]' },
    { label: 'Actieve Restaurants', value: restaurants.filter(r => r.status === 'active' && !r.deleted).length, icon: CheckCircleIcon, color: 'from-[#4ECDC4] to-[#44A08D]' },
    { label: 'Totale Omzet', value: '€89,850', icon: ChartBarIcon, color: 'from-[#667EEA] to-[#764BA2]' },
    { label: 'Gem. Rating', value: '4.6', icon: StarIcon, color: 'from-[#FF6B6B] to-[#FF8E53]' },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Restaurants' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Restaurant Partners</h1>
                <p className="text-[#BBBECC] mt-1">Beheer al je restaurant partners en hun prestaties</p>
              </div>
              <Link
                href="/restaurants/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nieuw Restaurant
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#BBBECC] text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              {/* Search Header */}
              <div className="p-6 pb-4">
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
                    className="block w-full pl-12 pr-4 py-4 bg-[#0F1117] border border-[#2a2d3a] rounded-xl text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent text-lg"
                    placeholder="Zoek restaurants op naam of locatie..."
                  />
                </div>
              </div>
              
              {/* Filter Options */}
              <div className="px-6 pb-6 border-t border-[#2a2d3a] pt-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Location Filter */}
                  <select
                    value={selectedFilter}
                    onChange={(e) => setSelectedFilter(e.target.value)}
                    className="bg-[#0F1117] border border-[#2a2d3a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A] flex-1"
                  >
                    <option value="all">Alle Locaties</option>
                    <option value="amsterdam">Amsterdam</option>
                    <option value="rotterdam">Rotterdam</option>
                    <option value="utrecht">Utrecht</option>
                    <option value="denhaag">Den Haag</option>
                    <option value="eindhoven">Eindhoven</option>
                  </select>
                  
                  {/* Filter Toggles */}
                  <div className="flex gap-4 items-center">
                    <label className="flex items-center cursor-pointer group">
                      <input
                        id="show-inactive"
                        name="show-inactive"
                        type="checkbox"
                        checked={showInactive}
                        onChange={(e) => setShowInactive(e.target.checked)}
                        className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0F1117]"
                      />
                      <span className="ml-2 text-sm text-[#BBBECC] group-hover:text-white transition">
                        Toon inactieve
                      </span>
                    </label>
                    
                    <div className="h-4 w-px bg-[#2a2d3a]" />
                    
                    <label className="flex items-center cursor-pointer group">
                      <input
                        id="show-deleted"
                        name="show-deleted"
                        type="checkbox"
                        checked={showDeleted}
                        onChange={(e) => setShowDeleted(e.target.checked)}
                        className="h-4 w-4 text-red-500 focus:ring-red-500 border-[#2a2d3a] rounded bg-[#0F1117]"
                      />
                      <span className="ml-2 text-sm text-[#BBBECC] group-hover:text-white transition">
                        Toon verwijderde
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className={`group bg-[#1c1e27] rounded-xl border transition-all duration-200 overflow-hidden ${
                    restaurant.deleted 
                      ? 'border-red-500/30 opacity-50' 
                      : !restaurant.isActive 
                      ? 'border-[#2a2d3a] opacity-60 hover:border-[#2BE89A]/50' 
                      : 'border-[#2a2d3a] hover:border-[#2BE89A]/50'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-xl overflow-hidden bg-[#0F1117]">
                          {restaurant.logo ? (
                            restaurant.logo.startsWith('blob:') ? (
                              <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Image
                                src={restaurant.logo}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            )
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold text-xl">
                              {restaurant.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-white group-hover:text-[#2BE89A] transition-colors">
                            {restaurant.name}
                          </h3>
                          <div className="flex items-center text-sm text-[#BBBECC] mt-1">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {restaurant.location}
                          </div>
                        </div>
                      </div>
                      <div className={`p-2 rounded-full ${
                        restaurant.deleted 
                          ? 'bg-red-500/20' 
                          : restaurant.isActive 
                          ? 'bg-[#2BE89A]/20' 
                          : 'bg-yellow-500/20'
                      }`}>
                        {restaurant.deleted ? (
                          <TrashIcon className="h-5 w-5 text-red-400" />
                        ) : restaurant.isActive ? (
                          <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#0F1117] rounded-lg p-3">
                        <p className="text-xs text-[#BBBECC]">Omzet</p>
                        <p className="text-sm font-semibold text-white">{restaurant.revenue}</p>
                      </div>
                      <div className="bg-[#0F1117] rounded-lg p-3">
                        <p className="text-xs text-[#BBBECC]">Transacties</p>
                        <p className="text-sm font-semibold text-white">{restaurant.transactions}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {restaurant.paymentMethod === 'stripe' && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400">
                            <StripeIcon />
                            Stripe
                          </span>
                        )}
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#2BE89A]/20 text-[#2BE89A]">
                          {restaurant.tables} tafels
                        </span>
                      </div>
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1 text-sm text-white">{restaurant.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-[#2a2d3a] bg-[#0F1117] px-6 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#2BE89A]">Bekijk details</span>
                      <svg className="h-4 w-4 text-[#2BE89A] group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Empty State */}
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
                  Geen restaurants gevonden die aan je criteria voldoen.
                </p>
                <Link
                  href="/restaurants/new"
                  className="mt-4 inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-opacity"
                >
                  <PlusIcon className="mr-2 h-5 w-5" />
                  Voeg eerste restaurant toe
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}