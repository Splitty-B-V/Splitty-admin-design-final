import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../components/Layout'
import Breadcrumb from '../../components/Breadcrumb'
import { useRestaurants } from '../../contexts/RestaurantsContext'
import React from 'react'
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  BuildingStorefrontIcon,
  EnvelopeIcon,
  PhoneIcon,
  CurrencyEuroIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckIconSolid } from '@heroicons/react/24/solid'

export default function NewRestaurant() {
  const router = useRouter()
  const { addRestaurant } = useRestaurants()
  const [currentStep, setCurrentStep] = useState(1)
  const [showMediaError, setShowMediaError] = useState(false)
  const [dragActive, setDragActive] = useState({ logo: false, banner: false })
  const [formData, setFormData] = useState({
    // Step 1: Basic Information
    name: '',
    address: '',
    city: '',
    postal_code: '',
    country: 'Netherlands',
    // Step 2: Contact & Fees
    contact_email: '',
    contact_phone: '+31',
    service_fee_type: 'flat',
    service_fee_amount: '0.7',
    // Step 3: Media & Status
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
    status: 'active',
  })

  const steps = [
    {
      number: 1,
      title: 'Basisinformatie',
      description: 'Voer restaurantgegevens en locatie in',
      icon: BuildingStorefrontIcon,
    },
    {
      number: 2,
      title: 'Contact & Kosten',
      description: 'Stel contactinformatie en betaalopties in',
      icon: PhoneIcon,
    },
    {
      number: 3,
      title: 'Media & Status',
      description: 'Upload afbeeldingen en stel restaurantstatus in',
      icon: PhotoIcon,
    },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    processFile(file, fieldName)
  }

  const processFile = (file, fieldName) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Alleen PNG, JPG en GIF bestanden zijn toegestaan')
        return
      }
      
      // Validate file size (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Bestand moet kleiner zijn dan 10MB')
        return
      }
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(file)
      
      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
        [`${fieldName}Preview`]: previewUrl,
      }))
      setShowMediaError(false)
    }
  }

  // Drag and drop handlers
  const handleDrag = (e, fieldName) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e, fieldName) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(prev => ({ ...prev, [fieldName]: true }))
    }
  }

  const handleDragOut = (e, fieldName) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [fieldName]: false }))
  }

  const handleDrop = (e, fieldName) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(prev => ({ ...prev, [fieldName]: false }))
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], fieldName)
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setShowMediaError(false)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setShowMediaError(false)
    }
  }

  const handleSubmit = () => {
    // Check if media is uploaded
    if (!formData.logo || !formData.banner) {
      setShowMediaError(true)
      return
    }
    
    // Create new restaurant data
    const newRestaurant = {
      name: formData.name,
      location: `${formData.city}, ${formData.country}`,
      status: formData.status,
      email: formData.contact_email,
      phone: formData.contact_phone,
      tables: 0,
      logo: formData.logoPreview, // Use the actual preview URL
    }
    
    // Add restaurant to context
    addRestaurant(newRestaurant)
    
    // Navigate back to restaurants page
    router.push('/restaurants')
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name && formData.address && formData.city && formData.postal_code
      case 2:
        return formData.contact_email && formData.service_fee_amount
      case 3:
        return formData.logo && formData.banner // Both logo and banner are required
      default:
        return false
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center">
            <div
              className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all
                      ${
                        currentStep > step.number
                          ? 'border-[#2BE89A] bg-[#2BE89A] text-black'
                          : currentStep === step.number
                          ? 'border-[#2BE89A] bg-[#2BE89A] text-black scale-110 shadow-lg shadow-[#2BE89A]/30'
                          : 'border-[#2a2d3a] bg-[#1c1e27] text-[#BBBECC]'
                      }`}
            >
              {currentStep > step.number ? (
                <CheckIconSolid className="w-6 h-6" />
              ) : (
                <span className="text-base font-semibold">{step.number}</span>
              )}
            </div>
            <div className="ml-3 hidden md:block">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-[#2BE89A]' : 'text-[#BBBECC]'
              }`}>
                {step.title}
              </p>
            </div>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 ${
              currentStep > step.number ? 'bg-[#2BE89A]' : 'bg-[#2a2d3a]'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <BuildingStorefrontIcon className="h-6 w-6 text-[#2BE89A]" />
        <h2 className="text-xl font-semibold text-white">Basisinformatie</h2>
      </div>
      <div className="grid grid-cols-1 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Restaurant Naam <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            id="name"
            required
            className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
            placeholder="Bijv. Restaurant De Gouden Lepel"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Adres <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            required
            className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
            placeholder="Straatnaam 123"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Stad <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
              placeholder="Amsterdam"
              value={formData.city}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Postcode <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="postal_code"
              id="postal_code"
              required
              className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
              placeholder="1234 AB"
              value={formData.postal_code}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Land <span className="text-red-400">*</span>
            </label>
            <select
              name="country"
              id="country"
              required
              className="w-full px-3 py-2 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
              value={formData.country}
              onChange={handleInputChange}
            >
              <option value="Netherlands">Nederland</option>
              <option value="Belgium">België</option>
              <option value="Germany">Duitsland</option>
              <option value="France">Frankrijk</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <EnvelopeIcon className="h-6 w-6 text-[#2BE89A]" />
          <h2 className="text-xl font-semibold text-white">Contactinformatie</h2>
        </div>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="contact_email" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Contact Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="contact_email"
              id="contact_email"
              required
              className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
              placeholder="restaurant@example.com"
              value={formData.contact_email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor="contact_phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
              <PhoneIcon className="inline h-4 w-4 mr-1" />
              Contact Telefoon
            </label>
            <input
              type="tel"
              name="contact_phone"
              id="contact_phone"
              className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
              placeholder="+31 6 12345678"
              value={formData.contact_phone}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>

      <div className="border-t border-[#2a2d3a] pt-6">
        <div className="flex items-center space-x-3 mb-6">
          <CurrencyEuroIcon className="h-6 w-6 text-[#2BE89A]" />
          <h2 className="text-xl font-semibold text-white">Service Kosten</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="service_fee_type" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Kosten Type
            </label>
            <select
              name="service_fee_type"
              id="service_fee_type"
              className="w-full px-3 py-2 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
              value={formData.service_fee_type}
              onChange={handleInputChange}
            >
              <option value="flat">Vast Bedrag</option>
              <option value="percentage">Percentage</option>
            </select>
          </div>

          <div>
            <label htmlFor="service_fee_amount" className="block text-sm font-medium text-[#BBBECC] mb-2">
              Kosten Bedrag {formData.service_fee_type === 'flat' ? '(€)' : '(%)'}
            </label>
            <input
              type="number"
              name="service_fee_amount"
              id="service_fee_amount"
              step="0.01"
              min="0"
              className="w-full px-4 py-2.5 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC]/50 focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
              placeholder={formData.service_fee_type === 'flat' ? '0.70' : '3.00'}
              value={formData.service_fee_amount}
              onChange={handleInputChange}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <PhotoIcon className="h-6 w-6 text-[#2BE89A]" />
          <h2 className="text-xl font-semibold text-white">Media & Status</h2>
        </div>
        
        <div className="space-y-4">
          {/* Required Media Notice - Only show when error is triggered */}
          {showMediaError && (!formData.logo || !formData.banner) && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-4">
              <p className="text-sm text-red-400 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Beide afbeeldingen zijn verplicht om een restaurant toe te voegen
              </p>
            </div>
          )}
          
          {/* Logo Upload */}
          <div>
            <label className="block text-sm font-medium text-[#BBBECC] mb-2">
              Restaurant Logo <span className="text-red-400">*</span>
            </label>
            {formData.logoPreview ? (
              <div className="relative">
                <img 
                  src={formData.logoPreview} 
                  alt="Logo preview" 
                  className="w-full h-40 object-contain bg-[#0F1117] rounded-lg border border-[#2a2d3a]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, logo: null, logoPreview: null }))
                    setShowMediaError(false)
                    document.getElementById('logo-upload').value = ''
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                className={`flex justify-center px-6 py-5 border-2 border-dashed rounded-lg transition-colors duration-200 bg-[#0F1117] ${
                  dragActive.logo 
                    ? 'border-[#2BE89A] bg-[#2BE89A]/10' 
                    : 'border-[#2a2d3a] hover:border-[#2BE89A]/50'
                }`}
                onDragEnter={(e) => handleDragIn(e, 'logo')}
                onDragLeave={(e) => handleDragOut(e, 'logo')}
                onDragOver={(e) => handleDrag(e, 'logo')}
                onDrop={(e) => handleDrop(e, 'logo')}
              >
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-10 w-10 text-[#BBBECC]" />
                  <div className="mt-2 flex text-sm text-[#BBBECC]">
                    <label
                      htmlFor="logo-upload"
                      className="relative cursor-pointer font-medium text-[#2BE89A] hover:text-[#4FFFB0]"
                    >
                      <span>Upload bestand</span>
                      <input 
                        id="logo-upload" 
                        name="logo-upload" 
                        type="file" 
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={(e) => handleFileChange(e, 'logo')}
                        className="sr-only" 
                      />
                    </label>
                    <p className="pl-1">of sleep en laat vallen</p>
                  </div>
                  <p className="text-xs text-[#BBBECC]/70 mt-1">PNG, JPG tot 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Banner Upload */}
          <div>
            <label className="block text-sm font-medium text-[#BBBECC] mb-2">
              Restaurant Banner <span className="text-red-400">*</span>
            </label>
            {formData.bannerPreview ? (
              <div className="relative">
                <img 
                  src={formData.bannerPreview} 
                  alt="Banner preview" 
                  className="w-full h-40 object-cover bg-[#0F1117] rounded-lg border border-[#2a2d3a]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, banner: null, bannerPreview: null }))
                    setShowMediaError(false)
                    document.getElementById('banner-upload').value = ''
                  }}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ) : (
              <div 
                className={`flex justify-center px-6 py-5 border-2 border-dashed rounded-lg transition-colors duration-200 bg-[#0F1117] ${
                  dragActive.banner 
                    ? 'border-[#2BE89A] bg-[#2BE89A]/10' 
                    : 'border-[#2a2d3a] hover:border-[#2BE89A]/50'
                }`}
                onDragEnter={(e) => handleDragIn(e, 'banner')}
                onDragLeave={(e) => handleDragOut(e, 'banner')}
                onDragOver={(e) => handleDrag(e, 'banner')}
                onDrop={(e) => handleDrop(e, 'banner')}
              >
                <div className="text-center">
                  <PhotoIcon className="mx-auto h-10 w-10 text-[#BBBECC]" />
                  <div className="mt-2 flex text-sm text-[#BBBECC]">
                    <label
                      htmlFor="banner-upload"
                      className="relative cursor-pointer font-medium text-[#2BE89A] hover:text-[#4FFFB0]"
                    >
                      <span>Upload bestand</span>
                      <input 
                        id="banner-upload" 
                        name="banner-upload" 
                        type="file" 
                        accept="image/png,image/jpeg,image/jpg,image/gif"
                        onChange={(e) => handleFileChange(e, 'banner')}
                        className="sr-only" 
                      />
                    </label>
                    <p className="pl-1">of sleep en laat vallen</p>
                  </div>
                  <p className="text-xs text-[#BBBECC]/70 mt-1">PNG, JPG tot 10MB</p>
                </div>
              </div>
            )}
          </div>

          {/* Status Selection */}
          <div className="border-t border-[#2a2d3a] pt-4">
            <label className="block text-sm font-medium text-[#BBBECC] mb-3">
              Restaurant Status
            </label>
            <div className="space-y-2">
              <label className="flex items-center p-4 bg-[#0F1117] rounded-lg border border-[#2a2d3a] cursor-pointer hover:border-[#2BE89A]/30">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  checked={formData.status === 'active'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] bg-[#0F1117]"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-white">Actief</span>
                  <span className="block text-sm text-[#BBBECC]">Restaurant accepteert bestellingen</span>
                </span>
              </label>
              <label className="flex items-center p-4 bg-[#0F1117] rounded-lg border border-[#2a2d3a] cursor-pointer hover:border-[#2BE89A]/30">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] bg-[#0F1117]"
                />
                <span className="ml-3">
                  <span className="block text-sm font-medium text-white">Inactief</span>
                  <span className="block text-sm text-[#BBBECC]">Restaurant is tijdelijk gesloten</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb
              items={[
                { name: 'Restaurants', href: '/restaurants' },
                { name: 'Nieuw Restaurant' },
              ]}
            />

            {/* Back Link */}
            <div className="flex justify-between items-center">
              <Link
                href="/restaurants"
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar restaurants
              </Link>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="bg-[#1c1e27] rounded-xl overflow-hidden border border-[#2a2d3a]">
                {/* Form Header with Steps - More compact */}
                <div className="px-8 py-8 bg-gradient-to-r from-[#1c1e27] to-[#252833] border-b border-[#2a2d3a]">
                  <h1 className="text-2xl font-bold text-white text-center mb-3">
                    Nieuw Restaurant Toevoegen
                  </h1>
                  <p className="text-[#BBBECC] text-center mb-8 text-base">
                    Vul de gegevens in om een restaurant toe te voegen
                  </p>
                  {renderStepIndicator()}
                </div>

                {/* Form Content - More compact padding */}
                <div className="px-8 py-8 bg-[#0F1117]">
                  {currentStep === 1 && renderStep1()}
                  {currentStep === 2 && renderStep2()}
                  {currentStep === 3 && renderStep3()}
                </div>

                {/* Form Footer - More compact */}
                <div className="px-8 py-5 bg-[#0F1117] border-t border-[#2a2d3a] flex justify-between">
                  {currentStep === 1 ? (
                    <Link
                      href="/restaurants"
                      className="inline-flex items-center px-5 py-2.5 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                    >
                      <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                      Annuleren
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={handlePrevious}
                      className="inline-flex items-center px-5 py-2.5 border border-[#2a2d3a] rounded-lg text-white bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200"
                    >
                      <ArrowLeftIcon className="-ml-1 mr-2 h-5 w-5" />
                      Vorige
                    </button>
                  )}

                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={!isStepValid()}
                      className="inline-flex items-center px-4 py-2 border border-[#2a2d3a] rounded-lg text-white text-sm bg-[#1c1e27] hover:bg-[#252833] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Volgende
                      <ArrowRightIcon className="ml-2 -mr-1 h-5 w-5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-all duration-200 shadow-lg"
                    >
                      Restaurant Aanmaken
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}