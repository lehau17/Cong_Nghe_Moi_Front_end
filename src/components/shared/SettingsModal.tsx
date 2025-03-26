import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cài đặt</DialogTitle>
        </DialogHeader>
        <p>Nội dung cài đặt ở đây...</p>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
