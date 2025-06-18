import React, { useState, useEffect } from 'react';
import './form.css'; // Optional: for custom styles
import { connect } from 'react-redux'; // Add this to connect to Redux
import { update_coffee_record } from 'components/State/action';

const Modal = ({ isOpen, toggleModal, record, update_coffee_record }) => {
    const [alert, setAlert] = useState({ type: '', message: '' });
    // State to store the form data, initialized with the record data
    const [formData, setFormData] = useState({
        id: '',
        mark: '',
        outturn: '',
        grade: '',
        bags: '',
        pockets: '',
        weight: '',
        season: '',
        certificate: '',
        mill: '',
        status: ''
    });

    // Update the form when the record changes
    useEffect(() => {
        if (record) {
        setFormData({
            id: record.id || '',
            mark: record.mark || '',
            outturn: record.outturn || '',
            grade: record.grade || '',
            bags: record.bags || '',
            pockets: record.pockets || '',
            weight: record.weight || '',
            season: record.season || '',
            certificate: record.certificate || '',
            mill: record.mill || '',
            status: record.status || ''
        });
        }
    }, [record]);

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
        ...prevState,
        [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
        // Dispatch the update action here
        await update_coffee_record(formData); // Assuming this returns a promise
        setAlert({ type: 'success', message: 'Record updated successfully!' });
        } catch (error) {
        setAlert({ type: 'error', message: 'Failed to update the record. Please try again.' });
        }

        // Optionally close the modal after a delay
        setTimeout(() => {
        toggleModal();
        setAlert({ type: '', message: '' }); // Clear the alert
        }, 2000);
  };

  if (!isOpen) {
    return null; // Don't render anything if modal is not open
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 >Edit Record</h2>
                {/* Alert Messages */}
        {alert.message && (
          <div className={`alert ${alert.type === 'success' ? 'alert-success' : 'alert-error'}`}>
            {alert.message}
          </div>
        )}
        <div className="modal-body">
          <form  onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="mark">Mark</label>
              <input
                type="text"
                id="mark"
                name="mark"
                value={formData.mark}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="outturn">Outturn</label>
              <input
                type="text"
                id="outturn"
                name="outturn"
                value={formData.outturn}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="grade">Grade</label>
              <input
                type="text"
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bags">Bags</label>
              <input
                type="number"
                id="bags"
                name="bags"
                value={formData.bags}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="pockets">Pockets</label>
              <input
                type="number"
                id="pockets"
                name="pockets"
                value={formData.pockets}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="weight">Weight</label>
              <input
                type="number"
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="season">Season</label>
              <input
                type="text"
                id="season"
                name="season"
                value={formData.season}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="certificate">Certificate</label>
              <input
                type="text"
                id="certificate"
                name="certificate"
                value={formData.certificate}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="mill">Mill</label>
              <input
                type="text"
                id="mill"
                name="mill"
                value={formData.mill}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>
              <input
                type="text"
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>

            <div className="form-group">
                <button type="submit" className="btn btn-primary mt-2">Save Changes</button>
                <button className="close-btn btn-btn-danger" onClick={toggleModal}><i class="fas fa-xmark"></i></button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const mapDispatchToProps = { update_coffee_record }; 

export default connect(null, mapDispatchToProps)(Modal);
