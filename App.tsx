import React, { useState, useEffect } from 'react';
import { BLOG_POSTS, PRODUCTS, NAV_LINKS, STAFF_ADVICE, EDUCATOR_RESOURCES } from './constants';
import { Carousel } from './components/Carousel';
import { FeaturedPostCarousel } from './components/FeaturedPostCarousel';
import { ProductCard } from './components/ProductCard';
import { Button } from './components/Button';
import { MontessoriBot } from './components/MontessoriBot';
import { Hero } from './components/Hero';
import { CRMSystem } from './components/CRMSystem';
import { AdminLogin } from './components/AdminLogin';
import { Logo } from './components/Logo';
import { Menu, X, Instagram, Facebook, Mail, Heart, ArrowRight, Lock, ArrowLeft, Users, Calendar, User, Quote, HandHeart, CalendarDays, MessageCircle, BookOpen, Layout, Eye, Scissors, Download, AlertCircle, Share2 } from 'lucide-react';
import { generateBlogSummary } from './services/groqService';
import { BlogPost, AffiliateProduct, StaffAdvice } from './types';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("Loading daily inspiration...");
  const [showCRM, setShowCRM] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);

  // Auth state
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAuth();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [viewPost, setViewPost] = useState<BlogPost | null>(null);

  // CMS State Management
  const [posts, setPosts] = useState<BlogPost[]>(BLOG_POSTS);
  const [products, setProducts] = useState<AffiliateProduct[]>(PRODUCTS);
  const [staffAdvice, setStaffAdvice] = useState<StaffAdvice[]>(STAFF_ADVICE);

  useEffect(() => {
    const fetchQuote = async () => {
      const quote = await generateBlogSummary();
      setDailyQuote(quote);
    };
    fetchQuote();
  }, []);

  // Auto-open CRM when returning from magic link authentication
  useEffect(() => {
    if (!authLoading && isAdmin) {
      // Check if we just authenticated (URL contains auth tokens)
      const hash = window.location.hash;
      if (hash.includes('access_token') || hash.includes('refresh_token')) {
        setShowCRM(true);
        // Clean up the URL
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, [authLoading, isAdmin]);

  // Handle admin button click
  const handleAdminClick = () => {
    if (isAdmin) {
      setShowCRM(true);
    } else {
      setShowAdminLogin(true);
    }
  };

  // --- CMS Handlers ---

  const handleSavePost = (post: BlogPost) => {
    setPosts(prev => {
      const exists = prev.find(p => p.id === post.id);
      if (exists) {
        return prev.map(p => p.id === post.id ? post : p);
      }
      return [post, ...prev];
    });
  };

  const handleDeletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveProduct = (product: AffiliateProduct) => {
    setProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.map(p => p.id === product.id ? product : p);
      }
      return [product, ...prev];
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleSaveStaffAdvice = (advice: StaffAdvice) => {
    setStaffAdvice(prev => {
      const exists = prev.find(p => p.id === advice.id);
      if (exists) {
        return prev.map(p => p.id === advice.id ? advice : p);
      }
      return [advice, ...prev];
    });
  };

  // --- Navigation Handlers ---

  const handleNavigate = (page: string) => {
    setMobileMenuOpen(false);
    setViewPost(null);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReadPost = (post: BlogPost) => {
    setViewPost(post);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // --- VIEWS ---

  const SinglePostView = ({ post }: { post: BlogPost }) => {
    const handleShare = () => {
      if (navigator.share) {
        navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        }).catch((error) => console.log('Error sharing', error));
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    };

    return (
      <article className="pt-24 pb-24 container mx-auto px-6 animate-fade-in">
          <button
            onClick={() => setViewPost(null)}
            className="mb-8 flex items-center gap-2 text-brand-clay font-bold hover:text-brand-wine transition-colors"
          >
            <ArrowLeft size={20} /> Back to Journal
          </button>

          <div className="max-w-4xl mx-auto">
             {/* Header */}
             <div className="text-center mb-12">
                <span className="inline-block px-3 py-1 bg-brand-plum/10 text-brand-plum rounded-full text-xs font-bold uppercase tracking-widest mb-6">
                  {post.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-brand-darkest mb-6 leading-tight">
                  {post.title}
                </h1>
                <div className="flex items-center justify-center gap-6 text-gray-500 text-sm">
                   <span className="flex items-center gap-2"><User size={16} /> {post.author}</span>
                   <span className="flex items-center gap-2"><Calendar size={16} /> {post.date}</span>
                   <button onClick={handleShare} className="flex items-center gap-2 hover:text-brand-clay transition-colors" title="Share this post">
                      <Share2 size={16} /> Share
                   </button>
                </div>
             </div>

             {/* Featured Image */}
             <div className="mb-12 rounded-2xl overflow-hidden shadow-xl">
               <img src={post.images[0]} alt={post.title} className="w-full h-auto object-cover" />
             </div>

             {/* Content */}
             <div
               className="prose prose-lg prose-headings:font-serif prose-headings:text-brand-darkest prose-p:text-gray-700 prose-a:text-brand-clay max-w-none"
               dangerouslySetInnerHTML={{ __html: post.content }}
             />

             {/* Gallery if more images */}
             {post.images.length > 1 && (
               <div className="mt-16">
                 <h3 className="text-2xl font-serif font-bold mb-6">Gallery</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {post.images.slice(1).map((img, idx) => (
                     <img key={idx} src={img} alt="Gallery" className="rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300" />
                   ))}
                 </div>
               </div>
             )}
          </div>
      </article>
    );
  };

  const EducatorView = () => {
    const getIcon = (iconName: string) => {
      switch (iconName) {
        case 'BookOpen': return <BookOpen size={32} />;
        case 'Layout': return <Layout size={32} />;
        case 'Eye': return <Eye size={32} />;
        case 'Scissors': return <Scissors size={32} />;
        case 'Download': return <Download size={32} />;
        default: return <BookOpen size={32} />;
      }
    };

    return (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
         <div className="text-center mb-16 max-w-2xl mx-auto">
             <span className="text-brand-clay font-bold tracking-widest uppercase text-sm mb-4 block">Resources for the Guide</span>
             <h1 className="text-5xl md:text-6xl font-serif text-brand-darkest mb-6">Educator Portal</h1>
             <p className="text-xl text-gray-600 leading-relaxed">
               Tools, downloads, and inspiration to help you prepare the environment and serve the child.
             </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EDUCATOR_RESOURCES.map((resource) => (
               <div key={resource.id} className="bg-white p-8 rounded-2xl shadow-sm border border-brand-paper hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group">
                  {resource.comingSoon && (
                    <div className="absolute top-4 right-4 text-xs font-bold bg-gray-100 text-gray-500 px-2 py-1 rounded-full flex items-center gap-1">
                      <AlertCircle size={12} /> Coming Soon
                    </div>
                  )}
                  <div className="mb-6 text-brand-plum bg-brand-plum/10 w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    {getIcon(resource.icon)}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-brand-darkest mb-3">{resource.title}</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {resource.description}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={resource.comingSoon}
                    className={resource.comingSoon ? "opacity-50 cursor-not-allowed border-gray-200 text-gray-400 hover:bg-transparent hover:text-gray-400" : "w-full"}
                  >
                    {resource.comingSoon ? 'Under Construction' : 'Access Resources'}
                  </Button>
               </div>
            ))}
         </div>

         <div className="mt-20 bg-brand-paper p-12 rounded-3xl text-center">
             <h3 className="font-serif text-2xl font-bold text-brand-darkest mb-4">Have a resource to share?</h3>
             <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                We are building a community of collaboration. If you have lesson plans or materials you'd like to contribute, let us know.
             </p>
             <Button variant="primary" onClick={() => handleNavigate('community')}>Contact Us</Button>
         </div>
      </div>
    );
  };

  const HomeView = () => (
    <>
      <Hero onNavigate={handleNavigate} />

      {/* Daily Quote */}
      <section className="bg-brand-deep py-12 px-6 text-center text-brand-paper">
        <div className="max-w-3xl mx-auto">
          <Heart size={32} className="mx-auto text-brand-wine mb-4" />
          <h3 className="text-sm uppercase tracking-widest mb-4 opacity-70">Daily Thought</h3>
          <p className="font-serif text-2xl md:text-3xl italic leading-relaxed">"{dailyQuote}"</p>
        </div>
      </section>

      {/* Featured Carousel Section */}
      <section className="py-20 px-6 container mx-auto">
         <div className="mb-10 text-center">
            <span className="text-brand-clay font-bold tracking-widest uppercase text-xs mb-2 block">Highlighted Stories</span>
            <h2 className="text-4xl font-serif text-brand-darkest">Editor's Picks</h2>
         </div>
         <FeaturedPostCarousel posts={posts.slice(0, 5)} onReadPost={handleReadPost} />
      </section>

      {/* Ask Maria AI Section (Inline) */}
      <section className="py-16 bg-brand-cream border-t border-brand-paper">
        <div className="container mx-auto px-6">
            <div className="text-center mb-10">
                <span className="text-brand-plum font-bold tracking-widest uppercase text-xs mb-2 block">AI Parenting Assistant</span>
                <h2 className="text-4xl font-serif text-brand-darkest mb-4">Ask Maria</h2>
                <p className="max-w-2xl mx-auto text-gray-600">
                    Not sure which activity is right for your child? Our AI guide can help match developmental stages to the perfect environment.
                </p>
            </div>
            <div className="flex justify-center">
                <MontessoriBot variant="inline" />
            </div>
        </div>
      </section>

      {/* PTA Parents Section */}
      <section className="py-20 bg-brand-paper/50">
        <div className="container mx-auto px-6">
           <div className="text-center mb-16">
             <span className="text-brand-plum font-bold tracking-widest uppercase text-xs mb-2 block">For the Village</span>
             <h2 className="text-4xl md:text-5xl font-serif text-brand-darkest mb-6">PTA Community Hub</h2>
             <p className="max-w-2xl mx-auto text-gray-600">
               Connect with other parents, volunteer your unique talents, and stay updated on how we are growing together.
             </p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-brand-paper">
                <div className="w-16 h-16 bg-brand-clay/10 text-brand-clay rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <HandHeart size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-darkest mb-3">Volunteer</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  From reading stories to tending the garden, your time makes our community blossom.
                </p>
                <Button variant="outline" size="sm" className="w-full">Sign Up</Button>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-brand-paper">
                <div className="w-16 h-16 bg-brand-plum/10 text-brand-plum rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <CalendarDays size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-darkest mb-3">Events</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Join us for our monthly Parent Nights, Fall Festivals, and Workshop Wednesdays.
                </p>
                <Button variant="outline" size="sm" className="w-full">View Calendar</Button>
             </div>

             <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 text-center group border border-brand-paper">
                <div className="w-16 h-16 bg-brand-wine/10 text-brand-wine rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                  <MessageCircle size={32} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-brand-darkest mb-3">Forum</h3>
                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  Ask questions, share resources, and coordinate playdates in our secure parent chat.
                </p>
                <Button variant="outline" size="sm" className="w-full">Join Discussion</Button>
             </div>
           </div>
        </div>
      </section>

      {/* Staff Wisdom Section */}
      <section className="py-24 bg-brand-darkest text-brand-paper relative overflow-hidden">
         {/* Decorative Element */}
         <div className="absolute top-0 right-0 w-96 h-96 bg-brand-plum/20 rounded-full filter blur-3xl translate-x-1/2 -translate-y-1/2"></div>

         <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12">
             <div className="max-w-2xl">
                <span className="text-brand-clay font-bold tracking-widest uppercase text-xs mb-2 block">Expert Insights</span>
                <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Wisdom from the Staff</h2>
                <p className="text-white/70 text-lg">
                  Guidance, reminders, and professional observations from the educators who know your children best.
                </p>
             </div>
             <div className="hidden md:block">
               <Quote size={64} className="text-brand-clay opacity-20" />
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {staffAdvice.map((item) => (
                <div key={item.id} className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300 flex flex-col group cursor-pointer" onClick={() => handleNavigate('educator')}>
                   <div className="mb-4 text-brand-clay">
                     <Quote size={24} />
                   </div>
                   <p className="text-white/90 italic mb-6 flex-grow leading-relaxed">
                     "{item.advice}"
                   </p>
                   <div className="border-t border-white/10 pt-4 mt-auto">
                     <p className="font-serif font-bold text-lg text-white group-hover:text-brand-clay transition-colors">{item.name}</p>
                     <p className="text-xs uppercase tracking-widest text-brand-plum font-bold">{item.role}</p>
                   </div>
                </div>
              ))}
           </div>

           <div className="text-center mt-12">
             <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-brand-darkest" onClick={() => handleNavigate('educator')}>
               View Educator Resources
             </Button>
           </div>
         </div>
      </section>

      {/* Featured Posts Preview Grid */}
      <section className="py-12 px-6 container mx-auto">
         <div className="flex justify-between items-end mb-12">
            <h2 className="text-4xl font-serif text-brand-darkest">Recent Journal Entries</h2>
            <button onClick={() => handleNavigate('philosophy')} className="text-brand-clay hover:underline">View All</button>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.slice(0, 3).map((post) => (
                <article key={post.id} className="group cursor-pointer" onClick={() => handleReadPost(post)}>
                  <div className="rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-brand-paper">
                     <Carousel images={post.images} />
                     <div className="p-6 bg-white">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 mb-3">
                          <span className="text-brand-wine font-bold">{post.category}</span>
                          <span>-</span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-brand-wine transition-colors leading-tight">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">{post.excerpt}</p>
                     </div>
                  </div>
                </article>
            ))}
         </div>
      </section>

      {/* Feature Section */}
      <section className="py-24 bg-brand-paper relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-brand-clay/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1">
            <img
              src="https://picsum.photos/seed/noplastic/800/800"
              alt="Wooden toys"
              className="rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500"
            />
          </div>
          <div className="order-1 md:order-2">
            <h2 className="text-4xl md:text-5xl font-serif mb-6 text-brand-darkest">
              Why We Say <span className="text-brand-wine italic">No</span> to Blinking Lights
            </h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              Toys that do everything for the child teach the child to do nothing.
              We believe in materials that invite the child to work, to concentrate, and to discover.
            </p>
            <Button variant="secondary" size="lg" onClick={() => handleNavigate('shop')}>Start Your Plastic Detox</Button>
          </div>
        </div>
      </section>
    </>
  );

  const CategoryView = ({ category }: { category: string }) => {
    const categoryPosts = posts.filter(p => p.category === category || (category === 'Philosophy' && p.category === 'Review'));

    return (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
         <div className="text-center mb-16 max-w-2xl mx-auto">
             <span className="text-brand-clay font-bold tracking-widest uppercase text-sm mb-4 block">The Journal</span>
             <h1 className="text-5xl md:text-6xl font-serif text-brand-darkest mb-6">{category}</h1>
             <p className="text-xl text-gray-600 leading-relaxed">
               Deep dives into the {category.toLowerCase()} of Montessori education. Explore our curated articles designed to help you observe and guide.
             </p>
         </div>

         {categoryPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
              {categoryPosts.map((post) => (
                  <article key={post.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-brand-paper flex flex-col h-full">
                    <Carousel images={post.images} />
                    <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-gray-500 mb-3">
                          <span className="text-brand-plum font-bold">{post.category}</span>
                          <span>-</span>
                          <span>{post.date}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-brand-wine transition-colors leading-tight cursor-pointer" onClick={() => handleReadPost(post)}>
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-6 leading-relaxed flex-grow">{post.excerpt}</p>
                        <button
                          onClick={() => handleReadPost(post)}
                          className="text-brand-clay font-bold hover:text-brand-wine transition-colors self-start mt-auto"
                        >
                          Read Full Article &rarr;
                        </button>
                    </div>
                  </article>
              ))}
            </div>
         ) : (
             <div className="text-center py-20 bg-brand-paper/50 rounded-xl">
               <p className="text-xl font-serif italic text-gray-500">No articles found in this section yet.</p>
               <Button variant="outline" className="mt-6" onClick={() => handleNavigate('home')}>Return Home</Button>
             </div>
         )}
      </div>
    );
  };

  const ShopView = () => (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
         <div className="text-center mb-16 max-w-2xl mx-auto">
             <span className="text-brand-plum font-bold tracking-widest uppercase text-sm mb-4 block">The Shop</span>
             <h1 className="text-5xl md:text-6xl font-serif text-brand-darkest mb-6">Curated Essentials</h1>
             <p className="text-xl text-gray-600 leading-relaxed">
                We only recommend what we use. High-quality, open-ended materials that respect the child's intelligence.
             </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
         </div>

         <div className="mt-20 bg-brand-deep text-brand-paper p-12 rounded-2xl text-center relative overflow-hidden">
             <div className="relative z-10">
                 <h3 className="text-3xl font-serif mb-4">Not sure where to start?</h3>
                 <p className="mb-8 max-w-xl mx-auto opacity-90">Ask Maria, our AI guide, for personalized recommendations based on your child's age and interests.</p>
                 <Button variant="secondary" onClick={() => document.getElementById('montessori-bot-trigger')?.click()}>Chat with Maria</Button>

                 {/* Quick Developmental Match Suggestions */}
                 <div className="mt-12 pt-12 border-t border-white/10 text-left">
                    <h4 className="text-center font-serif text-2xl mb-8 text-brand-clay">Quick Developmental Match</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* 0-12 Weeks */}
                        <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                            <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">0-12 Weeks</div>
                            <h5 className="font-serif font-bold text-lg mb-2">The Newborn Stage</h5>
                            <p className="text-sm text-white/70 mb-4 leading-relaxed">
                                High-contrast images and sensory play to build new brain connections.
                            </p>
                            <a href="https://lovevery.com/products/the-looker-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                                Shop The Looker Kit
                            </a>
                        </div>

                        {/* 7-8 Months */}
                        <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                             <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">7-8 Months</div>
                            <h5 className="font-serif font-bold text-lg mb-2">The Sitter Stage</h5>
                            <p className="text-sm text-white/70 mb-4 leading-relaxed">
                                Texture exploration and object permanence ("Where did it go?").
                            </p>
                            <a href="https://lovevery.com/products/the-inspector-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                                Shop The Inspector Kit
                            </a>
                        </div>

                        {/* 13-15 Months */}
                        <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                             <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">13-15 Months</div>
                            <h5 className="font-serif font-bold text-lg mb-2">The Toddler Stage</h5>
                            <p className="text-sm text-white/70 mb-4 leading-relaxed">
                                Cause and effect, balance, and opening/closing (posting).
                            </p>
                            <a href="https://lovevery.com/products/the-babbler-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                                Shop The Babbler Kit
                            </a>
                        </div>

                        {/* 19-21 Months */}
                        <div className="bg-brand-darkest/50 p-6 rounded-xl border border-white/5 hover:border-brand-clay/50 transition-colors group">
                             <div className="text-brand-clay font-bold text-xs uppercase tracking-widest mb-2">19-21 Months</div>
                            <h5 className="font-serif font-bold text-lg mb-2">The Realist Stage</h5>
                            <p className="text-sm text-white/70 mb-4 leading-relaxed">
                                Practical life skills, pouring, and precise hand control.
                            </p>
                            <a href="https://lovevery.com/products/the-realist-play-kit" className="text-sm font-bold border-b border-brand-clay pb-1 hover:text-brand-clay transition-colors inline-block">
                                Shop The Realist Kit
                            </a>
                        </div>

                    </div>
                 </div>
             </div>
         </div>
      </div>
  );

  const CommunityView = () => (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6 flex flex-col items-center justify-center text-center">
         <div className="max-w-3xl bg-white p-12 rounded-3xl shadow-2xl border border-brand-paper animate-fade-in">
             <div className="w-20 h-20 bg-brand-plum/10 rounded-full flex items-center justify-center mx-auto mb-8">
                 <Users className="text-brand-plum" size={40} />
             </div>
             <h1 className="text-5xl font-serif text-brand-darkest mb-6">Join the Village</h1>
             <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                 Parenting wasn't meant to be done alone. Join 1,200+ mindful parents receiving our weekly "Prepared Environment" newsletter.
             </p>

             <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-10">
                 <input
                   type="email"
                   placeholder="Your email address"
                   className="flex-1 px-6 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-clay"
                 />
                 <Button variant="primary">Subscribe</Button>
             </div>

             <div className="flex justify-center gap-8 text-brand-darkest/60">
                 <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Instagram size={20} /> Instagram</a>
                 <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Facebook size={20} /> Facebook</a>
                 <a href="#" className="flex items-center gap-2 hover:text-brand-plum transition-colors"><Mail size={20} /> Contact</a>
             </div>
         </div>
      </div>
  );

  return (
    <div className="min-h-screen font-sans text-brand-darkest bg-brand-cream selection:bg-brand-clay selection:text-white flex flex-col">

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <AdminLogin
          onClose={() => setShowAdminLogin(false)}
          onSignIn={signIn}
        />
      )}

      {/* CRM Overlay - only accessible if authenticated as admin */}
      {showCRM && isAdmin && (
        <CRMSystem
          onClose={() => setShowCRM(false)}
          onSignOut={signOut}
          userEmail={user?.email}
          posts={posts}
          products={products}
          staffAdvice={staffAdvice}
          onSavePost={handleSavePost}
          onDeletePost={handleDeletePost}
          onSaveProduct={handleSaveProduct}
          onDeleteProduct={handleDeleteProduct}
          onSaveStaffAdvice={handleSaveStaffAdvice}
        />
      )}

      {/* --- HEADER --- */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${currentPage === 'home' && !viewPost ? 'bg-transparent border-white/10' : 'bg-white shadow-md border-gray-100'} border-b backdrop-blur-md`}>
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <div
            className="cursor-pointer flex items-center gap-2 group"
            onClick={() => handleNavigate('home')}
          >
             {/* Dynamic Back Arrow for Mobile */}
             {currentPage !== 'home' && !viewPost && <ArrowLeft size={20} className={`md:hidden ${currentPage === 'home' && !viewPost ? 'text-white' : 'text-brand-darkest'}`} />}
             {viewPost && <ArrowLeft size={20} className={`md:hidden ${currentPage === 'home' && !viewPost ? 'text-white' : 'text-brand-darkest'}`} onClick={(e) => { e.stopPropagation(); setViewPost(null); }} />}

            {/* The New Logo */}
            <Logo
              variant={currentPage === 'home' && !viewPost ? 'light' : 'color'}
              className="w-10 h-10 md:w-12 md:h-12"
              classNameText="hidden md:flex"
            />
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex space-x-8">
            {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => handleNavigate(link.page)}
                className={`text-sm font-bold tracking-widest uppercase transition-colors relative group ${
                    currentPage === 'home' && !viewPost ? 'text-white hover:text-brand-clay' :
                    currentPage === link.page && !viewPost ? 'text-brand-clay' : 'text-brand-darkest hover:text-brand-clay'
                }`}
              >
                {link.label}
                {/* Underline effect */}
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-clay transition-all duration-300 group-hover:w-full ${currentPage === link.page && !viewPost ? 'w-full' : ''}`}></span>
              </button>
            ))}
             <button
                onClick={() => handleNavigate('educator')}
                className={`text-sm font-bold tracking-widest uppercase transition-colors relative group ${
                    currentPage === 'educator' ? 'text-brand-clay' :
                    currentPage === 'home' && !viewPost ? 'text-white hover:text-brand-clay' : 'text-brand-darkest hover:text-brand-clay'
                }`}
              >
                Educators
                <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-clay transition-all duration-300 group-hover:w-full ${currentPage === 'educator' ? 'w-full' : ''}`}></span>
              </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className={`md:hidden z-50 ${currentPage === 'home' && !viewPost && !mobileMenuOpen ? 'text-white' : 'text-brand-darkest'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Nav Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-brand-cream text-brand-darkest flex flex-col items-center justify-center space-y-8 z-40 animate-fade-in">
             {NAV_LINKS.map(link => (
              <button
                key={link.label}
                onClick={() => handleNavigate(link.page)}
                className="text-3xl font-serif hover:text-brand-clay transition-colors"
              >
                {link.label}
              </button>
            ))}
            <button onClick={() => handleNavigate('educator')} className="text-3xl font-serif hover:text-brand-clay transition-colors">Educators</button>
          </div>
        )}
      </header>

      {/* --- MAIN CONTENT SWITCHER --- */}
      <main className="flex-grow">
          {viewPost ? (
            <SinglePostView post={viewPost} />
          ) : (
            <>
              {currentPage === 'home' && <HomeView />}
              {currentPage === 'philosophy' && <CategoryView category="Philosophy" />}
              {currentPage === 'environment' && <CategoryView category="Environment" />}
              {currentPage === 'shop' && <ShopView />}
              {currentPage === 'community' && <CommunityView />}
              {currentPage === 'educator' && <EducatorView />}
            </>
          )}
      </main>

      {/* --- FOOTER (Simplified) --- */}
      <footer className="bg-brand-darkest text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <Logo variant="light" className="w-16 h-16 mb-4" />
              <p className="text-white/60 max-w-sm">
                Empowering parents to raise independent, confident children through the Montessori method.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold mb-6 text-brand-clay">Quick Links</h4>
              <ul className="space-y-4 text-white/70">
                 {NAV_LINKS.map(link => (
                     <li key={link.label}>
                         <button onClick={() => handleNavigate(link.page)} className="hover:text-white transition-colors">{link.label}</button>
                     </li>
                 ))}
                 <li><button onClick={() => handleNavigate('educator')} className="hover:text-white transition-colors">Educators</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-serif font-bold mb-6 text-brand-clay">Newsletter</h4>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="bg-white/5 border-none rounded-l-md px-4 py-2 w-full focus:ring-1 focus:ring-brand-clay text-sm"
                />
                <button className="bg-brand-clay px-4 rounded-r-md hover:bg-brand-wine transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/40 text-sm">
            <p>&copy; 2024 Montessori Milestones.</p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <button
                onClick={handleAdminClick}
                className="flex items-center gap-1 hover:text-brand-clay transition-colors"
                title="Admin Access"
              >
                <Lock size={12} /> {isAdmin ? 'Open Admin' : 'Admin Login'}
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* --- AI BOT --- */}
      {(currentPage !== 'home' && !viewPost) && <MontessoriBot variant="floating" />}
    </div>
  );
};

export default App;
