import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../../components/Layout'
import { useUsers } from '../../../../contexts/UsersContext'
import {
  ArrowLeftIcon,
  UserIcon,
  LockClosedIcon,
  KeyIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  PhoneIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function EditRestaurantUser() {
  const router = useRouter()
  const { id: restaurantId, userId } = router.query
  const { getRestaurantUser, deleteRestaurantUser } = useUsers()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    is_active: true,
    role: 'staff',
  })
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  
  // Mock current user role - in real app this would come from auth context
  const currentUserRole = 'restaurant_admin' // can be 'restaurant_admin' or 'staff'
  const canDelete = currentUserRole === 'restaurant_admin'

  // Mock restaurant name - in real app this would come from API
  const restaurantName = restaurantId === '6' ? 'Limon B.V.' : 
                        restaurantId === '15' ? 'Loetje' : 
                        restaurantId === '16' ? 'Splitty' : 
                        'Restaurant'

  // Fetch user data from context
  useEffect(() => {
    if (userId && restaurantId) {
      const user = getRestaurantUser(restaurantId, userId)
      if (user) {
        const [firstName, ...lastNameParts] = user.name.split(' ')
        setFormData({
          first_name: firstName,
          last_name: lastNameParts.join(' '),
          email: user.email,
          phone: user.phone || '',
          role: user.role,
          is_active: user.status === 'active',
        })
      }
    }
  }, [userId, restaurantId, getRestaurantUser])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Updating restaurant user:', formData)
    router.push(`/restaurants/${restaurantId}/users`)
  }

  const handlePasswordChange = (e) => {
    e.preventDefault()
    if (newPassword !== confirmPassword) {
      alert('Wachtwoorden komen niet overeen')
      return
    }
    console.log('Changing password for user:', userId)
    setShowPasswordModal(false)
    setNewPassword('')
    setConfirmPassword('')
  }

  const handleDelete = () => {
    const expectedName = `${formData.first_name} ${formData.last_name}`.toLowerCase()
    if (deleteConfirmation.toLowerCase() === expectedName) {
      deleteRestaurantUser(restaurantId, userId)
      router.push(`/restaurants/${restaurantId}/users`)
    } else {
      alert('De naam komt niet overeen. Verwijdering geannuleerd.')
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <Link
                href={`/restaurants/${restaurantId}/users`}
                className="inline-flex items-center text-[#BBBECC] hover:text-white transition"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Terug naar personeel beheer
              </Link>
            </div>

            {/* Form Card */}
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2d3a]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                      <UserIcon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h1 className="text-xl font-semibold text-white">Personeelslid Bewerken</h1>
                      <p className="text-sm text-[#BBBECC] mt-1">{restaurantName}</p>
                    </div>
                  </div>
                  {canDelete && (
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="inline-flex items-center px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Verwijderen
                    </button>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Persoonlijke Gegevens</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="first_name" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Voornaam <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        value={formData.first_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="last_name" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Achternaam <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        required
                        className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                        value={formData.last_name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        E-mailadres <span className="text-red-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-[#BBBECC]" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          id="email"
                          required
                          className="w-full pl-10 pr-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
                        Telefoonnummer
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <PhoneIcon className="h-5 w-5 text-[#BBBECC]" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          id="phone"
                          className="w-full pl-10 pr-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Role Selection */}
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-white">Rol & Toegang</h2>
                  
                  <div>
                    <label className="block text-sm font-medium text-[#BBBECC] mb-3">Rol</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { 
                          value: 'restaurant_admin', 
                          label: 'Restaurant Admin', 
                          desc: 'Volledige toegang tot restaurant functies', 
                          icon: BuildingOfficeIcon, 
                          color: 'from-[#667EEA] to-[#764BA2]' 
                        },
                        { 
                          value: 'staff', 
                          label: 'Restaurant Staff', 
                          desc: 'Bestellingen beheren en basis toegang', 
                          icon: UserIcon, 
                          color: 'from-[#4ECDC4] to-[#44A08D]' 
                        },
                      ].map((role) => (
                        <label
                          key={role.value}
                          className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all ${
                            formData.role === role.value
                              ? 'bg-[#0F1117] border-[#2BE89A]'
                              : 'bg-[#0F1117] border-[#2a2d3a] hover:border-[#2BE89A]/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="role"
                            value={role.value}
                            checked={formData.role === role.value}
                            onChange={handleInputChange}
                            className="sr-only"
                          />
                          <div className="flex flex-col w-full">
                            <div className="flex items-center mb-2">
                              <div className={`p-2 bg-gradient-to-r ${role.color} rounded-lg`}>
                                <role.icon className="h-5 w-5 text-white" />
                              </div>
                              <span className="ml-3 text-sm font-medium text-white">{role.label}</span>
                            </div>
                            <p className="text-xs text-[#BBBECC]">{role.desc}</p>
                          </div>
                          {formData.role === role.value && (
                            <CheckCircleIcon className="absolute top-4 right-4 h-5 w-5 text-[#2BE89A]" />
                          )}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="bg-[#0F1117] rounded-lg p-4">
                    <div className="flex items-center">
                      <input
                        id="is_active"
                        name="is_active"
                        type="checkbox"
                        className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0F1117]"
                        checked={formData.is_active}
                        onChange={handleInputChange}
                      />
                      <label htmlFor="is_active" className="ml-3">
                        <span className="text-sm font-medium text-white">Actieve gebruiker</span>
                        <p className="text-xs text-[#BBBECC]">Inactieve gebruikers kunnen niet inloggen</p>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-between pt-6 border-t border-[#2a2d3a]">
                  <div className="flex space-x-3">
                    <Link
                      href={`/restaurants/${restaurantId}/users`}
                      className="px-6 py-3 bg-[#0F1117] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
                    >
                      Annuleren
                    </Link>
                    <button
                      type="button"
                      onClick={() => setShowPasswordModal(true)}
                      className="inline-flex items-center px-6 py-3 bg-[#0F1117] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
                    >
                      <KeyIcon className="h-5 w-5 mr-2" />
                      Wachtwoord Wijzigen
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                  >
                    Opslaan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1c1e27] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2d3a]">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                <LockClosedIcon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white ml-3">Wachtwoord Wijzigen</h3>
            </div>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="new_password"
                  required
                  minLength="8"
                  className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div>
                <label htmlFor="confirm_new_password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Bevestig Nieuw Wachtwoord
                </label>
                <input
                  type="password"
                  id="confirm_new_password"
                  required
                  className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setNewPassword('')
                    setConfirmPassword('')
                  }}
                  className="px-6 py-3 bg-[#0F1117] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
                >
                  Annuleren
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                >
                  Wachtwoord Wijzigen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1c1e27] rounded-xl p-6 max-w-md w-full mx-4 border border-[#2a2d3a]">
            <div className="flex items-center mb-6">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrashIcon className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="text-xl font-semibold text-white ml-3">Gebruiker Verwijderen</h3>
            </div>
            
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400 text-sm font-medium mb-1">⚠️ Let op!</p>
              <p className="text-[#BBBECC] text-sm">
                Je staat op het punt om <span className="text-white font-medium">{formData.first_name} {formData.last_name}</span> permanent te verwijderen. 
                Deze actie kan niet ongedaan worden gemaakt.
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="delete_confirmation" className="block text-sm font-medium text-[#BBBECC] mb-2">
                Type de volledige naam van de gebruiker om te bevestigen:
              </label>
              <input
                type="text"
                id="delete_confirmation"
                className="w-full px-4 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder={`${formData.first_name} ${formData.last_name}`}
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
              />
              <p className="text-xs text-[#BBBECC] mt-2">
                Verwachte invoer: <span className="text-white font-mono">{formData.first_name} {formData.last_name}</span>
              </p>
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirmation('')
                }}
                className="px-6 py-3 bg-[#0F1117] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition"
              >
                Annuleren
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleteConfirmation.toLowerCase() !== `${formData.first_name} ${formData.last_name}`.toLowerCase()}
                className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Permanent Verwijderen
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}