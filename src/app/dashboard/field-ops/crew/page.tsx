
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function CrewManagementPage() {
  return (
    <PEMSDashboard initialRole="Field Operational Officer">
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    Crew Management
                </CardTitle>
                <CardDescription>
                    A module for managing on-site crew members, their roles, and assignments will be here.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p>Crew management features coming soon...</p>
                </CardContent>
            </Card>
        </div>
    </PEMSDashboard>
  );
}
