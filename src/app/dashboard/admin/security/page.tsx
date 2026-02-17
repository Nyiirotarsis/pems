
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SecurityPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Security Management
          </CardTitle>
           <CardDescription>
            Security scans, logs, and incident reports will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Security dashboard coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
