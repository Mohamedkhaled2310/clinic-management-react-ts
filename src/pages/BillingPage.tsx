import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Layout from "@/components/layout/Layout";
import BillList from "@/components/billing/BillList";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bill } from "@/types";
import api from "@/services/api";

const BillingPage: React.FC = () => {
  const { user } = useAuth();
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);
  const [filterStatus, setFilterStatus] = useState<boolean | "all">("all");

  useEffect(() => {
    if (!user) return;

    const fetchBills = async () => {
      try {
        const endpoint = user.role === "patient" ? "/bills/patient" : "/bills";
        const response = await api.get(endpoint, {
          params: user.role === "patient" ? { patientId: user.id } : undefined,
        });
        setBills(response.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        console.log("Bills:", response.data);
      } catch (error) {
        console.error("Failed to fetch bills:", error);
      }
    };

    fetchBills();
  }, [user]);

  if (!user || (user.role !== "patient" && user.role !== "staff")) {
    return <Navigate to="/dashboard" replace />;
  }

  const filteredBills = filterStatus === "all"
  ? bills
  : bills.filter(bill => bill.paid === filterStatus);
console.log("Filtered Bills:", filteredBills);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const handlePayBill = () => {
    if (!selectedBill) return;

    const updatedBill: Bill = {
      ...selectedBill,
      paid: true,
      updatedAt : new Date().toISOString().split("T")[0],
    };

    setBills(prev =>
      prev.map(bill => bill.id === updatedBill.id ? updatedBill : bill)
    );
    setSelectedBill(updatedBill);
  };

  const StatusFilterButton = ({
    status,
    label,
    colorClass,
  }: {
    status: Bill["paid"] | "all";
    label: string;
    colorClass: string;
  }) => (
    <Button
      variant={filterStatus === status ? "default" : "outline"}
      onClick={() => setFilterStatus(status)}
      className={filterStatus === status ? colorClass : ""}
    >
      {label}
    </Button>
  );

  return (
    <Layout>
      <div className="clinic-container">
        <h1 className="page-title">
          {user.role === "patient" ? "My Bills" : "Billing Management"}
        </h1>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
          <StatusFilterButton status="all" label="All Bills" colorClass="bg-clinic-500 hover:bg-clinic-600" />
          <StatusFilterButton status={false} label="Unpaid" colorClass="bg-red-500 hover:bg-red-600" />
          <StatusFilterButton status={true} label="Paid" colorClass="bg-green-500 hover:bg-green-600" />
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
                    <p><strong>Bill #:</strong> {selectedBill.id}</p>
                    <p><strong>Amount:</strong> {formatCurrency(selectedBill.amount)}</p>
                    <p><strong>Status:</strong> {selectedBill.paid ? "Paid" : "Unpaid"}</p>
                    <p><strong>Issue Date:</strong> {new Date(selectedBill.createdAt).toLocaleDateString()}</p>
                    <p><strong>Due Date:</strong>
                    {selectedBill.updatedAt ? new Date(selectedBill.updatedAt).toLocaleDateString() : "N/A"}
                    </p>
                    {selectedBill.paid && (
                      <p><strong>Payment Date:</strong> {new Date(selectedBill.updatedAt).toLocaleDateString()}</p>
                    )}

                    {user.role === "patient" && selectedBill.paid === false && (
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
