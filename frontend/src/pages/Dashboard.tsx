/**
 * プロジェクト: PintHop
 * ファイルパス: frontend/src/pages/Dashboard.tsx
 *
 * 作成者: AI Assistant
 * 作成日: 2025-05-30
 *
 * 説明:
 * ログイン後のダッシュボードページ
 */

import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header - Netflix Style */}
      <header className="bg-dark-800 backdrop-blur-sm border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-display font-bold text-white flex items-center">
                🍺 <span className="ml-2 bg-gradient-to-r from-primary-500 to-beer-500 bg-clip-text text-transparent">PintHop</span>
              </h1>
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-dark-200 hover:text-white transition-colors font-medium">Discover</a>
                <a href="#" className="text-dark-200 hover:text-white transition-colors font-medium">Friends</a>
                <a href="#" className="text-dark-200 hover:text-white transition-colors font-medium">Map</a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-beer-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <span className="text-white font-medium hidden sm:block">Welcome, {user?.username}!</span>
              </div>
              <button
                onClick={logout}
                className="bg-dark-700 hover:bg-dark-600 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 hover:scale-105"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-800 via-dark-900 to-primary-900 py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-beer-500/10"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
              Start Your <span className="bg-gradient-to-r from-primary-400 to-beer-400 bg-clip-text text-transparent">Beer Journey</span>
            </h2>
            <p className="text-xl text-dark-200 mb-8 max-w-2xl mx-auto">
              Discover breweries, connect with friends, and share your beer hopping adventures in real-time.
            </p>
            <button className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-105 shadow-glow">
              🍺 Check In Now
            </button>
          </div>
        </div>
      </section>

      {/* Main Content - Netflix Card Style */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Quick Actions */}
        <section className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { icon: "📍", title: "Check In", subtitle: "Mark your current location", color: "from-primary-500 to-primary-600" },
              { icon: "🗺️", title: "Explore Map", subtitle: "Find nearby breweries", color: "from-accent-blue to-blue-600" },
              { icon: "👥", title: "Find Friends", subtitle: "See who's nearby", color: "from-accent-success to-green-600" },
              { icon: "🎯", title: "Set Goal", subtitle: "Plan your beer route", color: "from-beer-500 to-beer-600" },
            ].map((action, index) => (
              <div
                key={index}
                className="group bg-dark-800 hover:bg-dark-700 rounded-2xl p-6 transition-all duration-200 hover:scale-105 cursor-pointer border border-dark-700 hover:border-primary-500/50"
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center text-white text-xl mb-4`}>
                  {action.icon}
                </div>
                <h4 className="text-white font-bold text-lg mb-2">{action.title}</h4>
                <p className="text-dark-300 text-sm">{action.subtitle}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Sections */}
        <section className="mb-12">
          <h3 className="text-2xl font-display font-bold text-white mb-6">Trending Now</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Popular Breweries */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h4 className="text-xl font-bold text-white flex items-center">
                  🔥 <span className="ml-2">Hot Spots</span>
                </h4>
                <p className="text-dark-300 mt-1">Most popular breweries right now</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { name: "Fremont Brewing", visitors: "12 friends here", status: "online" },
                  { name: "Ballard Beer Co", visitors: "8 friends here", status: "online" },
                  { name: "Georgetown Brewing", visitors: "5 friends here", status: "online" },
                ].map((brewery, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-xl bg-dark-700/50 hover:bg-dark-700 transition-colors cursor-pointer">
                    <div className="w-3 h-3 bg-accent-success rounded-full animate-pulse-soft"></div>
                    <div className="flex-1">
                      <h5 className="text-white font-medium">{brewery.name}</h5>
                      <p className="text-dark-300 text-sm">{brewery.visitors}</p>
                    </div>
                    <span className="text-accent-success text-sm font-medium">Live</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-dark-800 rounded-2xl overflow-hidden border border-dark-700">
              <div className="p-6 border-b border-dark-700">
                <h4 className="text-xl font-bold text-white flex items-center">
                  ⚡ <span className="ml-2">Recent Activity</span>
                </h4>
                <p className="text-dark-300 mt-1">What your friends are up to</p>
              </div>
              <div className="p-6 space-y-4">
                {[
                  { user: "Alice", action: "checked in at Pike Brewing", time: "5 min ago", avatar: "A" },
                  { user: "Bob", action: "started beer hopping in Ballard", time: "12 min ago", avatar: "B" },
                  { user: "Charlie", action: "discovered a new IPA", time: "1 hour ago", avatar: "C" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-dark-700/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-beer-500 rounded-full flex items-center justify-center text-white font-bold">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white">
                        <span className="font-medium">{activity.user}</span>{" "}
                        <span className="text-dark-300">{activity.action}</span>
                      </p>
                      <p className="text-dark-400 text-sm">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Overview */}
        <section>
          <h3 className="text-2xl font-display font-bold text-white mb-6">Your Journey</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Breweries Visited", value: "12", icon: "🏪" },
              { label: "Beers Tried", value: "47", icon: "🍺" },
              { label: "Friends Met", value: "8", icon: "👥" },
              { label: "Routes Completed", value: "3", icon: "🗺️" },
            ].map((stat, index) => (
              <div key={index} className="bg-dark-800 rounded-2xl p-6 text-center border border-dark-700">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-dark-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Development Notice */}
        <div className="mt-12 bg-gradient-to-r from-beer-500/20 to-primary-500/20 border border-beer-500/30 rounded-2xl p-6">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🚧</span>
            <div>
              <h4 className="text-beer-400 font-bold">Development Mode</h4>
              <p className="text-dark-200 text-sm">This is a preview version. Features are being actively developed based on user feedback.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;