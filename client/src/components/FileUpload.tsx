import { Upload } from "lucide-react";
import { useCallback } from "react";

interface FileUploadProps {
  label: string;
  accept: string;
  helperText: string;
  onFileSelect: (file: File) => void;
  icon?: React.ReactNode;
}

export default function FileUpload({
  label,
  accept,
  helperText,
  onFileSelect,
  icon,
}: FileUploadProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileSelect(file);
      }
    },
    [onFileSelect]
  );

  return (
    <div
      className="border-2 border-dashed rounded-xl min-h-[200px] flex flex-col items-center justify-center p-8 hover-elevate transition-all duration-200 cursor-pointer"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => document.getElementById(`file-input-${label}`)?.click()}
      data-testid={`upload-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="w-12 h-12 mb-4 text-muted-foreground">
        {icon || <Upload className="w-full h-full" />}
      </div>
      <p className="text-base font-medium mb-2">{label}</p>
      <p className="text-sm text-muted-foreground">{helperText}</p>
      <input
        id={`file-input-${label}`}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileInput}
        data-testid={`input-file-${label.toLowerCase().replace(/\s+/g, '-')}`}
      />
    </div>
  );
}
