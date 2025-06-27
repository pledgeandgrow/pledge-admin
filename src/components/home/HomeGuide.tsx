import { FileText, Shield, Users, BarChart2, Settings, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomeGuide() {
  const guides = [
    {
      icon: <Users className="h-6 w-6" />,
      title: 'User Roles & Permissions',
      content: 'Learn about administrator, manager, and viewer roles to effectively manage your team.',
      link: '/docs/roles-permissions'
    },
    {
      icon: <BarChart2 className="h-6 w-6" />,
      title: 'Dashboard Overview',
      content: 'Navigate through your dashboard and understand key metrics at a glance.',
      link: '/docs/dashboard-guide'
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: 'Pledge Management',
      content: 'Create, track, and manage pledges with our comprehensive tools.',
      link: '/docs/pledge-management'
    },
    {
      icon: <Settings className="h-6 w-6" />,
      title: 'Account Settings',
      content: 'Customize your account preferences and notification settings.',
      link: '/account/settings'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Quick Start Guide',
      content: 'Get up and running with Pledge Admin in just a few simple steps.',
      link: '/docs/quick-start'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Security Best Practices',
      content: 'Follow our guidelines to ensure your data remains secure and protected.',
      link: '/docs/security'
    }
  ];



  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50 transition-colors duration-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Get Started with Pledge Admin
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Everything you need to know to make the most of our platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {guides.map((guide, index) => (
            <Link 
              key={index} 
              href={guide.link}
              className="group bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-transparent hover:-translate-y-1"
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 dark:text-blue-400 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors duration-200">
                  {guide.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {guide.content}
                  </p>

                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all duration-200 font-medium text-lg shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>Go to portal</span>
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
