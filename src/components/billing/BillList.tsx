
import React from "react";
import { Bill } from "@/types";
import { getPatientNameById, getAppointmentById } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

interface BillListProps {
  bills: Bill[];
  onSelectBill?: (bill: Bill) => void;
}

const BillList: React.FC<BillListProps> = ({ bills, onSelectBill }) => {
  const { user } = useAuth();

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getStatusBadge = (status: Bill["status"]) => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "unpaid":
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Unpaid</Badge>;
      case "partially_paid":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Partially Paid</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {bills.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">No bills found</div>
          </CardContent>
        </Card>
      ) : (
        bills.map((bill) => {
          const appointment = getAppointmentById(bill.appointmentId);
          
          return (
            <Card 
              key={bill.id} 
              className={`hover:shadow-md transition-shadow ${onSelectBill ? 'cursor-pointer' : ''}`}
              onClick={() => onSelectBill && onSelectBill(bill)}
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    {user?.role === "staff" && (
                      <div className="font-medium mb-1">
                        {getPatientNameById(bill.patientId)}
                      </div>
                    )}
                    <div className="text-sm text-gray-600 mb-2">
                      Bill #{bill.id} • Issued: {formatDate(bill.dateIssued)}
                    </div>
                    {appointment && (
                      <div className="text-sm text-gray-700 mt-1">
                        <span className="font-medium">Visit:</span> {appointment.reason} on {formatDate(appointment.date)}
                      </div>
                    )}
                    <div className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Due Date:</span> {formatDate(bill.dueDate)}
                    </div>
                    {bill.services.length > 0 && (
                      <div className="text-sm text-gray-700 mt-2">
                        <span className="font-medium">Services:</span> {bill.services.map(s => s.name).join(", ")}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(bill.status)}
                    <div className="text-lg font-bold text-gray-900 mt-2">
                      {formatCurrency(bill.amount)}
                    </div>
                    {bill.datePaid && (
                      <div className="text-xs text-green-700 mt-1">
                        Paid on {formatDate(bill.datePaid)}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};

export default BillList;
