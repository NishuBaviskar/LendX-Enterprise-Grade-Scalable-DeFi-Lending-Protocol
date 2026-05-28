import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, BarChart3, Lock, Users } from 'lucide-react';

const LandingPage = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="bg-[#0a0b0d] text-white min-h-screen selection:bg-blue-500/30">
            {/* Hero Section */}
            <header className="relative overflow-hidden pt-32 pb-20 lg:pt-48">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-600/10 to-transparent blur-3xl" />
                
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-400 uppercase bg-blue-400/10 border border-blue-400/20 rounded-full">
                            The Future of Enterprise DeFi
                        </span>
                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Liquidity Without Limits. <br /> Governance Without Friction.
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-gray-400 mb-10">
                            LendX is a production-grade, multi-role lending protocol built with ZK-proof credit scoring and cross-chain atomic swaps.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-900/20 active:scale-95">
                                Launch Protocol
                            </Link>
                            <a href="#features" className="w-full sm:w-auto px-8 py-4 bg-[#16181d] hover:bg-[#1c1f26] text-white font-bold rounded-2xl border border-gray-800 transition-all">
                                Read Whitepaper
                            </a>
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Feature Grid */}
            <section id="features" className="py-24 container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <FeatureCard 
                        icon={<Zap className="text-yellow-400" />}
                        title="Flash Loans"
                        description="Access instant liquidity for arbitrage or liquidations with zero collateral required."
                    />
                    <FeatureCard 
                        icon={<Shield className="text-blue-400" />}
                        title="ZK-Credit Score"
                        description="Verify your creditworthiness using zero-knowledge proofs while maintaining total privacy."
                    />
                    <FeatureCard 
                        icon={<Globe className="text-purple-400" />}
                        title="Cross-Chain Swaps"
                        description="Seamlessly move assets between L1s and L2s using our secure atomic swap bridge."
                    />
                    <FeatureCard 
                        icon={<BarChart3 className="text-green-400" />}
                        title="Dynamic APY"
                        description="Interest rates that adjust in real-time based on protocol-wide supply and demand."
                    />
                    <FeatureCard 
                        icon={<Users className="text-pink-400" />}
                        title="DAO Governance"
                        description="Transparent on-chain voting. Every $LNDX holder has a seat at the table."
                    />
                    <FeatureCard 
                        icon={<Lock className="text-orange-400" />}
                        title="Enterprise Security"
                        description="Built with UUPS upgradeable patterns and audited smart contract logic."
                    />
                </div>
            </section>

            {/* Protocol Stats */}
            <section className="border-y border-gray-800 bg-[#0d0f14] py-16">
                <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                    <div>
                        <p className="text-gray-500 text-sm uppercase font-bold mb-1">Total Value Locked</p>
                        <h3 className="text-3xl font-mono font-bold">$1.42B</h3>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm uppercase font-bold mb-1">Active Loans</p>
                        <h3 className="text-3xl font-mono font-bold">12,840</h3>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm uppercase font-bold mb-1">DAO Proposals</p>
                        <h3 className="text-3xl font-mono font-bold">248</h3>
                    </div>
                    <div>
                        <p className="text-gray-500 text-sm uppercase font-bold mb-1">Chains Supported</p>
                        <h3 className="text-3xl font-mono font-bold">5</h3>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-gray-600 border-t border-gray-800">
                <p>© 2026 LendX Protocol. Built for Enterprise Scale.</p>
            </footer>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <motion.div 
        whileHover={{ y: -5 }}
        className="p-8 bg-[#16181d] rounded-3xl border border-gray-800 hover:border-blue-500/50 transition-all group"
    >
        <div className="w-12 h-12 bg-[#0a0b0d] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-3">{title}</h3>
        <p className="text-gray-500 leading-relaxed">
            {description}
        </p>
    </motion.div>
);

export default LandingPage;