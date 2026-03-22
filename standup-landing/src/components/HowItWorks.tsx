const steps = [
  {
    number: "01",
    title: "Trigger",
    description: "Type /standup in your Slack channel. That's it — one command kicks everything off.",
    icon: "⚡",
  },
  {
    number: "02",
    title: "Respond",
    description: "Everyone gets a DM with 3 questions. Reply in your own words — no forms, no formatting.",
    icon: "💬",
  },
  {
    number: "03",
    title: "Summary",
    description: "AI distills each reply into a clean one-liner and posts it to the channel as it comes in.",
    icon: "✨",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-sm tracking-widest uppercase text-emerald-400 text-center mb-4">
          How it works
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-white text-center mb-16">
          Three steps. Zero meetings.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="border border-gray-800 rounded-xl p-8 bg-[#111111] hover:border-emerald-400/30 transition-colors"
            >
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-emerald-400 text-xs font-semibold tracking-widest mb-2">
                STEP {step.number}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
