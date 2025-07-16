import { lazy, Suspense, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import AppProvidersWrapper from "../components/AppProvidersWrapper";

const RightSideDrawer = lazy(() => import("../components/RightSideDrawer"));
const ChatScreenSiteHeader = lazy(() => import("@/components/ui/chatscreen-site-header"));
const PromptArea = lazy(() => import("../components/PromptArea"));
const LeftSideBar = lazy(() => import("../components/LeftSideBar").then((module) => ({ default: module.LeftSideBar })));
const ChatFeed = lazy(() => import("../pages/ChatFeed"));
import { GptSelectionModal } from "../components/GptSelectionModal";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../integrations/supabase/client";

const ChatScreen = () => {
  const { user, loading, setUser } = useAuth();
  const [isGptModalOpen, setIsGptModalOpen] = useState(false);
  const [isRightDrawerOpen, setIsRightDrawerOpen] = useState(false);

  // When the right drawer opens, the left sidebar should collapse.
  const isLeftSidebarCollapsed = isRightDrawerOpen;

  useEffect(() => {
    if (!loading && user && !user.userProfileInfo?.has_selected_gpts) {
      setIsGptModalOpen(true);
    }
  }, [user, loading]);

  const handleSaveGpts = async (selectedGpts: string[]) => {
    if (!user?.id) return;

    const { error } = await supabase.from("profiles").update({ selected_gpts: selectedGpts, has_selected_gpts: true }).eq("id", user.id);

    if (!error) {
      setUser((prev) => ({
        ...prev,
        userProfileInfo: {
          ...prev.userProfileInfo,
          selected_gpts: selectedGpts,
          has_selected_gpts: true,
        },
      }));
      setIsGptModalOpen(false);
    } else {
      console.error("Error saving GPT selection:", error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <AppProvidersWrapper>
      <div className="flex h-screen bg-background text-foreground w-full">
        <Suspense>
          <GptSelectionModal isOpen={isGptModalOpen} onClose={() => setIsGptModalOpen(false)} onSave={handleSaveGpts} />
        </Suspense>

        <Suspense fallback={<div className="bg-muted" />}>
          <LeftSideBar isCollapsed={isLeftSidebarCollapsed} />
        </Suspense>

        <main className="flex-1 flex flex-col h-screen relative overflow-hidden">
          <div className="z-30">
            <Suspense>
              <ChatScreenSiteHeader onToggleRightDrawer={() => setIsRightDrawerOpen(!isRightDrawerOpen)} isRightDrawerOpen={isRightDrawerOpen} />
            </Suspense>
          </div>

          <div className="flex-1 overflow-y-auto sidebar-scroll-thin">
            <div className="px-4 sm:px-6 lg:px-8 py-4 pb-40">
              <Suspense>
                <ChatFeed />
              </Suspense>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-0 z-20 pb-5 bg-background">
            <div className="px-4 sm:px-6 lg:px-8">
              <Suspense>
                <PromptArea />
              </Suspense>
            </div>
          </div>
        </main>

        <aside className={cn("transition-all duration-300 ease-in-out bg-background", isRightDrawerOpen ? "w-[650px]" : "w-0")}>
          {isRightDrawerOpen && (
            <Suspense fallback={<div className="h-full bg-muted" />}>
              <RightSideDrawer onClose={() => setIsRightDrawerOpen(false)} />
            </Suspense>
          )}
        </aside>
      </div>
    </AppProvidersWrapper>
  );
};

export default ChatScreen;
