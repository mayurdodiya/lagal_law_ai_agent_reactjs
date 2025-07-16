import React, { useState, useRef, useEffect, useCallback } from "react";

// 🧩 Icons from react-icons
import { LuPaperclip, LuArrowUp } from "react-icons/lu";
import { CgSpinner } from "react-icons/cg";
import { GrDocumentDownload } from "react-icons/gr";
import { GiGavel, GiScales } from "react-icons/gi";
import { MdPeopleAlt } from "react-icons/md";
import { FaLandmark } from "react-icons/fa";
import { TbLeaf } from "react-icons/tb";
import { PiSlidersHorizontal } from "react-icons/pi";
import { BsGrid3X3Gap } from "react-icons/bs";
import { IoDocumentAttachOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { FiFileText, FiImage, FiVideo } from "react-icons/fi";

// ✅ ShadCN UI components
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// 🛠️ Utils and state
import { cn, getFileIcon } from "@/lib/utils";
import { useChatContext } from "@/states/useChatContext";
import { useWebSocketContext } from "@/states/useWebSocketContext";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { addMsgInChatFeed, addMsgInChatHistory } from "@/store/slices/chatSlice";
import { includes, uuidv4 } from "zod/v4";

// 🎯 Tools list
const toolsList = [
  { icon: <GiGavel />, label: "Criminal law model" },
  { icon: <MdPeopleAlt />, label: "Labour law model" },
  { icon: <GiScales />, label: "Civil law model" },
  { icon: <TbLeaf />, label: "Environmental law model" },
  { icon: <FaLandmark />, label: "Constitutional law model" },
  { icon: <TbLeaf />, label: "Environmental law model" },
  { icon: <FaLandmark />, label: "Constitutional law model" },
];

// 📎 Attachments list
const attachmentsList = [{ icon: <GrDocumentDownload />, label: "Attach a document" }];

export default function PromptArea() {
  const {
    responseWaiting: { isWaiting, setIsWaiting },
    filesFilterActions: { selectedFiles },
  } = useChatContext();
  const { isConnected, sendQuery } = useWebSocketContext();
  const [prompt, setPrompt] = useState("");
  const [toolsOpen, setToolsOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { selectedChatRoom } = useSelector((state: any) => state.chat);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();

  // check uploaded doc is image or not
  const isDocTypeImage = (type: string) => {
    const imagesTypes = ["image/jpg", "image/jpeg", "image/png", "image/gif"];
    if (imagesTypes.includes(type)) {
      return true;
    }
    return false;
  };

  // ✅ Auto-grow textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [prompt]);

  // ✅ Close tools/attach on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        if (attachOpen) setAttachOpen(false);
        if (toolsOpen) setToolsOpen(false);
      }
    }
    if (attachOpen || toolsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [attachOpen, toolsOpen]);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  // add image file on prompt area
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      setImages([...images, ...Array.from(files)]);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  // remove image file on prompt area
  const handleRemoveFile = (index: number) => {
    setImages(images.filter((image, i) => i !== index));
  };

  // ✅ Form submit
  // const handleSubmit = useCallback(
  //   (event: React.FormEvent<HTMLFormElement>) => {
  //     event.preventDefault();
  //     if (!prompt.trim()) return;
  //     setIsWaiting(true);
  //     sendQuery(prompt);
  //     setPrompt("");
  //   },
  //   [prompt, selectedFiles]
  // );

  const SubmitIcon = isWaiting ? CgSpinner : LuArrowUp;

  // submit new message
  const handleNewMessage = (event: React.FormEvent<HTMLFormElement>) => {
    console.log(images, "-------------------------------------images2222");
    event.preventDefault();
    const msgObjForState = {
      // id: uuidv4(),
      sender_type: "user",
      chat_id: selectedChatRoom?.id,
      message: prompt ?? "",
      created_at: new Date(),
      documents:
        images?.length > 0
          ? images?.map((image) => {
              return {
                url: URL.createObjectURL(image),
                mime_type: image.type,
                file_name: image.name,
                //    message_id: addMessage.id, // show here dupabase msg id
              };
            })
          : [],
    };
    dispatch(addMsgInChatFeed(msgObjForState));
    setPrompt("");
    setImages([]);

    // add msgObj in db & upload image in s3 & add documentObj in db
    // const msgCreatApiObj = {
    //   sender_type: "user",
    //   chat_id: selectedChatRoom?.id,
    //   message: prompt ?? "",
    // }
    // const addMessage = call api
    // const documentObj = images?.length > 0 ? images?.map((image)=> {
    //    return {
    //    url: URL.createObjectURL(image),
    //    mime_type: image.type,
    //    file_name: image.name,
    //    message_id: addMessage.id, // show here dupabase msg id
    //  }
    // })
    // : [],
    // upload image api in s3 bucket receive [url array]
    // const addDocOfMsg = await call api (bulk create)
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && prompt.trim()) {
      handleNewMessage(e as any);
    }
  };

  return (
    <div>
      <form className="flex flex-col bg-muted rounded-2xl px-4 py-3 shadow-lg border min-h-[56px] max-w-[1024px] mx-auto" onSubmit={handleNewMessage}>
        {/* uploaded images attechments preview on prompt area */}
        {images.length > 0 && (
          <div className="mt-[5px] mb-[12px] flex gap-3.5">
            {images.map((image, index) => {
              return (
                <div className="relative w-[100px] h-[100px]">
                  {isDocTypeImage(image.type) ? (
                    <img src={URL.createObjectURL(image)} alt="image" className="w-full h-full rounded-[13px] object-cover" />
                  ) : (
                    <div key={image.name} className="flex items-center gap-2 bg-muted p-2 rounded-lg border max-w-xs hover:border-primary/40 transition-colors">
                      {getFileIcon(image?.name)}
                      <span className="text-sm text-foreground truncate">{image?.name}</span>
                    </div>
                  )}
                  <Button type="button" variant="ghost" size="icon" className={`absolute top-1 right-1 ${isDocTypeImage(image.type) ? "h-6 w-6" : "h-4 w-4"} rounded-full bg-white text-black hover:bg-black/75 cursor-pointer`} onClick={() => handleRemoveFile(index)}>
                    <IoMdClose size={isDocTypeImage(image.type) ? 16 : 10} />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ Textarea */}
        <textarea ref={textareaRef} placeholder="Ask anything" className={cn("w-full bg-transparent border-none outline-none ring-0 focus:outline-none focus:ring-0 focus:border-none", "text-white placeholder:text-zinc-400", "resize-none overflow-y-auto min-h-[40px] max-h-40 text-base font-normal mb-3", "focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none", "scrollbar-thin")} value={prompt} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => !isWaiting && setPrompt(e.target.value)} onKeyDown={handleKeyDown} rows={1} style={{ lineHeight: "1.6" }} />
        {/* ✅ Bottom Row */}
        <div className="flex flex-row items-center justify-between w-full relative">
          <div className="flex items-center gap-1 relative" ref={toolsRef}>
            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" multiple />
            {/* 📎 Attach Icon with Popover */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground" aria-label="Open attachments" type="button">
                  <LuPaperclip size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[240px] rounded-xl shadow-2xl p-2" align="start" sideOffset={8}>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="flex items-center w-full px-3 py-2 text-left gap-3 rounded-lg transition-colors hover:bg-accent cursor-pointer">
                    <BsGrid3X3Gap />
                    <span>Add from apps</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="rounded-lg shadow-2xl">
                    <DropdownMenuItem>App 1</DropdownMenuItem>
                    <DropdownMenuItem>App 2</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {/* file picker */}
                <DropdownMenuItem onSelect={handleFileSelect} className="flex items-center w-full px-3 py-2 text-left gap-3 rounded-lg transition-colors hover:bg-accent cursor-pointer">
                  <IoDocumentAttachOutline />
                  <span>Add photos & files</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* <Button
              variant="ghost"
              className="flex items-center text-muted-foreground hover:text-foreground px-2 py-1 rounded-lg transition-colors"
              onClick={() => setToolsOpen((v) => !v)}
              aria-label="Open tools"
              type="button"
            >
              <PiSlidersHorizontal size={18} />
              <span className="ml-1 text-sm font-medium text-foreground">Tools</span>
            </Button> */}
          </div>

          {/* 👉 Submit Button */}
          <Button variant="ghost" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full w-9 h-9" type="submit" aria-label="Submit prompt" disabled={isWaiting || !prompt.trim()}>
            <SubmitIcon size={20} className={cn(isWaiting && "animate-spin")} />
          </Button>
        </div>
      </form>
    </div>
  );
}
