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

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const getStatusBadge = (paid: boolean) => {
  return paid ? (
    <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
      Paid
    </Badge>
  ) : (
    <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
      Unpaid
    </Badge>
  );
};

const BillList: React.FC<BillListProps> = ({ bills, onSelectBill }) => {
  const { user } = useAuth();

  if (bills.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-500">
          No bills found
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {bills.map((bill) => {
        const appointment = bill.appointment;

        return (
          <Card
            key={bill.id}
            className={`hover:shadow-md transition-shadow ${onSelectBill ? "cursor-pointer" : ""}`}
            onClick={() => onSelectBill && onSelectBill(bill)}
          >
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  {user?.role === "staff" && (
                    <div className="font-medium mb-1">
                      {bill.patientName}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mb-2">
                    Bill #{bill.id} • Issued: {formatDate(bill.createdAt)}
                  </div>
                  {appointment && (
                    <div className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Visit:</span> {bill.appointmentReason} on {formatDate(bill.appointmentDate)}
                    </div>
                  )}
                  <div className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Payment Method:</span> {bill.paymentMethod}
                  </div>
                  {bill.notes && (
                    <div className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Notes:</span> {bill.notes}
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end">
                  {getStatusBadge(bill.paid)}
                  <div className="text-lg font-bold text-gray-900 mt-2">
                    {formatCurrency(bill.amount)}
                  </div>
                  {bill.paid && (
                    <div className="text-xs text-green-700 mt-1">
                      Paid on {formatDate(bill.updatedAt)}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default BillList;
