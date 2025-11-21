
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function SiteAttendancePage() {
  return (
    <PEMSDashboard initialRole="Field Operational Officer">
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    Site Attendance Management
                </CardTitle>
                <CardDescription>
                    The system for generating QR codes and managing worker attendance will be here.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p>QR code attendance system coming soon...</p>
                </CardContent>
            </Card>
        </div>
    </PEMSDashboard>
  );
}
