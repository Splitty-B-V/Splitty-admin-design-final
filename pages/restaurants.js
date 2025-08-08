import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useTheme } from '../contexts/ThemeContext'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { 
  PlusIcon, 
  MagnifyingGlassIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  CheckCircleIcon,
  CreditCardIcon,
  ChartBarIcon,
  StarIcon,
  TrashIcon,
  ClockIcon,
  ArrowPathIcon,
  ChevronRightIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const StripeIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z" />
  </svg>
)

export default function Restaurants() {
  const { darkMode } = useTheme()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [restaurantToDelete, setRestaurantToDelete] = useState(null)
  const { restaurants, getActiveRestaurants, getDeletedRestaurants, restoreRestaurant, deleteRestaurantPermanently } = useRestaurants()
  
  useEffect(() => {
    setStatusFilter('all')
  }, [])

  let baseRestaurants = []
  if (statusFilter === 'deleted') {
    baseRestaurants = getDeletedRestaurants()
  } else if (statusFilter === 'onboarding') {
    baseRestaurants = getActiveRestaurants().filter(r => !r.isOnboarded)
  } else {
    baseRestaurants = getActiveRestaurants()
  }
  
  const sortedRestaurants = [...baseRestaurants].sort((a, b) => {
    const dateA = new Date(a.created)
    const dateB = new Date(b.created)
    return dateB - dateA
  })
  
  const restaurantsWithExtraData = sortedRestaurants.map((r, index) => ({
    ...r,
    paymentMethod: 'stripe',
    isActive: r.status === 'active',
    transactions: r.totalOrders,
    rating: 4.5 + (index * 0.1) % 0.5,
    onboardingStep: r.onboardingStep || (r.isOnboarded ? 4 : 0),
  }))

  const filteredRestaurants = restaurantsWithExtraData.filter((restaurant) => {
    const matchesSearch =
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesLocation = selectedFilter === 'all' || 
      restaurant.location.toLowerCase().includes(selectedFilter.toLowerCase())
    
    return matchesSearch && matchesLocation
  })

  const activeRestaurants = getActiveRestaurants()
  const deletedRestaurants = getDeletedRestaurants()
  const onboardingRestaurants = activeRestaurants.filter(r => !r.isOnboarded)

  const handleDeleteClick = (restaurant) => {
    setRestaurantToDelete(restaurant)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = () => {
    if (restaurantToDelete) {
      deleteRestaurantPermanently(restaurantToDelete.id)
      setDeleteModalOpen(false)
      setRestaurantToDelete(null)
      setDeleteConfirmText('')
    }
  }

  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const DeleteConfirmationModal = () => {
    if (!deleteModalOpen || !restaurantToDelete) return null

    const canDelete = deleteConfirmText === restaurantToDelete.name

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div 
            className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" 
            onClick={() => setDeleteModalOpen(false)}
          />
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          
          <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
            darkMode ? 'bg-[#1c1e27] border border-red-500' : 'bg-white'
          }`}>
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left flex-1">
                  <h3 className={`text-lg leading-6 font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Permanent verwijderen
                  </h3>
                  <div className="mt-2">
                    <p className={`text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-gray-500'}`}>
                      Je staat op het punt om <span className="font-semibold">{restaurantToDelete.name}</span> permanent te verwijderen.
                    </p>
                    <div className={`mt-3 p-3 rounded-lg ${darkMode ? 'bg-red-900/20 border border-red-500/50' : 'bg-red-50 border border-red-200'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-800'}`}>
                        ⚠️ Let op: Deze actie kan niet ongedaan worden gemaakt
                      </p>
                      <p className={`text-sm mt-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                        Als je dit restaurant nu verwijdert:
                      </p>
                      <ul className={`text-sm mt-2 ml-4 list-disc ${darkMode ? 'text-red-300' : 'text-red-700'}`}>
                        <li>Alle restaurantgegevens worden permanent verwijderd</li>
                        <li>Alle transactiegeschiedenis gaat verloren</li>
                        <li>Alle gebruikersaccounts worden verwijderd</li>
                        <li>Deze actie kan niet teruggedraaid worden</li>
                      </ul>
                    </div>
                    <div className="mt-4">
                      <label className={`block text-sm font-medium ${darkMode ? 'text-[#BBBECC]' : 'text-gray-700'} mb-2`}>
                        Type de naam van het restaurant om te bevestigen: <span className="font-semibold">{restaurantToDelete.name}</span>
                      </label>
                      <input
                        type="text"
                        value={deleteConfirmText}
                        onChange={(e) => setDeleteConfirmText(e.target.value)}
                        placeholder="Vul de restaurantnaam in"
                        className={`w-full px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                          darkMode
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-red-500'
                            : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-red-500'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${darkMode ? 'bg-[#0A0B0F]' : 'bg-gray-50'}`}>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={!canDelete}
                className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all ${
                  canDelete 
                    ? 'bg-red-600 hover:bg-red-700 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                Permanent verwijderen
              </button>
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false)
                  setDeleteConfirmText('')
                }}
                className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm ${
                  darkMode 
                    ? 'border-gray-600 bg-[#1c1e27] text-gray-300 hover:bg-[#2a2d3a]' 
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <DeleteConfirmationModal />
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Restaurants' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'} mb-1`}>
                  Restaurant Partners
                </h1>
                <p className={`${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  Beheer al je restaurant partners en hun prestaties
                </p>
              </div>
              <Link
                href="/restaurants/new"
                className="inline-flex items-center px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 text-white font-medium rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                Nieuw Restaurant
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className={`p-6 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]" : "p-3 rounded-lg bg-green-100"}>
                    <BuildingStorefrontIcon className={darkMode ? "h-6 w-6 text-black" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      TOTAAL PARTNERS
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {activeRestaurants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-yellow-500/20" : "p-3 rounded-lg bg-yellow-50"}>
                    <ClockIcon className={darkMode ? "h-6 w-6 text-yellow-400" : "h-6 w-6 text-yellow-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      SETUP VEREIST
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {onboardingRestaurants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl transition-all ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-red-500/20" : "p-3 rounded-lg bg-red-50"}>
                    <TrashIcon className={darkMode ? "h-6 w-6 text-red-400" : "h-6 w-6 text-red-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      GEARCHIVEERD
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {deletedRestaurants.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className={`flex space-x-2 p-1.5 rounded-xl shadow-sm ${
              darkMode 
                ? 'bg-gradient-to-r from-[#1c1e27] to-[#2a2d3a] border border-[#2a2d3a]' 
                : 'bg-gradient-to-r from-gray-100 to-gray-50 border border-gray-200'
            }`}>
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  statusFilter === 'all'
                    ? darkMode
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-white text-gray-900 shadow-md border border-gray-200 transform scale-[1.02]'
                    : darkMode
                      ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-gray-400 hover:text-white hover:border-gray-600 hover:bg-[#1c1e27] hover:shadow-md cursor-pointer'
                      : 'bg-white/70 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md hover:border-gray-300 cursor-pointer'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <BuildingStorefrontIcon className={`h-4 w-4 ${
                    statusFilter === 'all' 
                      ? darkMode ? 'text-white' : 'text-green-500'
                      : ''
                  }`} />
                  Alle Restaurants 
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                    statusFilter === 'all' 
                      ? darkMode ? 'bg-green-900/50 text-white' : 'bg-green-100 text-green-600'
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {activeRestaurants.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('onboarding')}
                className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  statusFilter === 'onboarding'
                    ? darkMode
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-white text-gray-900 shadow-md border border-gray-200 transform scale-[1.02]'
                    : darkMode
                      ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-gray-400 hover:text-white hover:border-gray-600 hover:bg-[#1c1e27] hover:shadow-md cursor-pointer'
                      : 'bg-white/70 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md hover:border-gray-300 cursor-pointer'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className={`h-4 w-4 ${
                    statusFilter === 'onboarding' 
                      ? darkMode ? 'text-white animate-spin' : 'text-yellow-500 animate-spin'
                      : ''
                  }`} />
                  Onboarding
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                    statusFilter === 'onboarding' 
                      ? darkMode ? 'bg-yellow-900/50 text-white' : 'bg-yellow-100 text-yellow-600'
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {onboardingRestaurants.length}
                  </span>
                </span>
              </button>
              <button
                onClick={() => setStatusFilter('deleted')}
                className={`flex-1 py-2.5 px-5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  statusFilter === 'deleted'
                    ? darkMode
                      ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg transform scale-[1.02]'
                      : 'bg-white text-gray-900 shadow-md border border-gray-200 transform scale-[1.02]'
                    : darkMode
                      ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-gray-400 hover:text-white hover:border-gray-600 hover:bg-[#1c1e27] hover:shadow-md cursor-pointer'
                      : 'bg-white/70 border border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-white hover:shadow-md hover:border-gray-300 cursor-pointer'
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <ArchiveBoxIcon className={`h-4 w-4 ${
                    statusFilter === 'deleted' 
                      ? darkMode ? 'text-white' : 'text-red-500'
                      : ''
                  }`} />
                  Gearchiveerd
                  <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold rounded-full ${
                    statusFilter === 'deleted' 
                      ? darkMode ? 'bg-red-900/50 text-white' : 'bg-red-100 text-red-600'
                      : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {deletedRestaurants.length}
                  </span>
                </span>
              </button>
            </div>

            {/* Search and Filter */}
            <div className={`rounded-xl ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`block w-full pl-10 pr-3 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A]'
                          : 'bg-white border border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-green-500 hover:border-gray-300'
                      }`}
                      placeholder="Zoek restaurants op naam of locatie..."
                    />
                  </div>
                  
                  <div className="relative lg:w-48">
                    <select
                      value={selectedFilter}
                      onChange={(e) => setSelectedFilter(e.target.value)}
                      className={`appearance-none w-full pl-3 pr-10 py-2.5 rounded-lg focus:outline-none focus:ring-2 cursor-pointer transition text-sm ${
                        darkMode
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white focus:ring-[#2BE89A]'
                          : 'bg-white border border-gray-200 text-gray-900 focus:ring-green-500 hover:border-gray-300'
                      }`}
                    >
                      <option value="all">Alle Locaties</option>
                      <option value="amsterdam">Amsterdam</option>
                      <option value="rotterdam">Rotterdam</option>
                      <option value="utrecht">Utrecht</option>
                      <option value="den haag">Den Haag</option>
                      <option value="eindhoven">Eindhoven</option>
                      <option value="zaandam">Zaandam</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className={`h-5 w-5 ${darkMode ? 'text-[#BBBECC]' : 'text-gray-400'}`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant List */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredRestaurants.map((restaurant) => (
                <div
                  key={restaurant.id}
                  className={`rounded-lg p-5 transition-all flex flex-col relative ${
                    !restaurant.isOnboarded && !restaurant.deleted
                      ? darkMode
                        ? 'bg-[#1c1e27] border-2 border-emerald-500/50 hover:shadow-xl animate-pulse-border'
                        : 'bg-white border border-emerald-400 hover:shadow-md animate-pulse-border'
                      : darkMode 
                        ? 'bg-[#1c1e27] border border-[#2a2d3a] hover:shadow-xl'
                        : 'bg-white border border-gray-200 hover:shadow-md hover:border-gray-300'
                  }`}
                >
                  {/* Header with logo and name */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-white transition-all duration-200 relative border border-gray-200">
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
                            sizes="48px"
                          />
                        )
                      ) : (
                        <div className="h-full w-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center text-white font-semibold text-base">
                          {restaurant.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className={`text-base font-semibold mb-1 ${
                        darkMode ? 'text-white' : 'text-[#111827]'
                      }`}>
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center flex-wrap gap-2">
                        {restaurant.deleted ? (
                          <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200">
                              <ArchiveBoxIcon className="h-3 w-3 mr-1" />
                              Gearchiveerd
                            </span>
                            {!restaurant.isOnboarded && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                                Onboarding Incompleet
                              </span>
                            )}
                          </>
                        ) : !restaurant.isOnboarded ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200">
                            Setup Vereist
                          </span>
                        ) : restaurant.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                            Actief
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-200">
                            Inactief
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Location and stats */}
                  <div className="flex-1 space-y-3 mb-4">
                    <div className={`flex items-center text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                      {restaurant.location}
                    </div>
                    
                    {restaurant.isOnboarded && (
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <span className={`block text-xs mb-1 ${darkMode ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>
                            Omzet
                          </span>
                          <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                            {restaurant.revenue}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs mb-1 ${darkMode ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>
                            Transacties
                          </span>
                          <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                            {restaurant.transactions}
                          </span>
                        </div>
                        <div>
                          <span className={`block text-xs mb-1 ${darkMode ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>
                            Score
                          </span>
                          <div className="flex items-center">
                            <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                              {restaurant.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {!restaurant.isOnboarded && (
                      <div>
                        <span className={`block text-xs mb-2 ${darkMode ? 'text-[#9CA3B5]' : 'text-[#9CA3AF]'}`}>
                          Onboarding voortgang
                        </span>
                        <div className="flex items-center">
                          <div className="flex-1 bg-gray-200 rounded-full h-2 mr-3">
                            <div
                              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all"
                              style={{ 
                                width: `${(() => {
                                  const savedData = typeof window !== 'undefined' 
                                    ? localStorage.getItem(`onboarding_${restaurant.id}`)
                                    : null;
                                  const parsedData = savedData ? JSON.parse(savedData) : null;
                                  const completedSteps = parsedData?.completedSteps || [];
                                  return (completedSteps.length / 4) * 100;
                                })()}%` 
                              }}
                            />
                          </div>
                          <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                            {(() => {
                              const savedData = typeof window !== 'undefined' 
                                ? localStorage.getItem(`onboarding_${restaurant.id}`)
                                : null;
                              const parsedData = savedData ? JSON.parse(savedData) : null;
                              const completedSteps = parsedData?.completedSteps || [];
                              return `${completedSteps.length}/4`;
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Action buttons */}
                  <div className={`pt-3 border-t ${darkMode ? 'border-[#2a2d3a]' : 'border-gray-200'}`}>
                    {restaurant.deleted ? (
                      <div className="flex gap-2">
                        <Link
                          href={`/restaurants/${restaurant.id}`}
                          className={`flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          Bekijk Details
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            restoreRestaurant(restaurant.id)
                          }}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-[#2BE89A]/20 text-[#2BE89A] hover:bg-[#2BE89A]/30'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}
                        >
                          Herstellen
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(restaurant)
                          }}
                          className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            darkMode 
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-red-50 text-red-600 hover:bg-red-100'
                          }`}
                        >
                          Verwijderen
                        </button>
                      </div>
                    ) : (
                      <Link
                        href={!restaurant.isOnboarded ? `/restaurants/${restaurant.id}/onboarding` : `/restaurants/${restaurant.id}`}
                        className={`w-full inline-flex items-center justify-center px-3.5 py-2 rounded-md transition-all text-sm font-medium ${
                          !restaurant.isOnboarded
                            ? 'bg-green-500 text-white hover:bg-green-600'
                            : darkMode
                              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                        }`}
                      >
                        {!restaurant.isOnboarded ? 'Start Onboarding' : 'Bekijk Details'}
                        <ChevronRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredRestaurants.length === 0 && (
              <div className={`text-center py-16 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <BuildingStorefrontIcon className={`mx-auto h-12 w-12 ${
                  darkMode ? 'text-[#BBBECC]' : 'text-gray-400'
                }`} />
                <h3 className={`mt-4 text-base font-medium ${
                  darkMode ? 'text-white' : 'text-[#111827]'
                }`}>
                  {statusFilter === 'deleted' 
                    ? 'Geen gearchiveerde restaurants'
                    : 'Geen restaurants gevonden'
                  }
                </h3>
                <p className={`mt-2 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  {statusFilter === 'deleted'
                    ? 'Gearchiveerde restaurants verschijnen hier'
                    : 'Begin met het toevoegen van je eerste restaurant partner.'
                  }
                </p>
                {statusFilter !== 'deleted' && (
                  <Link
                    href="/restaurants/new"
                    className="mt-6 inline-flex items-center px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all"
                  >
                    <PlusIcon className="mr-2 h-5 w-5" />
                    Voeg Restaurant Toe
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}