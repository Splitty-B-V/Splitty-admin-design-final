import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useRestaurants } from '../contexts/RestaurantsContext'
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WifiIcon,
  ArrowPathIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline'

export default function POSIntegration() {
  const { restaurants } = useRestaurants()
  const [posStatuses, setPosStatuses] = useState({})
  const [refreshing, setRefreshing] = useState(false)

  // Load POS data from localStorage for each restaurant
  useEffect(() => {
    const loadPosStatuses = () => {
      const statuses = {}
      
      restaurants.forEach(restaurant => {
        if (!restaurant.deleted) {
          // Try to load onboarding data
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
                  lastSync: new Date().toISOString(), // In real app, this would come from server
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
    
    // Set up interval to refresh every 5 seconds (simulating real-time updates)
    const interval = setInterval(loadPosStatuses, 5000)
    
    return () => clearInterval(interval)
  }, [restaurants])

  const handleRefresh = () => {
    setRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false)
      // Reload POS statuses
      const event = new Event('storage')
      window.dispatchEvent(event)
    }, 1000)
  }

  const getStatusIcon = (status) => {
    if (!status || !status.connected) {
      return <XCircleIcon className="h-5 w-5 text-red-400" />
    }
    if (!status.isActive) {
      return <ClockIcon className="h-5 w-5 text-yellow-400" />
    }
    return <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
  }

  const getStatusText = (status) => {
    if (!status || !status.connected) {
      return 'Niet Verbonden'
    }
    if (!status.isActive) {
      return 'Inactief'
    }
    return 'Actief'
  }

  const getStatusColor = (status) => {
    if (!status || !status.connected) {
      return 'bg-red-500/20 text-red-400 border-red-500/30'
    }
    if (!status.isActive) {
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    }
    return 'bg-[#2BE89A]/20 text-[#2BE89A] border-[#2BE89A]/30'
  }

  const activeRestaurants = restaurants.filter(r => !r.deleted)
  const connectedCount = Object.values(posStatuses).filter(s => s.connected).length
  const activeCount = Object.values(posStatuses).filter(s => s.connected && s.isActive).length

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'POS Integratie' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white">POS Integratie Overzicht</h1>
                <p className="text-[#BBBECC] mt-1">Real-time status van alle restaurant POS integraties</p>
              </div>
              <button
                type="button"
                onClick={handleRefresh}
                className={`inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200 ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={refreshing}
              >
                <ArrowPathIcon className={`-ml-1 mr-2 h-5 w-5 text-[#BBBECC] ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Vernieuwen...' : 'Ververs Status'}
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                    <BuildingStorefrontIcon className="h-6 w-6 text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Restaurants</p>
                    <p className="text-2xl font-bold text-white">{activeRestaurants.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <CpuChipIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">POS Verbonden</p>
                    <p className="text-2xl font-bold text-white">{connectedCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#2BE89A]/20">
                    <WifiIcon className="h-6 w-6 text-[#2BE89A]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Actief</p>
                    <p className="text-2xl font-bold text-white">{activeCount}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-red-500/20">
                    <ExclamationTriangleIcon className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Niet Verbonden</p>
                    <p className="text-2xl font-bold text-white">
                      {activeRestaurants.length - connectedCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Restaurants POS Status */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Restaurant POS Status</h2>
              <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                <div className="divide-y divide-[#2a2d3a]">
                  {activeRestaurants.map((restaurant) => {
                    const posStatus = posStatuses[restaurant.id]
                    return (
                      <div key={restaurant.id} className="p-6 hover:bg-[#0A0B0F] transition">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="h-12 w-12 rounded-lg overflow-hidden bg-white flex items-center justify-center">
                              {restaurant.logo ? (
                                <img
                                  src={restaurant.logo}
                                  alt={restaurant.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold text-lg">
                                  {restaurant.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-white">{restaurant.name}</h3>
                              <p className="text-sm text-[#BBBECC]">{restaurant.location}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-6">
                            {posStatus && posStatus.connected ? (
                              <>
                                <div className="text-right">
                                  <p className="text-sm font-medium text-white">{posStatus.posType}</p>
                                  <p className="text-xs text-[#BBBECC]">
                                    {posStatus.environment === 'production' ? 'Productie' : posStatus.environment}
                                  </p>
                                </div>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(posStatus)}`}>
                                  {getStatusIcon(posStatus)}
                                  <span className="ml-1.5">{getStatusText(posStatus)}</span>
                                </span>
                              </>
                            ) : (
                              <>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(posStatus)}`}>
                                  {getStatusIcon(posStatus)}
                                  <span className="ml-1.5">{getStatusText(posStatus)}</span>
                                </span>
                              </>
                            )}
                            
                            <Link
                              href={posStatus && posStatus.connected 
                                ? `/restaurants/${restaurant.id}` 
                                : `/restaurants/${restaurant.id}/onboarding?step=3`
                              }
                              className="inline-flex items-center px-4 py-2 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white hover:bg-[#1a1c25] transition"
                            >
                              {posStatus && posStatus.connected ? 'Bekijk Details' : 'Configureer POS'}
                              <ArrowRightIcon className="ml-2 h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {activeRestaurants.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <BuildingStorefrontIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
                  Geen actieve restaurants gevonden.
                </p>
                <Link
                  href="/restaurants/new"
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition mt-4"
                >
                  Voeg Restaurant Toe
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}