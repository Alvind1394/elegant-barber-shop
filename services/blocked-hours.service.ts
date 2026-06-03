import { supabase } from '@/lib/supabase';

export const getBlockedHoursService =
  async () => {
    const { data, error } =
      await supabase
        .from('blocked_hours')
        .select('*');

    if (error) {
      throw error;
    }

    return data || [];
  };