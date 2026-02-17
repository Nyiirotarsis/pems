
"use client";
import { useState } from "react";
import { format } from "date-fns";
import PEMSDashboard from "@/components/pems-dashboard";
import { AttendanceView } from "@/components/dashboard/attendance-view";
import { mockAttendance, USERS } from "@/lib/mock-data";
import { addAttendanceRecord } from "@/lib/hr";
import { useToast } from "@/hooks/use-toast";

export default function AttendancePage() {
    const [attendance, setAttendance] = useState(mockAttendance);
    const { toast } = useToast();
    
    return (
        <PEMSDashboard initialRole="HR/Admin">
            <AttendanceView
                attendance={attendance}
                onAddRecord={(v) => {
                    const {newRecord, error} = addAttendanceRecord(attendance, v);
                    if (error) {
                        toast({ variant: "destructive", title: "Error", description: error });
                    } else if(newRecord) {
                        setAttendance(prev => [newRecord, ...prev]);
                        toast({ title: "Attendance Recorded", description: `Attendance for ${USERS.find(u => u.id.toString() === v.userId)?.username} on ${format(newRecord.date, "PPP")} has been logged as ${v.status}.` });
                    }
                }}
            />
        </PEMSDashboard>
    );
}
