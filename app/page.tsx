'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  Brain, 
  Zap, 
  Shield, 
  Search, 
  MessageSquare, 
  Users, 
  TrendingUp,
  LogIn,
  LogOut,
  Settings,
  Plus,
  Send
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Post {
  id: string
  title: string
  content: string
  author: string
  createdAt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function HomePage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [newPostTitle, setNewPostTitle] = useState('')
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<'home' | 'chat' | 'create'>('home')

  // Load posts from localStorage on component mount
  useEffect(() => {
    const savedPosts = localStorage.getItem('ai-hub-posts')
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    }
  }, [])

  // Save posts to localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('ai-hub-posts', JSON.stringify(posts))
  }, [posts])

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error('Please fill in both title and content')
      return
    }

    if (!session?.user?.name) {
      toast.error('Please log in to create posts')
      return
    }

    setIsCreatingPost(true)
    
    try {
      const newPost: Post = {
        id: Date.now().toString(),
        title: newPostTitle.trim(),
        content: newPostContent.trim(),
        author: session.user.name,
        createdAt: new Date().toISOString()
      }

      setPosts(prev => [newPost, ...prev])
      setNewPostTitle('')
      setNewPostContent('')
      setActiveTab('home')
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return
    if (!session?.user?.name) {
      toast.error('Please log in to use AI chat')
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentMessage.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsProcessing(true)

    // Simulate AI response (in production, this would call your AI collaboration engine)
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `This is a simulated response to: "${userMessage.content}". In production, this would involve real multi-agent collaboration using Claude, GPT-4, Gemini, and Perplexity for research-enhanced responses.`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsProcessing(false)
    }, 2000)
  }

  const features = [
    {
      icon: <Search className="w-8 h-8" />,
      title: "Real-time Research",
      description: "Live data gathering and fact-checking via Perplexity integration"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Multi-Agent Intelligence",
      description: "Claude, GPT-4, and Gemini working together for superior results"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Cost Optimization",
      description: "90%+ cost reduction through intelligent API routing"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Production Ready",
      description: "Enterprise-grade system with real-time collaboration"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-effect border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Rocket className="w-8 h-8 text-ai-blue" />
                <h1 className="text-xl font-bold text-gradient">
                  AI Agent Collaboration Hub
                </h1>
              </div>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button
                onClick={() => setActiveTab('home')}
                className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                  activeTab === 'home' ? 'bg-ai-blue/10 text-ai-blue font-semibold' : 'text-ai-gray-600 hover:text-ai-blue'
                }`}
              >
                Home
              </button>
              {session && (
                <>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === 'chat' ? 'bg-ai-blue/10 text-ai-blue font-semibold' : 'text-ai-gray-600 hover:text-ai-blue'
                    }`}
                  >
                    AI Chat
                  </button>
                  <button
                    onClick={() => setActiveTab('create')}
                    className={`px-3 py-2 rounded-lg transition-all duration-300 ${
                      activeTab === 'create' ? 'bg-ai-blue/10 text-ai-blue font-semibold' : 'text-ai-gray-600 hover:text-ai-blue'
                    }`}
                  >
                    Create Post
                  </button>
                </>
              )}
            </nav>

            <div className="flex items-center space-x-4">
              {session ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-ai-blue to-ai-purple rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {session.user?.name?.[0]?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-ai-gray-700">
                      {session.user?.name}
                    </span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="btn-secondary flex items-center space-x-2 text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn()}
                  className="btn-primary flex items-center space-x-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <div className="text-center mb-12">
                <motion.h2 
                  className="text-4xl md:text-6xl font-bold text-gradient mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Welcome to the Future of AI
                </motion.h2>
                <motion.p 
                  className="text-xl text-ai-gray-600 max-w-3xl mx-auto mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Experience the power of multi-agent AI collaboration. Our platform combines
                  Claude, GPT-4, Gemini, and real-time research to deliver insights that exceed
                  any individual AI platform.
                </motion.p>
                
                {!session && (
                  <motion.button
                    onClick={() => signIn()}
                    className="btn-primary text-lg px-8 py-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Get Started
                  </motion.button>
                )}
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="feature-card text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <div className="flex justify-center mb-4 text-ai-blue">
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-ai-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-ai-gray-600 text-sm">
                      {feature.description}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Public Posts */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-ai-gray-800">
                    Latest Updates & Insights
                  </h3>
                  {session && (
                    <button
                      onClick={() => setActiveTab('create')}
                      className="btn-primary flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Post</span>
                    </button>
                  )}
                </div>

                {posts.length > 0 ? (
                  <div className="space-y-6">
                    {posts.map((post, index) => (
                      <motion.article
                        key={post.id}
                        className="card"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-semibold text-ai-gray-800">
                            {post.title}
                          </h4>
                          <span className="text-sm text-ai-gray-500">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-ai-gray-700 leading-relaxed mb-4">
                          {post.content}
                        </p>
                        <div className="text-sm text-ai-gray-500">
                          By: {post.author}
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="card text-center py-12">
                    <MessageSquare className="w-16 h-16 text-ai-gray-400 mx-auto mb-4" />
                    <h4 className="text-xl font-semibold text-ai-gray-600 mb-2">
                      No posts yet
                    </h4>
                    <p className="text-ai-gray-500 mb-6">
                      Be the first to share insights with the community!
                    </p>
                    {session && (
                      <button
                        onClick={() => setActiveTab('create')}
                        className="btn-primary"
                      >
                        Create First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && session && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              <div className="card h-[600px] flex flex-col">
                <div className="border-b border-ai-gray-200 pb-4 mb-4">
                  <h2 className="text-2xl font-bold text-ai-gray-800 flex items-center space-x-2">
                    <Brain className="w-6 h-6 text-ai-blue" />
                    <span>AI Agent Collaboration</span>
                  </h2>
                  <p className="text-ai-gray-600 mt-1">
                    Ask anything and get responses enhanced by multi-agent intelligence
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <Brain className="w-16 h-16 text-ai-gray-400 mx-auto mb-4" />
                      <p className="text-ai-gray-500">
                        Start a conversation with our AI agents!
                      </p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={message.role === 'user' ? 'user-message' : 'ai-message'}
                      >
                        <div className="font-semibold mb-2">
                          {message.role === 'user' ? 'You' : '🚀 AI Collaboration'}
                        </div>
                        <div className="whitespace-pre-wrap">{message.content}</div>
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))
                  )}
                  
                  {isProcessing && (
                    <div className="ai-message">
                      <div className="font-semibold mb-2">🚀 AI Collaboration</div>
                      <div className="typing-indicator">
                        <div className="typing-dot" style={{ animationDelay: '0ms' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '150ms' }}></div>
                        <div className="typing-dot" style={{ animationDelay: '300ms' }}></div>
                      </div>
                      <div className="text-xs opacity-70 mt-2">Agents are collaborating...</div>
                    </div>
                  )}
                </div>

                <div className="border-t border-ai-gray-200 pt-4">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                      placeholder="Ask anything for production-grade AI collaboration..."
                      className="input-field flex-1"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!currentMessage.trim() || isProcessing}
                      className="btn-primary px-4"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'create' && session && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto"
            >
              <div className="card">
                <h2 className="text-2xl font-bold text-ai-gray-800 mb-6 flex items-center space-x-2">
                  <Plus className="w-6 h-6 text-ai-blue" />
                  <span>Create New Post</span>
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-ai-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={newPostTitle}
                      onChange={(e) => setNewPostTitle(e.target.value)}
                      placeholder="Enter post title..."
                      className="input-field"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-ai-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Write your content here. This will be visible to all visitors..."
                      rows={8}
                      className="input-field resize-none"
                    />
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={handleCreatePost}
                      disabled={isCreatingPost || !newPostTitle.trim() || !newPostContent.trim()}
                      className="btn-primary flex-1"
                    >
                      {isCreatingPost ? 'Publishing...' : 'Publish Post'}
                    </button>
                    <button
                      onClick={() => setActiveTab('home')}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}