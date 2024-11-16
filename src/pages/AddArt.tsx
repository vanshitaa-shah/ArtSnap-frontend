import ArtForm from "@/components/art-form/ArtForm";


const AddArt = () => {
  return (
    <div className="flex justify-center items-center h-[100%] ">
      <div className="h-[100%] max-w-[100%]">
        <div className="my-[2rem] w-[80%] min-w-[300px] sm:w-auto gap-3 shadow-lg p-5 rounded-lg border-t-4 border-border-color mx-auto">
          <h1 className="text-xl font-bold my-4">Add Art</h1>
          <ArtForm />
        </div>
      </div>
    </div>
  );
};

export default AddArt;
