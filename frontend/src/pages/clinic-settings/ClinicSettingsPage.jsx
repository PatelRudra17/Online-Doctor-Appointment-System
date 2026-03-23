import React, { useState, useEffect, useMemo } from 'react';
import { getProcedures, createProcedure, updateProcedure, deleteProcedure, reorderProcedures } from '../../api/templates';

const ClinicSettingsPage = () => {
  const [activeSection, setActiveSection] = useState('treatmentplan-template');
  
  const defaultProcedures = useMemo(() => [
    { id: 1, name: 'Consultation', fee: 10, gst: 0 },
    { id: 2, name: 'Follow-Up', fee: 20, gst: 0 },
    { id: 3, name: 'Tele', fee: 0, gst: 0 }
  ], []);
  
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProcedure, setEditingProcedure] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  
  const [newProcedure, setNewProcedure] = useState({
    name: '',
    fee: '',
    gst: ''
  });

  const menuItems = [
    { id: 'treatmentplan-template', label: 'Treatment Plan Template', icon: '📋' },
    { id: 'clinic-info', label: 'Clinic Information', icon: '🏥' },
    { id: 'staff-management', label: 'Staff Management', icon: '👥' },
    { id: 'services', label: 'Services', icon: '🔧' },
    { id: 'timing', label: 'Timing', icon: '🕐' },
    { id: 'billing', label: 'Billing Settings', icon: '💰' },
    { id: 'appointments', label: 'Appointments', icon: '📅' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'reports', label: 'Reports', icon: '📊' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'backup', label: 'Backup', icon: '💾' },
    { id: 'advanced', label: 'Advanced Settings', icon: '⚙️' }
  ];

  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProcedures();
      setProcedures(data);
    } catch (err) {
      console.error('Error loading procedures:', err);
      setError('Failed to load procedures');
      // Fallback to default procedures if API fails
      setProcedures(defaultProcedures);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    if (draggedItem === null || draggedItem === dropIndex) return;
    
    const draggedProcedure = procedures[draggedItem];
    const newProcedures = [...procedures];
    newProcedures.splice(draggedItem, 1);
    newProcedures.splice(dropIndex, 0, draggedProcedure);
    
    try {
      const orderedIds = newProcedures.map(p => p.id);
      await reorderProcedures(orderedIds);
      setProcedures(newProcedures);
    } catch (error) {
      console.error('Error reordering procedures:', error);
      setError('Failed to reorder procedures');
      // Revert to original order on error
      setProcedures([...procedures]);
    }
    
    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleAddProcedure = async () => {
    if (newProcedure.name && newProcedure.fee !== '') {
      try {
        const procedure = {
          name: newProcedure.name,
          fee: parseFloat(newProcedure.fee) || 0,
          gst: parseFloat(newProcedure.gst) || 0
        };
        
        const createdProcedure = await createProcedure(procedure);
        setProcedures([...procedures, createdProcedure]);
        setNewProcedure({ name: '', fee: '', gst: '' });
        setShowAddForm(false);
        setError(null);
      } catch (error) {
        console.error('Error adding procedure:', error);
        setError('Failed to add procedure');
      }
    }
  };

  const handleEditProcedure = (procedure) => {
    setEditingProcedure(procedure);
    setNewProcedure({
      name: procedure.name,
      fee: procedure.fee.toString(),
      gst: procedure.gst.toString()
    });
    setShowAddForm(true);
  };

  const handleUpdateProcedure = async () => {
    if (editingProcedure && newProcedure.name && newProcedure.fee !== '') {
      try {
        const updatedData = {
          name: newProcedure.name,
          fee: parseFloat(newProcedure.fee) || 0,
          gst: parseFloat(newProcedure.gst) || 0
        };
        
        const updatedProcedure = await updateProcedure(editingProcedure.id, updatedData);
        const updatedProcedures = procedures.map(proc => 
          proc.id === editingProcedure.id ? updatedProcedure : proc
        );
        
        setProcedures(updatedProcedures);
        setEditingProcedure(null);
        setNewProcedure({ name: '', fee: '', gst: '' });
        setShowAddForm(false);
        setError(null);
      } catch (error) {
        console.error('Error updating procedure:', error);
        setError('Failed to update procedure');
      }
    }
  };

  const handleDeleteProcedure = async (id) => {
    if (window.confirm('Are you sure you want to delete this procedure?')) {
      try {
        await deleteProcedure(id);
        setProcedures(procedures.filter(proc => proc.id !== id));
        setError(null);
      } catch (error) {
        console.error('Error deleting procedure:', error);
        setError('Failed to delete procedure');
      }
    }
  };

  const renderTreatmentPlanTemplate = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Treatment Plan Template</h2>
        <button
          onClick={() => {
            setEditingProcedure(null);
            setNewProcedure({ name: '', fee: '', gst: '' });
            setShowAddForm(true);
          }}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Add New Procedure
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 text-4xl mb-2">⏳</div>
          <p className="text-gray-600">Loading procedures...</p>
        </div>
      )}

      {/* Add/Edit Form */}
      {!loading && showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingProcedure ? 'Edit Procedure' : 'Add New Procedure'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Procedure Name *
              </label>
              <input
                type="text"
                value={newProcedure.name}
                onChange={(e) => setNewProcedure({ ...newProcedure, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter procedure name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fee (₹) *
              </label>
              <input
                type="number"
                value={newProcedure.fee}
                onChange={(e) => setNewProcedure({ ...newProcedure, fee: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GST (%)
              </label>
              <input
                type="number"
                value={newProcedure.gst}
                onChange={(e) => setNewProcedure({ ...newProcedure, gst: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="0"
                min="0"
                max="100"
                step="0.01"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingProcedure(null);
                setNewProcedure({ name: '', fee: '', gst: '' });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingProcedure ? handleUpdateProcedure : handleAddProcedure}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              {editingProcedure ? 'Update' : 'Add'}
            </button>
          </div>
        </div>
      )}

      {/* Procedures Table */}
      {!loading && (
        <>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Procedure Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  GST
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {procedures.map((procedure, index) => (
                <tr
                  key={procedure.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`cursor-move transition-colors ${
                    dragOverIndex === index ? 'bg-indigo-50' : 'hover:bg-gray-50'
                  } ${draggedItem === index ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-gray-400 mr-3">⋮⋮</div>
                      <div className="text-sm font-medium text-gray-900">
                        {procedure.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{procedure.fee.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {procedure.gst}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{(procedure.fee * (1 + procedure.gst / 100)).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEditProcedure(procedure)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProcedure(procedure.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {procedures.length === 0 && (
          <div className="text-center py-8">
            <div className="text-gray-400 text-4xl mb-2">📋</div>
            <p className="text-gray-600">No procedures added yet</p>
            <p className="text-sm text-gray-500 mt-1">Add your first procedure to get started</p>
          </div>
        )}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        💡 Tip: Drag and drop rows to reorder procedures
      </div>
        </>
      )}
    </div>
  );

  const renderPlaceholderContent = () => (
    <div className="text-center py-12">
      <div className="text-4xl mb-4">🚧</div>
      <p className="text-gray-600">This section is under development</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Clinic Settings</h1>
        
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <div className="w-80 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-md p-6">
              <nav className="space-y-2">
                {menuItems.map(item => (
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
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeSection === 'treatmentplan-template' && renderTreatmentPlanTemplate()}
              {activeSection !== 'treatmentplan-template' && renderPlaceholderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicSettingsPage;
