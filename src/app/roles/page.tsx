
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function RolesPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            User Roles &amp; Responsibilities
          </CardTitle>
          <CardDescription>
            Each role in the PEMS portal has a specific set of permissions and tasks to ensure a smooth and secure workflow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Managing Director</h3>
            <p className="text-muted-foreground mt-1">
             The Managing Director holds the highest oversight authority within the Pacific Events Management System. This role provides strategic leadership, supervises organizational performance, and ensures that all departments align with the company’s mission and long-term goals. The Managing Director has read-only access across all modules, with the ability to perform final approvals on major financial, operational, and contractual decisions.
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
             The Finance Manager oversees the complete financial lifecycle of all events and company operations within PEMS. They handle budgeting, quotations, supplier financials, LPOs, client invoicing, payment tracking, expenditure management, and financial reporting. The Finance Manager ensures accurate, timely, and well-documented financial records that support smooth event execution and strategic decision-making.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">Store Manager</h3>
            <p className="text-muted-foreground mt-1">
              Manages the company's physical assets. Their portal is focused on inventory control, including adding new assets, issuing equipment for events, processing returns, logging maintenance, and tracking stock levels.
            </p>
          </div>
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg">HR &amp; Administration Officer</h3>
            <p className="text-muted-foreground mt-1">
              The HR &amp; Administration Officer ensures effective people management, organizational compliance, professional conduct, and administrative support across Pacific Events Ltd. This role manages all staff records, performance monitoring, recruitment processes, compensation structures, staff welfare, and regulatory compliance according to Ugandan labour laws.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg">IT Manager</h3>
            <p className="text-muted-foreground mt-1">
              The IT Manager is responsible for maintaining the operational, technical, and security integrity of the PEMS platform. This role oversees user access control, system performance, data protection, and infrastructure reliability. The IT Manager ensures the platform runs efficiently, remains secure against threats, and supports the continuous growth and functionality of the organization.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
