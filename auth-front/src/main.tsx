import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";
import App from "./App.tsx";
import About from "./pages/About.tsx";
import Login from "./pages/Login.tsx";
import Signup from "./pages/Signup.tsx";
import Services from "./pages/Services.tsx";
import RootLayout from "./pages/RootLayout.tsx";
import Userlayout from "./pages/users/Userlayout.tsx";
import Userhome from "./pages/users/Userhome.tsx";
import Userprofile from "./pages/users/Userprofile.tsx";
import AdminUsers from "./pages/users/AdminUsers.tsx";
import OAuthSuccess from "./pages/OAuthSuccess.tsx";
import OAuthFailure from "./pages/OAuthFailure.tsx";
import ForgotPassword from "./pages/ForgotPassword.tsx";
import ResetPassword from "./pages/ResetPassword.tsx";
import VerifyEmail from "./pages/VerifyEmail.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<App />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="services" element={<Services />} />
          <Route path="about" element={<About />} />

          <Route path="dashboard" element={<Userlayout />}>
            <Route index element={<Userhome />} />
            <Route path="profile" element={<Userprofile />} />
            <Route path="admin" element={<AdminUsers />} />
          </Route>

          <Route path="oauth/success" element={<OAuthSuccess />} />
          <Route path="oauth/failure" element={<OAuthFailure />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
