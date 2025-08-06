import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  UserGroupIcon,
  CreditCardIcon,
  WifiIcon,
  StarIcon,
  QrCodeIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import RestaurantDeleteModal from './RestaurantDeleteModal'
import { useRestaurants } from '../contexts/RestaurantsContext'

const OnboardingSteps = [
  {
    id: 1,
    name: 'Personeel',
    description: 'Restaurant gebruikers toevoegen',
    icon: UserGroupIcon,
  },
  {
    id: 2,
    name: 'Stripe',
    description: 'Betaalaccount koppelen',
    icon: CreditCardIcon,
  },
  {
    id: 3,
    name: 'POS API',
    description: 'Kassasysteem integreren',
    icon: WifiIcon,
  },
  {
    id: 4,
    name: 'QR houders',
    description: 'Tafel QR codes configureren',
    icon: QrCodeIcon,
  },
  {
    id: 5,
    name: 'Google Reviews',
    description: 'Review link toevoegen',
    icon: StarIcon,
  }
]

export default function OnboardingSidebar({ 
  currentStep, 
  completedSteps = [], 
  onStepChange, 
  restaurant,
  children 
}) {
  const router = useRouter()
  const { deleteRestaurant } = useRestaurants()
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const getStepStatus = (stepId) => {
    if (completedSteps.includes(stepId)) return 'completed'
    if (stepId === currentStep) return 'current'
    
    // For archived restaurants, check what was previously accessible
    if (restaurant?.deleted) {
      // Check localStorage to see which steps were visited
      const savedData = typeof window !== 'undefined' 
        ? localStorage.getItem(`onboarding_${restaurant?.id}`)
        : null
      const parsedData = savedData ? JSON.parse(savedData) : null
      
      // If we have saved data, any step that was started is available
      if (parsedData) {
        // Check if this step has any data
        if (stepId === 1 && parsedData.personnelData) return 'available'
        if (stepId === 2 && parsedData.stripeData) return 'available'
        if (stepId === 3 && parsedData.posData) return 'available'
        if (stepId === 4 && parsedData.qrStandData) return 'available'
        if (stepId === 5 && parsedData.googleReviewData) return 'available'
      }
      
      return 'locked'
    }
    
    // For active restaurants: all steps are available
    // Users can complete them in any order they prefer
    return 'available'
  }

  const handleStepClick = (stepId) => {
    const status = getStepStatus(stepId)
    if (status !== 'locked' && onStepChange) {
      onStepChange(stepId)
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-[#1c1e27] border-b border-[#2a2d3a] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="mr-3 p-2 rounded-lg bg-[#0A0B0F] text-white hover:bg-[#252833] transition"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-semibold text-white">{restaurant?.name} Onboarding</h1>
              <p className="text-sm text-[#BBBECC]">Stap {currentStep} van 4</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-64px)] bg-[#0A0B0F]">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-80 bg-[#1c1e27] border-r border-[#2a2d3a] sticky 2xl:fixed top-16 2xl:top-16 h-[calc(100vh-64px)] flex flex-col">
          <div className="p-6 flex flex-col h-full">
            {/* Header */}
            <div className="mb-6">
              <Link
                href="/restaurants"
                className="inline-flex items-center px-4 py-2 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-[#BBBECC] hover:text-white hover:bg-[#1a1c25] hover:border-[#2BE89A]/30 transition-all text-sm font-medium mb-4 group"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Terug naar restaurants
              </Link>
              <div>
                <h2 className="text-xl font-bold text-white">{restaurant?.name}</h2>
                <p className="text-sm text-[#BBBECC]">Restaurant Onboarding</p>
              </div>
            </div>

            {/* Progress Overview */}
            <div className="mb-6 bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 rounded-xl p-4 border border-[#2BE89A]/30">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white flex items-center">
                  <div className="w-2 h-2 bg-[#2BE89A] rounded-full mr-2 animate-pulse"></div>
                  Voortgang
                </span>
                <span className="text-xs font-medium text-[#2BE89A]">
                  {completedSteps.length}/5
                </span>
              </div>
              <div className="w-full bg-[#0A0B0F] rounded-full h-3 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] h-3 rounded-full transition-all duration-500 ease-out shadow-lg relative"
                  style={{ width: `${(completedSteps.filter(step => step <= 3).length / 3) * 100}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Scrollable Steps Section */}
            <div className="flex-1 overflow-y-auto mb-4 scrollbar-thin scrollbar-track-[#0A0B0F] scrollbar-thumb-[#2a2d3a] hover:scrollbar-thumb-[#2BE89A]/30">
              <div className="space-y-2 pr-2">
                {/* Required Steps */}
                {OnboardingSteps.slice(0, 3).map((step) => {
                  const status = getStepStatus(step.id)
                  const isClickable = status !== 'locked'
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 border-2 border-[#2BE89A] shadow-lg shadow-[#2BE89A]/20 cursor-pointer'
                          : status === 'completed'
                          ? 'bg-[#0A0B0F] border border-[#2BE89A]/50 hover:bg-[#1a1c25] hover:border-[#2BE89A] cursor-pointer'
                          : status === 'available'
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25] hover:border-[#2BE89A]/30 cursor-pointer'
                          : 'bg-[#0A0B0F]/50 border border-[#2a2d3a]/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2.5 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] shadow-md'
                            : status === 'completed'
                            ? 'bg-[#2BE89A]'
                            : status === 'available'
                            ? 'bg-gradient-to-r from-[#1c1e27] to-[#252833] group-hover:from-[#2BE89A]/10 group-hover:to-[#4FFFB0]/10'
                            : 'bg-[#1c1e27]/50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' ? 'text-black' 
                              : status === 'available' ? 'text-white group-hover:text-[#2BE89A]' 
                              : 'text-[#BBBECC]/50'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' ? 'text-white' : 'text-[#BBBECC]'
                            }`}>
                              {step.name}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed'
                                ? 'bg-[#2BE89A]'
                                : status === 'current'
                                ? 'bg-[#818CF8]'
                                : status === 'available'
                                ? 'bg-[#FB923C]'
                                : 'bg-[#2a2d3a]'
                            }`} />
                          </div>
                          <p className="text-sm text-[#BBBECC] mt-1">{step.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}

                {/* Optional Section Separator */}
                <div className="py-4">
                  <div className="flex items-center">
                    <div className="flex-1 border-t border-[#2a2d3a]"></div>
                    <span className="px-3 text-xs font-medium text-orange-300 bg-orange-500/20 rounded-full">
                      Kun je ook later doen
                    </span>
                    <div className="flex-1 border-t border-[#2a2d3a]"></div>
                  </div>
                </div>

                {/* Optional Steps */}
                {OnboardingSteps.slice(3).map((step) => {
                  const status = getStepStatus(step.id)
                  const isClickable = status !== 'locked'
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(step.id)}
                      disabled={!isClickable}
                      className={`w-full text-left p-4 rounded-xl transition-all duration-200 group ${
                        status === 'current'
                          ? 'bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 border-2 border-[#2BE89A] shadow-lg shadow-[#2BE89A]/20 cursor-pointer'
                          : status === 'completed'
                          ? 'bg-[#0A0B0F] border border-[#2BE89A]/50 hover:bg-[#1a1c25] hover:border-[#2BE89A] cursor-pointer'
                          : status === 'available'
                          ? 'bg-[#0A0B0F] border border-[#2a2d3a] hover:bg-[#1a1c25] hover:border-[#2BE89A]/30 cursor-pointer'
                          : 'bg-[#0A0B0F]/50 border border-[#2a2d3a]/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className={`p-2.5 rounded-lg mr-3 transition-all ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] shadow-md'
                            : status === 'completed'
                            ? 'bg-[#2BE89A]'
                            : status === 'available'
                            ? 'bg-gradient-to-r from-[#1c1e27] to-[#252833] group-hover:from-[#2BE89A]/10 group-hover:to-[#4FFFB0]/10'
                            : 'bg-[#1c1e27]/50'
                        }`}>
                          {status === 'completed' ? (
                            <CheckCircleIcon className="h-5 w-5 text-black" />
                          ) : (
                            <step.icon className={`h-5 w-5 ${
                              status === 'current' ? 'text-black' 
                              : status === 'available' ? 'text-white group-hover:text-[#2BE89A]' 
                              : 'text-[#BBBECC]/50'
                            }`} />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' ? 'text-white' : 'text-[#BBBECC]'
                            }`}>
                              {step.name}
                            </h3>
                            <div className={`w-2 h-2 rounded-full ${
                              status === 'completed'
                                ? 'bg-[#2BE89A]'
                                : status === 'current'
                                ? 'bg-[#818CF8]'
                                : status === 'available'
                                ? 'bg-[#FB923C]'
                                : 'bg-[#2a2d3a]'
                            }`} />
                          </div>
                          <p className="text-sm text-[#BBBECC] mt-1">{step.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Fixed Bottom Section - Help & Delete */}
            <div className="space-y-3 flex-shrink-0">
              <div className="p-4 bg-gradient-to-br from-[#635BFF]/10 via-[#7C3AED]/5 to-[#635BFF]/10 rounded-xl border border-[#635BFF]/30 backdrop-blur-sm">
                <div className="flex items-start">
                  <div className="p-2 bg-gradient-to-r from-[#635BFF] to-[#7C3AED] rounded-lg mr-3 shadow-lg">
                    <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-white mb-1">Onboarding handleiding</h4>
                    <p className="text-xs text-[#BBBECC] mb-3">
                      Vergeten hoe onboarding werkt? Bekijk de stap-voor-stap guide.
                    </p>
                    <Link
                      href="/knowledge-base#restaurant-onboarding"
                      className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-[#635BFF] to-[#7C3AED] text-white text-xs font-medium rounded-lg hover:opacity-90 transition-all group"
                    >
                      Bekijk handleiding
                      <svg className="h-3 w-3 ml-1.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Delete button for non-onboarded restaurants (not shown if archived) */}
              {restaurant && !restaurant.isOnboarded && !restaurant.deleted && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full p-2.5 bg-red-500/10 text-red-400 text-xs font-medium rounded-lg hover:bg-red-500/20 transition-colors border border-red-500/30 flex items-center justify-center"
                >
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Restaurant Verwijderen
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Sidebar */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileSidebarOpen(false)} />
            <div className="relative w-80 bg-[#1c1e27] h-full overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Onboarding Steps</h2>
                  <button
                    onClick={() => setIsMobileSidebarOpen(false)}
                    className="p-2 rounded-lg bg-[#0A0B0F] text-[#BBBECC] hover:text-white transition"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Progress Overview */}
                <div className="mb-6 bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[#BBBECC]">Voortgang</span>
                    <span className="text-xs font-medium text-[#2BE89A]">
                      {completedSteps.length}/5
                    </span>
                  </div>
                  <div className="w-full bg-[#1c1e27] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedSteps.filter(step => step <= 3).length / 3) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Steps */}
                <div className="space-y-2">
                  {OnboardingSteps.map((step) => {
                    const status = getStepStatus(step.id)
                    const isClickable = status !== 'locked'
                    
                    return (
                      <button
                        key={step.id}
                        onClick={() => {
                          handleStepClick(step.id)
                          setIsMobileSidebarOpen(false)
                        }}
                        disabled={!isClickable}
                        className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                          status === 'current'
                            ? 'bg-gradient-to-r from-[#2BE89A]/20 to-[#4FFFB0]/20 border-2 border-[#2BE89A]'
                            : status === 'completed'
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a]'
                            : status === 'available'
                            ? 'bg-[#0A0B0F] border border-[#2a2d3a] cursor-pointer'
                            : 'bg-[#0A0B0F] border border-[#2a2d3a] opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start">
                          <div className={`p-2 rounded-lg mr-3 ${
                            status === 'current'
                              ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]'
                              : status === 'completed'
                              ? 'bg-[#2BE89A]'
                              : 'bg-[#1c1e27]'
                          }`}>
                            {status === 'completed' ? (
                              <CheckCircleIcon className="h-5 w-5 text-black" />
                            ) : (
                              <step.icon className={`h-5 w-5 ${
                                status === 'current' ? 'text-black' : 'text-[#BBBECC]'
                              }`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-medium ${
                              status === 'current' || status === 'completed' ? 'text-white' : 'text-[#BBBECC]'
                            }`}>
                              {step.name}
                            </h3>
                            <p className="text-sm text-[#BBBECC] mt-1">{step.description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto 2xl:ml-80">
          <div className="p-6 lg:p-8 max-w-5xl mx-auto">
            {children}
          </div>
        </div>
      </div>
      
      {/* Delete Modal */}
      {showDeleteModal && restaurant && (
        <RestaurantDeleteModal
          restaurant={restaurant}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            deleteRestaurant(restaurant.id)
            router.push('/restaurants')
          }}
        />
      )}
    </>
  )
}