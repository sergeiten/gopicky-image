import { ImageActionError } from "@/lib/definitions";
import { Button } from "@/ui/shadcn/button";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface Props {
  sessionId: string;
  fileName: string;
  attachmentName: string;
  disabled?: boolean;
}

const DownloadButton = ({
  sessionId,
  fileName,
  attachmentName,
  disabled = false,
}: Props) => {
  const { toast } = useToast();

  const { mutate: download, isPending } = useMutation({
    mutationFn: async () => {
      return axios
        .post(
          `/api/${sessionId}/download`,
          {
            fileName,
            attachmentName,
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
        link.download = attachmentName;
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
