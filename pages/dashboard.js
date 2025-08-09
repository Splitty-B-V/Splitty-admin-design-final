import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import { useRestaurants } from '../contexts/RestaurantsContext'
import {
  BuildingStorefrontIcon,
  UsersIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  ChartBarIcon,
  ClockIcon,
  DocumentTextIcon,
  StarIcon,
  UserGroupIcon,
  SparklesIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  QueueListIcon,
} from '@heroicons/react/24/outline'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const [greeting, setGreeting] = useState('')
  const [selectedStore, setSelectedStore] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [userName, setUserName] = useState('User')
  const [selectedMetric, setSelectedMetric] = useState('splitty-omzet') // Track which metric is selected
  const [analyticsView, setAnalyticsView] = useState('totaal') // totaal, restaurant, regio
  const [customDateRange, setCustomDateRange] = useState({ start: null, end: null })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [compareWithPrevious, setCompareWithPrevious] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [calendarView, setCalendarView] = useState(new Date())
  const [selectedDateRange, setSelectedDateRange] = useState({ start: null, end: null })
  const [tempDateFilter, setTempDateFilter] = useState(null) // Track which preset is temporarily selected
  const [showRestaurantDropdown, setShowRestaurantDropdown] = useState(false)
  const { restaurants } = useRestaurants()
  const datePickerRef = useRef(null)
  const restaurantDropdownRef = useRef(null)

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Goedemorgen')
    else if (hour < 18) setGreeting('Goedemiddag')
    else setGreeting('Goedenavond')
    
    // Get user name from localStorage on client side
    if (typeof window !== 'undefined') {
      const storedUserName = localStorage.getItem('userName') || 'User'
      setUserName(storedUserName)
    }
  }, [])

  // Handle click outside to close date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false)
        setTempDateFilter(null)
      }
    }

    if (showDatePicker) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

  // Handle click outside to close restaurant dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (restaurantDropdownRef.current && !restaurantDropdownRef.current.contains(event.target)) {
        setShowRestaurantDropdown(false)
      }
    }

    if (showRestaurantDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showRestaurantDropdown])

  // Calculate real data from restaurants
  const activeRestaurants = restaurants?.filter(r => !r.deleted && r.status === 'active') || []
  
  // Filter restaurants based on selected store
  const filteredRestaurants = selectedStore === 'all' 
    ? activeRestaurants 
    : activeRestaurants.filter(r => r.id === selectedStore)
  
  // Generate data based on selected date range
  const generateDailyData = () => {
    const data = []
    const today = new Date()
    let days = 7
    let startDate = new Date(today)
    
    // Determine number of days based on date range
    switch(dateRange) {
      case 'today':
        days = 1
        break
      case 'yesterday':
        days = 1
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'last7days':
        days = 7
        startDate.setDate(startDate.getDate() - 6)
        break
      case 'last30days':
        days = 30
        startDate.setDate(startDate.getDate() - 29)
        break
      case 'last90days':
        days = 90
        startDate.setDate(startDate.getDate() - 89)
        break
      case 'last365days':
        days = 365
        startDate.setDate(startDate.getDate() - 364)
        break
      case 'lastWeek':
        startDate.setDate(startDate.getDate() - startDate.getDay() - 7)
        days = 7
        break
      case 'lastMonth':
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1)
        const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0)
        days = lastDayOfMonth.getDate()
        break
      case 'lastQuarter':
        const quarter = Math.floor(today.getMonth() / 3)
        startDate = new Date(today.getFullYear(), (quarter - 1) * 3, 1)
        const endQuarter = new Date(today.getFullYear(), quarter * 3, 0)
        days = Math.ceil((endQuarter - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'lastYear':
        startDate = new Date(today.getFullYear() - 1, 0, 1)
        days = 365
        break
      case 'weekToDate':
        startDate.setDate(startDate.getDate() - startDate.getDay())
        days = startDate.getDay() + 1
        break
      case 'monthToDate':
        startDate = new Date(today.getFullYear(), today.getMonth(), 1)
        days = today.getDate()
        break
      case 'quarterToDate':
        const currentQuarter = Math.floor(today.getMonth() / 3)
        startDate = new Date(today.getFullYear(), currentQuarter * 3, 1)
        days = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'yearToDate':
        startDate = new Date(today.getFullYear(), 0, 1)
        days = Math.ceil((today - startDate) / (1000 * 60 * 60 * 24)) + 1
        break
      case 'custom':
        if (customDateRange.start && customDateRange.end) {
          const start = new Date(customDateRange.start)
          const end = new Date(customDateRange.end)
          days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
          startDate = new Date(start)
        }
        break
    }
    
    // Generate data for the period
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      
      // Generate consistent data with some variation
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Adjust data based on whether viewing all restaurants or single restaurant
      const multiplier = selectedStore === 'all' ? filteredRestaurants.length : 1
      const baseOrders = isWeekend ? (200 + (i % 50)) / Math.max(1, activeRestaurants.length) * multiplier : (150 + (i % 70)) / Math.max(1, activeRestaurants.length) * multiplier
      const avgOrderValue = 42 + (i % 8)
      const dailyTurnover = baseOrders * avgOrderValue
      
      // Format date based on range
      let dateFormat = { month: 'short', day: 'numeric' }
      if (days > 30) {
        dateFormat = { month: 'short', day: 'numeric' }
      } else if (days > 90) {
        dateFormat = { month: 'short' }
      }
      
      data.push({
        date: date.toLocaleDateString('nl-NL', dateFormat),
        fullDate: date,
        orders: baseOrders,
        turnover: dailyTurnover,
      })
    }
    
    // Limit data points for better visualization
    if (days > 30) {
      // Group by week for monthly view
      const weeklyData = []
      for (let i = 0; i < data.length; i += 7) {
        const weekData = data.slice(i, i + 7)
        const weekOrders = weekData.reduce((sum, d) => sum + d.orders, 0)
        const weekTurnover = weekData.reduce((sum, d) => sum + d.turnover, 0)
        weeklyData.push({
          date: `Week ${Math.floor(i / 7) + 1}`,
          orders: Math.round(weekOrders / weekData.length),
          turnover: weekTurnover / weekData.length,
        })
      }
      return weeklyData.slice(0, 12) // Max 12 data points
    }
    
    return data.slice(-7) // Return last 7 days for daily view
  }

  const [dailyData, setDailyData] = useState([])
  
  // Initialize data on client side to avoid hydration issues
  useEffect(() => {
    setDailyData(generateDailyData())
  }, [dateRange, selectedStore, filteredRestaurants.length])
  
  // Calculate totals - Splitty payments processing
  const totalProcessedPayments = dailyData.reduce((sum, day) => sum + day.turnover, 0) // Total amount processed through Splitty
  const totalSplittyTransactions = dailyData.reduce((sum, day) => sum + day.orders, 0) // Number of Splitty payments
  const avgTransactionAmount = totalSplittyTransactions > 0 ? totalProcessedPayments / totalSplittyTransactions : 0 // Average payment amount
  const splittRevenue = totalSplittyTransactions * 0.70 // €0.70 per transaction
  const activeRestaurantsCount = selectedStore === 'all' ? activeRestaurants.length : 1
  
  // Calculate Stripe costs (1.4% + €0.25 per transaction for European cards)
  const stripePercentageFee = totalProcessedPayments * 0.014 // 1.4% of total volume
  const stripeFixedFee = totalSplittyTransactions * 0.25 // €0.25 per transaction
  const totalStripeCosts = stripePercentageFee + stripeFixedFee
  const netProfit = splittRevenue - totalStripeCosts // What's left after Stripe fees

  // Calculate additional metrics
  const totalUsers = 17 // Based on your example
  const currentUsers = 17 // All users active
  const avgTableSize = 4.2 // Average number of people per table (based on split payments)
  const totalTablesServed = Math.floor(totalSplittyTransactions / avgTableSize) // Estimate of tables served
  const serviceFees = splittRevenue // Revenue from €0.70 per transaction
  const totalRestaurantsTarget = 11 // Target restaurant count

  // Splitty admin panel styled cards - Organized by category
  const stats = [
    // PRIMARY METRICS - Most important
    {
      id: 'splitty-omzet',
      title: 'Splitty Omzet',
      value: formatCurrency(splittRevenue),
      change: '+15.3%',
      trend: 'up',
      icon: BanknotesIcon,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      changeColor: 'text-emerald-600',
      description: '€0,70 per transactie',
      priority: 'primary'
    },
    {
      id: 'verwerkte-betalingen',
      title: 'Verwerkte Betalingen',
      value: formatCurrency(totalProcessedPayments),
      change: '+12.5%',
      trend: 'up',
      icon: CreditCardIcon,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      changeColor: 'text-blue-600',
      description: 'Totaal transactievolume'
    },
    {
      id: 'aantal-transacties',
      title: 'Aantal Transacties',
      value: Math.round(totalSplittyTransactions).toString(),
      change: '+18.7%',
      trend: 'up',
      icon: ShoppingBagIcon,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      changeColor: 'text-purple-600',
      description: 'Via Splitty'
    },
    {
      id: 'gemiddeld-bedrag',
      title: 'Gemiddeld Bedrag',
      value: formatCurrency(avgTransactionAmount),
      change: '-2.1%',
      trend: 'down',
      icon: ChartBarIcon,
      bgColor: 'bg-gray-50',
      iconColor: 'text-gray-600',
      changeColor: 'text-red-600',
      description: 'Per betaling'
    },
    // SECONDARY METRICS
    {
      id: 'actieve-restaurants',
      title: 'Actieve Restaurants',
      value: activeRestaurantsCount,
      change: '+2',
      trend: 'up',
      icon: BuildingStorefrontIcon,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      changeColor: 'text-green-600',
      description: 'Live op Splitty'
    },
    {
      id: 'tafelgrootte',
      title: 'Tafelgrootte',
      value: avgTableSize.toFixed(1),
      subValue: 'personen',
      change: '+5.2%',
      trend: 'up',
      icon: UserGroupIcon,
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      changeColor: 'text-teal-600',
      description: 'Gemiddeld per tafel'
    },
  ]

  const openQuotations = [
    { id: 1, restaurant: 'The Golden Fork', amount: '€2,450', date: '2 uur geleden', status: 'urgent' },
    { id: 2, restaurant: 'Bella Vista', amount: '€1,890', date: '5 uur geleden', status: 'pending' },
    { id: 3, restaurant: 'Ocean Breeze', amount: '€3,200', date: '1 dag geleden', status: 'pending' },
  ]

  const bestPerformingRestaurants = filteredRestaurants.slice(0, 5).map((restaurant, index) => ({
    id: restaurant.id,
    name: restaurant.name,
    revenue: formatCurrency((index + 1) * 2450 + (index * 250)), // Fixed calculation instead of random
    transactions: 150 + (index * 20), // Fixed calculation instead of random
    rating: (4.5 + (index * 0.1)).toFixed(1) // Fixed calculation instead of random
  }))

  const partners = [
    { name: 'Stripe', type: 'Payment Provider', status: 'active', icon: '💳' },
    { name: 'Mollie', type: 'Payment Provider', status: 'active', icon: '💰' },
    { name: 'Lightspeed', type: 'POS Integration', status: 'active', icon: '🖥️' },
    { name: 'Square', type: 'POS Integration', status: 'pending', icon: '📱' },
  ]

  // Find max values for chart scaling
  const maxOrders = Math.max(...dailyData.map(d => d.orders))
  const maxTurnover = Math.max(...dailyData.map(d => d.turnover))

  // Generate analytics data based on selected metric and view
  const getAnalyticsData = () => {
    if (selectedMetric === 'splitty-omzet') {
      if (analyticsView === 'totaal') {
        return {
          title: 'Splitty Omzet',
          subtitle: 'Totale inkomsten',
          cards: [
            { 
              label: 'Stripe Kosten', 
              value: formatCurrency(totalStripeCosts), 
              change: totalStripeCosts > 0 ? `${((totalStripeCosts / splittRevenue) * 100).toFixed(1)}% van omzet` : '0%', 
              positive: false,
              isNegative: true  
            },
            {
              label: 'Netto Winst',
              value: formatCurrency(netProfit),
              change: netProfit > 0 ? `${((netProfit / splittRevenue) * 100).toFixed(1)}% marge` : '0%',
              positive: netProfit > 0,
              isProfit: true
            }
          ]
        }
      } else if (analyticsView === 'restaurant') {
        return {
          title: selectedStore === 'all' ? 'Splitty Omzet per Restaurant' : `Omzet ${activeRestaurants.find(r => r.id === selectedStore)?.name || ''}`,
          subtitle: selectedStore === 'all' ? 'Top presterende locaties' : 'Restaurant specifiek',
          cards: selectedStore === 'all' 
            ? filteredRestaurants.slice(0, 3).map((r, i) => ({
                label: r.name,
                value: formatCurrency((150 + i * 50) * 0.70),
                change: `+${10 + i * 2}%`,
                positive: true
              }))
            : [
                { 
                  label: 'Stripe Kosten', 
                  value: formatCurrency(totalStripeCosts), 
                  change: `${((totalStripeCosts / splittRevenue) * 100).toFixed(1)}% van omzet`, 
                  positive: false,
                  isNegative: true
                },
                {
                  label: 'Netto Winst',
                  value: formatCurrency(netProfit),
                  change: `€${(netProfit / Math.max(1, totalSplittyTransactions)).toFixed(2)} per transactie`,
                  positive: netProfit > 0,
                  isProfit: true
                }
              ]
        }
      } else if (analyticsView === 'regio') {
        return {
          title: 'Splitty Omzet per Regio',
          subtitle: 'Geografische verdeling',
          cards: [
            { label: 'Noord-Holland', value: formatCurrency(splittRevenue * 0.4), change: '+22%', positive: true },
            { label: 'Zuid-Holland', value: formatCurrency(splittRevenue * 0.3), change: '+15%', positive: true },
            { label: 'Utrecht', value: formatCurrency(splittRevenue * 0.2), change: '+8%', positive: true }
          ]
        }
      }
    } else if (selectedMetric === 'verwerkte-betalingen') {
      if (analyticsView === 'totaal') {
        return {
          title: 'Verwerkte Betalingen',
          subtitle: 'Totaal transactievolume',
          cards: [
            { 
              label: 'Stripe Kosten', 
              value: formatCurrency(totalStripeCosts), 
              change: totalStripeCosts > 0 ? `${((totalStripeCosts / totalProcessedPayments) * 100).toFixed(2)}% van volume` : '0%', 
              positive: false,
              isNegative: true 
            },
            {
              label: 'Netto Winst',
              value: formatCurrency(netProfit),
              change: netProfit > 0 ? `€${(netProfit / Math.max(1, totalSplittyTransactions)).toFixed(2)} per transactie` : '€0',
              positive: netProfit > 0,
              isProfit: true
            }
          ]
        }
      } else if (analyticsView === 'restaurant') {
        return {
          title: 'Betalingen per Restaurant',
          subtitle: 'Volume per locatie',
          cards: activeRestaurants.slice(0, 3).map((r, i) => ({
            label: r.name,
            value: formatCurrency((2000 + i * 500)),
            change: `+${8 + i * 3}%`,
            positive: true
          }))
        }
      } else if (analyticsView === 'regio') {
        return {
          title: 'Betalingen per Regio',
          subtitle: 'Regionale verdeling',
          cards: [
            { label: 'Noord-Holland', value: formatCurrency(totalProcessedPayments * 0.45), change: '+18%', positive: true },
            { label: 'Zuid-Holland', value: formatCurrency(totalProcessedPayments * 0.35), change: '+14%', positive: true },
            { label: 'Utrecht', value: formatCurrency(totalProcessedPayments * 0.2), change: '+10%', positive: true }
          ]
        }
      }
    }
    // Default fallback
    return {
      title: 'Analytics',
      subtitle: 'Selecteer een metric',
      cards: []
    }
  }

  const analyticsData = getAnalyticsData()

  // Calendar helper functions
  const generateCalendarDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    // Adjust to start on Monday (1) instead of Sunday (0)
    const dayOfWeek = firstDay.getDay()
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    startDate.setDate(startDate.getDate() - daysToSubtract)
    
    const days = []
    const current = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return days
  }

  const isInCurrentMonth = (date, monthDate) => {
    return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear()
  }

  const isToday = (date) => {
    const today = new Date()
    return date.getDate() === today.getDate() && 
           date.getMonth() === today.getMonth() && 
           date.getFullYear() === today.getFullYear()
  }

  const isSelected = (date) => {
    if (!selectedDateRange.start) return false
    
    // If only start date is selected
    if (!selectedDateRange.end) {
      return date.toDateString() === selectedDateRange.start.toDateString()
    }
    
    // If both dates are selected, check if date is in range
    return date >= selectedDateRange.start && date <= selectedDateRange.end
  }

  const formatDateForInput = (date) => {
    if (!date) return ''
    // Create a new date and adjust for timezone to avoid off-by-one errors
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const handleDateSelect = (date) => {
    if (!selectedDateRange.start || (selectedDateRange.start && selectedDateRange.end)) {
      // Start a new selection
      setSelectedDateRange({ start: date, end: null })
    } else {
      // Complete the selection
      if (date < selectedDateRange.start) {
        setSelectedDateRange({ start: date, end: selectedDateRange.start })
      } else {
        setSelectedDateRange({ start: selectedDateRange.start, end: date })
      }
      // Don't update customDateRange here - wait for Toepassen button
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-[#111827] mb-1">
              {greeting}, {userName}
            </h1>
            <p className="text-[#6B7280] mb-6">
              Hier zijn de inzichten van vandaag
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Professional Date Range Dropdown */}
              <div className="relative" ref={datePickerRef}>
                <button
                  onClick={() => {
                    if (!showDatePicker) {
                      // Set temp filter to current dateRange when opening
                      setTempDateFilter(dateRange);
                      
                      // Initialize selection based on current filter
                      if (dateRange === 'today') {
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start: today, end: today });
                      } else if (dateRange === 'yesterday') {
                        const yesterday = new Date();
                        yesterday.setDate(yesterday.getDate() - 1);
                        yesterday.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start: yesterday, end: yesterday });
                      } else if (dateRange === 'last7days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 6);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last30days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 29);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last90days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 89);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'last365days') {
                        const end = new Date();
                        const start = new Date();
                        start.setDate(start.getDate() - 364);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastWeek') {
                        const today = new Date();
                        const start = new Date();
                        start.setDate(today.getDate() - today.getDay() - 7);
                        const end = new Date(start);
                        end.setDate(end.getDate() + 6);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastMonth') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                        const end = new Date(today.getFullYear(), today.getMonth(), 0);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastQuarter') {
                        const today = new Date();
                        const quarter = Math.floor(today.getMonth() / 3);
                        const start = new Date(today.getFullYear(), (quarter - 1) * 3, 1);
                        const end = new Date(today.getFullYear(), quarter * 3, 0);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'lastYear') {
                        const today = new Date();
                        const start = new Date(today.getFullYear() - 1, 0, 1);
                        const end = new Date(today.getFullYear() - 1, 11, 31);
                        start.setHours(0, 0, 0, 0);
                        end.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end });
                      } else if (dateRange === 'weekToDate') {
                        const today = new Date();
                        const start = new Date();
                        // Start from Monday instead of Sunday
                        const dayOfWeek = today.getDay();
                        const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                        start.setDate(today.getDate() - daysToSubtract);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'monthToDate') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), today.getMonth(), 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'quarterToDate') {
                        const today = new Date();
                        const quarter = Math.floor(today.getMonth() / 3);
                        const start = new Date(today.getFullYear(), quarter * 3, 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'yearToDate') {
                        const today = new Date();
                        const start = new Date(today.getFullYear(), 0, 1);
                        start.setHours(0, 0, 0, 0);
                        today.setHours(0, 0, 0, 0);
                        setSelectedDateRange({ start, end: today });
                      } else if (dateRange === 'custom' && customDateRange.start) {
                        // For custom ranges, load from customDateRange
                        let startDate, endDate = null
                        
                        if (typeof customDateRange.start === 'string') {
                          const [year1, month1, day1] = customDateRange.start.split('-').map(Number)
                          startDate = new Date(year1, month1 - 1, day1)
                        } else {
                          startDate = new Date(customDateRange.start)
                        }
                        
                        if (customDateRange.end) {
                          if (typeof customDateRange.end === 'string') {
                            const [year2, month2, day2] = customDateRange.end.split('-').map(Number)
                            endDate = new Date(year2, month2 - 1, day2)
                          } else {
                            endDate = new Date(customDateRange.end)
                          }
                        }
                        
                        setSelectedDateRange({ start: startDate, end: endDate })
                      } else {
                        setSelectedDateRange({ start: null, end: null })
                      }
                    }
                    setShowDatePicker(!showDatePicker)
                  }}
                  className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-all flex items-center gap-2 text-sm"
                >
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-700 font-medium">
                    {dateRange === 'today' && 'Vandaag'}
                    {dateRange === 'yesterday' && 'Gisteren'}
                    {dateRange === 'last7days' && 'Afgelopen 7 dagen'}
                    {dateRange === 'last30days' && 'Afgelopen 30 dagen'}
                    {dateRange === 'last90days' && 'Afgelopen 90 dagen'}
                    {dateRange === 'last365days' && 'Afgelopen 365 dagen'}
                    {dateRange === 'lastWeek' && 'Afgelopen week'}
                    {dateRange === 'lastMonth' && 'Afgelopen maand'}
                    {dateRange === 'lastQuarter' && 'Afgelopen kwartaal'}
                    {dateRange === 'lastYear' && 'Afgelopen jaar'}
                    {dateRange === 'weekToDate' && 'Week tot nu'}
                    {dateRange === 'monthToDate' && 'Maand tot nu'}
                    {dateRange === 'quarterToDate' && 'Kwartaal tot nu'}
                    {dateRange === 'yearToDate' && 'Jaar tot nu'}
                    {dateRange === 'custom' && customDateRange.start && (() => {
                      // Parse dates properly to avoid timezone issues
                      let startDate, endDate = null
                      
                      // Check if customDateRange.start is a string or Date object
                      if (typeof customDateRange.start === 'string') {
                        const [year1, month1, day1] = customDateRange.start.split('-').map(Number)
                        startDate = new Date(year1, month1 - 1, day1)
                      } else {
                        startDate = new Date(customDateRange.start)
                      }
                      
                      if (customDateRange.end) {
                        if (typeof customDateRange.end === 'string') {
                          const [year2, month2, day2] = customDateRange.end.split('-').map(Number)
                          endDate = new Date(year2, month2 - 1, day2)
                        } else {
                          endDate = new Date(customDateRange.end)
                        }
                      }
                      
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      startDate.setHours(0, 0, 0, 0)
                      
                      if (!endDate || customDateRange.start === customDateRange.end) {
                        // Single date
                        return startDate.getTime() === today.getTime() ? 'Vandaag' : startDate.toLocaleDateString('nl-NL')
                      } else {
                        // Date range
                        return `${startDate.toLocaleDateString('nl-NL')} - ${endDate.toLocaleDateString('nl-NL')}`
                      }
                    })()}
                  </span>
                </button>
                
                {/* Professional Dropdown Menu */}
                {showDatePicker && (
                  <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50" style={{width: '600px', maxHeight: '400px'}}>
                    <div className="flex h-full" style={{maxHeight: '400px'}}>
                      {/* Left Sidebar with Options */}
                      <div className="w-40 border-r border-gray-200 bg-gray-50 flex flex-col" style={{maxHeight: '400px'}}>
                        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                          {/* Quick Picks */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start: today, end: today });
                                setTempDateFilter('today');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                                (tempDateFilter ? tempDateFilter === 'today' : dateRange === 'today') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Vandaag
                              {dateRange === 'today' && (
                                <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button
                              onClick={() => { 
                                const yesterday = new Date();
                                yesterday.setDate(yesterday.getDate() - 1);
                                yesterday.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start: yesterday, end: yesterday });
                                setTempDateFilter('yesterday');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'yesterday' : dateRange === 'yesterday') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Gisteren
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* Relative Periods */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 6);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last7days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last7days' : dateRange === 'last7days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen 7 dagen
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 29);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last30days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last30days' : dateRange === 'last30days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen 30 dagen
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 89);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last90days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last90days' : dateRange === 'last90days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen 90 dagen
                            </button>
                            <button
                              onClick={() => { 
                                const end = new Date();
                                const start = new Date();
                                start.setDate(start.getDate() - 364);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('last365days');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'last365days' : dateRange === 'last365days') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen 365 dagen
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* Calendar Periods */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date();
                                start.setDate(today.getDate() - today.getDay() - 7);
                                const end = new Date(start);
                                end.setDate(end.getDate() + 6);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastWeek');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastWeek' : dateRange === 'lastWeek') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen week
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                                const end = new Date(today.getFullYear(), today.getMonth(), 0);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastMonth');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastMonth' : dateRange === 'lastMonth') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen maand
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const quarter = Math.floor(today.getMonth() / 3);
                                const start = new Date(today.getFullYear(), (quarter - 1) * 3, 1);
                                const end = new Date(today.getFullYear(), quarter * 3, 0);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastQuarter');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastQuarter' : dateRange === 'lastQuarter') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen kwartaal
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear() - 1, 0, 1);
                                const end = new Date(today.getFullYear() - 1, 11, 31);
                                start.setHours(0, 0, 0, 0);
                                end.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end });
                                setTempDateFilter('lastYear');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'lastYear' : dateRange === 'lastYear') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Afgelopen jaar
                            </button>
                          </div>
                          
                          <div className="border-t border-gray-200 mx-2"></div>
                          
                          {/* To Date Options */}
                          <div className="p-2">
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date();
                                // Start from Monday instead of Sunday
                                const dayOfWeek = today.getDay();
                                const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                                start.setDate(today.getDate() - daysToSubtract);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('weekToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'weekToDate' : dateRange === 'weekToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Week tot nu
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), today.getMonth(), 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('monthToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'monthToDate' : dateRange === 'monthToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Maand tot nu
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const quarter = Math.floor(today.getMonth() / 3);
                                const start = new Date(today.getFullYear(), quarter * 3, 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('quarterToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'quarterToDate' : dateRange === 'quarterToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Kwartaal tot nu
                            </button>
                            <button
                              onClick={() => { 
                                const today = new Date();
                                const start = new Date(today.getFullYear(), 0, 1);
                                start.setHours(0, 0, 0, 0);
                                today.setHours(0, 0, 0, 0);
                                setSelectedDateRange({ start, end: today });
                                setTempDateFilter('yearToDate');
                                // Don't close picker - wait for Toepassen
                              }}
                              className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs transition-colors ${
                                (tempDateFilter ? tempDateFilter === 'yearToDate' : dateRange === 'yearToDate') ? 'bg-white text-emerald-700 font-medium shadow-sm' : 'text-gray-700 hover:bg-white hover:shadow-sm'
                              }`}
                            >
                              Jaar tot nu
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right Side - Calendar and Date Inputs */}
                      <div className="flex-1 overflow-y-auto" style={{maxHeight: '400px'}}>
                        <div className="p-4 space-y-4">
                          {/* Date Range Inputs */}
                          <div className="grid grid-cols-5 gap-2 items-end">
                            <div className="col-span-2">
                              <label className="block text-[10px] font-medium text-gray-600 mb-1">Van</label>
                              <input
                                type="text"
                                placeholder="DD-MM-JJJJ"
                                value={selectedDateRange.start ? selectedDateRange.start.toLocaleDateString('nl-NL') : ''}
                                onChange={(e) => {
                                  // Parse Dutch date format
                                  const parts = e.target.value.split('-')
                                  if (parts.length === 3) {
                                    const date = new Date(parts[2], parts[1] - 1, parts[0])
                                    if (!isNaN(date)) {
                                      setCustomDateRange({...customDateRange, start: formatDateForInput(date)})
                                      setDateRange('custom')
                                    }
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                            <div className="flex justify-center pb-1.5">
                              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                              </svg>
                            </div>
                            <div className="col-span-2">
                              <label className="block text-[10px] font-medium text-gray-600 mb-1">Tot</label>
                              <input
                                type="text"
                                placeholder="DD-MM-JJJJ"
                                value={selectedDateRange.end ? selectedDateRange.end.toLocaleDateString('nl-NL') : (selectedDateRange.start && !selectedDateRange.end ? selectedDateRange.start.toLocaleDateString('nl-NL') : '')}
                                onChange={(e) => {
                                  // Parse Dutch date format
                                  const parts = e.target.value.split('-')
                                  if (parts.length === 3) {
                                    const date = new Date(parts[2], parts[1] - 1, parts[0])
                                    if (!isNaN(date)) {
                                      setCustomDateRange({...customDateRange, end: formatDateForInput(date)})
                                      setDateRange('custom')
                                    }
                                  }
                                }}
                                className="w-full px-2 py-1.5 border border-gray-300 rounded text-xs focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                              />
                            </div>
                          </div>
                          
                          {/* Full Calendar */}
                          <div>
                            {/* Calendar Header with Navigation */}
                            <div className="flex items-center justify-between mb-3">
                              <button
                                onClick={() => {
                                  const newDate = new Date(calendarView)
                                  newDate.setMonth(newDate.getMonth() - 1)
                                  setCalendarView(newDate)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                              </button>
                              
                              <div className="flex-1 flex justify-between px-8">
                                <div className="text-left">
                                  <h3 className="text-xs font-semibold text-gray-700 capitalize">
                                    {new Date(calendarView.getFullYear(), calendarView.getMonth() - 1, 1).toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                                  </h3>
                                </div>
                                <div className="text-right">
                                  <h3 className="text-xs font-bold text-gray-900 capitalize">
                                    {calendarView.toLocaleDateString('nl-NL', { month: 'long', year: 'numeric' })}
                                  </h3>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => {
                                  const newDate = new Date(calendarView)
                                  newDate.setMonth(newDate.getMonth() + 1)
                                  setCalendarView(newDate)
                                }}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                              >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                            
                            {/* Two Month Calendar Grid */}
                            <div className="flex gap-3">
                              {/* Previous Month */}
                              <div className="flex-1">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-[10px] text-gray-500">
                                      <th className="pb-1 font-normal">ma</th>
                                      <th className="pb-1 font-normal">di</th>
                                      <th className="pb-1 font-normal">wo</th>
                                      <th className="pb-1 font-normal">do</th>
                                      <th className="pb-1 font-normal">vr</th>
                                      <th className="pb-1 font-normal">za</th>
                                      <th className="pb-1 font-normal">zo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[0, 1, 2, 3, 4, 5].map((weekIndex) => {
                                      const prevMonth = new Date(calendarView.getFullYear(), calendarView.getMonth() - 1, 1)
                                      const days = generateCalendarDays(prevMonth)
                                      const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7)
                                      
                                      return (
                                        <tr key={weekIndex}>
                                          {weekDays.map((day, dayIndex) => {
                                            const inMonth = isInCurrentMonth(day, prevMonth)
                                            const today = isToday(day)
                                            const selected = isSelected(day)
                                            
                                            return (
                                              <td key={dayIndex} className="p-0.5">
                                                {inMonth ? (
                                                  <button
                                                    onClick={() => handleDateSelect(day)}
                                                    className={`w-6 h-6 text-[10px] rounded transition-all ${
                                                      selected ? 'bg-emerald-100 text-emerald-700 font-medium' :
                                                      'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                  >
                                                    {day.getDate()}
                                                  </button>
                                                ) : (
                                                  <div className="w-6 h-6"></div>
                                                )}
                                              </td>
                                            )
                                          })}
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                              
                              {/* Current Month */}
                              <div className="flex-1">
                                <table className="w-full">
                                  <thead>
                                    <tr className="text-[10px] text-gray-500">
                                      <th className="pb-1 font-normal">ma</th>
                                      <th className="pb-1 font-normal">di</th>
                                      <th className="pb-1 font-normal">wo</th>
                                      <th className="pb-1 font-normal">do</th>
                                      <th className="pb-1 font-normal">vr</th>
                                      <th className="pb-1 font-bold text-gray-700">za</th>
                                      <th className="pb-1 font-bold text-gray-700">zo</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {[0, 1, 2, 3, 4, 5].map((weekIndex) => {
                                      const days = generateCalendarDays(calendarView)
                                      const weekDays = days.slice(weekIndex * 7, (weekIndex + 1) * 7)
                                      
                                      return (
                                        <tr key={weekIndex}>
                                          {weekDays.map((day, dayIndex) => {
                                            const inMonth = isInCurrentMonth(day, calendarView)
                                            const today = isToday(day)
                                            const selected = isSelected(day)
                                            const futureDate = day > new Date()
                                            
                                            return (
                                              <td key={dayIndex} className="p-0.5">
                                                {inMonth ? (
                                                  <button
                                                    onClick={() => handleDateSelect(day)}
                                                    className={`w-6 h-6 text-[10px] rounded transition-all ${
                                                      futureDate ? 'text-gray-300 cursor-not-allowed' :
                                                      selected ? 'bg-emerald-100 text-emerald-700 font-medium' :
                                                      'text-gray-700 hover:bg-gray-100'
                                                    }`}
                                                    disabled={futureDate}
                                                  >
                                                    {day.getDate()}
                                                  </button>
                                                ) : (
                                                  <div className="w-6 h-6"></div>
                                                )}
                                              </td>
                                            )
                                          })}
                                        </tr>
                                      )
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Apply/Cancel Buttons - Fixed at bottom */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedDateRange({ start: null, end: null })
                                setShowDatePicker(false)
                                setTempDateFilter(null)
                              }}
                              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-50 rounded transition-colors"
                            >
                              Annuleren
                            </button>
                            <button
                              onClick={() => {
                                if (selectedDateRange.start) {
                                  const today = new Date()
                                  today.setHours(0, 0, 0, 0)
                                  const startDate = new Date(selectedDateRange.start)
                                  startDate.setHours(0, 0, 0, 0)
                                  
                                  // Check for specific preset ranges
                                  if (!selectedDateRange.end || selectedDateRange.start.getTime() === selectedDateRange.end.getTime()) {
                                    // Single date selected
                                    if (startDate.getTime() === today.getTime()) {
                                      setDateRange('today')
                                      setCustomDateRange({ start: null, end: null })
                                    } else {
                                      // Check if it's yesterday
                                      const yesterday = new Date()
                                      yesterday.setDate(yesterday.getDate() - 1)
                                      yesterday.setHours(0, 0, 0, 0)
                                      
                                      if (startDate.getTime() === yesterday.getTime()) {
                                        setDateRange('yesterday')
                                        setCustomDateRange({ start: null, end: null })
                                      } else {
                                        // Custom single date
                                        setCustomDateRange({ 
                                          start: formatDateForInput(selectedDateRange.start), 
                                          end: formatDateForInput(selectedDateRange.start)
                                        })
                                        setDateRange('custom')
                                      }
                                    }
                                  } else {
                                    // Date range selected - check for preset ranges
                                    const endDate = new Date(selectedDateRange.end)
                                    endDate.setHours(0, 0, 0, 0)
                                    
                                    // Calculate days difference
                                    const daysDiff = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24))
                                    
                                    // Check for common ranges
                                    if (endDate.getTime() === today.getTime()) {
                                      // First check if a specific filter was selected
                                      if (tempDateFilter && ['lastWeek', 'lastMonth', 'lastQuarter', 'lastYear', 
                                                             'weekToDate', 'monthToDate', 'quarterToDate', 'yearToDate'].includes(tempDateFilter)) {
                                        // If a specific filter was selected, use it
                                        setDateRange(tempDateFilter)
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 6) {
                                        setDateRange('last7days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 29) {
                                        setDateRange('last30days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 89) {
                                        setDateRange('last90days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else if (daysDiff === 364) {
                                        setDateRange('last365days')
                                        setCustomDateRange({ start: null, end: null })
                                      } else {
                                        // Custom range
                                        setCustomDateRange({ 
                                          start: formatDateForInput(selectedDateRange.start), 
                                          end: formatDateForInput(selectedDateRange.end)
                                        })
                                        setDateRange('custom')
                                      }
                                    } else {
                                      // Custom range
                                      setCustomDateRange({ 
                                        start: formatDateForInput(selectedDateRange.start), 
                                        end: formatDateForInput(selectedDateRange.end)
                                      })
                                      setDateRange('custom')
                                    }
                                  }
                                  setShowDatePicker(false)
                                  setTempDateFilter(null)
                                }
                              }}
                              className="px-3 py-1.5 text-xs bg-emerald-500 text-white rounded hover:bg-emerald-600 transition-colors"
                            >
                              Toepassen
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Restaurant Filter Dropdown */}
              <div className="relative" ref={restaurantDropdownRef}>
                <button
                  onClick={() => setShowRestaurantDropdown(!showRestaurantDropdown)}
                  className="px-3 py-2 text-sm rounded-lg bg-white border border-gray-200 text-gray-600 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all cursor-pointer min-w-[150px] max-w-[200px] flex items-center justify-between"
                >
                  <span className="truncate">
                    {selectedStore === 'all' 
                      ? 'Alle Restaurants' 
                      : activeRestaurants.find(r => r.id === selectedStore)?.name || 'Selecteer'}
                  </span>
                  <svg className={`ml-2 h-4 w-4 transition-transform ${showRestaurantDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {showRestaurantDropdown && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 max-h-60 overflow-y-auto">
                    <button
                      onClick={() => {
                        setSelectedStore('all')
                        setShowRestaurantDropdown(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                        selectedStore === 'all' ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                      }`}
                    >
                      Alle Restaurants
                    </button>
                    {activeRestaurants.map(restaurant => (
                      <button
                        key={restaurant.id}
                        onClick={() => {
                          setSelectedStore(restaurant.id)
                          setShowRestaurantDropdown(false)
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                          selectedStore === restaurant.id ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'
                        }`}
                      >
                        {restaurant.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Compare Toggle - Disabled */}
              <button
                disabled
                className="px-3 py-2 text-sm rounded-lg border transition-all flex items-center gap-2 bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed opacity-60"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Vergelijk
              </button>
            </div>
            
          </div>

          {/* Splitty Admin Stats Cards - Clean Design */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            {stats.map((stat) => (
              <div 
                key={stat.id} 
                onClick={() => setSelectedMetric(stat.id)}
                className={`rounded-xl p-5 transition-all duration-200 hover:shadow-lg bg-white border cursor-pointer ${
                  selectedMetric === stat.id
                    ? 'border-emerald-400 shadow-lg ring-2 ring-emerald-200'
                    : stat.priority === 'primary' 
                      ? 'border-emerald-200 shadow-md' 
                      : 'border-gray-100 shadow-sm'
                }`}
              >
                {/* Simplified Card Content */}
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 ${stat.iconColor}`} />
                  </div>
                  {stat.trend !== 'neutral' && (
                    <span className={`text-xs font-semibold ${stat.changeColor}`}>
                      {stat.change}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {stat.title}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <p className={`font-bold text-gray-900 ${
                      stat.priority === 'primary' ? 'text-2xl' : 'text-xl'
                    }`}>
                      {stat.value}
                    </p>
                    {stat.subValue && (
                      <span className="text-xs text-gray-500">
                        {stat.subValue}
                      </span>
                    )}
                  </div>
                  {stat.description && (
                    <p className="text-xs text-gray-400 mt-1">
                      {stat.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Analytics Dashboard */}
          <div className="mb-8">
            <div className="flex items-center justify-end mb-6">
              <div className="flex items-center gap-2">
                {/* View Toggle Buttons */}
                {/* Filter Status Display */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Filters:</span>
                  <div className="flex gap-2">
                    <span className="text-sm text-gray-700 bg-white border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {selectedStore === 'all' 
                        ? 'Alle Restaurants' 
                        : activeRestaurants.find(r => r.id === selectedStore)?.name || 'Selecteer'}
                    </span>
                  </div>
                </div>
                <span className="text-sm text-[#6B7280] bg-gray-50 px-3 py-1 rounded-full">
                  {dateRange === 'today' && 'Vandaag'}
                  {dateRange === 'yesterday' && 'Gisteren'}
                  {dateRange === 'last7days' && 'Afgelopen 7 dagen'}
                  {dateRange === 'last30days' && 'Afgelopen 30 dagen'}
                  {dateRange === 'last90days' && 'Afgelopen 90 dagen'}
                  {dateRange === 'last365days' && 'Afgelopen 365 dagen'}
                  {dateRange === 'lastWeek' && 'Afgelopen week'}
                  {dateRange === 'lastMonth' && 'Afgelopen maand'}
                  {dateRange === 'lastQuarter' && 'Afgelopen kwartaal'}
                  {dateRange === 'lastYear' && 'Afgelopen jaar'}
                  {dateRange === 'weekToDate' && 'Week tot nu'}
                  {dateRange === 'monthToDate' && 'Maand tot nu'}
                  {dateRange === 'quarterToDate' && 'Kwartaal tot nu'}
                  {dateRange === 'yearToDate' && 'Jaar tot nu'}
                  {dateRange === 'custom' && customDateRange.start && (() => {
                    // Parse dates properly to avoid timezone issues
                    let startDate, endDate = null
                    
                    // Check if customDateRange.start is a string or Date object
                    if (typeof customDateRange.start === 'string') {
                      const [year1, month1, day1] = customDateRange.start.split('-').map(Number)
                      startDate = new Date(year1, month1 - 1, day1)
                    } else {
                      startDate = new Date(customDateRange.start)
                    }
                    
                    const today = new Date()
                    const isToday = startDate.toDateString() === today.toDateString()
                    
                    if (!customDateRange.end || customDateRange.start === customDateRange.end) {
                      // Single date selected
                      return isToday ? 'Vandaag' : startDate.toLocaleDateString('nl-NL')
                    } else {
                      // Date range selected
                      if (typeof customDateRange.end === 'string') {
                        const [year2, month2, day2] = customDateRange.end.split('-').map(Number)
                        endDate = new Date(year2, month2 - 1, day2)
                      } else {
                        endDate = new Date(customDateRange.end)
                      }
                      return `${startDate.toLocaleDateString('nl-NL')} - ${endDate.toLocaleDateString('nl-NL')}`
                    }
                  })()}
                </span>
              </div>
            </div>
            
            {/* Analytics Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Analytics KPI Cards - Always show Stripe Costs and Net Profit */}
              <div className="lg:col-span-1 space-y-4">
                {/* Title for financial cards */}
                <div>
                  <h2 className="text-xl font-semibold text-[#111827]">Financieel Overzicht</h2>
                  <p className="text-sm text-[#6B7280] mt-1">Kosten en winstgevendheid</p>
                </div>
                
                {/* Stripe Costs Card - Always visible */}
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 rounded-lg bg-orange-50">
                      <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium bg-orange-50 text-orange-700`}>
                      {totalStripeCosts > 0 ? `${((totalStripeCosts / splittRevenue) * 100).toFixed(1)}% van omzet` : '0%'}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-2 text-orange-600`}>
                    -{formatCurrency(totalStripeCosts)}
                  </div>
                  <div className="text-sm text-[#6B7280] mb-2">
                    Stripe Kosten
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-3 pt-3 border-t border-gray-100">
                    Transactiekosten alle betaalmethoden
                  </div>
                </div>

                {/* Net Profit Card - Always visible */}
                <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${netProfit > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
                      {netProfit > 0 ? (
                        <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      )}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                      netProfit > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {netProfit > 0 ? 'Winst' : 'Verlies'}
                    </div>
                  </div>
                  <div className={`text-2xl font-bold mb-2 ${
                    netProfit > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {netProfit > 0 ? '' : '-'}{formatCurrency(Math.abs(netProfit))}
                  </div>
                  <div className="text-sm text-[#6B7280] mb-2">
                    Netto Winst
                  </div>
                  <div className="text-xs text-[#9CA3AF] mt-3 pt-3 border-t border-gray-100">
                    {netProfit > 0 
                      ? `${((netProfit / splittRevenue) * 100).toFixed(1)}% winstmarge`
                      : `€${Math.abs(netProfit / Math.max(1, totalSplittyTransactions)).toFixed(2)} verlies per transactie`
                    }
                  </div>
                </div>

                {/* Additional dynamic cards if needed for specific metrics */}
                {analyticsData.cards.filter(card => !card.isProfit && !card.isNegative).map((card, index) => (
                  <div key={index} className={`bg-white p-5 rounded-xl shadow-sm border hover:shadow-md transition-all duration-200 ${
                    card.isProfit 
                      ? netProfit > 0 
                        ? 'border-gray-100' 
                        : 'border-gray-100'
                      : card.isNegative 
                        ? 'border-gray-100' 
                        : 'border-gray-100'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className={`p-2 rounded-lg ${
                        card.isProfit 
                          ? netProfit > 0 
                            ? 'bg-green-50' 
                            : 'bg-red-50'
                          : card.isNegative 
                            ? 'bg-orange-50' 
                            : 'bg-emerald-50'
                      }`}>
                        {card.isProfit ? (
                          netProfit > 0 ? (
                            <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                          ) : (
                            <svg className="h-4 w-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                          )
                        ) : card.isNegative ? (
                          <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <ChartBarIcon className="h-4 w-4 text-emerald-600" />
                        )}
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                        card.isProfit
                          ? netProfit > 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                          : card.positive 
                            ? 'bg-green-50 text-green-700' 
                            : card.isNegative 
                              ? 'bg-orange-50 text-orange-700'
                              : 'bg-red-50 text-red-700'
                      }`}>
                        {card.isProfit && netProfit <= 0 ? 'Verlies' : card.change}
                      </div>
                    </div>
                    <div className={`text-2xl font-bold mb-1 ${
                      card.isProfit 
                        ? netProfit > 0 
                          ? 'text-[#111827]' 
                          : 'text-red-600'
                        : card.isNegative 
                          ? 'text-orange-600' 
                          : 'text-[#111827]'
                    }`}>
                      {card.isNegative ? '-' : card.isProfit && netProfit < 0 ? '-' : ''}{card.value}
                    </div>
                    <div className="text-sm text-[#6B7280]">
                      {card.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section - Modern Line Chart */}
              <div className="lg:col-span-3">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  {/* Chart Header */}
                  <div className="p-6 pb-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {selectedMetric === 'splitty-omzet' && 'Splitty Omzet overzicht'}
                          {selectedMetric === 'verwerkte-betalingen' && 'Verwerkte Betalingen overzicht'}
                          {selectedMetric === 'aantal-transacties' && 'Transacties overzicht'}
                          {selectedMetric === 'actieve-restaurants' && 'Restaurant Activiteit'}
                          {selectedMetric === 'tafelgrootte' && 'Tafelgrootte Trend'}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="text-2xl font-bold text-gray-900">
                            {selectedMetric === 'splitty-omzet' && formatCurrency(splittRevenue)}
                            {selectedMetric === 'verwerkte-betalingen' && formatCurrency(totalProcessedPayments)}
                            {selectedMetric === 'aantal-transacties' && Math.round(totalSplittyTransactions)}
                            {selectedMetric === 'actieve-restaurants' && activeRestaurantsCount}
                            {selectedMetric === 'tafelgrootte' && avgTableSize.toFixed(1)}
                          </div>
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            stats.find(s => s.id === selectedMetric)?.trend === 'up' 
                              ? 'bg-green-50 text-green-700' 
                              : 'bg-red-50 text-red-700'
                          }`}>
                            {stats.find(s => s.id === selectedMetric)?.trend === 'up' ? (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                              </svg>
                            )}
                            <span>{stats.find(s => s.id === selectedMetric)?.change || '0%'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-0.5 bg-emerald-500 rounded"></div>
                          <span className="text-xs text-gray-600">
                            {selectedMetric === 'splitty-omzet' && 'Omzet (€0.70 per transactie)'}
                            {selectedMetric === 'verwerkte-betalingen' && 'Totaal Volume'}
                            {selectedMetric === 'aantal-transacties' && 'Aantal Transacties'}
                            {selectedMetric === 'actieve-restaurants' && 'Actieve Restaurants'}
                            {selectedMetric === 'tafelgrootte' && 'Gem. Personen'}
                          </span>
                        </div>
                        {selectedMetric !== 'actieve-restaurants' && selectedMetric !== 'tafelgrootte' && (
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-0.5 bg-emerald-500/40 rounded"></div>
                            <span className="text-xs text-gray-600">Trend</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Chart Content */}
                  <div className="p-6">
                    <div className="relative" style={{ height: '280px' }}>
                      {/* Calculate chart values based on selected metric */}
                      {(() => {
                        let primaryData, secondaryData, maxPrimary, maxSecondary
                        
                        switch(selectedMetric) {
                          case 'splitty-omzet':
                            primaryData = dailyData.map(d => d.orders * 0.70) // €0.70 per transaction
                            secondaryData = dailyData.map(d => d.orders)
                            maxPrimary = Math.max(...primaryData) || 100
                            maxSecondary = maxOrders
                            break
                          case 'verwerkte-betalingen':
                            primaryData = dailyData.map(d => d.turnover)
                            secondaryData = dailyData.map(d => d.orders)
                            maxPrimary = maxTurnover
                            maxSecondary = maxOrders
                            break
                          case 'aantal-transacties':
                            primaryData = dailyData.map(d => d.orders)
                            secondaryData = dailyData.map(d => d.turnover)
                            maxPrimary = maxOrders
                            maxSecondary = maxTurnover
                            break
                          default:
                            primaryData = dailyData.map(d => d.turnover)
                            secondaryData = dailyData.map(d => d.orders)
                            maxPrimary = maxTurnover
                            maxSecondary = maxOrders
                        }
                        
                        // Calculate nice round numbers for Y-axis
                        const calculateNiceScale = (maxValue) => {
                          if (!maxValue || maxValue <= 0) return { max: 100, step: 25 }
                          
                          // Find a nice round number above the max
                          const magnitude = Math.pow(10, Math.floor(Math.log10(maxValue)))
                          const normalized = maxValue / magnitude
                          
                          let niceMax
                          if (normalized <= 1) niceMax = magnitude
                          else if (normalized <= 2) niceMax = 2 * magnitude
                          else if (normalized <= 2.5) niceMax = 2.5 * magnitude
                          else if (normalized <= 5) niceMax = 5 * magnitude
                          else niceMax = 10 * magnitude
                          
                          return {
                            max: niceMax,
                            step: niceMax / 4
                          }
                        }
                        
                        const scale = calculateNiceScale(maxPrimary)
                        const chartMaxValue = scale.max
                        
                        const getYAxisLabels = () => {
                          const labels = []
                          for (let i = 4; i >= 0; i--) {
                            const value = (scale.step * i)
                            if (selectedMetric === 'aantal-transacties') {
                              labels.push(Math.round(value))
                            } else if (selectedMetric === 'actieve-restaurants') {
                              labels.push(Math.round(value))
                            } else if (selectedMetric === 'tafelgrootte') {
                              labels.push(value.toFixed(1))
                            } else {
                              labels.push(formatCurrency(value))
                            }
                          }
                          return labels
                        }
                        
                        const yAxisLabels = getYAxisLabels()
                        
                        return (
                          <>
                            {/* Y-axis labels */}
                            <div className="absolute left-0 top-0 bottom-0 w-12 flex flex-col justify-between text-xs text-gray-600">
                              {yAxisLabels.map((label, i) => (
                                <span key={i} className="text-right pr-2">{label}</span>
                              ))}
                            </div>

                            {/* Chart Area */}
                            <div className="ml-14 h-full relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="border-b border-gray-100" />
                          ))}
                        </div>

                              {/* Line Chart SVG */}
                              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <defs>
                                  <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgb(16, 185, 129)" stopOpacity="0.15" />
                                    <stop offset="100%" stopColor="rgb(16, 185, 129)" stopOpacity="0" />
                                  </linearGradient>
                                </defs>

                                {/* Build chart paths */}
                                {primaryData && primaryData.length > 0 && chartMaxValue > 0 && (
                                  <>
                                    {/* Area fill */}
                                    <path
                                      d={`M 0,${100 - (primaryData[0] / chartMaxValue) * 100}% ${
                                        primaryData.map((value, i) => {
                                          const x = (i / Math.max(1, primaryData.length - 1)) * 100
                                          const y = 100 - (value / chartMaxValue) * 100
                                          return `L ${x}%,${y}%`
                                        }).join(' ')
                                      } L 100%,100% L 0%,100% Z`}
                                      fill="url(#gradient1)"
                                    />
                                    
                                    {/* Line */}
                                    <path
                                      d={`M 0,${100 - (primaryData[0] / chartMaxValue) * 100}% ${
                                        primaryData.map((value, i) => {
                                          const x = (i / Math.max(1, primaryData.length - 1)) * 100
                                          const y = 100 - (value / chartMaxValue) * 100
                                          return `L ${x}%,${y}%`
                                        }).join(' ')
                                      }`}
                                      fill="none"
                                      stroke="rgb(16, 185, 129)"
                                      strokeWidth="2"
                                    />

                                    {/* Data points */}
                                    {primaryData.map((value, i) => {
                                      const x = (i / Math.max(1, primaryData.length - 1)) * 100
                                      const y = 100 - (value / chartMaxValue) * 100
                                      return (
                                        <circle
                                          key={i}
                                          cx={`${x}%`}
                                          cy={`${y}%`}
                                          r="3"
                                          fill="white"
                                          stroke="rgb(16, 185, 129)"
                                          strokeWidth="2"
                                        />
                                      )
                                    })}
                                  </>
                                )}
                        </svg>

                        {/* Hover tooltips */}
                        <div className="absolute inset-0 flex">
                          {dailyData.map((day, i) => (
                            <div
                              key={i}
                              className="flex-1 group relative"
                            >
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                                <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg mb-2">
                                  <div className="font-semibold">{day.date}</div>
                                  <div className="mt-1">
                                    {selectedMetric === 'splitty-omzet' && `Omzet: ${formatCurrency(day.orders * 0.70)}`}
                                    {selectedMetric === 'verwerkte-betalingen' && `Volume: ${formatCurrency(day.turnover)}`}
                                    {selectedMetric === 'aantal-transacties' && `Transacties: ${Math.round(day.orders)}`}
                                    {selectedMetric === 'actieve-restaurants' && `Restaurants: ${activeRestaurantsCount}`}
                                    {selectedMetric === 'tafelgrootte' && `Gem. tafel: ${avgTableSize.toFixed(1)}`}
                                  </div>
                                  {selectedMetric !== 'actieve-restaurants' && selectedMetric !== 'tafelgrootte' && (
                                    <div>
                                      {selectedMetric === 'splitty-omzet' && `Transacties: ${Math.round(day.orders)}`}
                                      {selectedMetric === 'verwerkte-betalingen' && `Transacties: ${Math.round(day.orders)}`}
                                      {selectedMetric === 'aantal-transacties' && `Omzet: ${formatCurrency(day.turnover)}`}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                            
                            {/* X-axis labels */}
                            <div className="ml-14 mt-2 flex justify-between text-xs text-gray-600">
                              {dailyData && dailyData.length > 0 && (() => {
                                const labels = []
                                const step = Math.ceil(dailyData.length / 5)
                                for (let i = 0; i < dailyData.length; i += step) {
                                  if (i < dailyData.length) {
                                    labels.push(dailyData[i].date)
                                  }
                                }
                                // Always include the last date
                                if (labels[labels.length - 1] !== dailyData[dailyData.length - 1].date) {
                                  labels[labels.length - 1] = dailyData[dailyData.length - 1].date
                                }
                                return labels.map((label, i) => (
                                  <span key={i}>{label}</span>
                                ))
                              })()}
                            </div>
                      </>
                    )
                  })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Open Quotations - Clean White Card */}
            <div className="rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Open Aanvragen
                </h2>
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                {openQuotations.map((quote) => (
                  <div 
                    key={quote.id} 
                    className="rounded-lg p-4 transition-all bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-[#111827]">
                        {quote.restaurant}
                      </h3>
                      {quote.status === 'urgent' && (
                        <span className="px-2 py-0.5 text-xs bg-red-50 text-red-600 rounded-full font-medium">
                          Urgent
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-emerald-600">
                        {quote.amount}
                      </span>
                      <span className="flex items-center text-gray-500">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {quote.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2.5 font-medium rounded-lg transition-all bg-emerald-600 text-white hover:bg-emerald-700">
                Bekijk Alle Aanvragen
              </button>
            </div>

            {/* Best Performing Restaurants - Clean White Card */}
            <div className="lg:col-span-2 rounded-xl p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-[#111827]">
                  Best Presterende Restaurants
                </h2>
                <StarIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-[#6B7280]">
                      <th className="pb-3 font-medium">Restaurant</th>
                      <th className="pb-3 font-medium">Omzet</th>
                      <th className="pb-3 font-medium">Transacties</th>
                      <th className="pb-3 font-medium">Rating</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#111827]">
                    {bestPerformingRestaurants.map((restaurant, index) => (
                      <tr 
                        key={restaurant.id} 
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <td className="py-3.5 font-medium">{restaurant.name}</td>
                        <td className="py-3.5 font-semibold text-emerald-600">
                          {restaurant.revenue}
                        </td>
                        <td className="py-3.5">{restaurant.transactions}</td>
                        <td className="py-3.5">
                          <div className="flex items-center">
                            <StarIcon className="h-4 w-4 text-yellow-500 fill-current mr-1" />
                            <span className="font-medium">{restaurant.rating}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Partners Section - Clean White Cards */}
          <div className="mt-6 rounded-xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-[#111827]">
                Partners & Integraties
              </h2>
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {partners.map((partner, index) => (
                <div 
                  key={index} 
                  className="rounded-lg p-4 transition-all bg-gray-50 hover:bg-gray-100 border border-gray-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{partner.icon}</span>
                    <div>
                      <h3 className="font-medium text-[#111827]">
                        {partner.name}
                      </h3>
                      <p className="text-sm text-[#6B7280]">
                        {partner.type}
                      </p>
                    </div>
                  </div>
                  <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    partner.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      partner.status === 'active' 
                        ? 'bg-green-600'
                        : 'bg-orange-600'
                    }`} />
                    {partner.status === 'active' ? 'Actief' : 'In afwachting'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}