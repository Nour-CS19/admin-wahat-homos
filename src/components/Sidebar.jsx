import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiGrid, 
  FiList, 
  FiTag, 
  FiLogOut,
  FiX
} from 'react-icons/fi';

function Sidebar({ onLogout, isOpen, closeSidebar }) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: FiGrid, label: 'Dashboard', exactMatch: true },
    { path: '/menu-items', icon: FiList, label: 'Menu Items' },
    { path: '/categories', icon: FiTag, label: 'Categories' }
  ];

  const isActive = (path, exactMatch) => {
    if (exactMatch) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when a link is clicked
    if (window.innerWidth < 992) {
      closeSidebar();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="d-lg-none"
          onClick={closeSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 998,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}

      {/* Sidebar */}
      <div 
        className="sidebar d-flex flex-column"
        style={{
          width: '250px',
          minHeight: '100vh',
          backgroundColor: '#2d2d2d',
          position: 'fixed',
          left: isOpen ? 0 : '-250px',
          top: 0,
          borderRight: '2px solid #8B4513',
          zIndex: 1000,
          transition: 'left 0.3s ease',
          overflowY: 'auto'
        }}
      >
        {/* Logo with Close Button on Mobile */}
        <div 
          className="p-4 text-center position-relative"
          style={{ borderBottom: '1px solid #444' }}
        >
          <button
            onClick={closeSidebar}
            className="btn btn-link text-light p-0 position-absolute d-lg-none"
            style={{ 
              top: '15px',
              right: '15px',
              fontSize: '24px',
              textDecoration: 'none',
              border: 'none'
            }}
            aria-label="Close sidebar"
          >
            <FiX size={24} />
          </button>
          <h4 className="text-light mb-0" style={{ fontWeight: 'bold' }}>
            ☕ Admin Panel
          </h4>
        </div>

        {/* Menu Items */}
        <nav className="flex-grow-1 p-3">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exactMatch);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className="d-flex align-items-center p-3 mb-2 text-decoration-none rounded"
                style={{
                  backgroundColor: active ? '#8B4513' : 'transparent',
                  color: active ? '#fff' : '#aaa',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'rgba(139, 69, 19, 0.2)';
                    e.currentTarget.style.color = '#fff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#aaa';
                  }
                }}
              >
                <Icon size={20} style={{ marginRight: '12px' }} />
                <span style={{ fontWeight: active ? 'bold' : 'normal' }}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3" style={{ borderTop: '1px solid #444' }}>
          <button
            onClick={onLogout}
            className="d-flex align-items-center p-3 w-100 btn btn-outline-danger rounded"
            style={{
              border: '2px solid #dc3545',
              transition: 'all 0.3s ease'
            }}
          >
            <FiLogOut size={20} style={{ marginRight: '12px' }} />
            <span style={{ fontWeight: 'bold' }}>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;