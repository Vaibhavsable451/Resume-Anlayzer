import { Terminal, Github, Linkedin, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-white/5 bg-[#030711]/50 backdrop-blur-xl py-12 px-6">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                {/* Brand Side */}
                <div className="flex items-center gap-4 group">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-all shadow-lg shadow-primary/5">
                        <Cpu className="text-primary w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                        <h4 className="font-black font-outfit text-sm uppercase tracking-widest">AI Resume <span className="text-primary">Analyzer</span></h4>
                        <p className="text-[10px] text-foreground/30 font-bold uppercase tracking-[0.3em]">Next-Gen Career Optimization</p>
                    </div>
                </div>

                {/* Creator Side */}
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-foreground/40 text-sm font-medium">
                        <span>Created with</span>
                        <motion.span 
                            animate={{ scale: [1, 1.2, 1] }} 
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-primary text-xs"
                        >
                            ❤️
                        </motion.span>
                        <span>by</span>
                        <span className="text-white font-black hover:text-primary transition-colors cursor-default underline decoration-primary/30 underline-offset-4">Vaibhav Sable</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                        <Terminal className="w-3 h-3 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Software Engineer</span>
                    </div>
                </div>

                {/* Social Side */}
                <div className="flex items-center gap-6 text-foreground/40">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-primary hover:border-primary/30 transition-all hover:scale-110 active:scale-95"><Github className="w-4 h-4" /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-3 bg-white/5 rounded-xl border border-white/10 hover:text-primary hover:border-primary/30 transition-all hover:scale-110 active:scale-95"><Linkedin className="w-4 h-4" /></a>
                </div>
            </div>
            
            <div className="text-center mt-12 text-[9px] font-bold text-foreground/[0.05] uppercase tracking-[0.5em] select-none">
                &copy; 2026 ResuPro AI Systems &bull; Built for the Future of Recruitment
            </div>
        </footer>
    );
};

export default Footer;
