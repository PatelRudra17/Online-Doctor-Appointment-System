import React from 'react';

const KiviAIPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Coming Soon
          </h1>
          <div className="text-3xl font-semibold text-indigo-600 mb-8">
            AI DOCTOR ASSISTANT
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Revolutionary AI-powered medical assistant designed to enhance your clinical practice and patient care
          </p>
        </div>

        {/* Phone Mock Image Placeholder */}
        <div className="flex justify-center mb-16">
          <div className="relative">
            <div className="w-80 h-96 bg-gray-200 rounded-3xl shadow-2xl flex items-center justify-center border-8 border-gray-800">
              <div className="text-center">
                <div className="text-6xl mb-4">📱</div>
                <p className="text-gray-600 font-medium">AI Assistant Interface</p>
                <p className="text-sm text-gray-500 mt-2">Coming Soon</p>
              </div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 rounded-full"></div>
            <div className="absolute -top-2 -left-2 w-6 h-6 bg-gray-800 rounded-full"></div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Input Patient Data
              </h3>
              <p className="text-gray-600">
                Enter patient symptoms, history, and clinical observations
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI Analysis
              </h3>
              <p className="text-gray-600">
                Advanced algorithms analyze data and provide insights
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Get Recommendations
              </h3>
              <p className="text-gray-600">
                Receive evidence-based treatment suggestions and diagnoses
              </p>
            </div>
          </div>
        </div>

        {/* Key Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">🧠</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Intelligent Diagnosis
              </h3>
              <p className="text-gray-600 text-sm">
                AI-powered differential diagnosis suggestions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">💊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Drug Interactions
              </h3>
              <p className="text-gray-600 text-sm">
                Automatic checking of medication interactions
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Clinical Analytics
              </h3>
              <p className="text-gray-600 text-sm">
                Real-time patient data analysis and trends
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">🔍</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Evidence-Based Medicine
              </h3>
              <p className="text-gray-600 text-sm">
                Latest research and clinical guidelines integration
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Quick Decisions
              </h3>
              <p className="text-gray-600 text-sm">
                Rapid clinical decision support at point of care
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">🛡️</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure & Compliant
              </h3>
              <p className="text-gray-600 text-sm">
                HIPAA-compliant data protection and privacy
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-2xl mb-3">📚</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Learning System
              </h3>
              <p className="text-gray-600 text-sm">
                Continuously improves from clinical outcomes
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-indigo-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold mb-4">
            Be the First to Experience the Future of Healthcare
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join our waitlist and get early access to the AI Doctor Assistant
          </p>
          <button className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Join Waitlist
          </button>
        </div>
      </div>
    </div>
  );
};

export default KiviAIPage;
