import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS } from '../constants';
import { Carousel } from '../components/Carousel';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const navigate = useNavigate();
  const posts = BLOG_POSTS;

  const handleReadPost = (post: BlogPost) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <div className="min-h-screen pt-32 pb-24 container mx-auto px-6">
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-brand-clay font-bold tracking-widest uppercase text-sm mb-4 block">All Articles</span>
        <h1 className="text-5xl md:text-6xl font-serif text-brand-darkest mb-6">The Journal</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          Insights, reflections, and practical guidance on Montessori parenting and the prepared environment.
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-12">
        <Link
          to="/blog"
          className="px-4 py-2 rounded-full text-sm font-bold bg-brand-clay text-white"
        >
          All
        </Link>
        <Link
          to="/philosophy"
          className="px-4 py-2 rounded-full text-sm font-bold bg-brand-paper text-brand-darkest hover:bg-brand-clay hover:text-white transition-colors"
        >
          Philosophy
        </Link>
        <Link
          to="/environment"
          className="px-4 py-2 rounded-full text-sm font-bold bg-brand-paper text-brand-darkest hover:bg-brand-clay hover:text-white transition-colors"
        >
          Environment
        </Link>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 animate-fade-in">
          {posts.map((post) => (
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
          <p className="text-xl font-serif italic text-gray-500">No articles yet. Check back soon!</p>
        </div>
      )}
    </div>
  );
};
