import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, PRODUCTS } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeft, User, Calendar, Share2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const post = BLOG_POSTS.find(p => p.id === id);

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-24 container mx-auto px-6 text-center">
        <h1 className="text-4xl font-serif text-brand-darkest mb-6">Post Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
        <Link to="/">
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    );
  }

  // Filter suggestions: Get other posts and some products
  const otherPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 3);
  const suggestedProducts = PRODUCTS.slice(0, 3);

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
        onClick={() => navigate(-1)}
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
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-serif font-bold mb-8">Gallery</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {post.images.slice(1).map((img, idx) => (
                <img key={idx} src={img} alt="Gallery" className="w-full h-72 object-cover rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 mx-auto" />
              ))}
            </div>
          </div>
        )}

        <hr className="my-16 border-brand-paper" />

        {/* Further Exploration / Relevant Links */}
        <div className="mb-12">
          <h3 className="text-2xl font-serif font-bold mb-8 text-brand-darkest">Further Exploration</h3>
          <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x snap-mandatory">

            {/* Related Posts */}
            {otherPosts.map(p => (
              <Link
                key={p.id}
                to={`/blog/${p.id}`}
                className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-xl border border-brand-paper shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="h-40 overflow-hidden">
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-xs font-bold text-brand-plum uppercase tracking-wider mb-2">{p.category}</span>
                  <h4 className="font-serif font-bold text-lg leading-tight mb-2 text-brand-darkest">{p.title}</h4>
                  <span className="text-brand-clay text-sm font-bold mt-auto">Read Article &rarr;</span>
                </div>
              </Link>
            ))}

            {/* Related Products */}
            {suggestedProducts.map(prod => (
              <div
                key={prod.id}
                className="min-w-[280px] md:min-w-[320px] snap-center bg-white rounded-xl border border-brand-paper shadow-sm hover:shadow-lg transition-all overflow-hidden flex flex-col"
              >
                <div className="h-40 overflow-hidden relative">
                  <img src={prod.imageUrl} alt={prod.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-brand-clay text-white text-xs font-bold px-2 py-1 rounded">Recommended</div>
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <h4 className="font-serif font-bold text-lg leading-tight mb-2 text-brand-darkest">{prod.name}</h4>
                  <p className="text-xs text-gray-500 mb-3 line-clamp-2">{prod.description}</p>
                  <a
                    href={prod.affiliateLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-brand-clay text-sm font-bold mt-auto hover:underline"
                  >
                    View Product &rarr;
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
};
