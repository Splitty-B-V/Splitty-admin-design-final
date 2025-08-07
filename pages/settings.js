import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useUsers } from '../contexts/UsersContext'
import db from '../utils/database'
import {
  Cog6ToothIcon,
  BellIcon,
  CreditCardIcon,
  KeyIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  BuildingOfficeIcon,
  CheckIcon,
  CloudArrowUpIcon,
  PhotoIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'

export default function Settings() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [profileFormData, setProfileFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  useEffect(() => {
    // Check for tab query parameter
    if (router.query.tab) {
      const tabMap = {
        'profiel': 'profile',
        'algemeen': 'general',
        'profile': 'profile',
        'general': 'general',
        'notifications': 'notifications',
        'notificaties': 'notifications'
      }
      const mappedTab = tabMap[router.query.tab] || router.query.tab
      setActiveTab(mappedTab)
    }
  }, [router.query.tab])
  
  useEffect(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      // Get current user data from database
      const userId = localStorage.getItem('userId')
      if (userId) {
        const users = db.getUsers()
        const user = users.find(u => u.id === parseInt(userId))
        if (user) {
          setCurrentUser(user)
          // Parse name into first and last
          const nameParts = user.name.split(' ')
          setProfileFormData({
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || ''
          })
          // Set avatar if exists
          if (user.avatar) {
            setAvatarPreview(user.avatar)
          }
        }
      }
    }
  }, [])

  const tabs = [
    { id: 'profile', name: 'Profiel', icon: UserCircleIcon },
    { id: 'general', name: 'Algemeen', icon: Cog6ToothIcon },
    { id: 'notifications', name: 'Notificaties', icon: BellIcon },
    { id: 'payment', name: 'Betalingen', icon: CreditCardIcon },
    { id: 'security', name: 'Beveiliging', icon: KeyIcon },
    { id: 'api', name: 'API', icon: GlobeAltIcon },
    { id: 'legal', name: 'Juridisch', icon: DocumentTextIcon },
  ]

  // Format role display
  const getRoleDisplay = (role) => {
    switch(role) {
      case 'ceo': return 'CEO & Founder'
      case 'admin': return 'Administrator'
      case 'account_manager': return 'Account Manager'
      case 'support': return 'Support'
      case 'developer': return 'Developer'
      default: return role
    }
  }

  const handleSave = () => {
    if (activeTab === 'profile' && currentUser) {
      // Update user profile
      const updatedUser = {
        ...currentUser,
        name: `${profileFormData.first_name} ${profileFormData.last_name}`.trim(),
        email: profileFormData.email,
        phone: profileFormData.phone,
        bio: profileFormData.bio,
        avatar: avatarPreview
      }
      
      db.updateUser(currentUser.id, updatedUser)
      
      // Update localStorage
      localStorage.setItem('userName', updatedUser.name)
      localStorage.setItem('userEmail', updatedUser.email)
      localStorage.setItem('userAvatar', updatedUser.avatar || '')
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      
      // Trigger storage event to update Layout component
      window.dispatchEvent(new Event('storage'))
    } else if (activeTab === 'security' && currentUser) {
      // Handle password change
      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.currentPassword !== currentUser.password) {
          alert('Huidig wachtwoord is onjuist')
          return
        }
        
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert('Nieuwe wachtwoorden komen niet overeen')
          return
        }
        
        // Update password
        db.updateUser(currentUser.id, { password: passwordData.newPassword })
        
        // Clear password fields
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  // Drag and drop handlers for avatar
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragIn = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true)
    }
  }

  const handleDragOut = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
    if (!validTypes.includes(file.type)) {
      alert('Alleen PNG, JPG en GIF bestanden zijn toegestaan')
      return
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Bestand is te groot. Maximaal 5MB toegestaan.')
      return
    }
    
    setAvatar(file)
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleDeleteAvatar = () => {
    setAvatarPreview(null)
    setAvatar(null)
  }

  const renderProfileSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">Mijn Profiel</h3>
        <p className="mt-2 text-base text-[#BBBECC]">
          Beheer je persoonlijke informatie en profielfoto
        </p>
      </div>

      {/* Avatar Upload Section */}
      <div className="flex items-start space-x-8">
        <div>
          <label className="block text-sm font-medium text-[#BBBECC] mb-4">
            Profielfoto
          </label>
          <div className="flex items-center space-x-6">
            {/* Current Avatar */}
            <div className="relative">
              {avatarPreview ? (
                <div className="relative">
                  <img 
                    src={avatarPreview} 
                    alt="Avatar preview" 
                    className="h-24 w-24 rounded-full object-cover border-2 border-[#2a2d3a]"
                  />
                  <button
                    onClick={handleDeleteAvatar}
                    className="absolute -bottom-1 -right-1 p-2 bg-red-500 hover:bg-red-600 rounded-full transition-colors duration-200 shadow-lg"
                    title="Verwijder profielfoto"
                  >
                    <TrashIcon className="h-4 w-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="h-24 w-24 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold text-2xl">
                  {currentUser?.name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div
              className={`relative flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed rounded-lg transition-all ${
                dragActive 
                  ? 'border-[#2BE89A] bg-[#2BE89A]/10' 
                  : 'border-[#2a2d3a] bg-[#0A0B0F] hover:border-[#2BE89A]/50'
              }`}
              onDragEnter={handleDragIn}
              onDragLeave={handleDragOut}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="avatar-upload"
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/gif"
                onChange={handleFileChange}
                className="sr-only"
              />
              <label
                htmlFor="avatar-upload"
                className="cursor-pointer text-center"
              >
                <div className={`p-3 rounded-full ${dragActive ? 'bg-[#2BE89A]/20' : 'bg-[#1c1e27]'} mb-3`}>
                  <CloudArrowUpIcon className={`h-8 w-8 ${dragActive ? 'text-[#2BE89A]' : 'text-[#BBBECC]'}`} />
                </div>
                <p className="text-sm text-[#BBBECC]">
                  <span className="font-medium text-[#2BE89A]">Klik om te uploaden</span> of sleep hierheen
                </p>
                <p className="text-xs text-[#BBBECC]/60 mt-1">PNG, JPG, GIF • Max 5MB</p>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="profile-first-name" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Voornaam
          </label>
          <input
            type="text"
            name="profile-first-name"
            id="profile-first-name"
            value={profileFormData.first_name}
            onChange={(e) => setProfileFormData(prev => ({ ...prev, first_name: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="profile-last-name" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Achternaam
          </label>
          <input
            type="text"
            name="profile-last-name"
            id="profile-last-name"
            value={profileFormData.last_name}
            onChange={(e) => setProfileFormData(prev => ({ ...prev, last_name: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="profile-email" className="block text-sm font-medium text-[#BBBECC] mb-2">
            E-mailadres
          </label>
          <input
            type="email"
            name="profile-email"
            id="profile-email"
            value={profileFormData.email}
            onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="profile-phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Telefoonnummer
          </label>
          <input
            type="tel"
            name="profile-phone"
            id="profile-phone"
            value={profileFormData.phone}
            onChange={(e) => setProfileFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="profile-role" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Functie
          </label>
          <input
            type="text"
            name="profile-role"
            id="profile-role"
            value={getRoleDisplay(currentUser?.role || '')}
            disabled
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-[#BBBECC] cursor-not-allowed opacity-75"
          />
        </div>

        <div>
          <label htmlFor="profile-department" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Afdeling
          </label>
          <input
            type="text"
            name="profile-department"
            id="profile-department"
            value={currentUser?.department || ''}
            disabled
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-[#BBBECC] cursor-not-allowed opacity-75"
          />
        </div>
      </div>

      <div>
        <label htmlFor="profile-bio" className="block text-sm font-medium text-[#BBBECC] mb-2">
          Bio
        </label>
        <textarea
          id="profile-bio"
          name="profile-bio"
          rows={4}
          value={profileFormData.bio}
          onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
          placeholder="Vertel iets over jezelf..."
          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent resize-none"
        />
      </div>
    </div>
  )

  const renderGeneralSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">Bedrijfsinformatie</h3>
        <p className="mt-2 text-base text-[#BBBECC]">
          Deze informatie wordt weergegeven op je publieke profiel
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Bedrijfsnaam
          </label>
          <input
            type="text"
            name="company-name"
            id="company-name"
            defaultValue="Splitty B.V."
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Contact E-mail
          </label>
          <input
            type="email"
            name="email"
            id="email"
            defaultValue="contact@splitty.com"
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Telefoonnummer
          </label>
          <input
            type="tel"
            name="phone"
            id="phone"
            defaultValue="+31 20 123 4567"
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Website
          </label>
          <input
            type="url"
            name="website"
            id="website"
            defaultValue="https://splitty.com"
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-[#BBBECC] mb-2">
          Adres
        </label>
        <textarea
          id="address"
          name="address"
          rows={3}
          defaultValue="Herengracht 182\n1016 BR Amsterdam\nNetherlands"
          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent resize-none"
        />
      </div>

      <div>
        <label htmlFor="timezone" className="block text-sm font-medium text-[#BBBECC] mb-2">
          Tijdzone
        </label>
        <select
          id="timezone"
          name="timezone"
          className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent cursor-pointer"
          defaultValue="Europe/Amsterdam"
        >
          <option value="Europe/Amsterdam">Europe/Amsterdam (CET)</option>
          <option value="Europe/London">Europe/London (GMT)</option>
          <option value="America/New_York">America/New York (EST)</option>
          <option value="America/Los_Angeles">America/Los Angeles (PST)</option>
        </select>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">E-mail Notificaties</h3>
        <p className="mt-2 text-base text-[#BBBECC]">
          Beheer welke e-mails je wilt ontvangen
        </p>
      </div>

      <div className="space-y-6">
        {[
          { id: 'new-orders', label: 'Nieuwe Bestellingen', description: 'Ontvang melding bij nieuwe bestellingen', checked: true },
          { id: 'payment-received', label: 'Betaling Ontvangen', description: 'Notificatie voor succesvolle betalingen', checked: true },
          { id: 'payout-sent', label: 'Uitbetaling Verstuurd', description: 'Updates wanneer uitbetalingen worden verwerkt', checked: true },
          { id: 'low-inventory', label: 'Lage Voorraad', description: 'Waarschuwing wanneer items bijna op zijn', checked: false },
          { id: 'new-reviews', label: 'Nieuwe Reviews', description: 'Klantbeoordelingen en ratings', checked: false },
          { id: 'marketing', label: 'Marketing Updates', description: 'Product updates en aankondigingen', checked: false },
        ].map((item) => (
          <div key={item.id} className="flex items-start p-4 rounded-lg hover:bg-[#0A0B0F] transition-colors duration-200">
            <div className="flex h-6 items-center">
              <input
                id={item.id}
                name={item.id}
                type="checkbox"
                defaultChecked={item.checked}
                className="h-5 w-5 rounded border-2 border-[#2a2d3a] bg-[#0A0B0F] text-[#2BE89A] focus:ring-2 focus:ring-[#2BE89A] focus:ring-opacity-20 transition-all duration-200"
              />
            </div>
            <div className="ml-4">
              <label htmlFor={item.id} className="text-base font-medium text-white cursor-pointer">
                {item.label}
              </label>
              <p className="text-sm text-[#BBBECC] mt-1">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#2a2d3a] pt-6">
        <h3 className="text-lg font-medium leading-6 text-white">Push Notificaties</h3>
        <p className="mt-1 text-sm text-[#BBBECC]">
          Beheer mobiele app notificaties
        </p>
      </div>

      <div className="space-y-4">
        {[
          { id: 'push-orders', label: 'Order Updates', checked: true },
          { id: 'push-payments', label: 'Payment Alerts', checked: true },
          { id: 'push-staff', label: 'Staff Messages', checked: false },
        ].map((item) => (
          <div key={item.id} className="flex items-start">
            <div className="flex h-5 items-center">
              <input
                id={item.id}
                name={item.id}
                type="checkbox"
                defaultChecked={item.checked}
                className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-splitty focus:ring-splitty"
              />
            </div>
            <div className="ml-3">
              <label htmlFor={item.id} className="text-sm font-medium text-gray-300">
                {item.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">Betaalmethoden</h3>
        <p className="mt-2 text-base text-[#BBBECC]">
          Configureer je betalingsverwerkingsopties
        </p>
      </div>

      <div className="bg-[#0A0B0F] rounded-xl p-8 border border-[#2a2d3a]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-blue-500/20 p-4 rounded-xl">
              <CreditCardIcon className="h-8 w-8 text-blue-400" />
            </div>
            <div className="ml-6">
              <h4 className="text-xl font-semibold text-white">Stripe</h4>
              <p className="text-base text-[#BBBECC] mt-1">Verwerk betalingen met Stripe</p>
            </div>
          </div>
          <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30">
            <CheckIcon className="h-5 w-5 mr-2" />
            Verbonden
          </span>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="stripe-key" className="form-label">
              Publishable Key
            </label>
            <input
              type="text"
              name="stripe-key"
              id="stripe-key"
              defaultValue="pk_live_51H8KL9..."
              disabled
              className="form-input cursor-not-allowed opacity-75 bg-gray-800"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white">Payout Settings</h3>
        <p className="mt-2 text-base text-gray-400">
          Configure automatic payouts to restaurants
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <div>
          <label htmlFor="payout-frequency" className="form-label">
            Payout Frequency
          </label>
          <select
            id="payout-frequency"
            name="payout-frequency"
            className="form-select"
            defaultValue="weekly"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        <div>
          <label htmlFor="minimum-payout" className="form-label">
            Minimum Payout Amount
          </label>
          <div className="relative rounded-xl shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400 text-sm">$</span>
            </div>
            <input
              type="number"
              name="minimum-payout"
              id="minimum-payout"
              defaultValue="50.00"
              className="form-input pl-7"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-white">Beveiligingsinstellingen</h3>
        <p className="mt-2 text-base text-[#BBBECC]">
          Beheer je account beveiligingsvoorkeuren
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="current-password" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Huidig Wachtwoord
          </label>
          <input
            type="password"
            name="current-password"
            id="current-password"
            placeholder="••••••••"
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="new-password" className="block text-sm font-medium text-[#BBBECC] mb-2">
            Nieuw Wachtwoord
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            placeholder="••••••••"
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="confirm-password" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="••••••••"
            value={passwordData.confirmPassword}
            onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
            className="w-full px-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
          />
        </div>
      </div>

      <div className="border-t border-[#2a2d3a] pt-6">
        <h3 className="text-lg font-medium leading-6 text-white">Twee-Factor Authenticatie</h3>
        <p className="mt-1 text-sm text-[#BBBECC]">
          Voeg een extra beveiligingslaag toe aan je account
        </p>
      </div>

      <div className="bg-[#0A0B0F] rounded-lg p-6 border border-[#2a2d3a]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-[#2BE89A]" />
            <div className="ml-4">
              <p className="text-white font-medium">Twee-Factor Authenticatie is ingeschakeld</p>
              <p className="text-sm text-[#BBBECC]">Je account is beveiligd met 2FA</p>
            </div>
          </div>
          <button className="text-red-400 hover:text-red-300 text-sm font-medium">
            Uitschakelen
          </button>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium leading-6 text-white">Login Sessions</h3>
        <p className="mt-1 text-sm text-gray-400">
          Manage your active login sessions
        </p>
      </div>

      <div className="space-y-3">
        {[
          { device: 'MacBook Pro - Chrome', location: 'Amsterdam, NL', current: true },
          { device: 'iPhone 13 - App', location: 'Amsterdam, NL', current: false },
          { device: 'iPad Pro - Safari', location: 'Rotterdam, NL', current: false },
        ].map((session, index) => (
          <div key={index} className="bg-[#0A0B0F] rounded-lg p-4 flex items-center justify-between border border-[#2a2d3a]">
            <div>
              <p className="text-white font-medium">{session.device}</p>
              <p className="text-sm text-[#BBBECC]">{session.location}</p>
            </div>
            {session.current ? (
              <span className="text-sm text-[#2BE89A]">Huidige sessie</span>
            ) : (
              <button className="text-red-400 hover:text-red-300 text-sm">Intrekken</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  const renderAPISettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-white">API Keys</h3>
        <p className="mt-1 text-sm text-gray-400">
          Manage your API keys for third-party integrations
        </p>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white font-medium">Production API Key</p>
            <p className="text-sm text-gray-400">Created on Jan 15, 2025</p>
          </div>
          <button className="text-red-400 hover:text-red-300 text-sm">Delete</button>
        </div>
        <div className="bg-gray-800 rounded p-3 font-mono text-sm text-gray-300">
          sk_live_51H8KL9BkGF4NlNqyR1234567890abcdef
        </div>
      </div>

      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-splitty hover:bg-splitty-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-splitty">
        Generate New API Key
      </button>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium leading-6 text-white">Webhooks</h3>
        <p className="mt-1 text-sm text-gray-400">
          Configure webhook endpoints for real-time updates
        </p>
      </div>

      <div className="space-y-3">
        <div>
          <label htmlFor="webhook-url" className="form-label">
            Webhook URL
          </label>
          <input
            type="url"
            name="webhook-url"
            id="webhook-url"
            placeholder="https://your-domain.com/webhooks/splitty"
            className="form-input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Webhook Events
          </label>
          <div className="space-y-2">
            {['order.created', 'payment.succeeded', 'payout.sent', 'restaurant.updated'].map((event) => (
              <div key={event} className="flex items-center">
                <input
                  id={event}
                  name={event}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-splitty focus:ring-splitty"
                />
                <label htmlFor={event} className="ml-2 text-sm text-gray-300">
                  {event}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderLegalSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-white">Legal Documents</h3>
        <p className="mt-1 text-sm text-gray-400">
          Manage your legal documents and compliance
        </p>
      </div>

      <div className="space-y-4">
        {[
          { name: 'Terms of Service', lastUpdated: 'Jan 1, 2025', status: 'active' },
          { name: 'Privacy Policy', lastUpdated: 'Jan 1, 2025', status: 'active' },
          { name: 'Cookie Policy', lastUpdated: 'Dec 15, 2024', status: 'active' },
          { name: 'Data Processing Agreement', lastUpdated: 'Nov 20, 2024', status: 'active' },
        ].map((doc) => (
          <div key={doc.name} className="bg-gray-700 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <p className="text-white font-medium">{doc.name}</p>
                <p className="text-sm text-gray-400">Last updated: {doc.lastUpdated}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-300">
                Active
              </span>
              <button className="text-splitty hover:text-splitty-dark text-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-lg font-medium leading-6 text-white">Compliance</h3>
        <p className="mt-1 text-sm text-gray-400">
          GDPR and data protection settings
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="gdpr-consent"
              name="gdpr-consent"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-splitty focus:ring-splitty"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="gdpr-consent" className="text-sm font-medium text-gray-300">
              GDPR Compliant
            </label>
            <p className="text-sm text-gray-500">Enable GDPR compliance features</p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex h-5 items-center">
            <input
              id="data-retention"
              name="data-retention"
              type="checkbox"
              defaultChecked
              className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-splitty focus:ring-splitty"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="data-retention" className="text-sm font-medium text-gray-300">
              Automatic Data Retention
            </label>
            <p className="text-sm text-gray-500">Delete old data according to retention policy</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'general':
        return renderGeneralSettings()
      case 'notifications':
        return renderNotificationSettings()
      case 'payment':
        return renderPaymentSettings()
      case 'security':
        return renderSecuritySettings()
      case 'api':
        return renderAPISettings()
      case 'legal':
        return renderLegalSettings()
      default:
        return null
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Instellingen' }]} />

            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white">Instellingen</h1>
              <p className="mt-2 text-[#BBBECC]">
                Beheer je accountinstellingen en voorkeuren
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar */}
              <div className="lg:w-64">
                <nav className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] p-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 mb-1 ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black shadow-lg'
                          : 'text-[#BBBECC] hover:bg-[#0A0B0F] hover:text-white'
                      }`}
                    >
                      <tab.icon className="mr-3 h-5 w-5" />
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                  <div className="p-8">
                    {renderContent()}
                  </div>
                  <div className="bg-[#0A0B0F] px-6 py-4 flex justify-end space-x-3 border-t border-[#2a2d3a]">
                    <button className="px-6 py-3 bg-[#0A0B0F] border border-[#2a2d3a] text-white font-medium rounded-lg hover:bg-[#1a1c25] transition">
                      Annuleren
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
                    >
                      {saved && <CheckIcon className="h-4 w-4 mr-2" />}
                      {saved ? 'Opgeslagen' : 'Wijzigingen Opslaan'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}