import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { useRestaurants } from '../../../contexts/RestaurantsContext'
import {
  ArrowLeftIcon,
  BuildingStorefrontIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  PhotoIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline'

export default function EditRestaurant() {
  const router = useRouter()
  const { id } = router.query
  const { getRestaurant, updateRestaurant } = useRestaurants()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    postalCode: '',
    city: '',
    country: 'Netherlands',
    logo: null,
    logoPreview: null,
    banner: null,
    bannerPreview: null,
  })

  useEffect(() => {
    if (id) {
      const restaurant = getRestaurant(id)
      if (restaurant) {
        setFormData({
          name: restaurant.name || '',
          email: restaurant.email || '',
          phone: restaurant.phone || '',
          street: restaurant.address?.street || '',
          postalCode: restaurant.address?.postalCode || '',
          city: restaurant.address?.city || 'Amsterdam',
          country: restaurant.address?.country || 'Netherlands',
          logo: restaurant.logo,
          logoPreview: restaurant.logo,
          banner: restaurant.banner,
          bannerPreview: restaurant.banner,
        })
      }
    }
  }, [id, getRestaurant])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          logo: file,
          logoPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          banner: file,
          bannerPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) newErrors.name = 'Restaurant naam is verplicht'
    if (!formData.email.trim()) newErrors.email = 'Email is verplicht'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Ongeldig email adres'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefoonnummer is verplicht'
    if (!formData.street.trim()) newErrors.street = 'Straat is verplicht'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postcode is verplicht'
    if (!formData.city.trim()) newErrors.city = 'Stad is verplicht'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    
    try {
      const updatedData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: {
          street: formData.street,
          postalCode: formData.postalCode,
          city: formData.city,
          country: formData.country,
        },
        logo: formData.logoPreview || formData.logo,
        banner: formData.bannerPreview || formData.banner,
      }
      
      updateRestaurant(id, updatedData)
      router.push(`/restaurants/${id}`)
    } catch (error) {
      console.error('Error updating restaurant:', error)
    } finally {
      setLoading(false)
    }
  }

  const restaurant = getRestaurant(id)
  if (!restaurant) {
    return (
      <Layout>
        <div className="min-h-screen bg-[#0A0B0F] flex items-center justify-center">
          <p className="text-white">Restaurant niet gevonden</p>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-3xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <Link
                href={`/restaurants/${id}`}
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition mb-6"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar restaurant
              </Link>
              <h1 className="text-3xl font-bold text-white">Restaurant Bewerken</h1>
              <p className="text-[#BBBECC] mt-2">Pas de restaurant gegevens aan</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Basic Information */}
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <BuildingStorefrontIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Basis Informatie
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Restaurant Naam <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#0A0B0F] border ${errors.name ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                      placeholder="Bijv. Restaurant Amsterdam"
                    />
                    {errors.name && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="logo" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Restaurant Logo
                    </label>
                    <div className="flex items-center space-x-6">
                      {formData.logoPreview && (
                        <div className="h-20 w-20 rounded-lg overflow-hidden border-2 border-[#2a2d3a]">
                          <img
                            src={formData.logoPreview}
                            alt="Logo preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <label className="cursor-pointer">
                          <div className="px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-[#BBBECC] hover:bg-[#1a1c25] transition inline-flex items-center">
                            <PhotoIcon className="h-5 w-5 mr-2" />
                            {formData.logoPreview ? 'Logo Wijzigen' : 'Logo Uploaden'}
                          </div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleLogoChange}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-[#BBBECC] mt-2">PNG, JPG tot 5MB</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="banner" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Restaurant Banner
                    </label>
                    <div className="space-y-4">
                      {formData.bannerPreview && (
                        <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-[#2a2d3a]">
                          <img
                            src={formData.bannerPreview}
                            alt="Banner preview"
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <label className="cursor-pointer">
                        <div className="px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-[#BBBECC] hover:bg-[#1a1c25] transition inline-flex items-center">
                          <PhotoIcon className="h-5 w-5 mr-2" />
                          {formData.bannerPreview ? 'Banner Wijzigen' : 'Banner Uploaden'}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-xs text-[#BBBECC]">Aanbevolen: 1920x400px, PNG of JPG tot 5MB</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <EnvelopeIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Contact Informatie
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="h-5 w-5 text-[#BBBECC]" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-[#0A0B0F] border ${errors.email ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                        placeholder="info@restaurant.nl"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Telefoon <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-[#BBBECC]" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={`w-full pl-10 pr-4 py-3 bg-[#0A0B0F] border ${errors.phone ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                        placeholder="+31 20 123 4567"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
                  <MapPinIcon className="h-6 w-6 text-[#2BE89A] mr-2" />
                  Adres Informatie
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="street" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Straat & Huisnummer <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="street"
                      id="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 bg-[#0A0B0F] border ${errors.street ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                      placeholder="Herengracht 182"
                    />
                    {errors.street && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Postcode <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#0A0B0F] border ${errors.postalCode ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                        placeholder="1016 BR"
                      />
                      {errors.postalCode && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.postalCode}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Stad <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 bg-[#0A0B0F] border ${errors.city ? 'border-red-500' : 'border-[#2a2d3a]'} rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent`}
                        placeholder="Amsterdam"
                      />
                      {errors.city && (
                        <p className="mt-2 text-sm text-red-400 flex items-center">
                          <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                          {errors.city}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-[#BBBECC] mb-2">
                      Land
                    </label>
                    <select
                      name="country"
                      id="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    >
                      <option value="Netherlands">Nederland</option>
                      <option value="Belgium">België</option>
                      <option value="Germany">Duitsland</option>
                      <option value="France">Frankrijk</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-4">
                <Link
                  href={`/restaurants/${id}`}
                  className="px-6 py-3 bg-[#1c1e27] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#2a2d3a] transition"
                >
                  Annuleren
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Opslaan...' : 'Wijzigingen Opslaan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}