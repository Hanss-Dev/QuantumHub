// pages/dashboard.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useStore } from '@/store';
import { 
  FiKey, 
  FiCpu, 
  FiUser, 
  FiCalendar,
  FiCopy,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiShield,
  FiMail,
  FiLogOut,
  FiBell,
  FiHome,
  FiCode,
  FiCreditCard,
  FiActivity,
  FiAward,
  FiGift,
  FiLock,
  FiUnlock,
  FiAlertCircle
} from 'react-icons/fi';
import { FaDiscord, FaCrown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { formatDistanceToNow, format } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const { user, bindKey, isLoading, refreshUser, logout } = useStore();
  const [hwid, setHwid] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const [redeemKey, setRedeemKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showBindModal, setShowBindModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState(null);
  const [notifications] = useState([
    { id: 1, message: 'Welcome to VORA Hub!', time: 'Just now', read: false }
  ]);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleBindKey = async (e) => {
    e.preventDefault();
    if (!hwid || !licenseKey) {
      toast.error('Please fill in all fields');
      return;
    }
    
    const result = await bindKey(licenseKey, hwid);
    if (result) {
      setLicenseKey('');
      setHwid('');
      setShowBindModal(false);
      handleRefresh();
      toast.success('Key bound successfully!');
    }
  };

  const handleRedeemKey = async () => {
    if (!redeemKey) {
      toast.error('Please enter a license key');
      return;
    }
    
    // Open bind modal with pre-filled key
    setLicenseKey(redeemKey);
    setShowBindModal(true);
    setRedeemKey('');
  };

  const copyScript = (key) => {
    const script = `loadstring(game:HttpGet("https://api.vora.xyz/loader/script/${key}"))()`;
    navigator.clipboard.writeText(script);
    setCopied(true);
    toast.success('Script copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadScript = (key) => {
    if (key) {
      window.open(`https://api.vora.xyz/loader/script/${key}?hwid=${hwid || 'auto'}`, '_blank');
      toast.success('Downloading script...');
    } else {
      toast.error('No active key found');
    }
  };

  const getKeyStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400';
      case 'expired': return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30 text-yellow-400';
      case 'banned': return 'bg-gradient-to-r from-red-500/20 to-rose-500/20 border-red-500/30 text-red-400';
      default: return 'bg-white/5 border-white/10 text-gray-400';
    }
  };

  const getKeyStatusIcon = (status) => {
    switch(status) {
      case 'active': return <FiCheckCircle className="text-green-400" />;
      case 'expired': return <FiClock className="text-yellow-400" />;
      case 'banned': return <FiXCircle className="text-red-400" />;
      default: return <FiAlertCircle className="text-gray-400" />;
    }
  };

  const statsCards = [
    {
      icon: FiKey,
      label: 'Total Keys',
      value: user?.keys?.length || 0,
      color: 'from-vora-purple to-vora-glow',
      bgColor: 'bg-vora-purple/20'
    },
    {
      icon: FiCheckCircle,
      label: 'Active Keys',
      value: user?.keys?.filter(k => k.status === 'active').length || 0,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-500/20'
    },
    {
      icon: FiUser,
      label: 'User ID',
      value: `#${user?.id?.slice(0, 8) || '0000'}`,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-500/20'
    },
    {
      icon: FiCalendar,
      label: 'Member Since',
      value: user?.created_at ? format(new Date(user.created_at), 'MMM dd, yyyy') : 'New',
      color: 'from-orange-400 to-pink-400',
      bgColor: 'bg-orange-500/20'
    }
  ];

  if (!user) return null;

  return (
    <>
      <AnimatedBackground />
      <Layout>
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-4">
            {/* Header with Glass Effect */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-vora-purple to-vora-glow p-[2px]">
                  <div className="w-full h-full rounded-2xl bg-vora-dark flex items-center justify-center">
                    <FiUser className="text-3xl text-vora-purple" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    Welcome back,{' '}
                    <span className="neon-text">{user.username}</span>
                  </h1>
                  <p className="text-gray-400 mt-1 flex items-center">
                    <FiShield className="mr-1 text-vora-purple" />
                    {user.role === 'admin' ? 'Administrator' : 'Premium Member'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <div className="relative">
                  <button className="glass-panel p-3 hover:bg-white/10 transition-colors">
                    <FiBell className="text-gray-300" />
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-vora-purple rounded-full text-xs flex items-center justify-center text-white animate-pulse">
                        {notifications.length}
                      </span>
                    )}
                  </button>
                </div>

                {/* Refresh Button */}
                <button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  className="glass-panel p-3 hover:bg-white/10 transition-colors"
                >
                  <FiRefreshCw className={`${refreshing ? 'animate-spin text-vora-purple' : 'text-gray-300'}`} />
                </button>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="glass-panel p-3 hover:bg-red-500/20 transition-colors text-red-400 hover:text-red-300"
                >
                  <FiLogOut />
                </button>
              </div>
            </motion.div>

            {/* Stats Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-panel p-6 relative overflow-hidden group hover:scale-105 transition-transform duration-300"
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                      <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                    <div className={`p-4 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                      <stat.icon className={`text-2xl ${
                        index === 0 ? 'text-vora-purple' :
                        index === 1 ? 'text-green-400' :
                        index === 2 ? 'text-blue-400' :
                        'text-orange-400'
                      }`} />
                    </div>
                  </div>

                  {/* Decorative Line */}
                  <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${stat.color} w-0 group-hover:w-full transition-all duration-500`} />
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Key Management */}
              <div className="lg:col-span-2 space-y-6">
                {/* Redeem Key Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-vora-purple to-vora-glow">
                      <FiGift className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Redeem License Key</h2>
                      <p className="text-sm text-gray-400">Enter your key to activate premium features</p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      value={redeemKey}
                      onChange={(e) => setRedeemKey(e.target.value)}
                      placeholder="VORA-XXXX-XXXX-XXXX"
                      className="input-field flex-1"
                    />
                    <button
                      onClick={handleRedeemKey}
                      className="btn-primary whitespace-nowrap"
                    >
                      Redeem Key
                    </button>
                  </div>
                </motion.div>

                {/* Keys List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-vora-purple/20">
                        <FiKey className="text-vora-purple text-xl" />
                      </div>
                      <h2 className="text-xl font-bold">Your Licenses</h2>
                    </div>
                    
                    <button
                      onClick={() => setShowBindModal(true)}
                      className="btn-secondary text-sm"
                    >
                      + Bind New Key
                    </button>
                  </div>

                  {user.keys && user.keys.length > 0 ? (
                    <div className="space-y-4">
                      {user.keys.map((key) => (
                        <motion.div
                          key={key.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-4 rounded-xl border ${getKeyStatusColor(key.status)} hover:shadow-lg hover:shadow-vora-purple/10 transition-all duration-300`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <code className="font-mono text-sm bg-black/30 px-3 py-1.5 rounded-lg text-vora-purple">
                                  {key.license_key}
                                </code>
                                <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                                  key.status === 'active' ? 'bg-green-500/20 text-green-400' :
                                  key.status === 'expired' ? 'bg-yellow-500/20 text-yellow-400' :
                                  'bg-red-500/20 text-red-400'
                                }`}>
                                  {getKeyStatusIcon(key.status)}
                                  <span className="capitalize">{key.status}</span>
                                </span>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <p className="text-gray-500 text-xs">HWID Status</p>
                                  <p className="font-mono mt-1 flex items-center">
                                    {key.hwid ? (
                                      <span className="text-green-400 flex items-center">
                                        <FiLock className="mr-1" size={12} />
                                        Bound
                                      </span>
                                    ) : (
                                      <span className="text-yellow-400 flex items-center">
                                        <FiUnlock className="mr-1" size={12} />
                                        Not Bound
                                      </span>
                                    )}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-500 text-xs">Created</p>
                                  <p className="mt-1 text-sm">
                                    {format(new Date(key.created_at), 'MMM dd, yyyy')}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-500 text-xs">Expires</p>
                                  <p className="mt-1 text-sm">
                                    {key.expires_at 
                                      ? format(new Date(key.expires_at), 'MMM dd, yyyy')
                                      : 'Never'}
                                  </p>
                                </div>
                                
                                <div>
                                  <p className="text-gray-500 text-xs">Last Used</p>
                                  <p className="mt-1 text-sm">
                                    {key.last_used 
                                      ? formatDistanceToNow(new Date(key.last_used)) + ' ago'
                                      : 'Never'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {key.status === 'active' && (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyScript(key.license_key)}
                                  className="p-2.5 hover:bg-vora-purple/20 rounded-lg transition-colors group"
                                  title="Copy Script"
                                >
                                  <FiCopy className="text-gray-400 group-hover:text-vora-purple transition-colors" />
                                </button>
                                <button
                                  onClick={() => downloadScript(key.license_key)}
                                  className="p-2.5 hover:bg-vora-purple/20 rounded-lg transition-colors group"
                                  title="Download Script"
                                >
                                  <FiDownload className="text-gray-400 group-hover:text-vora-purple transition-colors" />
                                </button>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-vora-purple/20 to-vora-glow/20 flex items-center justify-center">
                        <FiKey className="text-4xl text-vora-purple" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">No Keys Found</h3>
                      <p className="text-gray-400 mb-6 max-w-md mx-auto">
                        You haven't bound any keys to your account yet. Redeem a key above to get started!
                      </p>
                      <button
                        onClick={() => setShowBindModal(true)}
                        className="btn-primary"
                      >
                        Bind Your First Key
                      </button>
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Right Column - Loader Info & Profile */}
              <div className="space-y-6">
                {/* Loader Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-panel p-6 sticky top-24"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-vora-purple to-vora-glow">
                      <FiDownload className="text-white text-xl" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Loader Script</h2>
                      <p className="text-xs text-gray-400">Copy and execute in your executor</p>
                    </div>
                  </div>

                  {user.keys?.filter(k => k.status === 'active').length > 0 ? (
                    <>
                      <div className="bg-black/40 rounded-xl p-4 mb-4 border border-vora-purple/20">
                        <p className="text-xs text-gray-400 mb-2">Your loader script:</p>
                        <code className="text-green-400 font-mono text-xs break-all block">
                          loadstring(game:HttpGet("https://api.vora.xyz/loader/script/{user.keys.find(k => k.status === 'active').license_key}"))()
                        </code>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => copyScript(user.keys.find(k => k.status === 'active').license_key)}
                          className="btn-secondary py-3 flex items-center justify-center gap-2"
                        >
                          <FiCopy />
                          <span>{copied ? 'Copied!' : 'Copy'}</span>
                        </button>
                        
                        <button
                          onClick={() => downloadScript(user.keys.find(k => k.status === 'active').license_key)}
                          className="btn-primary py-3 flex items-center justify-center gap-2"
                        >
                          <FiDownload />
                          <span>Download</span>
                        </button>
                      </div>

                      <div className="mt-6 pt-4 border-t border-white/10">
                        <h4 className="text-sm font-medium flex items-center gap-2 text-vora-purple mb-2">
                          <FiActivity />
                          Quick Instructions
                        </h4>
                        <ul className="text-xs text-gray-400 space-y-2">
                          <li className="flex items-start gap-2">
                            <span className="text-vora-purple">1.</span>
                            <span>Copy the loader script above</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-vora-purple">2.</span>
                            <span>Open your executor (Krnl, Synapse, etc.)</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-vora-purple">3.</span>
                            <span>Paste and execute the script</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-vora-purple">4.</span>
                            <span>Enter your key when prompted</span>
                          </li>
                        </ul>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                        <FiAlertCircle className="text-3xl text-yellow-400" />
                      </div>
                      <p className="text-sm text-gray-300 mb-3">No active key found</p>
                      <p className="text-xs text-gray-500 mb-4">
                        You need an active key to use the loader
                      </p>
                      <button
                        onClick={() => setShowBindModal(true)}
                        className="btn-secondary text-sm w-full"
                      >
                        Activate Now
                      </button>
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-white/10">
                    <a
                      href="https://discord.gg/vora"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-vora-purple hover:text-vora-glow flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaDiscord />
                      <span>Need help? Join our Discord</span>
                    </a>
                  </div>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-panel p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400">
                      <FiUser className="text-white text-xl" />
                    </div>
                    <h2 className="text-xl font-bold">Profile Info</h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Username</span>
                      <span className="font-medium flex items-center gap-2">
                        {user.username}
                        {user.role === 'admin' && (
                          <span className="px-2 py-0.5 bg-vora-purple/20 text-vora-purple text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Email</span>
                      <span className="font-medium text-sm">{user.email}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Account Type</span>
                      <span className="font-medium flex items-center gap-1">
                        {user.role === 'admin' ? 'Administrator' : 'Free'}
                        {user.role !== 'admin' && (
                          <FaCrown className="text-yellow-400 ml-1" size={14} />
                        )}
                      </span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <span className="text-gray-400 text-sm">Member Since</span>
                      <span className="font-medium">
                        {format(new Date(user.created_at), 'MMMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Bind Key Modal */}
        <AnimatePresence>
          {showBindModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowBindModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="glass-panel p-6 max-w-md w-full"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-vora-purple to-vora-glow">
                    <FiKey className="text-white text-xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Bind New Key</h2>
                    <p className="text-sm text-gray-400">Enter your license key and HWID</p>
                  </div>
                </div>

                <form onSubmit={handleBindKey} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">License Key</label>
                    <input
                      type="text"
                      value={licenseKey}
                      onChange={(e) => setLicenseKey(e.target.value)}
                      className="input-field"
                      placeholder="VORA-XXXX-XXXX-XXXX"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">HWID</label>
                    <input
                      type="text"
                      value={hwid}
                      onChange={(e) => setHwid(e.target.value)}
                      className="input-field"
                      placeholder="Enter your hardware ID"
                      required
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      Don't know your HWID? Run the get_hwid.exe tool
                    </p>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowBindModal(false)}
                      className="btn-secondary flex-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary flex-1"
                    >
                      {isLoading ? 'Binding...' : 'Bind Key'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </Layout>
    </>
  );
}