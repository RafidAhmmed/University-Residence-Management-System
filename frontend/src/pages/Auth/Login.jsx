import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { LogIn, User, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "sonner";
import { authAPI } from "../../api/authApi";

const STUDENT_EMAIL_DOMAIN = "student.just.edu.bd";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isAdmin } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "", password: "", name: "", email: "", gender: "", phone: "",
    dateOfBirth: "", session: "", department: "", bloodGroup: "", homeTown: "", allocatedHall: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [registerOptions, setRegisterOptions] = useState({ sessions: [], departments: [], halls: [] });
  const [optionsLoading, setOptionsLoading] = useState(false);

  useEffect(() => {
    const fetchRegisterOptions = async () => {
      if (!isRegister) return;
      setOptionsLoading(true);
      try {
        const response = await authAPI.getRegisterOptions();
        setRegisterOptions({
          sessions: response.data?.sessions || [],
          departments: response.data?.departments || [],
          halls: response.data?.halls || [],
        });
      } catch (error) {
        console.error('Failed to load register options:', error);
        toast.error('Failed to load session/department/hall options');
      } finally {
        setOptionsLoading(false);
      }
    };
    fetchRegisterOptions();
  }, [isRegister]);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (isRegister) {
      if (!formData.name.trim()) newErrors.name = "Name is required";
      else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!formData.department.trim()) {
        newErrors.email = "Select a department first";
      } else if (/^\d{6,8}$/.test(formData.studentId.trim())) {
        const selectedDepartment = registerOptions.departments.find(
          (department) => department.name === formData.department.trim()
        );
        const departmentCode = String(selectedDepartment?.code || "").trim().toLowerCase();
        const studentId = formData.studentId.trim();
        const expectedEmail = `${studentId}.${departmentCode}@${STUDENT_EMAIL_DOMAIN}`;
        if (!departmentCode) newErrors.email = "Department code is missing for the selected department";
        else if (formData.email.trim().toLowerCase() !== expectedEmail) newErrors.email = `Use your varsity email: ${expectedEmail}`;
      }

      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
      if (!formData.session.trim()) newErrors.session = "Session is required";
      if (!formData.department.trim()) newErrors.department = "Department is required";
      if (!formData.allocatedHall.trim()) newErrors.allocatedHall = "Hall is required";
      if (!formData.bloodGroup) newErrors.bloodGroup = "Blood group is required";
      if (!formData.homeTown.trim()) newErrors.homeTown = "Home town is required";
      if (!formData.gender) newErrors.gender = "Gender is required";
    }

    if (isRegister) {
      if (!formData.studentId.trim()) {
        newErrors.studentId = "Student ID is required";
      } else {
        const input = formData.studentId.trim();
        if (!/^\d{6,8}$/.test(input)) newErrors.studentId = "Enter your 6-8 digit Student ID (e.g., 20012001)";
      }
    } else {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim().toLowerCase())) {
        newErrors.email = "Enter a valid email address";
      }
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      if (isRegister) {
        const registerData = {
          ...formData,
          name: formData.name.trim(), studentId: formData.studentId.trim(),
          email: formData.email.trim().toLowerCase(), gender: formData.gender,
          phone: formData.phone.trim(), session: formData.session.trim(),
          department: formData.department.trim(), homeTown: formData.homeTown.trim(),
          allocatedHall: formData.allocatedHall,
        };
        await authAPI.requestRegisterOtp(registerData);
        toast.success("OTP sent to your email. Verify to complete registration.");
        navigate("/verify-otp", { state: { purpose: "register", email: registerData.email } });
      } else {
        const response = await login({
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
        });
        toast.success("Login successful!");
        const from = location.state?.from?.pathname || (response.user.role === "admin" ? "/admin" : "/user/profile");
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "block w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-colors text-gray-900 placeholder-gray-400";
  const errorBorder = "border-danger";
  const normalBorder = "border-gray-200";

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center py-8 px-4">
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative w-full max-w-lg">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-7 sm:p-8">
          {/* Logo & Title */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-white flex items-center justify-center shadow-sm border border-gray-100">
              <img src="/logo.png" alt="JUST Logo" className="w-full h-full object-contain p-0.5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary font-heading">JUST HallSync</h2>
              <p className="text-xs text-secondary font-medium">Jashore University of Science and Technology</p>
            </div>
          </div>

          <div className="mb-5">
            <h3 className="text-xl font-bold text-primary mb-1 font-heading">
              {isRegister ? "Create Account" : "Welcome Back!"}
            </h3>
            <p className="text-gray-500 text-sm">
              {isRegister
                ? "Register for the hall management system"
                : "Enter your email and password to access the hall management system"
              }
            </p>
          </div>

          <div className="mb-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrors({});
                setFormData({ studentId: "", password: "", name: "", email: "", gender: "", phone: "", dateOfBirth: "", session: "", department: "", bloodGroup: "", homeTown: "", allocatedHall: "" });
              }}
              className="text-secondary hover:text-primary text-sm font-medium transition-colors"
            >
              {isRegister ? "Already have an account? Login" : "Don't have an account? Register"}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Registration fields */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={handleChange}
                  className={`${inputClass} ${errors.name ? errorBorder : normalBorder}`} />
                {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
              </div>
            )}

            {isRegister && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input id="email" name="email" type="email" placeholder="id.dept@student.just.edu.bd" value={formData.email} onChange={handleChange}
                    className={`${inputClass} ${errors.email ? errorBorder : normalBorder}`} />
                  {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1.5">Gender</label>
                  <select id="gender" name="gender" value={formData.gender} onChange={handleChange}
                    className={`${inputClass} ${errors.gender ? errorBorder : normalBorder}`}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-xs text-danger">{errors.gender}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <input id="phone" name="phone" type="text" placeholder="01XXXXXXXXX" value={formData.phone} onChange={handleChange}
                    className={`${inputClass} ${errors.phone ? errorBorder : normalBorder}`} />
                  {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1.5">Date of Birth</label>
                  <input id="dateOfBirth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange}
                    className={`${inputClass} ${errors.dateOfBirth ? errorBorder : normalBorder}`} />
                  {errors.dateOfBirth && <p className="mt-1 text-xs text-danger">{errors.dateOfBirth}</p>}
                </div>
                <div>
                  <label htmlFor="session" className="block text-sm font-medium text-gray-700 mb-1.5">Session</label>
                  <select id="session" name="session" value={formData.session} onChange={handleChange} disabled={optionsLoading}
                    className={`${inputClass} ${errors.session ? errorBorder : normalBorder}`}>
                    <option value="">Select Session</option>
                    {registerOptions.sessions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.session && <p className="mt-1 text-xs text-danger">{errors.session}</p>}
                </div>
                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1.5">Department</label>
                  <select id="department" name="department" value={formData.department} onChange={handleChange} disabled={optionsLoading}
                    className={`${inputClass} ${errors.department ? errorBorder : normalBorder}`}>
                    <option value="">Select Department</option>
                    {registerOptions.departments.map((d) => <option key={d.name} value={d.name}>{d.name}</option>)}
                  </select>
                  {errors.department && <p className="mt-1 text-xs text-danger">{errors.department}</p>}
                </div>
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                  <select id="bloodGroup" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange}
                    className={`${inputClass} ${errors.bloodGroup ? errorBorder : normalBorder}`}>
                    <option value="">Select Blood Group</option>
                    {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.bloodGroup && <p className="mt-1 text-xs text-danger">{errors.bloodGroup}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="allocatedHall" className="block text-sm font-medium text-gray-700 mb-1.5">Hall</label>
                  <select id="allocatedHall" name="allocatedHall" value={formData.allocatedHall} onChange={handleChange} disabled={optionsLoading}
                    className={`${inputClass} ${errors.allocatedHall ? errorBorder : normalBorder}`}>
                    <option value="">Select Hall</option>
                    {registerOptions.halls.map((h) => <option key={h.name} value={h.name}>{h.name}</option>)}
                  </select>
                  {errors.allocatedHall && <p className="mt-1 text-xs text-danger">{errors.allocatedHall}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="homeTown" className="block text-sm font-medium text-gray-700 mb-1.5">Home Town</label>
                  <input id="homeTown" name="homeTown" type="text" placeholder="Enter your home town" value={formData.homeTown} onChange={handleChange}
                    className={`${inputClass} ${errors.homeTown ? errorBorder : normalBorder}`} />
                  {errors.homeTown && <p className="mt-1 text-xs text-danger">{errors.homeTown}</p>}
                </div>
              </div>
            )}

            {isRegister && (
              <div>
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-1.5">Student ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" />
                  </div>
                  <input id="studentId" name="studentId" type="text" placeholder="Enter your Student ID" value={formData.studentId} onChange={handleChange}
                    className={`${inputClass} pl-10 ${errors.studentId ? errorBorder : normalBorder}`} />
                </div>
                {errors.studentId && <p className="mt-1 text-xs text-danger">{errors.studentId}</p>}
                <p className="mt-1 text-xs text-gray-400">Use this format: studentId.departmentCode@{STUDENT_EMAIL_DOMAIN}</p>
              </div>
            )}

            {!isRegister && (
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={handleChange}
                  className={`${inputClass} ${errors.email ? errorBorder : normalBorder}`} />
                {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
              </div>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" value={formData.password} onChange={handleChange}
                  className={`${inputClass} pl-10 pr-10 ${errors.password ? errorBorder : normalBorder}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" /> : <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password}</p>}
            </div>

            {/* Remember + Forgot */}
            {!isRegister && (
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-secondary focus:ring-accent border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 text-sm text-gray-600">Remember me</label>
                </div>
                <Link to="/forgot-password" className="text-sm font-medium text-secondary hover:text-primary transition-colors">Forgot password?</Link>
              </div>
            )}

            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-danger px-4 py-2.5 rounded-lg text-xs">{errors.submit}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 rounded-lg font-semibold text-sm bg-accent text-secondary hover:bg-accent-dark transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <><div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin"></div>
                <span>{isRegister ? "Registering..." : "Logging in..."}</span></>
              ) : (
                <><LogIn className="w-4 h-4" /><span>{isRegister ? "Create Account" : "Log In"}</span></>
              )}
            </button>
          </form>
        </div>

        {/* Back to Home */}
        <div className="mt-5 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/10">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
