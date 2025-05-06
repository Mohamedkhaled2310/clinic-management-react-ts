
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthPage: React.FC = () => {
  const [isLoginView, setIsLoginView] = useState(true);
  const { user } = useAuth();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              {isLoginView ? "Welcome Back" : "Create Your Account"}
            </h1>
            <p className="mt-2 text-gray-600">
              {isLoginView
                ? "Sign in to access your ClinicCare account"
                : "Join ClinicCare to book and manage your appointments"}
            </p>
          </div>

          {isLoginView ? (
            <LoginForm onToggleForm={() => setIsLoginView(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLoginView(true)} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AuthPage;
