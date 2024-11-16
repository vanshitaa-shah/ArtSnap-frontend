import { useEffect, useState } from "react";
import { readAllData, writeData } from "@/lib/indexDb";
import ArtCard from "@/components/art-card/ArtCard";
import { Art } from "@/types";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/loader/Loader";

export const Arts = () => {
  const [arts, setArts] = useState<Art[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    let networkDataReceived = false;

    async function getArts() {
      const baseUrl = import.meta.env.VITE_DATABASE_URL;
      try {
        const response = await fetch(`${baseUrl}/arts.json`);
        const arts = await response.json();

        networkDataReceived = true;
        const dataArray = [];
        for (const key in arts) {
          dataArray.push(arts[key]);
        }

        setArts(dataArray);
        writeData("arts", dataArray);
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }
    // Fetch arts from Firebase
    getArts();

    // If IndexedDB is available, fetch arts from it
    if ("indexedDB" in window) {
      readAllData("arts").then((data) => {
        if (!networkDataReceived) {
          setArts(data);
        }
      });
    }
  }, []);

  return (
    <div className="container mx-auto my-5 ">
      <div className="flex justify-center items-center">
        {isLoading ? (
         <Loader/>
        ): arts.length === 0 ? (
          <div className="flex flex-col items-center justify-center">
            <img 
              src="/no-posts.png" 
              alt="No posts available" 
              className="max-w-[300px] h-auto"
            />
            <p className="text-lg text-gray-600 mt-4">No arts available</p>
          </div>
        ) :  (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl">
            {arts.map((art) => (
              <ArtCard key={art.id} art={art} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Arts;
