
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function UsersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            System Users
          </CardTitle>
          <CardDescription>
            The Pacific Events Management System (PEMS) is designed for various roles within the organization, each with specific functions and access levels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">Management & Oversight</h3>
            <p className="text-muted-foreground">
              High-level users who oversee operations and make strategic decisions.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>CEO/Director:</strong> Has a complete overview of all modules, including finance, HR, and store operations. They approve major requests and view comprehensive reports.</li>
              <li><strong>Finance Manager:</strong> Manages all financial aspects, including quotations, LPOs, invoices, and payments. They handle budget allocations and financial reporting.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Departmental Staff</h3>
            <p className="text-muted-foreground">
              Users responsible for the day-to-day operations within their specific departments.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li><strong>Store Manager:</strong> Responsible for inventory and asset management, including issuing, returning, and tracking all physical equipment.</li>
              <li><strong>HR/Admin:</strong> Manages all human resources functions, such as employee records, attendance, payroll, leave, and recruitment.</li>
              <li><strong>IT Managers:</strong> Oversee system health, security, user management, and provide technical support across the platform.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
