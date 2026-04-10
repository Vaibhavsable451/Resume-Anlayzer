import { Link, useNavigate } from 'react-router-dom';
import { Cpu, History, LayoutDashboard, LogIn, UserPlus, LogOut, User, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/register');
    };

    return (
        <nav className="border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                {/* Logo Section */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all border border-primary/20 shadow-lg shadow-primary/5">
                        <Cpu className="text-primary w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black font-outfit tracking-tight">AI Resume <span className="text-primary">Analyzer</span></h1>
                        <p className="text-[9px] uppercase tracking-[0.3em] font-bold text-foreground/40">Next-Gen Career Optimization</p>
                    </div>
                </Link>

                {/* Right Side Actions */}
                <div className="flex items-center gap-8">
                    {user ? (
                        <>
                            <div className="hidden md:flex items-center gap-6">
                                <Link to="/" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    ATS Check
                                </Link>
                                <Link to="/history" className="text-sm font-bold text-foreground/60 hover:text-primary transition-colors flex items-center gap-2">
                                    <History className="w-4 h-4" />
                                    History
                                </Link>
                            </div>

                            <div className="w-px h-6 bg-white/10 hidden md:block"></div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10 group cursor-default">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:rotate-12 transition-transform">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <div className="text-left leading-none">
                                        <p className="text-sm font-black text-white">{user.name}</p>
                                        <p className="text-[10px] font-bold text-primary opacity-60 uppercase">Pro Account</p>
                                    </div>
                                </div>
                                <button 
                                  onClick={handleLogout}
                                  className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors border border-red-500/20 active:scale-95 shadow-lg shadow-red-500/5 group"
                                  title="Logout Session"
                                >
                                    <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link 
                                to="/login" 
                                className="px-6 py-2.5 text-sm font-black text-foreground/60 hover:text-primary transition-all flex items-center gap-2"
                            >
                                <LogIn className="w-4 h-4" />
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <UserPlus className="w-4 h-4" />
                                Get Started
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
