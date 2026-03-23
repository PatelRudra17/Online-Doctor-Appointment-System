import React from 'react';

const AbdmPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">ABDM</h1>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏥</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Ayushman Bharat Digital Mission
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              This section is under development. Soon you'll be able to integrate with ABDM services 
              for digital health records and patient management.
            </p>
            <div className="mt-8">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">
                <span className="mr-2">🚧</span>
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AbdmPage;
