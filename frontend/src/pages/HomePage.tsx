import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Search, History, Share2, Sparkles, UserPlus, LogIn, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import AtsChecker from '../components/AtsChecker';
import FullAnalyzer from '../components/FullAnalyzer';
import { useAuth } from '../context/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const [analysisMode, setAnalysisMode] = useState<'full' | 'quick'>('full');

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 pt-10">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black font-outfit tracking-tighter leading-[0.9] pb-4"
        >
          Bridge the Gap Between <br />
          <span className="text-primary italic">Your Resume</span> and <span className="text-secondary italic">Dream Job</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-foreground/40 max-w-3xl mx-auto font-medium"
        >
          Upload your resume and paste the job description. Our AI analyzes your <span className="text-white">Cultural Fit</span>, calculates <span className="text-secondary">ATS Compatibility</span>, and identifies skill gaps in seconds.
        </motion.p>
      </section>

      {/* Main Action Section (Auth Gated) */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="max-w-6xl mx-auto px-4"
      >
        {user ? (
          <div className="space-y-12 animate-in fade-in zoom-in duration-1000">
            {/* Mode Selection */}
            <div className="flex flex-col items-center gap-6 mb-12">
               <div className="flex p-2 bg-white/5 border border-white/10 rounded-[2rem] w-fit shadow-2xl">
                 <button 
                   onClick={() => setAnalysisMode('full')}
                   className={`px-10 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${analysisMode === 'full' ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-foreground/40 hover:text-foreground'}`}
                 >
                   <Target className="w-4 h-4" />
                   Match Analyzer
                 </button>
                 <button 
                   onClick={() => setAnalysisMode('quick')}
                   className={`px-10 py-4 rounded-[1.5rem] font-black uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${analysisMode === 'quick' ? 'bg-secondary text-white shadow-lg shadow-secondary/20' : 'text-foreground/40 hover:text-foreground'}`}
                 >
                   <Zap className="w-4 h-4" />
                   Quick ATS Scan
                 </button>
               </div>
               <p className="text-sm font-medium text-foreground/40">
                 {analysisMode === 'full' ? "Perfect for specific applications - Requires Job Description" : "Perfect for general resume optimization - No JD needed"}
               </p>
            </div>

            {/* Component Render */}
            <div className="transition-all duration-700">
              {analysisMode === 'full' ? <FullAnalyzer /> : <AtsChecker />}
            </div>
          </div>
        ) : (
          <div className="relative group overflow-hidden bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/80 hover:border-primary/50 transition-all duration-700 rounded-[3rem] p-16 text-center shadow-2xl backdrop-blur-xl">
             <div className="absolute top-0 right-0 p-40 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
             
             <div className="relative z-10 space-y-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto border border-primary/20 animate-pulse">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                
                <h2 className="text-4xl font-black font-outfit uppercase tracking-tighter">Ready to <span className="text-primary italic">Unlock</span> AI Power?</h2>
                <p className="text-xl text-foreground/40 max-w-2xl mx-auto font-medium">To maintain security and store your analysis history, please sign in or create an account to start scanning resumes.</p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
                  <Link to="/register" className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-2xl font-black shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg">
                    <UserPlus className="w-6 h-6" />
                    CREATE FREE ACCOUNT
                  </Link>
                  <Link to="/login" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-lg">
                    <LogIn className="w-6 h-6" />
                    MEMBER LOGIN
                  </Link>
                </div>
             </div>
          </div>
        )}
      </motion.section>

      {/* Feature Grids */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {[
          { icon: Target, title: "ATS Mastery", desc: "Optimize your resume for machine reading algorithms", color: "text-blue-400" },
          { icon: Search, title: "Keyword Extraction", desc: "Identify critical skills missing from your profile", color: "text-primary" },
          { icon: History, title: "Progress History", desc: "Track your improvement and career trajectory", color: "text-secondary" },
          { icon: Share2, title: "Smart Outreach", desc: "AI-generated pitches for your dream opportunities", color: "text-emerald-400" }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -8 }}
            className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all cursor-default flex flex-col items-center text-center space-y-4"
          >
            <div className={`p-4 rounded-2xl bg-white/5 ${feat.color}`}>
              <feat.icon className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-lg">{feat.title}</h3>
            <p className="text-foreground/40 text-sm leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
};

export default HomePage;
