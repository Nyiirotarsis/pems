
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function RisksPage() {
  return (
    <PEMSDashboard initialRole="Auditor">
      <div className="p-4 sm:p-6 lg:p-8">
          <Card>
              <CardHeader>
              <CardTitle className="font-headline text-2xl">
                  Impacts, Risks & Opportunities
              </CardTitle>
              <CardDescription>
                  This module is under construction.
              </CardDescription>
              </CardHeader>
              <CardContent>
              <p>The section for assessing impacts and managing risks will be available here soon.</p>
              </CardContent>
          </Card>
      </div>
    </PEMSDashboard>
  );
}
