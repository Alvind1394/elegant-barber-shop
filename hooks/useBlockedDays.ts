'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  getBlockedDaysService,
} from '@/services/blocked-days.service';

export const useBlockedDays =
  () => {

    const [
      blockedDays,
      setBlockedDays,
    ] = useState<string[]>([]);

    const fetchBlockedDays =
      async () => {

        try {

          const data =
            await getBlockedDaysService();

          setBlockedDays(data);

        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
      fetchBlockedDays();
    }, []);

    return {
      blockedDays,
      refreshBlockedDays:
        fetchBlockedDays,
    };
  };