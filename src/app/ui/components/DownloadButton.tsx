import { ImageActionError } from "@/lib/definitions";
import { Button } from "@/ui/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import useSessionId from "@/hooks/use-session-id";

interface Props {
  fileName: string;
  fileUrl: string;
  disabled?: boolean;
}

const DownloadButton = ({ fileName, fileUrl, disabled = false }: Props) => {
  const { toast } = useToast();
  const sessionId = useSessionId();

  const { mutate: download, isPending } = useMutation({
    mutationFn: async () => {
      return axios
        .post(
          `/api/${sessionId}/download`,
          {
            fileName,
            fileUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
            responseType: "blob",
          },
        )
        .then((response) => response.data);
    },
    onSuccess: (data) => {
      try {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(data);
        link.download = fileName;
        link.click();
        link.remove();
      } catch (e) {
        console.log(e);
        throw e;
      }
    },
    onError: (error: AxiosError) => {
      const data = error.response?.data as ImageActionError;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Failed to download compressed file",
          description: "There was a problem with your request.",
        });
        return;
      }

      toast({
        variant: "destructive",
        title: data.message,
      });
    },
  });

  return (
    <Button
      disabled={disabled || isPending}
      onClick={() => {
        download();
      }}
    >
      Download Compressed Image
    </Button>
  );
};

export default DownloadButton;
