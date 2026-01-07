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
import { Eye } from "lucide-react";

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
  image_url?: string; // Added for uploaded images
  business_image_name?: string;
  dateSubmitted?: string; // Optional for display in modal
}

interface ApplicationReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
  onApprove: (application: Application) => Promise<void>; // Updated to accept Application and expect Promise
  onReject: (application: Application) => Promise<void>;  // Updated to accept Application and expect Promise
}

const DetailItem = ({ label, value }: { label: string; value?: string }) => {
  if (!value) return null;
  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-md text-gray-900">{value}</p>
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

  if (!application) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application: {application.business_name}</DialogTitle>
            <DialogDescription>
              Submitted by: {application.contact_name} ({application.email})
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Business Name" value={application.business_name} />
              <DetailItem label="Location" value={application.location} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DetailItem label="Contact Name" value={application.contact_name} />
              <DetailItem label="Telephone" value={application.tel} />
            </div>
            <DetailItem label="Email Address" value={application.email} />
            {application.website && <DetailItem label="Website" value={application.website} />}
            <DetailItem label="Category" value={application.category} />

            <Separator className="my-2" />

            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="text-md text-gray-900 whitespace-pre-wrap">{application.description}</p>
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
              src={`http://localhost:5000${application.image_url}`}
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
