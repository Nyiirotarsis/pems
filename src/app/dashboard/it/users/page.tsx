
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            User Management
          </CardTitle>
           <CardDescription>
            User creation, role assignment, and permissions will be managed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>User management coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
