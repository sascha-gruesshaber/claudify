# plain-words

Report in controlled English. Small words, short sentences, one idea each.

```
What I did      one or two sentences
Did it work     yes or no, and the evidence
What now        the exact next command
```

When a decision is needed: **two options maximum**, each with the context to choose fast, and which one
would be taken.

## Two ways to use it

**As a skill** — `/plain-words`, or it loads itself when you say "keep it short", "ELI5", "too much
text", "just tell me what to do". It also works inside sub-agents and other skills, which an output
style does not.

**As the session default** — install the output style that ships with it:

```bash
cp ~/.claude/plugins/cache/claudify/plain-words/*/output-styles/plain-words.md ~/.claude/output-styles/
```

Then pick it with `/output-style`.

## What it does not do

- **It never says less than is true.** A finding dropped to save a line is a finding hidden. It gets one
  short sentence instead.
- **It never touches paths, commands, flags, error messages or numbers.** Those stay exact.
- **It is not baby talk.** The reader is an expert who is tired, not a beginner.
- **It does not govern code, commits, specs or committed docs** — only what is said in the conversation.

## Where it comes from

The rules are the readable core of **ASD-STE100 Simplified Technical English**, a controlled language
written for aircraft maintenance manuals — where a sentence with two possible readings is a safety
incident. One meaning per sentence, and no room for a second.
