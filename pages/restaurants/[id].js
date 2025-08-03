import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../../components/Layout'
import { useRestaurants } from '../../contexts/RestaurantsContext'
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
} from '@heroicons/react/24/outline'

export default function RestaurantDetail() {
  const router = useRouter()
  const { id } = router.query
  const { getRestaurant, deleteRestaurant } = useRestaurants()
  const [showDeleteModal, setShowDeleteModal] = useState(false)

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
  const contextRestaurant = getRestaurant(id)
  
  // Merge with additional data needed for detail view
  const restaurant = contextRestaurant ? {
    ...contextRestaurant,
    banner: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569549/restaurant_banners/zgzej1heya57fynyqoqh.png',
    address: {
      street: 'Prins Hendrikkade 21',
      postalCode: '1012TL',
      city: 'Amsterdam',
      country: 'Netherlands',
    },
    serviceFee: {
      amount: 0.7,
      type: 'percentage',
    },
    contractStart: new Date('2024-01-01'),
    stripeConnected: true,
    stripe: {
      accountId: 'acct_1234567890',
      dashboardUrl: 'https://dashboard.stripe.com/acct_1234567890',
    },
    posIntegration: 'SPEEDY',
    ratings: {
      average: 4.8,
      count: 156,
    },
    stats: {
      totalRevenue: '€125,450',
      monthlyRevenue: '€12,450',
      totalTransactions: 1234,
      activeOrders: contextRestaurant?.activeOrders || 12,
      completionRate: 98.5,
      peakHours: '17:00 - 20:00',
    },
    transactions: {
      recent: [],
      lastMonth: 245,
      thisMonth: 289,
      total: 1234,
    },
    staff: [],
    averageOrderValue: '€45.50',
    rating: 4.8,
    peakHours: '17:00 - 20:00',
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
    deleteRestaurant(id)
    router.push('/restaurants')
  }

  const StripeIcon = () => (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
    </svg>
  )

  const quickStats = [
    { label: 'Omzet', value: restaurant.revenue, icon: BanknotesIcon, color: 'from-[#2BE89A] to-[#4FFFB0]', trend: '+12.5%' },
    { label: 'Transacties', value: restaurant.transactions.thisMonth, icon: ShoppingBagIcon, color: 'from-[#4ECDC4] to-[#44A08D]', trend: '+8.2%' },
    { label: 'Gem. Order', value: restaurant.averageOrderValue, icon: CreditCardIcon, color: 'from-[#667EEA] to-[#764BA2]', trend: '+5.3%' },
    { label: 'Rating', value: restaurant.rating, icon: StarIcon, color: 'from-[#FF6B6B] to-[#FF8E53]', trend: null },
  ]

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
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
                >
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Verwijderen
                </button>
                <Link
                  href={`/restaurants/${id}/settings`}
                  className="inline-flex items-center px-4 py-2 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white hover:bg-[#2a2d3a] transition"
                >
                  <Cog6ToothIcon className="h-5 w-5 mr-2" />
                  Instellingen
                </Link>
                <Link
                  href={`/restaurants/${id}/edit`}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                >
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Bewerk Restaurant
                </Link>
              </div>
            </div>

            {/* Restaurant Profile Card */}
            <div className="bg-[#1c1e27] rounded-xl overflow-hidden border border-[#2a2d3a]">
              {/* Banner */}
              <div className="relative h-48 md:h-64 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                <Image
                  src={restaurant.banner}
                  alt={`${restaurant.name} banner`}
                  fill
                  className="object-cover opacity-90"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0B0F] via-transparent to-transparent" />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                    restaurant.status === 'active' 
                      ? 'bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}>
                    <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                    {restaurant.status === 'active' ? 'Actief' : 'Inactief'}
                  </span>
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="relative px-6 lg:px-8 pb-6">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-20">
                  <div className="flex items-end space-x-6">
                    <div className="flex-shrink-0">
                      <div className="h-32 w-32 rounded-2xl overflow-hidden border-4 border-[#1c1e27] shadow-xl relative bg-white">
                        {restaurant.logo ? (
                          <Image
                            src={restaurant.logo}
                            alt={`${restaurant.name} logo`}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold text-3xl">
                            {restaurant.name.charAt(0)}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h1 className="text-3xl font-bold text-white">{restaurant.name}</h1>
                      <div className="flex items-center text-[#BBBECC] mt-2">
                        <MapPinIcon className="h-5 w-5 mr-2" />
                        {restaurant.location}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#0F1117] border border-[#2a2d3a]">
                      <BuildingStorefrontIcon className="h-4 w-4 mr-1.5 text-[#BBBECC]" />
                      <span className="text-white">{restaurant.tables} tafels</span>
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[#0F1117] border border-[#2a2d3a]">
                      <ClockIcon className="h-4 w-4 mr-1.5 text-[#BBBECC]" />
                      <span className="text-white">Piek: {restaurant.peakHours}</span>
                    </span>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
                  {quickStats.map((stat, index) => (
                    <div key={index} className="bg-[#0F1117] rounded-xl p-5 border border-[#2a2d3a]">
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.color}`}>
                          <stat.icon className="h-5 w-5 text-white" />
                        </div>
                        {stat.trend && (
                          <span className="text-xs text-[#2BE89A] flex items-center">
                            <ArrowTrendingUpIcon className="h-3 w-3 mr-0.5" />
                            {stat.trend}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#BBBECC]">{stat.label}</p>
                      <p className="text-xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Contact Information */}
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <MapPinIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Contact Informatie
                </h2>
                <div className="space-y-5">
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <h3 className="text-xs font-medium text-[#BBBECC] uppercase tracking-wider mb-2">Adres</h3>
                    <address className="not-italic text-white">
                      {restaurant.address.street}<br />
                      {restaurant.address.postalCode} {restaurant.address.city}<br />
                      {restaurant.address.country}
                    </address>
                  </div>
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <h3 className="text-xs font-medium text-[#BBBECC] uppercase tracking-wider mb-2">Email</h3>
                    <a href={`mailto:${restaurant.email}`} className="text-white hover:text-[#2BE89A] transition">
                      {restaurant.email}
                    </a>
                  </div>
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <h3 className="text-xs font-medium text-[#BBBECC] uppercase tracking-wider mb-2">Telefoon</h3>
                    <a href={`tel:${restaurant.phone}`} className="text-white hover:text-[#2BE89A] transition">
                      {restaurant.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Payment Settings */}
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <CurrencyDollarIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Betaalinstellingen
                </h2>
                <div className="space-y-5">
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <h3 className="text-xs font-medium text-[#BBBECC] uppercase tracking-wider mb-2">Service Kosten</h3>
                    <p className="text-2xl font-bold text-white">
                      {restaurant.serviceFee.type === 'flat' ? '€' : ''}
                      {restaurant.serviceFee.amount}
                      {restaurant.serviceFee.type === 'percentage' ? '%' : ''}
                      <span className="text-sm font-normal text-[#BBBECC] ml-2">per bestelling</span>
                    </p>
                    <p className="text-xs text-[#BBBECC] mt-1 capitalize">{restaurant.serviceFee.type === 'flat' ? 'Vast bedrag' : 'Percentage'}</p>
                  </div>
                  
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-500/20 rounded-lg mr-3">
                          <StripeIcon />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">Stripe</h3>
                          <p className="text-xs text-[#BBBECC]">Account: {restaurant.stripe.accountId}</p>
                        </div>
                      </div>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-[#2BE89A]/20 text-[#2BE89A]">
                        Actief
                      </span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button className="flex-1 px-3 py-2 bg-[#1c1e27] text-white text-sm rounded-lg hover:bg-[#2a2d3a] transition">
                        Update
                      </button>
                      <button className="flex-1 px-3 py-2 bg-[#1c1e27] text-white text-sm rounded-lg hover:bg-[#2a2d3a] transition">
                        Details
                      </button>
                    </div>
                  </div>
                  
                  <Link
                    href={`/restaurants/${id}/stripe-transactions`}
                    className="block w-full text-center px-4 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition"
                  >
                    Bekijk Transacties
                  </Link>
                </div>
              </div>

              {/* Restaurant Staff */}
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Restaurant Personeel
                </h2>
                {restaurant.staff.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mx-auto h-16 w-16 bg-[#0F1117] rounded-full flex items-center justify-center mb-4">
                      <UserIcon className="h-8 w-8 text-[#BBBECC]" />
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1">Geen personeel</h3>
                    <p className="text-xs text-[#BBBECC]">Voeg personeel toe om toegang te geven</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {restaurant.staff.map((member) => (
                      <div key={member.id} className="bg-[#0F1117] rounded-lg p-4 hover:bg-[#1a1c25] transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-white">{member.name}</p>
                              <p className="text-xs text-[#BBBECC]">{member.role}</p>
                            </div>
                          </div>
                          <button className="text-[#2BE89A] hover:text-[#4FFFB0] text-sm transition">
                            Bewerk
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  href={`/restaurants/${id}/users`}
                  className="block w-full text-center px-4 py-3 bg-[#0F1117] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition mt-4 border border-[#2a2d3a]"
                >
                  Beheer Personeel
                </Link>
              </div>
            </div>

            {/* Transaction Analytics */}
            <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <ChartBarIcon className="h-7 w-7 text-[#2BE89A] mr-3" />
                  Transactie Analytics
                </h2>
                <Link
                  href={`/restaurants/${id}/stripe-transactions`}
                  className="inline-flex items-center text-sm font-medium text-[#2BE89A] hover:text-[#4FFFB0] transition"
                >
                  <span>Bekijk Alle Transacties</span>
                  <ArrowTopRightOnSquareIcon className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
              
              {restaurant.transactions.total === 0 ? (
                <div className="text-center py-20 bg-[#0F1117] rounded-xl">
                  <div className="mx-auto h-20 w-20 bg-[#1c1e27] rounded-full flex items-center justify-center mb-6">
                    <CurrencyDollarIcon className="h-10 w-10 text-[#BBBECC]" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Nog Geen Transacties</h3>
                  <p className="text-[#BBBECC] max-w-sm mx-auto">Transactie analytics verschijnen hier zodra betalingen binnenkomen.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0F1117] rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm font-medium text-[#BBBECC]">Totaal Transacties</p>
                      <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                        <ShoppingBagIcon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-white">{restaurant.transactions.total.toLocaleString()}</p>
                    <p className="text-xs text-[#BBBECC] mt-2">Alle tijd</p>
                  </div>
                  <div className="bg-[#0F1117] rounded-xl p-6">
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
                  <div className="bg-[#0F1117] rounded-xl p-6">
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
      </div>

      {/* Delete Modal */}
      {showDeleteModal && restaurant && (
        <RestaurantDeleteModal
          restaurant={restaurant}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </Layout>
  )
}