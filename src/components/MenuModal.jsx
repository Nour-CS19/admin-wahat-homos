import React, { useState, useEffect } from 'react';
import { FiX, FiSave } from 'react-icons/fi';

function MenuModal({ show, onClose, onSave, editingItem, categories }) {
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    descriptionAr: '',
    descriptionEn: '',
    price: '',
    category: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingItem) {
      setFormData({
        nameAr: editingItem.nameAr || '',
        nameEn: editingItem.nameEn || '',
        descriptionAr: editingItem.descriptionAr || '',
        descriptionEn: editingItem.descriptionEn || '',
        price: editingItem.price || '',
        category: editingItem.category || ''
      });
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        price: '',
        category: categories.length > 0 ? categories[0].key : ''
      });
    }
    setErrors({});
  }, [editingItem, show, categories]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = 'Arabic name is required';
    if (!formData.nameEn.trim()) newErrors.nameEn = 'English name is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      onSave(formData, null); // No image support
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  if (!show) return null;

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-light">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">
              {editingItem ? '✏️ Edit Menu Item' : '➕ Add New Menu Item'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Name Fields */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name (Arabic) *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.nameAr ? 'is-invalid' : ''}`}
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                  dir="rtl"
                  placeholder="لاتيه"
                />
                {errors.nameAr && <div className="invalid-feedback">{errors.nameAr}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Name (English) *</label>
                <input 
                  type="text" 
                  className={`form-control ${errors.nameEn ? 'is-invalid' : ''}`}
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  placeholder="Latte"
                />
                {errors.nameEn && <div className="invalid-feedback">{errors.nameEn}</div>}
              </div>
            </div>

            {/* Description Fields */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Description (Arabic)</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={formData.descriptionAr}
                  onChange={(e) => setFormData({...formData, descriptionAr: e.target.value})}
                  dir="rtl"
                  placeholder="قهوة إسبريسو مع حليب مبخر"
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Description (English)</label>
                <textarea 
                  className="form-control"
                  rows="3"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({...formData, descriptionEn: e.target.value})}
                  placeholder="Espresso with steamed milk"
                />
              </div>
            </div>

            {/* Price and Category */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (EGP) *</label>
                <input 
                  type="number" 
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  min="0"
                  step="0.01"
                  placeholder="15.00"
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Category *</label>
                <select 
                  className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.key}>
                      {cat.icon} {cat.nameEn} / {cat.nameAr}
                    </option>
                  ))}
                </select>
                {errors.category && <div className="invalid-feedback">{errors.category}</div>}
              </div>
            </div>
          </div>
          <div className="modal-footer border-secondary">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onClose}
            >
              <FiX size={18} className="me-2" />
              Cancel
            </button>
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              <FiSave size={18} className="me-2" />
              {editingItem ? 'Update' : 'Add'} Item
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MenuModal;