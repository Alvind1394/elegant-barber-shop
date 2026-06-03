'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  getBlockedHoursService,
} from '@/services/blocked-hours.service';

export const useBlockedHours =
  () => {

    const [
      blockedHours,
      setBlockedHours,
    ] = useState<any[]>([]);

    const fetchBlockedHours =
      async () => {
        try {

          const data =
            await getBlockedHoursService();

          setBlockedHours(data);

        } catch (error) {
          console.error(error);
        }
      };

    useEffect(() => {
      fetchBlockedHours();
    }, []);

    return {
      blockedHours,
      refreshBlockedHours:
        fetchBlockedHours,
    };
  };