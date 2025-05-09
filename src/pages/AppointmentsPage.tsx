import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import AppointmentList from "@/components/appointments/AppointmentList";
import AppointmentActions from "@/components/appointments/AppointmentActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Appointment, AppointmentStatus } from "@/types";
import api from "@/services/api";

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentStatus | "all">("all");

  useEffect(() => {
    if (!user) return;

    const fetchAppointments = async () => {
      try {
        let appointmentRes;
        if (user.role === "patient") {
          appointmentRes = await api.get(`/appointments/patient`);
        } else if (user.role === "doctor") {
          appointmentRes = await api.get(`/appointments/doctor`);
        } else {
          appointmentRes = await api.get(`/appointments`);
        }
        setAppointments(appointmentRes.data);
        setFilteredAppointments(appointmentRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleFilterChange = (status: AppointmentStatus | "all") => {
    setActiveFilter(status);
    if (status === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(a => a.status === status));
    }
  };

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map(a =>
      a.id === updatedAppointment.id ? updatedAppointment : a
    );
    setAppointments(updatedAppointments);
  
    if (activeFilter === "all") {
      setFilteredAppointments(updatedAppointments);
    } else {
      setFilteredAppointments(updatedAppointments.filter(a => a.status === activeFilter));
    }
  
    setSelectedAppointment(updatedAppointment);
  };
  

  if (!user) return <Navigate to="/auth" replace />;

  const statusFilters: (AppointmentStatus | "all")[] = ["all", "pending", "confirmed", "completed", "cancelled", "missed"];

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">
          {user.role === "patient"
            ? "My Appointments"
            : user.role === "doctor"
            ? "My Schedule"
            : "All Appointments"}
        </h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusFilters.map(status => (
              <Button
                key={status}
                variant={activeFilter === status ? "default" : "outline"}
                onClick={() => handleFilterChange(status)}
                className={
                  status === "pending" ? "bg-yellow-500 hover:bg-yellow-600" :
                  status === "confirmed" ? "bg-blue-500 hover:bg-blue-600" :
                  status === "completed" ? "bg-green-500 hover:bg-green-600" :
                  status === "cancelled" ? "bg-red-500 hover:bg-red-600" :
                  status === "missed" ? "bg-gray-500 hover:bg-gray-600" :
                  activeFilter === "all" ? "bg-clinic-500 hover:bg-clinic-600" : ""
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <AppointmentList
                  appointments={filteredAppointments}
                  onSelectAppointment={setSelectedAppointment}
                />
              </CardContent>
            </Card>
          </div>

          <div>
            {selectedAppointment ? (
              <Card>
                <CardHeader>
                  <CardTitle>Appointment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Date:</strong> {selectedAppointment.date}</p>
                    <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
                    <p><strong>Status:</strong> {selectedAppointment.status}</p>

                    <AppointmentActions
                      appointment={selectedAppointment}
                      onUpdate={handleAppointmentUpdate}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  Select an appointment to view details
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppointmentsPage;
