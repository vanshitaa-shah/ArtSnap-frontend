import useArt from "@/hooks/useArt";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";

const Art = () => {
  const { artId } = useParams();
  const [isLoading, isError, art] = useArt(artId!);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (isError && !art) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-70px)]">
        <p className="text-xl">Artwork not found</p>
      </div>
    );
  }

  console.log(art);
  

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img
              className="h-96 w-full object-cover md:w-96"
              src={art.imageUrl}
              alt={art.artName}
            />
          </div>
          <div className="p-8">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {art.artName}
            </div>
            <p className="text-xl text-gray-600 mb-4">by {art.artistName}</p>
            <div className="mt-4">
              <p className="text-gray-700 leading-relaxed">
                {art.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Art;
