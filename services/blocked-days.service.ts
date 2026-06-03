import { supabase } from '@/lib/supabase';

export const getBlockedDaysService =
  async (): Promise<string[]> => {
    const { data, error } =
      await supabase
        .from('blocked_days')
        .select('*');

    if (error) {
      throw error;
    }

    return (
      data.map((item) => item.date) ||
      []
    );
  };