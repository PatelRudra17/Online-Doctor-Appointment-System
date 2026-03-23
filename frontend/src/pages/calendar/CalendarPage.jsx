import React, { useState, useEffect, useMemo } from 'react';
import { 
  MagnifyingGlassIcon,
  CalendarIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { getAppointments } from '../../api/appointments';

const CalendarPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [consultants, setConsultants] = useState([
    { id: 1, name: "Dr. Raju", checked: false },
    { id: 2, name: "Dr. Smith", checked: false },
    { id: 3, name: "Dr. Jones", checked: false },
    { id: 4, name: "Dr. Doe", checked: false }
  ]);
  const [viewType, setViewType] = useState('Day');
  const [slotDuration, setSlotDuration] = useState(15);
  const [appointments, setAppointments] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    cancelled: 0,
    appointments: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const viewOptions = ['Chairs', 'Day', '4 Days', 'Week'];
  
  // Memoize selected consultant IDs to prevent unnecessary re-renders
  const selectedConsultantIds = useMemo(() => {
    return consultants.filter(c => c.checked).map(c => c.id);
  }, [consultants]);
  
  useEffect(() => {
    fetchAppointments();
  }, [selectedConsultantIds, viewType, new Date().toDateString()]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const today = new Date();
      const dateFrom = today.toISOString().split('T')[0];
      const dateTo = dateFrom;
      
      const params = {
        doctorIds: selectedConsultantIds,
        dateFrom,
        dateTo,
        viewType
      };
      
      const data = await getAppointments(params);
      const appointments = data || [];
      setAppointments(appointments);
      
      // Derive today's schedule from fetched appointments
      const todayString = today.toISOString().split('T')[0];
      const todayAppointments = appointments.filter(apt => {
        const aptDate = apt.appointmentDate ? new Date(apt.appointmentDate).toISOString().split('T')[0] : null;
        return aptDate === todayString;
      });
      
      const scheduleStats = {
        total: todayAppointments.length,
        completed: todayAppointments.filter(apt => apt.status === 'completed').length,
        pending: todayAppointments.filter(apt => apt.status === 'scheduled' || apt.status === 'confirmed').length,
        cancelled: todayAppointments.filter(apt => apt.status === 'cancelled').length,
        appointments: todayAppointments.map(apt => ({
          id: apt._id,
          patientName: apt.patientInfo ? `${apt.patientInfo.firstName} ${apt.patientInfo.lastName}` : 'Unknown Patient',
          time: apt.startTime || 'TBD',
          status: apt.status || 'pending'
        }))
      };
      
      setTodaySchedule(scheduleStats);
    } catch (err) {
      setError('Failed to load appointments');
      console.error('Appointments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const toggleConsultant = (id) => {
    setConsultants(consultants.map(consultant => 
      consultant.id === id 
        ? { ...consultant, checked: !consultant.checked }
        : consultant
    ));
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const TIME_SLOTS = generateTimeSlots();
  
  // Generate date range for header (Mar 3 - 6, 2026)
  const getDateString = () => {
    const startDate = new Date(2026, 2, 3); // March 3, 2026
    const endDate = new Date(2026, 2, 6);   // March 6, 2026
    const options = { month: 'short', day: 'numeric' };
    const startStr = startDate.toLocaleDateString('en-US', options);
    const endStr = endDate.toLocaleDateString('en-US', options);
    return `${startStr} - ${endStr}, 2026`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Consultants Filter */}
      <div className="w-80 bg-white border-r border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Consultants</h2>
        
        {/* Search */}
        <div className="relative mb-4">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search consultants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Consultant Checkboxes */}
        <div className="space-y-2 mb-6">
          {consultants
            .filter(consultant => 
              consultant.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((consultant) => (
              <label key={consultant.id} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                <input
                  type="checkbox"
                  checked={consultant.checked}
                  onChange={() => toggleConsultant(consultant.id)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{consultant.name}</span>
              </label>
            ))}
        </div>

        {/* Slot Duration */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slot Duration
          </label>
          <select
            value={slotDuration}
            onChange={(e) => setSlotDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>
      </div>

      {/* Center - Calendar Grid */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">
              {getDateString()}
            </h1>
            
            {/* View Toggle */}
            <div className="flex space-x-2">
              {viewOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setViewType(option)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewType === option
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg border border-gray-200 min-h-full">
            {loading && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-500">Loading appointments...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-red-400" />
                  <p className="text-red-500">{error}</p>
                </div>
              </div>
            )}
            
            {!loading && !error && (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Empty time slots</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Today's Schedule */}
      <div className="w-80 bg-white border-l border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h2>
        
        {/* Counters */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">
              {loading ? '...' : todaySchedule.total}
            </p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-green-600">
              {loading ? '...' : todaySchedule.completed}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {loading ? '...' : todaySchedule.pending}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-600">
              {loading ? '...' : todaySchedule.cancelled}
            </p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="space-y-3">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-500">Loading appointments...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 mx-auto mb-2 text-red-400" />
              <p className="text-red-500">{error}</p>
            </div>
          )}
          
          {!loading && !error && todaySchedule.appointments.length === 0 && (
            <div className="text-center py-8">
              <ClockIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No Appointments</p>
            </div>
          )}
          
          {!loading && !error && todaySchedule.appointments.length > 0 && (
            todaySchedule.appointments.map((appointment) => (
              <div key={appointment.id} className="bg-gray-50 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">{appointment.time}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;
