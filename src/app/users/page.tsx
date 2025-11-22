
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
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg">Management &amp; Oversight</h3>
            <p className="text-muted-foreground mt-1">
              High-level users who oversee operations and make strategic decisions.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li><strong>Director:</strong> Has a complete overview of all modules for strategic oversight and final approvals.</li>
              <li><strong>CEO:</strong> Manages day-to-day operations, approves major requests, and views comprehensive reports to ensure the business runs smoothly.</li>
              <li><strong>Finance Manager:</strong> Manages all financial aspects, including quotations, LPOs, invoices, and payments. They handle budget allocations and financial reporting.</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg">Departmental Staff</h3>
            <p className="text-muted-foreground mt-1">
              Users responsible for the day-to-day operations within their specific departments.
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li><strong>Field Operational Officer:</strong> Oversees all on-site activities, manages crew, handles logistics requisitions, makes equipment requests to the store manager, and approves operational tasks.</li>
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
