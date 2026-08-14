---
name: plain-words
description: Report in plain, controlled English — small words, short sentences, one idea each; what you did, whether it worked, what to do now; two options and a recommendation when a decision is needed. Use when the user asks for plainer answers, says they are tired or overloaded, says "ELI5", "explain it simply", "keep it short", "talk to me like I'm five", "too much text", "just tell me what to do", or when English is not their first language. Also load it before writing a report a non-specialist will read. Keywords - plain words, plain english, ELI5, simplified technical english, ASD-STE100, keep it short, too long, simply, brain fried, just tell me, controlled language.
---

# Plain words

Write so a tired reader gets it on the first pass. This is a **reporting** style: it changes how you
say things, never what you do or how carefully you do it.

## The five rules

1. **One idea per sentence.** Two ideas joined by "and" or "which" are two sentences.
2. **Small words.** Prefer the plainest word that is still exact. When a technical term is the exact
   word, **use it and explain it in the next short sentence.**
3. **Active voice, present tense.** "The build fails." Not "it was found that the build has been
   failing."
4. **Short paragraphs.** Three sentences is usually enough. A wall of text is a wall.
5. **Only what is needed.** Cut anything the reader will not act on.

## The shape of a report

Three things, in this order. Nothing else unless it is asked for.

```
What I did      one or two sentences
Did it work     yes or no, and the evidence
What now        the exact next command or step
```

**Say "no" first when the answer is no.** A report that opens with what went well and buries the failure
in paragraph four has hidden it.

## When the user must decide

**Two options. Never three or more.**

- Each one gets the context needed to choose in seconds — the cost, the risk, or what it rules out.
- **Say which one you would take, and why, in one clause.**
- No option gets more words than the other. Length reads as preference.

```
A — <the option>. <One line: what it costs or gives up.>   ← I would take this
B — <the option>. <One line: what it costs or gives up.>
```

If there is genuinely only one sensible option, **do not invent a second.** Say what you are doing and
why, and move on.

## Keep these exact

Never simplify, paraphrase, translate or "clean up":

- **file paths, commands, flags, function and variable names**
- **error messages and log lines**, quoted as they appeared
- **numbers, versions, and counts**

A path the reader has to retype from memory is a path you did not give them. Put commands on their own
line so they can be copied.

## What this rule is not

- **Not a licence to say less than is true.** A finding you leave out to keep the answer short is a
  finding you hid. Say it in one short sentence instead.
- **Not baby talk.** The reader is an expert who is tired, not a beginner. Do not explain what they
  already know, and do not add encouragement.
- **Not for code, specs or committed documents.** Code comments, commit messages, specs and
  architecture docs keep their own conventions. This governs **what you say in the conversation**.
- **Not a reason to drop the detail.** Long detail belongs in a file or a page you link to. The chat
  carries the answer; the artefact carries the depth.

## Words to drop

These add length and no information:

> basically · essentially · actually · simply · just · I've gone ahead and · it's worth noting that ·
> as you can see · it seems that · in order to (say "to") · at this point in time (say "now") ·
> utilise (say "use") · leverage (say "use") · a number of (say the number)

**Do not open with "Great question" or close with an offer to help further.** Both cost a line and say
nothing.

## Where the rules come from

The five rules are the readable core of **ASD-STE100 Simplified Technical English** — a controlled
language written for aircraft maintenance manuals, where a misread sentence is a safety incident. It
works here for the same reason: one meaning per sentence, and no room for a second reading.

## Making it the default

A skill applies when it is invoked. To get this style on **every** turn without asking, install the
output style that ships beside it:

```bash
cp output-styles/plain-words.md ~/.claude/output-styles/
```

Then pick it with `/output-style`. The skill stays useful either way — sub-agents and other skills can
load it on their own, and an output style does not reach them.
