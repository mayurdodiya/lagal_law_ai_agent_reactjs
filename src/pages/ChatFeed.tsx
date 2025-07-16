import { fetchChatFeedHistory } from "@/helpers/api";
import { supabase } from "@/integrations/supabase/client";
import { fetchChatFeedData } from "@/store/slices/chatSlice";
import { Database } from "@/types/supabase";
import { useQuery } from "@tanstack/react-query";
import { UUID } from "crypto";
import { useEffect, useRef, useState } from "react";
import { FiCopy, FiFileText, FiImage, FiVideo } from "react-icons/fi";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import { IoArrowDownOutline } from "react-icons/io5";
import { useAuth } from "@/contexts/AuthContext";
import { capitalize } from "lodash";
import { getFileIcon } from "@/lib/utils";

const ChatMessage = ({ content }) => {
  return <ReactMarkdown>{content}</ReactMarkdown>;
};

const dummyData = [
  {
    id: 1,
    sender_type: "user",
    chat_id: 1,
    message: "Hello, how can I help you today?",
    documents: [
      {
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 3,
        name: "document1.pdf",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
    ],
    create_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: 2,
    sender_type: "bot",
    chat_id: 1,
    message: "Sure, I can assist you with that.",
    documents: [],
    create_at: "2023-10-01T12:01:00Z",
    updated_at: "2023-10-01T12:01:00Z",
  },
  {
    id: 3,
    sender_type: "user",
    chat_id: 1,
    message: "Can you send me the latest report?",
    documents: [],
    create_at: "2023-10-01T12:02:00Z",
    updated_at: "2023-10-01T12:02:00Z",
  },
  {
    id: 4,
    sender_type: "bot",
    chat_id: 1,
    message: "Here is the latest report.",
    documents: [
      {
        id: 3,
        name: "report.pdf",
        url: "https://example.com/report.pdf",
      },
    ],
    create_at: "2023-10-01T12:03:00Z",
    updated_at: "2023-10-01T12:03:00Z",
  },
  {
    id: 1,
    sender_type: "user",
    chat_id: 1,
    message: "Hello, how can I help you today?",
    documents: [
      {
        id: 1,
        name: "document1.pdf",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://example.com/image1.jpg",
      },
    ],
    create_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: 2,
    sender_type: "bot",
    chat_id: 1,
    message: "Sure, I can assist you with that.",
    documents: [],
    create_at: "2023-10-01T12:01:00Z",
    updated_at: "2023-10-01T12:01:00Z",
  },
  {
    id: 3,
    sender_type: "user",
    chat_id: 1,
    message: "Can you send me the latest report?",
    documents: [],
    create_at: "2023-10-01T12:02:00Z",
    updated_at: "2023-10-01T12:02:00Z",
  },
  {
    id: 4,
    sender_type: "bot",
    chat_id: 1,
    message: "Here is the latest report.",
    documents: [
      {
        id: 3,
        name: "report.pdf",
        url: "https://example.com/report.pdf",
      },
    ],
    create_at: "2023-10-01T12:03:00Z",
    updated_at: "2023-10-01T12:03:00Z",
  },
  {
    id: 1,
    sender_type: "user",
    chat_id: 1,
    message: "Hello, how can I help you today?",
    documents: [
      {
        id: 1,
        name: "document1.pdf",
        url: "https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://example.com/image1.jpg",
      },
      {
        id: 2,
        name: "image1.jpg",
        url: "https://example.com/image1.jpg",
      },
    ],
    create_at: "2023-10-01T12:00:00Z",
    updated_at: "2023-10-01T12:00:00Z",
  },
  {
    id: 2,
    sender_type: "bot",
    chat_id: 1,
    message: "Sure, I can assist you with that.",
    documents: [],
    create_at: "2023-10-01T12:01:00Z",
    updated_at: "2023-10-01T12:01:00Z",
  },
  {
    id: 3,
    sender_type: "user",
    chat_id: 1,
    message: "Can you send me the latest report?",
    documents: [],
    create_at: "2023-10-01T12:02:00Z",
    updated_at: "2023-10-01T12:02:00Z",
  },
  {
    id: 4,
    sender_type: "bot",
    chat_id: 1,
    message: "Here is the latest report.",
    documents: [
      {
        id: 3,
        name: "report.pdf",
        url: "https://example.com/report.pdf",
      },
    ],
    create_at: "2023-10-01T12:03:00Z",
    updated_at: "2023-10-01T12:03:00Z",
  },
];

export default function ChatFeed() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatFeedData = useSelector((state: any) => state.chat.chatFeedData);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const selectedChatRoom = useSelector((state: any) => state.chat.selectedChatRoom);
  const userData = useAuth();

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  };

  // set auto sctoll in bottom while new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatFeedData]);

  // click for scroll bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Show button only when not at the bottom
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;
      const isAtBottom = container.scrollHeight - container.scrollTop === container.clientHeight;
      console.log(isAtBottom, "---------------------- isAtBottom");
      setShowScrollButton(!isAtBottom);
    };

    const container = containerRef.current;
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative flex flex-col max-w-[1024px] mx-auto h-full">
      <div ref={containerRef} className="flex-1 overflow-y-auto h-full ml-[3px]">
        {/* Welcome message */}
        {Object.keys(selectedChatRoom).length === 0 && Object.keys(chatFeedData).length === 0 && (
          <div className="flex items-end justify-center h-screen">
            <h1 className="text-4xl font-bold mb-4">Welcome {capitalize(userData.user.userProfileInfo?.first_name)}, to LegalCorp AI</h1>
          </div>
        )}

        {chatFeedData?.map((message: any, index: number) => (
          <div key={`${message.id}-${index}`} className={`mb-4 flex flex-col ${message?.sender_type === "user" ? "items-end" : "items-start"}`}>
            {/* Attachments */}
            {message?.documents?.length > 0 &&
              (() => {
                const imageDocs = message.documents.filter((doc: any) => ["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(doc.mime_type));
                const otherDocs = message.documents.filter((doc: any) => !["image/jpeg", "image/png", "image/gif", "image/jpg"].includes(doc.mime_type));

                return (
                  <div className={`mb-2 w-full max-w-[75%] flex flex-col gap-2 ${message?.sender_type === "user" ? "items-end" : ""}`}>
                    {/* Image Grid */}
                    {imageDocs.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-auto max-w-[304px] items-center justify-end">
                        {imageDocs.map((doc: any, docIndex: number) => (
                          <a key={`${doc.id}-${docIndex}`} href={doc.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border bg-muted hover:opacity-80 transition-opacity h-24 w-24">
                            <img src={doc.url} alt={doc.name} className="h-full w-full object-cover rounded-md" />
                          </a>
                        ))}
                      </div>
                    )}
                    {/* Other Files List */}
                    {otherDocs.length > 0 && (
                      <div className={`flex flex-col gap-2 self-stretch ${message?.sender_type === "user" ? "items-end" : "items-start"}`}>
                        {otherDocs.map((doc: any, docIndex: any) => (
                          <a key={`${doc.id}-${docIndex}`} href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-muted p-2 rounded-lg border max-w-xs hover:border-primary/40 transition-colors">
                            {getFileIcon(doc?.file_name)}
                            <span className="text-sm text-foreground truncate">{doc?.file_name}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

            {/* Message Bubble */}
            <div className={`group relative inline-block max-w-full rounded-2xl px-5 pt-3 ${message?.sender_type === "bot" ? "pb-10" : "pb-3"} bg-muted`}>
              {/* <div className={`whitespace-pre-wrap text-base leading-relaxed`}>{message?.message}</div> */}
              <div className={`whitespace-pre-wrap text-base leading-relaxed`}>
                <ChatMessage content={message?.message} />
              </div>

              {/* Copy button - elegant bottom-right */}
              {message?.sender_type === "bot" && (
                <button onClick={() => handleCopy(message?.message, index)} className="absolute bottom-2 left-3 transition-all duration-200 p-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent" title="Copy message">
                  {copiedIndex === index ? <span className="text-xs px-1.5">Copied!</span> : <FiCopy className="w-4 h-4" />}
                </button>
              )}
            </div>

            {/* <span className="text-xs text-muted-foreground block mt-1">{new Date(message.create_at).toLocaleTimeString()}</span> */}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })} className="absolute bottom-16 right-4 z-50 p-2 bg-white border rounded-full shadow-md hover:bg-gray-100 transition">
          <IoArrowDownOutline className="w-5 h-5 text-black z-500" />
        </button>
      )}
    </div>
  );
}
