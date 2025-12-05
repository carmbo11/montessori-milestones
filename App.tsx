import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, PRODUCTS, STAFF_ADVICE } from './constants';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ShopPage } from './pages/ShopPage';
import { CommunityPage } from './pages/CommunityPage';
import { EducatorsPage } from './pages/EducatorsPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { BlogPage } from './pages/BlogPage';
import { AdminPage } from './pages/AdminPage';
import { BlogPost, AffiliateProduct, StaffAdvice } from './types';
import { useAuth } from './hooks/useAuth';

// Check for magic link tokens BEFORE React renders (Supabase clears them quickly)
const arrivedViaMagicLink = window.location.hash.includes('access_token') ||
                            window.location.hash.includes('refresh_token');

const App: React.FC = () => {
  const navigate = useNavigate();

  // Auth state
  const { isAdmin, loading: authLoading } = useAuth();

  // CMS State Management (for admin)
  const [posts, setPosts] = React.useState<BlogPost[]>(BLOG_POSTS);
  const [products, setProducts] = React.useState<AffiliateProduct[]>(PRODUCTS);
  const [staffAdvice, setStaffAdvice] = React.useState<StaffAdvice[]>(STAFF_ADVICE);

  // Redirect to /admin when returning from magic link authentication
  useEffect(() => {
    if (!authLoading && isAdmin && arrivedViaMagicLink) {
      // Clean up the URL hash and redirect to admin
      window.history.replaceState(null, '', '/admin');
      navigate('/admin');
    }
  }, [authLoading, isAdmin, navigate]);

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

  // Routes wrapper
  return (
    <Routes>
      {/* Public routes with Layout */}
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      <Route path="/philosophy" element={<Layout><CategoryPage category="Philosophy" /></Layout>} />
      <Route path="/environment" element={<Layout><CategoryPage category="Environment" /></Layout>} />
      <Route path="/shop" element={<Layout><ShopPage /></Layout>} />
      <Route path="/community" element={<Layout><CommunityPage /></Layout>} />
      <Route path="/educators" element={<Layout><EducatorsPage /></Layout>} />
      <Route path="/blog" element={<Layout><BlogPage /></Layout>} />
      <Route path="/blog/:id" element={<Layout><BlogPostPage /></Layout>} />

      {/* Admin route (no Layout wrapper - has its own layout) */}
      <Route
        path="/admin"
        element={
          <AdminPage
            posts={posts}
            products={products}
            staffAdvice={staffAdvice}
            onSavePost={handleSavePost}
            onDeletePost={handleDeletePost}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
            onSaveStaffAdvice={handleSaveStaffAdvice}
          />
        }
      />
    </Routes>
  );
};

export default App;
