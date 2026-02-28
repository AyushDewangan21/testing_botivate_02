"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  FileText,
  Upload,
  Camera,
  Eye,
  Download,
  Calendar,
  UserCheck,
  ShieldCheck,
  FileCheck,
  ChevronRight
} from "lucide-react";

interface KYCStatusPageProps {
  user: any;
  onClose: () => void;
  isOpen: boolean;
  currentStatus: "verified" | "pending" | "incomplete";
}

type KYCStatus = "verified" | "pending" | "incomplete";

export function KYCStatusPage({ user, onClose, isOpen, currentStatus }: KYCStatusPageProps) {
  const [status, setStatus] = useState<KYCStatus>(currentStatus);
  const [documents, setDocuments] = useState({
    aadhaar: { uploaded: false, verified: false },
    pan: { uploaded: false, verified: false },
    photo: { uploaded: false, verified: false },
    addressProof: { uploaded: false, verified: false }
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Handle escape key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const getStatusConfig = (status: KYCStatus) => {
    switch (status) {
      case "verified":
        return {
          icon: CheckCircle,
          title: "KYC Verified",
          subtitle: "Your KYC verification is complete",
          color: "text-green-600 dark:text-green-400",
          bgColor: "bg-green-100 dark:bg-green-900/30",
          borderColor: "border-green-200 dark:border-green-800",
          description: "You can now access all features and higher transaction limits."
        };
      case "pending":
        return {
          icon: Clock,
          title: "Under Review",
          subtitle: "Your documents are being verified",
          color: "text-yellow-600 dark:text-yellow-400",
          bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
          borderColor: "border-yellow-200 dark:border-yellow-800",
          description: "Verification usually takes 24-48 hours. You'll be notified once completed."
        };
      case "incomplete":
        return {
          icon: AlertCircle,
          title: "Incomplete",
          subtitle: "Please complete your KYC verification",
          color: "text-red-600 dark:text-red-400",
          bgColor: "bg-red-100 dark:bg-red-900/30",
          borderColor: "border-red-200 dark:border-red-800",
          description: "Complete KYC to unlock all features and higher transaction limits."
        };
    }
  };

  const handleUploadDocument = (docType: keyof typeof documents) => {
    if (isUploading) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setDocuments(prev => ({
            ...prev,
            [docType]: { ...prev[docType], uploaded: true }
          }));

          // Auto update status if all documents uploaded
          const allUploaded = Object.values({ ...documents, [docType]: { uploaded: true, verified: false } })
            .every(doc => doc.uploaded);

          if (allUploaded && status === "incomplete") {
            setStatus("pending");
          }

          return 100;
        }
        return prev + 10;
      });
    }, 100);
  };

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Side Panel */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md transform overflow-y-auto bg-gray-50 shadow-2xl
          transition-all duration-300 ease-in-out dark:bg-neutral-900
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-neutral-800"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                KYC Status
              </h2>
              <p className="text-sm text-gray-500 dark:text-neutral-400">
                Verify your identity
              </p>
            </div>
          </div>

          {status !== "verified" && (
            <button
              onClick={() => {
                // Start KYC process
                console.log("Start KYC process");
              }}
              className="rounded-lg bg-[#3D3066] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#4D3F7F] dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
            >
              {status === "incomplete" ? "Start KYC" : "Check Status"}
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Status Card */}
          <div className={`mb-6 rounded-xl border ${statusConfig.borderColor} ${statusConfig.bgColor} p-5`}>
            <div className="flex items-start gap-4">
              <div className={`rounded-full p-3 ${statusConfig.bgColor}`}>
                <StatusIcon className={`h-6 w-6 ${statusConfig.color}`} />
              </div>
              <div className="flex-1">
                <h3 className={`font-semibold ${statusConfig.color}`}>
                  {statusConfig.title}
                </h3>
                <p className="mt-1 text-sm text-gray-700 dark:text-neutral-300">
                  {statusConfig.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-700 dark:text-neutral-300">Verification Progress</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {status === "verified" ? "100%" : status === "pending" ? "75%" : "25%"}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
              <div
                className={`h-full rounded-full transition-all duration-500 ${status === "verified"
                    ? "bg-green-500"
                    : status === "pending"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  }`}
                style={{
                  width: status === "verified" ? "100%" : status === "pending" ? "75%" : "25%"
                }}
              />
            </div>
          </div>

          {/* Documents Required */}
          <div className="mb-6">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <FileText className="h-4 w-4" />
              Documents Required
            </h3>
            <div className="space-y-3">
              {/* Aadhaar Card */}
              <div className={`rounded-lg border ${documents.aadhaar.verified ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-neutral-700'} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${documents.aadhaar.verified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                      <FileText className={`h-5 w-5 ${documents.aadhaar.verified ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-neutral-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Aadhaar Card</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {documents.aadhaar.verified ? "Verified" : documents.aadhaar.uploaded ? "Under Review" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {documents.aadhaar.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : documents.aadhaar.uploaded ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <button
                        onClick={() => handleUploadDocument('aadhaar')}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#4D3F7F] disabled:opacity-50 dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
                {isUploading && documents.aadhaar.uploaded && (
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-gray-600 dark:text-neutral-400">Uploading...</span>
                      <span className="font-medium">{uploadProgress}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700">
                      <div
                        className="h-full rounded-full bg-[#3D3066] transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PAN Card */}
              <div className={`rounded-lg border ${documents.pan.verified ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-neutral-700'} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${documents.pan.verified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                      <FileText className={`h-5 w-5 ${documents.pan.verified ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-neutral-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">PAN Card</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {documents.pan.verified ? "Verified" : documents.pan.uploaded ? "Under Review" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {documents.pan.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : documents.pan.uploaded ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <button
                        onClick={() => handleUploadDocument('pan')}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#4D3F7F] disabled:opacity-50 dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div className={`rounded-lg border ${documents.photo.verified ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-neutral-700'} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${documents.photo.verified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                      <Camera className={`h-5 w-5 ${documents.photo.verified ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-neutral-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Photograph</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {documents.photo.verified ? "Verified" : documents.photo.uploaded ? "Under Review" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {documents.photo.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : documents.photo.uploaded ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <button
                        onClick={() => handleUploadDocument('photo')}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#4D3F7F] disabled:opacity-50 dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                      >
                        <Camera className="h-4 w-4" />
                        Take Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Address Proof */}
              <div className={`rounded-lg border ${documents.addressProof.verified ? 'border-green-200 dark:border-green-800' : 'border-gray-200 dark:border-neutral-700'} p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${documents.addressProof.verified ? 'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-neutral-800'}`}>
                      <FileText className={`h-5 w-5 ${documents.addressProof.verified ? 'text-green-600 dark:text-green-400' : 'text-gray-600 dark:text-neutral-400'}`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Address Proof</h4>
                      <p className="text-sm text-gray-500 dark:text-neutral-400">
                        {documents.addressProof.verified ? "Verified" : documents.addressProof.uploaded ? "Under Review" : "Not Uploaded"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {documents.addressProof.verified ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : documents.addressProof.uploaded ? (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    ) : (
                      <button
                        onClick={() => handleUploadDocument('addressProof')}
                        disabled={isUploading}
                        className="flex items-center gap-2 rounded-lg bg-[#3D3066] px-3 py-1.5 text-sm text-white transition-colors hover:bg-[#4D3F7F] disabled:opacity-50 dark:bg-[#4D3F7F] dark:hover:bg-[#5C4E8F]"
                      >
                        <Upload className="h-4 w-4" />
                        Upload
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KYC Benefits */}
          <div className="mb-6 rounded-xl bg-gradient-to-br from-[#3D3066]/10 to-[#8B7FA8]/10 p-5 dark:from-[#3D3066]/20 dark:to-[#8B7FA8]/20">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-white">
              <ShieldCheck className="h-4 w-4" />
              Benefits of KYC Verification
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Higher transaction limits
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Faster withdrawal processing
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Access to premium features
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Enhanced security and fraud protection
              </li>
            </ul>
          </div>

          {/* Recent Activity */}
          <div className="mb-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-neutral-700">
                <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/30">
                  <FileCheck className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Document Submitted
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    PAN Card uploaded for verification
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-neutral-400">2 days ago</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-lg border border-gray-200 p-3 dark:border-neutral-700">
                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                  <UserCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    KYC Process Started
                  </p>
                  <p className="text-xs text-gray-500 dark:text-neutral-400">
                    Submitted personal details
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-neutral-400">5 days ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Actions */}
          <div className="space-y-3">
            <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              <div className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                <span className="text-gray-900 dark:text-white">View Submitted Documents</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
            </button>

            <button className="flex w-full items-center justify-between rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:hover:bg-neutral-800">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-gray-600 dark:text-neutral-400" />
                <span className="text-gray-900 dark:text-white">Download KYC Certificate</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 dark:text-neutral-500" />
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4 dark:bg-neutral-800">
            <p className="text-xs text-gray-600 dark:text-neutral-400">
              Need help with KYC? Contact our support team at support@atplus.com or call 1800-XXX-XXXX.
              Documents are processed within 24-48 hours.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}