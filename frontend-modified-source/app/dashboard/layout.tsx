'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuthStore } from '@/lib/store'
import toast, { Toaster } from 'react-hot-toast'
import {
  HomeIcon, UserGroupIcon, ChartBarIcon,
  CogIcon, UserCircleIcon, ArrowRightStartOnRectangleIcon,
  Bars3Icon, XMarkIcon, BellIcon, CalendarDaysIcon,
  DocumentTextIcon, BriefcaseIcon, CameraIcon,
  CheckCircleIcon, ClockIcon as ClockOutline, BanknotesIcon,
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeSolid, UserGroupIcon as UserGroupSolid,
  ChartBarIcon as ChartSolid,
  CogIcon as CogSolid, UserCircleIcon as UserSolid,
  CalendarDaysIcon as CalendarSolid,
  DocumentTextIcon as DocumentSolid,
  BriefcaseIcon as BriefcaseSolid,
} from '@heroicons/react/24/solid'

const navItems = [
  { name: 'Tableau de bord',  href: '/dashboard',                  icon: HomeIcon,          activeIcon: HomeSolid,       roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Employés',         href: '/dashboard/employees',         icon: UserGroupIcon,     activeIcon: UserGroupSolid,  roles: ['ADMIN','RH'] },
  { name: 'Structures',       href: '/dashboard/structures',        icon: BriefcaseIcon,     activeIcon: BriefcaseSolid,  roles: ['ADMIN','RH'] },
  { name: 'Salaires',         href: '/dashboard/salaires',          icon: BanknotesIcon,     activeIcon: BanknotesIcon,   roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Ordres Mission',   href: '/dashboard/ordres-mission',    icon: DocumentTextIcon,  activeIcon: DocumentSolid,   roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Demandes',         href: '/dashboard/demandes',          icon: CalendarDaysIcon,  activeIcon: CalendarSolid,   roles: ['EMPLOYEE'] },
  { name: 'Documents',        href: '/dashboard/documents',         icon: DocumentTextIcon,  activeIcon: DocumentSolid,   roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Annonces',         href: '/dashboard/annonces',          icon: BellIcon,          activeIcon: BellIcon,        roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Mes congés',       href: '/dashboard/leave-balance',     icon: CalendarDaysIcon,  activeIcon: CalendarSolid,   roles: ['EMPLOYEE'] },
  { name: 'Mes attestations', href: '/dashboard/document-request',  icon: DocumentTextIcon,  activeIcon: DocumentSolid,   roles: ['EMPLOYEE'] },
  { name: 'Gestion RH',       href: '/dashboard/rh',                icon: BriefcaseIcon,     activeIcon: BriefcaseSolid,  roles: ['ADMIN','RH'] },
  { name: 'Statistiques',     href: '/dashboard/analytics',         icon: ChartBarIcon,      activeIcon: ChartSolid,      roles: ['ADMIN','RH'] },
  { name: 'Mon Profil',       href: '/dashboard/profile',           icon: UserCircleIcon,    activeIcon: UserSolid,       roles: ['ADMIN','RH','EMPLOYEE'] },
  { name: 'Administration',   href: '/dashboard/admin',             icon: CogIcon,           activeIcon: CogSolid,        roles: ['ADMIN'] },
]

const ROLE_BADGE: Record<string, { label: string; cls: string }> = {
  ADMIN:    { label: 'Administrateur', cls: 'bg-danger-500/10 text-danger-500' },
  RH:       { label: 'Ressources Humaines', cls: 'bg-primary-600/10 text-primary-600' },
  EMPLOYEE: { label: 'Employé', cls: 'bg-primary-500/10 text-primary-600' },
}

// Notifications fictives (à remplacer par de vraies données)
const mockNotifications = [
  { id: 1, type: 'success', title: 'Demande approuvée', message: 'Votre demande de congé a été approuvée', time: '5 min', read: false },
  { id: 2, type: 'info', title: 'Nouveau message', message: 'Vous avez reçu un message de RH', time: '1 h', read: false },
  { id: 3, type: 'warning', title: 'Rappel', message: 'N\'oubliez pas de pointer aujourd\'hui', time: '2 h', read: true },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router   = useRouter()
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [notifications, setNotifications] = useState(mockNotifications)
  
  const notifRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthenticated) router.push('/login')
  }, [isAuthenticated, router])

  useEffect(() => {
    if (isAuthenticated && user?.passwordChangeRequired && pathname !== '/dashboard/profile') {
      toast.error('Vous devez modifier votre mot de passe pour continuer.')
      router.push('/dashboard/profile#change-password')
    }
  }, [isAuthenticated, user?.passwordChangeRequired, pathname, router])

  // Fermer les dropdowns en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Déconnexion réussie')
    router.push('/login')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5 MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
        toast.success('Photo de profil mise à jour !')
      }
      reader.readAsDataURL(file)
    }
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success('Toutes les notifications marquées comme lues')
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const filteredNav = navItems.filter((item) => item.roles.includes(user?.role || ''))
  const isActive    = (href: string) => href === '/dashboard' ? pathname === href : pathname.startsWith(href)
  const badge       = ROLE_BADGE[user?.role || ''] ?? { label: user?.role, cls: 'bg-gray-100 text-gray-600' }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-brand-green rounded-xl flex items-center justify-center shadow-green flex-shrink-0">
          <span className="text-white font-black text-lg">K</span>
        </div>
        <div>
          <p className="font-black text-gray-900 text-base leading-tight">Khadamati</p>
          <p className="text-gray-400 text-[10px] font-medium">خدماتي · Entraide Nationale</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredNav.map((item) => {
          const active = isActive(item.href)
          const Icon   = active ? item.activeIcon : item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-primary-600/10 text-primary-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {active && <div className="absolute left-0 w-1 h-6 bg-primary-600 rounded-r-full" />}
              <Icon className={`h-5 w-5 flex-shrink-0 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="flex-1">{item.name}</span>
              {active && <div className="w-1.5 h-1.5 bg-primary-600 rounded-full" />}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50">
          <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-sm font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <span className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${badge.cls}`}>
              {badge.label}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-danger-500 hover:bg-red-50 rounded-lg transition"
            title="Se déconnecter"
          >
            <ArrowRightStartOnRectangleIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-surface flex">
      <Toaster position="top-right" />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-2xl transform transition-transform duration-300 lg:hidden ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
          <XMarkIcon className="h-5 w-5" />
        </button>
        <SidebarContent />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-white border-r border-gray-100 shadow-sm relative">
        <SidebarContent />
      </aside>

      {/* Main */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm text-gray-500 capitalize">
                {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 group"
              >
                <BellIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex items-center justify-center min-w-[18px] h-[18px] bg-danger-500 text-white text-[10px] font-bold rounded-full px-1 animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Menu */}
              {notifOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  <div className="px-4 py-3 bg-gradient-to-r from-primary-600 to-primary-700 flex items-center justify-between">
                    <h3 className="text-white font-bold text-sm">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-white/90 hover:text-white font-medium underline"
                      >
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-400">
                        <BellIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Aucune notification</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notif.read ? 'bg-primary-50/30' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                              notif.type === 'success' ? 'bg-green-100' :
                              notif.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                            }`}>
                              {notif.type === 'success' ? (
                                <CheckCircleIcon className="h-4 w-4 text-green-600" />
                              ) : notif.type === 'warning' ? (
                                <ClockOutline className="h-4 w-4 text-yellow-600" />
                              ) : (
                                <BellIcon className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-900 mb-0.5">{notif.title}</p>
                              <p className="text-xs text-gray-600 mb-1">{notif.message}</p>
                              <p className="text-xs text-gray-400">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="flex-shrink-0 w-2 h-2 bg-primary-600 rounded-full mt-2" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 bg-gray-50 text-center">
                    <Link href="/dashboard/notifications" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                      Voir toutes les notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2.5 pl-3 pr-2 py-1.5 border-l border-gray-200 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
              >
                <div className="relative">
                  {profileImage ? (
                    <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-primary-600/20 group-hover:ring-primary-600/40 transition-all">
                      <Image
                        src={profileImage}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                      <span className="text-white text-sm font-bold">
                        {user?.firstName?.[0]}{user?.lastName?.[0]}
                      </span>
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-bold text-gray-900 leading-tight">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{badge.label}</p>
                </div>
                <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in">
                  {/* Profile Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative group/avatar">
                        {profileImage ? (
                          <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/30">
                            <Image
                              src={profileImage}
                              alt="Profile"
                              width={56}
                              height={56}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center ring-2 ring-white/30">
                            <span className="text-white text-lg font-bold">
                              {user?.firstName?.[0]}{user?.lastName?.[0]}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity"
                        >
                          <CameraIcon className="h-5 w-5 text-white" />
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-white/80">{user?.email}</p>
                        <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded-full">
                          {badge.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserCircleIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium">Mon Profil</span>
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <CogIcon className="h-5 w-5 text-gray-400" />
                      <span className="text-sm font-medium">Paramètres</span>
                    </Link>
                    <div className="my-2 border-t border-gray-100" />
                    <button
                      onClick={() => {
                        setProfileOpen(false)
                        handleLogout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-danger-600 hover:bg-red-50 transition-colors"
                    >
                      <ArrowRightStartOnRectangleIcon className="h-5 w-5" />
                      <span className="text-sm font-medium">Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-6 py-3 border-t border-gray-100 bg-white">
          <p className="text-xs text-gray-400 text-center">
            © {new Date().getFullYear()} Khadamati · Entraide Nationale · Royaume du Maroc
          </p>
        </footer>
      </div>
    </div>
  )
}
