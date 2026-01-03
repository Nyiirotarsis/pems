
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function PerformancePage() {
  return (
    <PEMSDashboard initialRole="Auditor">
      <div className="p-4 sm:p-6 lg:p-8">
          <Card>
              <CardHeader>
              <CardTitle className="font-headline text-2xl">
                  Performance & Improvement
              </CardTitle>
              <CardDescription>
                  This module is under construction.
              </CardDescription>
              </CardHeader>
              <CardContent>
              <p>The section for tracking KPIs, nonconformities, and corrective actions will be available here soon.</p>
              </CardContent>
          </Card>
      </div>
    </PEMSDashboard>
  );
}
