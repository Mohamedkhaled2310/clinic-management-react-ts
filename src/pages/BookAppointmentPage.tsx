
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import AppointmentForm from "@/components/appointments/AppointmentForm";

const BookAppointmentPage: React.FC = () => {
  const { user } = useAuth();

  // Only patients can book appointments
  if (!user || user.role !== "patient") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">Book an Appointment</h1>
        
        <div className="max-w-md mx-auto">
          <AppointmentForm />
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointmentPage;
