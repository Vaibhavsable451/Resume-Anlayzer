import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, Sparkles, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      login(response.data);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-morphism p-10 rounded-3xl border-white/10 shadow-2xl space-y-8"
      >
        <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
                <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold font-outfit">Welcome <span className="text-primary">Back</span></h1>
            <p className="text-foreground/60">Log in to your account to continue analysis</p>
        </div>

        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm text-center">
                {error}
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Email Address</label>
            <div className="relative group">
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

          <div className="space-y-2">
            <label className="text-sm font-semibold opacity-60 ml-1">Password</label>
            <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/30 group-focus-within:text-primary transition-colors" />
                <input 
                    type="password" 
                    required 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-foreground/20"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Log In</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="text-center text-foreground/60">
            Don't have an account? {' '}
            <Link to="/register" className="text-primary font-bold hover:underline">Sign up for free</Link>
        </p>

        <div className="pt-4 flex justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 rounded-full text-[10px] font-bold text-primary tracking-widest uppercase border border-primary/10">
                <Sparkles className="w-3 h-3" />
                <span>Premium Access Interface</span>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
