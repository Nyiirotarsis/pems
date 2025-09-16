import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PayrollPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Payroll
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Payroll processing module coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
