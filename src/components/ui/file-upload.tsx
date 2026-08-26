"use client";

import * as React from "react";
import {
  FileImageIcon,
  FileSpreadsheetIcon,
  FileUploadIcon,
  Upload01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { BorderBeam } from "border-beam";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FileThumbnail } from "@/components/ui/file-thumbnail";

type FileUploadItem = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

type AcceptedFileType = {
  label: string;
  icon: React.ComponentProps<typeof HugeiconsIcon>["icon"];
};

type FileUploadProps = {
  accept?: string;
  acceptedFileTypes?: AcceptedFileType[];
  borderBeamTheme?: React.ComponentProps<typeof BorderBeam>["theme"];
  browseLabel?: string;
  className?: string;
  description?: string;
  draggingLabel?: string;
  multiple?: boolean;
  showBorderBeam?: boolean;
  showFileList?: boolean;
  title?: string;
  onFilesAccepted?: (files: File[]) => void;
  onFilesChange?: (files: FileUploadItem[]) => void;
};

const ACCEPTED_FILE_TYPES: AcceptedFileType[] = [
  { label: "Image", icon: FileImageIcon },
  { label: "PDF", icon: FileUploadIcon },
  { label: "Sheet", icon: FileSpreadsheetIcon },
];
const DEFAULT_ACCEPT = [
  ".pdf",
  ".doc",
  ".docx",
  ".xlsx",
  ".csv",
  ".png",
  ".jpg",
  ".jpeg",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
  ".fastq",
  ".fq",
  ".fasta",
  ".fa",
  ".fastq.gz",
  ".fq.gz"
].join(",");
const ICON_TRANSFORMS = [
  {
    idle: "translate(-78%, -50%) rotate(-8deg)",
    active: "translate(-114%, -50%) rotate(-12deg) scale(1.08)",
  },
  {
    idle: "translate(-50%, -50%) rotate(0deg)",
    active: "translate(-50%, -50%) rotate(0deg) scale(1.18)",
  },
  {
    idle: "translate(-22%, -50%) rotate(8deg)",
    active: "translate(14%, -50%) rotate(12deg) scale(1.08)",
  },
];

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  return `${(bytes / 1024 ** index).toFixed(index === 0 ? 0 : 1)} ${
    units[index]
  }`;
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true;

  return accept.split(",").some((rawToken) => {
    const token = rawToken.trim().toLowerCase();

    if (!token) return false;
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token);
    if (token.endsWith("/*")) {
      return file.type.toLowerCase().startsWith(token.slice(0, -1));
    }

    return file.type.toLowerCase() === token;
  });
}

function toUploadItems(files: FileList | File[]): FileUploadItem[] {
  return Array.from(files).map((file) => ({
    id: `${file.name}-${file.size}-${file.lastModified}`,
    name: file.name,
    type: file.type || "Unknown type",
    size: file.size,
    url: URL.createObjectURL(file),
  }));
}

function UploadIconCluster({
  acceptedFileTypes,
  isDragging,
}: {
  acceptedFileTypes: AcceptedFileType[];
  isDragging: boolean;
}) {
  const singleIcon = acceptedFileTypes.length === 1;

  return (
    <div className="relative h-14 w-36">
      {acceptedFileTypes.map((item, index) => (
        <Card
          key={item.label}
          className={cn(
            "absolute top-1/2 left-1/2 grid size-12 place-items-center rounded-2xl bg-slate-800/50 text-white border border-white/10 backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-lg",
            "motion-reduce:transition-none",
            index === 1 && "z-10",
            isDragging &&
              "bg-cyan-400/30 text-white border-cyan-300 shadow-[0_0_20px_rgba(77,238,233,0.6)] scale-110",
          )}
          style={{
            transform: singleIcon
              ? `translate(-50%, -50%) scale(${isDragging ? 1.14 : 1})`
              : isDragging
                ? ICON_TRANSFORMS[index]?.active
                : ICON_TRANSFORMS[index]?.idle,
          }}
        >
          <HugeiconsIcon icon={item.icon} className="size-5 text-white" />
        </Card>
      ))}
    </div>
  );
}

export function FileUpload({
  accept = DEFAULT_ACCEPT,
  acceptedFileTypes = ACCEPTED_FILE_TYPES,
  borderBeamTheme = "light",
  browseLabel = "Browse files",
  className,
  description = "Drag & drop FASTQ, FASTA, .gz, CSV, or sequence archives",
  draggingLabel = "Drop to analyze sample",
  multiple = true,
  showBorderBeam = true,
  showFileList = true,
  title = "Drop Sequence Data Here",
  onFilesAccepted,
  onFilesChange,
}: FileUploadProps) {
  const dragDepthRef = React.useRef(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [files, setFiles] = React.useState<FileUploadItem[]>([]);
  const [rejectionMessage, setRejectionMessage] = React.useState<string | null>(
    null,
  );

  const commitFiles = React.useCallback(
    (nextFiles: FileList | File[]) => {
      const allFiles = Array.from(nextFiles);
      const acceptedFiles = allFiles
        .filter((file) => matchesAccept(file, accept))
        .slice(0, multiple ? undefined : 1);

      // If user dropped files that might not match exact mime/ext, accept them anyway for seamless UX
      const filesToUse = acceptedFiles.length > 0 ? acceptedFiles : allFiles.slice(0, multiple ? undefined : 1);

      setRejectionMessage(null);
      onFilesAccepted?.(filesToUse);

      const items = toUploadItems(filesToUse);
      setFiles((previousFiles) => {
        previousFiles.forEach((file) => URL.revokeObjectURL(file.url));
        return items;
      });
      onFilesChange?.(items);
    },
    [accept, multiple, onFilesAccepted, onFilesChange],
  );

  React.useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.url));
    };
  }, [files]);

  const openFileDialog = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const dropzone = (
    <div
      role="button"
      tabIndex={0}
      className={cn(
        "relative flex min-h-64 cursor-pointer flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 ease-out",
        "motion-reduce:transition-none",
        isDragging
          ? "border-cyan-300 bg-cyan-400/25 shadow-[0_0_30px_rgba(77,238,233,0.45)] scale-[1.02]"
          : "border-white/30 bg-white/[0.07] hover:border-cyan-300/70 hover:bg-white/[0.13] backdrop-blur-xl shadow-xl",
      )}
      onClick={openFileDialog}
      onDragEnter={(event) => {
        event.preventDefault();
        dragDepthRef.current += 1;
        setIsDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
        if (dragDepthRef.current === 0) setIsDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        dragDepthRef.current = 0;
        setIsDragging(false);
        if (event.dataTransfer.files.length > 0) {
          commitFiles(event.dataTransfer.files);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openFileDialog();
        }
      }}
    >
      <UploadIconCluster
        acceptedFileTypes={acceptedFileTypes}
        isDragging={isDragging}
      />
      <div className="space-y-1.5">
        <div className="text-base font-semibold text-white tracking-wide drop-shadow-sm">{title}</div>
        <div className="text-xs text-white/80 font-medium">{description}</div>
        {rejectionMessage ? (
          <div className="text-xs text-red-300 font-semibold">{rejectionMessage}</div>
        ) : null}
      </div>
      <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 py-1.5 text-xs text-white font-medium shadow-md backdrop-blur-md">
        <HugeiconsIcon icon={Upload01Icon} className="size-4 text-cyan-200" />
        <span>{isDragging ? draggingLabel : browseLabel}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(event) => {
          if (event.target.files) {
            commitFiles(event.target.files);
            event.currentTarget.value = "";
          }
        }}
      />
    </div>
  );

  return (
    <div className={cn("space-y-3", className)}>
      {showBorderBeam ? (
        <BorderBeam
          active={isDragging}
          borderRadius={18}
          brightness={2.4}
          className="rounded-[1.125rem]"
          colorVariant="ocean"
          duration={2.4}
          size="md"
          strength={1}
          theme={borderBeamTheme}
        >
          {dropzone}
        </BorderBeam>
      ) : (
        dropzone
      )}
      {showFileList && files.length > 0 ? (
        <div className="rounded-xl border bg-background">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 border-b px-3 py-2.5 last:border-b-0"
            >
              <FileThumbnail
                file={{
                  name: file.name,
                  type: file.type,
                }}
                previewImageUrl={
                  file.type.startsWith("image/") ? file.url : null
                }
                className="size-10 shrink-0 rounded-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{file.name}</div>
                <div className="truncate text-xs text-muted-foreground">
                  {file.type} - {formatBytes(file.size)}
                </div>
              </div>
              <div className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                Ready
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default FileUpload;
