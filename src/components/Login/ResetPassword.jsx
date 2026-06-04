import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { notification } from "../../utils/notification";

const ResetPassword = ({ resetPasswordReq, setScreenState, email }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: email,
    otp: "",
    newPassword: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    const { type, name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    console.log("Login attempt:", formData);
    if (!Object.values(formData)) {
      notification.error("All fields are required");
      return;
    }
    if (formData.newPassword !== formData.confirm_password) {
      notification.error("Passwords do not match");
      return;
    }
    //
    const res = await resetPasswordReq(formData);
    console.log("res", res);
    if (res.payload?.message) {
      setLoading(false)
      // Dispatch login action
      // dispatch(login({ username: formData.username, name: 'Alex Rivera' }));
      navigate("/login");
      dispatch(setScreenState());
    }
  };

  return (
    <>
      <div className="bg-background-light min-h-screen flex flex-col font-display">
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-[440px] flex flex-col gap-8">
            {/* Logo & Brand */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-3xl">
                  restaurant
                </span>
              </div>
              <div className="text-center">
                <h1 className="text-slate-900 text-2xl font-bold tracking-tight">
                  TiffinFlow
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                  Admin Management Portal
                </p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-xl shadow-xl shadow-slate-200/50 border border-slate-200 p-8">
              <div className="mb-8">
                <h2 className="text-slate-900 text-xl font-bold">
                  Forgot Password
                </h2>
                {/* <p className="text-slate-500 text-sm mt-1">Enter your credentials to access your dashboard</p> */}
              </div>

              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold text-left">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        person
                      </span>
                    </div>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none cursor-not-allowed"
                      placeholder="john_wick"
                      type="text"
                      disabled
                      required
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-slate-700 text-sm font-semibold text-left">
                    Otp
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        forward_to_inbox
                      </span>
                    </div>
                    <input
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                      placeholder="otp"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 text-sm font-semibold">
                      New Password
                    </label>
                    {/* <a className="text-primary text-xs font-semibold hover:underline decoration-primary/30 underline-offset-4" href="#">
                      Forgot password?
                    </a> */}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                      placeholder="••••••••"
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-700 text-sm font-semibold">
                      Confirm Password
                    </label>
                    {/* <a className="text-primary text-xs font-semibold hover:underline decoration-primary/30 underline-offset-4" href="#">
                      Forgot password?
                    </a> */}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <span className="material-symbols-outlined text-[20px]">
                        lock
                      </span>
                    </div>
                    <input
                      name="confirm_password"
                      value={formData.confirm_password}
                      onChange={handleChange}
                      className="w-full pl-11 pr-11 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200 outline-none"
                      placeholder="••••••••"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                    />
                    <button
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        {showConfirmPassword ? "visibility_off" : "visibility"}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <span
                    className="text-slate-700 text-xs underline cursor-pointer"
                    onClick={() => dispatch(setScreenState("forgotPassword"))}
                  >
                    Back
                  </span>
                </div>
                <button
                  className={`
                    w-full py-3 bg-primary  text-white font-semibold rounded-lg shadow-md shadow-primary/20 transition-all duration-200 mt-2 flex items-center justify-center gap-2
                  ${loading ? "cursor-progress bg-primary/90" : " hover:bg-primary/90"}
                    `}
                  type="submit"
                  disabled={loading}
                >
                  Update Password
                  <span
                    className={`material-symbols-outlined text-[20px] ${loading ? "animate-spin" : ""}`}
                  >
                    {loading ? "progress_activity" : "arrow_forward"}
                  </span>
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100"></div>
            </div>

            {/* Footer Info */}
            <div className="flex flex-col items-center gap-4">
              <p className="text-slate-400 text-xs text-center">
                © {new Date().getFullYear()} TiffinFlow Inc. All rights
                reserved.
                <br />
                Secure login with 256-bit SSL encryption.
              </p>
            </div>
          </div>
        </div>

        {/* Optional Illustration/Background Detail */}
        <div className="fixed bottom-0 right-0 p-8 hidden lg:block pointer-events-none opacity-20">
          <div className="w-64 h-64 bg-primary/10 rounded-full blur-3xl absolute -bottom-32 -right-32"></div>
          <div className="w-48 h-48 bg-primary/5 rounded-full blur-2xl absolute bottom-0 right-32"></div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
