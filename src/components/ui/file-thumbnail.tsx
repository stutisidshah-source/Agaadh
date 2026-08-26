
import { cn } from "@/lib/utils"

export const FileThumbnail = ({ file, previewImageUrl, className }: any) => {
  return (
    <div className={cn("flex items-center justify-center bg-muted text-muted-foreground", className)}>
      {previewImageUrl ? (
        <img src={previewImageUrl} alt={file.name} className="w-full h-full object-cover rounded-lg" />
      ) : (
        <span className="text-xs font-semibold">{file.type?.split('/')[1]?.toUpperCase() || 'FILE'}</span>
      )}
    </div>
  )
}
