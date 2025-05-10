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
import { Appointment, Bill, Patient } from "@/types";
import api from './../services/api';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        let appointmentRes;
        if (user.role === "patient") {
          appointmentRes = await api.get(`/appointments/patient`);
        } else if (user.role === "doctor") {
          appointmentRes = await api.get(`/appointments/doctor`);
        } else {
          appointmentRes = await api.get(`/appointments/all`);
        }
        setAppointments(appointmentRes.data);

        if (user.role !== "patient") {
          const billsRes = await 
            api.get("/bills");
          setBills(billsRes.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Dashboard Stats
  const upcomingAppointments = appointments.filter(a => ["pending", "confirmed"].includes(a.status)).length;
  const completedAppointments = appointments.filter(a => a.status === "completed").length;
  const cancelledAppointments = appointments.filter(a => a.status === "cancelled").length;
  const missedAppointments = appointments.filter(a => a.status === "missed").length;
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split("T")[0]).length;
  const pendingBills = bills.filter(b => b.status === "unpaid").length;

  const dashboardStats = {
    upcomingAppointments,
    completedAppointments,
    cancelledAppointments,
    missedAppointments,
    pendingBills,
    todayAppointments,
  };

  const handleAppointmentUpdate = (updatedAppointment: Appointment) => {
    const updatedAppointments = appointments.map(a => a.id === updatedAppointment.id ? updatedAppointment : a);
    setAppointments(updatedAppointments);
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
                        appointments={appointments}
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
                          <p>
                            <span className="font-medium">Reason:</span> {selectedAppointment.reason}
                          </p>
                          <p>
                            <span className="font-medium">Status:</span> {selectedAppointment.status}
                          </p>

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
