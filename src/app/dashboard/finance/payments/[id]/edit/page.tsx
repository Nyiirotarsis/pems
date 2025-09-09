
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function EditPaymentPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Edit Payment</CardTitle>
          <CardDescription>Editing payment with ID: {params.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Payment edit form will go here.</p>
           <Button asChild variant="outline" className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
