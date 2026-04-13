import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, ArrowRight, Zap, Info, Database } from 'lucide-react';
import axios from 'axios';

const ConfigPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [materials, setMaterials] = useState({});
    const [formData, setFormData] = useState({
        load: 12.75,
        length: 5,
        area: 11,
        strength: 250,
        type: 'Beam',
        material: 'A36 Steel'
    });

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const res = await axios.get('/api/materials');
                setMaterials(res.data);
            } catch (err) {
                console.error("Failed to fetch materials", err);
            }
        };
        fetchMaterials();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let newValue = value;

        if (name === 'material') {
            const strength = materials[value];
            setFormData(prev => ({
                ...prev,
                material: value,
                strength: strength || prev.strength
            }));
            return;
        }

        setFormData(prev => ({
            ...prev,
            [name]: name === 'type' ? value : parseFloat(value) || 0
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('/api/predict', formData);
            navigate('/analysis', { state: { result: response.data, inputs: formData } });
        } catch (err) {
            alert("Analysis Engine failed to respond. Please ensure the backend is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
        >
            <div className="text-center mb-12">
                <h1 className="text-5xl font-display font-bold gradient-text mb-4">Initialize Analysis</h1>
                <p className="text-slate-400 text-lg">Cross-reference material properties with structural loads.</p>
            </div>

            <div className="glass-card rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Database className="w-32 h-32" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left side */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="w-3 h-3" /> Structual Category
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl text-base font-medium"
                                >
                                    <option value="Beam">Horizontal Beam Element</option>
                                    <option value="Column">Vertical Column Element</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Load Magnitude (kN)</label>
                                <div className="relative">
                                    <input
                                        name="load"
                                        type="number"
                                        step="any"
                                        value={formData.load}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl text-base"
                                        placeholder="Enter load..."
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">kN</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Length (m)</label>
                                    <input
                                        name="length"
                                        type="number"
                                        step="any"
                                        value={formData.length}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl text-base"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Area (cm²)</label>
                                    <input
                                        name="area"
                                        type="number"
                                        step="any"
                                        value={formData.area}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 rounded-2xl text-base"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Right side */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Material Preset</label>
                                <select
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    className="w-full px-5 py-4 rounded-2xl text-base font-medium border-primary-500/30"
                                >
                                    {Object.keys(materials).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Yield Strength (MPa)</label>
                                <div className="relative">
                                    <input
                                        name="strength"
                                        type="number"
                                        value={formData.strength}
                                        onChange={handleInputChange}
                                        disabled={formData.material !== 'Custom'}
                                        className={`w-full px-5 py-4 rounded-2xl text-base ${formData.material !== 'Custom' ? 'opacity-60 cursor-not-allowed' : ''}`}
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-bold">MPa</span>
                                </div>
                            </div>

                            <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-3">
                                <div className="flex items-center gap-2 text-primary-400 font-semibold text-sm">
                                    <Info className="w-4 h-4" />
                                    Design Intelligence
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed">
                                    The selected material properties will be used to determine the permissible stress limits. For custom alloys, select 'Custom' and enter specific yield data.
                                </p>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 accent-gradient rounded-[1.5rem] font-bold text-xl text-white shadow-2xl flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                    >
                        {loading ? "Crunching Physics..." : "Launch Real-Time Analysis"}
                        <ArrowRight className="w-6 h-6" />
                    </button>
                </form>
            </div>
        </motion.div>
    );
};

export default ConfigPage;
