
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import DashboardStats from "@/components/dashboard/DashboardStats";
import AppointmentList from "@/components/appointments/AppointmentList";
import AppointmentForm from "@/components/appointments/AppointmentForm";
import AppointmentActions from "@/components/appointments/AppointmentActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockAppointments, mockBills, mockPatients } from "@/data/mockData";
import { Appointment } from "@/types";

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };

    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  useEffect(() => {
    if (!user) return;
    
    // Filter appointments based on user role
    let appointments: Appointment[];
    
    if (user.role === "patient") {
      appointments = mockAppointments.filter(appointment => appointment.patientId === user.id);
    } else if (user.role === "doctor") {
      appointments = mockAppointments.filter(appointment => appointment.doctorId === user.id);
    } else {
      // Staff can see all appointments
      appointments = [...mockAppointments];
    }
    
    setFilteredAppointments(appointments);
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Calculate dashboard stats
  const upcomingAppointments = filteredAppointments.filter(
    a => ["pending", "confirmed"].includes(a.status)
  ).length;
  
  const completedAppointments = filteredAppointments.filter(
    a => a.status === "completed"
  ).length;
  
  const cancelledAppointments = filteredAppointments.filter(
    a => a.status === "cancelled"
  ).length;
  
  const missedAppointments = filteredAppointments.filter(
    a => a.status === "missed"
  ).length;
  
  // Additional stats for staff/doctor
  const todayAppointments = filteredAppointments.filter(
    a => a.date === new Date().toISOString().split('T')[0]
  ).length;
  
  const totalPatients = mockPatients.length;
  
  const pendingBills = mockBills.filter(bill => bill.status === "unpaid").length;

  const dashboardStats = {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    missedAppointments,
    pendingBills,
    totalPatients,
    todayAppointments,
  };

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    // In a real app, this would update the state after an API call
    const updatedAppointments = filteredAppointments.map(appointment => 
      appointment.id === updatedAppointment.id ? updatedAppointment : appointment
    );
    
    setFilteredAppointments(updatedAppointments);
    setSelectedAppointment(updatedAppointment);
  };

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">Dashboard</h1>
        
        <DashboardStats role={user.role} stats={dashboardStats} />
        
        <div className="mt-8">
          <Tabs defaultValue="appointments" className="w-full">
            <TabsList>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              {user.role === "patient" && (
                <TabsTrigger value="book">Book Appointment</TabsTrigger>
              )}
            </TabsList>
            
            <TabsContent value="appointments" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        {user.role === "patient" 
                          ? "My Appointments" 
                          : user.role === "doctor" 
                              ? "My Schedule" 
                              : "All Appointments"}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                            <span className="font-medium">Date:</span> {formatDate(selectedAppointment.date)}
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
            </TabsContent>
            
            {user.role === "patient" && (
              <TabsContent value="book" className="mt-4">
                <AppointmentForm />
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
