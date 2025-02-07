import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <div
      className="absolute z-10 top-0 right-0 bottom-0 left-0 flex justify-center items-center rounded-xl"
      style={{
        backgroundColor: "rgba(0,0,0,0.3)",
      }}
    >
      <Loader2 className="w-12 h-12 animate-spin text-gray-500" />
    </div>
  );
};

export default Loader;
