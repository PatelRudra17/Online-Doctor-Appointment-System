import React, { useState } from 'react';
import { MagnifyingGlassIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';

const AppHeader = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    // TODO: Implement search functionality
  };

  return (
    <div className="flex items-center justify-between">
      {/* Search Input */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search Patient"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4 ml-4">
        {/* Help Icon */}
        <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <QuestionMarkCircleIcon className="h-6 w-6" />
        </button>

        {/* Clinic Name Badge */}
        <div className="flex items-center space-x-2">
          <div className="px-3 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            raju clinic / ncfhpk
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
