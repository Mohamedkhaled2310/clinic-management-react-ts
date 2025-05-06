
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";

interface DashboardStatsProps {
  role: UserRole;
  stats: {
    upcomingAppointments: number;
    cancelledAppointments: number;
    completedAppointments: number;
    missedAppointments: number;
    pendingBills?: number;
    totalPatients?: number;
    todayAppointments?: number;
  };
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ role, stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Upcoming Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-clinic-800">
            {stats.upcomingAppointments}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Completed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">
            {stats.completedAppointments}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Cancelled
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">
            {stats.cancelledAppointments}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Missed
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-700">
            {stats.missedAppointments}
          </div>
        </CardContent>
      </Card>
      
      {role === "staff" && stats.pendingBills !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-700">
              {stats.pendingBills}
            </div>
          </CardContent>
        </Card>
      )}
      
      {(role === "doctor" || role === "staff") && stats.totalPatients !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              {stats.totalPatients}
            </div>
          </CardContent>
        </Card>
      )}
      
      {(role === "doctor" || role === "staff") && stats.todayAppointments !== undefined && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-clinic-800">
              {stats.todayAppointments}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DashboardStats;
