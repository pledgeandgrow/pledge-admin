type DatabaseType = {
  public: {
    Tables: {
      events: {
        Row: {
          event_id: number;
          title: string;
          description?: string | null;
          event_type?: string | null;
          location?: string | null;
          start_datetime: string | Date;
          end_datetime?: string | Date | null;
          is_all_day: boolean;
          priority: number; // -1=low, 0=normal, 1=high
          status: string;
          created_at?: string | Date | null;
          updated_at?: string | Date | null;
        };
        Insert: {
          event_id?: number;
          title: string;
          description?: string | null;
          event_type?: string | null;
          location?: string | null;
          start_datetime: string | Date;
          end_datetime?: string | Date | null;
          is_all_day?: boolean;
          priority?: number;
          status?: string;
          created_at?: string | Date | null;
          updated_at?: string | Date | null;
        };
        Update: {
          event_id?: number;
          title?: string;
          description?: string | null;
          event_type?: string | null;
          location?: string | null;
          start_datetime?: string | Date;
          end_datetime?: string | Date | null;
          is_all_day?: boolean;
          priority?: number;
          status?: string;
          created_at?: string | Date | null;
          updated_at?: string | Date | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email_verified: boolean;
          stripe_customer_id?: string | null;
        };
        Insert: {
          id: string;
          email: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email_verified?: boolean;
          stripe_customer_id?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
          email_verified?: boolean;
          stripe_customer_id?: string | null;
        };
      };
      // Add other tables as needed
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
};

// Export the Database type
export type Database = DatabaseType;
