import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/authService';
import { FiCoffee, FiEye, FiEyeOff, FiLock, FiMail } from 'react-icons/fi';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page min-vh-100 d-flex align-items-center justify-content-center">
      <div className="login-overlay" />
      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-11 col-sm-9 col-md-7 col-lg-5 col-xl-4">
            <div className="login-card text-light shadow-lg">
              <div className="card-body p-4 p-md-5">
                <div className="text-center mb-4">
                  <div className="login-logo mb-3"><FiCoffee size={32} /></div>
                  <p className="login-kicker mb-2">COFFEE MENU</p>
                  <h2 className="mb-2">Welcome back</h2>
                  <p className="login-subtitle mb-0">Sign in to manage your cafe dashboard</p>
                </div>

                {error && <div className="alert alert-danger login-alert" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label login-label">Email Address</label>
                    <div className="login-input-wrapper">
                      <FiMail className="login-input-icon" size={18} />
                      <input
                        type="email"
                        className="form-control form-control-lg login-input"
                        placeholder="admin@cafe.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label login-label">Password</label>
                    <div className="login-input-wrapper">
                      <FiLock className="login-input-icon" size={18} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control form-control-lg login-input login-password-input"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={loading}
                        required
                      />
                      <button
                        type="button"
                        className="login-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn btn-lg w-100 mb-3 login-button" disabled={loading}>
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-2" />Logging in...</>
                    ) : 'Login to Dashboard'}
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
