import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmployeesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Employee Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Employee records and management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
