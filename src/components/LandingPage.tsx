import { motion } from 'motion/react';
import { ArrowRight, Bot, Check, ChevronRight, Cpu, Globe, LayoutDashboard, Shield, Users, Zap } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
}

export default function LandingPage({ onEnterApp }: LandingPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-bg/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-neon-cyan rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5 text-black" />
            </div>
            <span className="font-bold text-xl tracking-tight">AngiDeck</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#agents" className="hover:text-white transition-colors">Agents</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>
          <button
            onClick={onEnterApp}
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            Launch App
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            SYSTEM ONLINE: 116 AGENTS ACTIVE
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            Your AI Workforce <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-purple">
              Ready to Deploy
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Hire specialized AI agents for marketing, engineering, and operations. 
            Build your dream team instantly and watch them work 24/7.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 bg-neon-cyan text-black font-bold rounded-xl hover:bg-neon-cyan/90 transition-colors flex items-center justify-center gap-2"
            >
              Hire Your Team <ArrowRight className="w-5 h-5" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors">
              View Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-2xl border border-white/10 bg-card-bg overflow-hidden shadow-2xl shadow-neon-cyan/10"
          >
            <div className="h-8 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-1 space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600" />
                  <div>
                    <div className="font-bold">Sarah</div>
                    <div className="text-xs text-gray-400">Marketing Lead</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
                    Drafting Q3 campaign strategy...
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm">
                    Analyzing competitor ads...
                  </div>
                </div>
              </div>
              <div className="col-span-2 bg-black/50 rounded-xl border border-white/10 p-6 font-mono text-sm text-gray-300">
                <div className="flex items-center gap-2 text-neon-green mb-4">
                  <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
                  LIVE ACTIVITY
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>[10:42:01] Sarah initiated task: Content Calendar</span>
                    <span className="text-gray-600">ID: #8821</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[10:42:05] Marcus analyzing budget constraints</span>
                    <span className="text-gray-600">ID: #8822</span>
                  </div>
                  <div className="flex justify-between">
                    <span>[10:42:12] Luna generating image assets</span>
                    <span className="text-gray-600">ID: #8823</span>
                  </div>
                  <div className="flex justify-between text-neon-cyan">
                    <span>[10:42:15] Task completed: Q3 Strategy Draft</span>
                    <span className="text-gray-600">SUCCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Mission Control</h2>
            <p className="text-gray-400">Everything you need to manage your autonomous workforce.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Specialized Agents", desc: "100+ pre-trained agents for every role." },
              { icon: Zap, title: "Instant Deployment", desc: "Spin up a full team in seconds." },
              { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption and privacy." },
              { icon: LayoutDashboard, title: "Unified Dashboard", desc: "Manage all workflows in one place." },
              { icon: Globe, title: "Global Context", desc: "Agents understand your business context." },
              { icon: Cpu, title: "Auto-Scaling", desc: "Resources scale with your workload." },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-xl bg-card-bg border border-white/10 hover:border-neon-cyan/50 transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-4 group-hover:bg-neon-cyan/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-gray-300 group-hover:text-neon-cyan" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-gray-400">Start small and scale as you grow.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Starter", price: "$49", agents: "3 Agents", features: ["2,000 Messages", "Email Support", "Basic Memory"] },
              { name: "Pro", price: "$149", agents: "7 Agents", features: ["10,000 Messages", "Priority Support", "Unlimited Memory", "Voice Chat"], popular: true },
              { name: "Enterprise", price: "Custom", agents: "Unlimited", features: ["Unlimited Messages", "Dedicated Manager", "Custom API", "SSO"] },
            ].map((plan, i) => (
              <div key={i} className={`relative p-8 rounded-2xl border ${plan.popular ? 'border-neon-cyan bg-white/5' : 'border-white/10 bg-card-bg'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-neon-cyan text-black text-xs font-bold rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm font-normal text-gray-400">/mo</span></div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 text-neon-green" />
                    <span>{plan.agents}</span>
                  </div>
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-neon-green" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={onEnterApp}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    plan.popular 
                      ? 'bg-neon-cyan text-black hover:bg-neon-cyan/90' 
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Bot className="w-6 h-6 text-neon-cyan" />
            <span className="font-bold text-lg">AngiDeck</span>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 AngiDeck Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
