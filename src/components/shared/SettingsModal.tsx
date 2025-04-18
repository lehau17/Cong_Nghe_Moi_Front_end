import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SettingsModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[800px] h-[500px] max-w-2xl min-w-[700px]">
              <div className="flex">
                  <div className="w-40 border-r-1 shadow-r flex flex-col">

                  </div>
                  <div className="flex-1 "></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
