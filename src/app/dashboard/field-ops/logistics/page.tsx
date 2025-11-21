
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import PEMSDashboard from "@/components/pems-dashboard";

export default function LogisticsPage() {
  return (
    <PEMSDashboard initialRole="Field Operational Officer">
        <div className="p-4 sm:p-6 lg:p-8">
            <Card>
                <CardHeader>
                <CardTitle className="font-headline text-2xl">
                    Fuel & Logistics Requisition
                </CardTitle>
                <CardDescription>
                    A form for requesting fuel, transport, and mileage allowances will be here.
                </CardDescription>
                </CardHeader>
                <CardContent>
                <p>Logistics requisition form coming soon...</p>
                </CardContent>
            </Card>
        </div>
    </PEMSDashboard>
  );
}
