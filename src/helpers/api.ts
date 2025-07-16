import { API_KEYS } from '@/assets/constants'
import { supabase } from '@/integrations/supabase/client'
import type { BareResponseType, FetchAllChatMessagesType, FetchAllChatsResponseType, FetchAllFilesResponseType, FetchPageNumbersFromFileSearchResponseType, MessageResponseType, UploadFilesResponseType } from '@/types/api'
import type { ChatHistoryItem, ChatMessageItem, ChatMessageType } from '@/types/states'
import { UUID } from 'crypto'
import { Message } from 'react-hook-form'

// chats
export const getAllChats = async (): Promise<Omit<ChatHistoryItem, 'pastMessages'>[]> => {
  const response: FetchAllChatsResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.CHATS, { headers: { 'ngrok-skip-browser-warning': 'true', } })).json()
  const data: Omit<ChatHistoryItem, 'pastMessages'>[] = response.data.map((chat: FetchAllChatsResponseType['data'][0]) => {
    return {
      id: chat.chat_id,
      starred: chat.is_starred,
      title: chat.title
    }
  })
  return data
}

export const updateChatHistoryItem = async (chatItem: Omit<ChatHistoryItem, 'pastMessages'>): Promise<Omit<ChatHistoryItem, 'pastMessages'>> => {
  const requestBody = { title: chatItem.title, is_starred: chatItem.starred }
  const response: FetchAllChatMessagesType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.CHATS + `/${chatItem.id}`, { method: 'PUT', body: JSON.stringify(requestBody), headers: { 'Content-Type': 'application/json' } })).json()
  const { data } = response
  const chatData: Omit<ChatHistoryItem, 'pastMessages'> = {
    id: data.chat_id,
    starred: data.is_starred,
    title: data.title
  }
  return chatData
}

export const deleteChatHistoryItem = async (chatId: ChatHistoryItem['id']): Promise<boolean> => {
  const response: BareResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.CHATS + `/${chatId}`, { method: 'DELETE' })).json()
  return response.status
}

// messages
export const getAllChatMessagesById = async (chatId: ChatHistoryItem['id']): Promise<ChatHistoryItem> => {
  const response: FetchAllChatMessagesType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.CHATS + `/${chatId}`, { headers: { 'ngrok-skip-browser-warning': 'true', } })).json()
  const { data } = response
  const chatData: ChatHistoryItem = {
    id: data.chat_id,
    starred: data.is_starred,
    title: data.title,
    pastMessages: data.messages?.map((message: MessageResponseType) => {
      return {
        isAI: message.is_AI,
        message: message.content,
        id: message.message_id,
        isGoodResponse: message.is_good_response
      }
    })
  }
  return chatData
}

type UpdateMessageFeedbackType = { chatId: ChatHistoryItem['id'], messageId: ChatMessageType['id'], isGoodResponse: ChatMessageItem['isGoodResponse'] }

export const updateMessageFeedback = async ({ chatId, messageId, isGoodResponse }: UpdateMessageFeedbackType) => {
  const requestBody = { is_good_response: isGoodResponse }
  const response = await (await fetch(API_KEYS.BASE_URL + API_KEYS.CHATS + `/${chatId}/${messageId}`, { method: 'PUT', body: JSON.stringify(requestBody), headers: { 'ngrok-skip-browser-warning': 'true', 'Content-Type': 'application/json' } })).json()
  return response.data
}

// files
export const getAllUploadedFiles = async (): Promise<Array<string>> => {
  const response: FetchAllFilesResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.GET_ALL_UPLOADED_FILES, { headers: { 'ngrok-skip-browser-warning': 'true', } })).json()
  return response.data
}

export const getPageNumbersFromSearch = async (fileName: string, search: string): Promise<Array<number>> => {
  const response: FetchPageNumbersFromFileSearchResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.FILES + `/${fileName}?keyword=${search}`, { headers: { 'ngrok-skip-browser-warning': 'true', } })).json()
  return response.data
}

export const deleteUploadedFile = async (fileName: string): Promise<boolean> => {
  const response: BareResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.FILES + `?file_name=${fileName}`, { headers: { 'ngrok-skip-browser-warning': 'true', }, method: 'DELETE' })).json()
  return response.status
}

export const uploadFiles = async (formData: FormData): Promise<Array<string>> => {
  const response: UploadFilesResponseType = await (await fetch(API_KEYS.BASE_URL + API_KEYS.UPLOAD_FILES, { method: 'POST', body: formData })).json()
  return response.data
}




// for this project
export const fetchChatFeedHistory = async (chatId:UUID) => {
    const { data, error } = await supabase.from("messages").select(`id, chat_id, sender_type, message, created_at, documents (id, url, mime_type, message_id, file_name, created_at)`).eq("chat_id", chatId).order("created_at", { ascending: true });
    if (error) return error;
    return data;
};

export const fetchChatHistory = async () => {
  const { data, error } = await supabase.from("chat").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
};

export const fetchChatHistoryWithSearch = async (searchQuery: string) => {
    const { data, error } = await supabase.from("chat").select("*").order("created_at", { ascending: false }).ilike("chat_title", `%${searchQuery}%`);
    if (error) throw new Error(error.message);
    return data;
};