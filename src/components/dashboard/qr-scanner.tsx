
"use client";

import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner, Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CameraOff } from "lucide-react";
import { useForm } from "react-hook-form";

type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
};

export function QrScanner({ onScanSuccess, onClose }: QrScannerProps) {
  const [manualId, setManualId] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let scanner: Html5QrcodeScanner | null = null;
    let didCancel = false;

    Html5QrcodeScanner.getCameras().then(cameras => {
        if (didCancel || !cameras || cameras.length === 0) {
            setError("No cameras found. Please use manual entry.");
            return;
        }
        
        scanner = new Html5QrcodeScanner(
            "reader",
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );

        const handleSuccess = (decodedText: string, result: Html5QrcodeResult) => {
            scanner?.clear();
            onScanSuccess(decodedText);
        };

        const handleError = (errorMessage: string, error: Html5QrcodeError) => {
            // Ignore common errors, but log others
            if (!errorMessage.includes("No QR code found")) {
                console.error("QR Scanner Error:", errorMessage, error);
            }
        };

        scanner.render(handleSuccess, handleError);

    }).catch(err => {
        console.error("Camera permission error:", err);
        setError("Could not get camera permissions. Please check your browser settings and use manual entry.");
    });
    

    return () => {
        didCancel = true;
        if (scanner) {
            scanner.clear().catch(err => console.error("Failed to clear scanner", err));
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualId) {
      onScanSuccess(manualId);
    }
  };

  return (
    <Tabs defaultValue="camera" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="camera">Camera Scan</TabsTrigger>
        <TabsTrigger value="manual">Manual Entry</TabsTrigger>
      </TabsList>
      <TabsContent value="camera">
        <div className="mt-4">
            {error ? (
                <Alert variant="destructive">
                    <CameraOff className="h-4 w-4" />
                    <AlertTitle>Camera Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            ) : (
                <div id="reader" style={{ width: "100%" }}></div>
            )}
        </div>
      </TabsContent>
      <TabsContent value="manual">
        <form onSubmit={handleManualSubmit} className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">
                Use a barcode scanner gun or type the equipment ID below.
            </p>
            <Input
                placeholder="Enter Equipment ID"
                value={manualId}
                onChange={(e) => setManualId(e.target.value)}
                autoFocus
            />
            <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
                <Button type="submit">Submit</Button>
            </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
