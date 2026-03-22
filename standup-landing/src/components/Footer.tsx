export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-gray-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-500">
          <span className="text-white font-semibold">StandupBot</span>{" "}
          &middot; Built for the hackathon
        </div>
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <a
            href="#"
            className="hover:text-emerald-400 transition-colors"
          >
            GitHub
          </a>
          <a
            href="#"
            className="hover:text-emerald-400 transition-colors"
          >
            Slack
          </a>
        </div>
      </div>
    </footer>
  );
}
