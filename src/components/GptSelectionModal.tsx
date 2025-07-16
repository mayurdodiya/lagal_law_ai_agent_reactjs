import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";

// Mock data for GPT models
const gptModels = [
  { id: 1, name: "Criminal law", description: "Deals with crimes and punishment by the state.", icon: "⚖️" },
  { id: 2, name: "Labour law", description: "Regulates relationships between workers and employers.", icon: "👷‍♂️" },
  { id: 3, name: "Civil law", description: "Covers disputes between individuals and organizations.", icon: "📜" },
  { id: 4, name: "Environmental law", description: "Protects nature and regulates environmental issues.", icon: "🌿" },
  { id: 5, name: "Constitutional law", description: "Defines the structure and powers of the government.", icon: "🏛️" },
  { id: 6, name: "Environmental law", description: "Focuses on regulations for ecological balance.", icon: "🌱" },
  { id: 7, name: "Criminal law", description: "Handles offenses like theft, assault, or murder.", icon: "🧑‍⚖️" },
  { id: 8, name: "Labour law", description: "Ensures fair wages, safety, and work rights.", icon: "💼" },
  { id: 9, name: "Civil law", description: "Resolves non-criminal legal conflicts or damages.", icon: "⚖️" },
  { id: 10, name: "Environmental law", description: "Governs pollution control and wildlife protection.", icon: "🍃" },
  { id: 11, name: "Constitutional law", description: "Safeguards fundamental rights and freedoms.", icon: "📘" },
  { id: 12, name: "Environmental law", description: "Manages legal impact on ecosystems and nature.", icon: "🌎" },
  { id: 13, name: "Family law", description: "Handles marriage, divorce, and child custody.", icon: "👨‍👩‍👧‍👦" },
  { id: 14, name: "Corporate law", description: "Deals with business formation and governance.", icon: "🏢" },
  { id: 15, name: "Intellectual Property law", description: "Protects inventions, trademarks, and copyrights.", icon: "💡" },
  { id: 16, name: "Cyber law", description: "Regulates crimes and rights in digital space.", icon: "💻" },
  { id: 17, name: "Immigration law", description: "Manages legal entry, stay, and deportation.", icon: "🛂" },
  { id: 18, name: "Banking and Finance law", description: "Governs financial institutions and transactions.", icon: "💳" },
  { id: 19, name: "Health law", description: "Focuses on patient rights and healthcare policy.", icon: "❤️" },
  { id: 20, name: "Real Estate law", description: "Covers buying, selling, and ownership of land.", icon: "🏠" }
];


interface GptSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (selectedGpts: string[]) => void;
}

export const GptSelectionModal = ({ isOpen, onClose, onSave }: GptSelectionModalProps) => {
  const { user } = useAuth();
  const [selectedGpts, setSelectedGpts] = useState<string[]>([]);

  const maxSelections = useMemo(() => {
    const plan = user?.userProfileInfo?.planId;
    if (plan === "Professional") return 6;
    if (plan === "Basic") return 3;
    return gptModels.length; // Premium or no plan
  }, [user]);

  const isPremium = useMemo(() => user?.userProfileInfo?.planId === "Premium", [user]);

  const handleSelectGpt = (gptId: string) => {
    if (isPremium) return;

    setSelectedGpts((prev) => {
      if (prev.includes(gptId)) {
        return prev.filter((id) => id !== gptId);
      }
      if (prev.length < maxSelections) {
        return [...prev, gptId];
      }
      return prev;
    });
  };

  const handleSave = () => {
    onSave(selectedGpts);
    onClose();
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent showCloseButton={false} className="max-w-2xl md:max-w-4xl lg:max-w-6xl bg-background text-foreground p-0 rounded-lg overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border rounded-t-lg">
          <DialogTitle className="text-2xl font-bold">Choose Your Law Models</DialogTitle>
          <DialogDescription>{isPremium ? "As a Premium member, you have access to all GPT models." : `You can select up to ${maxSelections} models based on your ${user?.userProfileInfo?.planId} plan.`}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 max-h-[60vh] overflow-y-auto customScrollbar bg-muted/40 sidebar-scroll-thin">
          {gptModels.map((gpt) => {
            const isSelected = isPremium || selectedGpts.includes(gpt.id);
            const isDisabled = isPremium || (!isSelected && selectedGpts.length >= maxSelections);

            return (
              <div key={gpt.id} onClick={() => !isDisabled && handleSelectGpt(gpt.id)} className={`flex items-center space-x-4 rounded-lg border p-4 transition-all duration-200 ${isSelected ? "border-primary bg-primary/5" : "border-border"} ${isDisabled && !isSelected ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-primary/80"}`}>
                <Checkbox checked={isSelected} disabled={isDisabled} id={`gpt-${gpt.id}`} />
                <label htmlFor={`gpt-${gpt.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 w-full">
                  <div className="flex items-center gap-2">
                    {/* <span className="text-xl">{gpt.icon}</span> */}
                    <span className="font-semibold">{gpt.name}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">{gpt.description}</p>
                </label>
              </div>
            );
          })}
        </div>

        <DialogFooter className="p-6 pt-4 bg-background border-t sm:justify-between rounded-b-lg">
          {!isPremium ? (
            <div className="text-sm text-muted-foreground font-medium">
              {selectedGpts.length} / {maxSelections} selected
            </div>
          ) : (
            <div />
          )}
          <Button onClick={handleSave} size="lg" disabled={!isPremium && selectedGpts.length === 0}>
            Save & Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
