import React, { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area, BarChart, Bar, Cell
} from 'recharts';
import {
    ArrowLeft, ShieldCheck, AlertTriangle, TrendingUp, Info,
    ChevronRight, Download, Share2, Box, Activity
} from 'lucide-react';

const AnalysisPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.result;
    const inputs = location.state?.inputs;

    if (!data) {
        return (
            <div className="h-screen flex items-center justify-center">
                <button onClick={() => navigate('/')} className="px-6 py-3 bg-white/10 rounded-full">Return to Config</button>
            </div>
        );
    }

    const { result, stress, safety_factor, utilization, graph_data, reason, suggestions, material_strength } = data;

    const isSafe = result === 'SAFE';

    const statusColors = {
        'SAFE': '#10b981',
        'MEDIUM RISK': '#fbbf24',
        'HIGH RISK': '#f97316',
        'FAILURE': '#ef4444'
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header Info */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4 group"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Configuration
                    </button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-display font-bold">Analysis Report</h1>
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest ${isSafe ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                            System ID: #BG-{Math.floor(Math.random() * 9000) + 1000}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Status Column */}
                <div className="lg:col-span-8 space-y-8">

                    {/* Status Hero */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`glass-card rounded-[2.5rem] p-10 border-l-[12px] shadow-2xl relative overflow-hidden`}
                        style={{ borderLeftColor: statusColors[result] }}
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full animate-pulse`} style={{ backgroundColor: statusColors[result] }} />
                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Structural Integrity Evaluation</span>
                                </div>
                                <h2 className="text-6xl font-display font-black tracking-tight" style={{ color: statusColors[result] }}>
                                    {result}
                                </h2>
                                <p className="text-xl text-slate-300 max-w-xl leading-relaxed">
                                    {reason}
                                </p>
                            </div>

                            <div className="flex flex-col items-center justify-center p-8 bg-white/5 rounded-[2rem] border border-white/5 min-w-[200px]">
                                <div className="text-sm font-bold text-slate-500 mb-2 uppercase">Safety Factor</div>
                                <div className="text-5xl font-black mb-2" style={{ color: statusColors[result] }}>{safety_factor}</div>
                                <div className="text-[10px] text-slate-400 uppercase tracking-widest">Recommended: 1.5+</div>
                            </div>
                        </div>

                        {/* Micro Viz - Dynamic Beam Deformation */}
                        <div className="mt-8 pt-8 border-t border-white/5">
                            <h4 className="text-sm font-bold text-slate-500 uppercase mb-6 flex items-center gap-2">
                                <Box className="w-4 h-4" /> Element Simulation
                            </h4>
                            <div className="h-24 w-full bg-slate-900/50 rounded-2xl relative overflow-hidden flex items-center px-12">
                                <div className="absolute inset-0 opacity-10 flex flex-col justify-between py-4">
                                    {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-px bg-white" />)}
                                </div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{
                                        width: '100%',
                                        borderRadius: '4px',
                                        height: '8px',
                                        y: utilization > 1 ? 25 : utilization * 15 // simulate bending
                                    }}
                                    transition={{ type: 'spring', stiffness: 50, damping: 10 }}
                                    className={`relative z-10 shadow-lg ${isSafe ? 'bg-emerald-500' : 'bg-red-500 shadow-red-500/20'}`}
                                >
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                        <div className="w-px h-6 bg-white/20 mb-1" />
                                        <div className="text-[10px] font-bold text-white/50 bg-black/50 px-2 py-0.5 rounded">LOAD: {inputs.load}kN</div>
                                    </div>
                                </motion.div>
                                {/* Supports */}
                                <div className="absolute bottom-6 left-10 w-4 h-6 border-l-2 border-r-2 border-t-2 border-white/30" />
                                <div className="absolute bottom-6 right-10 w-4 h-6 border-l-2 border-r-2 border-t-2 border-white/30" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Graph Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="glass-card rounded-[2rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-primary-400" />
                                    Stress Performance Curve
                                </h3>
                                <div className="text-[10px] text-slate-500 bg-white/5 px-2 py-1 rounded">LOAD VS MPa</div>
                            </div>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={graph_data}>
                                        <defs>
                                            <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor={statusColors[result]} stopOpacity={0.3} />
                                                <stop offset="95%" stopColor={statusColors[result]} stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2e" vertical={false} />
                                        <XAxis dataKey="load" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} label={{ value: 'Load (kN)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#64748b' }} />
                                        <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                        <Tooltip
                                            contentStyle={{ background: '#17171a', border: '1px solid #2a2a2e', borderRadius: '12px', fontSize: '10px' }}
                                            itemStyle={{ color: '#fff' }}
                                        />
                                        <Area type="monotone" dataKey="stress" stroke={statusColors[result]} fillOpacity={1} fill="url(#colorStress)" strokeWidth={3} />
                                        {/* Material Limit Reference Line */}
                                        <Line type="monotone" dataKey={() => material_strength} stroke="#ef4444" strokeDasharray="5 5" dot={false} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-card rounded-[2rem] p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Activity className="w-4 h-4 text-primary-400" />
                                    Utilization Distribution
                                </h3>
                            </div>
                            <div className="h-64 bg-black/20 rounded-2xl flex items-end justify-around pb-6 px-4">
                                {graph_data.map((point, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${Math.min(100, point.utilization * 100)}%` }}
                                        className="w-8 rounded-t-lg relative group"
                                        style={{
                                            backgroundColor: point.utilization > 1 ? '#ef4444' : point.utilization > 0.8 ? '#f97316' : '#10b981',
                                            opacity: point.load === inputs.load ? 1 : 0.4
                                        }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black text-white px-2 py-1 rounded">
                                            {(point.utilization * 100).toFixed(0)}% Util
                                        </div>
                                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-500">
                                            {point.load}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                <span>Current Utilization Range</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Diagnostics */}
                <div className="lg:col-span-4 space-y-8">
                    <div className="glass-card rounded-[2.5rem] p-8">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            Diagnostics
                        </h3>
                        <div className="space-y-6">
                            <MetricRow label="Applied Stress" value={`${stress} MPa`} sub={`Material limit: ${material_strength} MPa`} />
                            <MetricRow label="Cross Section" value={`${inputs.area} cm²`} sub={`Type: ${inputs.type}`} />
                            <MetricRow label="Safety Margin" value={`${((safety_factor - 1) * 100).toFixed(1)}%`} sub="Over allowable" />

                            {data.slenderness !== null && (
                                <MetricRow
                                    label="Slenderness Ratio"
                                    value={data.slenderness}
                                    sub="Risk Threshold: 50.0"
                                    danger={data.slenderness > 50}
                                />
                            )}
                        </div>
                    </div>

                    <div className="glass-card rounded-[2.5rem] p-8 border-t-4 border-primary-500">
                        <h3 className="text-xl font-bold mb-6">Optimization Protocol</h3>
                        <div className="space-y-4">
                            {suggestions.length > 0 ? suggestions.map((s, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <ChevronRight className="w-4 h-4 mt-1 text-primary-400 shrink-0" />
                                    <span className="text-sm text-slate-300 leading-relaxed font-medium">{s}</span>
                                </div>
                            )) : (
                                <div className="p-6 bg-emerald-500/10 rounded-2xl text-center border border-emerald-500/20">
                                    <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
                                    <p className="text-sm text-emerald-400 font-bold">System Optimized</p>
                                    <p className="text-xs text-slate-500 mt-1">No geometric modifications required.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-8 bg-sky-500/10 rounded-[2.5rem] border border-sky-500/20 flex gap-4">
                        <Info className="w-6 h-6 text-sky-400 shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-sky-400 mb-1">Expert Review Recommended</h4>
                            <p className="text-xs text-sky-400/70 leading-relaxed">
                                Calculations derived from static linear elastic model. Dynamic effects like oscillation or moisture expansion are not considered in this report.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

const MetricRow = ({ label, value, sub, danger }) => (
    <div className="group">
        <div className="flex justify-between items-baseline mb-1">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            <span className={`text-lg font-black ${danger ? 'text-red-500' : 'text-white'}`}>{value}</span>
        </div>
        <div className="text-[10px] text-slate-500 font-medium">{sub}</div>
    </div>
);

export default AnalysisPage;
