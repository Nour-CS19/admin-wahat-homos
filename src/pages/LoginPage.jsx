import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { FiLock, FiMail } from 'react-icons/fi';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
  
    try {
      await loginUser(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      console.log(err);  // ← هنا تستخدمه فعلاً
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center" 
      style={{ 
        backgroundColor: '#1a1a1a',
        backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)'
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            <div 
              className="card bg-dark text-light shadow-lg" 
              style={{ 
                border: '2px solid #8B4513',
                borderRadius: '15px'
              }}
            >
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div 
                    className="mb-3"
                    style={{ 
                      fontSize: '3rem',
                      color: '#8B4513'
                    }}
                  >
                    ☕
                  </div>
                  <h2 className="mb-2" style={{ fontWeight: 'bold' }}>Admin Login</h2>
                  <p className="text-secondary">Access your dashboard</p>
                </div>
                
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">
                      <FiMail className="me-2" />
                      Email Address
                    </label>
                    <input 
                      type="email" 
                      className="form-control form-control-lg"
                      placeholder="admin@cafe.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">
                      <FiLock className="me-2" />
                      Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control form-control-lg"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-lg w-100 mb-3"
                    style={{ 
                      backgroundColor: '#8B4513', 
                      border: 'none', 
                      color: '#fff',
                      fontWeight: 'bold'
                    }}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Logging in...
                      </>
                    ) : (
                      'Login to Dashboard'
                    )}
                  </button>
                </form>

                <div className="alert alert-info text-center mb-0">
                  <small>
                    <strong>Setup Required:</strong><br />
                    Create admin account in Firebase Authentication
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;