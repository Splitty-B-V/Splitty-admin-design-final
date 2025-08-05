import { createContext, useContext, useState, useEffect } from 'react'
import db from '../utils/database'

const RestaurantsContext = createContext()

export function useRestaurants() {
  const context = useContext(RestaurantsContext)
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantsProvider')
  }
  return context
}

export function RestaurantsProvider({ children }) {
  // Initialize with default restaurants
  const defaultRestaurants = [
    {
      id: 15,
      name: 'Loetje',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      deleted: false,
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753569541/restaurant_logos/jpqzqbsr8yx4bmk0etby.png',
      email: 'milad@splitty.nl',
      phone: '+310686232364',
      tables: 45,
      revenue: '€125,450',
      activeOrders: 12,
      totalOrders: 1234,
      created: new Date('2024-01-15'),
      isOnboarded: true,
    },
    {
      id: 16,
      name: 'Splitty',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      deleted: false,
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1753701510/restaurant_logos/k9up5gzm7mzv0zze1mg4.png',
      email: 'contact@splitty.com',
      phone: '+31 20 123 4567',
      tables: 30,
      revenue: '€98,760',
      activeOrders: 8,
      totalOrders: 956,
      created: new Date('2024-02-01'),
      isOnboarded: true,
    },
    {
      id: 10,
      name: 'Restaurant Stefan',
      location: 'Utrecht, Netherlands',
      status: 'active',
      deleted: false,
      logo: null,
      email: 'info@stefan.nl',
      phone: '+31 30 123 4567',
      tables: 25,
      revenue: '€78,340',
      activeOrders: 5,
      totalOrders: 743,
      created: new Date('2024-02-15'),
      isOnboarded: true,
    },
    {
      id: 11,
      name: 'Aldenaire catering',
      location: 'Rotterdam, Netherlands',
      status: 'inactive',
      deleted: false,
      logo: null,
      email: 'info@aldenaire.nl',
      phone: '+31 10 987 6543',
      tables: 0,
      revenue: '€45,200',
      activeOrders: 0,
      totalOrders: 412,
      created: new Date('2024-03-01'),
      isOnboarded: true,
    },
    {
      id: 6,
      name: 'Limon B.V.',
      location: 'Amsterdam, Netherlands',
      status: 'active',
      deleted: false,
      logo: 'https://res.cloudinary.com/dylmngivm/image/upload/v1746460172/restaurant_logos/wihua9omfsnhbqbrcfji.png',
      email: 'info@limon.nl',
      phone: '+31 20 555 1234',
      tables: 20,
      revenue: '€156,890',
      activeOrders: 15,
      totalOrders: 1567,
      created: new Date('2024-01-01'),
      isOnboarded: true,
    },
    {
      id: 7,
      name: 'Viresh Kewalbansing',
      location: 'Den Haag, Netherlands',
      status: 'active',
      deleted: false,
      logo: null,
      email: 'viresh@restaurant.nl',
      phone: '+31 70 123 4567',
      tables: 35,
      revenue: '€89,450',
      activeOrders: 7,
      totalOrders: 823,
      created: new Date('2024-03-15'),
      isOnboarded: true,
    },
    {
      id: 17,
      name: 'Anatolii Restaurant',
      location: 'Eindhoven, Netherlands',
      status: 'active',
      deleted: false,
      logo: null,
      email: 'info@anatolii.nl',
      phone: '+31 40 789 0123',
      tables: 40,
      revenue: '€112,340',
      activeOrders: 10,
      totalOrders: 1089,
      created: new Date('2024-04-01'),
      isOnboarded: true,
    },
  ]

  const [restaurants, setRestaurants] = useState([])

  // Load restaurants from localStorage on mount
  useEffect(() => {
    const storedRestaurants = db.getRestaurants()
    
    if (storedRestaurants && storedRestaurants.length > 0) {
      setRestaurants(storedRestaurants)
    } else {
      // Initialize with default restaurants if none exist
      db.setRestaurants(defaultRestaurants)
      setRestaurants(defaultRestaurants)
    }
  }, [])

  // Save to localStorage whenever restaurants change
  useEffect(() => {
    if (restaurants.length > 0) {
      db.setRestaurants(restaurants)
    }
  }, [restaurants])

  const deleteRestaurant = (restaurantId) => {
    console.log('Deleting restaurant with ID:', restaurantId)
    const restaurant = restaurants.find(r => r.id === parseInt(restaurantId))
    console.log('Found restaurant:', restaurant)
    
    // Check if restaurant has started onboarding
    let hasStartedOnboarding = false
    if (restaurant && !restaurant.isOnboarded && typeof window !== 'undefined') {
      const savedData = localStorage.getItem(`onboarding_${restaurantId}`)
      if (savedData) {
        const parsed = JSON.parse(savedData)
        // Check if any step has been completed (currentStep > 1 or any staff added)
        hasStartedOnboarding = (parsed.currentStep && parsed.currentStep > 1) || 
                               (parsed.staff && parsed.staff.length > 0)
      }
    }
    
    // If restaurant is not onboarded AND has not started onboarding, delete permanently
    if (restaurant && !restaurant.isOnboarded && !hasStartedOnboarding) {
      console.log('Restaurant has not started onboarding, deleting permanently')
      setRestaurants(prev => prev.filter(r => r.id !== parseInt(restaurantId)))
      // Also clean up any onboarding data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem(`onboarding_${restaurantId}`)
      }
    } else if (restaurant) {
      console.log('Restaurant is onboarded or has started onboarding, archiving')
      // Otherwise, archive it
      setRestaurants(prev => prev.map(r => 
        r.id === parseInt(restaurantId) 
          ? { ...r, deleted: true, deletedAt: new Date() }
          : r
      ))
    }
  }
  
  const deleteRestaurantPermanently = (restaurantId) => {
    setRestaurants(prev => prev.filter(restaurant => 
      restaurant.id !== parseInt(restaurantId)
    ))
    // Also clean up any onboarding data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem(`onboarding_${restaurantId}`)
    }
  }

  const restoreRestaurant = (restaurantId) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === parseInt(restaurantId)
        ? { ...restaurant, deleted: false, deletedAt: null }
        : restaurant
    ))
  }

  const addRestaurant = (restaurantData) => {
    const newRestaurant = {
      ...restaurantData,
      id: Math.max(...restaurants.map(r => r.id), 0) + 1,
      deleted: false,
      created: new Date(),
      revenue: '€0',
      activeOrders: 0,
      totalOrders: 0,
      isOnboarded: false,
      onboardingStep: 0,
    }
    setRestaurants(prev => [...prev, newRestaurant])
    return newRestaurant
  }

  const getRestaurant = (restaurantId) => {
    return restaurants.find(restaurant => restaurant.id === parseInt(restaurantId))
  }

  const getActiveRestaurants = () => {
    return restaurants.filter(restaurant => !restaurant.deleted && restaurant.status !== 'deleted')
  }

  const getDeletedRestaurants = () => {
    return restaurants.filter(restaurant => restaurant.deleted === true)
  }

  const updateRestaurant = (restaurantId, updates) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === parseInt(restaurantId)
        ? { ...restaurant, ...updates }
        : restaurant
    ))
  }

  const updateRestaurantStaff = (restaurantId, staff) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === parseInt(restaurantId)
        ? { ...restaurant, staff: staff }
        : restaurant
    ))
  }

  return (
    <RestaurantsContext.Provider value={{
      restaurants,
      deleteRestaurant,
      deleteRestaurantPermanently,
      restoreRestaurant,
      addRestaurant,
      getRestaurant,
      getActiveRestaurants,
      getDeletedRestaurants,
      updateRestaurant,
      updateRestaurantStaff,
    }}>
      {children}
    </RestaurantsContext.Provider>
  )
}