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
// Removed Textarea, Label, useState imports as they are no longer needed for comments

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
  // Removed comment state
  if (!application) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
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

          {application.business_image_name && (
            <div className="mt-4 p-3 border rounded-md bg-gray-50">
              <p className="text-sm font-medium text-gray-600">Business Image File:</p>
              <p className="text-md text-gray-800 font-semibold break-all">{application.business_image_name}</p>
              <p className="text-xs text-gray-500 mt-1">
                (Image preview would appear here if a URL was available. Currently showing filename only.)
              </p>
              {/* Example: <img src={application.imageUrl} alt={application.business_name} className="mt-2 max-h-48 w-auto rounded" /> */}
            </div>
          )}
          {/* Comment section removed */}
        </div>

        <DialogFooter className="gap-2 sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => { if (application) onReject(application); }}
            >
              Reject
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => { if (application) onApprove(application); }}
            >
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
