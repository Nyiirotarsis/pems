
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SystemsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Systems Management
          </CardTitle>
          <CardDescription>
            System health, backups, and performance metrics will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Systems dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
