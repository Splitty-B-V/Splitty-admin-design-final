import { createContext, useContext, useState, useEffect } from 'react'
import db from '../utils/database'

const UsersContext = createContext()

export function useUsers() {
  const context = useContext(UsersContext)
  if (!context) {
    throw new Error('useUsers must be used within a UsersProvider')
  }
  return context
}

export function UsersProvider({ children }) {
  // Initialize users from database
  const [companyUsers, setCompanyUsers] = useState(() => {
    const users = db.getUsers() || []
    return users.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      created: new Date(user.created)
    }))
  })

  // Restaurant users by restaurant ID
  const [restaurantUsers, setRestaurantUsers] = useState({
    6: [
      { id: 1, name: 'Sarah Johnson', email: 'sarah@limon.nl', phone: '+31 6 34567890', role: 'staff', lastActive: '5 minuten geleden', status: 'active' },
      { id: 2, name: 'Tom Bakker', email: 'tom@limon.nl', phone: '+31 6 01234567', role: 'staff', lastActive: '2 uur geleden', status: 'active' },
    ],
    16: [
      { id: 1, name: 'John Doe', email: 'john@splitty.com', role: 'admin', lastActive: '2 uur geleden', status: 'active' },
      { id: 2, name: 'Jane Smith', email: 'jane@splitty.com', role: 'staff', lastActive: '5 minuten geleden', status: 'active' },
    ],
  })

  // Refresh users from database
  const refreshUsers = () => {
    const users = db.getUsers() || []
    setCompanyUsers(users.map(user => ({
      ...user,
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : null,
      created: new Date(user.created)
    })))
  }

  // Sync with database on mount and when window gets focus or storage changes
  useEffect(() => {
    refreshUsers()
    
    const handleFocus = () => {
      refreshUsers()
    }
    
    const handleStorageChange = (e) => {
      if (e.key === 'splitty_users') {
        refreshUsers()
      }
    }
    
    window.addEventListener('focus', handleFocus)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const deleteCompanyUser = (userId) => {
    // Use database to delete user
    db.deleteUser(parseInt(userId))
    refreshUsers()
  }

  const addCompanyUser = (userData) => {
    // Use database to add user
    const newUser = db.addUser(userData)
    refreshUsers()
    return newUser
  }

  const authenticateUser = (email, password) => {
    // Use database to authenticate
    return db.authenticateUser(email, password)
  }

  const deleteRestaurantUser = (restaurantId, userId) => {
    setRestaurantUsers(prev => ({
      ...prev,
      [restaurantId]: (prev[restaurantId] || []).filter(user => user.id !== parseInt(userId))
    }))
  }

  const getCompanyUser = (userId) => {
    return companyUsers.find(user => user.id === parseInt(userId))
  }

  const getRestaurantUser = (restaurantId, userId) => {
    const users = restaurantUsers[restaurantId] || []
    return users.find(user => user.id === parseInt(userId))
  }

  return (
    <UsersContext.Provider value={{
      companyUsers,
      restaurantUsers,
      deleteCompanyUser,
      addCompanyUser,
      authenticateUser,
      deleteRestaurantUser,
      getCompanyUser,
      getRestaurantUser,
    }}>
      {children}
    </UsersContext.Provider>
  )
}