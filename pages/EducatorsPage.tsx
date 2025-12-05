import React from 'react';
import { Link } from 'react-router-dom';
import { EDUCATOR_RESOURCES } from '../constants';
import { Button } from '../components/Button';
import { BookOpen, Layout, Eye, Scissors, Download, AlertCircle } from 'lucide-react';

// ============================================================================
// Style Variants - Educator Resources Cards
// Change 'educatorCardStyle' to switch between 'terracotta' and 'white'
// ============================================================================
type CardStyleVariant = 'terracotta' | 'white';
const educatorCardStyle: CardStyleVariant = 'terracotta';

const EDUCATOR_CARD_STYLES = {
  terracotta: {
    card: 'bg-[rgb(194,95,48)] border-[rgb(194,95,48)]',
    badge: 'bg-white/20 text-white',
    icon: 'text-white bg-white/10',
    title: 'text-white',
    description: 'text-white/80',
    buttonDisabled: 'opacity-50 cursor-not-allowed !border-white/30 !text-white/50 hover:bg-transparent',
    buttonEnabled: 'w-full !border-white !text-white hover:!bg-white hover:!text-[rgb(194,95,48)]',
  },
  white: {
    card: 'bg-white border-brand-paper',
    badge: 'bg-gray-100 text-gray-500',
    icon: 'text-brand-plum bg-brand-plum/10',
    title: 'text-brand-darkest',
    description: 'text-gray-600',
    buttonDisabled: 'opacity-50 cursor-not-allowed border-gray-200 text-gray-400 hover:bg-transparent hover:text-gray-400',
    buttonEnabled: 'w-full',
  },
} as const;

export const EducatorsPage: React.FC = () => {
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
          <div key={resource.id} className={`${EDUCATOR_CARD_STYLES[educatorCardStyle].card} p-8 rounded-2xl shadow-sm border hover:shadow-lg transition-shadow duration-300 relative overflow-hidden group`}>
            {resource.comingSoon && (
              <div className={`absolute top-4 right-4 text-xs font-bold ${EDUCATOR_CARD_STYLES[educatorCardStyle].badge} px-2 py-1 rounded-full flex items-center gap-1`}>
                <AlertCircle size={12} /> Coming Soon
              </div>
            )}
            <div className={`mb-6 ${EDUCATOR_CARD_STYLES[educatorCardStyle].icon} w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              {getIcon(resource.icon)}
            </div>
            <h3 className={`font-serif text-2xl font-bold ${EDUCATOR_CARD_STYLES[educatorCardStyle].title} mb-3`}>{resource.title}</h3>
            <p className={`${EDUCATOR_CARD_STYLES[educatorCardStyle].description} leading-relaxed mb-6`}>
              {resource.description}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={resource.comingSoon}
              className={resource.comingSoon
                ? EDUCATOR_CARD_STYLES[educatorCardStyle].buttonDisabled
                : EDUCATOR_CARD_STYLES[educatorCardStyle].buttonEnabled}
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
        <Link to="/community">
          <Button variant="primary">Contact Us</Button>
        </Link>
      </div>
    </div>
  );
};
