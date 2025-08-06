import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import { useUsers } from '../../../contexts/UsersContext'
import {
  ArrowLeftIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  UserIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  KeyIcon,
  ClipboardDocumentCheckIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline'
import { BuildingOfficeIcon as BuildingOfficeIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid'

export default function RestaurantStaffManagement() {
  const router = useRouter()
  const { id } = router.query
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const { restaurantUsers, refreshRestaurantUsers } = useUsers()

  // Mock data - in real app this would come from API
  const restaurantName = id === '15' ? 'Loetje' : id === '16' ? 'Splitty' : id === '6' ? 'Limon B.V.' : 'Restaurant'
  
  // Get staff members for this restaurant
  const staffMembers = restaurantUsers[id] || []
  
  // Refresh on mount and when ID changes
  useEffect(() => {
    if (id) {
      refreshRestaurantUsers()
    }
  }, [id])

  const filteredStaff = staffMembers.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    return matchesSearch && matchesRole
  })

  const rolePermissions = {
    admin: [
      { icon: ShieldCheckIcon, permission: 'Volledige toegang tot restaurant instellingen' },
      { icon: UserGroupIcon, permission: 'Personeel beheren en rollen toewijzen' },
      { icon: ChartBarIcon, permission: 'Analytics en rapportages bekijken' },
      { icon: CogIcon, permission: 'Integraties en betalingen configureren' },
    ],
    staff: [
      { icon: ClipboardDocumentCheckIcon, permission: 'Bestellingen bekijken en beheren' },
      { icon: UserIcon, permission: 'Eigen profiel bijwerken' },
      { icon: ChartBarIcon, permission: 'Basis statistieken bekijken' },
    ],
  }

  return (
    <Layout>
      <div className="min-h-screen bg-[#0A0B0F]">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link
                  href={`/restaurants/${id}`}
                  className="inline-flex items-center text-[#BBBECC] hover:text-white transition mr-6"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Terug
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Personeel Beheer</h1>
                  <p className="text-[#BBBECC] mt-1">{restaurantName}</p>
                </div>
              </div>
              <Link
                href={`/restaurants/${id}/users/new`}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition shadow-lg"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Personeel Toevoegen
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] rounded-lg">
                    <UserGroupIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-[#BBBECC]">Totaal</span>
                </div>
                <p className="text-2xl font-bold text-white">{staffMembers.length}</p>
                <p className="text-sm text-[#BBBECC] mt-1">Personeelsleden</p>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                    <BuildingOfficeIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-[#BBBECC]">Admins</span>
                </div>
                <p className="text-2xl font-bold text-white">{staffMembers.filter(m => m.role === 'admin').length}</p>
                <p className="text-sm text-[#BBBECC] mt-1">Restaurant Admins</p>
              </div>
              <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg">
                    <UserIcon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-xs text-[#BBBECC]">Staff</span>
                </div>
                <p className="text-2xl font-bold text-white">{staffMembers.filter(m => m.role === 'staff').length}</p>
                <p className="text-sm text-[#BBBECC] mt-1">Restaurant Staff</p>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MagnifyingGlassIcon className="h-5 w-5 text-[#BBBECC]" />
                    </div>
                    <input
                      id="search"
                      name="search"
                      className="block w-full pl-10 pr-3 py-3 bg-[#0A0B0F] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                      placeholder="Zoek op naam of email..."
                      type="search"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-[#0A0B0F] border border-[#2a2d3a] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2BE89A]"
                >
                  <option value="all">Alle Rollen</option>
                  <option value="admin">Restaurant Admin</option>
                  <option value="staff">Restaurant Staff</option>
                </select>
              </div>
            </div>

            {filteredStaff.length === 0 ? (
              <>
                {/* Empty State */}
                <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                  <div className="text-center py-20">
                    <div className="mx-auto h-20 w-20 bg-[#0A0B0F] rounded-full flex items-center justify-center mb-6">
                      <UserGroupIcon className="h-10 w-10 text-[#BBBECC]" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">Nog geen personeel</h3>
                    <p className="text-[#BBBECC] max-w-sm mx-auto">Dit restaurant heeft nog geen personeel toegevoegd</p>
                    <div className="mt-8">
                      <Link
                        href={`/restaurants/${id}/users/new`}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition"
                      >
                        <UserPlusIcon className="h-5 w-5 mr-2" />
                        Eerste personeelslid toevoegen
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Role Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Admin Role */}
                  <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-[#667EEA] to-[#764BA2] rounded-lg">
                        <BuildingOfficeIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-white">Restaurant Admin</h3>
                        <p className="text-sm text-[#BBBECC]">Volledige toegang en beheer</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {rolePermissions.admin.map((perm, index) => (
                        <div key={index} className="flex items-start bg-[#0A0B0F] rounded-lg p-3">
                          <perm.icon className="h-5 w-5 text-[#2BE89A] mr-3 mt-0.5" />
                          <span className="text-sm text-white">{perm.permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Staff Role */}
                  <div className="bg-[#1c1e27] rounded-xl p-6 border border-[#2a2d3a]">
                    <div className="flex items-center mb-6">
                      <div className="p-3 bg-gradient-to-r from-[#4ECDC4] to-[#44A08D] rounded-lg">
                        <UserIcon className="h-6 w-6 text-white" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-xl font-semibold text-white">Restaurant Staff</h3>
                        <p className="text-sm text-[#BBBECC]">Beperkte toegang</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {rolePermissions.staff.map((perm, index) => (
                        <div key={index} className="flex items-start bg-[#0A0B0F] rounded-lg p-3">
                          <perm.icon className="h-5 w-5 text-[#2BE89A] mr-3 mt-0.5" />
                          <span className="text-sm text-white">{perm.permission}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Staff List */}
                <div className="bg-[#1c1e27] rounded-xl border border-[#2a2d3a] overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#2a2d3a]">
                    <h2 className="text-lg font-semibold text-white">Personeel ({filteredStaff.length})</h2>
                  </div>
                  <div className="divide-y divide-[#2a2d3a]">
                    {filteredStaff.map((member) => (
                      <Link
                        key={member.id}
                        href={`/restaurants/${id}/users/${member.id}`}
                        className="block p-6 hover:bg-[#0A0B0F] transition cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-semibold">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="ml-4">
                              <h3 className="text-base font-medium text-white">{member.name}</h3>
                              <p className="text-sm text-[#BBBECC]">{member.email}</p>
                              <p className="text-xs text-[#BBBECC] mt-1">Laatst actief: {member.lastActive}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            {member.role === 'admin' ? (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#667EEA]/20 to-[#764BA2]/20 text-[#667EEA] border border-[#667EEA]/30">
                                <BuildingOfficeIconSolid className="h-4 w-4 mr-1.5" />
                                Admin
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#4ECDC4]/20 text-[#4ECDC4] border border-[#4ECDC4]/30">
                                <UserIconSolid className="h-4 w-4 mr-1.5" />
                                Staff
                              </span>
                            )}
                            <div className="text-[#2BE89A]">
                              <CogIcon className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}