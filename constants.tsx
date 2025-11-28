import { BlogPost, AffiliateProduct, Lead, CampaignStat } from './types';
import React from 'react';

export const BLOG_POSTS: BlogPost[] = [
  {
    id: '1',
    title: "The Absorbent Mind: Understanding Your Toddler's Brain",
    excerpt: "Maria Montessori discovered that children under six have a unique ability to absorb knowledge from their environment effortlessly. Learn how to optimize your home for this critical period.",
    author: "Elena Rossi",
    date: "October 12, 2023",
    category: 'Philosophy',
    images: [
      "https://picsum.photos/seed/montessori1/800/600",
      "https://picsum.photos/seed/montessori2/800/600",
      "https://picsum.photos/seed/montessori3/800/600"
    ],
    content: `
      <p>The child has a different relation to his environment from ours... the child absorbs it. The things he sees are not just remembered; they form part of his soul. He incarnates in himself all in the world about him that his eyes see and his ears hear.</p>
      <h3>The Prepared Environment</h3>
      <p>To support the absorbent mind, we must prepare the environment. This means order, beauty, and accessibility. A child cannot learn independence if they cannot reach their own materials.</p>
    `
  },
  {
    id: '2',
    title: "Why We Ditched Flashing Lights for Wood",
    excerpt: "Electronic toys entertain, but passive toys engage. Discover why simple, wooden materials are superior for developing concentration and deep play.",
    author: "Sarah Jenkins",
    date: "October 15, 2023",
    category: 'Review',
    images: [
      "https://picsum.photos/seed/woodtoys1/800/600",
      "https://picsum.photos/seed/woodtoys2/800/600"
    ],
    content: `
      <p>When you press a button and a toy lights up, the toy is doing the work, not the child. Passive toys make active learners.</p>
      <p>Wooden toys, like the ones from the <strong>Play Kits</strong>, offer texture, weight, and warmth that plastic simply cannot replicate.</p>
    `
  },
  {
    id: '3',
    title: "Creating a 'Yes' Space in Your Living Room",
    excerpt: "Stop saying 'no' and start designing a space where your child is free to explore safely. A guide to minimalism and functional design.",
    author: "Dr. Maria Fan",
    date: "October 20, 2023",
    category: 'Environment',
    images: [
      "https://picsum.photos/seed/livingroom1/800/600",
      "https://picsum.photos/seed/livingroom2/800/600",
      "https://picsum.photos/seed/livingroom3/800/600"
    ],
    content: "Detailed guide on setting up low shelves..."
  }
];

export const PRODUCTS: AffiliateProduct[] = [
  {
    id: 'p1',
    name: 'The Looker Play Kit',
    price: '$80.00',
    description: 'High-contrast visuals and sensory exploration tools perfect for building new brain connections.',
    imageUrl: 'https://picsum.photos/seed/lovevery1/400/400',
    affiliateLink: 'https://lovevery.com/products/the-looker-play-kit',
    badge: '0-12 Weeks',
    ageRange: '0-12 weeks'
  },
  {
    id: 'p2',
    name: 'The Inspector Play Kit',
    price: '$80.00',
    description: 'Practice object permanence and explore textures. Includes the famous ball drop box.',
    imageUrl: 'https://picsum.photos/seed/lovevery2/400/400',
    affiliateLink: 'https://lovevery.com/products/the-inspector-play-kit',
    badge: '7-8 Months',
    ageRange: '7-8 months'
  },
  {
    id: 'p3',
    name: 'The Babbler Play Kit',
    price: '$120.00',
    description: 'Explore gravity, practice balance, and learn object permanence with the slide and coin bank.',
    imageUrl: 'https://picsum.photos/seed/lovevery3/400/400',
    affiliateLink: 'https://lovevery.com/products/the-babbler-play-kit',
    badge: 'Best Seller',
    ageRange: '13, 14, 15 months'
  },
  {
    id: 'p4',
    name: 'The Realist Play Kit',
    price: '$120.00',
    description: 'Develop precise hand-eye coordination and real-life skills with the lock box and pouring set.',
    imageUrl: 'https://picsum.photos/seed/lovevery4/400/400',
    affiliateLink: 'https://lovevery.com/products/the-realist-play-kit',
    ageRange: '19, 20, 21 months'
  },
  {
    id: 'p5',
    name: 'The Block Set',
    price: '$90.00',
    description: 'A brilliant system of solid wood blocks for building spatial awareness. A forever toy.',
    imageUrl: 'https://picsum.photos/seed/lovevery5/400/400',
    affiliateLink: 'https://lovevery.com/products/the-block-set',
    ageRange: '12 months to 4 years+'
  },
  {
    id: 'p6',
    name: 'Montessori Bookshelf Bundle',
    price: '$30.00',
    description: 'Realistic books reflecting the child\'s daily life. No fantasy, just relatable experiences.',
    imageUrl: 'https://picsum.photos/seed/books/400/400',
    affiliateLink: 'https://lovevery.com/products/book-bundle',
    ageRange: '0-5 years'
  }
];

export const NAV_LINKS = [
  { label: 'Philosophy', page: 'philosophy' },
  { label: 'Environment', page: 'environment' },
  { label: 'The Shop', page: 'shop' },
  { label: 'Community', page: 'community' },
];

export const MOCK_LEADS: Lead[] = [
  { id: '1', name: 'Jennifer Collins', email: 'jen.c@email.com', status: 'Engaged', source: 'Instagram', joinDate: '2023-10-24', lastAction: 'Clicked "Play Kit"' },
  { id: '2', name: 'Amara Singh', email: 'amara.s@email.com', status: 'New', source: 'Blog Post', joinDate: '2023-10-25', lastAction: 'Signed up' },
  { id: '3', name: 'Beth Dutton', email: 'beth.d@email.com', status: 'Converted', source: 'Direct', joinDate: '2023-10-20', lastAction: 'Purchased Block Set' },
  { id: '4', name: 'Sophie Miller', email: 'sophie.m@email.com', status: 'Cold', source: 'Pinterest', joinDate: '2023-09-15', lastAction: 'Viewed "Shelf"' },
  { id: '5', name: 'Rachel Green', email: 'rach.green@email.com', status: 'Engaged', source: 'Facebook', joinDate: '2023-10-22', lastAction: 'Shared Article' },
];

export const CAMPAIGN_STATS: CampaignStat[] = [
  { id: 'c1', name: 'Holiday Gift Guide', clicks: 1245, conversions: 89, revenue: '$4,250', trend: 'up' },
  { id: 'c2', name: 'Play Kits Feature', clicks: 850, conversions: 45, revenue: '$3,600', trend: 'up' },
  { id: 'c3', name: 'Nursery Makeover', clicks: 320, conversions: 12, revenue: '$850', trend: 'down' },
];

export const STAFF_ADVICE = [
  {
    id: 's1',
    name: 'Mrs. Halloway',
    role: 'Lead Guide (3-6)',
    advice: "Don't just correct the child; connect with them. Correction builds walls, connection builds bridges. Always start from a place of love."
  },
  {
    id: 's2',
    name: 'Mr. Vance',
    role: 'Art Director',
    advice: "Creativity is not about the end product, it's about the process. Let them make a mess, let them explore materials without a destination."
  },
  {
    id: 's3',
    name: 'Nurse Sarah',
    role: 'Health Coordinator',
    advice: "A well-rested child is a regulated child. Prioritize sleep over extracurriculars. A calm morning starts the night before."
  },
   {
    id: 's4',
    name: 'Dr. Aris',
    role: 'Child Psychologist',
    advice: "The child's behavior is communication. When they are 'acting out', they are often speaking a language we have yet to translate."
  }
];