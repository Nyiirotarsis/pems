
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Contact Us
          </CardTitle>
          <CardDescription>
            Get in touch with Pacific Events for support or inquiries.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Our Office</h3>
              <p className="text-muted-foreground">Plot 663 Mugema Road, Lugala</p>
              <p className="text-muted-foreground">Kampala, Uganda</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Phone className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-muted-foreground">+256 779 696774</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-primary mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-muted-foreground">info@pacificevents.com</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
