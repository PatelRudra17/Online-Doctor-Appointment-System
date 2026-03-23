import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 0,
  verification: {
    mrn: '',
    council: '',
    documents: []
  },
  personal: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialization: '',
    experience: '',
    qualification: ''
  },
  consultation: {
    clinicName: '',
    clinicAddress: '',
    clinicPhone: '',
    services: [],
    consultationFees: ''
  },
  statuses: {
    verification: 'pending',
    personal: 'pending',
    consultation: 'pending'
  },
  isCompleted: false,
  isLoading: false,
  error: null
};

// Load initial state from localStorage if available
const getInitialState = () => {
  try {
    const savedState = localStorage.getItem('wizardState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      // Merge saved state with initial state to ensure all fields exist
      return {
        ...initialState,
        ...parsedState,
        // Ensure nested objects are properly merged
        verification: { ...initialState.verification, ...parsedState.verification },
        personal: { ...initialState.personal, ...parsedState.personal },
        consultation: { ...initialState.consultation, ...parsedState.consultation },
        statuses: { ...initialState.statuses, ...parsedState.statuses }
      };
    }
  } catch (error) {
    console.error('Error loading wizard state from localStorage:', error);
  }
  return initialState;
};

const wizardSlice = createSlice({
  name: 'wizard',
  initialState: getInitialState(),
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    
    nextStep: (state) => {
      if (state.currentStep < 2) { // 3 steps: 0, 1, 2
        state.currentStep += 1;
      }
    },
    
    previousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },
    
    updateVerification: (state, action) => {
      state.verification = {
        ...state.verification,
        ...action.payload
      };
    },
    
    updatePersonal: (state, action) => {
      state.personal = {
        ...state.personal,
        ...action.payload
      };
    },
    
    updateConsultation: (state, action) => {
      state.consultation = {
        ...state.consultation,
        ...action.payload
      };
    },
    
    updateStatus: (state, action) => {
      const { section, status } = action.payload;
      if (state.statuses[section]) {
        state.statuses[section] = status;
      }
    },
    
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    resetWizard: () => {
      return getInitialState();
    },
    
    completeWizard: (state) => {
      state.isCompleted = true;
      state.currentStep = 3; // Beyond the last step
    }
  }
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  updateVerification,
  updatePersonal,
  updateConsultation,
  updateStatus,
  setLoading,
  setError,
  clearError,
  resetWizard,
  completeWizard
} = wizardSlice.actions;

export default wizardSlice.reducer;

// Selectors
export const selectWizardState = (state) => state.wizard;
export const selectCurrentStep = (state) => state.wizard.currentStep;
export const selectVerification = (state) => state.wizard.verification;
export const selectPersonal = (state) => state.wizard.personal;
export const selectConsultation = (state) => state.wizard.consultation;
export const selectStatuses = (state) => state.wizard.statuses;
export const selectWizardProgress = (state) => ({
  current: state.wizard.currentStep,
  total: 3, // 3 steps: verification, personal, consultation
  percentage: ((state.wizard.currentStep + 1) / 3) * 100
});

// localStorage persistence utilities
export const loadWizardState = () => {
  try {
    const savedState = localStorage.getItem('wizardState');
    if (savedState) {
      const parsedState = JSON.parse(savedState);
      return parsedState;
    }
  } catch (error) {
    console.error('Error loading wizard state from localStorage:', error);
  }
  return null;
};

export const saveWizardState = (state) => {
  try {
    const stateToSave = {
      currentStep: state.currentStep,
      verification: state.verification,
      personal: state.personal,
      consultation: state.consultation,
      statuses: state.statuses,
      isCompleted: state.isCompleted,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('wizardState', JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Error saving wizard state to localStorage:', error);
  }
};

export const clearWizardState = () => {
  try {
    localStorage.removeItem('wizardState');
  } catch (error) {
    console.error('Error clearing wizard state from localStorage:', error);
  }
};
