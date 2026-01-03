
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function PayrollDashboardPage() {
  return (
    <PEMSDashboard initialRole="HR/Admin">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Payroll & Per Diem Dashboard
          </CardTitle>
          <CardDescription>
            This dashboard will contain summaries, charts, and reports for both salary and per diem payments. This is under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Dashboard content coming soon...</p>
        </CardContent>
      </Card>
    </PEMSDashboard>
  );
}
