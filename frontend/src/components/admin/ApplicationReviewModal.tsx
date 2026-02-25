// /frontend/src/components/admin/ApplicationReviewModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Eye, RefreshCw } from "lucide-react";
import { API_BASE_URL, getBusiness, Business } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

// Assuming Application type is defined in ApplicationsPage.tsx or a shared types file
// For now, let's redefine a similar structure here for clarity if not imported
interface Application {
  id: string;
  business_name: string;
  location: string;
  contact_name: string;
  tel: string;
  email: string;
  website?: string;
  category: string;
  description: string;
  image_url?: string;
  applicationType?: 'new' | 'edit';
  businessId?: string;
  dateSubmitted?: string;
}

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onApprove: (application: Application) => Promise<void>; // Updated to accept Application and expect Promise
  onReject: (application: Application) => Promise<void>;  // Updated to accept Application and expect Promise
}

const DetailItem = ({ label, value, isEdited }: { label: string; value?: string; isEdited?: boolean }) => {
  if (!value) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        {isEdited && (
          <span className="text-[10px] bg-red-50 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-red-200 flex items-center gap-1 shadow-sm">
            <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
            Edited
          </span>
        )}
      </div>
      <p className="text-md text-gray-900 leading-tight">{value}</p>
    </div>
  );
};

export const ApplicationReviewModal = ({
  isOpen,
  onClose,
  application,
  onApprove,
  onReject
}: ApplicationReviewModalProps) => {
  const [isRejectConfirmationOpen, setIsRejectConfirmationOpen] = useState(false);
  const [isImagePreviewOpen, setIsImagePreviewOpen] = useState(false);
  const { toast } = useToast();

  const handleRejectClick = () => {
    setIsRejectConfirmationOpen(true);
  };

  const handleConfirmReject = async () => {
    try {
      if (application) {
        await onReject(application);
        setIsRejectConfirmationOpen(false);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCancelReject = () => {
    setIsRejectConfirmationOpen(false);
  };

  const handleApproveClick = async () => {
    try {
      if (application) {
        await onApprove(application);
        onClose();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const { data: originalBusiness } = useQuery({
    queryKey: ["business", application?.businessId],
    queryFn: () => getBusiness(application!.businessId!),
    enabled: !!application?.businessId && application?.applicationType === 'edit' && isOpen,
  });

  if (!application) return null;

  const isFieldEdited = (field: keyof Application, originalField?: keyof Business) => {
    if (!originalBusiness || application.applicationType !== 'edit') return false;
    const currentVal = application[field]?.toString().trim() || "";
    // @ts-ignore - access by key
    const originalVal = (originalBusiness[originalField || (field as keyof Business)] as any)?.toString().trim() || "";
    return currentVal !== originalVal;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <DialogTitle>Review Application: {application.business_name}</DialogTitle>
              {application.applicationType === 'edit' && (
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border border-blue-200 shadow-sm">
                  <RefreshCw className="h-3 w-3 animate-spin-slow" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Update Request</span>
                </div>
              )}
            </div>
            <DialogDescription>
              Submitted by: {application.contact_name} ({application.email})
            </DialogDescription>
          </DialogHeader>

          {application.applicationType === 'edit' && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-800 text-sm mb-4 shadow-sm">
              <strong>Notice:</strong> This is a request to update an existing business (ID: {application.businessId}). Approving will overwrite the existing details.
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Business Name"
                value={application.business_name}
                isEdited={isFieldEdited('business_name')}
              />
              <DetailItem
                label="Location"
                value={application.location}
                isEdited={isFieldEdited('location')}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem
                label="Contact Name"
                value={application.contact_name}
                isEdited={isFieldEdited('contact_name')}
              />
              <DetailItem
                label="Telephone"
                value={application.tel}
                isEdited={isFieldEdited('tel')}
              />
            </div>
            <DetailItem
              label="Email Address"
              value={application.email}
              isEdited={isFieldEdited('email')}
            />
            {application.website && (
              <DetailItem
                label="Website"
                value={application.website}
                isEdited={isFieldEdited('website')}
              />
            )}
            <DetailItem
              label="Category"
              value={application.category}
              isEdited={isFieldEdited('category')}
            />

            <Separator className="my-2" />

            <div>
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium text-gray-500">Description</p>
                {isFieldEdited('description') && (
                  <span className="text-[10px] bg-red-50 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-tighter border border-red-200 flex items-center gap-1 shadow-sm">
                    <span className="h-1 w-1 rounded-full bg-red-500 animate-pulse" />
                    Edited
                  </span>
                )}
              </div>
              <p className="text-md text-gray-900 whitespace-pre-wrap leading-relaxed">{application.description}</p>
            </div>

            {application.image_url && (
              <div className="mt-4 p-3 border rounded-md bg-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Business Image</p>
                  <p className="text-xs text-gray-500">Click preview to view full image</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => setIsImagePreviewOpen(true)}
                >
                  <Eye className="h-4 w-4" />
                  Preview Image
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="sm:justify-end gap-2 pt-4 border-t border-border mt-6 sticky bottom-0 bg-background pb-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleRejectClick}>
              Reject
            </Button>
            <Button type="button" variant="default" onClick={handleApproveClick} className="bg-green-600 hover:bg-green-700 text-white">
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Modal */}
      <Dialog open={isImagePreviewOpen} onOpenChange={setIsImagePreviewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto p-0 bg-black/90 border-none">
          <div className="relative flex justify-center items-center min-h-[50vh]">
            <Button
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2"
              variant="ghost"
              onClick={() => setIsImagePreviewOpen(false)}
            >
              ✕
            </Button>
            <img
              src={`${API_BASE_URL}${application.image_url}`}
              alt={application.business_name}
              className="max-w-full max-h-[85vh] object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                // Fallback handled by UI showing nothing or we could add text
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectConfirmationOpen} onOpenChange={setIsRejectConfirmationOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogDescription>
              Are you sure you want to reject this application? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancelReject}>
              No, Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={handleConfirmReject}>
              Yes, Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
