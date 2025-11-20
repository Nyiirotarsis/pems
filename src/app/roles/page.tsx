
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            User Roles & Responsibilities
          </CardTitle>
          <CardDescription>
            Each role in the PEMS portal has a specific set of permissions and tasks to ensure a smooth and secure workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Director</h3>
            <p className="text-muted-foreground mt-1">
              Provides the highest level of oversight for the entire organization. The Director has read-only access to all modules and focuses on strategic direction and final approvals on major decisions.
            </p>
          </div>
           <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">CEO</h3>
            <p className="text-muted-foreground mt-1">
              Reports to the Director and is responsible for ensuring all business operations are running smoothly. The CEO can approve or reject critical financial documents, monitor performance across departments, and relies on comprehensive reports to manage the company's health.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Field Operational Officer</h3>
            <p className="text-muted-foreground mt-1">
              Reports to the CEO and Director, makes requests to the store manager, oversees, and approves all activities taking place at the site.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Finance Manager</h3>
            <p className="text-muted-foreground mt-1">
              Operates the financial heart of the system. This user can create quotations, issue LPOs, capture invoices, and record payments. They manage the flow of funds and are responsible for all financial documentation and reporting.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Store Manager</h3>
            <p className="text-muted-foreground mt-1">
              Manages the company's physical assets. Their portal is focused on inventory control, including adding new assets, issuing equipment for events, processing returns, logging maintenance, and tracking stock levels.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">HR/Admin</h3>
            <p className="text-muted-foreground mt-1">
              Oversees all employee-related activities. This role involves managing staff records, tracking attendance and KPIs, processing field staff payments, and handling the recruitment and exit processes.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">IT Manager</h3>
            <p className="text-muted-foreground mt-1">
              Maintains the technical integrity of the PEMS platform. Responsibilities include managing user accounts and roles, monitoring system health and security, performing backups, and configuring system settings.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
