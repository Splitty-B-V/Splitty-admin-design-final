import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
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
  const [recentOrders, setRecentOrders] = useState([])
  
  // Get current user from localStorage
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null
  const currentUserEmail = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null
  const currentUser = currentUserId ? getCompanyUser(currentUserId) : null

  // Static recent orders - most recent at top
  useEffect(() => {
    if (id) {
      // Fixed orders that never change, already sorted by most recent first
      const staticOrders = [
        { id: 1005, table: 12, amount: 45.80, status: 'in_progress', time: '2 min', items: 'Latte, Croissant', timestamp: 1 },
        { id: 1004, table: 7, amount: 23.50, status: 'completed', time: '5 min', items: 'Cappuccino x2', timestamp: 2 },
        { id: 1003, table: 3, amount: 67.90, status: 'partial', time: '8 min', items: 'Pizza, Wijn, Dessert', timestamp: 3 },
        { id: 1002, table: 15, amount: 12.40, status: 'completed', time: '12 min', items: 'Sandwich', timestamp: 4 },
        { id: 1001, table: 9, amount: 34.20, status: 'completed', time: '15 min', items: 'Pasta, Bier', timestamp: 5 }
      ]
      
      // Orders are already in the correct order (most recent first)
      setRecentOrders(staticOrders)
    }
  }, [id])

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
      <div className={`min-h-screen ${false ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[
              { name: 'Restaurants', href: '/restaurants' },
              { name: restaurant?.name || 'Loading...' }
            ]} />
            
            {/* Back Button */}
            <Link
              href="/restaurants"
              className={`inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium group ${
                false 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a] text-[#BBBECC] hover:text-white hover:bg-[#0A0B0F] hover:border-green-500' 
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:text-gray-700 hover:bg-gray-100 hover:border-green-300'
              }`}
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Terug naar Restaurants
            </Link>

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className={`text-2xl font-semibold ${false ? 'text-white' : 'text-[#111827]'} mb-1`}>
                  {restaurant?.name || 'Restaurant Details'}
                </h1>
                <p className={`${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  Beheer restaurant informatie en instellingen
                </p>
              </div>
              <div className="flex gap-3">
                {contextRestaurant?.deleted ? (
                  <button
                    onClick={() => setShowPermanentDeleteModal(true)}
                    className="inline-flex items-center px-4 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all shadow-sm"
                  >
                    <TrashIcon className="h-5 w-5 mr-2" />
                    Permanent Verwijderen
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2.5 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all"
                    >
                      <TrashIcon className="h-5 w-5 mr-2" />
                      Archiveren
                    </button>
                    <Link
                      href={`/restaurants/${id}/edit`}
                      className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
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
              <div className={`rounded-xl p-6 ${false ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg mr-4 ${false ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                      <ClockIcon className={`h-6 w-6 ${false ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    </div>
                    <div>
                      <p className={`font-semibold text-lg ${false ? 'text-yellow-400' : 'text-yellow-700'}`}>Onboarding niet voltooid</p>
                      <p className={`text-sm mt-1 ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                        Dit restaurant moet eerst de setup voltooien voordat het actief kan worden
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push(`/restaurants/${id}/onboarding`)}
                    className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-sm"
                  >
                    <span className="mr-2">Start Onboarding</span>
                    <ArrowRightIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Restaurant Profile Card */}
            <div className={`rounded-xl overflow-hidden ${false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'}`}>
              {/* Banner */}
              <div className="relative h-32 md:h-40 bg-gradient-to-r from-green-400 to-green-500">
                <Image
                  src={restaurant.banner}
                  alt={`${restaurant.name} banner`}
                  fill
                  className="object-cover opacity-90"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                    contextRestaurant?.deleted
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : restaurant.status === 'active' 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-gray-50 text-gray-600 border border-gray-200'
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
                      <div className="h-24 w-24 rounded-xl overflow-hidden border-4 border-white shadow-xl relative bg-white">
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
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-500 text-white font-bold text-2xl">
                            {restaurant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <h1 className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>{restaurant.name}</h1>
                      <div className={`flex items-center mt-1 text-sm ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                        <MapPinIcon className="h-4 w-4 mr-1.5" />
                        {restaurant.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-3 lg:mt-0">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                      false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <BuildingStorefrontIcon className={`h-3.5 w-3.5 mr-1 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                      <span className={false ? 'text-white' : 'text-gray-900'}>{restaurant.tables} tafels</span>
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${
                      false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-100 border border-gray-200'
                    }`}>
                      <ClockIcon className={`h-3.5 w-3.5 mr-1 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                      <span className={false ? 'text-white' : 'text-gray-900'}>Piek: {restaurant.peakHours}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
                  {quickStats.map((stat, index) => (
                    <div key={index} className={`rounded-lg p-4 ${
                      false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-1.5 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className={`h-4 w-4 ${false ? 'text-white' : 'text-white'}`} />
                        </div>
                        {stat.trend && (
                          <span className="text-xs text-green-500 flex items-center">
                            <ArrowTrendingUpIcon className="h-2.5 w-2.5 mr-0.5" />
                            {stat.trend}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>{stat.label}</p>
                      <p className={`text-lg font-bold mt-0.5 ${false ? 'text-white' : 'text-[#111827]'}`}>{stat.value}</p>
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
                    <h2 className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'} mb-2`}>Setup Essentials</h2>
                    <p className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Essentiële configuratie voor restaurant operaties</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    {/* Row 1: Contact Info, Restaurant Staff, Payment Settings */}
                    
                    {/* Contact Information */}
                    <div className={`p-5 rounded-xl h-fit ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <MapPinIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Contact Info
                        </h3>
                        <Link
                          href={`/restaurants/${id}/edit`}
                          className={`p-1.5 rounded-lg transition ${
                            false ? 'text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F]' : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                          }`}>
                          <PencilIcon className="h-4 w-4" />
                        </Link>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className={`text-xs uppercase tracking-wider mb-1 ${
                            false ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'
                          }`}>Adres</p>
                          <p className={`text-sm leading-snug ${
                            false ? 'text-white' : 'text-[#111827]'
                          }`}>
                            {restaurant.address.street}<br />
                            {restaurant.address.postalCode} {restaurant.address.city}
                          </p>
                        </div>
                        <div className={`flex justify-between items-center py-2 border-t ${
                          false ? 'border-[#2a2d3a]' : 'border-gray-200'
                        }`}>
                          <div>
                            <p className={`text-xs ${false ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>Email</p>
                            <a href={`mailto:${restaurant.email}`} className={`text-sm transition ${
                              false ? 'text-white hover:text-[#2BE89A]' : 'text-[#111827] hover:text-green-600'
                            }`}>
                              {restaurant.email.length > 20 ? `${restaurant.email.substring(0, 20)}...` : restaurant.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className={`text-xs ${false ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>Telefoon</p>
                            <a href={`tel:${restaurant.phone}`} className={`text-sm transition ${
                              false ? 'text-white hover:text-[#2BE89A]' : 'text-[#111827] hover:text-green-600'
                            }`}>
                              {restaurant.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Restaurant Staff */}
                    <div className={`p-5 rounded-xl h-fit ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <UserGroupIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Restaurant Staff
                          {restaurantUsers[id] && restaurantUsers[id].length > 0 && (
                            <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-600 rounded-full">{restaurantUsers[id].length}</span>
                          )}
                        </h3>
                      </div>
                      
                      {(!restaurantUsers[id] || restaurantUsers[id].length === 0) ? (
                        <div className="text-center py-6">
                          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                            false ? 'bg-[#0A0B0F]' : 'bg-gray-100'
                          }`}>
                            <UserIcon className={`h-6 w-6 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                          </div>
                          <p className={`text-sm mb-3 ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Geen personeel toegevoegd</p>
                          <Link
                            href={`/restaurants/${id}/users`}
                            className={`inline-flex items-center text-sm font-medium ${
                              false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                            }`}>
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Personeel toevoegen
                          </Link>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Show 1 user if 3+, show 2 users if exactly 2 */}
                          {restaurantUsers[id].slice(0, restaurantUsers[id].length >= 3 ? 1 : 2).map((member) => (
                            <div key={member.id} className={`rounded-lg p-3 ${
                              false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-center">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="ml-3">
                                  <p className={`text-sm font-medium ${false ? 'text-white' : 'text-[#111827]'}`}>{member.name}</p>
                                  <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>{member.role}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                          {/* Show "+X meer" only if 3 or more users */}
                          {restaurantUsers[id].length >= 3 && (
                            <div className={`rounded-lg p-3 ${
                              false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <p className={`text-sm text-center ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                                +{restaurantUsers[id].length - 1} meer personeelsleden
                              </p>
                            </div>
                          )}
                          <Link
                            href={`/restaurants/${id}/users`}
                            className={`block w-full text-center py-2.5 text-sm font-medium rounded-lg transition ${
                              false 
                                ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-[#2BE89A] hover:text-[#4FFFB0] hover:bg-[#1c1e27]'
                                : 'bg-gray-50 border border-gray-200 text-green-600 hover:text-green-700 hover:bg-gray-100'
                            }`}>
                            Beheer alle personeel
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Payment Settings (Stripe) */}
                    <div className={`p-5 rounded-xl h-fit ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <CreditCardIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Payment Settings
                        </h3>
                        {!isNotFullyOnboarded && (
                          <Link
                            href={`/restaurants/${id}/stripe-transactions`}
                            className={`p-1.5 rounded-lg transition ${
                              false ? 'text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F]' : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                            }`}>
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </Link>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div className={`rounded-lg p-3 ${
                          false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                        }`}>
                          <p className={`text-xs mb-1 ${false ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>Service Fee</p>
                          <p className={`text-lg font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>
                            {restaurant.serviceFee.type === 'flat' ? '€' : ''}
                            {restaurant.serviceFee.amount}
                            {restaurant.serviceFee.type === 'percentage' ? '%' : ''}
                          </p>
                          <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>{restaurant.serviceFee.type === 'flat' ? 'Per order' : 'Percentage'}</p>
                        </div>
                        
                        {isNotFullyOnboarded ? (
                          <div className={`rounded-lg p-3 ${
                            false ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
                          }`}>
                            <div className="flex items-center mb-2">
                              <CreditCardIcon className={`h-4 w-4 mr-2 ${false ? 'text-yellow-400' : 'text-yellow-600'}`} />
                              <span className={`text-sm font-medium ${false ? 'text-yellow-400' : 'text-yellow-700'}`}>Stripe Required</span>
                            </div>
                            <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Setup Stripe in onboarding</p>
                          </div>
                        ) : (
                          <div className={`flex items-center justify-between rounded-lg p-3 ${
                            false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <div className="flex items-center">
                              <div className="p-1.5 bg-blue-500/20 rounded-lg mr-2">
                                <StripeIcon className="h-4 w-4" />
                              </div>
                              <div>
                                <p className={`text-sm font-medium ${false ? 'text-white' : 'text-[#111827]'}`}>Stripe Connected</p>
                                <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Active account</p>
                              </div>
                            </div>
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">
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
                    <div className={`p-5 rounded-xl h-fit ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <WifiIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          POS Integration
                        </h3>
                        <button
                          onClick={() => router.push(`/restaurants/${id}/onboarding?step=3`)}
                          className={`p-1.5 rounded-lg transition ${
                            false ? 'text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F]' : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                          }`}>
                          <Cog6ToothIcon className="h-4 w-4" />
                        </button>
                      </div>
                      
                      {!restaurant.posData || restaurant.posIntegration === 'Niet gekoppeld' ? (
                        <div className="text-center py-6">
                          <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                            false ? 'bg-[#0A0B0F]' : 'bg-gray-100'
                          }`}>
                            <WifiIcon className={`h-6 w-6 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                          </div>
                          <p className={`text-sm mb-3 ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>No POS connected</p>
                          <button
                            onClick={() => router.push(`/restaurants/${id}/onboarding?step=3`)}
                            className={`inline-flex items-center text-sm font-medium ${
                              false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                            }`}>
                            <PlusIcon className="h-4 w-4 mr-1" />
                            Setup POS
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className={`rounded-lg p-3 ${
                            false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <div className="flex items-center justify-between mb-2">
                              <p className={`text-sm font-medium ${false ? 'text-white' : 'text-[#111827]'}`}>Connected System</p>
                              <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-600">Active</span>
                            </div>
                            <p className={`text-sm ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>{restaurant.posIntegration}</p>
                          </div>
                          <div className={`rounded-lg p-3 ${
                            false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                          }`}>
                            <p className={`text-xs mb-1 ${false ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>Today's Orders</p>
                            <p className={`text-lg font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>342</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Google Reviews */}
                    <div className={`p-5 rounded-xl h-fit ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`text-lg font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <StarIcon className={`h-5 w-5 mr-2 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Google Reviews
                        </h3>
                        <button
                          onClick={() => setEditingGoogleReview(true)}
                          className={`p-1.5 rounded-lg transition ${
                            false ? 'text-[#BBBECC] hover:text-[#2BE89A] hover:bg-[#0A0B0F]' : 'text-gray-600 hover:text-green-600 hover:bg-gray-100'
                          }`}>
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
                              <div className={`mx-auto h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                                false ? 'bg-[#0A0B0F]' : 'bg-gray-100'
                              }`}>
                                <StarIcon className={`h-6 w-6 ${false ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                              </div>
                              <p className={`text-sm mb-3 ${false ? 'text-[#BBBECC]' : 'text-gray-500'}`}>No review link set</p>
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
                    <h2 className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'} mb-2`}>Operations & Analytics</h2>
                    <p className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Real-time operational data and performance metrics</p>
                  </div>
                  
                    {/* Active Tables - Full Width */}
                    <div className={`rounded-xl p-6 ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <TableCellsIcon className={`h-6 w-6 mr-3 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Actieve Tafels
                        </h3>
                        <Link
                          href={`/restaurants/${id}/tables`}
                          className={`inline-flex items-center text-sm font-medium transition ${
                            false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                          }`}>
                          <span>Alle Tafels</span>
                          <ArrowRightIcon className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                      
                      {restaurantTables.length === 0 ? (
                        <div className={`text-center py-16 rounded-xl ${
                          false ? 'bg-[#0A0B0F]' : 'bg-gray-50'
                        }`}>
                          <div className={`mx-auto h-16 w-16 rounded-full flex items-center justify-center mb-4 ${
                            false ? 'bg-[#1c1e27]' : 'bg-white border border-gray-200'
                          }`}>
                            <TableCellsIcon className={`h-8 w-8 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                          </div>
                          <h4 className={`text-lg font-medium mb-2 ${false ? 'text-white' : 'text-[#111827]'}`}>Geen Actieve Tafels</h4>
                          <p className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Er zijn momenteel geen actieve tafels in dit restaurant.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {restaurantTables.slice(0, 8).map((table) => (
                            <div
                              key={table.id}
                              className={`rounded-lg p-4 transition-all duration-200 ${
                                false 
                                  ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:border-[#2BE89A]/30'
                                  : 'bg-white border border-gray-200 hover:border-green-500/50 hover:shadow-md'
                              }`}
                            >
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className={`text-lg font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>Tafel {table.tableNumber}</h4>
                                  <p className={`text-xs ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>{table.guests} gasten</p>
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
                                  <span className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Order #</span>
                                  <span className={`font-medium ${false ? 'text-white' : 'text-[#111827]'}`}>{table.orderId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Bedrag</span>
                                  <span className={`font-medium ${false ? 'text-white' : 'text-[#111827]'}`}>€{table.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Resterend</span>
                                  <span className="text-yellow-500 font-medium">€{table.remaining.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className={false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>Duur</span>
                                  <span className={`flex items-center ${false ? 'text-white' : 'text-[#111827]'}`}>
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {table.duration}
                                  </span>
                                </div>
                              </div>
                              
                              <Link
                                href={`/orders/${table.orderId}`}
                                className={`w-full inline-flex justify-center items-center px-3 py-2 text-sm font-medium rounded-lg transition ${
                                  false
                                    ? 'bg-[#1c1e27] text-[#2BE89A] hover:bg-[#252833] border border-[#2a2d3a]'
                                    : 'bg-gray-50 text-green-600 hover:bg-gray-100 border border-gray-200'
                                }`}
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
                            href={`/restaurants/${id}/tables`}
                            className={`inline-flex items-center text-sm transition font-medium ${
                              false ? 'text-[#BBBECC] hover:text-[#2BE89A]' : 'text-[#6B7280] hover:text-green-600'
                            }`}>
                            +{restaurantTables.length - 8} meer actieve tafels
                            <ArrowRightIcon className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      )}
                    </div>

                    {/* Splitty Orders & Transaction Analytics - Full Width */}
                    <div className={`rounded-xl p-6 mt-6 ${
                      false ? 'bg-[#1c1e27] border border-[#2a2d3a]' : 'bg-white shadow-sm'
                    }`}>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-semibold flex items-center ${
                          false ? 'text-white' : 'text-[#111827]'
                        }`}>
                          <ChartBarIcon className={`h-6 w-6 mr-3 ${false ? 'text-[#2BE89A]' : 'text-green-500'}`} />
                          Splitty Orders & Transacties
                        </h3>
                        <Link
                          href={`/restaurants/${id}/tables`}
                          className={`inline-flex items-center text-sm font-medium transition ${
                            false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                          }`}>
                          <span>Bekijk Alle Orders</span>
                          <ArrowTopRightOnSquareIcon className="ml-1.5 h-4 w-4" />
                        </Link>
                      </div>
                      
                      {isNotFullyOnboarded ? (
                        <div className={`text-center py-20 rounded-xl ${
                          false ? 'bg-[#0A0B0F]' : 'bg-gray-50'
                        }`}>
                          <div className={`mx-auto h-20 w-20 rounded-full flex items-center justify-center mb-6 ${
                            false ? 'bg-[#1c1e27]' : 'bg-white border border-gray-200'
                          }`}>
                            <CurrencyDollarIcon className={`h-10 w-10 ${false ? 'text-[#BBBECC]' : 'text-gray-600'}`} />
                          </div>
                          <h4 className={`text-lg font-medium mb-2 ${false ? 'text-white' : 'text-[#111827]'}`}>Nog Geen Splitty Orders</h4>
                          <p className={`max-w-sm mx-auto ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                            Splitty orders verschijnen hier in realtime zodra klanten beginnen met betalen.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Summary Cards */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className={`rounded-xl p-4 ${
                              false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <p className={`text-sm font-medium ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Deze Maand</p>
                                <div className="p-2 bg-gradient-to-r from-green-400 to-green-500 rounded-lg">
                                  <ShoppingBagIcon className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <p className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>
                                {restaurant.transactions.thisMonth}
                              </p>
                              <p className={`text-xs mt-1 ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                                {new Date().toLocaleDateString('nl-NL', { month: 'long' })}
                              </p>
                            </div>
                            <div className={`rounded-xl p-4 ${
                              false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <p className={`text-sm font-medium ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Vandaag</p>
                                <div className="p-2 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg">
                                  <ArrowTrendingUpIcon className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <p className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>
                                {Math.floor(restaurant.transactions.thisMonth / 30)}
                              </p>
                              <p className="text-xs text-green-500 mt-1 flex items-center">
                                <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                                +15% vs gisteren
                              </p>
                            </div>
                            <div className={`rounded-xl p-4 ${
                              false ? 'bg-[#0A0B0F] border border-[#2a2d3a]' : 'bg-gray-50 border border-gray-200'
                            }`}>
                              <div className="flex items-center justify-between mb-2">
                                <p className={`text-sm font-medium ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>Actieve Orders</p>
                                <div className="p-2 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                                  <ClockIcon className="h-4 w-4 text-white" />
                                </div>
                              </div>
                              <p className={`text-2xl font-bold ${false ? 'text-white' : 'text-[#111827]'}`}>3</p>
                              <p className={`text-xs mt-1 ${false ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>In behandeling</p>
                            </div>
                          </div>

                          {/* Recent Orders Table - Compact */}
                          <div className={`rounded-lg overflow-hidden border ${
                            false ? 'border-[#2a2d3a]' : 'border-gray-200'
                          }`}>
                            <div className={`px-4 py-2.5 ${
                              false ? 'bg-[#0A0B0F] border-b border-[#2a2d3a]' : 'bg-gray-50 border-b border-gray-200'
                            }`}>
                              <h4 className={`text-sm font-medium ${false ? 'text-white' : 'text-gray-900'}`}>
                                Live Splitty Orders - Laatste 5
                              </h4>
                            </div>
                            <div className="overflow-x-auto">
                              <table className="min-w-full">
                                <thead className={false ? 'bg-[#0A0B0F]' : 'bg-white'}>
                                  <tr className="border-b border-gray-200">
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Order</th>
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Tafel</th>
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Bedrag</th>
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Status</th>
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Tijd</th>
                                    <th className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wider ${
                                      false ? 'text-[#BBBECC]' : 'text-gray-500'
                                    }`}>Acties</th>
                                  </tr>
                                </thead>
                                <tbody className={false ? 'bg-[#1c1e27]' : 'bg-white'}>
                                  {recentOrders.map((order, i) => (
                                    <tr key={order.id} className={`${i !== 4 ? 'border-b border-gray-100' : ''} ${false ? 'hover:bg-[#0A0B0F]' : 'hover:bg-gray-50'}`}>
                                      <td className={`px-4 py-2.5 whitespace-nowrap text-sm font-medium ${
                                        false ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        #{order.id}
                                      </td>
                                      <td className={`px-4 py-2.5 whitespace-nowrap text-sm ${
                                        false ? 'text-[#BBBECC]' : 'text-gray-500'
                                      }`}>
                                        {order.table}
                                      </td>
                                      <td className={`px-4 py-2.5 whitespace-nowrap text-sm font-medium ${
                                        false ? 'text-white' : 'text-gray-900'
                                      }`}>
                                        €{order.amount.toFixed(2)}
                                      </td>
                                      <td className="px-4 py-2.5 whitespace-nowrap">
                                        {order.status === 'completed' ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                                            Voltooid
                                          </span>
                                        ) : order.status === 'in_progress' ? (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-pulse"></div>
                                            Bezig
                                          </span>
                                        ) : (
                                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                                            Deels
                                          </span>
                                        )}
                                      </td>
                                      <td className={`px-4 py-2.5 whitespace-nowrap text-xs ${
                                        false ? 'text-[#BBBECC]' : 'text-gray-500'
                                      }`}>
                                        {order.time}
                                      </td>
                                      <td className="px-4 py-2.5 whitespace-nowrap text-sm">
                                        <div className="flex gap-1.5 items-center">
                                          <Link 
                                            href={`/restaurants/${id}/orders/${order.id}`}
                                            className={`font-medium text-xs ${
                                              false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                                            }`}
                                          >
                                            Order
                                          </Link>
                                          <span className="text-gray-300 text-xs">|</span>
                                          <Link 
                                            href={`/restaurants/${id}/payments/${order.id}`}
                                            className={`font-medium text-xs ${
                                              false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                                            }`}
                                          >
                                            Betaling
                                          </Link>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                            <div className={`px-4 py-2.5 ${
                              false ? 'bg-[#0A0B0F] border-t border-[#2a2d3a]' : 'bg-gray-50 border-t border-gray-200'
                            }`}>
                              <Link
                                href={`/restaurants/${id}/tables`}
                                className={`text-xs font-medium ${
                                  false ? 'text-[#2BE89A] hover:text-[#4FFFB0]' : 'text-green-600 hover:text-green-700'
                                }`}
                              >
                                Bekijk alle orders & betalingen →
                              </Link>
                            </div>
                          </div>
                        </>
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