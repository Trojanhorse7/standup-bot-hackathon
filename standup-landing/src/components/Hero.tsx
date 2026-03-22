export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="mb-6 text-sm tracking-widest uppercase text-emerald-400">
        async standups for dev teams
      </div>
      <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight max-w-3xl">
        Standups that don't
        <br />
        <span className="text-emerald-400">waste your morning.</span>
      </h1>
      <p className="mt-6 text-lg text-gray-400 max-w-xl leading-relaxed">
        A Slack bot that collects your team's updates via DM and posts
        AI-generated summaries to your channel. No meetings. No forms. Just one
        message.
      </p>
      <a
        href="#"
        className="mt-10 inline-flex items-center gap-3 bg-white text-black font-semibold px-8 py-4 rounded-lg hover:bg-gray-200 transition-colors text-sm"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zm1.271 0a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zm0 1.271a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zm-1.271 0a2.528 2.528 0 0 1-2.52 2.521 2.528 2.528 0 0 1-2.521-2.521V2.522A2.528 2.528 0 0 1 15.165 0a2.528 2.528 0 0 1 2.52 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.52 2.522A2.528 2.528 0 0 1 15.165 24a2.528 2.528 0 0 1-2.521-2.522v-2.522h2.521zm0-1.271a2.528 2.528 0 0 1-2.521-2.52 2.528 2.528 0 0 1 2.521-2.521h6.313A2.528 2.528 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.52h-6.313z"
            fill="currentColor"
          />
        </svg>
        Add to Slack
      </a>
      <div className="mt-4 text-xs text-gray-600">
        Free &middot; No credit card required
      </div>
    </section>
  );
}
