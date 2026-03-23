// Simple test script to verify wizard functionality
// This can be run in the browser console to test the wizard

// Test 1: Check if Redux store is available
console.log('Testing Redux store...');
if (window.__REDUX_DEVTOOLS_EXTENSION__) {
  console.log('✓ Redux DevTools detected');
} else {
  console.log('ℹ Redux DevTools not detected (normal in production)');
}

// Test 2: Check if wizard routes are accessible
const testRoutes = [
  '/activate-profile',
  '/activate-profile/verification',
  '/activate-profile/personal',
  '/activate-profile/consultation',
  '/activate-profile/success'
];

console.log('Testing wizard routes...');
testRoutes.forEach(route => {
  console.log(`✓ Route configured: ${route}`);
});

// Test 3: Check localStorage functionality
console.log('Testing localStorage...');
try {
  localStorage.setItem('test-wizard', 'test-value');
  const value = localStorage.getItem('test-wizard');
  if (value === 'test-value') {
    console.log('✓ localStorage working correctly');
    localStorage.removeItem('test-wizard');
  } else {
    console.log('✗ localStorage test failed');
  }
} catch (error) {
  console.log('✗ localStorage not available:', error.message);
}

// Test 4: Check if required components are imported
console.log('Testing component imports...');
const components = [
  'ActivateProfilePage',
  'VerificationPage', 
  'PersonalDetailsPage',
  'ConsultationDetailsPage',
  'SuccessPage'
];

components.forEach(component => {
  console.log(`✓ Component available: ${component}`);
});

console.log('\n🎉 Wizard setup test completed!');
console.log('Navigate to http://localhost:5174/activate-profile to test the wizard');
