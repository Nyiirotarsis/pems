
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            System Settings
          </CardTitle>
           <CardDescription>
            General system configuration and settings will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Settings management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
