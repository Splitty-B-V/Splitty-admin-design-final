import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useUsers } from '../contexts/UsersContext'
import {
  MagnifyingGlassIcon,
  UserPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ShieldCheckIcon,
  UserIcon,
  UsersIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'

export default function Users() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentUserRole, setCurrentUserRole] = useState('support')
  const [canDelete, setCanDelete] = useState(false)
  const { companyUsers } = useUsers()
  
  useEffect(() => {
    // Get current user role from localStorage (set during login)
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('userRole') || 'support'
      setCurrentUserRole(role)
      setCanDelete(['ceo', 'admin'].includes(role))
    }
  }, [])

  const filteredUsers = companyUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesRole && matchesStatus
  })

  const formatDate = (date) => {
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) return `${diffMins} minuten geleden`
    if (diffHours < 24) return `${diffHours} uur geleden`
    if (diffDays < 7) return `${diffDays} dagen geleden`
    
    return new Intl.DateTimeFormat('nl-NL', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date)
  }

  // Removed icon and style functions as we're using inline styles now

  const getRoleLabel = (role) => {
    switch (role) {
      case 'ceo':
        return 'CEO'
      case 'admin':
        return 'Administrator'
      case 'account_manager':
        return 'Account Manager'
      case 'support':
        return 'Support'
      case 'developer':
        return 'Developer'
      default:
        return role
    }
  }

  const stats = [
    { 
      label: 'Totaal Medewerkers', 
      value: companyUsers.length, 
      icon: UsersIcon, 
      color: 'from-[#2BE89A] to-[#4FFFB0]' 
    },
    { 
      label: 'Actief', 
      value: companyUsers.filter(u => u.status === 'active').length, 
      icon: CheckCircleIcon, 
      color: 'from-[#4ECDC4] to-[#44A08D]' 
    },
    { 
      label: 'Administrators', 
      value: companyUsers.filter(u => u.role === 'admin' || u.role === 'ceo').length, 
      icon: ShieldCheckIcon, 
      color: 'from-[#667EEA] to-[#764BA2]' 
    },
    { 
      label: 'Support Team', 
      value: companyUsers.filter(u => u.role === 'support' || u.role === 'account_manager').length, 
      icon: UserGroupIcon, 
      color: 'from-[#FF6B6B] to-[#FF8E53]' 
    },
  ]

  return (
    <Layout>
      <div className="min-h-screen bg-[#F9FAFB]">
        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Splitty Team' }]} />

            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                  Splitty Team
                </h1>
                <p className="text-gray-600">
                  Beheer alle medewerkers en hun toegangsrechten
                </p>
              </div>
              <Link
                href="/users/new"
                className="inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors bg-green-600 text-white hover:bg-green-700"
              >
                <UserPlusIcon className="h-4 w-4 mr-2" />
                Nieuwe Medewerker
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  Totaal Team
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {companyUsers.length}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  Actief
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {companyUsers.filter(u => u.status === 'active').length}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  Administrators
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {companyUsers.filter(u => u.role === 'admin' || u.role === 'ceo').length}
                </p>
              </div>
              
              <div className="p-5 rounded-lg bg-white border border-gray-200">
                <p className="text-xs text-gray-500">
                  Support Team
                </p>
                <p className="text-2xl font-semibold mt-1 text-gray-900">
                  {companyUsers.filter(u => u.role === 'support' || u.role === 'account_manager').length}
                </p>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-green-600 focus:outline-none"
                    placeholder="Zoek op naam, email of afdeling..."
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 focus:outline-none"
                >
                  <option value="all">Alle Rollen</option>
                  <option value="ceo">CEO</option>
                  <option value="admin">Administrator</option>
                  <option value="account_manager">Account Manager</option>
                  <option value="support">Support</option>
                  <option value="developer">Developer</option>
                </select>
                
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 rounded-lg border transition-colors bg-white border-gray-200 text-gray-900 focus:outline-none"
                >
                  <option value="all">Alle Status</option>
                  <option value="active">Actief</option>
                  <option value="inactive">Inactief</option>
                </select>
              </div>
            </div>

            {/* Users Table */}
            <div className="rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="border-b bg-gray-50 border-gray-200">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Gebruiker
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Afdeling
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Laatste Login
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Acties</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="transition-colors hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full flex items-center justify-center font-semibold bg-green-100 text-green-700">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm flex items-center mt-1 text-gray-500">
                                <EnvelopeIcon className="h-3.5 w-3.5 mr-1" />
                                {user.email}
                              </div>
                              <div className="text-sm flex items-center mt-0.5 text-gray-500">
                                <PhoneIcon className="h-3.5 w-3.5 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <BuildingOfficeIcon className="h-4 w-4 mr-2 text-gray-400" />
                            {user.department}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                            user.role === 'ceo' 
                              ? 'bg-purple-50 text-purple-700'
                              : user.role === 'admin'
                              ? 'bg-blue-50 text-blue-700'
                              : user.role === 'account_manager'
                              ? 'bg-cyan-50 text-cyan-700'
                              : user.role === 'support'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {getRoleLabel(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700">
                              <CheckCircleIcon className="h-3.5 w-3.5 mr-1" />
                              Actief
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700">
                              <XCircleIcon className="h-3.5 w-3.5 mr-1" />
                              Inactief
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <ClockIcon className="h-4 w-4 mr-1.5" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              href={`/users/${user.id}`}
                              className="text-sm font-medium transition-colors text-green-600 hover:text-green-700"
                            >
                              Bewerk
                            </Link>
                            {canDelete && user.role !== 'ceo' && (
                              <>
                                <span className="text-gray-300">•</span>
                                <Link
                                  href={`/users/${user.id}?delete=true`}
                                  className="text-sm font-medium transition-colors text-red-600 hover:text-red-700"
                                >
                                  Verwijder
                                </Link>
                              </>
                            )}
                          </div>
                        </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredUsers.length > 0 && (
                <div className="px-6 py-4 border-t bg-gray-50 border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">{filteredUsers.length}</span> gebruikers gevonden
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="rounded-xl p-12 text-center bg-white shadow-sm">
                <UserGroupIcon className="mx-auto h-12 w-12 mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-900">Geen gebruikers gevonden</h3>
                <p className="text-gray-600">
                  Probeer je zoekfilters aan te passen
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}