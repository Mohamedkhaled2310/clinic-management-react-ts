
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import AppointmentList from "@/components/appointments/AppointmentList";
import AppointmentActions from "@/components/appointments/AppointmentActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAppointments } from "@/data/mockData";
import { Appointment, AppointmentStatus } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [activeFilter, setActiveFilter] = useState<AppointmentStatus | "all">("all");
  
  useEffect(() => {
    if (!user) return;
    
    // Filter appointments based on user role
    let userAppointments: Appointment[];
    
    if (user.role === "patient") {
      userAppointments = mockAppointments.filter(appointment => appointment.patientId === user.id);
    } else if (user.role === "doctor") {
      userAppointments = mockAppointments.filter(appointment => appointment.doctorId === user.id);
    } else {
      // Staff can see all appointments
      userAppointments = [...mockAppointments];
    }
    
    setAppointments(userAppointments);
    setFilteredAppointments(userAppointments);
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleFilterChange = (status: AppointmentStatus | "all") => {
    setActiveFilter(status);
    
    if (status === "all") {
      setFilteredAppointments(appointments);
    } else {
      setFilteredAppointments(appointments.filter(appointment => appointment.status === status));
    }
  };

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    // In a real app, this would update the state after an API call
    const updatedAppointments = appointments.map(appointment => 
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    );
    
    setAppointments(updatedAppointments);
    
    // Apply current filter to updated appointments
    if (activeFilter === "all") {
      setFilteredAppointments(updatedAppointments);
    } else {
      setFilteredAppointments(updatedAppointments.filter(appointment => appointment.status === activeFilter));
    }
    
    setSelectedAppointment(updatedAppointment);
  };

  const getPageTitle = () => {
    switch (user.role) {
      case "patient":
        return "My Appointments";
      case "doctor":
        return "My Schedule";
      case "staff":
        return "All Appointments";
      default:
        return "Appointments";
    }
  };

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">{getPageTitle()}</h1>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={activeFilter === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className={activeFilter === "all" ? "bg-clinic-500 hover:bg-clinic-600" : ""}
            >
              All
            </Button>
            <Button 
              variant={activeFilter === "pending" ? "default" : "outline"}
              onClick={() => handleFilterChange("pending")}
              className={activeFilter === "pending" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              Pending
            </Button>
            <Button 
              variant={activeFilter === "confirmed" ? "default" : "outline"}
              onClick={() => handleFilterChange("confirmed")}
              className={activeFilter === "confirmed" ? "bg-blue-500 hover:bg-blue-600" : ""}
            >
              Confirmed
            </Button>
            <Button 
              variant={activeFilter === "completed" ? "default" : "outline"}
              onClick={() => handleFilterChange("completed")}
              className={activeFilter === "completed" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              Completed
            </Button>
            <Button 
              variant={activeFilter === "cancelled" ? "default" : "outline"}
              onClick={() => handleFilterChange("cancelled")}
              className={activeFilter === "cancelled" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Cancelled
            </Button>
            <Button 
              variant={activeFilter === "missed" ? "default" : "outline"}
              onClick={() => handleFilterChange("missed")}
              className={activeFilter === "missed" ? "bg-gray-500 hover:bg-gray-600" : ""}
            >
              Missed
            </Button>
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
                    <p>
                      <span className="font-medium">Date:</span> {selectedAppointment.date}
                    </p>
                    {/* <p>
                      <span className="font-medium">Time:</span> {selectedAppointment.time}
                    </p>
                    <p>
                      <span className="font-medium">Duration:</span> {selectedAppointment.duration} minutes
                    </p> */}
                    <p>
                      <span className="font-medium">Reason:</span> {selectedAppointment.reason}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {selectedAppointment.status}
                    </p>
                    {selectedAppointment.notes && (
                      <p>
                        <span className="font-medium">Notes:</span> {selectedAppointment.notes}
                      </p>
                    )}
                    
                    <AppointmentActions 
                      appointment={selectedAppointment} 
                      onUpdate={handleAppointmentUpdate}
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    Select an appointment to view details
                  </div>
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
