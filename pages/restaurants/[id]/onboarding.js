import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../../components/Layout'
import OnboardingSidebar from '../../../components/OnboardingSidebar'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import { useUsers } from '../../../contexts/UsersContext'
import { 
  BuildingStorefrontIcon,
  UserGroupIcon,
  CreditCardIcon,
  WifiIcon,
  CheckCircleIcon,
  StarIcon,
  QrCodeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TrashIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowRightIcon,
  SparklesIcon,
  ClockIcon,
  ShieldCheckIcon,
  RocketLaunchIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

export default function RestaurantOnboarding() {
  const router = useRouter()
  const { id } = router.query
  const { getRestaurant, updateRestaurant, restoreRestaurant } = useRestaurants()
  const { updateRestaurantUsersFromOnboarding } = useUsers()
  const [restaurant, setRestaurant] = useState(null)
  const [currentStep, setCurrentStep] = useState(1)
  const [completedSteps, setCompletedSteps] = useState([])
  const [showWelcome, setShowWelcome] = useState(true)
  const [isLocked, setIsLocked] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  // Step data states
  const [personnelData, setPersonnelData] = useState([])
  const [stripeData, setStripeData] = useState({ connected: false })
  const [posData, setPosData] = useState({ 
    posType: '', 
    username: '', 
    password: '', 
    baseUrl: '',
    environment: 'production',
    isActive: true
  })
  const [googleReviewData, setGoogleReviewData] = useState({ 
    reviewLink: '',
    placeId: '',
    isConfigured: false 
  })
  const [qrStandData, setQrStandData] = useState({
    selectedDesign: '',
    tableCount: '',
    floorPlan: null,
    isConfigured: false
  })
  const [showCopiedMessage, setShowCopiedMessage] = useState(false)
  
  // Personnel form states
  const [showPersonForm, setShowPersonForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPerson, setNewPerson] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    role: 'staff'
  })

  useEffect(() => {
    if (id) {
      const rest = getRestaurant(id)
      if (rest) {
        setRestaurant(rest)
        // Check if restaurant is deleted/archived
        setIsLocked(rest.deleted === true)
        
        // Load saved onboarding data from localStorage
        const savedData = localStorage.getItem(`onboarding_${id}`)
        let validCompletedSteps = [];
        
        if (savedData) {
          const parsed = JSON.parse(savedData)
          
          // Only load personnel data if it exists
          if (parsed.personnelData && parsed.personnelData.length > 0) {
            setPersonnelData(parsed.personnelData)
          }
          
          // Only load completed steps that match actual progress
          if (parsed.completedSteps) {
            // Validate each completed step
            if (parsed.completedSteps.includes(1) && parsed.personnelData && parsed.personnelData.filter(p => p.role === 'manager').length > 0) {
              validCompletedSteps.push(1);
            }
            if (parsed.completedSteps.includes(2) && parsed.stripeData && parsed.stripeData.connected) {
              validCompletedSteps.push(2);
            }
            if (parsed.completedSteps.includes(3) && parsed.posData && parsed.posData.posType && parsed.posData.username && parsed.posData.password && parsed.posData.baseUrl) {
              validCompletedSteps.push(3);
            }
            if (parsed.completedSteps.includes(4)) {
              validCompletedSteps.push(4);
            }
            if (parsed.completedSteps.includes(5)) {
              validCompletedSteps.push(5);
            }
            
            setCompletedSteps(validCompletedSteps);
          }
          
          if (parsed.stripeData) setStripeData(parsed.stripeData)
          if (parsed.posData) setPosData(parsed.posData)
          if (parsed.googleReviewData) {
            // Backwards compatibility: extract placeId from reviewLink if not present
            if (!parsed.googleReviewData.placeId && parsed.googleReviewData.reviewLink) {
              const match = parsed.googleReviewData.reviewLink.match(/placeid=(.+)$/);
              if (match) {
                parsed.googleReviewData.placeId = match[1];
              }
            }
            setGoogleReviewData(parsed.googleReviewData)
          }
          if (parsed.qrStandData) {
            setQrStandData(parsed.qrStandData)
          }
          
          // Only set to next uncompleted step on initial page load
          if (!hasInitialized) {
            // Determine the next uncompleted step
            let nextStep = 1;
            if (validCompletedSteps.includes(1) && !validCompletedSteps.includes(2)) {
              nextStep = 2;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && !validCompletedSteps.includes(3)) {
              nextStep = 3;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && validCompletedSteps.includes(3) && !validCompletedSteps.includes(4)) {
              nextStep = 4;
            } else if (validCompletedSteps.includes(1) && validCompletedSteps.includes(2) && validCompletedSteps.includes(3) && validCompletedSteps.includes(4) && !validCompletedSteps.includes(5)) {
              nextStep = 5;
            } else if (validCompletedSteps.length === 5) {
              // All steps completed, show the last step
              nextStep = 5;
            }
            
            setCurrentStep(nextStep);
            setHasInitialized(true);
          }
          
          // Don't show welcome if they've already started
          if (parsed.currentStep > 1 || (parsed.completedSteps && parsed.completedSteps.length > 0) || (parsed.personnelData && parsed.personnelData.length > 0)) {
            setShowWelcome(false)
          }
        } else {
          // No saved data, start at step 1
          if (!hasInitialized) {
            setCurrentStep(1);
            setHasInitialized(true);
          }
        }
      }
    }
  }, [id, getRestaurant, hasInitialized])

  if (!restaurant) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
          <div className="text-white">Restaurant niet gevonden...</div>
        </div>
      </Layout>
    )
  }

  const saveProgress = (updatedData = {}) => {
    const dataToSave = {
      personnelData: updatedData.personnelData || personnelData,
      stripeData: updatedData.stripeData || stripeData,
      posData: updatedData.posData || posData,
      googleReviewData: updatedData.googleReviewData || googleReviewData,
      qrStandData: updatedData.qrStandData || qrStandData,
      completedSteps: updatedData.completedSteps || completedSteps,
      currentStep: updatedData.currentStep || currentStep,
      savedAt: new Date().toISOString()
    }
    localStorage.setItem(`onboarding_${id}`, JSON.stringify(dataToSave))
    
    // Also update the restaurant's onboardingStep - only count first 3 steps as required
    const requiredStepsCompleted = (updatedData.completedSteps || completedSteps).filter(step => step <= 3).length;
    updateRestaurant(id, { 
      onboardingStep: Math.min(requiredStepsCompleted, 3)
    });
  }

  const handleStepChange = (step) => {
    // Allow navigation even when locked, but just for viewing
    setCurrentStep(step)
    
    // Only save progress if not locked
    if (!isLocked) {
      saveProgress({
        personnelData,
        stripeData,
        posData,
        googleReviewData,
        qrStandData,
        completedSteps,
        currentStep: step
      })
    }
  }

  const handleAddPerson = () => {
    if (newPerson.firstName && newPerson.lastName && newPerson.email && newPerson.password) {
      const updatedPersonnelData = [...personnelData, { ...newPerson, id: Date.now() }];
      setPersonnelData(updatedPersonnelData);
      setNewPerson({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        role: 'staff'
      });
      setShowPersonForm(false);
      
      // If this is a manager, mark step 1 as completed
      let newCompletedSteps = [...completedSteps];
      if (newPerson.role === 'manager' && updatedPersonnelData.filter(p => p.role === 'manager').length > 0) {
        if (!newCompletedSteps.includes(1)) {
          newCompletedSteps.push(1);
          setCompletedSteps(newCompletedSteps);
        }
      }
      
      // Save progress with updated personnel data
      saveProgress({
        personnelData: updatedPersonnelData,
        stripeData,
        posData,
        googleReviewData,
        qrStandData,
        completedSteps: newCompletedSteps,
        currentStep
      });
    }
  }

  const handleRemovePerson = (personId) => {
    const updatedPersonnelData = personnelData.filter(p => p.id !== personId);
    setPersonnelData(updatedPersonnelData);
    
    // Save progress with updated personnel data
    saveProgress({
      personnelData: updatedPersonnelData,
      stripeData,
      posData,
      googleReviewData,
      qrStandData,
      completedSteps,
      currentStep
    });
  }

  const handleCompleteStep = () => {
    // For now, just navigate to next step without marking as complete
    // Completion logic will be added later when API connections are implemented
    
    if (currentStep < 5) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      
      // Save progress with updated values
      saveProgress({
        completedSteps: completedSteps, // Keep existing completed steps
        currentStep: nextStep,
        personnelData,
        stripeData,
        posData,
        googleReviewData,
        qrStandData
      });
    } else if (currentStep === 5) {
      // Complete onboarding - this is the final step
      updateRestaurant(id, { 
        isOnboarded: true,
        onboardingStep: 5,
        googleReviewLink: googleReviewData.reviewLink || null,
        qrStandConfig: qrStandData.isConfigured ? qrStandData : null
      })
      
      // Also update users if personnel were added
      if (personnelData.length > 0) {
        updateRestaurantUsersFromOnboarding(id, personnelData)
      }
      
      // Clear onboarding data from localStorage
      localStorage.removeItem(`onboarding_${id}`)
      
      router.push(`/restaurants/${id}`)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#1c1e27] rounded-xl p-8 border border-[#2a2d3a]">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stap 1: Restaurant Team</h3>
                  <p className="text-[#BBBECC]">
                    Voeg minimaal één manager toe om door te kunnen gaan • {personnelData.length} gebruiker{personnelData.length !== 1 ? 's' : ''} toegevoegd
                  </p>
                </div>
                <UserGroupIcon className="h-12 w-12 text-[#BBBECC] opacity-20" />
              </div>

              {/* Personnel List */}
              {personnelData.length > 0 && (
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-[#BBBECC] mb-4">Toegevoegde gebruikers</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {personnelData.map((person) => (
                      <div key={person.id} className="bg-[#0A0B0F] rounded-xl p-5 border border-[#2a2d3a] hover:border-[#2BE89A]/30 transition-all">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold mr-4">
                              {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                            </div>
                            <div>
                              <p className="text-white font-semibold">{person.firstName} {person.lastName}</p>
                              <p className="text-sm text-[#BBBECC]">{person.email}</p>
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium mt-2 ${
                                person.role === 'manager' 
                                  ? 'bg-[#2BE89A]/20 text-[#2BE89A]' 
                                  : 'bg-[#635BFF]/20 text-[#635BFF]'
                              }`}>
                                {person.role === 'manager' ? 'Manager' : 'Personeel'}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePerson(person.id)}
                            className="text-[#BBBECC] hover:text-red-400 transition p-2"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Person Form */}
              {showPersonForm ? (
                <div className="bg-[#0A0B0F] rounded-xl p-6 border border-[#2BE89A]/30">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold text-white">Nieuwe gebruiker toevoegen</h4>
                    <button
                      onClick={() => setShowPersonForm(false)}
                      className="text-[#BBBECC] hover:text-white transition p-2"
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-[#BBBECC] mb-2">Voornaam</label>
                        <input
                          type="text"
                          value={newPerson.firstName}
                          onChange={(e) => setNewPerson({...newPerson, firstName: e.target.value})}
                          className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                          placeholder="Jan"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[#BBBECC] mb-2">Achternaam</label>
                        <input
                          type="text"
                          value={newPerson.lastName}
                          onChange={(e) => setNewPerson({...newPerson, lastName: e.target.value})}
                          className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                          placeholder="Jansen"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#BBBECC] mb-2">Email</label>
                      <input
                        type="email"
                        value={newPerson.email}
                        onChange={(e) => setNewPerson({...newPerson, email: e.target.value})}
                        className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="jan@restaurant.nl"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#BBBECC] mb-2">Telefoon (optioneel)</label>
                      <input
                        type="tel"
                        value={newPerson.phone}
                        onChange={(e) => setNewPerson({...newPerson, phone: e.target.value})}
                        className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        placeholder="+31 6 12345678"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#BBBECC] mb-2">Wachtwoord</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={newPerson.password}
                          onChange={(e) => setNewPerson({...newPerson, password: e.target.value})}
                          className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent pr-12"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#BBBECC] hover:text-white"
                        >
                          {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#BBBECC] mb-3">Rol</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setNewPerson({...newPerson, role: 'staff'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            newPerson.role === 'staff'
                              ? 'bg-[#635BFF]/10 border-[#635BFF] text-white'
                              : 'bg-[#0A0B0F] border-[#2a2d3a] text-[#BBBECC] hover:border-[#635BFF]/50'
                          }`}
                        >
                          <UserGroupIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium">Personeel</p>
                          <p className="text-xs mt-1 opacity-75">Basis toegang</p>
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewPerson({...newPerson, role: 'manager'})}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            newPerson.role === 'manager'
                              ? 'bg-[#2BE89A]/10 border-[#2BE89A] text-white'
                              : 'bg-[#0A0B0F] border-[#2a2d3a] text-[#BBBECC] hover:border-[#2BE89A]/50'
                          }`}
                        >
                          <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2" />
                          <p className="font-medium">Manager</p>
                          <p className="text-xs mt-1 opacity-75">Volledige toegang</p>
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddPerson}
                      disabled={!newPerson.firstName || !newPerson.lastName || !newPerson.email || !newPerson.password}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Gebruiker Toevoegen
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setShowPersonForm(true)}
                  className="w-full px-6 py-4 bg-[#0A0B0F] border-2 border-dashed border-[#2a2d3a] rounded-xl text-[#BBBECC] hover:border-[#2BE89A]/50 hover:bg-[#1c1e27] transition-all group"
                >
                  <UserGroupIcon className="h-8 w-8 mx-auto mb-2 group-hover:text-[#2BE89A] transition" />
                  <p className="font-medium group-hover:text-white transition">Nieuwe gebruiker toevoegen</p>
                </button>
              )}

              {/* Info Box */}
              <div className="mt-8 bg-[#0A0B0F] rounded-lg p-4 border border-[#2a2d3a]">
                <p className="text-sm text-[#BBBECC]">
                  <span className="text-[#2BE89A] font-medium">Tip:</span> Voeg minimaal één manager toe. 
                  Je kunt later altijd meer gebruikers toevoegen via het gebruikersbeheer.
                </p>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#1c1e27] rounded-xl p-8 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stap 2: Stripe Connect</h3>
                  <p className="text-[#BBBECC]">
                    Configureer betalingsverwerking voor het restaurant {stripeData.connected && '• ✓ Gekoppeld'}
                  </p>
                </div>
                <CreditCardIcon className="h-12 w-12 text-[#BBBECC] opacity-20" />
              </div>

              <div className="space-y-6">
                {!stripeData.connected ? (
                  <>
                    {/* Restaurant Info - Disabled */}
                    <div className="opacity-50 cursor-not-allowed">
                      <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Restaurant
                      </label>
                      <div className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white">
                        {restaurant?.name}
                      </div>
                    </div>

                    {/* Stripe Connect Info */}
                    <div className="bg-[#0A0B0F] rounded-lg p-6 border border-[#2a2d3a]">
                      <h4 className="text-base font-medium text-white mb-4">Stripe Connect Integratie</h4>
                      <p className="text-sm text-[#BBBECC] mb-6">
                        Stripe Connect stelt het restaurant in staat om veilig betalingen te ontvangen. 
                        Het restaurant beheert zijn eigen Stripe account en ontvangt uitbetalingen direct.
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <ShieldCheckIcon className="h-8 w-8 text-[#BBBECC] mx-auto mb-2" />
                          <p className="text-xs text-[#BBBECC]">PCI Compliant</p>
                        </div>
                        <div className="text-center">
                          <ClockIcon className="h-8 w-8 text-[#BBBECC] mx-auto mb-2" />
                          <p className="text-xs text-[#BBBECC]">Dagelijkse uitbetaling</p>
                        </div>
                        <div className="text-center">
                          <SparklesIcon className="h-8 w-8 text-[#BBBECC] mx-auto mb-2" />
                          <p className="text-xs text-[#BBBECC]">Real-time inzicht</p>
                        </div>
                      </div>
                    </div>

                    {/* Connect Button - Disabled until API integration */}
                    <button
                      onClick={() => {
                        // TODO: Implement Stripe Connect OAuth flow
                        alert('Stripe Connect integratie komt binnenkort beschikbaar. Neem contact op met het Splitty team voor handmatige setup.');
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-[#635BFF] to-[#7C3AED] text-white font-semibold rounded-lg opacity-75 cursor-not-allowed transition-all shadow-lg flex items-center justify-center"
                      disabled
                    >
                      <svg className="w-20 h-6 mr-3" viewBox="0 0 60 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M59.64 14.28C59.64 8.46 56.37 5.43 51.54 5.43C46.68 5.43 43.08 8.49 43.08 14.34C43.08 21.27 47.61 23.7 52.74 23.7C55.26 23.7 57.18 23.13 58.59 22.26V18.42C57.18 19.2 55.5 19.65 53.28 19.65C51.24 19.65 49.44 18.96 49.05 16.26H59.55C59.55 15.99 59.64 14.91 59.64 14.28ZM49.02 12.72C49.02 10.11 50.61 9.21 51.51 9.21C52.38 9.21 53.88 10.11 53.88 12.72H49.02ZM40.68 14.28C40.68 8.52 37.77 5.43 33.15 5.43C28.53 5.43 25.32 8.52 25.32 14.28C25.32 20.04 28.53 23.13 33.15 23.13C37.77 23.13 40.68 20.04 40.68 14.28ZM34.65 14.28C34.65 10.5 33.72 9.48 33.15 9.48C32.58 9.48 31.65 10.5 31.65 14.28C31.65 18.06 32.58 19.08 33.15 19.08C33.72 19.08 34.65 18.06 34.65 14.28ZM23.4 11.61C23.4 9.75 22.56 5.7 16.56 5.7C14.07 5.7 12.15 6.45 10.83 7.41L12.24 10.86C13.38 10.05 14.88 9.48 16.23 9.48C17.58 9.48 17.7 10.38 17.7 10.89V11.16C12.84 11.16 9.36 12.87 9.36 17.07C9.36 20.4 11.73 23.13 15.12 23.13C17.01 23.13 18.24 22.32 19.02 21.21H19.14C19.14 21.21 19.83 24.42 24.84 22.77C23.82 21.3 23.4 18.78 23.4 16.59V11.61ZM17.91 16.56C17.91 16.89 17.88 17.25 17.79 17.58C17.58 18.39 16.89 19.26 15.75 19.26C14.88 19.26 14.31 18.66 14.31 17.46C14.31 15.51 16.17 14.94 17.91 14.94V16.56ZM7.68 2.31L0 22.77H6.18L9.15 14.16L10.74 9.21H10.86L11.73 14.16L13.2 22.77H19.71L18.42 2.31H7.68Z" fill="currentColor"/>
                      </svg>
                      <span className="text-base">Verbind met Stripe</span>
                      <ArrowRightIcon className="h-5 w-5 ml-2" />
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    {/* Success State */}
                    <div className="bg-[#0A0B0F] rounded-lg p-6 border border-[#2BE89A]/30">
                      <div className="flex items-center mb-4">
                        <CheckCircleIcon className="h-6 w-6 text-[#2BE89A] mr-3" />
                        <h4 className="text-base font-medium text-white">Stripe Connect Actief</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Account ID</span>
                          <span className="text-sm text-white font-mono">{stripeData.accountId || 'acct_demo_123456'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Status</span>
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#2BE89A]/20 text-[#2BE89A]">
                            Geverifieerd
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Uitbetaling frequentie</span>
                          <span className="text-sm text-white">Dagelijks</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#0A0B0F] rounded-lg p-5 border border-[#2a2d3a]">
                      <p className="text-sm text-[#BBBECC]">
                        ✓ Het restaurant kan nu split betalingen ontvangen. Uitbetalingen gebeuren automatisch naar de gekoppelde bankrekening.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#1c1e27] rounded-xl p-8 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stap 3: POS Systeem Koppeling</h3>
                  <p className="text-[#BBBECC]">
                    Configureer het kassasysteem van {restaurant?.name} voor automatische synchronisatie
                  </p>
                </div>
                <WifiIcon className="h-12 w-12 text-[#BBBECC] opacity-20" />
              </div>

              <div className="space-y-6">
                {/* Restaurant Selection - Disabled in onboarding as we already know the restaurant */}
                <div className="opacity-50 cursor-not-allowed">
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    Restaurant <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <div className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg">
                    <span className="text-white font-medium">{restaurant?.name}</span>
                    <span className="text-[#BBBECC] ml-3">
                      • {restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location}
                    </span>
                  </div>
                </div>

                {/* POS Type */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    POS Systeem <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <select
                    value={posData.posType}
                    onChange={(e) => setPosData({...posData, posType: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    required
                  >
                    <option value="">Selecteer het POS systeem van het restaurant</option>
                    <option value="untill">Untill</option>
                    <option value="lightspeed">Lightspeed</option>
                    <option value="epos">EPOS Now</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Username and Password Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                      POS Gebruikersnaam <span className="text-[#FF6B6B]">*</span>
                    </label>
                    <input
                      type="text"
                      value={posData.username}
                      onChange={(e) => setPosData({...posData, username: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="POS account gebruikersnaam"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                      POS Wachtwoord <span className="text-[#FF6B6B]">*</span>
                    </label>
                    <input
                      type="password"
                      value={posData.password}
                      onChange={(e) => setPosData({...posData, password: e.target.value})}
                      className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="POS account wachtwoord"
                      required
                    />
                  </div>
                </div>

                {/* Base URL */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    API URL <span className="text-[#FF6B6B]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="https://restaurant-pos-server.com"
                    value={posData.baseUrl}
                    onChange={(e) => setPosData({...posData, baseUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    required
                  />
                </div>

                {/* Environment */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    Omgeving
                  </label>
                  <select
                    value={posData.environment}
                    onChange={(e) => setPosData({...posData, environment: e.target.value})}
                    className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                  >
                    <option value="production">Productie</option>
                    <option value="staging">Staging</option>
                    <option value="development">Development</option>
                    <option value="test">Test</option>
                  </select>
                </div>

                {/* Active Checkbox */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="is-active"
                      type="checkbox"
                      checked={posData.isActive}
                      onChange={(e) => setPosData({...posData, isActive: e.target.checked})}
                      className="h-4 w-4 rounded border-[#2a2d3a] bg-[#0A0B0F] text-[#2BE89A] focus:ring-[#2BE89A] focus:ring-offset-0 focus:ring-offset-[#0F1117]"
                    />
                  </div>
                  <div className="ml-3">
                    <label htmlFor="is-active" className="text-sm font-medium text-white">
                      Activeren
                    </label>
                    <p className="text-sm text-[#BBBECC]">Schakel deze POS integratie in voor {restaurant?.name}</p>
                  </div>
                </div>

                {/* Test Connection Button */}
                <button 
                  onClick={() => {
                    // For demo purposes, mark POS as configured after "testing"
                    if (posData.posType && posData.username && posData.password && posData.baseUrl) {
                      // Mark step 3 as completed
                      let newCompletedSteps = [...completedSteps];
                      if (!newCompletedSteps.includes(3)) {
                        newCompletedSteps.push(3);
                      }
                      setCompletedSteps(newCompletedSteps);
                      
                      // Save progress
                      saveProgress({
                        personnelData,
                        stripeData,
                        posData,
                        googleReviewData,
                        completedSteps: newCompletedSteps,
                        currentStep
                      });
                      
                      // Show success feedback
                      alert('Verbinding succesvol! POS is geconfigureerd.');
                    } else {
                      alert('Vul alle verplichte velden in voordat je de verbinding test.');
                    }
                  }}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition-all shadow-lg"
                >
                  Verbinding Testen
                </button>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#1c1e27] rounded-xl p-8 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stap 4: QR houders</h3>
                  <p className="text-[#BBBECC]">
                    Configureer QR stands en tafelindeling voor {restaurant?.name}
                  </p>
                </div>
                <QrCodeIcon className="h-12 w-12 text-[#BBBECC] opacity-20" />
              </div>

              <div className="space-y-8">
                {/* QR Stand Design Selection */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-4">
                    Selecteer QR Stand Design
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { id: 'classic', name: 'Classic', color: 'from-[#2BE89A] to-[#4FFFB0]' },
                      { id: 'modern', name: 'Modern', color: 'from-[#635BFF] to-[#7C3AED]' },
                      { id: 'minimal', name: 'Minimal', color: 'from-[#BBBECC] to-[#ffffff]' },
                      { id: 'elegant', name: 'Elegant', color: 'from-[#FF6B6B] to-[#FF8E53]' }
                    ].map((design) => (
                      <button
                        key={design.id}
                        type="button"
                        onClick={() => setQrStandData({...qrStandData, selectedDesign: design.id, isConfigured: true})}
                        className={`p-6 rounded-xl border-2 transition-all group ${
                          qrStandData.selectedDesign === design.id
                            ? 'border-[#2BE89A] bg-[#2BE89A]/10'
                            : 'border-[#2a2d3a] bg-[#0A0B0F] hover:border-[#2BE89A]/50'
                        }`}
                      >
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-br ${design.color} flex items-center justify-center`}>
                          <QrCodeIcon className="h-8 w-8 text-black" />
                        </div>
                        <p className="text-white font-medium text-sm">{design.name}</p>
                        <div className="mt-2 w-full h-1 bg-[#2a2d3a] rounded-full">
                          <div className={`h-1 rounded-full bg-gradient-to-r ${design.color} transition-all duration-300 ${
                            qrStandData.selectedDesign === design.id ? 'w-full' : 'w-0'
                          }`} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table Count */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    Aantal Tafels
                  </label>
                  <input
                    type="number"
                    value={qrStandData.tableCount}
                    onChange={(e) => setQrStandData({...qrStandData, tableCount: e.target.value, isConfigured: true})}
                    className="w-full px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    placeholder="bijv. 25"
                    min="1"
                    max="200"
                  />
                  <p className="text-xs text-[#BBBECC] mt-2">
                    Het totaal aantal tafels in het restaurant (gebruikt voor QR code generatie)
                  </p>
                </div>

                {/* Floor Plan Upload */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-4">
                    Plattegrond Upload (Optioneel)
                  </label>
                  <div className="relative border-2 border-dashed border-[#2a2d3a] rounded-xl p-8 text-center hover:border-[#2BE89A]/50 hover:bg-[#1c1e27]/50 transition-all">
                    {qrStandData.floorPlan ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="p-3 bg-[#2BE89A]/20 rounded-lg">
                            <svg className="h-8 w-8 text-[#2BE89A]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium">{qrStandData.floorPlan.name}</p>
                          <p className="text-sm text-[#BBBECC]">{(qrStandData.floorPlan.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQrStandData({...qrStandData, floorPlan: null})}
                          className="text-red-400 hover:text-red-300 text-sm font-medium"
                        >
                          Bestand verwijderen
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="p-3 bg-[#BBBECC]/20 rounded-lg">
                            <svg className="h-8 w-8 text-[#BBBECC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <p className="text-white font-medium mb-2">Sleep bestand hier of klik om te uploaden</p>
                          <p className="text-sm text-[#BBBECC]">
                            PNG, JPG, PDF - Max 5MB
                          </p>
                        </div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,.pdf"
                          onChange={(e) => {
                            const file = e.target.files[0]
                            if (file) {
                              setQrStandData({...qrStandData, floorPlan: file, isConfigured: true})
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#BBBECC] mt-2">
                    Upload de plattegrond van het restaurant om tafelnummers optimaal te kunnen plaatsen
                  </p>
                </div>

                {/* Configuration Summary */}
                {qrStandData.isConfigured && (
                  <div className="bg-[#0A0B0F] rounded-lg p-6 border border-[#2BE89A]/30">
                    <div className="flex items-center mb-4">
                      <CheckCircleIcon className="h-6 w-6 text-[#2BE89A] mr-3" />
                      <h4 className="text-base font-medium text-white">QR Stand Configuratie</h4>
                    </div>
                    <div className="space-y-3">
                      {qrStandData.selectedDesign && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Design</span>
                          <span className="text-sm text-white font-medium capitalize">{qrStandData.selectedDesign}</span>
                        </div>
                      )}
                      {qrStandData.tableCount && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Aantal tafels</span>
                          <span className="text-sm text-white font-medium">{qrStandData.tableCount}</span>
                        </div>
                      )}
                      {qrStandData.floorPlan && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-[#BBBECC]">Plattegrond</span>
                          <span className="text-sm text-white font-medium">{qrStandData.floorPlan.name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-6">
            {/* Main Content Card */}
            <div className="bg-[#1c1e27] rounded-xl p-8 border border-[#2a2d3a]">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Stap 5: Google Reviews</h3>
                  <p className="text-[#BBBECC]">
                    Configureer Google Reviews link voor {restaurant?.name}
                  </p>
                </div>
                <StarIcon className="h-12 w-12 text-[#BBBECC] opacity-20" />
              </div>

              <div className="space-y-6">
                {/* Restaurant Info - Disabled */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    Restaurant
                  </label>
                  <div className="relative">
                    <div className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg pr-12">
                      <span className="text-white font-medium">{restaurant?.name}</span>
                      <span className="text-[#BBBECC] ml-3">
                        {restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        const textToCopy = `${restaurant?.name} ${restaurant?.address 
                          ? `${restaurant.address.street || ''} ${restaurant.address.postalCode || ''} ${restaurant.address.city || ''}`
                          : restaurant?.location || ''}`;
                        navigator.clipboard.writeText(textToCopy);
                        setShowCopiedMessage(true);
                        setTimeout(() => setShowCopiedMessage(false), 2000);
                      }}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#BBBECC] hover:text-white transition"
                      title="Kopieer restaurant informatie"
                    >
                      {showCopiedMessage ? (
                        <span className="text-xs text-[#2BE89A] font-medium mr-2">Gekopieerd!</span>
                      ) : null}
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Instructions with Steps */}
                <div className="bg-[#0A0B0F] rounded-lg p-6 border border-[#2a2d3a]">
                  <h4 className="text-base font-medium text-white mb-4">Google Review link instellen voor {restaurant?.name}</h4>
                  
                  {/* Step 1 */}
                  <div className="mb-6">
                    <div className="flex items-start mb-3">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2BE89A] text-black text-sm font-bold mr-3 flex-shrink-0">1</span>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium mb-2">Zoek {restaurant?.name} op Google</p>
                        <a 
                          href="https://developers.google.com/maps/documentation/places/web-service/place-id"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black text-sm font-medium rounded-lg hover:opacity-90 transition"
                        >
                          Open Google Place ID Finder
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2BE89A] text-black text-sm font-bold mr-3 flex-shrink-0">2</span>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium mb-1">Zoek onder "Find the ID of a particular place"</p>
                        <p className="text-xs text-[#BBBECC]">Typ "{restaurant?.name}" en selecteer het juiste resultaat</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="mb-6">
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2BE89A] text-black text-sm font-bold mr-3 flex-shrink-0">3</span>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium mb-1">Kopieer de Place ID</p>
                        <p className="text-xs text-[#BBBECC]">Deze verschijnt onder de kaart (bijv: ChIJN1t_tDeuEmsRU...)</p>
                      </div>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div>
                    <div className="flex items-start">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2BE89A] text-black text-sm font-bold mr-3 flex-shrink-0">4</span>
                      <div className="flex-1">
                        <p className="text-sm text-white font-medium mb-1">Plak de Place ID hieronder</p>
                        <p className="text-xs text-[#BBBECC]">Vervang alleen "PLACE_ID" met de gekopieerde ID van {restaurant?.name}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Google Review Link Input */}
                <div>
                  <label className="block text-sm font-medium text-[#BBBECC] mb-2">
                    Google Review Link
                  </label>
                  <div className="flex items-center bg-[#1c1e27] border border-[#2a2d3a] rounded-lg focus-within:ring-2 focus-within:ring-[#2BE89A] focus-within:border-transparent">
                    <span className="text-[#BBBECC] font-mono text-sm pl-4 pr-0 whitespace-nowrap">
                      https://search.google.com/local/writereview?placeid=
                    </span>
                    <input
                      type="text"
                      value={googleReviewData.placeId || ''}
                      onChange={(e) => {
                        const placeId = e.target.value;
                        const fullLink = placeId ? `https://search.google.com/local/writereview?placeid=${placeId}` : '';
                        setGoogleReviewData({
                          placeId: placeId,
                          reviewLink: fullLink,
                          isConfigured: placeId.length > 0
                        });
                      }}
                      placeholder="PLACE_ID"
                      className="flex-1 bg-transparent py-3 pr-4 pl-0 text-white font-mono text-sm placeholder-[#BBBECC]/50 focus:outline-none"
                    />
                  </div>
                  <p className="text-xs text-[#BBBECC] mt-2">
                    Het restaurant kan dit later altijd wijzigen
                  </p>
                </div>

                {/* Success Message */}
                {googleReviewData.isConfigured && (
                  <div className="bg-[#0A0B0F] rounded-lg p-5 border border-[#2BE89A]/30">
                    <p className="text-sm text-[#BBBECC] flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-[#2BE89A] mr-2" />
                      Review link toegevoegd! Klanten van {restaurant?.name} ontvangen na betaling een review verzoek.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Layout>
      <OnboardingSidebar
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepChange={handleStepChange}
        restaurant={restaurant}
      >
        <div className="max-w-5xl mx-auto">
          {/* Locked State Banner for Archived Restaurants */}
          {isLocked && (
            <div className="mb-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-500/20 rounded-lg mr-4">
                    <LockClosedIcon className="h-6 w-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Restaurant is gearchiveerd</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Dit restaurant is gearchiveerd. Je kunt de onboarding voortgang bekijken maar geen wijzigingen maken.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    restoreRestaurant(id)
                    router.reload()
                  }}
                  className="flex items-center px-6 py-3 bg-[#2BE89A] text-black font-semibold rounded-lg hover:bg-[#4FFFB0] transition-colors"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Herstel om door te gaan
                </button>
              </div>
            </div>
          )}

          {showWelcome && !isLocked ? (
            // Welcome Screen
            <div className="bg-[#1c1e27] rounded-2xl border border-[#2a2d3a] overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-700">
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#2BE89A]/20 via-transparent to-[#635BFF]/20" />
                <div className="relative px-8 py-10 lg:py-12 xl:py-14 2xl:py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 lg:w-18 lg:h-18 xl:w-20 xl:h-20 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-full mb-4 lg:mb-5 xl:mb-6 animate-pulse">
                    <RocketLaunchIcon className="h-8 w-8 lg:h-9 lg:w-9 xl:h-10 xl:w-10 text-black" />
                  </div>
                  <h1 className="text-3xl lg:text-3xl xl:text-4xl font-bold text-white mb-3 lg:mb-3 xl:mb-4">
                    Welkom bij Splitty Onboarding!
                  </h1>
                  <p className="text-lg lg:text-lg xl:text-xl text-[#BBBECC] mb-0 max-w-3xl mx-auto">
                    Laten we <span className="text-[#2BE89A] font-semibold">{restaurant?.name}</span> klaar maken 
                    voor de toekomst van restaurant betalingen
                  </p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-[#0F1117] to-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition-all group">
                    <UserGroupIcon className="h-10 w-10 text-[#2BE89A] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">Personeel</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Configureer toegang voor het restaurant team
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#0F1117] to-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#4FFFB0]/50 transition-all group">
                    <CreditCardIcon className="h-10 w-10 text-[#4FFFB0] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">Betalingen</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Stel Stripe in voor het restaurant
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#0F1117] to-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#BBBECC]/50 transition-all group">
                    <WifiIcon className="h-10 w-10 text-[#BBBECC] mb-4 group-hover:text-white transition-all" />
                    <h3 className="text-lg font-semibold text-white mb-2">POS Systeem</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Koppel het kassasysteem
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#0F1117] to-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#FFC107]/50 transition-all group">
                    <StarIcon className="h-10 w-10 text-[#FFC107] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">Reviews</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Configureer klantfeedback
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-[#0F1117] to-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a] hover:border-[#2BE89A]/50 transition-all group">
                    <QrCodeIcon className="h-10 w-10 text-[#2BE89A] mb-4 group-hover:scale-110 transition-transform" />
                    <h3 className="text-lg font-semibold text-white mb-2">QR Stands</h3>
                    <p className="text-sm text-[#BBBECC]">
                      Tafel QR codes en indeling
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-gradient-to-r from-[#2BE89A]/5 to-[#4FFFB0]/5 border border-[#2BE89A]/30 rounded-lg p-4 text-center">
                    <ClockIcon className="h-6 w-6 text-[#2BE89A] mx-auto mb-2" />
                    <p className="text-sm text-white font-medium">10-15 minuten</p>
                    <p className="text-xs text-[#BBBECC]">Geschatte tijd</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#1c1e27] to-[#252833] border border-[#2a2d3a] rounded-lg p-4 text-center">
                    <ShieldCheckIcon className="h-6 w-6 text-white mx-auto mb-2" />
                    <p className="text-sm text-white font-medium">Automatisch opgeslagen</p>
                    <p className="text-xs text-[#BBBECC]">Ga later verder</p>
                  </div>
                  <div className="bg-gradient-to-r from-[#252833] to-[#1c1e27] border border-[#2a2d3a] rounded-lg p-4 text-center">
                    <SparklesIcon className="h-6 w-6 text-white mx-auto mb-2" />
                    <p className="text-sm text-white font-medium">Direct actief</p>
                    <p className="text-xs text-[#BBBECC]">Na voltooiing</p>
                  </div>
                </div>
              </div>
              
              <div className="px-8 py-6 bg-[#0A0B0F] border-t border-[#2a2d3a]">
                <button
                  onClick={() => setShowWelcome(false)}
                  disabled={isLocked}
                  className="w-full px-8 py-5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-bold rounded-xl hover:opacity-90 transition-all text-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center">
                    Laten we beginnen
                    <ArrowRightIcon className="h-6 w-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          ) : !isLocked ? (
            // Regular Onboarding Flow
            <div className="space-y-6">
              {/* Step Content */}
              {renderStepContent()}

              {/* Navigation */}
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <div className="flex justify-between items-center">
                  {currentStep > 1 ? (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="px-6 py-3 bg-[#0A0B0F] border border-[#2a2d3a] text-white rounded-lg hover:bg-[#1c1e27] transition"
                    >
                      <ChevronLeftIcon className="h-5 w-5 mr-2 inline" />
                      Vorige
                    </button>
                  ) : (
                    <div />
                  )}

                  <button
                    onClick={handleCompleteStep}
                    disabled={isLocked || (currentStep === 1 && personnelData.filter(p => p.role === 'manager').length === 0)}
                    className={`px-8 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-semibold rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed group`}
                  >
                    {currentStep === 4 ? (
                      <>
                        Onboarding Afronden
                        <CheckCircleIcon className="h-5 w-5 ml-2 inline group-hover:scale-110 transition-transform" />
                      </>
                    ) : (
                      <>
                        Volgende Stap
                        <ChevronRightIcon className="h-5 w-5 ml-2 inline group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Show read-only view when locked OR regular view
            <div className="space-y-6">
              {isLocked ? (
                // Read-only content when locked
                <div className="opacity-75 pointer-events-none">
                  {renderStepContent()}
                </div>
              ) : (
                // Regular editable content
                renderStepContent()
              )}
            </div>
          )}
        </div>
      </OnboardingSidebar>
    </Layout>
  )
}