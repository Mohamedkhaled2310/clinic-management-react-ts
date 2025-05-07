
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import api from "@/services/api";

interface AppointmentFormProps {
  onAppointmentCreated?: () => void;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({ onAppointmentCreated }) => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  // const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get("user/doctors");
        setDoctors(response.data);
        console.log("Doctors:", response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };
  
    fetchDoctors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to book an appointment",
        variant: "destructive",
      });
      return;
    }
  
    setIsSubmitting(true);
    try {
      const response = await api.post("/api/appointments", {
          doctorId,
          date,
          // time,
          reason,
        });
      
      toast({
        title: "Appointment Requested",
        description: `Your appointment with Dr. ${response.data.doctorName || "..." } has been scheduled`,
      });
  
      // Reset form
      setDoctorId("");
      setDate("");
      // setTime("");
      setReason("");
  
      if (onAppointmentCreated) {
        onAppointmentCreated();
      }
  
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create appointment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  

  // Disable past dates
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book an Appointment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor</Label>
            <Select 
              value={doctorId} 
              onValueChange={setDoctorId}
              required
            >
              <SelectTrigger id="doctor">
                <SelectValue placeholder="Select a doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    {doctor.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          {/* <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
          </div> */}
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Visit</Label>
            <Textarea
              id="reason"
              placeholder="Please describe your symptoms or reason for the appointment"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              required
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full bg-clinic-500 hover:bg-clinic-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Appointment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AppointmentForm;
