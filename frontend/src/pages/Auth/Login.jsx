import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  LogIn,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Home,
  Users,
  Calendar,
  FileText,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [formData, setFormData] = useState({
    studentId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated()) {
      if (isAdmin()) {
        navigate("/admin", { replace: true });
      } else {
        navigate("/user/profile", { replace: true });
      }
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate Student ID
    if (!formData.studentId.trim()) {
      newErrors.studentId = "Student ID is required";
    } else {
      const input = formData.studentId.trim();
      const isStudentID = /^\d{6,8}$/.test(input);

      if (!isStudentID) {
        newErrors.studentId =
          "Enter your 6-8 digit Student ID (e.g., 20012001)";
      }
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await login(formData);

      toast.success("Login successful!");

      // Redirect based on role
      const from =
        location.state?.from?.pathname ||
        (response.data.user.role === "admin" ? "/admin" : "/user/profile");
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message || "Invalid Student ID or password";
      setErrors({ submit: errorMessage });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#19aaba] via-[#158c99] to-[#116d77] flex items-center justify-center py-6 sm:py-8 md:py-12 px-3 sm:px-4 lg:px-8">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

      <div className="relative max-w-6xl">
        <div className="grid md:grid-cols-1 gap-6 sm:gap-8 items-start">
          {/* Left Side - Login Card */}
          <div className="order-2 md:order-1">
            {/* Login Card */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 backdrop-blur-lg">
              {/* Logo and Title */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg flex items-center justify-center shadow-md overflow-hidden border-2 border-red-500">
                  <img
                    src="/logo.png"
                    alt="JUST Hall Management Logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Hall Management
                  </h2>
                  <p className="text-xs sm:text-sm text-[#19aaba] font-semibold">
                    Jashore University of Science and Technology
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Welcome Back!
                </h3>
                <p className="text-gray-600 text-sm">
                  Enter your Student ID and password to access the hall
                  management system
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
                {/* Student ID Input */}
                <div>
                  <label
                    htmlFor="studentId"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="studentId"
                      name="studentId"
                      type="text"
                      placeholder="Enter your Student ID (e.g., 20012001)"
                      value={formData.studentId}
                      onChange={handleChange}
                      className={`block w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.studentId ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                  </div>
                  {errors.studentId && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">
                      {errors.studentId}
                    </p>
                  )}
                </div>

                {/* Password Input */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`block w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border ${
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-xl focus:ring-2 focus:ring-[#19aaba] focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      ) : (
                        <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600">
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Remember me and Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-[#19aaba] focus:ring-[#19aaba] border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-xs sm:text-sm text-gray-700 cursor-pointer"
                    >
                      Remember me
                    </label>
                  </div>
                  <Link
                    to="/forgot-password"
                    className="text-xs sm:text-sm font-medium text-[#19aaba] hover:text-[#158c99] transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs sm:text-sm">
                    {errors.submit}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-[#19aaba] to-[#158c99] hover:from-[#158c99] hover:to-[#116d77] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#19aaba] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Login to Hall System</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Back to Home */}
            <div className="mt-4 sm:mt-6 text-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white hover:text-gray-200 transition-colors duration-200 font-medium text-sm sm:text-base px-4 py-2 rounded-lg hover:bg-white/10"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
