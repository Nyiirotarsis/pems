import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function RecruitmentPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Recruitment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Job posting and applicant tracking coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
}
