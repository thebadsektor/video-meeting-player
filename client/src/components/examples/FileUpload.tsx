import FileUpload from "../FileUpload";
import { Video } from "lucide-react";

export default function FileUploadExample() {
  return (
    <div className="p-6 space-y-4 max-w-md">
      <FileUpload
        label="Upload Video"
        accept="video/mp4"
        helperText="Drag and drop or click to browse (MP4)"
        onFileSelect={(file) => console.log("Video selected:", file.name)}
        icon={<Video className="w-full h-full" />}
      />
    </div>
  );
}
