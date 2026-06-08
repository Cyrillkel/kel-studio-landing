import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 bg-[#141414] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-2xl font-bold text-white">KEL Studio</div>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition"
            >
              Telegram
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition"
            >
              Instagram
            </Link>
            <Link
              href="#"
              className="text-gray-400 hover:text-white transition"
            >
              Behance
            </Link>
          </div>
          <div className="text-gray-400">
            © 2026 KEL Studio. Все права защищены.
          </div>
        </div>
      </div>
    </footer>
  );
}
