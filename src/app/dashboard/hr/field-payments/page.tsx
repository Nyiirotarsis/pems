import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FieldPaymentsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Field Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Field staff payment requisition and tracking coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
