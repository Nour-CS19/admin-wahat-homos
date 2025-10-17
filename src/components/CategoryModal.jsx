import React, { useState, useEffect } from 'react';
import { FiX, FiSave, FiUpload, FiImage } from 'react-icons/fi';

function CategoryModal({ show, onClose, onSave, editingCategory }) {
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    key: '',
    icon: '',
    order: 0
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingCategory) {
      setFormData({
        nameAr: editingCategory.nameAr || '',
        nameEn: editingCategory.nameEn || '',
        key: editingCategory.key || '',
        icon: editingCategory.icon || '',
        order: editingCategory.order || 0
      });
      // Set existing image preview
      if (editingCategory.imageUrl) {
        setImagePreview(editingCategory.imageUrl);
      }
    } else {
      setFormData({
        nameAr: '',
        nameEn: '',
        key: '',
        icon: '',
        order: 0
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setErrors({});
  }, [editingCategory, show]);

  const validate = () => {
    const newErrors = {};
    if (!formData.nameAr.trim()) newErrors.nameAr = 'Arabic name is required';
    if (!formData.nameEn.trim()) newErrors.nameEn = 'English name is required';
    return newErrors;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length === 0) {
      // Generate key from English name if not editing
      const categoryData = {
        ...formData,
        key: editingCategory ? formData.key : formData.nameEn.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };
      onSave(categoryData, imageFile);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  if (!show) return null;

  return (
    <div 
      className="modal show d-block" 
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div 
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content bg-dark text-light">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">
              {editingCategory ? '✏️ Edit Category' : '➕ Add New Category'}
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {/* Custom CSS for white placeholder */}
            <style>
              {`
                .custom-placeholder::placeholder {
                  color: #ffffff !important;
                  opacity: 0.7;
                }
              `}
            </style>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Name (Arabic) *</label>
                <input 
                  type="text" 
                  className={`form-control bg-dark text-light border-secondary custom-placeholder ${errors.nameAr ? 'is-invalid' : ''}`}
                  value={formData.nameAr}
                  onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                  dir="rtl"
                  placeholder="مشروبات ساخنة"
                />
                {errors.nameAr && <div className="invalid-feedback">{errors.nameAr}</div>}
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Name (English) *</label>
                <input 
                  type="text" 
                  className={`form-control bg-dark text-light border-secondary custom-placeholder ${errors.nameEn ? 'is-invalid' : ''}`}
                  value={formData.nameEn}
                  onChange={(e) => setFormData({...formData, nameEn: e.target.value})}
                  placeholder="Hot Beverages"
                />
                {errors.nameEn && <div className="invalid-feedback">{errors.nameEn}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Category Image (Optional)</label>
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
                className="form-control bg-dark text-light border-secondary"
                accept="image/*"
                onChange={handleImageChange}
                id="categoryImageInput"
              />
              <small className="text-secondary d-block mt-1">
                <FiUpload size={12} className="me-1" />
                Upload an image (JPG, PNG, max 5MB)
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input 
                type="number" 
                className="form-control bg-dark text-light border-secondary"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value) || 0})}
                min="0"
                placeholder="0"
              />
              <small className="text-secondary">Lower numbers appear first</small>
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
              {editingCategory ? 'Update' : 'Add'} Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;