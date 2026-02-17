
"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Html5Qrcode,
  Html5QrcodeError,
  Html5QrcodeResult,
  Html5QrcodeSupportedFormats,
} from "html5-qrcode";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { CameraOff } from "lucide-react";

type QrScannerProps = {
  onScanSuccess: (decodedText: string) => void;
  onClose: () => void;
};

export function QrScanner({ onScanSuccess, onClose }: QrScannerProps) {
  const [manualId, setManualId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const readerId = "qr-reader"; // Static ID for the element

  useEffect(() => {
    let html5QrCode: Html5Qrcode | null = null;
    let didCancel = false;
    
    // Ensure the element is in the DOM
    const readerElement = document.getElementById(readerId);
    if (!readerElement) {
        return;
    }

    html5QrCode = new Html5Qrcode(readerId, {
      formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      verbose: false,
    });

    const qrCodeSuccessCallback = (
      decodedText: string,
      decodedResult: Html5QrcodeResult
    ) => {
      if (!didCancel) {
        onScanSuccess(decodedText);
      }
    };

    const config = { fps: 10, qrbox: { width: 250, height: 250 } };

    const startScanning = async () => {
      try {
        await html5QrCode!.start(
          { facingMode: "environment" },
          config,
          qrCodeSuccessCallback,
          undefined
        );
      } catch (err: any) {
        console.error("QR Code scanning failed to start.", err);
        if (err.name === "NotAllowedError") {
          setError(
            "Camera access was denied. Please enable camera permissions in your browser settings and refresh the page."
          );
        } else {
          setError(
            "Could not start camera. Please check if another application is using it or if a camera is connected."
          );
        }
      }
    };

    startScanning();

    return () => {
      didCancel = true;
      if (html5QrCode && html5QrCode.isScanning) {
        html5QrCode.stop().catch((err) => console.error("Failed to stop QR scanner.", err));
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
          <div id={readerId} style={{ width: "100%" }}></div>
          {error && (
            <Alert variant="destructive" className="mt-4">
              <CameraOff className="h-4 w-4" />
              <AlertTitle>Camera Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </TabsContent>
    </Tabs>
  );
}
