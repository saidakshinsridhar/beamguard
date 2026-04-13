import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HardHat, Github, BookOpen, Layers } from 'lucide-react';
import ConfigPage from './pages/ConfigPage';
import AnalysisPage from './pages/AnalysisPage';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen relative overflow-hidden bg-[#050507] text-white">
                {/* Background Effects */}
                <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] bg-indigo-900/10 blur-[100px] rounded-full" />
                    <div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-sky-900/5 blur-[80px] rounded-full" />
                </div>

                <div className="relative z-10 px-6 md:px-12 py-8 max-w-[1600px] mx-auto">
                    {/* Global Navbar */}
                    <nav className="flex justify-between items-center mb-16">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="w-12 h-12 accent-gradient rounded-2xl flex items-center justify-center shadow-2xl shadow-sky-500/20 group-hover:rotate-6 transition-transform">
                                <HardHat className="text-white w-7 h-7" />
                            </div>
                            <div>
                                <div className="font-display font-black text-2xl leading-none tracking-tight">
                                    BEAMGUARD <span className="text-primary-500 italic">CORE</span>
                                </div>
                                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
                                    Structural AI Intelligence
                                </div>
                            </div>
                        </Link>

                        <div className="hidden lg:flex items-center gap-10">
                        </div>
                    </nav>

                    {/* Page Transitions */}
                    <AnimatePresence mode="wait">
                        <Routes>
                            <Route path="/" element={<ConfigPage />} />
                            <Route path="/analysis" element={<AnalysisPage />} />
                        </Routes>
                    </AnimatePresence>

                    {/* Global Footer */}
                    <footer className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500">
                        <div className="text-sm font-medium">
                            &copy; 2026 BeamGuard AI Technologies. Precision Deterministic Engine v2.1.0
                        </div>
                        <div className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms</a>
                            <a href="#" className="hover:text-white transition-colors">Safety Certifications</a>
                        </div>
                    </footer>
                </div>
            </div>
        </Router>
    );
};

export default App;
