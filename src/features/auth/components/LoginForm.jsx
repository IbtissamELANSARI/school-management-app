import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router'; // Ensure react-router is used
import { useDispatch, useSelector } from 'react-redux';
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { login, clearError } from '../../auth/slices/authSlice'; // Verify this path

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Get auth states from Redux
  const isLoading = useSelector((state) => state.auth.status === 'loading');
  const error = useSelector((state) => state.auth.error); // This `error` comes from your Redux slice
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Local state for client-side validation errors (optional, but good for immediate feedback)
  const [localErrors, setLocalErrors] = useState({});

  // Handler for form field changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear specific local error when input changes
    if (localErrors[name]) {
      setLocalErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
    // Also clear global Redux error if input changes
    if (error) {
      dispatch(clearError());
    }
  };

  // Clear any existing Redux errors when component mounts or unmounts
  useEffect(() => {
    dispatch(clearError());
    return () => dispatch(clearError());
  }, [dispatch]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(location.state?.from || '/home');
    }
  }, [isAuthenticated, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation before dispatching to Redux
    const currentErrors = {};
    if (!formData.email) {
      currentErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      currentErrors.email = 'Email format is invalid.';
    }
    if (!formData.password) {
      currentErrors.password = 'Password is required.';
    }

    if (Object.keys(currentErrors).length > 0) {
      setLocalErrors(currentErrors);
      // If there are local errors, don't proceed with API call
      return;
    }

    // Clear local errors before dispatching if validation passed
    setLocalErrors({});
    dispatch(clearError()); // Clear any previous Redux error before new attempt

    const resultAction = await dispatch(login(formData));

    if (login.fulfilled.match(resultAction)) {
      // Login successful, navigate
      navigate(location.state?.from || '/home');
    }
    // No explicit else for rejected, as the Redux error state will handle displaying it
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl font-bold text-center justify-center mb-2">
            Welcome Back!
          </h2>
          <p className="text-center text-base-content/60 mb-6">Please sign in to your account</p>

          {/* Display Redux error (from API/Thunk) */}
          {error && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email" // Add name attribute for easier handling
                  placeholder="your@email.com"
                  className={`input input-bordered w-full pl-10 ${localErrors.email ? 'input-error' : ''}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              {/* Display local validation error for email */}
              {localErrors.email && (
                <label className="label">
                  <span className="label-text-alt text-error">{localErrors.email}</span>
                </label>
              )}
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
                <Link to="/forgot-password" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
              <div className="relative">
                <input
                  type="password"
                  name="password" // Add name attribute
                  placeholder="••••••••"
                  className={`input input-bordered w-full pl-10 ${localErrors.password ? 'input-error' : ''}`}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-base-content/40" />
              </div>
              {/* Display local validation error for password */}
              {localErrors.password && (
                <label className="label">
                  <span className="label-text-alt text-error">{localErrors.password}</span>
                </label>
              )}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe" // Add name attribute
                className="checkbox checkbox-primary"
                checked={formData.rememberMe}
                onChange={handleInputChange}
              />
              <span className="label-text">Remember me</span>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center mt-6">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;