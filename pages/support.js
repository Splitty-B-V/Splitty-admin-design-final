import { useState } from 'react'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
import { useTheme } from '../contexts/ThemeContext'
import {
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  InboxIcon,
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'

export default function Support() {
  const { darkMode } = useTheme()
  const [activeChannel, setActiveChannel] = useState('all')
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)

  // Channels for different support sources
  const channels = [
    { id: 'all', name: 'All Channels', icon: InboxIcon, count: 24, color: 'text-white' },
    { id: 'whatsapp', name: 'WhatsApp', icon: ChatBubbleLeftRightIcon, count: 12, color: 'text-green-400' },
    { id: 'email', name: 'Email', icon: EnvelopeIcon, count: 8, color: 'text-blue-400' },
    { id: 'livechat', name: 'Live Chat', icon: GlobeAltIcon, count: 3, color: 'text-purple-400' },
    { id: 'phone', name: 'Phone', icon: PhoneIcon, count: 1, color: 'text-yellow-400' },
  ]

  // Mock conversations data
  const conversations = [
    {
      id: 1,
      customer: { name: 'Restaurant De Gouden Leeuw', avatar: null },
      channel: 'whatsapp',
      lastMessage: 'Hi, we have issues with the payment splitting feature',
      timestamp: '5 min ago',
      unread: true,
      status: 'open',
      priority: 'high'
    },
    {
      id: 2,
      customer: { name: "Bistro 't Hoekje", avatar: null },
      channel: 'email',
      lastMessage: 'Request for API documentation access',
      timestamp: '1 hour ago',
      unread: true,
      status: 'open',
      priority: 'medium'
    },
    {
      id: 3,
      customer: { name: 'Pizza Palace', avatar: null },
      channel: 'livechat',
      lastMessage: 'Thank you for the quick response!',
      timestamp: '2 hours ago',
      unread: false,
      status: 'resolved',
      priority: 'low'
    },
    {
      id: 4,
      customer: { name: 'Café Central', avatar: null },
      channel: 'whatsapp',
      lastMessage: 'How do I add a new waiter account?',
      timestamp: '3 hours ago',
      unread: false,
      status: 'open',
      priority: 'medium'
    },
  ]

  // Filter conversations based on active channel
  const filteredConversations = activeChannel === 'all' 
    ? conversations 
    : conversations.filter(conv => conv.channel === activeChannel)

  // Mock messages for selected conversation
  const messages = selectedConversation ? [
    {
      id: 1,
      sender: 'customer',
      text: 'Hi, we have issues with the payment splitting feature',
      timestamp: '10:30 AM',
    },
    {
      id: 2,
      sender: 'support',
      text: 'Hello! I\'m sorry to hear you\'re experiencing issues. Can you describe what\'s happening?',
      timestamp: '10:32 AM',
    },
    {
      id: 3,
      sender: 'customer',
      text: 'When customers try to split the bill, the QR code is not loading',
      timestamp: '10:35 AM',
    },
    {
      id: 4,
      sender: 'support',
      text: 'I see. Let me check your restaurant settings. Can you tell me which POS system you\'re using?',
      timestamp: '10:36 AM',
    },
  ] : []

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // Handle sending message logic here
      console.log('Sending message:', messageInput)
      setMessageInput('')
    }
  }

  const getChannelIcon = (channelId) => {
    const channel = channels.find(c => c.id === channelId)
    if (!channel) return null
    const colorClass = darkMode 
      ? channel.color 
      : channel.color.replace('text-green-400', 'text-green-600')
        .replace('text-blue-400', 'text-blue-600')
        .replace('text-purple-400', 'text-purple-600')
        .replace('text-yellow-400', 'text-yellow-600')
    return <channel.icon className={`h-4 w-4 ${colorClass}`} />
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return darkMode ? 'text-yellow-400' : 'text-yellow-600'
      case 'resolved': return darkMode ? 'text-green-400' : 'text-green-600'
      case 'pending': return darkMode ? 'text-gray-400' : 'text-gray-500'
      default: return darkMode ? 'text-gray-400' : 'text-gray-500'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return darkMode 
        ? 'bg-red-500/10 text-red-400 border-red-500/20'
        : 'bg-red-50 text-red-700 border-red-200'
      case 'medium': return darkMode
        ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
      case 'low': return darkMode
        ? 'bg-green-500/10 text-green-400 border-green-500/20'
        : 'bg-green-50 text-green-700 border-green-200'
      default: return darkMode
        ? 'bg-gray-500/10 text-gray-400 border-gray-500/20'
        : 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  return (
    <Layout>
      <div className={`min-h-screen ${darkMode ? 'bg-[#0A0B0F]' : 'bg-[#F9FAFB]'}`}>
        <div className="flex relative" style={{ height: 'calc(100vh - 72px)' }}>
          {/* Sidebar - Channels and Conversations */}
          <div className={`w-96 flex flex-col border-r flex-shrink-0 h-full overflow-hidden ${
            darkMode 
              ? 'bg-[#0A0B0F] border-[#1c1e27]'
              : 'bg-white border-gray-200'
          }`}>
            {/* Fixed Header and Channels Container */}
            <div className="flex-shrink-0">
              {/* Header */}
              <div className={`px-6 py-4 border-b ${
                darkMode ? 'border-[#1c1e27]' : 'border-gray-200'
              }`}>
                <h1 className={`text-xl font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>Support Center</h1>
                
                {/* Search */}
                <div className="relative">
                  <MagnifyingGlassIcon className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 ${
                    darkMode ? 'text-[#BBBECC]' : 'text-gray-400'
                  }`} />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 transition ${
                      darkMode
                        ? 'bg-[#1c1e27] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                    }`}
                  />
                </div>
              </div>

              {/* Channels */}
              <div className={`px-4 py-3 border-b ${
                darkMode ? 'border-[#1c1e27]' : 'border-gray-200'
              }`}>
                <div className="space-y-1">
                  {channels.map((channel) => (
                    <button
                      key={channel.id}
                      onClick={() => setActiveChannel(channel.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                        activeChannel === channel.id
                          ? darkMode
                            ? 'bg-green-500/10 text-green-400'
                            : 'bg-green-50 text-green-600'
                          : darkMode
                            ? 'text-[#BBBECC] hover:bg-[#1c1e27] hover:text-white'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center">
                        <channel.icon className={`h-5 w-5 mr-3 ${
                          activeChannel === channel.id
                            ? darkMode ? 'text-green-400' : 'text-green-600'
                            : darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        activeChannel === channel.id
                          ? darkMode
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-green-100 text-green-700'
                          : darkMode
                            ? 'bg-[#1c1e27] text-[#BBBECC]'
                            : 'bg-gray-100 text-gray-600'
                      }`}>
                        {channel.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Scrollable Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full px-4 py-4 border-b transition-colors ${
                    selectedConversation?.id === conversation.id 
                      ? darkMode ? 'bg-[#1c1e27]' : 'bg-gray-50'
                      : ''
                  } ${
                    darkMode 
                      ? 'border-[#1c1e27] hover:bg-[#1c1e27]'
                      : 'border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {conversation.customer.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={conversation.customer.avatar}
                          alt={conversation.customer.name}
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                          darkMode
                            ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {conversation.customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          {conversation.customer.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(conversation.channel)}
                          <span className={`text-xs ${
                            darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                          }`}>{conversation.timestamp}</span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${
                        conversation.unread 
                          ? darkMode ? 'text-white font-medium' : 'text-gray-900 font-medium'
                          : darkMode ? 'text-[#BBBECC]' : 'text-gray-600'
                      }`}>
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-md border ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority}
                        </span>
                        {conversation.unread && (
                          <div className={`h-2 w-2 rounded-full ${
                            darkMode ? 'bg-[#2BE89A]' : 'bg-green-500'
                          }`}></div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Conversation View */}
          <div className={`flex-1 flex flex-col overflow-y-auto ${
            darkMode ? 'bg-[#0A0B0F]' : 'bg-gray-50'
          }`}>
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className={`px-6 py-4 border-b ${
                  darkMode 
                    ? 'border-[#1c1e27] bg-[#0A0B0F]'
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedConversation.customer.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={selectedConversation.customer.avatar}
                          alt={selectedConversation.customer.name}
                        />
                      ) : (
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-semibold ${
                          darkMode
                            ? 'bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {selectedConversation.customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="ml-4">
                        <h2 className={`text-lg font-semibold ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>{selectedConversation.customer.name}</h2>
                        <div className={`flex items-center space-x-3 text-sm ${
                          darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                        }`}>
                          <span className="flex items-center">
                            {getChannelIcon(selectedConversation.channel)}
                            <span className="ml-1 capitalize">{selectedConversation.channel}</span>
                          </span>
                          <span>•</span>
                          <span>{selectedConversation.status}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      <button className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'bg-[#1c1e27] text-white hover:bg-[#252833]'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}>
                        Assign
                      </button>
                      <button className={`px-4 py-2 rounded-lg transition-colors ${
                        darkMode
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}>
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'support' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-lg px-4 py-3 rounded-lg ${
                        message.sender === 'support'
                          ? darkMode
                            ? 'bg-green-500/10 text-white border border-green-500/20'
                            : 'bg-green-50 text-gray-900 border border-green-200'
                          : darkMode
                            ? 'bg-[#1c1e27] text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                        }`}>{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className={`px-6 py-4 border-t ${
                  darkMode 
                    ? 'border-[#1c1e27] bg-[#0A0B0F]'
                    : 'border-gray-200 bg-white'
                }`}>
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className={`flex-1 px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 transition ${
                        darkMode
                          ? 'bg-[#1c1e27] border-[#2a2d3a] text-white placeholder-[#BBBECC] focus:ring-[#2BE89A] focus:border-transparent'
                          : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:ring-green-500 focus:border-transparent'
                      }`}
                    />
                    <button
                      onClick={handleSendMessage}
                      className={`px-6 py-2.5 font-medium rounded-lg transition ${
                        darkMode
                          ? 'bg-green-500 text-white hover:bg-green-600'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      <PaperAirplaneIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col">
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <ChatBubbleLeftRightIcon className={`h-16 w-16 mx-auto mb-4 ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-400'
                    }`} />
                    <h3 className={`text-xl font-medium mb-2 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>Select a conversation</h3>
                    <p className={darkMode ? 'text-[#BBBECC]' : 'text-gray-600'}>
                      Choose a conversation from the list to start messaging
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Customer Info (Future Enhancement) */}
          {selectedConversation && (
            <div className={`w-80 border-l p-6 flex-shrink-0 overflow-y-auto ${
              darkMode
                ? 'bg-[#0A0B0F] border-[#1c1e27]'
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>Customer Information</h3>
              
              <div className="space-y-6">
                {/* Customer Details */}
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
                  }`}>Restaurant Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className={`text-xs ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                      }`}>Name</p>
                      <p className={`text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>{selectedConversation.customer.name}</p>
                    </div>
                    <div>
                      <p className={`text-xs ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                      }`}>Account Status</p>
                      <p className={`text-sm ${
                        darkMode ? 'text-green-400' : 'text-green-600'
                      }`}>Active</p>
                    </div>
                    <div>
                      <p className={`text-xs ${
                        darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                      }`}>Member Since</p>
                      <p className={`text-sm ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`}>Jan 15, 2024</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
                  }`}>Recent Support History</h4>
                  <div className="space-y-2">
                    <div className={`text-xs ${
                      darkMode ? 'text-[#BBBECC]' : 'text-gray-500'
                    }`}>
                      <p>• Payment issue resolved - 2 days ago</p>
                      <p>• API key regenerated - 1 week ago</p>
                      <p>• Onboarding completed - 2 weeks ago</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    darkMode ? 'text-[#BBBECC]' : 'text-gray-700'
                  }`}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className={`w-full px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode
                        ? 'bg-[#1c1e27] text-white hover:bg-[#252833]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      View Restaurant Profile
                    </button>
                    <button className={`w-full px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode
                        ? 'bg-[#1c1e27] text-white hover:bg-[#252833]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      View Payment History
                    </button>
                    <button className={`w-full px-4 py-2 rounded-lg transition-colors text-sm ${
                      darkMode
                        ? 'bg-[#1c1e27] text-white hover:bg-[#252833]'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}>
                      Check API Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}