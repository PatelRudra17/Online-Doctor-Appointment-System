# Profile Activation Wizard

This directory contains the multi-step wizard for activating a professional profile in the MediWeb application.

## Components

### ActivateProfilePage
- **Path**: `/activate-profile`
- **Purpose**: Main landing page showing the status of all wizard steps
- **Features**:
  - 3 status cards (Verification, Personal Details, Consultation Details)
  - Visual indicators for completion status
  - "Get Started" button to begin the wizard

### VerificationPage
- **Path**: `/activate-profile/verification`
- **Purpose**: Professional verification step
- **Features**:
  - Step navigation tabs
  - Form inputs for MRN and Medical Council
  - 5 document upload tiles with drag & drop support
  - File preview using `URL.createObjectURL()`
  - Support for images (JPG/PNG) and PDF files
  - Instructions and requirements display

### PersonalDetailsPage
- **Path**: `/activate-profile/personal`
- **Purpose**: Personal and professional information collection
- **Features**:
  - Personal information form (name, email, phone)
  - Professional details (specialization, qualification, experience)
  - Dropdown selections for common options
  - Progress saving functionality

### ConsultationDetailsPage
- **Path**: `/activate-profile/consultation`
- **Purpose**: Consultation setup and service configuration
- **Features**:
  - Clinic information form
  - Service selection with checkboxes
  - Consultation fee configuration
  - Working hours setup (optional)

### SuccessPage
- **Path**: `/activate-profile/success`
- **Purpose**: Completion confirmation and next steps
- **Features**:
  - Success confirmation
  - Setup summary
  - Navigation to dashboard or profile

## State Management

The wizard uses Redux for state management with the following structure:

```javascript
{
  currentStep: number,
  verification: {
    mrn: string,
    council: string,
    documents: Array<File>
  },
  personal: {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    specialization: string,
    experience: string,
    qualification: string
  },
  consultation: {
    clinicName: string,
    clinicAddress: string,
    clinicPhone: string,
    services: Array<string>,
    consultationFees: string
  },
  statuses: {
    verification: 'pending' | 'in-progress' | 'completed',
    personal: 'pending' | 'in-progress' | 'completed',
    consultation: 'pending' | 'in-progress' | 'completed'
  },
  isCompleted: boolean,
  isLoading: boolean,
  error: string | null
}
```

## Persistence

- **localStorage Key**: `wizardState`
- **Auto-save**: State is automatically saved to localStorage on every change
- **Load on Init**: State is loaded from localStorage when the app starts
- **Manual Save**: Users can manually save progress on each step

## File Upload Features

- **Drag & Drop**: Supported for all document uploads
- **File Preview**: Images are previewed using `URL.createObjectURL()`
- **File Storage**: Files are stored as base64 in the state
- **Supported Formats**: JPG, PNG, PDF
- **File Management**: Users can remove and replace uploaded files

## Navigation

The wizard follows a linear progression:
1. Verification → Personal Details → Consultation Details → Success
2. Users can navigate back to previous steps
3. Progress is preserved when navigating between steps
4. Each step updates its status automatically

## Validation

- **Required Fields**: All required fields are validated before proceeding
- **File Requirements**: Document upload requirements are enforced
- **Form Validation**: Real-time validation feedback

## Styling

The wizard uses Tailwind CSS for styling with:
- Consistent color scheme (blue for primary actions)
- Responsive design for mobile and desktop
- Hover states and transitions
- Clear visual hierarchy
- Accessibility considerations

## Integration

The wizard is integrated into the main application routing and is protected by authentication middleware. It's accessible through the `/activate-profile` route and its sub-routes.
