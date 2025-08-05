import { useState } from 'react'
import Layout from '../components/Layout'
import Breadcrumb from '../components/Breadcrumb'
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
    return channel ? <channel.icon className={`h-4 w-4 ${channel.color}`} /> : null
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'open': return 'text-yellow-400'
      case 'resolved': return 'text-green-400'
      case 'pending': return 'text-gray-400'
      default: return 'text-gray-400'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Layout>
      <div className="flex" style={{ height: 'calc(100vh - 197px)' }}>
          {/* Sidebar - Channels and Conversations */}
          <div className="w-96 bg-[#0A0B0F] border-r border-[#1c1e27] flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-[#1c1e27]">
              <h1 className="text-2xl font-bold text-white mb-4">Support Center</h1>
              
              {/* Search */}
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#BBBECC]" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                />
              </div>
            </div>

            {/* Channels */}
            <div className="px-4 py-3 border-b border-[#1c1e27]">
              <div className="space-y-1">
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeChannel === channel.id
                        ? 'bg-[#2BE89A]/10 text-[#2BE89A]'
                        : 'text-[#BBBECC] hover:bg-[#1c1e27] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <channel.icon className={`h-5 w-5 mr-3 ${channel.color}`} />
                      <span className="text-sm font-medium">{channel.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      activeChannel === channel.id
                        ? 'bg-[#2BE89A]/20 text-[#2BE89A]'
                        : 'bg-[#1c1e27] text-[#BBBECC]'
                    }`}>
                      {channel.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversations List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full px-4 py-4 border-b border-[#1c1e27] hover:bg-[#1c1e27] transition-colors duration-200 ${
                    selectedConversation?.id === conversation.id ? 'bg-[#1c1e27]' : ''
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
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold">
                          {conversation.customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                    <div className="ml-3 flex-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">
                          {conversation.customer.name}
                        </p>
                        <div className="flex items-center space-x-2">
                          {getChannelIcon(conversation.channel)}
                          <span className="text-xs text-[#BBBECC]">{conversation.timestamp}</span>
                        </div>
                      </div>
                      <p className={`text-sm mt-1 ${conversation.unread ? 'text-white font-medium' : 'text-[#BBBECC]'}`}>
                        {conversation.lastMessage}
                      </p>
                      <div className="flex items-center mt-2 space-x-2">
                        <span className={`text-xs ${getStatusColor(conversation.status)}`}>
                          {conversation.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(conversation.priority)}`}>
                          {conversation.priority}
                        </span>
                        {conversation.unread && (
                          <div className="h-2 w-2 bg-[#2BE89A] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content - Conversation View */}
          <div className="flex-1 flex flex-col bg-[#0A0B0F]">
            {selectedConversation ? (
              <>
                {/* Conversation Header */}
                <div className="px-6 py-4 border-b border-[#1c1e27] bg-[#0A0B0F]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {selectedConversation.customer.avatar ? (
                        <img
                          className="h-10 w-10 rounded-full"
                          src={selectedConversation.customer.avatar}
                          alt={selectedConversation.customer.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] flex items-center justify-center text-black font-bold">
                          {selectedConversation.customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                      )}
                      <div className="ml-4">
                        <h2 className="text-lg font-semibold text-white">{selectedConversation.customer.name}</h2>
                        <div className="flex items-center space-x-3 text-sm text-[#BBBECC]">
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
                      <button className="px-4 py-2 bg-[#1c1e27] text-white rounded-lg hover:bg-[#252833] transition-colors duration-200">
                        Assign
                      </button>
                      <button className="px-4 py-2 bg-[#1c1e27] text-white rounded-lg hover:bg-[#252833] transition-colors duration-200">
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
                          ? 'bg-gradient-to-r from-[#2BE89A]/20 to-[#4FFFB0]/20 text-white border border-[#2BE89A]/30'
                          : 'bg-[#1c1e27] text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs text-[#BBBECC] mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="px-6 py-4 border-t border-[#1c1e27] bg-[#0A0B0F]">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Type your message..."
                      className="flex-1 px-4 py-3 bg-[#1c1e27] border border-[#2a2d3a] rounded-lg text-white placeholder-[#BBBECC] focus:outline-none focus:ring-2 focus:ring-[#2BE89A] focus:border-transparent"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-gradient-to-r from-[#2BE89A] to-[#4FFFB0] text-black font-medium rounded-lg hover:opacity-90 transition-opacity duration-200"
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
                    <ChatBubbleLeftRightIcon className="h-16 w-16 text-[#BBBECC] mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-white mb-2">Select a conversation</h3>
                    <p className="text-[#BBBECC]">Choose a conversation from the list to start messaging</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Customer Info (Future Enhancement) */}
          {selectedConversation && (
            <div className="w-80 bg-[#0A0B0F] border-l border-[#1c1e27] p-6">
              <h3 className="text-lg font-semibold text-white mb-6">Customer Information</h3>
              
              <div className="space-y-6">
                {/* Customer Details */}
                <div>
                  <h4 className="text-sm font-medium text-[#BBBECC] mb-2">Restaurant Details</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-[#BBBECC]">Name</p>
                      <p className="text-sm text-white">{selectedConversation.customer.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#BBBECC]">Account Status</p>
                      <p className="text-sm text-green-400">Active</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#BBBECC]">Member Since</p>
                      <p className="text-sm text-white">Jan 15, 2024</p>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h4 className="text-sm font-medium text-[#BBBECC] mb-2">Recent Support History</h4>
                  <div className="space-y-2">
                    <div className="text-xs text-[#BBBECC]">
                      <p>• Payment issue resolved - 2 days ago</p>
                      <p>• API key regenerated - 1 week ago</p>
                      <p>• Onboarding completed - 2 weeks ago</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div>
                  <h4 className="text-sm font-medium text-[#BBBECC] mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-[#1c1e27] text-white rounded-lg hover:bg-[#252833] transition-colors duration-200 text-sm">
                      View Restaurant Profile
                    </button>
                    <button className="w-full px-4 py-2 bg-[#1c1e27] text-white rounded-lg hover:bg-[#252833] transition-colors duration-200 text-sm">
                      View Payment History
                    </button>
                    <button className="w-full px-4 py-2 bg-[#1c1e27] text-white rounded-lg hover:bg-[#252833] transition-colors duration-200 text-sm">
                      Check API Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
    </Layout>
  )
}