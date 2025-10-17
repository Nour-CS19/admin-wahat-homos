import React, { useState, useEffect } from 'react';
import MenuModal from '../components/MenuModal';
import { 
  getAllMenuItems, 
  addMenuItem, 
  updateMenuItem, 
  deleteMenuItem 
} from '../services/menuService';
import { getAllCategories } from '../services/categoryService';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiSearch,
  FiList,
  FiImage
} from 'react-icons/fi';

function MenuItemsPage() {
  // State management
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Fetch menu items and categories from Firebase
  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsData, categoriesData] = await Promise.all([
        getAllMenuItems(),
        getAllCategories()
      ]);
      setMenuItems(itemsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error loading data. Please check your Firebase configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Save (add or update) menu item
  const handleSave = async (formData, imageFile) => {
    try {
      if (editingItem) {
        // Update existing item
        await updateMenuItem(
          editingItem.id, 
          formData, 
          imageFile, 
          editingItem.imagePath
        );
      } else {
        // Add new item
        await addMenuItem(formData, imageFile);
      }
      await fetchData(); // Refresh data
      handleCloseModal();
    } catch (error) {
      console.error('Error saving item:', error);
      alert('Error saving item. Please try again.');
    }
  };

  // Delete menu item
  const handleDelete = async (item) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteMenuItem(item.id, item.imagePath);
        await fetchData(); // Refresh data
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Error deleting item. Please try again.');
      }
    }
  };

  // Open modal for editing
  const handleEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  // Close modal and reset editing state
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  // Get category information by key
  const getCategoryInfo = (categoryKey) => {
    return categories.find(cat => cat.key === categoryKey);
  };

  // Filter items based on search and category
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesSearch = 
      item.nameAr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nameEn.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container-fluid py-4">
      {/* Custom CSS for placeholder and select arrow */}
      <style>
        {`
          .custom-search-input::placeholder {
            color: #ffffff !important;
            opacity: 0.7;
          }
          
          .custom-select {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 0.75rem center;
            background-size: 16px 12px;
          }
        `}
      </style>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-light mb-0">
          <FiList className="me-2" />
          Menu Items Management
        </h2>
        <button 
          className="btn btn-success btn-lg"
          onClick={() => setShowModal(true)}
        >
          <FiPlus size={20} className="me-2" />
          Add New Item
        </button>
      </div>

      {/* Filters */}
      <div 
        className="card bg-dark text-light mb-4"
        style={{ border: '2px solid #8B4513', borderRadius: '10px' }}
      >
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="input-group">
                <span className="input-group-text bg-dark text-light border-secondary">
                  <FiSearch />
                </span>
                <input 
                  type="text"
                  className="form-control bg-dark text-light border-secondary custom-search-input"
                  placeholder="Search by name (Arabic or English)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <select 
                className="form-select bg-dark text-light border-secondary custom-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.key}>
                    {cat.icon} {cat.nameEn} / {cat.nameAr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div 
          className="card bg-dark text-light"
          style={{ border: '2px solid #8B4513', borderRadius: '10px' }}
        >
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-dark table-hover" style={{ tableLayout: 'auto', width: '100%' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #8B4513' }}>
                    <th style={{ width: '80px', textAlign: 'center', verticalAlign: 'middle' }}>Image</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Name (EN)</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle', paddingRight: '40px' }}>Name (AR)</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle', paddingLeft: '40px' }}>Category</th>
                    <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Price</th>
                    <th style={{ width: '150px', textAlign: 'center', verticalAlign: 'middle' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => {
                    const category = getCategoryInfo(item.category);
                    return (
                      <tr key={item.id}>
                        {/* Image Column */}
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <div className="d-flex justify-content-center">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.nameEn}
                                style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  objectFit: 'cover',
                                  borderRadius: '8px',
                                  border: '2px solid #8B4513'
                                }}
                              />
                            ) : (
                              <div 
                                className="d-flex align-items-center justify-content-center"
                                style={{ 
                                  width: '60px', 
                                  height: '60px', 
                                  backgroundColor: '#3d3d3d',
                                  borderRadius: '8px',
                                  border: '2px dashed #8B4513'
                                }}
                              >
                                <FiImage size={24} color="#8B4513" />
                              </div>
                            )}
                          </div>
                        </td>

                        {/* English Name */}
                        <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                          {item.nameEn}
                        </td>

                        {/* Arabic Name */}
                        <td style={{ 
                          verticalAlign: 'middle', 
                          textAlign: 'center',
                          paddingRight: '40px'
                        }}>
                          {item.nameAr}
                        </td>

                        {/* Category Badge */}
                        <td style={{ verticalAlign: 'middle', textAlign: 'center', paddingLeft: '40px' }}>
                          {category && (
                            <span 
                              className="badge" 
                              style={{ 
                                backgroundColor: '#8B4513',
                                padding: '8px 12px',
                                fontSize: '0.9rem'
                              }}
                            >
                              {category.icon} {category.nameEn}
                            </span>
                          )}
                        </td>

                        {/* Price */}
                        <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                          <strong style={{ fontSize: '1.1rem' }}>
                            {item.price} ج.م
                          </strong>
                        </td>

                        {/* Action Buttons */}
                        <td style={{ verticalAlign: 'middle', textAlign: 'center' }}>
                          <button 
                            className="btn btn-sm btn-warning me-2"
                            onClick={() => handleEdit(item)}
                            title="Edit item"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button 
                            className="btn btn-sm btn-danger"
                            onClick={() => handleDelete(item)}
                            title="Delete item"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              
              {/* Empty State */}
              {filteredItems.length === 0 && (
                <div className="text-center py-5">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                    🍽️
                  </div>
                  <h4 className="text-light mb-3">
                    {searchTerm || filterCategory !== 'all' 
                      ? 'No items match your filters' 
                      : 'No menu items yet'}
                  </h4>
                  <p className="text-secondary mb-4">
                    {searchTerm || filterCategory !== 'all'
                      ? 'Try adjusting your search or filter criteria'
                      : 'Start by adding your first menu item'}
                  </p>
                  {!searchTerm && filterCategory === 'all' && (
                    <button 
                      className="btn btn-success btn-lg"
                      onClick={() => setShowModal(true)}
                    >
                      <FiPlus size={20} className="me-2" />
                      Add Your First Item
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal for Add/Edit */}
      <MenuModal 
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
        categories={categories}
      />
    </div>
  );
}

export default MenuItemsPage;