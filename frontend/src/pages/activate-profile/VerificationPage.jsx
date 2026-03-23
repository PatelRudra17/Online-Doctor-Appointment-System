import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  selectVerification, 
  updateVerification, 
  updateStatus, 
  nextStep 
} from '../../store/wizardSlice';
import { submitVerification, uploadDocuments } from '../../api/profile';

const VerificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const verification = useSelector(selectVerification);
  
  const [formData, setFormData] = useState({
    mrn: verification.mrn || '',
    council: verification.council || ''
  });

  const [documents, setDocuments] = useState(verification.documents || []);
  const [draggedFile, setDraggedFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fileInputRefs = useRef([]);

  const documentTypes = [
    { id: 'id-front', name: 'ID Card - Front', required: true },
    { id: 'id-back', name: 'ID Card - Back', required: true },
    { id: 'license', name: 'Professional License', required: true },
    { id: 'certificate', name: 'Degree Certificate', required: true },
    { id: 'passport', name: 'Passport', required: false }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file, docType) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          id: docType.id,
          name: file.name,
          type: file.type,
          size: file.size,
          preview: URL.createObjectURL(file),
          base64: reader.result,
          uploadedAt: new Date().toISOString()
        };
        
        setDocuments(prev => {
          const filtered = prev.filter(doc => doc.id !== docType.id);
          return [...filtered, newDoc];
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e, docType) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedFile(null);
    
    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
      handleFileSelect(file, docType);
    }
  };

  const handleDragOver = (e, docType) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedFile(docType.id);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggedFile(null);
  };

  const handleFileInputClick = (docType) => {
    const inputRef = fileInputRefs.current[docType.id];
    if (inputRef) {
      inputRef.click();
    }
  };

  const removeDocument = (docId) => {
    setDocuments(prev => {
      const doc = prev.find(d => d.id === docId);
      if (doc && doc.preview) {
        URL.revokeObjectURL(doc.preview);
      }
      return prev.filter(d => d.id !== docId);
    });
  };

  const handleBack = () => {
    navigate('/activate-profile');
  };

  const handleSaveAndNext = async () => {
    try {
      setSubmitting(true);
      setError(null);

      // Submit verification details
      await submitVerification({
        mrn: formData.mrn,
        councilName: formData.council
      });

      // Upload documents if any exist
      if (documents.length > 0) {
        const uploadFormData = new FormData();
        
        await Promise.all(documents.map(async (doc) => {
          // Convert base64 back to file for upload
          if (doc.base64) {
            const response = await fetch(doc.base64);
            const blob = await response.blob();
            const file = new File([blob], doc.name, { type: doc.type });
            uploadFormData.append(doc.id, file);
          }
        }));

        await uploadDocuments(uploadFormData);
      }

      // Save form data and documents to Redux
      dispatch(updateVerification({
        ...formData,
        documents
      }));
      
      // Update status to completed
      dispatch(updateStatus({ section: 'verification', status: 'completed' }));
      
      // Navigate to next step
      dispatch(nextStep());
      navigate('/activate-profile/personal');
    } catch (err) {
      console.error('Error saving verification:', err);
      setError('Failed to save verification. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isFormValid = formData.mrn.trim() && formData.council.trim();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Step Tabs */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-center">
              <li className="flex items-center">
                <span className="flex items-center px-6 py-2 text-sm font-medium rounded-full bg-blue-600 text-white">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white mr-2">
                    1
                  </span>
                  Verification
                </span>
              </li>
              <li className="flex items-center">
                <div className="flex items-center px-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-500">Personal Details</span>
                </div>
              </li>
              <li className="flex items-center">
                <div className="flex items-center px-2">
                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-gray-500">Consultation</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Professional Verification</h2>
            <p className="mt-1 text-sm text-gray-600">
              Please provide your professional details and upload required documents
            </p>
          </div>

          <div className="p-6">
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label htmlFor="mrn" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Registration Number (MRN) *
                </label>
                <input
                  type="text"
                  id="mrn"
                  name="mrn"
                  value={formData.mrn}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your MRN"
                  required
                />
              </div>
              <div>
                <label htmlFor="council" className="block text-sm font-medium text-gray-700 mb-2">
                  Medical Council *
                </label>
                <input
                  type="text"
                  id="council"
                  name="council"
                  value={formData.council}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your medical council"
                  required
                />
              </div>
            </div>

            {/* Document Upload Tiles */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentTypes.map((docType) => {
                  const uploadedDoc = documents.find(doc => doc.id === docType.id);
                  const isDragged = draggedFile === docType.id;
                  
                  return (
                    <div
                      key={docType.id}
                      className={`relative border-2 border-dashed rounded-lg p-4 transition-colors duration-200 ${
                        isDragged 
                          ? 'border-blue-400 bg-blue-50' 
                          : uploadedDoc 
                            ? 'border-green-400 bg-green-50' 
                            : 'border-gray-300 hover:border-gray-400'
                      }`}
                      onDrop={(e) => handleDrop(e, docType)}
                      onDragOver={(e) => handleDragOver(e, docType)}
                      onDragLeave={handleDragLeave}
                    >
                      <input
                        ref={(el) => (fileInputRefs.current[docType.id] = el)}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleFileSelect(e.target.files[0], docType)}
                      />
                      
                      {uploadedDoc ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {uploadedDoc.name}
                            </span>
                            <button
                              onClick={() => removeDocument(docType.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                          {uploadedDoc.preview && (
                            <div className="mt-2">
                              {uploadedDoc.type.startsWith('image/') ? (
                                <img
                                  src={uploadedDoc.preview}
                                  alt={uploadedDoc.name}
                                  className="w-full h-24 object-cover rounded"
                                />
                              ) : (
                                <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          )}
                          <button
                            onClick={() => handleFileInputClick(docType)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            Replace file
                          </button>
                        </div>
                      ) : (
                        <div
                          className="text-center cursor-pointer"
                          onClick={() => handleFileInputClick(docType)}
                        >
                          <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            {docType.name}
                            {docType.required && <span className="text-red-500">*</span>}
                          </p>
                          <p className="text-xs text-gray-500">Click or drag file</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Important Instructions:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Ensure all images are clear and readable</li>
                <li>• Acceptable ID types: National ID, Driver's License, or Passport</li>
                <li>• Supported formats: JPG, PNG, PDF (Max 5MB per file)</li>
                <li>• All required documents must be uploaded to proceed</li>
              </ul>
            </div>

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-800">{error}</div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleSaveAndNext}
                disabled={!isFormValid || submitting}
                className={`px-6 py-2 rounded-md text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isFormValid && !submitting
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                {submitting ? 'Saving...' : 'Save & Next'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage;
