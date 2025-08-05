import { useEffect, useState } from 'react'
import { useUsers } from '../contexts/UsersContext'
import { useRestaurants } from '../contexts/RestaurantsContext'

export default function DebugInfo({ restaurantId }) {
  const [onboardingData, setOnboardingData] = useState(null)
  const { restaurantUsers } = useUsers()
  const { getRestaurant } = useRestaurants()
  const restaurant = getRestaurant(restaurantId)
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(`onboarding_${restaurantId}`)
      if (data) {
        setOnboardingData(JSON.parse(data))
      }
      
      // Always show in development
      const forceShow = true
      
      if (forceShow) {
        console.log('Restaurant ID:', restaurantId)
        console.log('Restaurant exists:', !!restaurant)
        console.log('Restaurant data:', restaurant)
        console.log('Onboarding data:', data)
        console.log('Restaurant users:', restaurantUsers[restaurantId])
      }
    }
  }, [restaurantId, restaurant, restaurantUsers])
  
  // Always show for debugging
  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg max-w-md text-xs font-mono overflow-auto max-h-96">
      <div className="mb-2 font-bold text-yellow-400">Debug Info - Restaurant {restaurantId}</div>
      
      <div className="mb-2">
        <div className="font-bold text-green-400">Restaurant exists: {restaurant ? 'YES' : 'NO'}</div>
      </div>
      
      <div className="mb-2">
        <div className="font-bold text-blue-400">UsersContext data:</div>
        <pre className="text-gray-300">{JSON.stringify(restaurantUsers[restaurantId] || [], null, 2)}</pre>
      </div>
      
      <div>
        <div className="font-bold text-purple-400">LocalStorage onboarding data:</div>
        <pre className="text-gray-300">{JSON.stringify(onboardingData?.personnelData || [], null, 2)}</pre>
      </div>
    </div>
  )
}