import { useEffect } from "react";
import { useQuranProgressStore } from "../../store/quranProgressStore";
import { useRamadanStore } from "../../store/ramadanStore";
import { getTodayDate } from "../../utils/ramadanCalculation";

export function useProgressSync() {
  const quranProgress = useQuranProgressStore();
  const ramadanProgress = useRamadanStore();
  
  useEffect(() => {
    // Sync on changes
    ramadanProgress.updateQuranProgress(
      getTodayDate(),
      quranProgress.totalAyahsRead
    );
  }, [quranProgress.totalAyahsRead]);
}