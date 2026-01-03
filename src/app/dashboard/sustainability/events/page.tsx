
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function EventSustainabilityPage() {
  return (
    <PEMSDashboard initialRole="Auditor">
      <div className="p-4 sm:p-6 lg:p-8">
          <Card>
              <CardHeader>
              <CardTitle className="font-headline text-2xl">
                  Event Sustainability
              </CardTitle>
              <CardDescription>
                  This module is under construction.
              </CardDescription>
              </CardHeader>
              <CardContent>
              <p>The section for event sustainability planning, checklists, and reports will be available here soon.</p>
              </CardContent>
          </Card>
      </div>
    </PEMSDashboard>
  );
}
