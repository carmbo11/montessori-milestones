import React, { useState, useEffect } from 'react';
import {
  Users,
  Settings,
  Search,
  Plus,
  X,
  LayoutDashboard,
  FileText,
  Edit,
  Trash2,
  Save,
  Wand2,
  Palette,
  RefreshCcw,
  ShoppingBag,
  Layout,
  ExternalLink,
  CheckCircle,
  Activity,
  Layers
} from 'lucide-react';
import { Button } from './Button';
import { BlogPost, AffiliateProduct, StaffAdvice } from '../types';
import { generateMariaResponse } from '../services/groqService';
import { Logo } from './Logo';

interface CRMSystemProps {
  onClose: () => void;
  onSignOut?: () => void;
  userEmail?: string;
  posts: BlogPost[];
  products: AffiliateProduct[];
  staffAdvice: StaffAdvice[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onSaveProduct: (product: AffiliateProduct) => void;
  onDeleteProduct: (id: string) => void;
  onSaveStaffAdvice: (advice: StaffAdvice) => void;
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

export const CRMSystem: React.FC<CRMSystemProps> = ({
  onClose,
  onSignOut,
  userEmail,
  posts,
  products,
  staffAdvice,
  onSavePost,
  onDeletePost,
  onSaveProduct,
  onDeleteProduct,
  onSaveStaffAdvice
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'posts' | 'pages' | 'products' | 'appearance'>('dashboard');

  // Blog Editor State
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [currentPost, setCurrentPost] = useState<BlogPost | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  // Product Editor State
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<AffiliateProduct | null>(null);

  // Page Editor State (Staff Advice)
  const [editingStaffId, setEditingStaffId] = useState<string | null>(null);

  // Design State
  const [colors, setColors] = useState(ORIGINAL_THEME);

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
        images: ['https://picsum.photos/seed/new/800/600'],
        seoTitle: '',
        seoMetaDesc: ''
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

  const handleEditProduct = (product?: AffiliateProduct) => {
    if (product) {
      setCurrentProduct(product);
    } else {
      setCurrentProduct({
        id: Date.now().toString(),
        name: '',
        price: '',
        description: '',
        imageUrl: 'https://picsum.photos/seed/product/400/400',
        affiliateLink: '',
        badge: '',
        ageRange: ''
      });
    }
    setIsEditingProduct(true);
  };

  const handleSaveCurrentProduct = () => {
    if (currentProduct) {
      onSaveProduct(currentProduct);
      setIsEditingProduct(false);
      setCurrentProduct(null);
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

  // Helper to convert Hex to RGB channels for Tailwind CSS Vars
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
    <div className="fixed inset-0 z-[100] bg-brand-paper flex overflow-hidden animate-fade-in font-sans">
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
            icon={<FileText size={20} />}
            label="Posts"
            isActive={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
          />
          <NavItem
            icon={<Layout size={20} />}
            label="Pages"
            isActive={activeTab === 'pages'}
            onClick={() => setActiveTab('pages')}
          />
          <NavItem
            icon={<ShoppingBag size={20} />}
            label="Products"
            isActive={activeTab === 'products'}
            onClick={() => setActiveTab('products')}
          />
          <NavItem
            icon={<Palette size={20} />}
            label="Appearance"
            isActive={activeTab === 'appearance'}
            onClick={() => setActiveTab('appearance')}
          />
        </nav>

        <div className="p-4 border-t border-white/10">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-8 h-8 rounded-full bg-brand-clay/20 flex items-center justify-center text-xs font-bold text-brand-clay border border-brand-clay transition-colors duration-500">
               {userEmail ? userEmail.charAt(0).toUpperCase() : 'A'}
             </div>
             <div className="text-sm overflow-hidden">
               <p className="font-bold truncate">{userEmail || 'Admin'}</p>
               <p className="text-white/50 text-xs">Administrator</p>
             </div>
           </div>
           <button
             onClick={() => {
               if (onSignOut) {
                 onSignOut();
               }
               onClose();
             }}
             className="w-full flex items-center justify-center gap-2 text-white/60 hover:text-white transition-colors text-sm py-2"
           >
             <X size={16} /> {onSignOut ? 'Sign Out' : 'Exit Admin'}
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 transition-colors duration-500">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center gap-4">
            {(isEditingPost || isEditingProduct) && (
                <button onClick={() => { setIsEditingPost(false); setIsEditingProduct(false); }} className="text-gray-500 hover:text-brand-darkest">
                    <X size={24} />
                </button>
            )}
            <h1 className="text-xl font-bold text-gray-800 capitalize transition-colors duration-500">
                {isEditingPost ? (currentPost?.id ? 'Edit Post' : 'New Post') :
                 isEditingProduct ? (currentProduct?.id ? 'Edit Product' : 'New Product') :
                 activeTab === 'appearance' ? 'Site Design' : activeTab}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <a href="/" target="_blank" className="text-sm text-brand-clay hover:underline flex items-center gap-1">
                 View Site <ExternalLink size={14} />
             </a>
             {activeTab === 'posts' && !isEditingPost && (
                 <Button variant="primary" size="sm" onClick={() => handleEditPost()}>
                   <Plus size={16} className="mr-2" /> Add New
                 </Button>
             )}
             {activeTab === 'products' && !isEditingProduct && (
                 <Button variant="primary" size="sm" onClick={() => handleEditProduct()}>
                   <Plus size={16} className="mr-2" /> Add Product
                 </Button>
             )}
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-8">

          {/* DASHBOARD TAB */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">

              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                 <h2 className="text-2xl font-serif font-bold text-brand-darkest mb-2">Welcome to Montessori Milestones</h2>
                 <p className="text-gray-600">Here's what's happening with your site today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                 {/* At a Glance Widgets */}
                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                     <div className="bg-blue-100 text-blue-600 p-3 rounded-full"><FileText size={24} /></div>
                     <div>
                         <span className="block text-2xl font-bold text-gray-800">{posts.length}</span>
                         <span className="text-gray-500 text-sm">Posts</span>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                     <div className="bg-green-100 text-green-600 p-3 rounded-full"><ShoppingBag size={24} /></div>
                     <div>
                         <span className="block text-2xl font-bold text-gray-800">{products.length}</span>
                         <span className="text-gray-500 text-sm">Products</span>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                     <div className="bg-purple-100 text-purple-600 p-3 rounded-full"><Layout size={24} /></div>
                     <div>
                         <span className="block text-2xl font-bold text-gray-800">4</span>
                         <span className="text-gray-500 text-sm">Pages</span>
                     </div>
                 </div>
                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4">
                     <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full"><Activity size={24} /></div>
                     <div>
                         <span className="block text-2xl font-bold text-gray-800">Good</span>
                         <span className="text-gray-500 text-sm">System Status</span>
                     </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Quick Draft</h3>
                      <input className="w-full mb-3 p-2 border border-gray-200 rounded text-sm" placeholder="Title" />
                      <textarea className="w-full mb-3 p-2 border border-gray-200 rounded h-24 text-sm" placeholder="What's on your mind?"></textarea>
                      <Button variant="secondary" size="sm">Save Draft</Button>
                  </div>
                  <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                      <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Montessori News</h3>
                      <div className="text-sm text-gray-600 space-y-3">
                          <p>* New study confirms benefits of wooden toys.</p>
                          <p>* "The Absorbent Mind" celebrates 75th anniversary.</p>
                          <p>* AMI announces international conference in Rome.</p>
                      </div>
                  </div>
              </div>
            </div>
          )}

          {/* POSTS TAB */}
          {activeTab === 'posts' && !isEditingPost && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs font-bold border-b border-gray-200">
                     <tr>
                       <th className="px-6 py-4">Title</th>
                       <th className="px-6 py-4">Author</th>
                       <th className="px-6 py-4">Category</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {posts.map(post => (
                       <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-gray-900">{post.title}</td>
                         <td className="px-6 py-4 text-gray-500">{post.author}</td>
                         <td className="px-6 py-4">
                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {post.category}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-gray-500">{post.date}</td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-3">
                               <button
                                onClick={() => handleEditPost(post)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                               >
                                   <Edit size={16} /> <span className="text-xs font-bold">Edit</span>
                               </button>
                               <button
                                onClick={() => onDeletePost(post.id)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                               >
                                   <Trash2 size={16} /> <span className="text-xs font-bold">Trash</span>
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

          {/* POST EDITOR */}
          {activeTab === 'posts' && isEditingPost && currentPost && (
              <div className="flex gap-6 animate-fade-in">
                  {/* Main Editor Column */}
                  <div className="flex-1 space-y-6">
                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                           <input
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                                className="w-full p-2 text-2xl font-bold border-none focus:ring-0 placeholder-gray-300"
                                placeholder="Add Title"
                              />
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm relative">
                           <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
                               <span className="text-xs font-bold uppercase text-gray-400">Content</span>
                               <button
                                onClick={generateAIContent}
                                disabled={!currentPost.title || aiLoading}
                                className="text-xs flex items-center gap-1 text-purple-600 hover:text-purple-800 disabled:opacity-50"
                               >
                                   <Wand2 size={12} />
                                   {aiLoading ? 'Generating...' : 'AI Assist'}
                               </button>
                           </div>
                           <textarea
                                value={currentPost.content}
                                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                                className="w-full min-h-[400px] border-none focus:ring-0 text-gray-700 font-mono text-sm leading-relaxed resize-y"
                                placeholder="Start writing or type / to choose a block"
                           />
                      </div>

                      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="font-bold text-gray-800 mb-4">SEO Settings</h3>
                          <div className="space-y-4">
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">SEO Title</label>
                                  <input
                                      type="text"
                                      value={currentPost.seoTitle || ''}
                                      onChange={(e) => setCurrentPost({...currentPost, seoTitle: e.target.value})}
                                      className="w-full p-2 border border-gray-300 rounded text-sm"
                                      placeholder={currentPost.title}
                                  />
                              </div>
                              <div>
                                  <label className="block text-xs font-bold text-gray-500 mb-1">Meta Description</label>
                                  <textarea
                                      value={currentPost.seoMetaDesc || ''}
                                      onChange={(e) => setCurrentPost({...currentPost, seoMetaDesc: e.target.value})}
                                      className="w-full p-2 border border-gray-300 rounded text-sm h-20"
                                      placeholder="Summary for search engines..."
                                  />
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Sidebar Settings Column */}
                  <div className="w-80 space-y-6">
                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-wider">Publish</h3>
                          <div className="flex justify-between items-center mb-4">
                              <span className="text-sm text-gray-600">Status:</span>
                              <span className="text-sm font-bold">Draft</span>
                          </div>
                           <div className="flex justify-between items-center mb-6">
                              <span className="text-sm text-gray-600">Visibility:</span>
                              <span className="text-sm font-bold">Public</span>
                          </div>
                          <div className="flex flex-col gap-2">
                              <Button variant="primary" size="sm" onClick={handleSaveCurrentPost} className="w-full">Publish</Button>
                              <Button variant="outline" size="sm" className="w-full">Save Draft</Button>
                          </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-wider">Categories</h3>
                          <div className="space-y-2">
                              {['Philosophy', 'Environment', 'Activity', 'Review'].map(cat => (
                                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                      <input
                                        type="radio"
                                        name="category"
                                        checked={currentPost.category === cat}
                                        onChange={() => setCurrentPost({...currentPost, category: cat as any})}
                                        className="text-brand-clay focus:ring-brand-clay"
                                      />
                                      {cat}
                                  </label>
                              ))}
                          </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                          <h3 className="font-bold text-sm text-gray-700 mb-4 uppercase tracking-wider">Featured Image</h3>
                          <input
                                type="text"
                                value={currentPost.images[0]}
                                onChange={(e) => {
                                    const newImages = [...currentPost.images];
                                    newImages[0] = e.target.value;
                                    setCurrentPost({...currentPost, images: newImages});
                                }}
                                className="w-full p-2 border border-gray-300 rounded text-xs mb-2"
                                placeholder="Image URL"
                          />
                          {currentPost.images[0] && (
                              <img src={currentPost.images[0]} className="w-full h-32 object-cover rounded bg-gray-100" alt="Featured" />
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && !isEditingProduct && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-fade-in">
                  <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider text-xs font-bold border-b border-gray-200">
                     <tr>
                       <th className="px-6 py-4">Product Name</th>
                       <th className="px-6 py-4">Age Range</th>
                       <th className="px-6 py-4">Price</th>
                       <th className="px-6 py-4 text-right">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100">
                     {products.map(product => (
                       <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                         <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                             <img src={product.imageUrl} className="w-8 h-8 rounded object-cover" alt="" />
                             {product.name}
                         </td>
                         <td className="px-6 py-4 text-gray-500">{product.ageRange || '-'}</td>
                         <td className="px-6 py-4 text-gray-500">{product.price}</td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex justify-end gap-3">
                               <button
                                onClick={() => handleEditProduct(product)}
                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                               >
                                   <Edit size={16} /> <span className="text-xs font-bold">Edit</span>
                               </button>
                               <button
                                onClick={() => onDeleteProduct(product.id)}
                                className="text-red-500 hover:text-red-700 flex items-center gap-1"
                               >
                                   <Trash2 size={16} /> <span className="text-xs font-bold">Trash</span>
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

          {/* PRODUCT EDITOR */}
          {activeTab === 'products' && isEditingProduct && currentProduct && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-4xl mx-auto animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Product Name</label>
                              <input
                                  type="text"
                                  value={currentProduct.name}
                                  onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Price</label>
                              <input
                                  type="text"
                                  value={currentProduct.price}
                                  onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                          </div>
                           <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Badge (Optional)</label>
                              <input
                                  type="text"
                                  value={currentProduct.badge || ''}
                                  onChange={(e) => setCurrentProduct({...currentProduct, badge: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                  placeholder="e.g. Best Seller"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
                              <textarea
                                  value={currentProduct.description}
                                  onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm h-24"
                              />
                          </div>
                      </div>

                      <div className="space-y-4">
                           <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Affiliate Link</label>
                              <div className="flex items-center gap-2">
                                  <input
                                      type="text"
                                      value={currentProduct.affiliateLink}
                                      onChange={(e) => setCurrentProduct({...currentProduct, affiliateLink: e.target.value})}
                                      className="w-full p-2 border border-gray-300 rounded text-sm text-blue-600"
                                      placeholder="https://..."
                                  />
                                  <ExternalLink size={16} className="text-gray-400" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Age Range (for AI matching)</label>
                              <input
                                  type="text"
                                  value={currentProduct.ageRange || ''}
                                  onChange={(e) => setCurrentProduct({...currentProduct, ageRange: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm"
                                  placeholder="e.g. 13-15 months"
                              />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                              <input
                                  type="text"
                                  value={currentProduct.imageUrl}
                                  onChange={(e) => setCurrentProduct({...currentProduct, imageUrl: e.target.value})}
                                  className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
                              />
                              <img src={currentProduct.imageUrl} alt="Preview" className="w-full h-40 object-cover rounded bg-gray-50 border border-gray-200" />
                          </div>
                      </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
                      <Button variant="outline" onClick={() => setIsEditingProduct(false)}>Cancel</Button>
                      <Button variant="primary" onClick={handleSaveCurrentProduct}>Save Product</Button>
                  </div>
              </div>
          )}

          {/* PAGES TAB */}
          {activeTab === 'pages' && (
              <div className="animate-fade-in space-y-6">
                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <h2 className="font-bold text-gray-800 mb-4">Core Pages</h2>
                     <div className="space-y-2">
                         {['Home', 'Shop', 'Philosophy', 'Environment', 'Community', 'Educators'].map(page => (
                             <div key={page} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                                 <span className="font-medium text-gray-700">{page}</span>
                                 <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">Published</span>
                             </div>
                         ))}
                     </div>
                 </div>

                 <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                     <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Layers size={20} /> Section Content: "Wisdom from the Staff"</h2>
                     <p className="text-sm text-gray-500 mb-6">Manage the staff advice cards displayed on the Home and Educators page.</p>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         {staffAdvice.map(staff => (
                             <div key={staff.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative">
                                 {editingStaffId === staff.id ? (
                                     <div className="space-y-3">
                                         <input
                                            value={staff.name}
                                            onChange={(e) => onSaveStaffAdvice({...staff, name: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded text-sm font-bold"
                                         />
                                         <input
                                            value={staff.role}
                                            onChange={(e) => onSaveStaffAdvice({...staff, role: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded text-xs uppercase"
                                         />
                                         <textarea
                                            value={staff.advice}
                                            onChange={(e) => onSaveStaffAdvice({...staff, advice: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded text-sm h-24"
                                         />
                                         <div className="flex justify-end">
                                            <Button size="sm" onClick={() => setEditingStaffId(null)}>Done</Button>
                                         </div>
                                     </div>
                                 ) : (
                                     <>
                                        <h3 className="font-bold text-gray-800">{staff.name}</h3>
                                        <p className="text-xs uppercase text-brand-clay font-bold mb-2">{staff.role}</p>
                                        <p className="text-gray-600 italic text-sm">"{staff.advice}"</p>
                                        <button
                                            onClick={() => setEditingStaffId(staff.id)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600"
                                        >
                                            <Edit size={16} />
                                        </button>
                                     </>
                                 )}
                             </div>
                         ))}
                     </div>
                 </div>
              </div>
          )}

          {/* APPEARANCE TAB */}
          {activeTab === 'appearance' && (
             <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 animate-fade-in">
                 <div className="max-w-4xl mx-auto">
                     <div className="flex justify-between items-end mb-8 border-b border-gray-100 pb-4">
                        <div>
                           <h2 className="text-2xl font-serif font-bold text-gray-800">Color Palette Experimenter</h2>
                           <p className="text-gray-500 mt-2">Customize the brand colors in real-time.</p>
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
                           <div key={key} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">{key}</label>
                              <div className="flex items-center gap-3">
                                 <input
                                   type="color"
                                   value={value as string}
                                   onChange={(e) => handleColorChange(key as keyof typeof ORIGINAL_THEME, e.target.value)}
                                   className="w-10 h-10 rounded cursor-pointer border-none p-0 bg-transparent"
                                 />
                                 <div className="flex flex-col">
                                    <span className="font-mono text-sm font-bold text-gray-800 transition-colors duration-500">{(value as string).toUpperCase()}</span>
                                    <span className="text-[10px] text-gray-400">CSS var(--brand-{key})</span>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>

                     <div>
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Presets</h3>
                        <div className="flex gap-4">
                           <button
                             onClick={() => updateTheme(ORIGINAL_THEME)}
                             className="px-6 py-3 rounded-lg border border-gray-200 hover:shadow-md transition-all flex items-center gap-2 bg-white"
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
                             className="px-6 py-3 rounded-lg border border-gray-200 hover:shadow-md transition-all flex items-center gap-2 bg-white"
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
                             className="px-6 py-3 rounded-lg border border-gray-200 hover:shadow-md transition-all flex items-center gap-2 bg-white"
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

// Sub-components for Admin Panel

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
