import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeaveManagementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Leave Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Leave request processing and calendar coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
