import React, { useState } from "react";
import { Appointment, AppointmentStatus } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { getPatientNameById } from "@/data/mockData";
import api from "@/services/api";

interface AppointmentActionsProps {
  appointment: Appointment;
  onUpdate?: (updatedAppointment: Appointment) => void;
}

const AppointmentActions: React.FC<AppointmentActionsProps> = ({
  appointment,
  onUpdate,
}) => {
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isGenerateBillDialogOpen, setIsGenerateBillDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [amount,setAmount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();
  const [notes, setNotes] = useState("");
  const canUpdateStatus = user?.role === "doctor" ;
  const canGenerateBill = user?.role === "staff" && appointment.status === "completed";

  const handleStatusUpdate = async (newStatus: AppointmentStatus) => {
    setIsUpdating(true);
    try {
      const response = await api.patch<Appointment>(`appointments/${appointment.id}/status`, {
        status: newStatus,
      });

      if (onUpdate) {
        onUpdate(response.data);
      }

      toast({
        title: "Appointment Updated",
        description: `Appointment status changed to ${newStatus}`,
      });

      setIsUpdateDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update appointment status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateBill = async () => {
    setIsUpdating(true);
    try {
      await api.post(`/bills`, {
        appointment: appointment.id,
        patient: appointment.patientId,
        amount,
        notes
      });
      toast({
        title: "Bill Generated",
        description: `Bill generated for ${appointment.patientName}`,
      });

      setIsGenerateBillDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate bill",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!canUpdateStatus && !canGenerateBill) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {canUpdateStatus && (
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-clinic-50 text-clinic-800 hover:bg-clinic-100">
              Update Status
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Appointment Status</DialogTitle>
              <DialogDescription>
                Change the status of the appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-2">
                {appointment.status !== "completed" && (
                  <Button
                    variant="outline"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                    onClick={() => handleStatusUpdate("completed")}
                    disabled={isUpdating}
                  >
                    Mark as Completed
                  </Button>
                )}
                {appointment.status !== "missed" && (
                  <Button
                    variant="outline"
                    className="bg-gray-50 text-gray-700 hover:bg-gray-100"
                    onClick={() => handleStatusUpdate("missed")}
                    disabled={isUpdating}
                  >
                    Mark as Missed
                  </Button>
                )}
                {appointment.status !== "cancelled" && (
                  <Button
                    variant="outline"
                    className="bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => handleStatusUpdate("cancelled")}
                    disabled={isUpdating}
                  >
                    Cancel Appointment
                  </Button>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {canGenerateBill && (
        <Dialog open={isGenerateBillDialogOpen} onOpenChange={setIsGenerateBillDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              Generate Bill
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate Bill</DialogTitle>
              <DialogDescription>
                Create a bill for this completed appointment.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-700 mb-2">
                <span className="font-medium">Patient:</span> {appointment.patientName || "No patient name"}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <span className="font-medium">Appointment Date:</span> {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="text-sm mb-2">
                <span className="font-medium">Amount:</span>
              </p>
              <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min="1"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="Enter amount"
            />
              <p className="text-sm mt-4 mb-2">
                <span className="font-medium">Notes:</span>
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Enter notes"
                rows={4}
              />
              <p className="text-sm">
                This will generate a new bill for the services provided during this appointment.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsGenerateBillDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleGenerateBill}
                className="bg-clinic-500 hover:bg-clinic-600"
                disabled={isUpdating}
              >
                {isUpdating ? "Processing..." : "Generate Bill"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AppointmentActions;
