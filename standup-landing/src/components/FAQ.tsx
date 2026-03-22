import { useState } from "react";

const faqs = [
  {
    question: "How does the AI summary work?",
    answer:
      "When you reply to the bot's DM, your free-text response is sent to an AI model that distills it into a concise one-liner covering what you did yesterday, what you're doing today, and any blockers. The summary is posted to your standup channel instantly.",
  },
  {
    question: "What if someone doesn't respond?",
    answer:
      "After a configurable timeout, the bot posts \"No response\" next to that person's name in the channel summary. Non-responses never block the rest of the standup from completing.",
  },
  {
    question: "Can I customize the standup questions?",
    answer:
      "Not yet — the bot uses the classic three questions (yesterday, today, blockers). Custom questions are on the roadmap for a future release.",
  },
  {
    question: "Is my data stored anywhere?",
    answer:
      "Standup responses are held in memory only for the duration of the session. Once the summary is posted, the data is gone. No database, no logs, no retention.",
  },
  {
    question: "How do I set it up?",
    answer:
      "Add the bot to your Slack workspace, invite it to your standup channel, and type /standup. That's the entire setup — no dashboards, no configuration files.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-sm tracking-widest uppercase text-emerald-400 text-center mb-4">
          FAQ
        </h2>
        <p className="text-2xl md:text-3xl font-bold text-white text-center mb-16">
          Got questions?
        </p>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-800 rounded-lg bg-[#111111] overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#1a1a1a] transition-colors"
              >
                <span className="text-sm text-white font-medium">
                  {faq.question}
                </span>
                <span className="text-emerald-400 text-lg shrink-0">
                  {openIndex === i ? "−" : "+"}
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
