
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Appointment } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/services/api";

interface AppointmentListProps {
  onSelectAppointment?: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments,
  onSelectAppointment
}) => {
  const { user } = useAuth();
  // const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchAppointments = async () => {
  //     if (!user) return;
  //     try {
  //       const endpoint =
  //         user.role === "patient"
  //           ? `/appointments/patient`
  //           : `/appointments/doctor`;

  //       const { data } = await api.get(endpoint);
  //       setAppointments(data);
  //       console.log("Appointments:", data);
  //     } catch (err) {
  //       console.error("Error fetching appointments:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchAppointments();
  // }, [user]);

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Confirmed</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Cancelled</Badge>;
      case "missed":
        return <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">Missed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // const formatTime = (timeString: string) => {
  //   const [hours, minutes] = timeString.split(':');
  //   const date = new Date();
  //   date.setHours(parseInt(hours, 10));
  //   date.setMinutes(parseInt(minutes, 10));
    
  //   return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  // };

  return (
    <div className="space-y-4">
      {appointments.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">No appointments found</div>
          </CardContent>
        </Card>
      ) : (
        appointments.map((appointment) => (
          <Card 
            key={appointment.id} 
            className={`hover:shadow-md transition-shadow ${onSelectAppointment ? 'cursor-pointer' : ''}`}
            onClick={() => onSelectAppointment && onSelectAppointment(appointment)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium mb-1">
                    {user?.role === "patient" 
                      ? `${appointment.doctorName}`
                      : `${appointment.patientName}`}
                  </div>
                  <div className="text-sm text-gray-800 mt-2">
                    <span className="font-medium">Reason:</span> {appointment.reason}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(appointment.status)}
                  <div className="text-sm text-gray-600 mt-2">
                    {formatDate(appointment.date)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default AppointmentList;
