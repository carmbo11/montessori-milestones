import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CRMSystem } from '../components/CRMSystem';
import { AdminLogin } from '../components/AdminLogin';
import { useAuth } from '../hooks/useAuth';
import { BlogPost, AffiliateProduct, StaffAdvice } from '../types';

interface AdminPageProps {
  posts: BlogPost[];
  products: AffiliateProduct[];
  staffAdvice: StaffAdvice[];
  onSavePost: (post: BlogPost) => void;
  onDeletePost: (id: string) => void;
  onSaveProduct: (product: AffiliateProduct) => void;
  onDeleteProduct: (id: string) => void;
  onSaveStaffAdvice: (advice: StaffAdvice) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  posts,
  products,
  staffAdvice,
  onSavePost,
  onDeletePost,
  onSaveProduct,
  onDeleteProduct,
  onSaveStaffAdvice
}) => {
  const navigate = useNavigate();
  const { user, isAdmin, loading: authLoading, signIn, signOut } = useAuth();

  const handleClose = () => {
    navigate('/');
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-brand-paper flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-brand-clay border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show login if not authenticated or not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-brand-paper flex items-center justify-center p-4">
        <AdminLogin
          onClose={handleClose}
          onSignIn={signIn}
        />
      </div>
    );
  }

  // Show CMS if authenticated admin
  return (
    <CRMSystem
      onClose={handleClose}
      onSignOut={handleSignOut}
      userEmail={user?.email}
      posts={posts}
      products={products}
      staffAdvice={staffAdvice}
      onSavePost={onSavePost}
      onDeletePost={onDeletePost}
      onSaveProduct={onSaveProduct}
      onDeleteProduct={onDeleteProduct}
      onSaveStaffAdvice={onSaveStaffAdvice}
    />
  );
};
