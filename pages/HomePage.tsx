import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, PRODUCTS, STAFF_ADVICE } from '../constants';
import { Carousel } from '../components/Carousel';
import { FeaturedPostCarousel } from '../components/FeaturedPostCarousel';
import { Button } from '../components/Button';
import { MontessoriBot } from '../components/MontessoriBot';
import { Hero } from '../components/Hero';
import { Heart, Quote, HandHeart, CalendarDays, MessageCircle } from 'lucide-react';
import { generateBlogSummary } from '../services/groqService';
import { BlogPost, AffiliateProduct, StaffAdvice } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [dailyQuote, setDailyQuote] = useState("Loading daily inspiration...");

  // Use state for data that might be managed elsewhere
  const posts = BLOG_POSTS;
  const staffAdvice = STAFF_ADVICE;

  useEffect(() => {
    const fetchQuote = async () => {
      const quote = await generateBlogSummary();
      setDailyQuote(quote);
    };
    fetchQuote();
  }, []);

  const handleReadPost = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <>
      <Hero onNavigate={(page: string) => navigate(`/${page === 'home' ? '' : page}`)} />

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
      <section className="relative py-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1475113548554-5a36f1f523d6?q=80&w=2070&auto=format&fit=crop"
            alt="Children playing in nature near water"
            className="w-full h-full object-cover"
          />
          {/* Dark Overlay for readability */}
          <div className="absolute inset-0 bg-brand-darkest/60"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-8">
            <span className="text-brand-clay font-bold tracking-widest uppercase text-xs mb-2 block">AI Parenting Assistant</span>
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Ask Maria</h2>
            <p className="max-w-2xl mx-auto text-white/90 text-lg font-light leading-relaxed">
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
              <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">Wisdom</h2>
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
              <Link
                key={item.id}
                to="/educators"
                className="bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors duration-300 flex flex-col group cursor-pointer"
              >
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
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/educators">
              <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-brand-darkest">
                View Educator Resources
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts Preview Grid */}
      <section className="py-12 px-6 container mx-auto">
        <div className="flex justify-between items-end mb-12">
          <h2 className="text-4xl font-serif text-brand-darkest">Recent Journal Entries</h2>
          <Link to="/philosophy" className="text-brand-clay hover:underline">View All</Link>
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
            <Link to="/shop">
              <Button variant="secondary" size="lg">Start Your Plastic Detox</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
