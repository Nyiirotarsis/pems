
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadCloud, FileText } from "lucide-react";

const initialPolicies = [
    { id: 1, name: "Employee Code of Conduct.pdf", size: "2.1 MB" },
    { id: 2, name: "Data Protection & Privacy Policy.pdf", size: "850 KB" },
    { id: 3, name: "Health and Safety Policy.pdf", size: "1.5 MB" },
];

export default function PoliciesPage() {
    const [policies, setPolicies] = useState(initialPolicies);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            setSelectedFile(event.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (selectedFile) {
            const newPolicy = {
                id: policies.length + 1,
                name: selectedFile.name,
                size: `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB`,
            };
            setPolicies([...policies, newPolicy]);
            setSelectedFile(null);
            // In a real app, you would upload the file to a server here.
            alert(`"${selectedFile.name}" uploaded successfully!`);
        }
    };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">
            Company Policies
          </CardTitle>
          <CardDescription>
            Access and manage official company policy documents.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            <div>
                <h3 className="font-semibold text-lg mb-4">Upload New Policy</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    <Input 
                        type="file" 
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="flex-grow"
                    />
                    <Button onClick={handleUpload} disabled={!selectedFile}>
                        <UploadCloud className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg mb-4">Published Policies</h3>
                 <div className="space-y-3">
                    {policies.map((policy) => (
                        <div key={policy.id} className="flex items-center justify-between p-3 border rounded-md bg-secondary/50">
                            <div className="flex items-center gap-3">
                                <FileText className="h-5 w-5 text-primary" />
                                <div className="flex flex-col">
                                    <span className="font-medium">{policy.name}</span>
                                    <span className="text-xs text-muted-foreground">{policy.size}</span>
                                </div>
                            </div>
                            <Button variant="outline" size="sm" asChild>
                                <a href="#" download={policy.name}>Download</a>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
