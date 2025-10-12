
"use client";
import { useState } from "react";
import PEMSDashboard from "@/components/pems-dashboard";
import { KpiTrackerView } from "@/components/dashboard/kpi-tracker-view";
import { mockKpis } from "@/lib/mock-data";
import { addKpi, completeKpi } from "@/lib/hr";
import { useToast } from "@/hooks/use-toast";

export default function KpiPage() {
    const [kpis, setKpis] = useState(mockKpis);
    const { toast } = useToast();

    return (
        <PEMSDashboard initialRole="HR/Admin">
            <KpiTrackerView 
                kpis={kpis} 
                onAddKpi={(v) => {
                    const {newKpi, error} = addKpi(kpis, v);
                    if(error) {
                        toast({ variant: "destructive", title: "Error", description: error });
                    } else if(newKpi) {
                        setKpis(prev => [newKpi, ...prev]);
                        toast({ title: "KPI Added", description: `A new KPI "${v.activityName}" has been added.` });
                    }
                }}
                onCompleteKpi={(id) => {
                    const { updatedKpis, error } = completeKpi(kpis, id);
                    if (error) {
                      toast({ variant: "destructive", title: "Error", description: error });
                    } else {
                      setKpis(updatedKpis);
                      toast({ title: "KPI Completed", description: `The KPI has been marked as completed.` });
                    }
                }}
            />
        </PEMSDashboard>
    );
}
