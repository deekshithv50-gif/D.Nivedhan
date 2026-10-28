import React, { useState } from 'react';
import {
  ShoppingBag,
  Bell,
  PhoneCall,
  UserCheck,
  Shield,
  Truck,
  RotateCcw,
  Store,
  Boxes,
  BarChart3,
  Check,
  ExternalLink,
} from 'lucide-react';
import { TerraLogo } from './TerraLogo';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const {
    currentUser,
    switchRole,
    cartTotalCount,
    setIsCartOpen,
    setIsHotlineOpen,
    setIsAuthModalOpen,
    notifications,
    unreadNotificationCount,
    markNotificationAsRead,
    markAllNotificationsRead,
    orders,
    setActiveDeliveryOrder,
  } = useApp();

  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const roles: { role: UserRole; title: string; desc: string }[] = [
    { role: 'admin', title: 'Super Admin', desc: 'Marketplace, approvals & financials' },
    { role: 'vendor', title: 'Farm Vendor', desc: 'Catalog, batch SKU & restock' },
    { role: 'customer', title: 'Customer', desc: 'Fresh orders, payments & returns' },
    { role: 'support', title: 'Customer Care', desc: 'RMA resolution & return labels' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Brand Element */}
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('catalog')}
            className="flex items-center text-left focus:outline-none"
          >
            <TerraLogo variant="compact" size="md" />
          </button>
        </div>

        {/* Zone 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'catalog'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            Produce Catalog
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'vendors'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            Local Vendors (26)
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'inventory'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            SKU Inventory
          </button>
          <button
            onClick={() => setActiveTab('logistics')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'logistics'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            Delivery Tracker
          </button>
          <button
            onClick={() => setActiveTab('returns')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'returns'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            Returns & RMA
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'analytics'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('integrations')}
            className={`transition-colors hover:text-stone-950 py-1 border-b-2 whitespace-nowrap shrink-0 ${
              activeTab === 'integrations'
                ? 'border-emerald-700 text-stone-950 font-bold'
                : 'border-transparent text-stone-600'
            }`}
          >
            ERP Sync
          </button>
          <button
            onClick={() => setActiveTab('javacode')}
            className={`transition-colors hover:text-amber-900 py-1 border-b-2 whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              activeTab === 'javacode'
                ? 'border-amber-600 text-amber-950 font-bold'
                : 'border-transparent text-amber-800/80 hover:text-amber-950'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Java Code</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* 1-800 Customer Support Hotline Trigger */}
          <button
            onClick={() => setIsHotlineOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors whitespace-nowrap"
            title="Customer Care: 1-800-FARM-FRESH"
          >
            <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-mono font-semibold">1-800-FARM-FRESH</span>
          </button>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            title="Shopping Cart & Stripe Checkout"
          >
            <ShoppingBag className="w-4 h-4" />
            {cartTotalCount > 0 && (
              <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-emerald-600 text-[10px] font-bold text-white font-mono">
                {cartTotalCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifMenu(!showNotifMenu);
                setShowRoleMenu(false);
              }}
              className="relative p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute 1.5 top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-stone-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-800 uppercase tracking-wider font-mono">
                    System Alerts ({notifications.length})
                  </span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-emerald-700 hover:underline"
                  >
                    Mark all read
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-stone-50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationAsRead(n.id)}
                      className={`p-3 text-xs hover:bg-stone-50 transition-colors cursor-pointer ${
                        !n.read ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-stone-900">{n.title}</span>
                        <span className="text-[10px] text-stone-500 shrink-0 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-stone-600 mt-0.5 line-clamp-2">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & Auth Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifMenu(false);
              }}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors text-xs"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-800 text-white flex items-center justify-center font-bold text-[10px]">
                {currentUser.avatar || currentUser.name.substring(0, 2)}
              </div>
              <span className="hidden sm:inline font-semibold text-stone-800">
                {currentUser.role.toUpperCase()}
              </span>
              <span className="text-stone-400 text-[10px]">▼</span>
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-stone-100 mb-1">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-500 font-semibold">
                    Current Stakeholder Session
                  </p>
                  <p className="text-xs font-bold text-stone-900">{currentUser.name}</p>
                  <p className="text-[11px] text-stone-500 font-mono">{currentUser.email}</p>
                  <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-mono">
                    <Shield className="w-3 h-3" />
                    <span>AES-256 Vault Session Active</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="px-3 pt-1 text-[10px] font-mono text-stone-600 uppercase font-semibold">
                    Switch RBAC Role
                  </p>
                  {roles.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => {
                        switchRole(r.role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        currentUser.role === r.role
                          ? 'bg-emerald-50 text-emerald-950 font-semibold'
                          : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{r.title}</p>
                        <p className="text-[10px] text-stone-600 font-normal">{r.desc}</p>
                      </div>
                      {currentUser.role === r.role && <Check className="w-4 h-4 text-emerald-700" />}
                    </button>
                  ))}
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100">
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setShowRoleMenu(false);
                    }}
                    className="w-full text-center py-1.5 text-xs text-stone-600 hover:text-stone-900 rounded-md hover:bg-stone-100 transition-colors"
                  >
                    View Encryption & Token Details
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden flex items-center overflow-x-auto gap-3 px-4 py-2 border-t border-stone-100 text-xs font-medium no-scrollbar">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'catalog' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          Catalog
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'vendors' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          Vendors (26)
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'inventory' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          SKU Inventory
        </button>
        <button
          onClick={() => setActiveTab('logistics')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'logistics' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          Tracker
        </button>
        <button
          onClick={() => setActiveTab('returns')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'returns' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          Returns
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'analytics' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'integrations' ? 'bg-emerald-800 text-white' : 'text-stone-600'
          }`}
        >
          ERP Sync
        </button>
        <button
          onClick={() => setActiveTab('javacode')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            activeTab === 'javacode' ? 'bg-amber-800 text-white font-bold' : 'text-amber-800'
          }`}
        >
          Java Code
        </button>
      </div>
    </header>
  );
};
