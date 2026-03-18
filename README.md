# devpost-curriculum

A hackathon curriculum that guides you from idea spark to working app in 3–4 hours, delivered as seven agent commands.

**Commands:** `/scope` → `/prd` → `/spec` → `/checklist` → `/build` → `/iterate` → `/evaluate`

Works with **Claude Code**, **OpenAI Codex**, and **Cursor**.

---

## Install

### Claude Code

```
/plugin marketplace add challengepost/devpost-curriculum
/plugin install hackathon-in-a-plugin@devpost-curriculum
```

Then run `/scope` to start.

Requires [Claude Code](https://claude.ai/code) v1.0.33+.

### OpenAI Codex

Codex uses the same `SKILL.md` format natively. Clone and symlink the skills into your project:

```bash
git clone https://github.com/challengepost/devpost-curriculum.git ~/.devpost-curriculum

# Copy skills into your project
cp -r ~/.devpost-curriculum/plugins/hackathon-in-a-plugin/skills .agents/skills/hackathon
```

Or copy the whole plugin into your home skills directory for global access:

```bash
mkdir -p ~/.agents/skills
cp -r ~/.devpost-curriculum/plugins/hackathon-in-a-plugin/skills/* ~/.agents/skills/
```

The `AGENTS.md` at the plugin root also works as a drop-in — copy it to your project root:

```bash
cp ~/.devpost-curriculum/plugins/hackathon-in-a-plugin/AGENTS.md ./AGENTS.md
```

Then run `/scope` to start.

### Cursor

Cursor uses `.cursor/rules/*.mdc` files. This repo includes a pre-built adapter:

```bash
git clone https://github.com/challengepost/devpost-curriculum.git ~/.devpost-curriculum

# Copy the Cursor rules into your project
mkdir -p .cursor/rules
cp ~/.devpost-curriculum/cursor-rules/*.mdc .cursor/rules/
```

Then tell the agent: "Let's run /scope" to start the hackathon curriculum.

---

## What's Inside

### hackathon-in-a-plugin

A complete hackathon curriculum built as a set of agent skills. Each command produces artifacts that downstream commands consume — scope doc, PRD, technical spec, build checklist, and final evaluation.

The curriculum teaches spec-driven development: the planning documents aren't busywork, they're the submission itself. The agent acts as a hackathon coach — brisk, sharp, encouraging — interviewing you through each phase.

**Skills:**

| Command | What it does |
|---|---|
| `/scope` | Brainstorm and refine your idea into a focused project scope |
| `/prd` | Turn scope into detailed product requirements |
| `/spec` | Translate PRD into a technical blueprint |
| `/checklist` | Break the spec into a concrete build checklist |
| `/build` | Work through checklist items one at a time |
| `/iterate` | Optional polish pass after the build is done |
| `/evaluate` | Final evaluation with feedback and reflection |

---

## License

MIT
