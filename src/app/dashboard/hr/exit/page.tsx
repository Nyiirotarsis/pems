import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExitManagementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Exit Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Staff exit and clearance process coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
