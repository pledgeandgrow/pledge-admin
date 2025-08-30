'use client';

import { AffiliatesList } from '@/components/marketing/affiliation/AffiliatesList';
import { AffiliationPrograms } from '@/components/marketing/affiliation/AffiliationPrograms';
import { AffiliationSettings } from '@/components/marketing/affiliation/AffiliationSettings';
import { AffiliateView } from '@/components/marketing/affiliation/AffiliateView';
import { ProgramView } from '@/components/marketing/affiliation/ProgramView';

// Sample data
const programs = [
  {
    name: 'SaaS Partner Program',
    commission: '25%',
    affiliates: 45,
    revenue: '12,450 €',
    performance: '+15%',
    status: 'Excellent'
  },
  {
    name: 'Agency Partnership',
    commission: '20%',
    affiliates: 32,
    revenue: '8,920 €',
    performance: '+8%',
    status: 'Bon'
  },
  {
    name: 'Startup Referral',
    commission: '30%',
    affiliates: 28,
    revenue: '6,780 €',
    performance: '+12%',
    status: 'Excellent'
  }
];

const brands = [
  {
    name: 'TechCorp Solutions',
    type: 'SaaS',
    commission: '25%',
    earnings: '4,520 €',
    status: 'Actif'
  },
  {
    name: 'Marketing Pro',
    type: 'Marketing',
    commission: '20%',
    earnings: '3,280 €',
    status: 'Actif'
  },
  {
    name: 'Cloud Services Inc',
    type: 'Cloud',
    commission: '22%',
    earnings: '2,890 €',
    status: 'Actif'
  },
  {
    name: 'Design Master',
    type: 'Design',
    commission: '18%',
    earnings: '1,950 €',
    status: 'Actif'
  },
  {
    name: 'Security Plus',
    type: 'Sécurité',
    commission: '24%',
    earnings: '3,670 €',
    status: 'Actif'
  }
];

const affiliates = [
  {
    id: '1',
    name: 'Jean Dupont',
    code: 'JEAN2024',
    referrals: 45,
    earnings: '3,450 €',
    status: 'Actif',
    lastActive: 'Il y a 2h'
  },
  {
    id: '2',
    name: 'Marie Martin',
    code: 'MARIE2024',
    referrals: 32,
    earnings: '2,890 €',
    status: 'Actif',
    lastActive: 'Il y a 5h'
  },
  {
    id: '3',
    name: 'Pierre Bernard',
    code: 'PIERRE2024',
    referrals: 28,
    earnings: '2,120 €',
    status: 'En pause',
    lastActive: 'Hier'
  }
];

const settings = {
  defaultCommission: '20%',
  minimumPayout: '100€',
  payoutSchedule: 'Mensuel',
  cookieDuration: 30
};

export default function AffiliationPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          <AffiliatesList affiliates={affiliates} />
          <AffiliationPrograms programs={programs} brands={brands} />
          <AffiliationSettings settings={settings} />
          <AffiliateView affiliateId="aff-001" />
          <ProgramView programId="prog-001" />
        </div>
      </div>
    </div>
  );
}
