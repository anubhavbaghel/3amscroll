import React, { useState, useEffect } from 'react';
import {
  Moon, Zap, Coffee, Ghost, Search, Menu, ChevronRight,
  Share2, Bookmark, Clock, Flame, ArrowDown, Eye, MessageSquare
} from 'lucide-react';
import { supabase } from './lib/supabaseClient';

const App = () => {
  const [scrolled, setScrolled] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data State
  const [featuredPost, setFeaturedPost] = useState(null);
  const [midnightSnacks, setMidnightSnacks] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState(3421); // Default/Fallback
  const [loading, setLoading] = useState(true);

  // Initial Hardcoded Data (Fallback)
  const fallbackFeatured = {
    title: "The Architecture of Abandoned Digital Worlds",
    excerpt: "We spent 48 hours exploring the servers of a forgotten 1999 MMO. What we found wasn't just data—it was a ghost town of digital memories and the structural debris of a lost society.",
    category: "The Rabbit Hole",
    time: "18 min read",
    author: "Elena Void",
    image: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1200",
    slug: '#'
  };

  const fallbackSnacks = [
    { title: "The 'Dark Forest' theory of the internet is finally here", time: "2 min", cat: "Culture" },
    { title: "Is 'Antigravity' by Google the next evolution in UI development?", time: "4 min", cat: "Tech" },
    { title: "Why your brain loves lo-fi beats at 2AM", time: "2 min", cat: "Brain Fog" },
    { title: "The 2004 lost media trend that just resurfaced", time: "5 min", cat: "Mystery" }
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    window.addEventListener('scroll', handleScroll);

    if (supabase) {
      fetchContent();
      subscribeToRealtime();
    } else {
      setLoading(false);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
      if (supabase) supabase.removeAllChannels();
    };
  }, []);

  const fetchContent = async () => {
    if (!supabase) return;
    try {
      setLoading(true);
      // Fetch Featured Post (The Rabbit Hole)
      const { data: featuredData, error: featuredError } = await supabase
        .from('posts')
        .select('*')
        .eq('category', 'The Rabbit Hole')
        .limit(1)
        .single();

      if (featuredData) {
        setFeaturedPost({
          ...featuredData,
          time: featuredData.reading_time || '10 min',
          image: featuredData.image_url
        });
      } else {
        setFeaturedPost(fallbackFeatured);
      }

      // Fetch Recent Posts for Midnight Snacks (excluding the featured one if possible, simplified here)
      const { data: snackData, error: snackError } = await supabase
        .from('posts')
        .select('*')
        .neq('category', 'The Rabbit Hole') // varied content
        .limit(4);

      if (snackData && snackData.length > 0) {
        setMidnightSnacks(snackData.map(p => ({
          title: p.title,
          time: p.reading_time || '5 min',
          cat: p.category || 'General'
        })));
      } else {
        setMidnightSnacks(fallbackSnacks);
      }

    } catch (err) {
      console.warn("Supabase fetch failed (likely no keys), using fallback.", err);
      // Fallback in case of code error or connection failure
      setFeaturedPost(fallbackFeatured);
      setMidnightSnacks(fallbackSnacks);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToRealtime = () => {
    if (!supabase) return;
    // Simple channel subscription to listen for ANY database changes (just to show activity)
    // In a real app with Auth, we would use Presence for user counts.
    // Here we'll just simulate "live" updates if the DB changes.
    const channel = supabase.channel('public:posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, (payload) => {
        // Refresh content on change
        fetchContent();
        // Simulate a user count bump on activity
        setOnlineUsers(prev => prev + Math.floor(Math.random() * 5) + 1);
      })
      .subscribe();
  };


  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const categories = [
    { name: 'The Rabbit Hole', icon: <Ghost size={16} />, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'Midnight Snacks', icon: <Zap size={16} />, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'Blue Light', icon: <Coffee size={16} />, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { name: 'Brain Fog', icon: <Moon size={16} />, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  ];

  // Use state or fallback
  const heroPost = featuredPost || fallbackFeatured;
  const snacks = midnightSnacks.length > 0 ? midnightSnacks : fallbackSnacks;

  return (
    <div className="min-h-screen bg-[#050505] text-slate-200 font-sans selection:bg-purple-500/30 selection:text-purple-200 overflow-x-hidden">
      {/* Top Banner / System Clock */}
      <div className="fixed top-0 w-full z-[60] bg-purple-950/40 backdrop-blur-md border-b border-purple-500/10 h-[34px] flex items-center justify-center px-6 text-[10px] font-mono tracking-widest text-purple-400 uppercase">
        System Status: Online • Local Time: {formatTime(currentTime)} • {onlineUsers.toLocaleString()} Others are Scrolling
      </div>

      {/* Navigation */}
      <nav className={`fixed top-[34px] w-full z-50 transition-all duration-500 ${scrolled ? 'bg-[#050505]/95 backdrop-blur-2xl py-3 border-b border-white/5' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-12">
            <h1 className="text-2xl font-black tracking-tighter italic flex items-center group cursor-pointer">
              <span className="text-purple-500 group-hover:text-purple-400 transition-colors">3AM</span>
              <span className="text-white">SCROLL</span>
            </h1>
            <div className="hidden lg:flex items-center gap-8">
              {categories.map((cat) => (
                <a key={cat.name} href="#" className="text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-white transition-all flex items-center gap-2 group">
                  <span className={`${cat.color} opacity-50 group-hover:opacity-100 transition-opacity`}>{cat.icon}</span>
                  {cat.name}
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-3 group focus-within:border-purple-500/50 transition-all">
              <Search size={14} className="text-slate-500" />
              <input type="text" placeholder="Search the void..." className="bg-transparent border-none text-xs focus:outline-none w-32 focus:w-48 transition-all text-slate-300 placeholder:text-slate-600" />
            </div>
            <button className="p-2 text-slate-400 hover:text-white transition-colors lg:hidden">
              <Menu size={20} />
            </button>
            <button className="hidden sm:block px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-black tracking-tighter uppercase hover:shadow-[0_0_20px_rgba(147,51,234,0.3)] transition-all active:scale-95">
              Join the Club
            </button>
          </div>
        </div>
      </nav>

      <main className="pt-48 pb-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section: Internet Culture Deep Dive */}
        <section className="mb-24">
          <div className="relative group rounded-[2.5rem] overflow-hidden bg-black border border-white/5 min-h-[500px] flex items-center">
            <div className="absolute inset-0 z-0">
              <img
                src={heroPost.image}
                className="w-full h-full object-cover opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[2000ms] ease-out"
                alt="Digital ruins"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 p-8 md:p-16 max-w-3xl">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="px-4 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  {heroPost.category}
                </span>
                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                  <Clock size={12} /> {heroPost.time}
                </span>
              </div>

              <h2 className="text-4xl md:text-7xl font-black mb-6 leading-[1] text-white tracking-tighter">
                {heroPost.title}
              </h2>

              <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-light italic">
                "{heroPost.excerpt}"
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                <button className="group px-8 py-4 bg-white text-black rounded-full font-black text-sm uppercase tracking-tighter flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all shadow-xl shadow-black/50">
                  Start the Dive <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800 overflow-hidden flex items-center justify-center">
                        {i === 3 ? (
                          <span className="text-[10px] font-black text-purple-400">+4k</span>
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-500/50 to-indigo-600/50 animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Reading Now</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Midnight Snacks: Quick Content */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-yellow-500 mb-2">
                <Zap size={20} className="fill-current" />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Quick Bites</span>
              </div>
              <h3 className="text-4xl font-black tracking-tighter text-white">Midnight Snacks</h3>
            </div>
            <p className="text-slate-500 text-sm max-w-sm italic border-l border-white/10 pl-4">
              Low effort, high reward. A quick link before the light of dawn breaks the spell.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {snacks.map((snack, i) => (
              <div key={i} className="group relative bg-[#0D0D0D] border border-white/5 p-8 rounded-[2rem] hover:border-purple-500/50 hover:bg-[#121212] transition-all cursor-pointer">
                <div className="absolute top-6 right-8 text-white/5 group-hover:text-purple-500/10 text-5xl font-black transition-colors">0{i + 1}</div>
                <div className="text-[10px] font-black text-purple-500/80 uppercase tracking-widest mb-4">{snack.cat} • {snack.time}</div>
                <h4 className="text-xl font-bold leading-tight mb-8 text-slate-200 group-hover:text-white transition-colors">{snack.title}</h4>
                <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                  <span className="text-xs font-bold uppercase tracking-tighter text-purple-400">Read Snack</span>
                  <ArrowDown size={14} className="text-purple-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Brain Fog: Philosophical Section */}
        <section className="mb-24 py-24 border-y border-white/5 relative overflow-hidden px-4 md:px-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-indigo-400 mb-6">
                <Moon size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Philosophy</span>
              </div>
              <h3 className="text-5xl font-black tracking-tighter mb-8 leading-[0.9] text-white">Into the <br /><span className="text-indigo-400">Brain Fog.</span></h3>
              <p className="text-slate-400 text-lg leading-relaxed mb-10 font-light">
                Exploring the quiet evolution of the human mind in the digital age. We don't just use the internet; we live inside it.
              </p>
              <button className="px-8 py-3 rounded-full border border-white/10 text-white hover:border-indigo-500 hover:text-indigo-400 transition-all font-bold text-xs uppercase tracking-widest">
                Explore the Archive
              </button>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {[
                { title: "The Loneliness of the Infinite Scroll", meta: "By Sarah K. • 12k Reads", color: "hover:border-indigo-500/50" },
                { title: "Digital Minimalism is a Luxury We Can't Afford", meta: "By Mark V. • 8k Reads", color: "hover:border-purple-500/50" }
              ].map((item, i) => (
                <div key={i} className={`group bg-white/[0.02] p-8 rounded-3xl border border-white/5 ${item.color} transition-all cursor-pointer flex justify-between items-center`}>
                  <div>
                    <h4 className="text-2xl font-bold mb-2 text-slate-200 group-hover:text-white transition-colors">{item.title}</h4>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{item.meta}</span>
                  </div>
                  <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <ChevronRight size={20} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer Loop: One More Link */}
        <section className="text-center pt-24">
          <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-purple-500 mb-8">Wait—before you go.</h4>
          <div className="max-w-xl mx-auto">
            <h5 className="text-3xl font-black tracking-tighter mb-4 text-white">One more link for the road.</h5>
            <p className="text-slate-500 mb-12 italic text-sm">"Because sleep is just a concept."</p>

            <div className="bg-[#0A0A0A] p-10 rounded-[2.5rem] border-2 border-dashed border-white/10 group cursor-pointer hover:border-purple-500 hover:bg-[#0F0F0F] transition-all relative overflow-hidden">
              <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4 block">Recommended for You</span>
              <h6 className="text-2xl font-bold mb-2 text-slate-200 group-hover:text-purple-400 transition-colors px-4">The Unsolved Mystery of 'Cicada 3301' — Ten Years Later.</h6>
              <div className="flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-600 mt-8">
                <span className="flex items-center gap-1.5"><Eye size={14} /> 2.4k live</span>
                <span className="flex items-center gap-1.5"><MessageSquare size={14} /> 48 notes</span>
              </div>
            </div>

            <button className="mt-12 group flex items-center gap-2 mx-auto text-slate-600 hover:text-white transition-colors uppercase text-[10px] font-black tracking-[0.3em]">
              Close the tab <ChevronRight size={14} className="opacity-50 group-hover:translate-x-1 transition-all" />
            </button>
          </div>
        </section>
      </main>

      <footer className="py-20 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-black tracking-tighter italic mb-4">
              <span className="text-purple-500">3AM</span>
              <span className="text-white">SCROLL</span>
            </h1>
            <p className="text-slate-500 max-w-sm text-sm mb-8 leading-relaxed">
              Curating the digital void for the sleepless and the curious. We hunt the rabbit holes so you don't have to wander alone.
            </p>
            <div className="flex gap-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all cursor-pointer flex items-center justify-center text-slate-500 hover:text-purple-400 font-mono text-xs">0{i}</div>)}
            </div>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">The Archives</h6>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-purple-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div> The Rabbit Hole</li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-yellow-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div> Midnight Snacks</li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-cyan-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div> Blue Light</li>
              <li className="hover:text-white cursor-pointer transition-colors flex items-center gap-2 group"><div className="w-1 h-1 bg-indigo-500 rounded-full scale-0 group-hover:scale-100 transition-transform"></div> Brain Fog</li>
            </ul>
          </div>
          <div>
            <h6 className="text-[10px] font-black uppercase tracking-[0.3em] text-white mb-8">Legal & Dev</h6>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</li>
              <li className="hover:text-white cursor-pointer transition-colors">Terms of Service</li>
              <li className="hover:text-white cursor-pointer transition-colors">Bug Bounty</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Node</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[9px] font-mono text-slate-700 uppercase tracking-[0.3em]">
          <span>Build: 2.0.4-Delta-Scroll</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> All Systems Operational</span>
          <span>© 2026 3AMScroll.Digital</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
