
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function HelpPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Help & Support
          </CardTitle>
          <CardDescription>
            Find guidance on how to use the portal based on your role.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Store Manager</AccordionTrigger>
              <AccordionContent>
                Use the 'Inventory' tab to see all items. Use 'Issue / Return' to manage equipment for events. Check the 'Requests' tab for low-stock warnings and outsourcing suggestions. The 'Maintenance' tab is for logging repairs.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Finance Manager</AccordionTrigger>
              <AccordionContent>
                Your dashboard is organized into four tabs: Quotations, LPOs, Invoices, and Payments. Use the 'Actions' button on each tab to create new documents. You can also edit or view existing documents from the action menu in each row.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>HR/Admin</AccordionTrigger>
              <AccordionContent>
                Navigate using the sidebar to manage different HR functions. You can log daily attendance, add and track staff KPIs, manage field payments, and handle visitor registration from the respective pages.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4">
              <AccordionTrigger>Director / CEO</AccordionTrigger>
              <AccordionContent>
                Your main dashboard provides links to all major modules. Navigate to the 'Finance' module to approve or reject pending quotations. Use the 'Reports' page to get a high-level overview of all business operations.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger>IT Manager</AccordionTrigger>
              <AccordionContent>
                The IT dashboard allows you to manage users and roles, monitor system security, and access system settings. Use the quick action buttons for common tasks like running a security scan or adding a new user.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
