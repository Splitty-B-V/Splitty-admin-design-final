import { useState, useEffect } from 'react'
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
  TrashIcon,
  ClockIcon,
  ArrowRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const StripeIcon = () => (
  <svg className="mr-1 h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
  </svg>
)

export default function Restaurants() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all') // all, deleted, onboarding
  const [highlightedRestaurant, setHighlightedRestaurant] = useState(null)
  const { restaurants, getActiveRestaurants, getDeletedRestaurants, restoreRestaurant, deleteRestaurantPermanently } = useRestaurants()
  
  // Auto-open "All Restaurants" when page loads
  useEffect(() => {
    setStatusFilter('all')
  }, [])

  // Check for restaurant to highlight
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const restaurantId = localStorage.getItem('highlightRestaurant')
      if (restaurantId) {
        setHighlightedRestaurant(parseInt(restaurantId))
        // Remove from localStorage after reading
        localStorage.removeItem('highlightRestaurant')
        
        // Remove highlight after animation completes
        setTimeout(() => {
          setHighlightedRestaurant(null)
        }, 5000) // 5 seconds
      }
    }
  }, [])

  // Get the right set of restaurants based on status filter
  let baseRestaurants = []
  if (statusFilter === 'deleted') {
    baseRestaurants = getDeletedRestaurants()
  } else if (statusFilter === 'onboarding') {
    baseRestaurants = getActiveRestaurants().filter(r => !r.isOnboarded)
  } else {
    // For 'all' filter, show all active restaurants
    baseRestaurants = getActiveRestaurants()
  }
  
  // Sort restaurants by creation date (newest first)
  const sortedRestaurants = [...baseRestaurants].sort((a, b) => {
    const dateA = new Date(a.created)
    const dateB = new Date(b.created)
    return dateB - dateA // Newest first
  })
  
  // Legacy data mapping (can be removed when fully migrated to context)
  const restaurantsWithExtraData = sortedRestaurants.map((r, index) => ({
    ...r,
    paymentMethod: 'stripe',
    isActive: r.status === 'active',
    transactions: r.totalOrders,
    rating: 4.5 + (index * 0.1) % 0.5, // Static ratings based on index
    onboardingStep: r.onboardingStep || (r.isOnboarded ? 4 : 0),
  }))

  const filteredRestaurants = restaurantsWithExtraData.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Location filter
    const matchesLocation = selectedFilter === 'all' || 
      restaurant.location.toLowerCase().includes(selectedFilter.toLowerCase())
    
    return matchesSearch && matchesLocation
  })

  const activeRestaurants = getActiveRestaurants()
  const deletedRestaurants = getDeletedRestaurants()
  const onboardingRestaurants = activeRestaurants.filter(r => !r.isOnboarded)
  
  const stats = [
    { label: 'Totaal Partners', value: activeRestaurants.length, icon: BuildingStorefrontIcon, color: 'from-[#2BE89A] to-[#4FFFB0]', filter: 'all' },
    { label: 'Gearchiveerd', value: deletedRestaurants.length, icon: TrashIcon, color: 'from-red-500 to-red-600', filter: 'deleted' },
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.map((stat, index) => (
                <button
                  key={index}
                  onClick={() => setStatusFilter(stat.filter)}
                  className={`bg-[#1c1e27] rounded-xl p-6 border transition-all duration-200 text-left w-full ${
                    statusFilter === stat.filter
                      ? 'border-[#2BE89A] shadow-lg shadow-[#2BE89A]/20'
                      : 'border-[#2a2d3a] hover:border-[#2BE89A]/50 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#BBBECC] text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </button>
              ))}

              {/* Onboarding Notification as 4th card */}
              {onboardingRestaurants.length > 0 ? (
                <button
                  onClick={() => setStatusFilter('onboarding')}
                  className="bg-[#1c1e27] rounded-xl p-6 border transition-all duration-200 text-left border-[#FF6B6B]/30 hover:border-[#FF6B6B]/50 hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#FF6B6B] text-sm font-medium">Setup Vereist</p>
                      <p className="text-2xl font-bold text-white mt-1">{onboardingRestaurants.length}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53]">
                      <ClockIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </button>
              ) : (
                <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] text-left">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#BBBECC] text-sm">Alles Up-to-Date</p>
                      <p className="text-2xl font-bold text-white mt-1">✓</p>
                    </div>
                    <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              {/* Search Header */}
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-[#BBBECC]" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-12 pr-4 py-4 bg-[#0A0B0F] border border-[#2a2d3a] rounded-xl text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent text-lg"
                      placeholder="Zoek restaurants op naam of locatie..."
                    />
                  </div>
                  
                  {/* Location Filter */}
                  <div className="relative lg:w-64">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className="appearance-none w-full bg-[#0A0B0F] border border-[#2a2d3a] text-white pl-4 pr-10 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2BE89A] cursor-pointer"
                    >
                      <option value="all">Alle Locaties</option>
                      <option value="amsterdam">Amsterdam</option>
                      <option value="rotterdam">Rotterdam</option>
                      <option value="utrecht">Utrecht</option>
                      <option value="den haag">Den Haag</option>
                      <option value="eindhoven">Eindhoven</option>
                      <option value="zaandam">Zaandam</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-[#BBBECC]" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`group bg-[#1c1e27] rounded-xl border transition-all duration-200 overflow-hidden flex flex-col ${
                    highlightedRestaurant === restaurant.id
                      ? 'animate-pulse border-[#2BE89A] shadow-lg shadow-[#2BE89A]/50 ring-2 ring-[#2BE89A] ring-offset-4 ring-offset-[#0F1117]'
                      : restaurant.deleted
                      ? 'border-[#2a2d3a]/60 hover:border-[#2a2d3a] bg-[#1c1e27]/60'
                      : !restaurant.isOnboarded
                      ? 'border-[#FF6B6B]/30 hover:border-[#FF6B6B]/50'
                      : !restaurant.isActive 
                      ? 'border-[#2a2d3a] opacity-60 hover:border-[#2BE89A]/50' 
                      : 'border-[#2a2d3a] hover:border-[#2BE89A]/50'
                  }`}
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-16 w-16 relative rounded-xl overflow-hidden bg-[#0A0B0F]">
                          {restaurant.logo ? (
                            restaurant.logo.startsWith('blob:') || restaurant.logo.startsWith('data:') ? (
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
                          ? 'bg-[#2a2d3a]/50'
                          : !restaurant.isOnboarded
                          ? 'bg-[#FF6B6B]/20'
                          : restaurant.isActive 
                          ? 'bg-[#2BE89A]/20' 
                          : 'bg-yellow-500/20'
                      }`}>
                        {restaurant.deleted ? (
                          <TrashIcon className="h-5 w-5 text-[#BBBECC]" />
                        ) : !restaurant.isOnboarded ? (
                          <ClockIcon className="h-5 w-5 text-[#FF6B6B]" />
                        ) : restaurant.isActive ? (
                          <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-yellow-400" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      {!restaurant.isOnboarded ? (
                        <>
                          {(() => {
                            // Get actual progress from localStorage
                            const savedData = typeof window !== 'undefined' 
                              ? localStorage.getItem(`onboarding_${restaurant.id}`)
                              : null;
                            const parsedData = savedData ? JSON.parse(savedData) : null;
                            const completedSteps = parsedData?.completedSteps || [];
                            const actualProgress = completedSteps.length;
                            
                            return (
                              <>
                                <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 border border-[#FF6B6B]/30 rounded-lg p-3 mb-3">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                      <ClockIcon className="h-4 w-4 text-[#FF6B6B] mr-1.5" />
                                      <p className="text-xs font-semibold text-[#FF6B6B]">
                                        Setup Vereist
                                      </p>
                                    </div>
                                    <span className="text-xs text-white font-medium">
                                      {actualProgress}/4
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Onboarding Progress */}
                                <div className="mb-3">
                                  <div className="w-full bg-[#0A0B0F] rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] h-1.5 rounded-full transition-all duration-300"
                                      style={{ width: `${(actualProgress / 4) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              </>
                            );
                          })()}
                          
                          <div className="bg-[#0A0B0F] rounded-lg p-2.5 border border-[#2a2d3a]">
                            <p className="text-xs text-[#BBBECC]">
                              {restaurant.onboardingStep === 0 ? 'Start met: ' : 'Volgende: '}
                              <span className="text-white font-medium ml-1">
                                {(() => {
                                  // Check if there's saved onboarding data
                                  const savedData = typeof window !== 'undefined' 
                                    ? localStorage.getItem(`onboarding_${restaurant.id}`)
                                    : null;
                                  const parsedData = savedData ? JSON.parse(savedData) : null;
                                  const currentStep = parsedData?.currentStep || 1;
                                  const completedSteps = parsedData?.completedSteps || [];
                                  
                                  // Determine actual step based on saved data
                                  if (parsedData) {
                                    if (currentStep === 1 && !completedSteps.includes(1)) return 'Personeel toevoegen';
                                    if (currentStep === 2 && !completedSteps.includes(2)) return 'Stripe koppelen';
                                    if (currentStep === 3 && !completedSteps.includes(3)) return 'POS configureren';
                                    if (currentStep === 4 && !completedSteps.includes(4)) return 'Reviews instellen';
                                    if (completedSteps.length === 4) return 'Afronden';
                                  }
                                  
                                  // Fallback to onboardingStep
                                  if (restaurant.onboardingStep === 0) return 'Personeel toevoegen';
                                  if (restaurant.onboardingStep === 1) return 'Stripe koppelen';
                                  if (restaurant.onboardingStep === 2) return 'POS configureren';
                                  if (restaurant.onboardingStep === 3) return 'Reviews instellen';
                                  return 'Afronden';
                                })()}
                              </span>
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-[#0A0B0F] rounded-lg p-3">
                              <p className="text-xs text-[#BBBECC]">Omzet</p>
                              <p className="text-sm font-semibold text-white">{restaurant.revenue}</p>
                            </div>
                            <div className="bg-[#0A0B0F] rounded-lg p-3">
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
                        </>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-[#2a2d3a] bg-[#0A0B0F] px-6 py-3">
                    {restaurant.deleted ? (
                      <>
                        <Link
                          href={restaurant.isOnboarded ? `/restaurants/${restaurant.id}` : `/restaurants/${restaurant.id}/onboarding`}
                          className="block mb-3"
                        >
                          <div className="flex items-center justify-center p-2.5 bg-[#2a2d3a]/50 rounded-lg hover:bg-[#2a2d3a]/80 transition-colors border border-[#2a2d3a]">
                            <span className="text-sm font-medium text-white">
                              {restaurant.isOnboarded ? 'Bekijk gearchiveerd profiel' : 'Bekijk onboarding voortgang'}
                            </span>
                            <svg className="h-4 w-4 text-white ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </Link>
                        <div className="flex items-center justify-between">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              restoreRestaurant(restaurant.id)
                            }}
                            className="flex items-center px-3 py-1.5 bg-[#2BE89A]/20 text-[#2BE89A] text-xs font-medium rounded-lg hover:bg-[#2BE89A]/30 transition-colors"
                          >
                            <ArrowPathIcon className="h-4 w-4 mr-1.5" />
                            Herstellen
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              if (confirm(`Weet je zeker dat je "${restaurant.name}" permanent wilt verwijderen? Dit kan niet ongedaan worden gemaakt.`)) {
                                deleteRestaurantPermanently(restaurant.id)
                              }
                            }}
                            className="flex items-center px-3 py-1.5 bg-red-500/20 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <TrashIcon className="h-4 w-4 mr-1.5" />
                            Permanent verwijderen
                          </button>
                        </div>
                      </>
                    ) : (
                      <Link
                        href={`/restaurants/${restaurant.id}`}
                        className="flex items-center justify-between"
                      >
                        <span className={`text-sm font-medium ${
                          highlightedRestaurant === restaurant.id && !restaurant.isOnboarded
                            ? 'text-[#2BE89A] animate-pulse'
                            : !restaurant.isOnboarded 
                            ? 'text-[#FF6B6B]' 
                            : 'text-[#2BE89A]'
                        }`}>
                          {highlightedRestaurant === restaurant.id && !restaurant.isOnboarded
                            ? '✨ Start nu de setup! →'
                            : !restaurant.isOnboarded 
                            ? 'Start Onboarding →'
                            : 'Bekijk details →'
                          }
                        </span>
                        <svg className={`h-4 w-4 ${
                          highlightedRestaurant === restaurant.id && !restaurant.isOnboarded
                            ? 'text-[#2BE89A] animate-pulse'
                            : !restaurant.isOnboarded 
                            ? 'text-[#FF6B6B]' 
                            : 'text-[#2BE89A]'
                        } group-hover:translate-x-1 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRestaurants.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                {statusFilter === 'deleted' ? (
                  <>
                    <TrashIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                    <p className="mt-4 text-[#BBBECC]">
                      Je hebt nog geen restaurants verwijderd!
                    </p>
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}