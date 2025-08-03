import { useState } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import {
  DevicePhoneMobileIcon,
  ComputerDesktopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  WifiIcon,
  ArrowPathIcon,
  CpuChipIcon,
  CloudIcon,
  PlusIcon,
} from '@heroicons/react/24/outline'

export default function POSIntegration() {
  const [selectedRestaurant, setSelectedRestaurant] = useState('all')

  const posDevices = [
    {
      id: 'pos_001',
      name: 'Hoofd Terminal',
      restaurant: 'Limon B.V.',
      type: 'terminal',
      model: 'Verifone V400m',
      status: 'online',
      lastSeen: new Date('2025-08-02T10:45:00'),
      version: '2.3.1',
      transactions: 156,
    },
    {
      id: 'pos_002',
      name: 'Mobiel POS 1',
      restaurant: 'Limon B.V.',
      type: 'mobile',
      model: 'iPad Pro 12.9',
      status: 'online',
      lastSeen: new Date('2025-08-02T10:43:00'),
      version: '2.3.1',
      transactions: 89,
    },
    {
      id: 'pos_003',
      name: 'Bar Terminal',
      restaurant: 'Limon B.V.',
      type: 'terminal',
      model: 'Verifone V400m',
      status: 'offline',
      lastSeen: new Date('2025-08-01T23:15:00'),
      version: '2.3.0',
      transactions: 234,
    },
    {
      id: 'pos_004',
      name: 'Restaurant Terminal',
      restaurant: 'Anatolii Restaurant',
      type: 'terminal',
      model: 'Ingenico Move 5000',
      status: 'online',
      lastSeen: new Date('2025-08-02T10:42:00'),
      version: '2.3.1',
      transactions: 67,
    },
    {
      id: 'pos_005',
      name: 'Mobiel POS',
      restaurant: 'Viresh Kewalbansing',
      type: 'mobile',
      model: 'Samsung Galaxy Tab S8',
      status: 'online',
      lastSeen: new Date('2025-08-02T10:40:00'),
      version: '2.3.1',
      transactions: 45,
    },
    {
      id: 'pos_006',
      name: 'Hoofd Terminal',
      restaurant: 'Loetje',
      type: 'terminal',
      model: 'Verifone V400m',
      status: 'online',
      lastSeen: new Date('2025-08-02T10:44:00'),
      version: '2.3.1',
      transactions: 198,
    },
    {
      id: 'pos_007',
      name: 'Keuken Display',
      restaurant: 'Restaurant Stefan',
      type: 'display',
      model: 'Kitchen Display System',
      status: 'maintenance',
      lastSeen: new Date('2025-07-30T14:00:00'),
      version: '2.2.5',
      transactions: 0,
    },
  ]

  const integrations = [
    {
      name: 'Verifone Integratie',
      status: 'active',
      description: 'Verbind met Verifone betaalterminals',
      features: ['Kaartbetalingen', 'NFC/Contactloos', 'Bonnen printen'],
      connectedDevices: 4,
    },
    {
      name: 'Ingenico Connect',
      status: 'active',
      description: 'Ondersteuning voor Ingenico betaalapparaten',
      features: ['Multi-valuta', 'Chip & PIN', 'Mobiele betalingen'],
      connectedDevices: 1,
    },
    {
      name: 'Keuken Display Systeem',
      status: 'beta',
      description: 'Real-time bestellingen weergave voor keukenpersoneel',
      features: ['Order tracking', 'Tijdsbeheer', 'Status updates'],
      connectedDevices: 1,
    },
    {
      name: 'Tablet POS',
      status: 'active',
      description: 'Mobiele kassa voor tablets',
      features: ['Tafel-side bestellen', 'Rekening splitsen', 'Offline modus'],
      connectedDevices: 2,
    },
  ]

  const restaurants = ['all', 'Limon B.V.', 'Anatolii Restaurant', 'Viresh Kewalbansing', 'Loetje', 'Restaurant Stefan']

  const filteredDevices = posDevices.filter((device) => {
    return selectedRestaurant === 'all' || device.restaurant === selectedRestaurant
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online':
        return <CheckCircleIcon className="h-5 w-5 text-[#2BE89A]" />
      case 'offline':
        return <XCircleIcon className="h-5 w-5 text-red-400" />
      case 'maintenance':
        return <ClockIcon className="h-5 w-5 text-yellow-400" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-[#2BE89A]/20 text-[#2BE89A]'
      case 'offline':
        return 'bg-red-500/20 text-red-400'
      case 'maintenance':
        return 'bg-yellow-500/20 text-yellow-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'terminal':
        return <ComputerDesktopIcon className="h-8 w-8 text-[#BBBECC]" />
      case 'mobile':
        return <DevicePhoneMobileIcon className="h-8 w-8 text-[#BBBECC]" />
      case 'display':
        return <ComputerDesktopIcon className="h-8 w-8 text-[#BBBECC]" />
      default:
        return <CpuChipIcon className="h-8 w-8 text-[#BBBECC]" />
    }
  }

  const formatDate = (date) => {
    const diff = new Date() - date
    const minutes = Math.floor(diff / 60000)
    
    if (minutes < 1) return 'Zojuist'
    if (minutes < 60) return `${minutes}m geleden`
    if (minutes < 1440) return `${Math.floor(minutes / 60)}u geleden`
    return `${Math.floor(minutes / 1440)}d geleden`
  }

  const handleRefresh = () => {
    console.log('Refreshing POS devices...')
  }

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
                <h1 className="text-3xl font-bold text-white">POS Integratie</h1>
                <p className="text-[#BBBECC] mt-1">Beheer je kassa systemen en betaalterminals</p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="inline-flex items-center px-4 py-3 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                >
                  <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5 text-[#BBBECC]" />
                  Ververs Status
                </button>
                <Link
                  href="/pos/new"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                  Nieuwe POS Toevoegen
                </Link>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                    <CpuChipIcon className="h-6 w-6 text-black" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Totaal Apparaten</p>
                    <p className="text-2xl font-bold text-white">{filteredDevices.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-[#2BE89A]/20">
                    <WifiIcon className="h-6 w-6 text-[#2BE89A]" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Online</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredDevices.filter(d => d.status === 'online').length}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-blue-500/20">
                    <CloudIcon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Integraties</p>
                    <p className="text-2xl font-bold text-white">{integrations.length}</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
                <div className="flex items-center">
                  <div className="p-3 rounded-lg bg-purple-500/20">
                    <CheckCircleIcon className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-[#BBBECC] text-sm">Transacties Vandaag</p>
                    <p className="text-2xl font-bold text-white">
                      {filteredDevices.reduce((sum, d) => sum + d.transactions, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Beschikbare Integraties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((integration) => (
                  <div key={integration.name} className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#2BE89A]/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-white">{integration.name}</h3>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          integration.status === 'active'
                            ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {integration.status === 'active' ? 'Actief' : 'Beta'}
                      </span>
                    </div>
                    <p className="text-sm text-[#BBBECC] mb-4">{integration.description}</p>
                    <div className="space-y-3">
                      <div className="text-sm text-[#BBBECC]">Functies:</div>
                      <div className="flex flex-wrap gap-2">
                        {integration.features.map((feature) => (
                          <span
                            key={feature}
                            className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#0F1117] border border-[#2a2d3a] text-[#BBBECC]"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[#2a2d3a]">
                      <p className="text-sm text-[#BBBECC]">
                        Verbonden apparaten: <span className="text-white font-medium">{integration.connectedDevices}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter */}
            <div className="bg-[#1c1e27] p-6 rounded-xl border border-[#2a2d3a]">
              <div className="max-w-xs">
                <label htmlFor="restaurant" className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Filter op Restaurant
                </label>
                <select
                  id="restaurant"
                  name="restaurant"
                  value={selectedRestaurant}
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
                >
                  {restaurants.map((restaurant) => (
                    <option key={restaurant} value={restaurant}>
                      {restaurant === 'all' ? 'Alle Restaurants' : restaurant}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Devices Grid */}
            <div>
              <h2 className="text-xl font-semibold text-white mb-4">Verbonden Apparaten</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredDevices.map((device) => (
                  <div
                    key={device.id}
                    className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden hover:border-[#2BE89A]/30 transition-all duration-200 group"
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        {getDeviceIcon(device.type)}
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            device.status
                          )}`}
                        >
                          {getStatusIcon(device.status)}
                          <span className="ml-1 capitalize">{device.status}</span>
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-1 group-hover:text-[#2BE89A] transition-colors">{device.name}</h3>
                      <p className="text-sm text-[#BBBECC] mb-4">{device.restaurant}</p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#BBBECC]">Model</span>
                          <span className="text-white">{device.model}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#BBBECC]">Versie</span>
                          <span className="text-white">{device.version}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#BBBECC]">Laatst Gezien</span>
                          <span className="text-white">{formatDate(device.lastSeen)}</span>
                        </div>
                        {device.type !== 'display' && (
                          <div className="flex justify-between">
                            <span className="text-[#BBBECC]">Transacties Vandaag</span>
                            <span className="text-[#2BE89A] font-medium">{device.transactions}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-[#2a2d3a]">
                        <div className="flex justify-between">
                          <button className="text-[#2BE89A] hover:text-[#4FFFB0] text-sm font-medium transition-colors">
                            Configureren
                          </button>
                          <button className="text-[#BBBECC] hover:text-white text-sm transition-colors">
                            Logs
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Empty State */}
            {filteredDevices.length === 0 && (
              <div className="text-center py-16 bg-[#1c1e27] rounded-xl border border-[#2a2d3a]">
                <CpuChipIcon className="mx-auto h-12 w-12 text-[#BBBECC]" />
                <p className="mt-4 text-[#BBBECC]">
                  Geen POS apparaten gevonden voor het geselecteerde restaurant.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}