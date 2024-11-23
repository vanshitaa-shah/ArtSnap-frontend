import { readAllData } from "@/lib/indexDb";
import { Art } from "@/types";
import { useEffect, useState } from "react";
import { toast } from "./use-toast";

export default function useArt(artId: string) {
  const [currentArt, setCurrentArt] = useState<Art | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    async function fetchArt() {
      try {
        // First try to get from IndexedDB
        const dbArts = await readAllData("arts");

        const dbArt = dbArts.find((art) => art.id === artId);
        if (dbArt) {
          setCurrentArt(dbArt);
        }

        // Then fetch from network
        const url = `${import.meta.env.VITE_DATABASE_URL}/arts/${artId}.json`;
        const response = await fetch(url);

        if (response.ok) {
          const networkArt = await response.json();
          setCurrentArt(networkArt);
        }
      } catch (error) {
        toast({
          title: "Fetch to failed",
          variant: "destructive",
        });
        setIsError(true);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchArt();
  }, [artId]);

  return [isLoading, isError, currentArt] as [boolean, boolean, Art];
}
