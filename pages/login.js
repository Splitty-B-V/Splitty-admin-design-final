import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Link from 'next/link'
import { useUsers } from '../contexts/UsersContext'
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  GlobeAltIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline'

export default function Login() {
  const router = useRouter()
  const { authenticateUser } = useUsers()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState('nl')
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false)

  const languages = [
    { code: 'nl', name: 'Nederlands' },
    { code: 'en', name: 'English' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector') && languageDropdownOpen) {
        setLanguageDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageDropdownOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Authenticate against actual users
    const user = authenticateUser(email, password)
    
    if (user) {
      // Store user info
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userEmail', user.email)
      localStorage.setItem('userName', user.name)
      localStorage.setItem('userRole', user.role)
      localStorage.setItem('userId', user.id.toString())
      localStorage.setItem('userAvatar', user.avatar || '')
      
      // Redirect to dashboard
      setTimeout(() => {
        router.push('/dashboard')
      }, 1000)
    } else {
      setError('Ongeldige e-mail of wachtwoord')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B0F] flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0F1117] to-[#1c1e27] p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#2BE89A] rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#4FFFB0] rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-white mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0]">
                SMART
              </span>{' '}
              Payments
            </h1>
            <p className="text-xl text-[#BBBECC]">
              Split betalingen makkelijk voor grote groepen
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6 mt-12">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#2BE89A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#2BE89A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Veilig & Betrouwbaar</h3>
                <p className="text-[#BBBECC] text-sm">Enterprise-grade beveiliging voor al je transacties</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#2BE89A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#2BE89A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Supersnel</h3>
                <p className="text-[#BBBECC] text-sm">Verwerk betalingen in realtime</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#2BE89A]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#2BE89A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Makkelijk te gebruiken</h3>
                <p className="text-[#BBBECC] text-sm">Intuïtieve interface voor iedereen</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Logo */}
        <div className="relative z-10">
          <Image 
            src="/favicon-1.png" 
            alt="Splitty" 
            width={150} 
            height={50}
            className="opacity-50"
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <div className="lg:hidden">
            <Image 
              src="/splitty.png" 
              alt="Splitty" 
              width={120} 
              height={40}
            />
          </div>
          
          {/* Language Selector */}
          <div className="relative language-selector">
            <button 
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white hover:bg-[#2a2d3a] transition"
            >
              <GlobeAltIcon className="h-5 w-5" />
              <span>{languages.find(l => l.code === language)?.name}</span>
              <ChevronDownIcon className={`h-4 w-4 transition-transform ${languageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {/* Dropdown */}
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg shadow-lg py-1 z-10">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code)
                      setLanguageDropdownOpen(false)
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-[#2a2d3a] transition ${
                      language === lang.code ? 'text-[#2BE89A] bg-[#2BE89A]/10' : 'text-white'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Login Form */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            {/* Logo for Desktop */}
            <div className="text-center mb-8 hidden lg:block">
              <Image 
                src="/favicon-1.png" 
                alt="Splitty" 
                width={180} 
                height={60}
                className="mx-auto"
              />
            </div>

            {/* Welcome Text */}
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Welkom terug!</h2>
              <p className="text-[#BBBECC]">Log in op je Splitty Super Admin account</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#BBBECC] mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-[#BBBECC]" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    placeholder="je@email.nl"
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#BBBECC] mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-[#BBBECC]" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-[#BBBECC] hover:text-white" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-[#BBBECC] hover:text-white" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-[#2BE89A] focus:ring-[#2BE89A] border-[#2a2d3a] rounded bg-[#0A0B0F]"
                  />
                  <span className="ml-2 text-sm text-[#BBBECC]">Onthoud mij</span>
                </label>
                <Link href="/forgot-password" className="text-sm text-[#2BE89A] hover:text-[#4FFFB0] transition">
                  Wachtwoord vergeten?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inloggen...
                  </>
                ) : (
                  'Inloggen'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="mt-8 text-center text-sm text-[#BBBECC]">
              Nog geen account?{' '}
              <Link href="/signup" className="text-[#2BE89A] hover:text-[#4FFFB0] transition font-medium">
                Neem contact op
              </Link>
            </p>

            {/* Footer */}
            <div className="mt-12 text-center">
              <p className="text-xs text-[#BBBECC]">
                &copy; 2025 Splitty B.V. Alle rechten voorbehouden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}