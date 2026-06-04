import React, { Suspense } from "react";
import { connect } from "react-redux";
import {
  loginUser,
  setScreenState,
  setEmail,
  resetPasswordReq,
  forgotPasswordReq,
} from "./authSlice";
import { ToastContainer } from "react-toastify";

const Login = React.lazy(() => import("../../components/Login/Login"));
const ForgotPasssword = React.lazy(
  () => import("../../components/Login/ForgotPasssword"),
);
const ResetPassword = React.lazy(
  () => import("../../components/Login/ResetPassword"),
);

const AuthContainer = ({
  loginUser,
  screenState,
  setEmail,
  setScreenState,
  resetPasswordReq,
  forgotPasswordReq,
  email,
  props,
}) => {
  const returnComponent = () => {
    if (screenState === "resetPassword") {
      return (
        <ResetPassword
          {...props}
          loginUser={loginUser}
          setScreenState={setScreenState}
          resetPasswordReq={resetPasswordReq}
          forgotPasswordReq={forgotPasswordReq}
          email={email}
        />
      );
    } else if (screenState === "forgotPassword") {
      return (
        <ForgotPasssword
          {...props}
          loginUser={loginUser}
          setScreenState={setScreenState}
          setEmail={setEmail}
          resetPasswordReq={resetPasswordReq}
          forgotPasswordReq={forgotPasswordReq}
        />
      );
    } else {
      return (
        <>
          <Login
            {...props}
            loginUser={loginUser}
            setScreenState={setScreenState}
          />
        </>
      );
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {returnComponent()}
    </>
  );
};

const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
const selectUser = (state) => state.auth.user;
const selectScreenState = (state) => state.auth.screenState;
const selectEmail = (state) => state.auth.email;

const mapStateToProps = (state) => ({
  isAuthenticated: selectIsAuthenticated(state),
  user: selectUser(state),
  screenState: selectScreenState(state),
  email: selectEmail(state),
});

const mapDispatchToProps = {
  loginUser,
  setScreenState,
  setEmail,
  resetPasswordReq,
  forgotPasswordReq,
};

export default connect(mapStateToProps, mapDispatchToProps)(AuthContainer);
