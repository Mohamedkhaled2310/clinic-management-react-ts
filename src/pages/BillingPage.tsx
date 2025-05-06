
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import BillList from "@/components/billing/BillList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockBills } from "@/data/mockData";
import { Bill } from "@/types";

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [filterStatus, setFilterStatus] = useState<Bill["status"] | "all">("all");
  
  useEffect(() => {
    if (!user) return;
    
    // Filter bills based on user role
    let userBills: Bill[];
    
    if (user.role === "patient") {
      userBills = mockBills.filter(bill => bill.patientId === user.id);
    } else {
      // Staff can see all bills
      userBills = [...mockBills];
    }
    
    setBills(userBills);
  }, [user]);

  // Redirect if not logged in or not authorized
  if (!user || (user.role !== "patient" && user.role !== "staff")) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleFilterChange = (status: Bill["status"] | "all") => {
    setFilterStatus(status);
  };

  const filteredBills = filterStatus === "all" 
    ? bills 
    : bills.filter(bill => bill.status === filterStatus);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const handlePayBill = () => {
    if (!selectedBill) return;
    
    // In a real app, this would be an API call to update the bill status
    const updatedBill: Bill = {
      ...selectedBill,
      status: "paid",
      datePaid: new Date().toISOString().split('T')[0],
    };
    
    const updatedBills = bills.map(bill => 
      bill.id === updatedBill.id ? updatedBill : bill
    );
    
    setBills(updatedBills);
    setSelectedBill(updatedBill);
  };

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">
          {user.role === "patient" ? "My Bills" : "Billing Management"}
        </h1>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={filterStatus === "all" ? "default" : "outline"}
              onClick={() => handleFilterChange("all")}
              className={filterStatus === "all" ? "bg-clinic-500 hover:bg-clinic-600" : ""}
            >
              All Bills
            </Button>
            <Button 
              variant={filterStatus === "unpaid" ? "default" : "outline"}
              onClick={() => handleFilterChange("unpaid")}
              className={filterStatus === "unpaid" ? "bg-red-500 hover:bg-red-600" : ""}
            >
              Unpaid
            </Button>
            <Button 
              variant={filterStatus === "paid" ? "default" : "outline"}
              onClick={() => handleFilterChange("paid")}
              className={filterStatus === "paid" ? "bg-green-500 hover:bg-green-600" : ""}
            >
              Paid
            </Button>
            <Button 
              variant={filterStatus === "partially_paid" ? "default" : "outline"}
              onClick={() => handleFilterChange("partially_paid")}
              className={filterStatus === "partially_paid" ? "bg-yellow-500 hover:bg-yellow-600" : ""}
            >
              Partially Paid
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <BillList 
                  bills={filteredBills} 
                  onSelectBill={setSelectedBill}
                />
              </CardContent>
            </Card>
          </div>
          
          <div>
            {selectedBill ? (
              <Card>
                <CardHeader>
                  <CardTitle>Bill Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p>
                      <span className="font-medium">Bill #:</span> {selectedBill.id}
                    </p>
                    <p>
                      <span className="font-medium">Amount:</span> {formatCurrency(selectedBill.amount)}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span> {selectedBill.status}
                    </p>
                    <p>
                      <span className="font-medium">Issue Date:</span> {selectedBill.dateIssued}
                    </p>
                    <p>
                      <span className="font-medium">Due Date:</span> {selectedBill.dueDate}
                    </p>
                    {selectedBill.datePaid && (
                      <p>
                        <span className="font-medium">Payment Date:</span> {selectedBill.datePaid}
                      </p>
                    )}
                    
                    <div className="mt-4">
                      <h4 className="font-medium mb-2">Services</h4>
                      <ul className="space-y-2">
                        {selectedBill.services.map((service) => (
                          <li key={service.id} className="flex justify-between">
                            <span>{service.name}</span>
                            <span>{formatCurrency(service.cost)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {user.role === "patient" && selectedBill.status === "unpaid" && (
                      <Button 
                        className="w-full mt-4 bg-clinic-500 hover:bg-clinic-600"
                        onClick={handlePayBill}
                      >
                        Pay Now
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center text-gray-500">
                    Select a bill to view details
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

export default BillingPage;
