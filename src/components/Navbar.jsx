import React from 'react';
import { FiUser, FiMenu, FiX } from 'react-icons/fi';

function Navbar({ user, sidebarOpen, toggleSidebar }) {
  return (
    <nav 
      className="navbar navbar-dark"
      style={{
        backgroundColor: '#2d2d2d',
        borderBottom: '2px solid #8B4513',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transition: 'padding-left 0.3s ease',
        paddingLeft: sidebarOpen && window.innerWidth >= 992 ? '250px' : '0',
        width: '100%'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <button
            onClick={toggleSidebar}
            className="btn btn-link text-light p-0 me-3"
            style={{ 
              fontSize: '24px',
              textDecoration: 'none',
              border: 'none'
            }}
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
          <span className="navbar-brand mb-0 h1">
            Dashboard
          </span>
        </div>
        {user && (
          <div className="d-flex align-items-center text-light">
            <FiUser size={24} style={{ marginRight: '8px' }} />
            <span className="d-none d-md-inline">{user.email}</span>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;