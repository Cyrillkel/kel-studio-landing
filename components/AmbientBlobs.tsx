type Blob = {
  side: "left" | "right";
  vertical: string;
  size: string;
  gradient: string;
  delay: string;
  morph?: boolean;
};

export default function AmbientBlobs({ blobs }: { blobs: Blob[] }) {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {blobs.map((blob, i) => (
        <div
          key={i}
          className={`${blob.morph ? "ambient-blob-morph" : "ambient-blob"} absolute ${blob.side === "left" ? "-left-16" : "-right-16"} ${blob.vertical} ${blob.size} ${blob.gradient} blur-2xl`}
          style={{ animationDelay: blob.delay }}
        />
      ))}
    </div>
  );
}
