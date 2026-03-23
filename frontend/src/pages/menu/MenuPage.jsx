import React from 'react';
import { Link } from 'react-router-dom';

const MenuCard = ({ title, items }) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">{title}</h2>
    <div className="grid gap-4">
      {items.map(item => (
        <Link
          key={item.id}
          to={`/menu/subpages/${item.id}`}
          className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <span className="text-2xl mr-4">{item.icon}</span>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{item.label}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ))}
    </div>
  </div>
);

const MenuPage = () => {
  const administrativeTools = [
    { id: 'data-import', label: 'Data Import', icon: '📥', description: 'Import patient data from external sources' },
    { id: 'data-export', label: 'Data Export', icon: '📤', description: 'Export patient data in various formats' },
    { id: 'backup-restore', label: 'Backup & Restore', icon: '💾', description: 'Manage data backups and restoration' },
    { id: 'user-management', label: 'User Management', icon: '👥', description: 'Manage user accounts and permissions' },
    { id: 'system-settings', label: 'System Settings', icon: '⚙️', description: 'Configure system-wide settings' },
    { id: 'audit-logs', label: 'Audit Logs', icon: '📋', description: 'View system activity logs' }
  ];

  const communicationTools = [
    { id: 'notifications', label: 'Notifications', icon: '🔔', description: 'Manage notification preferences and templates' }
  ];

  const otherTools = [
    { id: 'reports', label: 'Reports', icon: '📊', description: 'Generate and view various reports' },
    { id: 'analytics', label: 'Analytics', icon: '📈', description: 'View practice analytics and insights' },
    { id: 'integrations', label: 'Integrations', icon: '🔗', description: 'Manage third-party integrations' },
    { id: 'templates', label: 'Templates', icon: '📄', description: 'Manage document templates' },
    { id: 'calendar-sync', label: 'Calendar Sync', icon: '📅', description: 'Sync with external calendars' },
    { id: 'mobile-app', label: 'Mobile App Settings', icon: '📱', description: 'Configure mobile application settings' },
    { id: 'api-settings', label: 'API Settings', icon: '🔌', description: 'Manage API configurations' },
    { id: 'security', label: 'Security Center', icon: '🔒', description: 'Manage security settings and policies' },
    { id: 'help-support', label: 'Help & Support', icon: '❓', description: 'Access help documentation and support' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Menu</h1>
          <p className="text-gray-600">Access all tools and settings for your practice</p>
        </div>

        <div className="grid gap-8">
          {/* Administrative Tools Section */}
          <MenuCard 
            title="Administrative Tools" 
            items={administrativeTools}
          />

          {/* Communication Section */}
          <MenuCard 
            title="Communication" 
            items={communicationTools}
          />

          {/* Other Tools Section */}
          <MenuCard 
            title="Other" 
            items={otherTools}
          />
        </div>

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">6</div>
              <p className="text-gray-600">Administrative Tools</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">1</div>
              <p className="text-gray-600">Communication Tools</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">9</div>
              <p className="text-gray-600">Other Tools</p>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-indigo-50 rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-indigo-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💡</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-indigo-900">Need Help?</h3>
              <p className="text-indigo-700 mt-1">
                Visit our Help & Support section for documentation, tutorials, and contact information.
              </p>
            </div>
            <div className="ml-auto">
              <Link
                to="/menu/subpages/help-support"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Get Help
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
