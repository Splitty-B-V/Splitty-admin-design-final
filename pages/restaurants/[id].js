import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { useRestaurants } from '../../contexts/RestaurantsContext'
import { useUsers } from '../../contexts/UsersContext'
import RestaurantDeleteModal from '../../components/RestaurantDeleteModal'
import {
  ArrowLeftIcon,
  PencilIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  UserIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ArrowTopRightOnSquareIcon,
  BuildingStorefrontIcon,
  CreditCardIcon,
  UserGroupIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  StarIcon,
  Cog6ToothIcon,
  TrashIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeSlashIcon,
  TableCellsIcon,
  PlusIcon,
  WifiIcon,
} from '@heroicons/react/24/outline'

export default function RestaurantDetail() {
  const router = useRouter()
  const { id } = router.query
  const { getRestaurant, updateRestaurant, deleteRestaurant, deleteRestaurantPermanently } = useRestaurants()
  const { getCompanyUser, authenticateUser, restaurantUsers } = useUsers()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showPermanentDeleteModal, setShowPermanentDeleteModal] = useState(false)
  const [permanentDeletePassword, setPermanentDeletePassword] = useState('')
  const [permanentDeleteName, setPermanentDeleteName] = useState('')
  const [passwordError, setPasswordError] = useState(false)
  const [nameError, setNameError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [editingGoogleReview, setEditingGoogleReview] = useState(false)
  const [googleReviewLink, setGoogleReviewLink] = useState('')
  
  // Get current user from localStorage
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  const currentUserEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
  const currentUser = currentUserId ? getCompanyUser(currentUserId) : null

  // Mock data - in a real app, this would be fetched based on the ID
  const restaurants = {
    15: {
      id: 15,
      name: 'Loetje',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569541/restaurant_logos/jpqzqbsr8yx4bmk0etby.png',
      banner: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
      address: {
        street: 'Prins Hendrikkade 21',
        postalCode: '1012TL',
        city: 'Amsterdam',
        country: 'Netherlands',
      },
      email: 'milad@splitty.nl',
      phone: '+310686232364',
      serviceFee: {
        amount: 0.7,
        type: 'flat',
      },
      stripe: {
        connected: true,
        accountId: 'acct_1Rp...',
        status: 'fully_enabled',
      },
      staff: [],
      transactions: {
        total: 0,
        thisMonth: 0,
        lastMonth: 0,
      },
      revenue: '€12,450',
      rating: 4.8,
      tables: 24,
      averageOrderValue: '€48.50',
      peakHours: '18:00 - 21:00',
    },
    16: {
      id: 16,
      name: 'Splitty',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753701510/restaurant_logos/k9up5gzm7mzv0zze1mg4.png',
      banner: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
      address: {
        street: 'Herengracht 182',
        postalCode: '1016 BR',
        city: 'Amsterdam',
        country: 'Netherlands',
      },
      email: 'contact@splitty.com',
      phone: '+31 20 123 4567',
      serviceFee: {
        amount: 0.5,
        type: 'flat',
      },
      stripe: {
        connected: true,
        accountId: 'acct_2Sq...',
        status: 'fully_enabled',
      },
      staff: [
        { id: 1, name: 'John Doe', role: 'Manager', avatar: null },
        { id: 2, name: 'Jane Smith', role: 'Waiter', avatar: null },
      ],
      transactions: {
        total: 1234,
        thisMonth: 156,
        lastMonth: 189,
      },
      revenue: '€10,890',
      rating: 4.9,
      tables: 18,
      averageOrderValue: '€52.30',
      peakHours: '19:00 - 22:00',
    },
    6: {
      id: 6,
      name: 'Limon B.V.',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1746460172/restaurant_logos/wihua9omfsnhbqbrcfji.png',
      banner: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
      address: {
        street: 'Leidseplein 12',
        postalCode: '1017 PT',
        city: 'Amsterdam',
        country: 'Netherlands',
      },
      email: 'info@limon.nl',
      phone: '+31 20 555 1234',
      serviceFee: {
        amount: 3,
        type: 'percentage',
      },
      stripe: {
        connected: true,
        accountId: 'acct_3Lm...',
        status: 'fully_enabled',
      },
      staff: [
        { id: 3, name: 'Sarah Johnson', role: 'Manager', avatar: null },
        { id: 4, name: 'Tom Bakker', role: 'Staff', avatar: null },
      ],
      transactions: {
        total: 5678,
        thisMonth: 423,
        lastMonth: 398,
      },
      revenue: '€7,540',
      rating: 4.8,
      tables: 22,
      averageOrderValue: '€45.80',
      peakHours: '17:00 - 20:00',
    },
  }

  // Get restaurant from context instead of mock data
  let contextRestaurant = getRestaurant(id)
  
  // REDIRECT TO ONBOARDING IF RESTAURANT IS NOT ONBOARDED
  useEffect(() => {
    if (contextRestaurant && !contextRestaurant.isOnboarded && id) {
      // Direct naar onboarding sturen voor nieuwe restaurants
      router.push(`/restaurants/${id}/onboarding`)
    }
  }, [contextRestaurant, id, router])
  
  // Check for saved onboarding data if restaurant exists
  let onboardingData = null
  if (contextRestaurant && !contextRestaurant.isOnboarded && typeof window !== 'undefined') {
    const savedData = localStorage.getItem(`onboarding_${id}`)
    if (savedData) {
      onboardingData = JSON.parse(savedData)
      if (onboardingData.currentStep) {
        contextRestaurant = { ...contextRestaurant, onboardingStep: onboardingData.currentStep }
      }
    }
  }
  
  // Merge with additional data needed for detail view
  const restaurant = contextRestaurant ? {
    ...contextRestaurant,
    isOnboarded: contextRestaurant.isOnboarded,
    banner: contextRestaurant.banner || 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
    address: contextRestaurant.address || {
      street: 'Prins Hendrikkade 21',
      postalCode: '1012TL',
      city: 'Amsterdam',
      country: 'Netherlands',
    },
    serviceFee: contextRestaurant.serviceFee || {
      amount: 0.7,
      type: 'percentage',
    },
    contractStart: new Date('2024-01-01'),
    stripeConnected: contextRestaurant.isOnboarded,
    stripe: {
      accountId: contextRestaurant.isOnboarded ? 'acct_1234567890' : 'Not connected',
      dashboardUrl: contextRestaurant.isOnboarded ? 'https://dashboard.stripe.com/acct_1234567890' : '#',
    },
    posIntegration: onboardingData?.posData?.posType || 'Niet gekoppeld',
    posData: onboardingData?.posData || null,
    ratings: {
      average: 0,
      count: 0,
    },
    stats: {
      totalRevenue: '€0',
      monthlyRevenue: '€0',
      totalTransactions: 0,
      activeOrders: 0,
      completionRate: 0,
      peakHours: 'N/A',
    },
    transactions: {
      recent: [],
      lastMonth: 0,
      thisMonth: 0,
      total: 0,
    },
    staff: contextRestaurant.staff || [],
    averageOrderValue: '€0',
    rating: 0,
    peakHours: 'N/A',
  } : {
    id: 15,
    name: 'Restaurant',
    location: 'Amsterdam, Netherlands',
    status: 'active',
    logo: null,
    banner: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
    email: 'info@restaurant.nl',
    phone: '+31 20 123 4567',
    tables: 20,
    revenue: '€0',
    activeOrders: 0,
    totalOrders: 0,
    address: {
      street: 'Street',
      postalCode: '1000AA',
      city: 'Amsterdam',
      country: 'Netherlands',
    },
    serviceFee: {
      amount: 0.7,
      type: 'percentage',
    },
    contractStart: new Date(),
    stripeConnected: false,
    stripe: {
      accountId: 'Not connected',
      dashboardUrl: '#',
    },
    posIntegration: 'None',
    ratings: {
      average: 0,
      count: 0,
    },
    stats: {
      totalRevenue: '€0',
      monthlyRevenue: '€0',
      totalTransactions: 0,
      activeOrders: 0,
      completionRate: 0,
      peakHours: 'N/A',
    },
    transactions: {
      recent: [],
      lastMonth: 0,
      thisMonth: 0,
      total: 0,
    },
    staff: [],
    averageOrderValue: '€0',
    rating: 0,
    peakHours: 'N/A',
  }
  
  const handleDeleteConfirm = () => {
    console.log('handleDeleteConfirm called with id:', id)
    console.log('Restaurant data:', restaurant)
    console.log('contextRestaurant:', contextRestaurant)
    deleteRestaurant(id)
    router.push('/restaurants')
  }
  
  const handlePermanentDeleteConfirm = () => {
    let hasError = false
    
    // Check restaurant name
    if (permanentDeleteName.toLowerCase() !== contextRestaurant.name.toLowerCase()) {
      setNameError(true)
      hasError = true
    }
    
    // Check password by authenticating with current user's email
    if (currentUserEmail) {
      const authResult = authenticateUser(currentUserEmail, permanentDeletePassword)
      if (!authResult) {
        setPasswordError(true)
        hasError = true
      }
    } else {
      setPasswordError(true)
      hasError = true
    }
    
    // If no errors, proceed with deletion
    if (!hasError) {
      deleteRestaurantPermanently(id)
      router.push('/restaurants')
    }
  }

  const StripeIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  )

  // Check if restaurant is fully onboarded
  const isFullyOnboarded = contextRestaurant && contextRestaurant.isOnboarded

  // Only show onboarding layout for restaurants that are NOT onboarded
  const isNotFullyOnboarded = contextRestaurant && !contextRestaurant.isOnboarded

  const quickStats = [
    { label: 'Omzet', value: '€0', icon: BanknotesIcon, color: 'from-[#2BE89A] to-[#4FFFB0]', trend: null },
    { label: 'Transacties', value: 0, icon: ShoppingBagIcon, color: 'from-[#4ECDC4] to-[#44A08D]', trend: null },
    { label: 'Gem. Order', value: '€0', icon: CreditCardIcon, color: 'from-[#667EEA] to-[#764BA2]', trend: null },
    { label: 'Rating', value: 0, icon: StarIcon, color: 'from-[#FF6B6B] to-[#FF8E53]', trend: null },
  ]

  // Generate active tables for this restaurant (memoized to prevent re-renders)
  const restaurantTables = useMemo(() => {
    if (!contextRestaurant || contextRestaurant.deleted) return []
    
    const tables = []
    const numActiveTables = Math.floor(Math.random() * 6) + 2 // 2-8 active tables
    
    for (let i = 0; i < numActiveTables; i++) {
      const tableNumber = Math.floor(Math.random() * 30) + 1
      const guests = Math.floor(Math.random() * 8) + 1
      const amount = Math.floor(Math.random() * 300) + 20 + Math.random()
      const paidPercentage = Math.random()
      const remaining = amount * (1 - paidPercentage)
      const durationMinutes = Math.floor(Math.random() * 180) + 15
      const durationHours = Math.floor(durationMinutes / 60)
      const durationMins = durationMinutes % 60
      
      tables.push({
        id: `T-${id}-${tableNumber}`,
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
    
    return tables
  }, [contextRestaurant, id])

  // Load Google Review link when restaurant changes
  useEffect(() => {
    if (contextRestaurant && contextRestaurant.googleReviewLink) {
      setGoogleReviewLink(contextRestaurant.googleReviewLink)
    }
  }, [contextRestaurant])

  const handleSaveGoogleReview = () => {
    updateRestaurant(id, { googleReviewLink: googleReviewLink })
    setEditingGoogleReview(false)
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <Link
                href="/restaurants"
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar restaurants
              </Link>
              <div className="flex gap-3">
                {contextRestaurant?.deleted ? (
                  <button
                    onClick={() => setShowPermanentDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Permanent Verwijderen
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Verwijderen
                    </button>
                    <Link
                      href={`/restaurants/${id}/edit`}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                    >
                      <PencilIcon className="h-5 w-5 mr-2" />
                      Bewerk Restaurant
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Onboarding Notification */}
            {isNotFullyOnboarded && (
              <div className="bg-gradient-to-r from-[#FF6B6B]/10 to-[#FF8E53]/10 border border-[#FF6B6B]/30 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] rounded-lg mr-4 shadow-lg">
                      <ClockIcon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[#FF6B6B] font-semibold text-lg">Onboarding niet voltooid</p>
                      <p className="text-sm text-[#BBBECC] mt-1">
                        Dit restaurant moet eerst de setup voltooien voordat het actief kan worden
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6B6B] to-[#FF8E53] text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                  >
                    <span className="mr-2">Start Onboarding</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Profile Card */}
            <div className="bg-[#1c1e27] rounded-xl overflow-hidden border border-[#2a2d3a]">
              {/* Banner */}
              <div className="relative h-32 md:h-40 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                <Image
                  src={restaurant.banner}
                  alt={`${restaurant.name} banner`}
                  fill
                  className="object-cover opacity-90"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1117] via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    contextRestaurant?.deleted
                      ? 'bg-red-600/20 text-red-400 border border-red-600/30'
                      : restaurant.status === 'active' 
                      ? 'bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    {contextRestaurant?.deleted ? (
                      <>
                        <TrashIcon className="h-3.5 w-3.5 mr-1" />
                        Gearchiveerd
                      </>
                    ) : (
                      <>
                        <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                        {restaurant.status === 'active' ? 'Actief' : 'Inactief'}
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="relative px-4 lg:px-6 pb-4">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-16">
                  <div className="flex items-end space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-24 w-24 rounded-xl overflow-hidden border-4 border-[#1c1e27] shadow-xl relative bg-white">
                        {restaurant.logo ? (
                          restaurant.logo.startsWith('blob:') || restaurant.logo.startsWith('data:') ? (
                            <img
                              src={restaurant.logo}
                              alt={`${restaurant.name} logo`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Image
                              src={restaurant.logo}
                              alt={`${restaurant.name} logo`}
                              fill
                              className="object-cover"
                              sizes="96px"
                            />
                          )
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold text-2xl">
                            {restaurant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <h1 className="text-2xl font-bold text-white">{restaurant.name}</h1>
                      <div className="flex items-center text-[#BBBECC] mt-1 text-sm">
                        <MapPinIcon className="h-4 w-4 mr-1.5" />
                        {restaurant.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 lg:mt-0">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#0A0B0F] border border-[#2a2d3a]">
                      <BuildingStorefrontIcon className="h-3.5 w-3.5 mr-1 text-[#BBBECC]" />
                      <span className="text-white">{restaurant.tables} tafels</span>
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-[#0A0B0F] border border-[#2a2d3a]">
                      <ClockIcon className="h-3.5 w-3.5 mr-1 text-[#BBBECC]" />
                      <span className="text-white">Piek: {restaurant.peakHours}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a]">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="h-4 w-4 text-white" />
                        </div>
                        {stat.trend && (
                          <span className="text-xs text-[#2BE89A] flex items-center">
                            <ArrowTrendingUpIcon className="h-2.5 w-2.5 mr-0.5" />
                            {stat.trend}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#BBBECC]">{stat.label}</p>
                      <p className="text-lg font-bold text-white mt-0.5">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            {isNotFullyOnboarded ? (
              // Onboarding layout with sidebar for restaurants
              <div className="flex h-full -mx-4 sm:-mx-6 lg:-mx-8">
                {/* Sidebar */}
                <div className="hidden lg:block w-80 bg-[#1c1e27] border-r border-[#2a2d3a]">
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold text-white mb-2">{restaurant.name}</h2>
                      <p className="text-sm text-[#BBBECC]">Restaurant Onboarding</p>
                    </div>

                    {/* Progress Overview */}
                    <div className="mb-8 bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a]">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-[#BBBECC]">Voortgang</span>
                        <span className="text-sm font-bold text-white">
                          {[
                            restaurantUsers[id]?.length > 0,
                            onboardingData?.stripeData?.connected,
                            onboardingData?.posData?.posType,
                            contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                          ].filter(Boolean).length}/4 voltooid
                        </span>
                      </div>
                      <div className="w-full bg-[#1c1e27] rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] h-2 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${([
                              restaurantUsers[id]?.length > 0,
                              onboardingData?.stripeData?.connected,
                              onboardingData?.posData?.posType,
                              contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                            ].filter(Boolean).length / 4) * 100}%` 
                          }}
                        />
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                      {/* Step 1 */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          restaurantUsers[id]?.length > 0
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25]'
                            : 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF8E53]/20 border-2 border-[#FF6B6B]'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            restaurantUsers[id]?.length > 0 ? 'bg-[#2BE89A]' : 'bg-[#1c1e27]'
                          }`}>
                            {restaurantUsers[id]?.length > 0 ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <UserGroupIcon className="h-5 w-5 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white">Personeel</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                restaurantUsers[id]?.length > 0
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {restaurantUsers[id]?.length > 0 ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">
                              {restaurantUsers[id]?.length > 0 
                                ? `${restaurantUsers[id].length} gebruikers`
                                : 'Restaurant gebruikers toevoegen'}
                            </p>
                          </div>
                        </div>
                      </button>

                      {/* Step 2 */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          onboardingData?.stripeData?.connected
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25]'
                            : 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF8E53]/20 border-2 border-[#FF6B6B]'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            onboardingData?.stripeData?.connected ? 'bg-[#2BE89A]' : 'bg-[#1c1e27]'
                          }`}>
                            {onboardingData?.stripeData?.connected ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <CreditCardIcon className="h-5 w-5 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white">Stripe</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                onboardingData?.stripeData?.connected
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {onboardingData?.stripeData?.connected ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">Betaalaccount koppelen</p>
                          </div>
                        </div>
                      </button>

                      {/* Step 3 */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          onboardingData?.posData?.posType
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25]'
                            : 'bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF8E53]/20 border-2 border-[#FF6B6B]'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            onboardingData?.posData?.posType ? 'bg-[#2BE89A]' : 'bg-[#1c1e27]'
                          }`}>
                            {onboardingData?.posData?.posType ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <WifiIcon className="h-5 w-5 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white">POS API</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                onboardingData?.posData?.posType
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {onboardingData?.posData?.posType ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">Kassasysteem integreren</p>
                          </div>
                        </div>
                      </button>

                      {/* Step 4 */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                        className="w-full text-left p-4 rounded-lg transition-all duration-200 bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25]"
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                              ? 'bg-[#2BE89A]' 
                              : 'bg-[#1c1e27]'
                          }`}>
                            {contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <StarIcon className="h-5 w-5 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-white">Google Reviews</h3>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                                contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink 
                                  ? 'Voltooid' 
                                  : 'Optioneel'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">Review link toevoegen</p>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 p-4 bg-[#0A0B0F] rounded-lg border border-[#2a2d3a]">
                      <h4 className="text-sm font-medium text-white mb-2">Hulp nodig?</h4>
                      <p className="text-xs text-[#BBBECC] mb-3">
                        Neem contact op met support als je vragen hebt over het onboarding proces.
                      </p>
                      <Link
                        href="/support"
                        className="text-xs text-[#2BE89A] hover:text-[#4FFFB0] font-medium"
                      >
                        Contact Support →
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="p-8">
                    <div className="space-y-4">
                      {/* Step 1: Personeel */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding?step=1`)}
                        className="w-full text-left p-6 rounded-lg transition-all duration-200 bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#2BE89A]/30 hover:bg-[#1a1c25]"
                      >
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            restaurantUsers[id]?.length > 0 
                              ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]' 
                              : 'bg-[#1c1e27]'
                          }`}>
                            {restaurantUsers[id]?.length > 0 ? (
                              <CheckCircleIcon className="h-6 w-6 text-black" />
                            ) : (
                              <UserGroupIcon className="h-6 w-6 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">Stap 1: Restaurant Personeel</h3>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                restaurantUsers[id]?.length > 0
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {restaurantUsers[id]?.length > 0 ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">
                              {restaurantUsers[id]?.length > 0 
                                ? `${restaurantUsers[id].length} gebruikers toegevoegd`
                                : 'Voeg managers en personeel toe die toegang nodig hebben'}
                            </p>
                            <div className="mt-3 flex items-center text-[#2BE89A] text-sm font-medium">
                              <span>{restaurantUsers[id]?.length > 0 ? 'Beheer personeel' : 'Start setup'}</span>
                              <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Step 2: Stripe */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding?step=2`)}
                        className="w-full text-left p-6 rounded-lg transition-all duration-200 bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#2BE89A]/30 hover:bg-[#1a1c25]"
                      >
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            onboardingData?.stripeData?.connected 
                              ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]' 
                              : 'bg-[#1c1e27]'
                          }`}>
                            {onboardingData?.stripeData?.connected ? (
                              <CheckCircleIcon className="h-6 w-6 text-black" />
                            ) : (
                              <CreditCardIcon className="h-6 w-6 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">Stap 2: Stripe Koppeling</h3>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                onboardingData?.stripeData?.connected
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {onboardingData?.stripeData?.connected ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">
                              {onboardingData?.stripeData?.connected
                                ? 'Stripe account is succesvol gekoppeld'
                                : 'Koppel een Stripe account voor betalingsverwerking'}
                            </p>
                            <div className="mt-3 flex items-center text-[#2BE89A] text-sm font-medium">
                              <span>{onboardingData?.stripeData?.connected ? 'Bekijk details' : 'Start koppeling'}</span>
                              <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Step 3: POS */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding?step=3`)}
                        className="w-full text-left p-6 rounded-lg transition-all duration-200 bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#2BE89A]/30 hover:bg-[#1a1c25]"
                      >
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            onboardingData?.posData?.posType 
                              ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]' 
                              : 'bg-[#1c1e27]'
                          }`}>
                            {onboardingData?.posData?.posType ? (
                              <CheckCircleIcon className="h-6 w-6 text-black" />
                            ) : (
                              <WifiIcon className="h-6 w-6 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">Stap 3: POS Integratie</h3>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                onboardingData?.posData?.posType
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-[#FF6B6B]/20 text-[#FF6B6B]'
                              }`}>
                                {onboardingData?.posData?.posType ? 'Voltooid' : 'Te doen'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">
                              {onboardingData?.posData?.posType
                                ? `${onboardingData.posData.posType} is gekoppeld`
                                : 'Verbind het kassasysteem voor automatische synchronisatie'}
                            </p>
                            <div className="mt-3 flex items-center text-[#2BE89A] text-sm font-medium">
                              <span>{onboardingData?.posData?.posType ? 'Beheer integratie' : 'Start setup'}</span>
                              <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Step 4: Google Reviews (Optional) */}
                      <button
                        onClick={() => router.push(`/restaurants/${id}/onboarding?step=4`)}
                        className="w-full text-left p-6 rounded-lg transition-all duration-200 bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#2BE89A]/30 hover:bg-[#1a1c25]"
                      >
                        <div className="flex items-start">
                          <div className={`p-3 rounded-lg mr-4 ${
                            contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                              ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]' 
                              : 'bg-[#1c1e27]'
                          }`}>
                            {contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink ? (
                              <CheckCircleIcon className="h-6 w-6 text-black" />
                            ) : (
                              <StarIcon className="h-6 w-6 text-[#BBBECC]" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-white">Stap 4: Google Reviews</h3>
                              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                                contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink ? 'Voltooid' : 'Optioneel'}
                              </span>
                            </div>
                            <p className="text-sm text-[#BBBECC] mt-1">
                              {contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink
                                ? 'Google Review link is toegevoegd'
                                : 'Voeg een directe link toe naar je Google Reviews pagina'}
                            </p>
                            <div className="mt-3 flex items-center text-[#2BE89A] text-sm font-medium">
                              <span>{contextRestaurant?.googleReviewLink || onboardingData?.googleReviewData?.reviewLink ? 'Bekijk link' : 'Toevoegen'}</span>
                              <ArrowRightIcon className="h-4 w-4 ml-1" />
                            </div>
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Restaurant Info */}
                    <div className="mt-8 bg-[#0A0B0F] rounded-lg p-6 border border-[#2a2d3a]">
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <MapPinIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                        Restaurant Informatie
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs text-[#BBBECC] uppercase tracking-wider mb-1">Email</p>
                          <p className="text-white">{restaurant.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#BBBECC] uppercase tracking-wider mb-1">Telefoon</p>
                          <p className="text-white">{restaurant.phone}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#BBBECC] uppercase tracking-wider mb-1">Locatie</p>
                          <p className="text-white">{restaurant.location}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Onboarded Restaurant Layout
              <div className="space-y-8">
                {/* Setup Essentials Section */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Setup Essentials</h2>
                    <p className="text-[#BBBECC]">Essentiële configuratie voor restaurant operaties</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Row 1: Contact Info, Restaurant Staff, Payment Settings */}
                    
                    {/* Contact Information */}
                    <div className="bg-[#1c1e27] p-5 rounded-xl border border-[#2a2d3a] h-fit">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <MapPinIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                          Contact Info
                        </h3>
                        <Link
                          href={`/restaurants/${id}/edit`}
                          className="p-1.5 text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F] rounded-lg transition"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs text-[#BBBECC] uppercase tracking-wider mb-1">Adres</p>
                          <p className="text-sm text-white leading-snug">
                            {restaurant.address.street}<br />
                            {restaurant.address.postalCode} {restaurant.address.city}
                          </p>
                        </div>
                        <div className="flex justify-between items-center py-2 border-t border-[#2a2d3a]">
                          <div>
                            <p className="text-xs text-[#BBBECC]">Email</p>
                            <a href={`mailto:${restaurant.email}`} className="text-sm text-white hover:text-[#2BE89A] transition">
                              {restaurant.email.length > 20 ? `${restaurant.email.substring(0, 20)}...` : restaurant.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-xs text-[#BBBECC]">Telefoon</p>
                            <a href={`tel:${restaurant.phone}`} className="text-sm text-white hover:text-[#2BE89A] transition">
                              {restaurant.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Staff */}
                    <div className="bg-[#1c1e27] p-5 rounded-xl border border-[#2a2d3a] h-fit">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <UserGroupIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                          Restaurant Staff
                          {restaurantUsers[id] && restaurantUsers[id].length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-[#2BE89A]/20 text-[#2BE89A] rounded-full">{restaurantUsers[id].length}</span>
                          )}
                        </h3>
                      </div>
                      
                      {(!restaurantUsers[id] || restaurantUsers[id].length === 0) ? (
                        <div className="text-center py-6">
                          <div className="mx-auto h-12 w-12 bg-[#0A0B0F] rounded-full flex items-center justify-center mb-3">
                            <UserIcon className="h-6 w-6 text-[#BBBECC]" />
                          </div>
                          <p className="text-sm text-[#BBBECC] mb-3">Geen personeel toegevoegd</p>
                          <Link
                            href={`/restaurants/${id}/users`}
                            className="inline-flex items-center text-sm text-[#2BE89A] hover:text-[#4FFFB0] font-medium"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Personeel toevoegen
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Show 1 user if 3+, show 2 users if exactly 2 */}
                          {restaurantUsers[id].slice(0, restaurantUsers[id].length >= 3 ? 1 : 2).map((member) => (
                            <div key={member.id} className="bg-[#0A0B0F] rounded-lg p-3">
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-white">{member.name}</p>
                                  <p className="text-xs text-[#BBBECC]">{member.role}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Show "+X meer" only if 3 or more users */}
                          {restaurantUsers[id].length >= 3 && (
                            <div className="bg-[#0A0B0F] rounded-lg p-3">
                              <p className="text-sm text-[#BBBECC] text-center">
                                +{restaurantUsers[id].length - 1} meer personeelsleden
                              </p>
                            </div>
                          )}
                          <Link
                            href={`/restaurants/${id}/users`}
                            className="block w-full text-center py-2.5 bg-[#0A0B0F] border border-[#2a2d3a] text-sm text-[#2BE89A] hover:text-[#4FFFB0] hover:bg-[#1a1c25] font-medium rounded-lg transition"
                          >
                            Beheer alle personeel
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Payment Settings (Stripe) */}
                    <div className="bg-[#1c1e27] p-5 rounded-xl border border-[#2a2d3a] h-fit">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <CreditCardIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                          Payment Settings
                        </h3>
                        {!isNotFullyOnboarded && (
                          <Link
                            href={`/restaurants/${id}/stripe-transactions`}
                            className="p-1.5 text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F] rounded-lg transition"
                          >
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className="bg-[#0A0B0F] rounded-lg p-3">
                          <p className="text-xs text-[#BBBECC] mb-1">Service Fee</p>
                          <p className="text-lg font-bold text-white">
                            {restaurant.serviceFee.type === 'flat' ? '€' : ''}
                            {restaurant.serviceFee.amount}
                            {restaurant.serviceFee.type === 'percentage' ? '%' : ''}
                          </p>
                          <p className="text-xs text-[#BBBECC]">{restaurant.serviceFee.type === 'flat' ? 'Per order' : 'Percentage'}</p>
                        </div>
                        
                        {isNotFullyOnboarded ? (
                          <div className="bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 rounded-lg p-3">
                            <div className="flex items-center mb-2">
                              <CreditCardIcon className="h-4 w-4 text-[#FF6B6B] mr-2" />
                              <span className="text-sm font-medium text-[#FF6B6B]">Stripe Required</span>
                            </div>
                            <p className="text-xs text-[#BBBECC]">Setup Stripe in onboarding</p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between bg-[#0A0B0F] rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-blue-500/20 rounded-lg mr-2">
                                <StripeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Stripe Connected</p>
                                <p className="text-xs text-[#BBBECC]">Active account</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#2BE89A]/20 text-[#2BE89A]">
                              Active
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Row 2: POS Integration, Google Reviews */}
                    
                    {/* POS Integration */}
                    <div className="bg-[#1c1e27] p-5 rounded-xl border border-[#2a2d3a] h-fit">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <WifiIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                          POS Integration
                        </h3>
                        <button
                          onClick={() => router.push(`/restaurants/${id}/onboarding?step=3`)}
                          className="p-1.5 text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F] rounded-lg transition"
                        >
                          <Cog6ToothIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {!restaurant.posData || restaurant.posIntegration === 'Niet gekoppeld' ? (
                        <div className="text-center py-6">
                          <div className="mx-auto h-12 w-12 bg-[#0A0B0F] rounded-full flex items-center justify-center mb-3">
                            <WifiIcon className="h-6 w-6 text-[#BBBECC]" />
                          </div>
                          <p className="text-sm text-[#BBBECC] mb-3">No POS connected</p>
                          <button
                            onClick={() => router.push(`/restaurants/${id}/onboarding?step=3`)}
                            className="inline-flex items-center text-sm text-[#2BE89A] hover:text-[#4FFFB0] font-medium"
                          >
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Setup POS
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="bg-[#0A0B0F] rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-medium text-white">Connected System</p>
                              <span className="px-2 py-1 text-xs rounded-full bg-[#2BE89A]/20 text-[#2BE89A]">Active</span>
                            </div>
                            <p className="text-sm text-[#BBBECC]">{restaurant.posIntegration}</p>
                          </div>
                          <div className="bg-[#0A0B0F] rounded-lg p-3">
                            <p className="text-xs text-[#BBBECC] mb-1">Today's Orders</p>
                            <p className="text-lg font-bold text-white">342</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Google Reviews */}
                    <div className="bg-[#1c1e27] p-5 rounded-xl border border-[#2a2d3a] h-fit">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white flex items-center">
                          <StarIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                          Google Reviews
                        </h3>
                        <button
                          onClick={() => setEditingGoogleReview(true)}
                          className="p-1.5 text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F] rounded-lg transition"
                        >
                          {googleReviewLink || contextRestaurant?.googleReviewLink ? (
                            <PencilIcon className="h-4 w-4" />
                          ) : (
                            <PlusIcon className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      
                      {!editingGoogleReview ? (
                        <div>
                          {googleReviewLink || contextRestaurant?.googleReviewLink ? (
                            <div className="space-y-3">
                              <div className="bg-[#0A0B0F] rounded-lg p-3">
                                <p className="text-xs text-[#BBBECC] mb-1">Review Link</p>
                                <p className="text-sm text-white break-all mb-2">{(googleReviewLink || contextRestaurant?.googleReviewLink).substring(0, 35)}...</p>
                                <div className="flex gap-2">
                                  <a
                                    href={googleReviewLink || contextRestaurant?.googleReviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 text-center px-3 py-2 bg-[#1c1e27] text-[#2BE89A] text-sm rounded-lg hover:bg-[#252833] transition"
                                  >
                                    Open Link
                                  </a>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-6">
                              <div className="mx-auto h-12 w-12 bg-[#0A0B0F] rounded-full flex items-center justify-center mb-3">
                                <StarIcon className="h-6 w-6 text-[#BBBECC]" />
                              </div>
                              <p className="text-sm text-[#BBBECC] mb-3">No review link set</p>
                              <button
                                onClick={() => setEditingGoogleReview(true)}
                                className="inline-flex items-center text-sm text-[#2BE89A] hover:text-[#4FFFB0] font-medium"
                              >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                Add Link
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div>
                            <input
                              type="url"
                              value={googleReviewLink}
                              onChange={(e) => setGoogleReviewLink(e.target.value)}
                              placeholder="https://g.page/r/..."
                              className="w-full px-3 py-2 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white text-sm placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingGoogleReview(false)
                                setGoogleReviewLink(contextRestaurant?.googleReviewLink || '')
                              }}
                              className="flex-1 px-3 py-2 bg-[#0A0B0F] border border-[#2a2d3a] text-[#BBBECC] text-sm rounded-lg hover:text-white transition"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleSaveGoogleReview}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black text-sm font-medium rounded-lg hover:opacity-90 transition"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operations & Analytics Section */}
                <div>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Operations & Analytics</h2>
                    <p className="text-[#BBBECC]">Real-time operational data and performance metrics</p>
                  </div>
                  
                    {/* Active Tables - Full Width */}
                    <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center">
                          <TableCellsIcon className="h-6 w-6 text-[#2BE89A] mr-3" />
                          Actieve Tafels
                        </h3>
                        <Link
                          href="/tables"
                          className="inline-flex items-center text-sm font-medium text-[#2BE89A] hover:text-[#4FFFB0] transition"
                        >
                          <span>Alle Tafels</span>
                          <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                      
                      {restaurantTables.length === 0 ? (
                        <div className="text-center py-16 bg-[#0A0B0F] rounded-xl">
                          <div className="mx-auto h-16 w-16 bg-[#1c1e27] rounded-full flex items-center justify-center mb-4">
                            <TableCellsIcon className="h-8 w-8 text-[#BBBECC]" />
                          </div>
                          <h4 className="text-lg font-medium text-white mb-2">Geen Actieve Tafels</h4>
                          <p className="text-[#BBBECC]">Er zijn momenteel geen actieve tafels in dit restaurant.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {restaurantTables.slice(0, 8).map((table) => (
                            <div
                              key={table.id}
                              className="bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a] hover:border-[#2BE89A]/30 transition-all duration-200"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-lg font-bold text-white">Tafel {table.tableNumber}</h4>
                                  <p className="text-xs text-[#BBBECC]">{table.guests} gasten</p>
                                </div>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  table.remaining === table.amount 
                                    ? 'bg-yellow-500/20 text-yellow-400' 
                                    : table.remaining > 0 
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'bg-[#2BE89A]/20 text-[#2BE89A]'
                                }`}>
                                  {table.remaining === table.amount ? 'Onbetaald' : table.remaining > 0 ? 'Gedeeltelijk' : 'Betaald'}
                                </span>
                              </div>
                              
                              <div className="space-y-2 mb-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#BBBECC]">Order #</span>
                                  <span className="text-white font-medium">{table.orderId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#BBBECC]">Bedrag</span>
                                  <span className="text-white font-medium">€{table.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#BBBECC]">Resterend</span>
                                  <span className="text-yellow-400 font-medium">€{table.remaining.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-[#BBBECC]">Duur</span>
                                  <span className="text-white flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {table.duration}
                                  </span>
                                </div>
                              </div>
                              
                              <Link
                                href={`/orders/${table.orderId}`}
                                className="w-full inline-flex justify-center items-center px-3 py-2 bg-[#1c1e27] text-[#2BE89A] text-sm font-medium rounded-lg hover:bg-[#252833] transition border border-[#2a2d3a]"
                              >
                                Bekijk Details
                              </Link>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {restaurantTables.length > 8 && (
                        <div className="mt-6 text-center">
                          <Link
                            href="/tables"
                            className="inline-flex items-center text-sm text-[#BBBECC] hover:text-[#2BE89A] transition font-medium"
                          >
                            +{restaurantTables.length - 8} meer actieve tafels
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Transaction Analytics - Full Width */}
                    <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] mt-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-white flex items-center">
                          <ChartBarIcon className="h-6 w-6 text-[#2BE89A] mr-3" />
                          Transactie Analytics
                        </h3>
                        {!isNotFullyOnboarded && (
                          <Link
                            href={`/restaurants/${id}/stripe-transactions`}
                            className="inline-flex items-center text-sm font-medium text-[#2BE89A] hover:text-[#4FFFB0] transition"
                          >
                            <span>Bekijk Alle Transacties</span>
                            <ArrowTopRightOnSquareIcon className="ml-1.5 h-4 w-4" />
                          </Link>
                        )}
                      </div>
                      
                      {restaurant.transactions.total === 0 || isNotFullyOnboarded ? (
                        <div className="text-center py-20 bg-[#0A0B0F] rounded-xl">
                          <div className="mx-auto h-20 w-20 bg-[#1c1e27] rounded-full flex items-center justify-center mb-6">
                            <CurrencyDollarIcon className="h-10 w-10 text-[#BBBECC]" />
                          </div>
                          <h4 className="text-lg font-medium text-white mb-2">Nog Geen Transacties</h4>
                          <p className="text-[#BBBECC] max-w-sm mx-auto">Transactie analytics verschijnen hier zodra betalingen binnenkomen.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-[#0A0B0F] rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-sm font-medium text-[#BBBECC]">Totaal Transacties</p>
                              <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                                <ShoppingBagIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{restaurant.transactions.total.toLocaleString()}</p>
                            <p className="text-xs text-[#BBBECC] mt-2">Alle tijd</p>
                          </div>
                          <div className="bg-[#0A0B0F] rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-sm font-medium text-[#BBBECC]">Deze Maand</p>
                              <div className="p-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg">
                                <ArrowTrendingUpIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{restaurant.transactions.thisMonth}</p>
                            <p className="text-xs text-[#2BE89A] mt-2 flex items-center">
                              <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                              +12.5% vs vorige maand
                            </p>
                          </div>
                          <div className="bg-[#0A0B0F] rounded-xl p-6">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-sm font-medium text-[#BBBECC]">Vorige Maand</p>
                              <div className="p-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                                <ChartBarIcon className="h-5 w-5 text-white" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{restaurant.transactions.lastMonth}</p>
                            <p className="text-xs text-[#BBBECC] mt-2">Voltooid</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && restaurant && (
        <RestaurantDeleteModal
          restaurant={restaurant}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
      
      {/* Permanent Delete Modal */}
      {showPermanentDeleteModal && contextRestaurant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1c1e27] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2d3a]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-500/20 rounded-lg">
                  <TrashIcon className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white ml-3">Permanent Verwijderen</h3>
              </div>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 font-medium mb-1">⚠️ Dit kan niet ongedaan worden gemaakt!</p>
              <p className="text-sm text-[#BBBECC]">
                Je staat op het punt om <span className="font-semibold text-white">{contextRestaurant.name}</span> definitief te verwijderen. 
                Alle gegevens zullen permanent verloren gaan.
              </p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Type Restaurant Naam <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-3 bg-[#0A0B0F] border rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                    nameError ? 'border-red-500' : 'border-[#2a2d3a]'
                  }`}
                  placeholder={contextRestaurant.name}
                  value={permanentDeleteName}
                  onChange={(e) => {
                    setPermanentDeleteName(e.target.value)
                    setNameError(false)
                  }}
                />
                {nameError && (
                  <p className="text-red-400 text-sm mt-1">Restaurant naam komt niet overeen</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Jouw Wachtwoord <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`w-full px-4 py-3 pr-12 bg-[#0A0B0F] border rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent ${
                      passwordError ? 'border-red-500' : 'border-[#2a2d3a]'
                    }`}
                    placeholder="Voer je wachtwoord in ter bevestiging"
                    value={permanentDeletePassword}
                    onChange={(e) => {
                      setPermanentDeletePassword(e.target.value)
                      setPasswordError(false)
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#BBBECC] hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5" />
                    ) : (
                      <EyeIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-red-400 text-sm mt-1">Onjuist wachtwoord</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPermanentDeleteModal(false)
                  setPermanentDeletePassword('')
                  setPermanentDeleteName('')
                  setPasswordError(false)
                  setNameError(false)
                  setShowPassword(false)
                }}
                className="flex-1 px-6 py-3 bg-[#0A0B0F] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
              >
                Annuleren
              </button>
              <button
                onClick={handlePermanentDeleteConfirm}
                disabled={!permanentDeletePassword || !permanentDeleteName}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Definitief Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}