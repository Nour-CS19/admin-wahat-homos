import React, { useState, useEffect } from 'react';
import { getAllMenuItems } from '../services/menuService';
import { getAllCategories } from '../services/categoryService';
import { 
  FiShoppingBag, 
  FiTag, 
  FiDollarSign,
  FiTrendingUp,
  FiImage
} from 'react-icons/fi';

function DashboardPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    const totalItems = menuItems.length;
    const totalCategories = categories.length;
    const avgPrice = menuItems.length > 0
      ? (menuItems.reduce((sum, item) => sum + parseFloat(item.price || 0), 0) / menuItems.length).toFixed(2)
      : 0;
    
    const categoryStats = categories.map(cat => ({
      ...cat,
      count: menuItems.filter(item => item.category === cat.key).length
    }));

    return { totalItems, totalCategories, avgPrice, categoryStats };
  };

  const stats = getStats();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-light" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="text-light mb-4">
        <FiTrendingUp className="me-2" />
        Dashboard Overview
      </h2>

      {/* === Stats Cards === */}
      <div className="row mb-4">
        {/* Total Menu Items */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark text-light h-100" style={{ border: '2px solid #8B4513', borderRadius: '10px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-secondary mb-1">Total Menu Items</p>
                  <h2 className="mb-0 fw-bold">{stats.totalItems}</h2>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', backgroundColor: 'rgba(139, 69, 19, 0.2)' }}>
                  <FiShoppingBag size={30} color="#8B4513" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Categories */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark text-light h-100" style={{ border: '2px solid #6B8E23', borderRadius: '10px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-secondary mb-1">Total Categories</p>
                  <h2 className="mb-0 fw-bold">{stats.totalCategories}</h2>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', backgroundColor: 'rgba(107, 142, 35, 0.2)' }}>
                  <FiTag size={30} color="#6B8E23" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Average Price */}
        <div className="col-md-4 mb-3">
          <div className="card bg-dark text-light h-100" style={{ border: '2px solid #4682B4', borderRadius: '10px' }}>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-secondary mb-1">Average Price</p>
                  <h2 className="mb-0 fw-bold">{stats.avgPrice} ج.م</h2>
                </div>
                <div className="rounded-circle d-flex align-items-center justify-content-center"
                     style={{ width: '60px', height: '60px', backgroundColor: 'rgba(70, 130, 180, 0.2)' }}>
                  <FiDollarSign size={30} color="#4682B4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Category Breakdown === */}
      <div className="row">
        <div className="col-12">
          <div className="card bg-dark text-light" style={{ border: '2px solid #8B4513', borderRadius: '10px' }}>
            <div className="card-header bg-transparent border-secondary">
              <h5 className="mb-0">Items by Category</h5>
            </div>
            <div className="card-body">
              {stats.categoryStats.length > 0 ? (
                <div className="row">
                  {stats.categoryStats.map(cat => (
                    <div key={cat.id} className="col-md-6 col-lg-3 mb-3">
                      <div className="p-3 rounded" style={{ backgroundColor: '#2d2d2d', border: '1px solid #444' }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <div>
                            <div className="mb-2 fs-2">
                              {cat.imageUrl ? (
                                <img 
                                  src={cat.imageUrl} 
                                  alt={cat.nameEn}
                                  style={{
                                    width: '50px',
                                    height: '50px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '2px solid #8B4513'
                                  }}
                                />
                              ) : (
                                cat.icon
                              )}
                            </div>
                            <h6 className="mb-1">{cat.nameEn}</h6>
                            <p className="text-secondary mb-0" dir="rtl">{cat.nameAr}</p>
                          </div>
                          <div className="text-end">
                            <h3 className="mb-0" style={{ color: '#8B4513' }}>{cat.count}</h3>
                            <small className="text-secondary">items</small>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-secondary mb-0">No categories available. Add categories first!</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* === Recent Items Table === */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card bg-dark text-light" style={{ border: '2px solid #8B4513', borderRadius: '10px' }}>
            <div className="card-header bg-transparent border-secondary">
              <h5 className="mb-0">Recent Menu Items</h5>
            </div>
            <div className="card-body">
              {menuItems.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Image</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Name (EN)</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Name (AR)</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Category</th>
                        <th style={{ textAlign: 'center', verticalAlign: 'middle' }}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.slice(0, 5).map(item => {
                        const category = categories.find(cat => cat.key === item.category);
                        return (
                          <tr key={item.id}>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <div className="d-flex justify-content-center">
                                {item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.nameEn}
                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '2px solid #8B4513' }}
                                  />
                                ) : (
                                  <div className="d-flex align-items-center justify-content-center"
                                       style={{ width: '60px', height: '60px', backgroundColor: '#3d3d3d', borderRadius: '8px', border: '2px dashed #8B4513' }}>
                                    <FiImage size={24} color="#8B4513" />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.nameEn}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>{item.nameAr}</td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              {category ? (
                                <span className="badge" style={{ backgroundColor: '#8B4513', padding: '8px 12px', fontSize: '0.9rem' }}>
                                  {category.imageUrl ? (
                                    <img 
                                      src={category.imageUrl} 
                                      alt={category.nameEn}
                                      style={{
                                        width: '20px',
                                        height: '20px',
                                        objectFit: 'cover',
                                        borderRadius: '4px',
                                        marginRight: '5px'
                                      }}
                                    />
                                  ) : (
                                    category.icon + ' '
                                  )}
                                  {category.nameEn}
                                </span>
                              ) : (
                                <span className="badge bg-secondary" style={{ padding: '8px 12px', fontSize: '0.9rem' }}>
                                  ⚠️ No Category
                                </span>
                              )}
                            </td>
                            <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                              <strong style={{ fontSize: '1.1rem' }}>{item.price} ج.م</strong>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center text-secondary mb-0">No menu items yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;