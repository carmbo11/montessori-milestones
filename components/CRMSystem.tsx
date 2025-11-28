import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Plus, 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  LayoutDashboard, 
  PieChart,
  DollarSign,
  FileText,
  Edit,
  Trash2,
  Save,
  Wand2,
  Palette,
  RefreshCcw
} from 'lucide-react';
import { MOCK_LEADS, CAMPAIGN_STATS } from '../constants';
import { Button } from './Button';
import { BlogPost } from '../types';
import { generateMariaResponse } from '../services/groqService';
import { Logo } from './Logo';

interface CRMSystemProps {
  onClose: () => void;
  posts: BlogPost[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
}

const ORIGINAL_THEME = {
  darkest: '#2F070C',
  deep: '#410709',
  wine: '#7E1C2E',
  plum: '#8F4A91',
  clay: '#C25F30',
  cream: '#FDFBF7',
  paper: '#F2EBE5',
};

const FOREST_THEME = {
  darkest: '#1A2F0A',
  deep: '#2A4107',
  wine: '#4A7E1C',
  plum: '#8F914A',
  clay: '#C28F30',
  cream: '#F7FDF7',
  paper: '#E5F2E5',
};

const OCEAN_THEME = {
  darkest: '#071A2F',
  deep: '#072A41',
  wine: '#1C4A7E',
  plum: '#4A6891',
  clay: '#30A0C2',
  cream: '#F7FBFD',
  paper: '#E5EBF2',
};

export const CRMSystem: React.FC<CRMSystemProps> = ({ onClose, posts, onSavePost, onDeletePost }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'community' | 'campaigns' | 'blog' | 'design'>('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Blog Editor State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Design State
  const [colors, setColors] = useState(ORIGINAL_THEME);

  const filteredLeads = MOCK_LEADS.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditPost = (post?: BlogPost) => {
    if (post) {
      setCurrentPost(post);
    } else {
      // New Post
      setCurrentPost({
        id: Date.now().toString(),
        title: '',
        author: 'Elena Rossi',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        category: 'Philosophy',
        excerpt: '',
        content: '',
        images: ['https://picsum.photos/seed/new/800/600']
      });
    }
    setIsEditingPost(true);
  };

  const handleSaveCurrentPost = () => {
    if (currentPost) {
      onSavePost(currentPost);
      setIsEditingPost(false);
      setCurrentPost(null);
    }
  };

  const generateAIContent = async () => {
    if (!currentPost?.title) return;
    setAiLoading(true);
    try {
        const prompt = `Write a short, engaging blog post paragraph about "${currentPost.title}" focusing on Montessori principles. Keep it under 100 words.`;
        const content = await generateMariaResponse(prompt);
        setCurrentPost(prev => prev ? ({...prev, content: prev.content + "\n\n" + content}) : null);
    } catch (e) {
        console.error(e);
    } finally {
        setAiLoading(false);
    }
  };

  // Helper to convert Hex to RGB channels for Tailwind CSS Vars (e.g. #FFFFFF -> "255 255 255")
  const hexToRgbChannels = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `${r} ${g} ${b}`;
  };

  const updateTheme = (newColors: typeof ORIGINAL_THEME) => {
    setColors(newColors);
    Object.entries(newColors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--brand-${key}`, hexToRgbChannels(value));
    });
  };

  const handleColorChange = (key: keyof typeof ORIGINAL_THEME, value: string) => {
    const newColors = { ...colors, [key]: value };
    setColors(newColors);
    document.documentElement.style.setProperty(`--brand-${key}`, hexToRgbChannels(value));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-brand-paper flex overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <aside className="w-64 bg-brand-darkest text-white flex flex-col flex-shrink-0 shadow-2xl transition-colors duration-500">
        <div className="p-6 border-b border-white/10">
          <Logo variant="light" className="w-8 h-8" showText={true} classNameText="text-white ml-2" />
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          <NavItem 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            isActive={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <NavItem 
            icon={<Users size={20} />} 
            label="Community" 
            isActive={activeTab === 'community'} 
            onClick={() => setActiveTab('community')} 
          />
          <NavItem 
            icon={<PieChart size={20} />} 
            label="Campaigns" 
            isActive={activeTab === 'campaigns'} 
            onClick={() => setActiveTab('campaigns')} 
          />
           <NavItem 
            icon={<FileText size={20} />} 
            label="Blog" 
            isActive={activeTab === 'blog'} 
            onClick={() => setActiveTab('blog')} 
          />
          <NavItem 
            icon={<Palette size={20} />} 
            label="Design" 
            isActive={activeTab === 'design'} 
            onClick={() => setActiveTab('design')} 
          />
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-brand-clay/20 flex items-center justify-center text-xs font-bold text-brand-clay border border-brand-clay transition-colors duration-500">
               ER
             </div>
             <div className="text-sm">
               <p className="font-bold">Elena Rossi</p>
               <p className="text-white/50 text-xs">Admin</p>
             </div>
           </div>
           <button onClick={onClose} className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors text-sm py-2">
             <X size={16} /> Exit CRM
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-brand-paper transition-colors duration-500">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-brand-darkest/5 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            {isEditingPost && (
                <button onClick={() => setIsEditingPost(false)} className="text-gray-500 hover:text-brand-darkest">
                    <X size={24} />
                </button>
            )}
            <h1 className="text-2xl font-serif font-bold text-brand-darkest capitalize transition-colors duration-500">
                {isEditingPost ? (currentPost?.id ? 'Edit Post' : 'New Post') : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="hidden md:flex">
              <Settings size={16} className="mr-2" /> Settings
            </Button>
            {activeTab !== 'design' && (
              <Button variant="primary" size="sm" onClick={() => activeTab === 'blog' ? handleEditPost() : null}>
                <Plus size={16} className="mr-2" /> {activeTab === 'blog' ? 'New Post' : 'New Campaign'}
              </Button>
            )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">
          
          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="Total Revenue" 
                  value="$8,450" 
                  trend="+12%" 
                  icon={<DollarSign className="text-brand-clay" />} 
                />
                <StatCard 
                  title="Active Subscribers" 
                  value="1,245" 
                  trend="+5%" 
                  icon={<Users className="text-brand-plum" />} 
                />
                <StatCard 
                  title="Avg. Click Rate" 
                  value="14.2%" 
                  trend="-1%" 
                  negative
                  icon={<BarChart3 className="text-brand-wine" />} 
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Leads */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-darkest/5">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-serif font-bold text-brand-darkest transition-colors duration-500">Recent Joins</h3>
                    <button className="text-sm text-brand-clay hover:underline transition-colors duration-500">View All</button>
                  </div>
                  <div className="space-y-4">
                    {MOCK_LEADS.slice(0, 3).map(lead => (
                      <div key={lead.id} className="flex items-center justify-between p-3 hover:bg-brand-paper/50 rounded-lg transition-colors">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-brand-plum/10 text-brand-plum flex items-center justify-center font-bold text-xs transition-colors duration-500">
                             {lead.name.charAt(0)}
                           </div>
                           <div>
                             <p className="font-bold text-sm text-brand-darkest transition-colors duration-500">{lead.name}</p>
                             <p className="text-xs text-gray-500">{lead.source}</p>
                           </div>
                         </div>
                         <span className="text-xs text-gray-400">{lead.joinDate}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Campaign Mini View */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-darkest/5">
                  <h3 className="font-serif font-bold text-brand-darkest mb-6 transition-colors duration-500">Top Performing Campaigns</h3>
                  <div className="space-y-4">
                     {CAMPAIGN_STATS.slice(0, 3).map(camp => (
                       <div key={camp.id} className="group cursor-pointer">
                         <div className="flex justify-between text-sm mb-1">
                           <span className="font-bold text-brand-darkest transition-colors duration-500">{camp.name}</span>
                           <span className="text-brand-wine font-bold transition-colors duration-500">{camp.revenue}</span>
                         </div>
                         <div className="w-full bg-gray-100 rounded-full h-2">
                           <div 
                              className="bg-brand-clay h-2 rounded-full transition-all duration-1000 group-hover:bg-brand-plum"
                              style={{ width: `${Math.min((camp.clicks / 1500) * 100, 100)}%` }}
                           ></div>
                         </div>
                       </div>
                     ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'community' && (
            <div className="bg-white rounded-xl shadow-sm border border-brand-darkest/5 overflow-hidden animate-fade-in">
              <div className="p-4 border-b border-gray-100 flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search community members..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-plum/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="secondary" size="sm">Export CSV</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-brand-paper text-brand-darkest uppercase tracking-wider text-xs font-bold transition-colors duration-500">
                    <tr>
                      <th className="px-6 py-4">Member</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Source</th>
                      <th className="px-6 py-4">Last Action</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLeads.map(lead => (
                      <tr key={lead.id} className="hover:bg-brand-paper/30 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold text-brand-darkest transition-colors duration-500">{lead.name}</p>
                            <p className="text-gray-500 text-xs">{lead.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-6 py-4 text-gray-600">{lead.source}</td>
                        <td className="px-6 py-4 text-gray-600 italic">{lead.lastAction}</td>
                        <td className="px-6 py-4 text-gray-500">{lead.joinDate}</td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-brand-clay hover:text-brand-wine font-bold text-xs transition-colors duration-500">Manage</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CAMPAIGNS TAB */}
          {activeTab === 'campaigns' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {CAMPAIGN_STATS.map(camp => (
                 <div key={camp.id} className="bg-white rounded-xl shadow-md border border-brand-paper p-6 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-full bg-brand-clay/10 text-brand-clay flex items-center justify-center transition-colors duration-500">
                        <PieChart size={20} />
                      </div>
                      {camp.trend === 'up' ? (
                        <span className="flex items-center text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                          <ArrowUpRight size={14} className="mr-1" /> Trending
                        </span>
                      ) : (
                        <span className="flex items-center text-red-500 text-xs font-bold bg-red-50 px-2 py-1 rounded-full">
                          <ArrowDownRight size={14} className="mr-1" /> Cooling
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif font-bold text-xl text-brand-darkest mb-1 transition-colors duration-500">{camp.name}</h3>
                    <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest">Active Campaign</p>
                    
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-brand-paper/50 p-3 rounded-lg text-center transition-colors duration-500">
                        <p className="text-xs text-gray-500 mb-1">Total Clicks</p>
                        <p className="font-bold text-lg text-brand-darkest transition-colors duration-500">{camp.clicks}</p>
                      </div>
                      <div className="bg-brand-paper/50 p-3 rounded-lg text-center transition-colors duration-500">
                         <p className="text-xs text-gray-500 mb-1">Conversions</p>
                         <p className="font-bold text-lg text-brand-darkest transition-colors duration-500">{camp.conversions}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-gray-500 text-sm font-medium">Revenue</span>
                      <span className="text-2xl font-serif font-bold text-brand-wine transition-colors duration-500">{camp.revenue}</span>
                    </div>
                 </div>
              ))}
            </div>
          )}

          {/* BLOG TAB */}
          {activeTab === 'blog' && !isEditingPost && (
             <div className="bg-white rounded-xl shadow-sm border border-brand-darkest/5 overflow-hidden animate-fade-in">
               <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                   <h2 className="font-serif font-bold text-lg text-brand-darkest transition-colors duration-500">All Posts</h2>
                   <span className="text-xs text-gray-500">{posts.length} published</span>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-brand-paper text-brand-darkest uppercase tracking-wider text-xs font-bold transition-colors duration-500">
                     <tr>
                       <th className="px-6 py-4">Title</th>
                       <th className="px-6 py-4">Category</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {posts.map(post => (
                       <tr key={post.id} className="hover:bg-brand-paper/30 transition-colors">
                         <td className="px-6 py-4 font-bold text-brand-darkest transition-colors duration-500">{post.title}</td>
                         <td className="px-6 py-4">
                            <span className="bg-brand-plum/10 text-brand-plum px-2 py-1 rounded text-xs font-bold uppercase transition-colors duration-500">
                                {post.category}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500">{post.date}</td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-3">
                               <button 
                                onClick={() => handleEditPost(post)}
                                className="text-brand-clay hover:text-brand-wine flex items-center gap-1 transition-colors duration-500"
                               >
                                   <Edit size={16} /> <span className="text-xs font-bold">Edit</span>
                               </button>
                               <button 
                                onClick={() => onDeletePost(post.id)}
                                className="text-red-400 hover:text-red-600 flex items-center gap-1"
                               >
                                   <Trash2 size={16} /> <span className="text-xs font-bold">Delete</span>
                               </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
             </div>
          )}

          {/* BLOG EDITOR TAB */}
          {activeTab === 'blog' && isEditingPost && currentPost && (
              <div className="bg-white rounded-xl shadow-sm border border-brand-darkest/5 p-8 animate-fade-in max-w-4xl mx-auto">
                  <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                              <label className="block text-sm font-bold text-brand-darkest mb-2 transition-colors duration-500">Post Title</label>
                              <input 
                                type="text" 
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-plum/50 focus:border-transparent"
                                placeholder="Enter impactful title..."
                              />
                          </div>
                          <div>
                              <label className="block text-sm font-bold text-brand-darkest mb-2 transition-colors duration-500">Category</label>
                              <select 
                                value={currentPost.category}
                                // @ts-ignore - simple cast for demo
                                onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-plum/50 focus:border-transparent bg-white"
                              >
                                  <option value="Philosophy">Philosophy</option>
                                  <option value="Environment">Environment</option>
                                  <option value="Activity">Activity</option>
                                  <option value="Review">Review</option>
                              </select>
                          </div>
                      </div>

                      <div>
                           <label className="block text-sm font-bold text-brand-darkest mb-2 transition-colors duration-500">Cover Image URL</label>
                           <input 
                                type="text" 
                                value={currentPost.images[0]}
                                onChange={(e) => {
                                    const newImages = [...currentPost.images];
                                    newImages[0] = e.target.value;
                                    setCurrentPost({...currentPost, images: newImages});
                                }}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-plum/50"
                                placeholder="https://..."
                              />
                              {currentPost.images[0] && (
                                  <img src={currentPost.images[0]} alt="Preview" className="h-32 w-full object-cover mt-2 rounded-lg" />
                              )}
                      </div>

                      <div>
                           <label className="block text-sm font-bold text-brand-darkest mb-2 transition-colors duration-500">Short Excerpt</label>
                           <textarea 
                                value={currentPost.excerpt}
                                onChange={(e) => setCurrentPost({...currentPost, excerpt: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-plum/50 h-24"
                                placeholder="Summary for card view..."
                           />
                      </div>

                      <div className="relative">
                           <div className="flex justify-between items-center mb-2">
                               <label className="block text-sm font-bold text-brand-darkest transition-colors duration-500">Content (HTML Supported)</label>
                               <button 
                                onClick={generateAIContent}
                                disabled={!currentPost.title || aiLoading}
                                className="text-xs flex items-center gap-1 text-brand-plum hover:text-brand-darkest disabled:opacity-50 transition-colors duration-500"
                               >
                                   <Wand2 size={12} /> 
                                   {aiLoading ? 'Generating...' : 'Auto-Generate Content'}
                               </button>
                           </div>
                           <textarea 
                                value={currentPost.content}
                                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-plum/50 h-64 font-mono text-sm"
                                placeholder="<p>Write your article here...</p>"
                           />
                      </div>

                      <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                          <Button variant="outline" onClick={() => setIsEditingPost(false)}>Cancel</Button>
                          <Button variant="primary" onClick={handleSaveCurrentPost}>
                              <Save size={18} className="mr-2" /> Save Post
                          </Button>
                      </div>
                  </div>
              </div>
          )}

          {/* DESIGN TAB */}
          {activeTab === 'design' && (
             <div className="bg-white rounded-xl shadow-sm border border-brand-darkest/5 p-8 animate-fade-in">
                 <div className="max-w-4xl mx-auto">
                     <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div>
                           <h2 className="text-2xl font-serif font-bold text-brand-darkest transition-colors duration-500">Color Palette Experimenter</h2>
                           <p className="text-gray-500 mt-2">Customize the brand colors in real-time. Changes affect the entire site immediately.</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => updateTheme(ORIGINAL_THEME)}
                          className="flex items-center gap-2"
                        >
                          <RefreshCcw size={16} /> Reset to Original
                        </Button>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {Object.entries(colors).map(([key, value]) => (
                           <div key={key} className="bg-brand-paper/30 p-4 rounded-xl border border-gray-100">
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{key}</label>
                              <div className="flex items-center gap-3">
                                 <input 
                                   type="color" 
                                   value={value as string}
                                   onChange={(e) => handleColorChange(key as keyof typeof ORIGINAL_THEME, e.target.value)}
                                   className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent"
                                 />
                                 <div className="flex flex-col">
                                    <span className="font-mono text-sm font-bold text-brand-darkest transition-colors duration-500">{(value as string).toUpperCase()}</span>
                                    <span className="text-[10px] text-gray-400">CSS var(--brand-{key})</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div>
                        <h3 className="text-lg font-bold text-brand-darkest mb-4 transition-colors duration-500">Quick Presets</h3>
                        <div className="flex gap-4">
                           <button 
                             onClick={() => updateTheme(ORIGINAL_THEME)}
                             className="px-6 py-3 rounded-lg border border-brand-paper hover:shadow-md transition-all flex items-center gap-2 bg-white"
                           >
                             <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ background: ORIGINAL_THEME.darkest }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: ORIGINAL_THEME.wine }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: ORIGINAL_THEME.clay }}></div>
                             </div>
                             <span className="font-medium text-sm">Original</span>
                           </button>

                           <button 
                             onClick={() => updateTheme(FOREST_THEME)}
                             className="px-6 py-3 rounded-lg border border-brand-paper hover:shadow-md transition-all flex items-center gap-2 bg-white"
                           >
                             <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ background: FOREST_THEME.darkest }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: FOREST_THEME.wine }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: FOREST_THEME.clay }}></div>
                             </div>
                             <span className="font-medium text-sm">Forest Walk</span>
                           </button>

                           <button 
                             onClick={() => updateTheme(OCEAN_THEME)}
                             className="px-6 py-3 rounded-lg border border-brand-paper hover:shadow-md transition-all flex items-center gap-2 bg-white"
                           >
                             <div className="flex gap-1">
                                <div className="w-3 h-3 rounded-full" style={{ background: OCEAN_THEME.darkest }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: OCEAN_THEME.wine }}></div>
                                <div className="w-3 h-3 rounded-full" style={{ background: OCEAN_THEME.clay }}></div>
                             </div>
                             <span className="font-medium text-sm">Ocean Calm</span>
                           </button>
                        </div>
                     </div>
                 </div>
             </div>
          )}

        </div>
      </main>
    </div>
  );
};

// Sub-components for CRM

const NavItem = ({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive ? 'bg-brand-wine text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'
    }`}
  >
    {icon}
    <span className="font-medium text-sm">{label}</span>
  </button>
);

const StatCard = ({ title, value, trend, icon, negative = false }: { title: string, value: string, trend: string, icon: React.ReactNode, negative?: boolean }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-darkest/5 flex items-center justify-between transition-colors duration-500">
     <div>
       <p className="text-gray-500 text-sm mb-1">{title}</p>
       <h4 className="text-3xl font-serif font-bold text-brand-darkest transition-colors duration-500">{value}</h4>
       <span className={`text-xs font-bold flex items-center mt-2 ${negative ? 'text-red-500' : 'text-green-600'}`}>
         {negative ? <ArrowDownRight size={14} className="mr-1" /> : <ArrowUpRight size={14} className="mr-1" />}
         {trend} vs last month
       </span>
     </div>
     <div className="w-12 h-12 rounded-full bg-brand-paper flex items-center justify-center transition-colors duration-500">
       {icon}
     </div>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800',
    'Engaged': 'bg-brand-plum/20 text-brand-plum',
    'Converted': 'bg-green-100 text-green-800',
    'Cold': 'bg-gray-100 text-gray-600',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider transition-colors duration-500 ${styles[status] || styles['New']}`}>
      {status}
    </span>
  );
};