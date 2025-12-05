import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { Logo } from './Logo';

interface AdminLoginProps {
  onClose: () => void;
  onSignIn: (email: string) => Promise<{ error: string | null; success: boolean }>;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onClose, onSignIn }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await onSignIn(email);

    setLoading(false);

    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-darkest/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="bg-brand-paper px-8 pt-8 pb-6 text-center">
          <Logo variant="color" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-serif font-bold text-brand-darkest">Admin Access</h2>
          <p className="text-gray-600 text-sm mt-2">
            Enter your email to receive a magic link
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-brand-darkest mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 mb-6">
                We sent a magic link to <strong>{email}</strong>. Click the link to sign in.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle size={18} />
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-clay focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full flex items-center justify-center gap-2"
                disabled={loading || !email}
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Send Magic Link
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Only authorized administrators can access the CMS.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
