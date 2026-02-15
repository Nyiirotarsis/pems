"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PEMSDashboard from "@/components/pems-dashboard";

export default function ScanningDevicesPage() {
  return (
    <PEMSDashboard initialRole={null}>
      <div className="p-4 sm:p-6 lg:p-8">
          <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Button asChild variant="outline" size="icon">
                    <Link href="/dashboard/assets">
                      <ArrowLeft className="h-4 w-4" />
                    </Link>
                  </Button>
                  <div>
                    <CardTitle className="font-headline text-2xl">
                        Scanning Devices
                    </CardTitle>
                    <CardDescription>
                        Manage and configure barcode scanners and other scanning devices.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
              <p>This module is under construction.</p>
              </CardContent>
          </Card>
      </div>
    </PEMSDashboard>
  );
}
