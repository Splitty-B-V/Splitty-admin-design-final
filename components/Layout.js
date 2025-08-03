import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'
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
} from '@heroicons/react/24/outline'

const allNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
  { name: 'Restaurants', href: '/restaurants', icon: BuildingStorefrontIcon, roles: ['ceo', 'admin', 'account_manager'] },
  { name: 'Orders', href: '/orders', icon: ShoppingBagIcon, roles: ['ceo', 'admin', 'account_manager', 'support'] },
  { name: 'Active Tables', href: '/tables', icon: TableCellsIcon, roles: ['ceo', 'admin', 'account_manager', 'support'] },
  { name: 'Test Order', href: '/test-order', icon: BeakerIcon, roles: ['ceo', 'admin', 'developer'] },
  { name: 'Payments', href: '/payments', icon: CreditCardIcon, roles: ['ceo', 'admin'] },
  { name: 'Uitbetalingen', href: '/payments/payouts', icon: CurrencyDollarIcon, roles: ['ceo', 'admin'] },
  { name: 'Users', href: '/users', icon: UsersIcon, roles: ['ceo', 'admin'] },
  { name: 'POS Integration', href: '/pos', icon: DevicePhoneMobileIcon, roles: ['ceo', 'admin', 'developer'] },
  { name: 'Support', href: '/support', icon: ChatBubbleLeftRightIcon, roles: ['ceo', 'admin', 'support'] },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, roles: ['ceo', 'admin', 'account_manager', 'support', 'developer'] },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [expandedMenus, setExpandedMenus] = useState({})
  const router = useRouter()
  
  // Initialize user data with default values
  const [userName, setUserName] = useState('User')
  const [userRole, setUserRole] = useState('staff')
  const [userEmail, setUserEmail] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [navigation, setNavigation] = useState(allNavigation)
  
  // Load user data from localStorage after mount
  useEffect(() => {
    const loadUserData = () => {
      const storedUserName = localStorage.getItem('userName') || 'User'
      const storedUserRole = localStorage.getItem('userRole') || 'staff'
      const storedUserEmail = localStorage.getItem('userEmail') || ''
      const storedUserAvatar = localStorage.getItem('userAvatar') || ''
      
      setUserName(storedUserName)
      setUserRole(storedUserRole)
      setUserEmail(storedUserEmail)
      setUserAvatar(storedUserAvatar)
      
      // Filter navigation based on user role
      const filteredNavigation = allNavigation.filter(item => 
        item.roles.includes(storedUserRole)
      )
      setNavigation(filteredNavigation)
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

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated && router.pathname !== '/login') {
      router.push('/login')
    }

    const savedCollapsed = localStorage.getItem('sidebar-collapsed')
    if (savedCollapsed === 'true') {
      setSidebarCollapsed(true)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.language-selector') && languageMenuOpen) {
        setLanguageMenuOpen(false)
      }
      if (!event.target.closest('.user-menu') && userMenuOpen) {
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

  const toggleDarkMode = () => {
    const newMode = !darkMode
    setDarkMode(newMode)
    if (newMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('splitty-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('splitty-theme', 'light')
    }
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
    <div className="min-h-screen bg-[#0F1117] text-white transition-colors duration-300">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0F1117] border-r border-[#1c1e27] transform transition-all duration-300 ease-in-out lg:transform-none lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'} flex flex-col`}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute right-0 top-0 p-4">
          <button
            type="button"
            className="text-gray-400 hover:text-gray-200 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100/10"
            onClick={() => setSidebarOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#1c1e27]">
          <Link href="/dashboard" className="flex items-center">
            <div className="mr-3">
              <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24.5677 14.4032C24.5677 14.7186 24.5523 15.0288 24.5162 15.3338C24.0527 19.5266 20.5143 22.7887 16.2137 22.7887H13.6178V18.0583H16.2137C16.7081 18.0583 17.1819 17.9601 17.63 17.774C18.0627 17.5879 18.4541 17.3242 18.7889 16.9881C18.8559 16.9209 18.9228 16.8486 18.9898 16.771C19.2318 16.4867 19.4276 16.1661 19.5718 15.8249C19.7572 15.3803 19.855 14.9047 19.855 14.4084C19.855 14.4084 19.855 14.4084 19.855 14.4032C19.855 13.9069 19.7572 13.4313 19.5718 12.9815C19.4276 12.6403 19.2318 12.3249 18.9949 12.0406C18.928 11.963 18.861 11.8907 18.7889 11.8183C18.7219 11.7511 18.6498 11.6839 18.5726 11.6167C18.2893 11.3737 17.97 11.1772 17.63 11.0325C17.1819 10.8412 16.7081 10.7481 16.2137 10.7481H8.34375C7.04584 10.7481 5.98999 9.69346 5.98999 8.38549V8.37515C5.98999 7.07234 7.04069 6.01769 8.33345 6.01769H16.2085C17.0274 6.01769 17.8206 6.1366 18.5674 6.3589C20.4885 6.92241 22.1161 8.16318 23.1925 9.80203C24.0578 11.1255 24.5626 12.7023 24.5626 14.4032H24.5677ZM5.77882 10.9704C5.70671 10.898 5.63976 10.8257 5.5728 10.7481C5.33073 10.4638 5.14016 10.1484 4.99595 9.8072C4.81053 9.37293 4.71783 8.90764 4.71268 8.42685C4.71268 8.41134 4.71268 8.39583 4.71268 8.38549C4.71268 8.38549 4.71268 8.38032 4.71268 8.37515C4.71268 7.88401 4.81053 7.40838 4.99595 6.96377C5.14016 6.61739 5.33588 6.30203 5.57795 6.01769C5.63976 5.94531 5.70671 5.87293 5.77367 5.80055C6.10845 5.46451 6.49989 5.20085 6.93253 5.01473C7.38062 4.82345 7.85446 4.73039 8.3489 4.73039H16.2137C17.5167 4.73039 18.5674 3.67057 18.5674 2.36776C18.5674 1.05979 17.5116 0.0051331 16.2137 0.0051331H8.3489C4.05857 -3.67681e-05 0.515046 3.25698 0.0515046 7.44457C0.0515046 7.44457 0.0515046 7.44974 0.0566551 7.44457C0.066956 7.4394 0.077257 7.43423 0.0875579 7.42389C0.077257 7.43423 0.0618056 7.4394 0.0515046 7.44974C0.0154514 7.75476 0 8.06496 0 8.38032C0 10.0812 0.504746 11.6632 1.37002 12.9815C2.44647 14.6203 4.07402 15.8611 5.99514 16.4246C6.10845 16.4557 6.22176 16.4867 6.33507 16.5177V11.4202C6.21661 11.3427 6.1033 11.2548 5.99514 11.1617C5.92303 11.0997 5.85093 11.0325 5.77882 10.9601V10.9704ZM16.2188 16.771C17.5167 16.771 18.5726 15.7112 18.5726 14.4084C18.5726 14.3825 18.5726 14.3515 18.5726 14.3257C18.5314 13.059 17.491 12.0406 16.2137 12.0406H7.61754V22.7887H7.62784C7.62269 22.7887 7.61754 22.7887 7.61754 22.7991V25.6373C7.61754 26.9453 8.67338 28 9.9713 28C11.2744 28 12.3251 26.9401 12.3251 25.6373V22.7991C12.3251 22.7939 12.3251 22.7887 12.3148 22.7887H12.3251V16.771H16.2137H16.2188Z" fill="url(#paint0_linear_splitty)"/>
                <defs>
                  <linearGradient id="paint0_linear_splitty" x1="0" y1="14" x2="24.5677" y2="14" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2BE89A"/>
                    <stop offset="1" stopColor="#4FFFB0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-white">
              <h4 className="text-lg font-medium">Splitty Admin</h4>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-3 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = router.pathname === item.href || 
                           (item.submenu && item.submenu.some(sub => router.pathname === sub.href))
            const isExpanded = expandedMenus[item.name]
            const hasSubmenu = item.submenu && item.submenu.length > 0

            return (
              <div key={item.name} className="relative mb-1">
                {hasSubmenu ? (
                  <button
                    onClick={() => toggleSubmenu(item.name)}
                    className={`
                    w-full group flex items-center px-5 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 text-[#2BE89A]'
                        : 'text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]'
                    }
                  `}
                  >
                    <div className="mr-3">
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive ? 'text-[#2BE89A]' : ''
                        }`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <>
                        <span className="flex-1 text-left transition-all duration-200">
                          {item.name}
                        </span>
                        <ChevronRightIcon 
                          className={`h-4 w-4 transition-transform duration-200 ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                        />
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className={`
                    group flex items-center px-5 py-3 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2BE89A]/10 to-[#4FFFB0]/10 text-[#2BE89A]'
                        : 'text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]'
                    }
                  `}
                  >
                    <div className="mr-3">
                      <item.icon
                        className={`h-5 w-5 transition-all duration-200 ${
                          isActive ? 'text-[#2BE89A]' : ''
                        }`}
                      />
                    </div>
                    {!sidebarCollapsed && (
                      <span className="flex-1 transition-all duration-200">
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}

                {/* Submenu */}
                {hasSubmenu && isExpanded && !sidebarCollapsed && (
                  <div className="mt-1 ml-10">
                    {item.submenu.map((subItem) => {
                      const isSubActive = router.pathname === subItem.href
                      return (
                        <Link
                          key={subItem.href}
                          href={subItem.href}
                          className={`
                          block px-4 py-2 text-sm rounded-lg transition-all duration-200
                          ${
                            isSubActive
                              ? 'text-[#2BE89A] bg-[#2BE89A]/5'
                              : 'text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]'
                          }
                        `}
                        >
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-[#1c1e27] px-4 py-4">
          {/* Community and Tools Section */}
          <div className="space-y-3 mb-4">
            <a 
              href="#"
              className="flex items-center justify-between px-4 py-3 bg-[#1c1e27] rounded-lg text-sm text-[#BBBECC] hover:text-white hover:bg-[#252833] transition-all duration-200"
            >
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5 mr-3">
                  <path fill="#2BE89A" d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                </svg>
                <span>Join our community</span>
              </div>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8L8 1M8 1H1M8 1V8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
            
            <a 
              href="#"
              className="flex items-center justify-between px-4 py-3 bg-[#1c1e27] rounded-lg text-sm text-[#BBBECC] hover:text-white hover:bg-[#252833] transition-all duration-200"
            >
              <div className="flex items-center">
                <svg viewBox="0 0 656 656" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3">
                  <path d="M642.261 613.995L642.258 613.992L503.93 475.664C550.675 421.792 575.4 352.157 572.968 280.697C570.455 206.844 539.136 136.909 485.714 85.8543C432.291 34.8 361.008 6.68243 287.117 7.51811C213.227 8.35378 142.598 38.0763 90.3439 90.3258C38.0896 142.575 8.36074 213.201 7.5184 287.092C6.67606 360.982 34.7872 432.268 85.8367 485.695C136.886 539.122 206.819 570.447 280.671 572.967C352.132 575.405 421.769 550.687 475.645 503.946L613.975 642.277L613.979 642.281C617.731 646.027 622.817 648.131 628.119 648.129C633.421 648.127 638.505 646.019 642.254 642.27C646.003 638.52 648.11 633.436 648.111 628.133C648.112 622.831 646.008 617.746 642.261 613.995ZM48.1372 290.628C48.1382 242.668 62.3604 195.785 89.0056 155.907C115.652 116.029 153.525 84.947 197.836 66.5928C242.147 48.2386 290.905 43.4363 337.945 52.7932C384.986 62.1501 428.195 85.2458 462.109 119.16C496.023 153.074 519.119 196.283 528.476 243.323C537.833 290.364 533.03 339.122 514.676 383.433C496.322 427.744 465.24 465.617 425.361 492.263C385.485 518.908 338.604 533.13 290.645 533.132C226.35 533.059 164.709 507.486 119.246 462.023C73.7836 416.56 48.2106 354.921 48.1372 290.628Z" fill="#2BE89A" stroke="#2BE89A" strokeWidth="15"/>
                  <path d="M107 473.5L277.5 303L352.5 378L632.5 98" stroke="#2BE89A" strokeWidth="60"/>
                </svg>
                <span>Product research tool</span>
              </div>
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 8L8 1M8 1H1M8 1V8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>

          <div className="border-t border-[#1c1e27] pt-4">
            {/* Collapse button */}
            <div className="hidden lg:block mb-4">
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]"
              >
                <ChevronLeftIcon
                  className={`h-5 w-5 ${sidebarCollapsed ? 'rotate-180' : ''} ${
                    sidebarCollapsed ? '' : 'mr-3'
                  }`}
                />
                {!sidebarCollapsed && <span>Collapse</span>}
              </button>
            </div>

            {/* User menu */}
            <div className="relative group">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-[#BBBECC] hover:text-white hover:bg-[#1c1e27] group"
              >
                {userAvatar ? (
                  <img 
                    src={userAvatar} 
                    alt={userName} 
                    className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-[#2a2d3a]"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gradient-to-br from-[#2BE89A] to-[#4FFFB0] rounded-full flex items-center justify-center text-[#0F1117] text-sm font-medium mr-3">
                    {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </div>
                )}
                {!sidebarCollapsed && (
                  <>
                    <div className="flex-1 text-left">
                      <div className="font-semibold truncate">{userName}</div>
                      <div className="text-xs opacity-75">{getRoleDisplay(userRole)}</div>
                    </div>
                    <ArrowRightOnRectangleIcon className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500" />
                  </>
                )}
              </button>
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
        {/* Header */}
        <header className="bg-[#0F1117] border-b border-[#1c1e27] transition-all duration-300">
          <div className="px-6">
            <div className="flex justify-between items-center h-[72px]">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  type="button"
                  className="lg:hidden p-2 rounded-lg transition-colors duration-200 text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>

                {/* Logo for mobile */}
                <div className="lg:hidden">
                  <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24.5677 14.4032C24.5677 14.7186 24.5523 15.0288 24.5162 15.3338C24.0527 19.5266 20.5143 22.7887 16.2137 22.7887H13.6178V18.0583H16.2137C16.7081 18.0583 17.1819 17.9601 17.63 17.774C18.0627 17.5879 18.4541 17.3242 18.7889 16.9881C18.8559 16.9209 18.9228 16.8486 18.9898 16.771C19.2318 16.4867 19.4276 16.1661 19.5718 15.8249C19.7572 15.3803 19.855 14.9047 19.855 14.4084C19.855 14.4084 19.855 14.4084 19.855 14.4032C19.855 13.9069 19.7572 13.4313 19.5718 12.9815C19.4276 12.6403 19.2318 12.3249 18.9949 12.0406C18.928 11.963 18.861 11.8907 18.7889 11.8183C18.7219 11.7511 18.6498 11.6839 18.5726 11.6167C18.2893 11.3737 17.97 11.1772 17.63 11.0325C17.1819 10.8412 16.7081 10.7481 16.2137 10.7481H8.34375C7.04584 10.7481 5.98999 9.69346 5.98999 8.38549V8.37515C5.98999 7.07234 7.04069 6.01769 8.33345 6.01769H16.2085C17.0274 6.01769 17.8206 6.1366 18.5674 6.3589C20.4885 6.92241 22.1161 8.16318 23.1925 9.80203C24.0578 11.1255 24.5626 12.7023 24.5626 14.4032H24.5677ZM5.77882 10.9704C5.70671 10.898 5.63976 10.8257 5.5728 10.7481C5.33073 10.4638 5.14016 10.1484 4.99595 9.8072C4.81053 9.37293 4.71783 8.90764 4.71268 8.42685C4.71268 8.41134 4.71268 8.39583 4.71268 8.38549C4.71268 8.38549 4.71268 8.38032 4.71268 8.37515C4.71268 7.88401 4.81053 7.40838 4.99595 6.96377C5.14016 6.61739 5.33588 6.30203 5.57795 6.01769C5.63976 5.94531 5.70671 5.87293 5.77367 5.80055C6.10845 5.46451 6.49989 5.20085 6.93253 5.01473C7.38062 4.82345 7.85446 4.73039 8.3489 4.73039H16.2137C17.5167 4.73039 18.5674 3.67057 18.5674 2.36776C18.5674 1.05979 17.5116 0.0051331 16.2137 0.0051331H8.3489C4.05857 -3.67681e-05 0.515046 3.25698 0.0515046 7.44457C0.0515046 7.44457 0.0515046 7.44974 0.0566551 7.44457C0.066956 7.4394 0.077257 7.43423 0.0875579 7.42389C0.077257 7.43423 0.0618056 7.4394 0.0515046 7.44974C0.0154514 7.75476 0 8.06496 0 8.38032C0 10.0812 0.504746 11.6632 1.37002 12.9815C2.44647 14.6203 4.07402 15.8611 5.99514 16.4246C6.10845 16.4557 6.22176 16.4867 6.33507 16.5177V11.4202C6.21661 11.3427 6.1033 11.2548 5.99514 11.1617C5.92303 11.0997 5.85093 11.0325 5.77882 10.9601V10.9704ZM16.2188 16.771C17.5167 16.771 18.5726 15.7112 18.5726 14.4084C18.5726 14.3825 18.5726 14.3515 18.5726 14.3257C18.5314 13.059 17.491 12.0406 16.2137 12.0406H7.61754V22.7887H7.62784C7.62269 22.7887 7.61754 22.7887 7.61754 22.7991V25.6373C7.61754 26.9453 8.67338 28 9.9713 28C11.2744 28 12.3251 26.9401 12.3251 25.6373V22.7991C12.3251 22.7939 12.3251 22.7887 12.3148 22.7887H12.3251V16.771H16.2137H16.2188Z" fill="url(#paint0_linear_header)"/>
                    <defs>
                      <linearGradient id="paint0_linear_header" x1="0" y1="14" x2="24.5677" y2="14" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#2BE89A"/>
                        <stop offset="1" stopColor="#4FFFB0"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                {/* Theme switcher */}
                <div className="hidden lg:flex items-center bg-[#1c1e27] rounded-full p-1">
                  <button
                    onClick={() => setDarkMode(false)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      !darkMode ? 'bg-[#0F1117] text-white' : 'text-[#BBBECC]'
                    }`}
                  >
                    <SunIcon className="h-4 w-4 inline mr-1" />
                    Light
                  </button>
                  <button
                    onClick={() => setDarkMode(true)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                      darkMode ? 'bg-[#0F1117] text-white' : 'text-[#BBBECC]'
                    }`}
                  >
                    <MoonIcon className="h-4 w-4 inline mr-1" />
                    Dark
                  </button>
                </div>

                {/* Language selector */}
                <div className="relative language-selector">
                  <button 
                    onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-[#BBBECC] hover:text-white transition-colors duration-200"
                  >
                    <span className="text-lg">{selectedLanguage === 'en' ? '🇺🇸' : '🇳🇱'}</span>
                    <span>{selectedLanguage === 'en' ? 'English' : 'Nederlands'}</span>
                    <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${languageMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {languageMenuOpen && (
                    <div className="absolute top-full left-0 mt-1 w-40 bg-[#0F1117] border border-[#1c1e27] rounded-lg shadow-lg py-1 z-10">
                      <button
                        onClick={() => {
                          setSelectedLanguage('en')
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200 ${
                          selectedLanguage === 'en' 
                            ? 'text-[#2BE89A] bg-[#2BE89A]/10' 
                            : 'text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]'
                        }`}
                      >
                        <span className="text-lg">🇺🇸</span>
                        <span>English</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedLanguage('nl')
                          setLanguageMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors duration-200 ${
                          selectedLanguage === 'nl' 
                            ? 'text-[#2BE89A] bg-[#2BE89A]/10' 
                            : 'text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]'
                        }`}
                      >
                        <span className="text-lg">🇳🇱</span>
                        <span>Nederlands</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Info dropdown */}
                <button className="p-2 rounded-lg transition-colors duration-200 text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]">
                  <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 0C7.62108 0 5.78435 0.557165 4.22209 1.60104C2.65982 2.64491 1.44218 4.12861 0.723149 5.86451C0.00411622 7.6004 -0.184015 9.51054 0.182544 11.3534C0.549104 13.1962 1.45389 14.8889 2.78249 16.2175C4.11109 17.5461 5.80383 18.4509 7.64664 18.8175C9.48946 19.184 11.3996 18.9959 13.1355 18.2769C14.8714 17.5578 16.3551 16.3402 17.399 14.7779C18.4428 13.2156 19 11.3789 19 9.5C18.9973 6.98128 17.9955 4.5665 16.2145 2.78549C14.4335 1.00449 12.0187 0.00272419 9.5 0ZM9.5 17.4167C7.93423 17.4167 6.40363 16.9524 5.10174 16.0825C3.79985 15.2126 2.78515 13.9762 2.18596 12.5296C1.58676 11.083 1.42999 9.49122 1.73545 7.95553C2.04092 6.41985 2.79491 5.00924 3.90207 3.90207C5.00924 2.79491 6.41986 2.04092 7.95554 1.73545C9.49122 1.42998 11.083 1.58676 12.5296 2.18595C13.9762 2.78515 15.2126 3.79985 16.0825 5.10174C16.9524 6.40362 17.4167 7.93423 17.4167 9.5C17.4144 11.5989 16.5795 13.6112 15.0954 15.0954C13.6112 16.5795 11.5989 17.4144 9.5 17.4167Z" fill="currentColor"/>
                    <path d="M9.50081 7.91686H8.70914C8.49918 7.91686 8.29782 8.00027 8.14935 8.14874C8.00089 8.2972 7.91748 8.49857 7.91748 8.70853C7.91748 8.91849 8.00089 9.11985 8.14935 9.26832C8.29782 9.41679 8.49918 9.50019 8.70914 9.50019H9.50081V14.2502C9.50081 14.4602 9.58422 14.6615 9.73269 14.81C9.88115 14.9585 10.0825 15.0419 10.2925 15.0419C10.5024 15.0419 10.7038 14.9585 10.8523 14.81C11.0007 14.6615 11.0841 14.4602 11.0841 14.2502V9.50019C11.0841 9.08027 10.9173 8.67754 10.6204 8.38061C10.3235 8.08368 9.92074 7.91686 9.50081 7.91686Z" fill="currentColor"/>
                    <path d="M9.50049 6.33332C10.1563 6.33332 10.688 5.80166 10.688 5.14582C10.688 4.48999 10.1563 3.95832 9.50049 3.95832C8.84465 3.95832 8.31299 4.48999 8.31299 5.14582C8.31299 5.80166 8.84465 6.33332 9.50049 6.33332Z" fill="currentColor"/>
                  </svg>
                </button>

                {/* Download */}
                <button className="p-2 rounded-lg transition-colors duration-200 text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]">
                  <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 12.3333V16.1111C17 16.6121 16.8127 17.0925 16.4793 17.4468C16.1459 17.801 15.6937 18 15.2222 18H2.77778C2.30628 18 1.8541 17.801 1.5207 17.4468C1.1873 17.0925 1 16.6121 1 16.1111V12.3333M4.55556 7.61111L9 12.3333M9 12.3333L13.4444 7.61111M9 12.3333V1" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Notifications */}
                <button className="p-2 rounded-lg transition-colors duration-200 relative text-[#BBBECC] hover:text-white hover:bg-[#1c1e27]">
                  <BellIcon className="h-5 w-5" />
                  <div className="absolute top-0 right-0 w-5 h-5 bg-[#2BE89A] text-[#0F1117] text-xs font-bold rounded-full flex items-center justify-center">
                    3
                  </div>
                </button>

                {/* User menu */}
                <div className="relative user-menu">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-[#1c1e27]"
                  >
                    {userAvatar ? (
                      <img 
                        src={userAvatar} 
                        alt={userName} 
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#2a2d3a]"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-full flex items-center justify-center text-black font-semibold">
                        {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    )}
                    <div className="hidden lg:block text-left">
                      <div className="text-sm">
                        <span className="text-white font-medium">{userName}</span>
                      </div>
                      <div className="text-xs text-[#BBBECC]">
                        CEO & Founder
                      </div>
                    </div>
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-[#0F1117] border border-[#1c1e27] rounded-lg shadow-lg py-2 z-10">
                      <div className="px-4 py-2 border-b border-[#1c1e27]">
                        <p className="text-sm font-medium text-white">{userName}</p>
                        <p className="text-xs text-[#BBBECC]">{getRoleDisplay(userRole)}</p>
                      </div>
                      <button className="w-full text-left px-4 py-2 text-sm text-[#BBBECC] hover:text-white hover:bg-[#1c1e27] transition-colors duration-200">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-[#BBBECC] hover:text-white hover:bg-[#1c1e27] transition-colors duration-200">
                        Account Settings
                      </button>
                      <div className="border-t border-[#1c1e27] mt-2 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#1c1e27] transition-colors duration-200"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="bg-[#0F1117] min-h-screen transition-colors duration-300">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-[#0F1117] text-[#BBBECC] border-[#1c1e27] border-t p-4 text-center text-sm transition-all duration-300">
          <p>© 2025 Splitty B.V. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}