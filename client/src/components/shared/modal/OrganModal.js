import React, { useState } from 'react';
import axios from '../../../utils/axiosInstance'; // Make sure this exists and baseURL is '/api/v1'
import { useAuth } from '../../../context/authContext';
import axiosInstance from '../../../utils/axiosInstance';

const organOptions = [
  'Heart', 'Liver', 'Kidney', 'Lung', 'Pancreas', 'Intestine', 'Cornea', 'Skin',
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const OrganModal = ({ onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    organType: '',
    bloodGroup: '',
    quantity: 1,
    donor: user?.role === 'donor' ? user._id : undefined,
    hospital: user?.role === 'hospital' ? user._id : undefined,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/organ-inventory/add-organ', form); // No double /api/v1
      onClose();
    } catch (err) {
      console.error('Add Organ Error:', err.response?.data || err.message);
      alert('Failed to add organ. Please check server logs.');
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg w-96 space-y-4"
      >
        <h2 className="text-xl font-bold">Add Organ</h2>

        <select
          value={form.organType}
          onChange={(e) => setForm({ ...form, organType: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Organ</option>
          {organOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        <select
          value={form.bloodGroup}
          onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })}
          required
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Blood Group</option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>{bg}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Quantity"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })}
          required
          className="w-full border px-3 py-2 rounded"
          min={1}
        />

        <div className="flex justify-between">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button type="button" onClick={onClose} className="text-red-500">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default OrganModal;
