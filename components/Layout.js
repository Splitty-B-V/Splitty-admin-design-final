import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useTheme } from '../contexts/ThemeContext'
import {
  HomeIcon,
  BuildingStorefrontIcon,
  ShoppingBagIcon,
  TableCellsIcon,
  BeakerIcon,
  CreditCardIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DevicePhoneMobileIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  XMarkIcon,
  Bars3Icon,
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  ChatBubbleLeftRightIcon,
  BookOpenIcon,
  GlobeAltIcon,
  ArrowsRightLeftIcon,
  Bars2Icon,
} from '@heroicons/react/24/outline'

const allNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
  { 
    name: 'Restaurants', 
    href: '/restaurants', 
    icon: BuildingStorefrontIcon, 
    roles: ['ceo', 'admin', 'account_manager'],
    submenu: [
      { name: 'Alle Restaurants', href: '/restaurants', roles: ['ceo', 'admin', 'account_manager'] },
      { name: 'POS Connecties', href: '/pos', roles: ['ceo', 'admin', 'developer'] },
      { name: 'Uitbetalingen', href: '/payments/payouts', roles: ['ceo', 'admin'] },
    ]
  },
  { name: "Alle Splitty's", href: '/orders', icon: ArrowsRightLeftIcon, roles: ['ceo', 'admin', 'account_manager', 'support'] },
  { name: 'Actieve Tafels', href: '/tables', icon: TableCellsIcon, roles: ['ceo', 'admin', 'account_manager', 'support'] },
  { name: 'Test Bestelling', href: '/test-order', icon: BeakerIcon, roles: ['ceo', 'admin', 'developer'] },
  { name: 'Betalingen', href: '/payments', icon: CreditCardIcon, roles: ['ceo', 'admin'] },
  { name: 'Splitty Team', href: '/users', icon: UsersIcon, roles: ['ceo', 'admin'] },
  { name: 'Support', href: '/support', icon: ChatBubbleLeftRightIcon, roles: ['ceo', 'admin', 'support'] },
  { name: 'Knowledge Base', href: '/knowledge-base', icon: BookOpenIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
  { name: 'Instellingen', href: '/settings', icon: Cog6ToothIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { darkMode, setTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    // Initialize from localStorage - default to Dutch
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem('splitty-language')
      return savedLanguage || 'nl'
    }
    return 'nl' // Default to Dutch
  })
  const [expandedMenus, setExpandedMenus] = useState(() => {
    // Initialize with Restaurants menu expanded if on any of its pages
    const initialExpanded = {}
    const restaurantPaths = ['/restaurants', '/pos', '/payments/payouts']
    if (typeof window !== 'undefined' && restaurantPaths.includes(window.location.pathname)) {
      initialExpanded['Restaurants'] = true
    }
    return initialExpanded
  })
  const router = useRouter()
  
  // Initialize user data with default values
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState('ceo')
  const [userEmail, setUserEmail] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [navigation, setNavigation] = useState(() => {
    // Initialize with all navigation items for ceo role
    return allNavigation
  })
  
  // Load user data from localStorage after mount
  useEffect(() => {
    const loadUserData = () => {
      const storedUserName = localStorage.getItem('userName')
      const storedUserRole = localStorage.getItem('userRole')
      const storedUserEmail = localStorage.getItem('userEmail')
      const storedUserAvatar = localStorage.getItem('userAvatar')
      
      // Debug logging
      console.log('Loading user data:', {
        userName: storedUserName,
        userRole: storedUserRole,
        userEmail: storedUserEmail
      })
      
      setUserName(storedUserName || 'User')
      setUserRole(storedUserRole || 'ceo')
      setUserEmail(storedUserEmail || '')
      setUserAvatar(storedUserAvatar || '')
      
      // Filter navigation based on user role
      // If no valid role, show all navigation items (or use a default role)
      const roleToUse = storedUserRole || 'ceo' // Default to ceo role if no role is set
      
      // If role is not in the system, just show all navigation
      const validRoles = ['ceo', 'admin', 'account_manager', 'support', 'developer', 'staff']
      if (!validRoles.includes(roleToUse)) {
        setNavigation(allNavigation)
      } else {
        const filteredNavigation = allNavigation.filter(item => 
          item.roles && item.roles.includes(roleToUse)
        ).map(item => {
          // Filter submenu items based on user role
          if (item.submenu) {
            return {
              ...item,
              submenu: item.submenu.filter(subItem => 
                subItem.roles && subItem.roles.includes(roleToUse)
              )
            }
          }
          return item
        })
        
        // If no items after filtering, show all
        if (filteredNavigation.length === 0) {
          setNavigation(allNavigation)
        } else {
          setNavigation(filteredNavigation)
        }
      }
    }
    
    // Initial load
    loadUserData()
    
    // Listen for storage events to update user data
    window.addEventListener('storage', loadUserData)
    
    return () => {
      window.removeEventListener('storage', loadUserData)
    }
  }, [])
  
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

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login')
    }
  }, [router.pathname])

  // Load saved preferences once on mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem('sidebar-collapsed')
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true)
    }
  }, []) // Empty dependency array - only run once on mount

  // Only auto-expand submenus when we're on a submenu page AND sidebar is already open
  useEffect(() => {
    // Only run this when navigating to pages, not when sidebar state changes
    if (navigation && navigation.length > 0) {
      navigation.forEach(item => {
        // Only check if we're on a submenu page
        const isOnSubmenuPage = item.submenu && item.submenu.some(sub => router.pathname === sub.href)
        
        if (isOnSubmenuPage && !sidebarCollapsed) {
          setExpandedMenus(prev => ({ ...prev, [item.name]: true }))
        }
      })
    }
  }, [router.pathname]) // Only depend on route changes, not sidebar state

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close language menu if clicking outside
      if (!event.target.closest('.language-selector-sidebar') && languageMenuOpen) {
        setLanguageMenuOpen(false)
      }
      // Close user menu if clicking outside
      if (!event.target.closest('.user-menu-sidebar') && userMenuOpen) {
        setUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [languageMenuOpen, userMenuOpen])

  const toggleSidebar = () => {
    const newState = !sidebarCollapsed
    setSidebarCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', newState.toString())
  }


  const toggleSubmenu = (itemName) => {
    setExpandedMenus(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }))
  }

  const handleLogout = () => {
    // Clear authentication
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    
    // Redirect to login page
    router.push('/login')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0F1117] text-white' : 'bg-[#F9FAFB] text-[#111827]'}`}>
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 transform transition-all duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} flex flex-col bg-white border-r border-gray-200`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute right-0 top-0 p-4">
          <button
            type="button"
            className={`transition-colors duration-200 p-2 rounded-lg ${
              darkMode
                ? 'text-gray-500 hover:text-gray-300 hover:bg-gray-900'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 h-[72px] flex items-center justify-between">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center">
              <Image
                src="/logo-trans.webp"
                alt="Splitty Logo"
                width={100}
                height={35}
                priority
                className="w-auto h-[35px]"
              />
            </Link>
          )}
          {/* Collapse button - more efficiently placed */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden lg:flex items-center justify-center w-8 h-8 transition-all duration-200 text-gray-600 hover:text-gray-900"
            title={sidebarCollapsed ? 'Uitklappen' : 'Inklappen'}
          >
            <svg 
              className={`h-5 w-5 transition-transform duration-200 ${sidebarCollapsed ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" strokeLinejoin="round" />
              <line x1="9" y1="3" x2="9" y2="21" strokeLinejoin="round" />
              <path d="M16 12H12M12 12L14 9M12 12L14 15" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = (router.pathname === item.href && !item.submenu) || 
                           (item.submenu && item.submenu.some(sub => router.pathname === sub.href))
            const isExpanded = expandedMenus[item.name]
            const hasSubmenu = item.submenu && item.submenu.length > 0

            return (
              <div key={item.name} className="relative mb-1">
                {hasSubmenu ? (
                  <div className="px-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      // Navigate immediately to update the active state
                      if (item.href) {
                        router.push(item.href)
                      }
                      // If sidebar is collapsed, expand it and then open submenu
                      if (sidebarCollapsed) {
                        setSidebarCollapsed(false)
                        localStorage.setItem('sidebar-collapsed', 'false')
                        // Use setTimeout to allow sidebar animation to start, then expand submenu
                        setTimeout(() => {
                          setExpandedMenus(prev => ({ ...prev, [item.name]: true }))
                        }, 100)
                      } else {
                        // If sidebar is already open, just toggle the submenu
                        toggleSubmenu(item.name)
                      }
                    }}
                    className={`
                    w-full group flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive && !item.submenu.some(sub => router.pathname === sub.href)
                        ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-5'
                    }
                  `}
                  >
                    <div className="flex items-center">
                      {!sidebarCollapsed && (
                        <ChevronRightIcon 
                          className={`h-4 w-4 mr-2 transition-transform duration-150 ease-in-out transform-gpu ${
                            isExpanded ? 'rotate-90' : 'rotate-0'
                          }`}
                          strokeWidth={1.5}
                        />
                      )}
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive && hasSubmenu && item.submenu.some(sub => router.pathname === sub.href) 
                            ? 'text-green-600' 
                            : isActive 
                              ? 'text-gray-900' 
                              : 'text-gray-500'
                        }`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="flex-1 ml-3 text-left transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </button>
                  </div>
                ) : (
                  <div className="px-2">
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      // If sidebar is collapsed, expand it smoothly without any submenu effects
                      if (sidebarCollapsed) {
                        // Don't prevent default - let the navigation happen immediately
                        // This updates the route and green background instantly
                        setSidebarCollapsed(false)
                        localStorage.setItem('sidebar-collapsed', 'false')
                      }
                      // Navigation happens immediately in all cases
                    }}
                    className={`
                    group flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-5'
                    }
                  `}
                  >
                    <div className="flex items-center">
                      {!sidebarCollapsed && (
                        <div className="w-4 mr-2" />
                      )}
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive && hasSubmenu && item.submenu.some(sub => router.pathname === sub.href) 
                            ? 'text-green-600' 
                            : isActive 
                              ? 'text-gray-900' 
                              : 'text-gray-500'
                        }`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="flex-1 ml-3 transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                  </div>
                )}

                {/* Submenu */}
                {hasSubmenu && !sidebarCollapsed && (
                  <div className={`transition-all duration-300 ease-in-out ${
                    isExpanded ? 'mt-1' : ''
                  }`}>
                    <div className={`overflow-hidden transition-[max-height] duration-300 ease-in-out ${
                      isExpanded ? 'max-h-40' : 'max-h-0'
                    }`}>
                      {item.submenu.map((subItem) => {
                        const isSubActive = router.pathname === subItem.href
                        return (
                          <div key={subItem.href} className="px-2 mb-1">
                            <Link
                              href={subItem.href}
                              className={`
                              group flex items-center py-3 text-sm font-medium rounded-lg transition-all duration-200
                              ${
                                isSubActive
                                  ? '-ml-4 mr-0 pl-9 pr-5 bg-green-50 text-gray-900 font-medium'
                                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 px-5'
                              }
                            `}
                            >
                              <div className="flex items-center">
                                <div className="w-4 mr-2" /> {/* Spacer for chevron */}
                                <div className="w-5" /> {/* Spacer for icon */}
                              </div>
                              <span className="flex-1 ml-3">
                                {subItem.name}
                              </span>
                            </Link>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom Section */}
        <div className="px-4 py-4 border-t border-gray-200 space-y-3">
            {/* Notifications */}
            <button 
              onClick={() => {
                // Navigate immediately to show active state
                router.push('/settings?tab=notifications')
                // If sidebar is collapsed, expand it smoothly
                if (sidebarCollapsed) {
                  setSidebarCollapsed(false)
                  localStorage.setItem('sidebar-collapsed', 'false')
                }
              }}
              className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 mr-3 text-gray-500" />
                {!sidebarCollapsed && (
                  <span>Notificaties</span>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="w-6 h-6 text-xs font-bold rounded-full flex items-center justify-center bg-green-500 text-white">
                  3
                </div>
              )}
            </button>

            {/* Theme Switcher */}
            {!sidebarCollapsed && (
              <div className="flex items-center rounded-full p-1 bg-gray-100">
                <button
                  onClick={() => setTheme(false)}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    !darkMode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
                  }`}
                >
                  <SunIcon className="h-4 w-4 inline mr-1" />
                  Light
                </button>
                <button
                  onClick={() => setTheme(true)}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    darkMode ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <MoonIcon className="h-4 w-4 inline mr-1" />
                  Dark
                </button>
              </div>
            )}

            {/* Language Selector */}
            {!sidebarCollapsed && (
              <div className="relative language-selector-sidebar">
                <button
                  onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <GlobeAltIcon className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{selectedLanguage === 'en' ? 'English' : 'Nederlands'}</span>
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {languageMenuOpen && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white border border-gray-200 shadow-lg py-1">
                    <button
                      onClick={() => {
                        setSelectedLanguage('en')
                        localStorage.setItem('splitty-language', 'en')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        selectedLanguage === 'en' 
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      🇺🇸 English
                    </button>
                    <button
                      onClick={() => {
                        setSelectedLanguage('nl')
                        localStorage.setItem('splitty-language', 'nl')
                        setLanguageMenuOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors duration-200 ${
                        selectedLanguage === 'nl' 
                          ? 'text-green-600 bg-green-50'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      🇳🇱 Nederlands
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-gray-200 pt-3">
            {/* User menu */}
              <div className="relative user-menu-sidebar">
                <button
                  onClick={() => {
                    // If sidebar is collapsed, just expand it smoothly without opening dropdown
                    if (sidebarCollapsed) {
                      setSidebarCollapsed(false)
                      localStorage.setItem('sidebar-collapsed', 'false')
                      // Don't open the dropdown when expanding sidebar
                    } else {
                      // Only toggle dropdown if sidebar is already open
                      setUserMenuOpen(!userMenuOpen)
                    }
                  }}
                  className={`w-full flex items-center ${sidebarCollapsed ? 'justify-center px-2' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-all duration-200 group bg-gray-50 text-gray-700 hover:text-gray-900 hover:bg-gray-100`}
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName} 
                      className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10 mr-3'} rounded-full object-cover border-2 border-gray-200 flex-shrink-0`}
                    />
                  ) : (
                    <div className={`${sidebarCollapsed ? 'w-10 h-10' : 'w-10 h-10 mr-3'} rounded-full flex items-center justify-center text-sm font-medium bg-gradient-to-br from-green-500 to-emerald-500 text-white flex-shrink-0`}>
                      {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                    </div>
                  )}
                  {!sidebarCollapsed && (
                    <>
                      <div className="flex-1 text-left">
                        <div className="font-semibold truncate">{userName || 'User'}</div>
                        <div className="text-xs opacity-75">{getRoleDisplay(userRole || 'ceo')}</div>
                      </div>
                      <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </>
                  )}
                </button>
                
                {/* User Dropdown Menu */}
                {userMenuOpen && !sidebarCollapsed && (
                  <div className="absolute bottom-full left-0 mb-2 w-full rounded-lg bg-white border border-gray-200 shadow-lg py-1">
                    <button
                      onClick={() => {
                        router.push('/settings?tab=profiel')
                        setUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <UsersIcon className="h-4 w-4 inline mr-2" />
                      Mijn Profiel
                    </button>
                    <button
                      onClick={() => {
                        router.push('/settings?tab=algemeen')
                        setUserMenuOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    >
                      <Cog6ToothIcon className="h-4 w-4 inline mr-2" />
                      Account Instellingen
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm transition-colors duration-200 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4 inline mr-2" />
                      Uitloggen
                    </button>
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'
        }`}
      >
        {/* Mobile Header Only */}
        <header className="lg:hidden fixed top-0 left-0 right-0 transition-all duration-300 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6">
            <div className="flex justify-between items-center h-[72px]">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="p-2 rounded-lg transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Logo for mobile */}
                <Image
                  src="/logo-trans.webp"
                  alt="Splitty"
                  width={100}
                  height={35}
                  className="h-[35px] w-auto"
                />
              </div>

              {/* Simple mobile user avatar */}
              <div className="flex items-center">
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full flex items-center justify-center font-semibold bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    {userName ? userName.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className={`min-h-screen transition-colors duration-300 lg:pt-0 pt-[72px] ${
          darkMode ? 'bg-[#0F1117]' : 'bg-[#F9FAFB]'
        }`}>
          {children}
        </main>
      </div>
    </div>
  )
}