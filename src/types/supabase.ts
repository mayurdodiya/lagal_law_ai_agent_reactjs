export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      chat: {
        Row: {
          chat_title: string
          created_at: string
          id: string
          law_model_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          chat_title: string
          created_at?: string
          id?: string
          law_model_id?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          chat_title?: string
          created_at?: string
          id?: string
          law_model_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string | null
          id: string
          message_id: string | null
          mime_type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          mime_type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message_id?: string | null
          mime_type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
        ]
      }
      law_models: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          id: string
          model_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          model_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          model_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "law_models_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          chat_id: string
          created_at: string
          documents: string[] | null
          id: string
          message: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          chat_id?: string
          created_at?: string
          documents?: string[] | null
          id?: string
          message: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          documents?: string[] | null
          id?: string
          message?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_chat_id_fkey2"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
        ]
      }
      messagesOLD: {
        Row: {
          chat_id: string
          created_at: string
          documents: string[] | null
          id: string
          message: string
          sender_type: string
          updated_at: string
        }
        Insert: {
          chat_id?: string
          created_at?: string
          documents?: string[] | null
          id?: string
          message: string
          sender_type: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          documents?: string[] | null
          id?: string
          message?: string
          sender_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messagesp_chat_id_fkey"
            columns: ["chat_id"]
            isOneToOne: false
            referencedRelation: "chat"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string
          id: string
          isPlanPurchased: boolean
          last_name: string
          mobile: string | null
          phoneCountry: string | null
          planId: string | null
          role: Database["public"]["Enums"]["user_role"]
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id?: string
          isPlanPurchased?: boolean
          last_name: string
          mobile?: string | null
          phoneCountry?: string | null
          planId?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          isPlanPurchased?: boolean
          last_name?: string
          mobile?: string | null
          phoneCountry?: string | null
          planId?: string | null
          role?: Database["public"]["Enums"]["user_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      sender: "user" | "law_model"
      user_role: "user" | "admin" | "support_team"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      sender: ["user", "law_model"],
      user_role: ["user", "admin", "support_team"],
    },
  },
} as const
