export default function AmbientBlobs() {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="ambient-blob absolute -left-32 top-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent blur-3xl"
        style={{ animationDelay: "-4s" }}
      />
      <div
        className="ambient-blob absolute -right-32 bottom-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-cyan-400/20 via-purple-500/10 to-transparent blur-3xl"
        style={{ animationDelay: "-11s" }}
      />
    </div>
  );
}
