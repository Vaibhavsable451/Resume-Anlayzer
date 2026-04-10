import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { email, password, fullName });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-morphism p-10 rounded-3xl border-white/10 shadow-2xl space-y-8 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-12 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        
        <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                <UserPlus className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-outfit">Create <span className="text-gradient">Account</span></h1>
            <p className="text-foreground/60">Join the next generation of AI job matching</p>
        </div>

        {error && (
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                {error}
            </motion.div>
        )}

        {success && (
            <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-sm text-center">
                Success! Redirecting to login...
            </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div className="space-y-2 group">
            <label className="text-sm font-semibold opacity-60 ml-1">Full Name</label>
            <div className="relative group-within:scale-[1.02] transition-transform">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                <input 
                    type="text" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
            <div className="relative group-within:scale-[1.02] transition-transform">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                <input 
                    type="email" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
          </div>

          <div className="space-y-2 group">
            <label className="text-sm font-semibold opacity-60 ml-1">Password</label>
            <div className="relative group-within:scale-[1.02] transition-transform">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                <input 
                    type="password" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    placeholder="minimum 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-primary to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-foreground/60 relative z-10">
            Already have an account? {' '}
            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
        </p>

        <div className="pt-4 flex justify-center relative z-10">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full text-[10px] font-bold text-primary tracking-widest uppercase border border-primary/10">
                <Sparkles className="w-3 h-3" />
                <span>Next-Gen Career Optimization</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
