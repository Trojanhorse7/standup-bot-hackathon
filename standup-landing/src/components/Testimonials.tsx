const testimonials = [
  {
    quote: "Our 20-minute standups are now 30-second Slack messages. I'm never going back.",
    name: "Alex Chen",
    role: "Frontend Lead",
  },
  {
    quote: "Finally, a standup bot that doesn't feel like filling out a form. Just reply and done.",
    name: "Sarah Kim",
    role: "Backend Engineer",
  },
  {
    quote: "The AI summaries are surprisingly good. Honestly better than my own updates.",
    name: "Mike Rodriguez",
    role: "DevOps Engineer",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-6 bg-[#0d0d0d]">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm tracking-widest uppercase text-emerald-400 text-center mb-4">
          What devs are saying
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-white text-center mb-16">
          Built by devs, for devs.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="border border-gray-800 rounded-xl p-8 bg-[#111111]"
            >
              <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">
                "{t.quote}"
              </p>
              <div>
                <div className="text-white font-semibold text-sm">{t.name}</div>
                <div className="text-gray-500 text-xs">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
