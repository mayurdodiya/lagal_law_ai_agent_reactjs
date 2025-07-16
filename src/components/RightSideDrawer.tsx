import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, User, Clock, X } from "lucide-react";

interface RightSideDrawerProps {
  onClose: () => void;
}

export default function RightSideDrawer({ onClose }: RightSideDrawerProps) {
  return (
    <div className="h-full flex flex-col border-l bg-background text-foreground pt-4 pb-4 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b">
        <h2 className="text-lg font-semibold pl-4">Legal corp's Computer</h2>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* <Card className="flex-grow bg-muted/40 border-none">
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="w-full justify-start px-2">
              <MessageSquare className="w-4 h-4 mr-2" />
              Ask
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 text-center text-muted-foreground h-[calc(100%-80px)]">
          <div className="flex flex-col items-center justify-center h-full space-y-2">
            <MessageSquare className="w-12 h-12" />
            <h3 className="text-lg font-semibold text-foreground">Question Asked</h3>
            <p className="text-sm">No files attached to this question</p>
          </div>
        </CardContent>
      </Card> */}

      {/* <div className="flex items-center text-sm text-muted-foreground pt-2 border-t">
        <User className="w-4 h-4 mr-2" />
        <span>User Interaction</span>
        <span className="ml-auto flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {new Date().toLocaleDateString(undefined, { month: "numeric", day: "numeric", year: "2-digit" })}
        </span>
      </div> */}
    </div>
  );
}
