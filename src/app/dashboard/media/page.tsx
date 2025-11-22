
"use client";
import PEMSDashboard from "@/components/pems-dashboard";
import MediaDashboard from "@/components/media-dashboard";

export default function MediaDashboardPage() {
  return (
    <PEMSDashboard initialRole="Media and Communication Officer">
      <MediaDashboard />
    </PEMSDashboard>
  );
}
