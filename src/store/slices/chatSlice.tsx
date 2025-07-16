import { Database } from "@/types/supabase";
import { createSlice } from "@reduxjs/toolkit";
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Chat = Database["public"]["Tables"]["chat"]["Row"];

type InitialState = {
  selectedChatRoom: {};
  chatFeedData: Message[];
  chatHistoryData: Chat[];
  lodding: boolean;
  error: string | null;
};

const initialState: InitialState = {
  selectedChatRoom: {},
  chatFeedData: [],
  chatHistoryData: [],
  lodding: false,
  error: null,
};

const slice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // selected chat room
    addSelectedChatRoom(state, action) {
      state.selectedChatRoom = action.payload;
    },
    removeSelectedChatRoom(state, action) {
      state.selectedChatRoom = action.payload;
    },

    // chat history
    fetchChatHistoryData(state, action) {
      state.chatHistoryData = action.payload;
    },
    addMsgInChatHistory(state, action) {
      state.chatHistoryData.push(action.payload);
    },
    chatHistoryLoading(state, action) {
      state.lodding = action.payload;
    },
    chatHistoryError(state, action) {
      state.error = action.payload;
    },

    // chat feed
    fetchChatFeedData(state, action) {
      state.chatFeedData = action.payload;
    },
    addMsgInChatFeed(state, action) {
      state.chatFeedData.push(action.payload);
    },
    removeChatFeedData(state, action) {
      state.chatFeedData = action.payload;
    },
    chatFeedLoading(state, action) {
      state.lodding = action.payload;
    },
    chatFeedError(state, action) {
      state.error = action.payload;
    },
  },
});

export const { fetchChatHistoryData, addMsgInChatHistory, fetchChatFeedData, addMsgInChatFeed, addSelectedChatRoom, removeSelectedChatRoom, removeChatFeedData } = slice.actions;
export default slice.reducer;
