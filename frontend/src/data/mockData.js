export const cities = [
  "Ahmedabad", "Gandhinagar", "Vadodara", "Surat", "Rajkot", "Jamnagar", "Hyderabad", "Delhi", "Bangalore", "Jammu", "Nashik",
  "Ludhiana", "Mumbai", "Jaipur", "Pune", "Mehsana", "Bikaner", "Bhavnagar", "Vapi", "Valsad", "Himatnagar", "Indore"
];

export const specialties = [
  { id: 1, name: "Dentist", icon: "🦷" },
  { id: 2, name: "Ophthalmologist", icon: "👁️" },
  { id: 3, name: "Gynecologist", icon: "👶" },
  { id: 4, name: "Dermatologist", icon: "🧴" },
  { id: 5, name: "Homeopath", icon: "🌿" },
  { id: 6, name: "Ayurveda", icon: "🍃" },
  { id: 7, name: "Cardiologist", icon: "❤️" },
  { id: 8, name: "Gastroenterologist", icon: "🧪" },
  { id: 9, name: "Physician", icon: "👨‍⚕️" },
  { id: 10, name: "Physiotherapist", icon: "🏃" }
];

export const healthProblems = [
  "Teeth Problem", "Heart Problem", "Skin Problem", "Eye Problem", "Hair Problem"
];

export const doctors = [
  { id: 1, name: "Dr. Smith", specialty: "Dentist", city: "Ahmedabad" },
  { id: 2, name: "Dr. Jones", specialty: "Cardiologist", city: "Mumbai" },
  { id: 3, name: "Dr. Doe", specialty: "Dermatologist", city: "Delhi" },
];

// Dashboard mock data
export const dashboardData = {
  appointments: {
    today: [],
    daily: [],
    dateRange: {
      start: null,
      end: null
    }
  },
  consultantActivity: {
    name: "Dr. Raju",
    revenue: "₹ 0.00",
    appointments: 0
  },
  overallStatistics: {
    invoices: [],
    receipts: [],
    dues: [],
    onlinePayments: [],
    sentForClaims: [],
    claimHistory: []
  },
  categorySummary: {
    total: 0,
    categories: []
  },
  ipdIncome: {
    total: 0,
    details: []
  },
  overallMetrics: {
    patients: 0,
    revenue: 0,
    appointments: 0
  }
};

// Calendar mock data
export const calendarData = {
  consultants: [
    { id: 1, name: "Dr. Raju", checked: false },
    { id: 2, name: "Dr. Smith", checked: false },
    { id: 3, name: "Dr. Jones", checked: false },
    { id: 4, name: "Dr. Doe", checked: false }
  ],
  slotDuration: 15,
  timeSlots: [],
  appointments: [],
  todaySchedule: {
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    appointments: []
  }
};

// Video Guide mock data
export const videoGuideData = [
  {
    id: 1,
    title: "Health Patri",
    description: "Complete health monitoring guide",
    thumbnail: "🏥",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 2,
    title: "Write Prescriptions",
    description: "Digital prescription writing tutorial",
    thumbnail: "📝",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 3,
    title: "Patient Management",
    description: "Managing patient records efficiently",
    thumbnail: "👥",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 4,
    title: "Billing & Payments",
    description: "Complete billing workflow guide",
    thumbnail: "💳",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 5,
    title: "Appointment Scheduling",
    description: "Efficient appointment management",
    thumbnail: "📅",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 6,
    title: "Lab Reports",
    description: "Managing lab test results",
    thumbnail: "🔬",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 7,
    title: "Inventory Management",
    description: "Medical supplies tracking",
    thumbnail: "📦",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 8,
    title: "Telemedicine",
    description: "Virtual consultation setup",
    thumbnail: "💻",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  },
  {
    id: 9,
    title: "Data Analytics",
    description: "Practice performance insights",
    thumbnail: "📊",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  }
];
