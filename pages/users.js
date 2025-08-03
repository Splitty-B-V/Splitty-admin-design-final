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

  const getRoleIcon = (role) => {
    switch (role) {
      case 'ceo':
        return <ShieldCheckIcon className="h-4 w-4" />
      case 'admin':
        return <ShieldCheckIcon className="h-4 w-4" />
      case 'account_manager':
        return <UserGroupIcon className="h-4 w-4" />
      case 'support':
        return <UserIcon className="h-4 w-4" />
      case 'developer':
        return <UserIcon className="h-4 w-4" />
      default:
        return <UserIcon className="h-4 w-4" />
    }
  }

  const getRoleBadgeStyle = (role) => {
    switch (role) {
      case 'ceo':
        return 'bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/30'
      case 'admin':
        return 'bg-[#667EEA]/20 text-[#667EEA] border border-[#667EEA]/30'
      case 'account_manager':
        return 'bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/30'
      case 'support':
        return 'bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30'
      case 'developer':
        return 'bg-[#6190E8]/20 text-[#6190E8] border border-[#6190E8]/30'
      default:
        return 'bg-[#4B5563]/20 text-[#4B5563] border border-[#4B5563]/30'
    }
  }

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
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ name: 'Gebruikers' }]} />

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-white">Splitty Team</h1>
                <p className="text-[#BBBECC] mt-1">Beheer alle medewerkers en hun toegangsrechten</p>
              </div>
              <Link
                href="/users/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Gebruiker Toevoegen
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-[#1c1e27] rounded-xl p-5 border border-[#2a2d3a]">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[#BBBECC] text-sm">{stat.label}</p>
                      <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-[#BBBECC]" />
                    </div>
                    <input
                      type="text"
                      name="search"
                      id="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 bg-[#0F1117] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="Zoek op naam, email of afdeling..."
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-[#BBBECC]" />
                  <div className="flex space-x-3">
                    <select
                      id="role"
                      name="role"
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      className="bg-[#0F1117] border border-[#2a2d3a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A]"
                    >
                      <option value="all">Alle Rollen</option>
                      <option value="ceo">CEO</option>
                      <option value="admin">Administrator</option>
                      <option value="account_manager">Account Manager</option>
                      <option value="support">Support</option>
                      <option value="developer">Developer</option>
                    </select>
                    <select
                      id="status"
                      name="status"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-[#0F1117] border border-[#2a2d3a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A]"
                    >
                      <option value="all">Alle Status</option>
                      <option value="active">Actief</option>
                      <option value="inactive">Inactief</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-[#0F1117] border-b border-[#2a2d3a]">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Gebruiker
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Afdeling
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Rol
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-[#BBBECC] uppercase tracking-wider">
                        Laatste Login
                      </th>
                      <th scope="col" className="relative px-6 py-4">
                        <span className="sr-only">Acties</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a2d3a]">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#0F1117] transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                              <div className="text-sm text-[#BBBECC] flex items-center mt-1">
                                <EnvelopeIcon className="h-3.5 w-3.5 mr-1" />
                                {user.email}
                              </div>
                              <div className="text-sm text-[#BBBECC] flex items-center mt-0.5">
                                <PhoneIcon className="h-3.5 w-3.5 mr-1" />
                                {user.phone}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-white">
                            <BuildingOfficeIcon className="h-4 w-4 text-[#BBBECC] mr-2" />
                            {user.department}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeStyle(user.role)}`}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1.5">
                              {getRoleLabel(user.role)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {user.status === 'active' ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#2BE89A]/20 text-[#2BE89A] border border-[#2BE89A]/30">
                              <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                              Actief
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                              <XCircleIcon className="h-4 w-4 mr-1.5" />
                              Inactief
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-[#BBBECC]">
                            <ClockIcon className="h-4 w-4 mr-1.5" />
                            {formatDate(user.lastLogin)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end space-x-3">
                            <Link
                              href={`/users/${user.id}`}
                              className="inline-flex items-center px-3 py-1.5 bg-[#0F1117] text-[#2BE89A] border border-[#2BE89A]/30 rounded-lg hover:bg-[#2BE89A]/10 transition text-sm"
                            >
                              Bewerk
                            </Link>
                            {canDelete && user.role !== 'ceo' && ( // Don't allow deleting CEO
                              <Link
                                href={`/users/${user.id}?delete=true`}
                                className="inline-flex items-center px-3 py-1.5 bg-[#0F1117] text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/10 transition text-sm"
                              >
                                Verwijder
                              </Link>
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
                <div className="bg-[#0F1117] px-6 py-4 border-t border-[#2a2d3a]">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-[#BBBECC]">
                      <span className="font-medium text-white">{filteredUsers.length}</span> gebruikers gevonden
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Empty State */}
            {filteredUsers.length === 0 && (
              <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] p-12 text-center">
                <UserGroupIcon className="mx-auto h-12 w-12 text-[#BBBECC] mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Geen gebruikers gevonden</h3>
                <p className="text-[#BBBECC]">Probeer je zoekfilters aan te passen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}