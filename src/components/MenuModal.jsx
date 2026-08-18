import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUpload, FiImage } from 'react-icons/fi';

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
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

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

      setImagePreview(editingItem.imageUrl || null);
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        descriptionAr: '',
        descriptionEn: '',
        price: '',
        category: categories.length > 0 ? categories[0].key : ''
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
  }, [editingItem, show, categories]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

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
      onSave(formData, imageFile);
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

            <div className="mb-3">
              <label className="form-label">Item Image (Optional)</label>
              <div className="mb-2 d-flex justify-content-center">
                {imagePreview ? (
                  <div className="position-relative d-inline-block">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{
                        width: '150px',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '2px solid #8B4513'
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2"
                      onClick={removeImage}
                      style={{ padding: '4px 8px' }}
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{
                      width: '150px',
                      height: '150px',
                      backgroundColor: '#3d3d3d',
                      borderRadius: '8px',
                      border: '2px dashed #8B4513'
                    }}
                  >
                    <FiImage size={40} color="#8B4513" />
                  </div>
                )}
              </div>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
              <small className="text-secondary d-block mt-1">
                <FiUpload size={12} className="me-1" />
                Upload an image (JPG, PNG, max 5MB)
              </small>
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
