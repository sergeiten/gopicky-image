import ImageUploader from "@/ui/components/ImageUploader";

export default function Home() {
  return (
    <div className="flex flex-col h-screen justify-between">
      <main className="container mx-auto p-4">
        <ImageUploader />
      </main>
      <footer className="text-center pb-4 text-sm text-muted-foreground">
        <p>All uploaded images are deleted after 1 hour</p>
        <p>&copy; GoPicky Image</p>
      </footer>
    </div>
  );
}
