import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import { useTheme } from '../contexts/ThemeContext'
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WifiIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

export default function POSIntegration() {
  const { darkMode } = useTheme()
  const { restaurants } = useRestaurants()
  const [posStatuses, setPosStatuses] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  // Load POS data from localStorage for each restaurant
  useEffect(() => {
    const loadPosStatuses = () => {
      const statuses = {}
      
      restaurants.forEach(restaurant => {
        if (!restaurant.deleted) {
          const onboardingData = localStorage.getItem(`onboarding_${restaurant.id}`)
          if (onboardingData) {
            try {
              const parsed = JSON.parse(onboardingData)
              if (parsed.posData && parsed.posData.posType) {
                statuses[restaurant.id] = {
                  connected: true,
                  posType: parsed.posData.posType,
                  username: parsed.posData.username,
                  environment: parsed.posData.environment || 'production',
                  isActive: parsed.posData.isActive !== false,
                  lastSync: new Date().toISOString(),
                }
              } else {
                statuses[restaurant.id] = { connected: false }
              }
            } catch (e) {
              statuses[restaurant.id] = { connected: false }
            }
          } else {
            statuses[restaurant.id] = { connected: false }
          }
        }
      })
      
      setPosStatuses(statuses)
    }

    loadPosStatuses()
    
    const interval = setInterval(loadPosStatuses, 5000)
    
    return () => clearInterval(interval)
  }, [restaurants])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
      const event = new Event('storage')
      window.dispatchEvent(event)
    }, 1000)
  }

  const activeRestaurants = restaurants.filter(r => !r.deleted)
  const connectedCount = Object.values(posStatuses).filter(s => s.connected).length
  const activeCount = Object.values(posStatuses).filter(s => s.connected && s.isActive).length

  return (
    <Layout>
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'POS Integratie' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className={`text-2xl font-semibold ${darkMode ? 'text-white' : 'text-[#111827]'} mb-1`}>
                  POS Integratie Overzicht
                </h1>
                <p className={`${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  Real-time status van alle restaurant POS integraties
                </p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className={`inline-flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'border border-[#2a2d3a] text-white bg-[#1c1e27] hover:bg-[#252833]'
                    : 'border border-gray-200 text-[#6B7280] bg-white hover:bg-gray-50 shadow-sm'
                } ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 ${refreshing ? 'animate-spin' : ''} ${darkMode ? 'text-[#BBBECC]' : 'text-gray-500'}`} />
                {refreshing ? 'Vernieuwen...' : 'Ververs Status'}
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
                    <BuildingStorefrontIcon className={darkMode ? "h-6 w-6 text-black" : "h-6 w-6 text-green-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      TOTAAL RESTAURANTS
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {activeRestaurants.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-emerald-500/20" : "p-3 rounded-lg bg-emerald-50"}>
                    <CpuChipIcon className={darkMode ? "h-6 w-6 text-emerald-400" : "h-6 w-6 text-emerald-600"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      POS VERBONDEN
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {connectedCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-[#2BE89A]/20" : "p-3 rounded-lg bg-green-50"}>
                    <WifiIcon className={darkMode ? "h-6 w-6 text-[#2BE89A]" : "h-6 w-6 text-green-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      ACTIEF
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {activeCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`p-6 rounded-xl ${
                darkMode 
                  ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                  : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center">
                  <div className={darkMode ? "p-3 rounded-lg bg-red-500/20" : "p-3 rounded-lg bg-red-50"}>
                    <ExclamationTriangleIcon className={darkMode ? "h-6 w-6 text-red-400" : "h-6 w-6 text-red-500"} />
                  </div>
                  <div className="ml-4">
                    <p className={`text-xs font-medium uppercase tracking-wider ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                      NIET VERBONDEN
                    </p>
                    <p className={`text-2xl font-bold mt-2 ${darkMode ? 'text-white' : 'text-[#111827]'}`}>
                      {activeRestaurants.length - connectedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurant POS Status List */}
            <div className={`rounded-xl overflow-hidden ${
              darkMode 
                ? 'bg-[#1c1e27] border border-[#2a2d3a]'
                : 'bg-white shadow-sm'
            }`}>
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'border-[#2a2d3a] bg-[#0A0B0F]' : 'border-gray-200 bg-gray-50'
              }`}>
                <h2 className={`text-lg font-semibold ${
                  darkMode ? 'text-white' : 'text-[#111827]'
                }`}>
                  Restaurant POS Status
                </h2>
              </div>

              <div className={`divide-y ${darkMode ? 'divide-[#2a2d3a]' : 'divide-gray-200'}`}>
                {activeRestaurants.map((restaurant) => {
                  const posStatus = posStatuses[restaurant.id]
                  return (
                    <div 
                      key={restaurant.id} 
                      className={`p-6 transition-all ${
                        darkMode ? 'hover:bg-[#0A0B0F]' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-lg overflow-hidden flex-shrink-0 bg-white relative">
                            {restaurant.logo ? (
                              <img
                                src={restaurant.logo}
                                alt={restaurant.name}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <div className="h-full w-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-lg">
                                {restaurant.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-base font-semibold ${
                              darkMode ? 'text-white' : 'text-[#111827]'
                            }`}>
                              {restaurant.name}
                            </h3>
                            <div className="mt-1 flex items-center space-x-4 text-sm">
                              <span className={darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>
                                {restaurant.location}
                              </span>
                              {posStatus && posStatus.connected && (
                                <>
                                  <span className={darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}>
                                    {posStatus.posType}
                                  </span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    posStatus.environment === 'production'
                                      ? 'bg-green-100 text-green-700'
                                      : 'bg-yellow-100 text-yellow-700'
                                  }`}>
                                    {posStatus.environment === 'production' ? 'Productie' : posStatus.environment}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            {posStatus && posStatus.connected ? (
                              posStatus.isActive ? (
                                <>
                                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                                  <span className="text-sm font-medium text-green-600">Actief</span>
                                </>
                              ) : (
                                <>
                                  <ClockIcon className="h-5 w-5 text-yellow-500 mr-2" />
                                  <span className="text-sm font-medium text-yellow-600">Inactief</span>
                                </>
                              )
                            ) : (
                              <>
                                <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                                <span className="text-sm font-medium text-red-600">Niet Verbonden</span>
                              </>
                            )}
                          </div>
                          
                          <Link
                            href={posStatus && posStatus.connected 
                              ? `/restaurants/${restaurant.id}` 
                              : `/restaurants/${restaurant.id}/onboarding?step=3`
                            }
                            className={`inline-flex items-center px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                              posStatus && posStatus.connected
                                ? darkMode
                                  ? 'bg-[#0A0B0F] border border-[#2a2d3a] text-white hover:bg-[#1a1c25]'
                                  : 'bg-white border border-gray-200 text-[#6B7280] hover:bg-gray-50'
                                : 'bg-green-500 text-white hover:bg-green-600'
                            }`}
                          >
                            {posStatus && posStatus.connected ? 'Bekijk Details' : 'Configureer POS'}
                            <ChevronRightIcon className="ml-1 h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Empty State */}
            {activeRestaurants.length === 0 && (
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
                  Geen actieve restaurants
                </h3>
                <p className={`mt-2 text-sm ${darkMode ? 'text-[#BBBECC]' : 'text-[#6B7280]'}`}>
                  Begin met het toevoegen van je eerste restaurant partner.
                </p>
                <Link
                  href="/restaurants/new"
                  className="mt-6 inline-flex items-center px-4 py-2.5 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-all"
                >
                  <BuildingStorefrontIcon className="mr-2 h-5 w-5" />
                  Voeg Restaurant Toe
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}