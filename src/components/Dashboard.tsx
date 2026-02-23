import { useState } from 'react';
import { 
  Bot, 
  LayoutDashboard, 
  MessageSquare, 
  Settings, 
  Users, 
  Zap, 
  Search, 
  Bell, 
  Plus, 
  MoreVertical,
  Send,
  CheckCircle2,
  Clock,
  PlayCircle,
  Loader2,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { chatWithAgent } from '../geminiService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  onLogout: () => void;
}

// Mock Data
const INITIAL_AGENTS = [
  { id: 1, name: 'Sarah', role: 'Marketing Lead', status: 'active', avatar: 'bg-gradient-to-br from-pink-500 to-rose-500' },
  { id: 2, name: 'Marcus', role: 'Financial Analyst', status: 'idle', avatar: 'bg-gradient-to-br from-blue-500 to-cyan-500' },
  { id: 3, name: 'Luna', role: 'Creative Director', status: 'active', avatar: 'bg-gradient-to-br from-purple-500 to-indigo-500' },
  { id: 4, name: 'Derek', role: 'Operations Manager', status: 'offline', avatar: 'bg-gradient-to-br from-orange-500 to-amber-500' },
];

const TASKS = [
  { id: 101, title: 'Q3 Marketing Strategy', agent: 'Sarah', status: 'In Progress', priority: 'High' },
  { id: 102, title: 'Competitor Analysis', agent: 'Sarah', status: 'Completed', priority: 'Medium' },
  { id: 103, title: 'Budget Forecast 2025', agent: 'Marcus', status: 'Pending', priority: 'High' },
  { id: 104, title: 'Logo Redesign', agent: 'Luna', status: 'In Progress', priority: 'Low' },
];

const CHART_DATA = [
  { name: 'Mon', tasks: 12, messages: 140 },
  { name: 'Tue', tasks: 19, messages: 210 },
  { name: 'Wed', tasks: 15, messages: 180 },
  { name: 'Thu', tasks: 22, messages: 240 },
  { name: 'Fri', tasks: 28, messages: 310 },
  { name: 'Sat', tasks: 14, messages: 120 },
  { name: 'Sun', tasks: 8, messages: 90 },
];

interface Message {
  id: number;
  sender: 'user' | 'agent';
  text: string;
  time: string;
}

const INITIAL_MESSAGES: Record<string, Message[]> = {
  Sarah: [
    { id: 1, sender: 'agent', text: 'Hello! I am Sarah, your Marketing Lead. How can I help you today?', time: '10:00 AM' }
  ],
  Marcus: [
    { id: 1, sender: 'agent', text: 'Greetings. Marcus here. Ready to crunch some numbers?', time: '10:00 AM' }
  ],
  Luna: [
    { id: 1, sender: 'agent', text: 'Hi there! Ready to create something beautiful?', time: '10:00 AM' }
  ],
  Derek: [
    { id: 1, sender: 'agent', text: 'Derek online. What needs to be optimized?', time: '10:00 AM' }
  ]
};

export default function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'chat' | 'agents'>('overview');
  const [agents, setAgents] = useState(INITIAL_AGENTS);
  const [selectedAgent, setSelectedAgent] = useState(INITIAL_AGENTS[0]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistories, setChatHistories] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('');

  const currentChat = chatHistories[selectedAgent.name] || [];

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return;
    
    const userMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    // Update UI immediately
    setChatHistories(prev => ({
      ...prev,
      [selectedAgent.name]: [...(prev[selectedAgent.name] || []), userMsg]
    }));
    setInputMessage('');
    setIsTyping(true);

    try {
      // Prepare history for Gemini
      const history = currentChat.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model' as const,
        parts: [{ text: msg.text }]
      }));

      const responseText = await chatWithAgent(selectedAgent.name, userMsg.text, history);

      const agentMsg: Message = {
        id: Date.now() + 1,
        sender: 'agent',
        text: responseText || "I'm not sure how to respond to that.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatHistories(prev => ({
        ...prev,
        [selectedAgent.name]: [...(prev[selectedAgent.name] || []), agentMsg]
      }));
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleHireAgent = () => {
    if (!newAgentName || !newAgentRole) return;
    
    const newAgent = {
      id: Date.now(),
      name: newAgentName,
      role: newAgentRole,
      status: 'active',
      avatar: `bg-gradient-to-br from-${['red', 'green', 'blue', 'yellow', 'purple'][Math.floor(Math.random() * 5)]}-500 to-${['red', 'green', 'blue', 'yellow', 'purple'][Math.floor(Math.random() * 5)]}-500`
    };
    
    setAgents([...agents, newAgent]);
    setChatHistories(prev => ({
      ...prev,
      [newAgentName]: [{ id: 1, sender: 'agent', text: `Hello! I'm ${newAgentName}, your new ${newAgentRole}. Ready to work!`, time: 'Now' }]
    }));
    setShowHireModal(false);
    setNewAgentName('');
    setNewAgentRole('');
  };

  return (
    <div className="flex h-screen bg-dark-bg text-white overflow-hidden relative">
      {/* Hire Agent Modal */}
      <AnimatePresence>
        {showHireModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card-bg border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl shadow-neon-cyan/20"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">Hire New Agent</h3>
                <button onClick={() => setShowHireModal(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Agent Name</label>
                  <input 
                    type="text" 
                    value={newAgentName}
                    onChange={(e) => setNewAgentName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50"
                    placeholder="e.g. Alex"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Role</label>
                  <input 
                    type="text" 
                    value={newAgentRole}
                    onChange={(e) => setNewAgentRole(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50"
                    placeholder="e.g. Data Scientist"
                  />
                </div>
              </div>
              
              <button 
                onClick={handleHireAgent}
                disabled={!newAgentName || !newAgentRole}
                className="w-full py-3 bg-neon-cyan text-black font-bold rounded-xl hover:bg-neon-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deploy Agent
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-card-bg flex flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3 border-b border-white/10">
          <div className="w-8 h-8 bg-neon-cyan rounded-lg flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <span className="font-bold text-lg tracking-tight">AngiDeck</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'chat' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Chat
          </button>
          <button 
            onClick={() => setActiveTab('agents')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'agents' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
          >
            <Users className="w-5 h-5" />
            My Agents
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors">
            <Zap className="w-5 h-5" />
            Workflows
          </button>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-white/10 bg-card-bg/50 backdrop-blur-sm flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
             <div className="md:hidden w-8 h-8 bg-neon-cyan rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
             </div>
             <h2 className="text-xl font-semibold capitalize hidden md:block">{activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-1.5 text-sm focus:outline-none focus:border-neon-cyan/50 w-64"
              />
            </div>
            <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-cyan rounded-full" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-600 overflow-hidden">
              <img src="https://picsum.photos/seed/user/200" alt="User" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { label: 'Active Agents', value: agents.length.toString(), change: '+1', color: 'text-neon-cyan' },
                  { label: 'Tasks Completed', value: '128', change: '+12%', color: 'text-neon-green' },
                  { label: 'Messages Sent', value: '1,402', change: '+5%', color: 'text-neon-purple' },
                  { label: 'Efficiency Score', value: '98%', change: '+2%', color: 'text-yellow-400' },
                ].map((stat, i) => (
                  <div key={i} className="bg-card-bg border border-white/10 rounded-xl p-6">
                    <div className="text-gray-400 text-sm mb-2">{stat.label}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-3xl font-bold">{stat.value}</div>
                      <div className={`text-sm ${stat.color}`}>{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Chart */}
              <div className="bg-card-bg border border-white/10 rounded-xl p-6 h-80">
                <h3 className="font-bold text-lg mb-6">Workforce Activity</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA}>
                    <defs>
                      <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#bc13fe" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#bc13fe" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#666" tick={{fill: '#666'}} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111', borderColor: '#333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="tasks" stroke="#00f3ff" fillOpacity={1} fill="url(#colorTasks)" />
                    <Area type="monotone" dataKey="messages" stroke="#bc13fe" fillOpacity={1} fill="url(#colorMessages)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Active Tasks */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-card-bg border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Active Tasks</h3>
                    <button className="text-sm text-neon-cyan hover:underline">View All</button>
                  </div>
                  <div className="space-y-4">
                    {TASKS.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-lg ${task.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-blue-500/10 text-blue-500'}`}>
                            {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                          </div>
                          <div>
                            <div className="font-medium">{task.title}</div>
                            <div className="text-xs text-gray-400">Assigned to {task.agent}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            task.priority === 'High' ? 'bg-red-500/10 text-red-500' : 
                            task.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-500' : 
                            'bg-green-500/10 text-green-500'
                          }`}>
                            {task.priority}
                          </span>
                          <button className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Agent Status */}
                <div className="bg-card-bg border border-white/10 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg">Team Status</h3>
                    <button 
                      onClick={() => setShowHireModal(true)}
                      className="p-1 hover:bg-white/5 rounded-lg text-neon-cyan"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    {agents.map(agent => (
                      <div key={agent.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full ${agent.avatar}`} />
                          <div>
                            <div className="font-medium text-sm">{agent.name}</div>
                            <div className="text-xs text-gray-400">{agent.role}</div>
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          agent.status === 'active' ? 'bg-neon-green shadow-[0_0_8px_rgba(10,255,10,0.5)]' : 
                          agent.status === 'idle' ? 'bg-yellow-500' : 
                          'bg-gray-500'
                        }`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CHAT TAB */}
          {activeTab === 'chat' && (
            <div className="flex h-[calc(100vh-8rem)] gap-6">
              {/* Chat Sidebar */}
              <div className="w-64 flex flex-col gap-4 overflow-y-auto hidden md:flex">
                {agents.map(agent => (
                  <button 
                    key={agent.id}
                    onClick={() => setSelectedAgent(agent)}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${selectedAgent.id === agent.id ? 'bg-white/10 border border-white/10' : 'hover:bg-white/5'}`}
                  >
                    <div className={`w-10 h-10 rounded-full ${agent.avatar}`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{agent.name}</div>
                      <div className="text-xs text-gray-400 truncate">{agent.role}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Chat Window */}
              <div className="flex-1 bg-card-bg border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${selectedAgent.avatar}`} />
                    <div>
                      <div className="font-bold">{selectedAgent.name}</div>
                      <div className="text-xs text-gray-400">{selectedAgent.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {currentChat.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.sender === 'user' 
                          ? 'bg-neon-cyan text-black rounded-tr-none' 
                          : 'bg-white/10 text-white rounded-tl-none'
                      }`}>
                        <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-[10px] mt-2 opacity-60 ${msg.sender === 'user' ? 'text-black' : 'text-gray-300'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-white rounded-2xl rounded-tl-none p-4 flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm text-gray-300">{selectedAgent.name} is typing...</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 bg-white/5">
                  <div className="flex items-center gap-2">
                    <input 
                      type="text" 
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={`Message ${selectedAgent.name}...`}
                      disabled={isTyping}
                      className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-neon-cyan/50 disabled:opacity-50"
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={isTyping || !inputMessage.trim()}
                      className="p-3 bg-neon-cyan text-black rounded-xl hover:bg-neon-cyan/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AGENTS TAB */}
          {activeTab === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map(agent => (
                <div key={agent.id} className="bg-card-bg border border-white/10 rounded-xl p-6 hover:border-neon-cyan/50 transition-colors group">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${agent.avatar} shadow-lg`} />
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      agent.status === 'active' ? 'bg-green-500/10 text-green-500' : 
                      agent.status === 'idle' ? 'bg-yellow-500/10 text-yellow-500' : 
                      'bg-gray-500/10 text-gray-500'
                    }`}>
                      {agent.status}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
                  <p className="text-gray-400 text-sm mb-6">{agent.role}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tasks Completed</span>
                      <span className="font-mono">142</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Avg. Response</span>
                      <span className="font-mono">0.8s</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setSelectedAgent(agent);
                        setActiveTab('chat');
                      }}
                      className="flex-1 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      Chat
                    </button>
                    <button className="p-2 border border-white/10 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white">
                      <Settings className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Add New Agent Card */}
              <button 
                onClick={() => setShowHireModal(true)}
                className="border border-dashed border-white/20 rounded-xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-white/5 transition-colors group text-gray-500 hover:text-white"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Plus className="w-8 h-8" />
                </div>
                <div className="font-medium">Hire New Agent</div>
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
