import React, { useEffect, useState } from 'react';
import axiosInstance from '../../src/utils/axiosInstance';
import moment from 'moment';

const OrganInventoryPage = () => {
  const [organs, setOrgans] = useState([]);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    organType: '',
    bloodGroup: '',
    quantity: '',
    donor: '', // for donor dropdown
    hospital: '', // optional hospital
  });
  const [donors, setDonors] = useState([]); // To populate donor dropdown

  const organOptions = ['Kidney', 'Liver', 'Heart', 'Lung', 'Pancreas', 'Intestine'];
  const bloodGroupOptions = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const colors = ['#884A39', '#C38154', '#FFC26F', '#4F709C', '#4942E4', '#0079FF', '#FF0060', '#22A699'];

  // Fetch organs
  const getOrgans = async () => {
    try {
      const { data } = await axiosInstance.get('/organ-inventory/get-organ');
      if (data.success) {
        setOrgans(data.data);
      } else {
        setError('Failed to fetch organs');
      }
    } catch (err) {
      console.error('Error fetching organs:', err);
      setError(`Error fetching organs: ${err.response?.data?.message || err.message}`);
    }
  };

  // Fetch donors for dropdown
  const getDonors = async () => {
    try {
      const { data } = await axiosInstance.get('/users?role=donar'); // assuming your backend supports filtering by role
      if (data.success) {
        setDonors(data.data);
      } else {
        setError('Failed to fetch donors');
      }
    } catch (err) {
      console.error('Error fetching donors:', err);
      setError(`Error fetching donors: ${err.response?.data?.message || err.message}`);
    }
  };

  useEffect(() => {
    getOrgans();
    getDonors();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOrgan = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/organ-inventory/add-organ', formData);
      if (res.data.success) {
        setFormData({ organType: '', bloodGroup: '', quantity: '', donor: '', hospital: '' });
        getOrgans();
      } else {
        setError('Failed to add organ');
      }
    } catch (err) {
      console.error('Error adding organ:', err);
      setError(`Error adding organ: ${err.response?.data?.message || err.message}`);
    }
  };

  // Delete organ handler
  const handleDelete = async (organId) => {
    if (!window.confirm('Are you sure you want to delete this organ record?')) return;
    try {
      await axiosInstance.delete(`/organ-inventory/${organId}`);
      getOrgans();
    } catch (err) {
      console.error('Error deleting organ:', err);
      setError(`Error deleting organ: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">🧬 Organ Inventory Dashboard</h3>

      {/* Add Organ Form */}
      <form className="row g-3 mb-4" onSubmit={handleAddOrgan}>
        <div className="col-md-3">
          <label className="form-label">Organ Type</label>
          <select
            className="form-select"
            name="organType"
            value={formData.organType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Organ</option>
            {organOptions.map((org) => (
              <option key={org} value={org}>{org}</option>
            ))}
          </select>
        </div>

        <div className="col-md-3">
          <label className="form-label">Blood Group</label>
          <select
            className="form-select"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Blood Group</option>
            {bloodGroupOptions.map((bg) => (
              <option key={bg} value={bg}>{bg}</option>
            ))}
          </select>
        </div>

        <div className="col-md-2">
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-control"
            name="quantity"
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
            placeholder="Qty"
          />
        </div>

        <div className="col-md-2">
          <label className="form-label">Donor</label>
          <select
            className="form-select"
            name="donor"
            value={formData.donor}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Donor</option>
            {donors.map((donor) => (
              <option key={donor._id} value={donor._id}>
                {donor.name} ({donor.email})
              </option>
            ))}
          </select>
        </div>

        {/* Optional hospital dropdown */}
        <div className="col-md-2">
          <label className="form-label">Hospital (optional)</label>
          <input
            type="text"
            className="form-control"
            name="hospital"
            value={formData.hospital}
            onChange={handleInputChange}
            placeholder="Hospital ID"
          />
        </div>

        <div className="col-md-12 d-flex justify-content-end mt-2">
          <button type="submit" className="btn btn-success">➕ Add Organ</button>
        </div>
      </form>

      {/* Error Message */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Organ Inventory Cards */}
      <div className="row">
        {organs.map((organ, index) => (
          <div key={organ._id} className="col-md-4 mb-3">
            <div className="card text-white" style={{ backgroundColor: colors[index % colors.length] }}>
              <div className="card-body">
                <h5 className="card-title text-center bg-light text-dark py-2 rounded">
                  {organ.organType} ({organ.bloodGroup})
                </h5>
                <p>Quantity: <strong>{organ.quantity}</strong></p>
                <p>Added On: {moment(organ.createdAt).format('DD/MM/YYYY hh:mm A')}</p>
                <p>Donor: <strong>{organ.donor?.name || 'Unknown'}</strong></p>
                <p>Hospital: <strong>{organ.hospital?.name || 'Unknown'}</strong></p>
              </div>
              <div className="card-footer bg-dark text-center d-flex justify-content-between align-items-center">
                <small>ID: {organ.donor?._id || 'N/A'}</small>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(organ._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrganInventoryPage;
