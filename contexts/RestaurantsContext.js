import { createContext, useContext, useState } from 'react'

const RestaurantsContext = createContext()

export function useRestaurants() {
  const context = useContext(RestaurantsContext)
  if (!context) {
    throw new Error('useRestaurants must be used within a RestaurantsProvider')
  }
  return context
}

export function RestaurantsProvider({ children }) {
  const [restaurants, setRestaurants] = useState([
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
    },
  ])

  const deleteRestaurant = (restaurantId) => {
    setRestaurants(prev => prev.map(restaurant => 
      restaurant.id === parseInt(restaurantId) 
        ? { ...restaurant, deleted: true, status: 'deleted' }
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
    }
    setRestaurants(prev => [...prev, newRestaurant])
    return newRestaurant
  }

  const getRestaurant = (restaurantId) => {
    return restaurants.find(restaurant => restaurant.id === parseInt(restaurantId))
  }

  const getActiveRestaurants = () => {
    return restaurants.filter(restaurant => !restaurant.deleted)
  }

  return (
    <RestaurantsContext.Provider value={{
      restaurants,
      deleteRestaurant,
      addRestaurant,
      getRestaurant,
      getActiveRestaurants,
    }}>
      {children}
    </RestaurantsContext.Provider>
  )
}