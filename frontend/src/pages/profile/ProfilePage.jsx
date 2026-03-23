import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../../api/profile';

const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState('personal-details');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  
  const [profileData, setProfileData] = useState({
    personalDetails: {
      firstName: 'Dr. John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      dateOfBirth: '',
      gender: '',
      about: '',
      specialty: 'Dentist',
      languages: [],
      website: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const editProfileItems = [
    { id: 'personal-details', label: 'Personal Details', icon: '👤' },
    { id: 'contact-info', label: 'Contact Information', icon: '📞' },
    { id: 'professional-info', label: 'Professional Information', icon: '💼' },
    { id: 'education', label: 'Education', icon: '🎓' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'certifications', label: 'Certifications', icon: '🏆' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' }
  ];

  const clinicManagementItems = [
    { id: 'clinic-info', label: 'Clinic Information', icon: '🏥' },
    { id: 'staff', label: 'Staff Management', icon: '👥' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'timing', label: 'Timing', icon: '🕐' },
    { id: 'billing', label: 'Billing Settings', icon: '💰' }
  ];

  const specialties = [
    'Dentist', 'General Physician', 'Cardiologist', 'Neurologist', 
    'Pediatrician', 'Orthopedic', 'Dermatologist', 'Psychiatrist',
    'Gynecologist', 'Ophthalmologist', 'ENT Specialist', 'Other'
  ];

  const languages = [
    'English', 'Hindi', 'Bengali', 'Tamil', 'Telugu', 'Marathi',
    'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Urdu', 'Other'
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value
      }
    }));
  };

  const handleLanguageToggle = (language) => {
    setProfileData(prev => {
      const currentLanguages = prev.personalDetails.languages || [];
      const newLanguages = currentLanguages.includes(language)
        ? currentLanguages.filter(lang => lang !== language)
        : [...currentLanguages, language];
      
      return {
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          languages: newLanguages
        }
      };
    });
  };

  const handleAvatarUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleAvatarUpload(file);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleAvatarUpload(file);
  };

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      await updateProfile(profileData);
      alert('Profile saved successfully!');
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile');
      alert('Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reload profile data to reset changes
    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getProfile();
        setProfileData(data);
        setError(null);
      } catch (err) {
        console.error('Error reloading profile:', err);
        setError('Failed to reload profile data');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  };

  const renderPersonalDetailsForm = () => (
    <div className="space-y-6">
      {/* Avatar Upload */}
      <div className="flex items-center space-x-6">
        <div
          className={`w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
            isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById('avatar-upload').click()}
        >
          {avatarPreview ? (
            <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-lg" />
          ) : (
            <div className="text-center">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-gray-600">Drag & Drop</p>
              <p className="text-xs text-gray-500">or click to upload</p>
            </div>
          )}
        </div>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <div>
          <h3 className="font-semibold text-gray-900">Profile Photo</h3>
          <p className="text-sm text-gray-600">Upload a professional photo</p>
        </div>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={profileData.personalDetails.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={profileData.personalDetails.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            value={profileData.personalDetails.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone *
          </label>
          <input
            type="tel"
            value={profileData.personalDetails.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            value={profileData.personalDetails.dateOfBirth}
            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <select
            value={profileData.personalDetails.gender}
            onChange={(e) => handleInputChange('gender', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* About */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          About
        </label>
        <textarea
          value={profileData.personalDetails.about}
          onChange={(e) => handleInputChange('about', e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Tell us about yourself..."
        />
      </div>

      {/* Specialty */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Specialty
        </label>
        <select
          value={profileData.personalDetails.specialty}
          onChange={(e) => handleInputChange('specialty', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          {specialties.map(specialty => (
            <option key={specialty} value={specialty}>{specialty}</option>
          ))}
        </select>
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Languages
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {languages.map(language => (
            <label key={language} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={profileData.personalDetails.languages?.includes(language) || false}
                onChange={() => handleLanguageToggle(language)}
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className="text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Website
        </label>
        <input
          type="url"
          value={profileData.personalDetails.website}
          onChange={(e) => handleInputChange('website', e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="https://yourwebsite.com"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-600">Loading profile data...</div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="text-red-800">{error}</div>
          </div>
        )}
        
        {!loading && (
          <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Edit Profile</h2>
              <nav className="space-y-2">
                {editProfileItems.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      activeSection === item.id
                        ? 'bg-indigo-50 text-indigo-600 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
              
              <h2 className="text-lg font-semibold text-gray-900 mb-4 mt-8">Clinic Management</h2>
              <nav className="space-y-2">
                {clinicManagementItems.map(item => (
                  <button
                    key={item.id}
                    className="w-full text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Personal Details</h2>
              
              {activeSection === 'personal-details' && renderPersonalDetailsForm()}
              {activeSection !== 'personal-details' && (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">🚧</div>
                  <p className="text-gray-600">This section is under development</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'SAVING...' : 'SAVE'}
                </button>
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
