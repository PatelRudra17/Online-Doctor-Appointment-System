import { configureStore } from '@reduxjs/toolkit';
import wizardReducer from './wizardSlice';
import { saveWizardState } from './wizardSlice';

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save to localStorage after every state change
  const state = store.getState();
  if (state.wizard) {
    saveWizardState(state.wizard);
  }
  
  return result;
};

export const store = configureStore({
  reducer: {
    wizard: wizardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
