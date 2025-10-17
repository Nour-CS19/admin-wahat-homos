import React, { useState, useEffect } from 'react';
import CategoryModal from '../components/CategoryModal';
import { 
  getAllCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/categoryService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiTag,
  FiImage 
} from 'react-icons/fi';

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      alert('Error loading categories. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData, imageFile) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData, imageFile, editingCategory.imagePath);
      } else {
        await addCategory(formData, imageFile);
      }
      await fetchCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        await deleteCategory(category.id, category.imagePath);
        await fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category. Please try again.');
      }
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="container-fluid py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-light mb-0">
          <FiTag className="me-2" />
          Categories Management
        </h2>
        <button 
          className="btn btn-success btn-lg"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={20} className="me-2" />
          Add New Category
        </button>
      </div>

      {/* Categories Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row">
          {categories.map((category) => (
            <div key={category.id} className="col-md-6 col-lg-4 mb-4">
              <div 
                className="card bg-dark text-light h-100"
                style={{ 
                  border: '2px solid #8B4513',
                  borderRadius: '10px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(139, 69, 19, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between mb-3">
                    {/* Category Image or Placeholder */}
                    <div>
                      {category.imageUrl ? (
                        <img 
                          src={category.imageUrl} 
                          alt={category.nameEn}
                          style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '10px',
                            border: '2px solid #8B4513'
                          }}
                        />
                      ) : (
                        <div 
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#3d3d3d',
                            borderRadius: '10px',
                            border: '2px dashed #8B4513'
                          }}
                        >
                          <FiImage size={32} color="#8B4513" />
                        </div>
                      )}
                    </div>
                    <span 
                      className="badge"
                      style={{ backgroundColor: '#8B4513', fontSize: '0.9rem' }}
                    >
                      Order: {category.order}
                    </span>
                  </div>
                  
                  <h4 className="mb-2">{category.nameEn}</h4>
                  <p className="text-secondary mb-3" dir="rtl">
                    {category.nameAr}
                  </p>
                  
                  <div className="mb-3">
                    <code className="text-info">Key: {category.key}</code>
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-warning btn-sm flex-fill"
                      onClick={() => handleEdit(category)}
                    >
                      <FiEdit2 size={16} className="me-1" />
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm flex-fill"
                      onClick={() => handleDelete(category)}
                    >
                      <FiTrash2 size={16} className="me-1" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="col-12 text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                🏷️
              </div>
              <h4 className="text-light mb-3">No categories yet</h4>
              <p className="text-secondary mb-4">
                Start by adding your first category to organize your menu items
              </p>
              <button 
                className="btn btn-success btn-lg"
                onClick={() => setShowModal(true)}
              >
                <FiPlus size={20} className="me-2" />
                Add Your First Category
              </button>
            </div>
          )}
        </div>
      )}

      <CategoryModal 
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingCategory={editingCategory}
      />
    </div>
  );
}

export default CategoriesPage;