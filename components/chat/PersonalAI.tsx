"use client";

import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { Fragment, useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import { BrandMark } from "@/components/layout/BrandMark";
import { AI_CHAT } from "@/config/motion";
import { site } from "@/content/site";
import { useMounted } from "@/hooks/useMounted";

type Message = {
  id: number;
  role: "user" | "assistant";
  text: string;
  /** Sent upstream as history: off for the greeting, the AI's notes, and turns that failed. */
  keep: boolean;
  /** "streaming" while the reply arrives; "note" for the AI's own status lines (errors, declines). */
  state?: "streaming" | "note";
};

/** One NDJSON line from ai/server.py. */
type ChatEvent =
  | { type: "text"; text: string }
  | { type: "done"; stop: string }
  | { type: "refusal" }
  | { type: "error"; code: string };

const GREETING = "Hi — I'm Vamshi's AI. Ask me who Vamshi is, what Vamshi has built, or where to find Vamshi online.";

const SUGGESTIONS = [
  "Who is Vamshi?",
  "What has Vamshi built?",
  "GitHub and LinkedIn links?",
  "Is Vamshi open to roles?",
];

const NOTES: Record<string, string> = {
  unconfigured: `My AI isn't switched on yet — email Vamshi at ${site.email} in the meantime.`,
  busy: `I've used up my free answers for now. Try again later, or email Vamshi at ${site.email}.`,
  slow: `That's a lot of questions in a row — take a breather, or email ${site.email}.`,
  long: "That one's a bit long for me — try a shorter question.",
  refusal: "That's not something I can help with. Ask me about Vamshi's work instead.",
  offline: `I can't reach my brain right now. Try again, or email ${site.email}.`,
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const; /* --ease-out */
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const; /* --ease-in-out */

/**
 * The personal AI, in the hero's bottom-right corner: a launcher (the brand
 * mark, its seam of light breathing) and a chat panel that opens like the
 * intro's doors — the seam rises, splits, and its halves carry the panel's
 * edges outward (AI_CHAT). Replies stream from ai/server.py through the
 * /api/chat proxy (next.config.ts); each AI reply hangs off its own seam,
 * lit while the reply is coming through.
 */
export function PersonalAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ id: 0, role: "assistant", text: GREETING, keep: false }]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const nextId = useRef(1);
  const abort = useRef<AbortController | null>(null);
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const mounted = useMounted();
  const reduced = (useReducedMotion() ?? false) && mounted;

  // A reply still streaming when the page goes away is dropped.
  useEffect(() => () => abort.current?.abort(), []);

  // Opening puts the caret in the box; the pane is already in view, so no scroll.
  useEffect(() => {
    if (open) input.current?.focus({ preventScroll: true });
  }, [open]);

  // Follow the reply down, unless the reader has scrolled up to read.
  useEffect(() => {
    const el = log.current;
    if (el && el.scrollHeight - el.scrollTop - el.clientHeight < 120) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // The box grows with the draft, up to its max-height.
  useEffect(() => {
    const el = input.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`; // scrollHeight leaves out the border
  }, [draft, open]);

  const close = () => {
    setOpen(false);
    launcher.current?.focus({ preventScroll: true });
  };

  const patch = (id: number, fn: (m: Message) => Message) => setMessages((ms) => ms.map((m) => (m.id === id ? fn(m) : m)));

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    const userId = nextId.current++;
    const aiId = nextId.current++;
    const history = [...messages.filter((m) => m.keep), { role: "user" as const, text }].map((m) => ({ role: m.role, content: m.text }));
    setMessages((ms) => [...ms, { id: userId, role: "user", text, keep: true }, { id: aiId, role: "assistant", text: "", keep: false, state: "streaming" }]);
    setDraft("");
    setBusy(true);
    // A failed turn leaves the history, question and all, and says why in the AI's voice.
    const fail = (code: string) => {
      patch(userId, (m) => ({ ...m, keep: false }));
      patch(aiId, (m) => ({ ...m, text: NOTES[code] ?? NOTES.offline, keep: false, state: "note" }));
    };

    const ctrl = new AbortController();
    abort.current = ctrl;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) return fail(res.status === 429 ? "slow" : res.status === 422 ? "long" : "offline");
      let got = "";
      for await (const ev of events(res.body)) {
        if (ev.type === "text") {
          got += ev.text;
          patch(aiId, (m) => ({ ...m, text: m.text + ev.text }));
        } else if (ev.type === "done") {
          return got ? patch(aiId, (m) => ({ ...m, keep: true, state: undefined })) : fail("busy");
        } else {
          return fail(ev.type === "refusal" ? "refusal" : ev.code);
        }
      }
      fail("offline"); // the stream ended without a verdict
    } catch {
      if (!ctrl.signal.aborted) fail("offline");
    } finally {
      setBusy(false);
    }
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    send(draft);
  };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(draft);
    }
  };

  const asked = messages.some((m) => m.role === "user");
  const v = variants(reduced);

  return (
    <div className="ai">
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            className="ai-door"
            initial="hidden"
            animate="open"
            exit="closed"
            variants={v.door}
            onKeyDown={(e) => e.key === "Escape" && close()}
          >
            <motion.div
              id={panelId}
              role="dialog"
              aria-labelledby={`${panelId}-title`}
              className="ai-panel"
              variants={v.panel}
              data-lenis-prevent
            >
              <header className="ai-head">
                <BrandMark id="bm-ai-head" className="brand-mark ai-head-mark" />
                <div className="min-w-0 flex-1">
                  <p id={`${panelId}-title`} className="ai-title">Vamshi&apos;s AI</p>
                  <p className="ai-meta">Answers from this site · can be wrong</p>
                </div>
                <button type="button" className="ai-icon-btn ring-btn" onClick={close} aria-label="Close chat">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                    <path d="M2 2l10 10M12 2 2 12" />
                  </svg>
                </button>
              </header>

              <div ref={log} className="ai-log" role="log" aria-label="Conversation">
                {messages.map((m) => (
                  <div key={m.id} className="ai-msg" data-role={m.role} data-state={m.state} aria-busy={m.state === "streaming" || undefined}>
                    {m.state === "streaming" && !m.text ? (
                      <span className="sr-only-keep">Thinking…</span>
                    ) : m.role === "user" ? (
                      links(m.text)
                    ) : (
                      <Reply text={m.text} caret={m.state === "streaming"} />
                    )}
                  </div>
                ))}
                {!asked && (
                  <ul className="ai-suggest" aria-label="Suggested questions">
                    {SUGGESTIONS.map((s) => (
                      <li key={s} className="chip">
                        <button type="button" onClick={() => send(s)}>{s}</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <form className="ai-form" onSubmit={onSubmit}>
                <label htmlFor={`${panelId}-input`} className="sr-only-keep">Ask Vamshi&apos;s AI</label>
                <textarea
                  ref={input}
                  id={`${panelId}-input`}
                  className="ai-input field"
                  rows={1}
                  maxLength={1200}
                  placeholder="Ask about Vamshi's work…"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKey}
                />
                <button type="submit" className="ai-icon-btn ai-send ring-btn" disabled={busy || !draft.trim()} aria-label="Send">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
                    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
                  </svg>
                </button>
              </form>
            </motion.div>
            <motion.i className="ai-edge" aria-hidden variants={v.edge("0%")} />
            <motion.i className="ai-edge" aria-hidden variants={v.edge("100%")} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        ref={launcher}
        type="button"
        className="ai-launch ring-btn"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <BrandMark id="bm-ai" className="brand-mark" />
        <span className="ai-launch-label">{open ? "Close" : "Ask my AI"}</span>
      </button>
    </div>
  );
}

/** Choreography for the door: the panel's clip opens from its centre seam while two edge lights travel out with it. */
function variants(reduced: boolean) {
  const { rise, part, fade, shut, sink } = AI_CHAT;
  if (reduced) {
    const fadeOnly: Variants = { hidden: { opacity: 0 }, open: { opacity: 1, transition: { duration: 0.2 } }, closed: { opacity: 0, transition: { duration: 0.15 } } };
    return { door: fadeOnly, panel: {} as Variants, edge: () => ({ hidden: { opacity: 0 }, open: { opacity: 0 }, closed: { opacity: 0 } }) as Variants };
  }
  const shutClip = "inset(0% 50% 0% 50% round 8px)";
  return {
    // The wrapper only waits for its children, so presence holds the panel until the doors have shut.
    door: { hidden: {}, open: {}, closed: { opacity: 0, transition: { when: "afterChildren", duration: 0.01 } } } as Variants,
    panel: {
      hidden: { clipPath: shutClip },
      open: { clipPath: "inset(0% 0% 0% 0% round 8px)", transition: { delay: rise, duration: part, ease: EASE_OUT } },
      closed: { clipPath: shutClip, transition: { duration: shut, ease: EASE_IN_OUT } },
    } as Variants,
    edge: (to: string): Variants => ({
      hidden: { left: "50%", scaleY: 0, opacity: 1 },
      open: {
        left: to,
        scaleY: 1,
        opacity: 0,
        transition: {
          scaleY: { duration: rise, ease: EASE_OUT },
          left: { delay: rise, duration: part, ease: EASE_OUT },
          opacity: { delay: rise + part * 0.75, duration: fade },
        },
      },
      closed: {
        left: "50%",
        scaleY: 0,
        opacity: 1,
        transition: {
          opacity: { duration: 0.12 },
          left: { duration: shut, ease: EASE_IN_OUT },
          scaleY: { delay: shut, duration: sink, ease: EASE_IN_OUT },
        },
      },
    }),
  };
}

/** NDJSON lines off a response body. */
async function* events(body: ReadableStream<Uint8Array>): AsyncGenerator<ChatEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  for (;;) {
    const { value, done } = await reader.read();
    if (done) return;
    buf += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl).trim();
      buf = buf.slice(nl + 1);
      if (line) yield JSON.parse(line) as ChatEvent;
    }
  }
}

/* ---- Replies. The server's prompt allows just this much structure: paragraphs, "- " (or numbered) lists
   whose items open with a **bold** name, an indented links line under an item, and bare URLs and emails.
   It renders mid-stream too: an unclosed ** runs bold to the end until its partner arrives. */

type Item = { text: string; sub: string[] };
type Block = { kind: "p"; lines: string[] } | { kind: "ul" | "ol"; items: Item[] };

const BULLET = /^ ?[-*•]\s+(.*)$/;
const NUMBERED = /^ ?\d+[.)]\s+(.*)$/;
const HAS_LINK = /https?:\/\/|[\w.+-]+@[\w-]+\./;

function blocks(text: string): Block[] {
  const out: Block[] = [];
  let para: string[] | null = null; // the paragraph still taking lines
  let afterItem = false; // the previous line belonged to a list item
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    const last = out.at(-1);
    const bullet = BULLET.exec(raw);
    const numbered = bullet ? null : NUMBERED.exec(raw);
    if (bullet || numbered) {
      const kind = bullet ? "ul" : "ol";
      const item = { text: (bullet ?? numbered)![1], sub: [] };
      if (last && last.kind !== "p" && last.kind === kind) last.items.push(item);
      else out.push({ kind, items: [item] });
      para = null;
      afterItem = true;
    } else if (!line) {
      para = null;
      afterItem = false;
    } else if (last && last.kind !== "p" && (/^\s/.test(raw) || (afterItem && HAS_LINK.test(line)))) {
      // An indented line, or a links line straight under an item: that item's sub-line.
      last.items.at(-1)!.sub.push(line.replace(/^[-*•]\s+/, ""));
      afterItem = true;
    } else {
      const heading = line.replace(/^#{1,6}\s+(.*)$/, "**$1**");
      if (para) para.push(heading);
      else out.push({ kind: "p", lines: (para = [heading]) });
      afterItem = false;
    }
  }
  return out;
}

function Reply({ text, caret }: { text: string; caret: boolean }) {
  const bs = blocks(text);
  // While streaming, the caret rides the end of the last line.
  const tip = (last: boolean) => (caret && last ? <i className="ai-caret" aria-hidden /> : null);
  return bs.map((b, i) => {
    const lastBlock = i === bs.length - 1;
    if (b.kind === "p") {
      return (
        <p key={i}>
          {b.lines.map((l, j) => (
            <Fragment key={j}>
              {j > 0 && <br />}
              {inline(l)}
              {tip(lastBlock && j === b.lines.length - 1)}
            </Fragment>
          ))}
        </p>
      );
    }
    const List = b.kind;
    return (
      <List key={i} className="ai-list">
        {b.items.map((it, j) => {
          const lastItem = lastBlock && j === b.items.length - 1;
          return (
            <li key={j}>
              {inline(it.text)}
              {tip(lastItem && !it.sub.length)}
              {it.sub.map((s, k) => (
                <span key={k} className="ai-sub">
                  {inline(s)}
                  {tip(lastItem && k === it.sub.length - 1)}
                </span>
              ))}
            </li>
          );
        })}
      </List>
    );
  });
}

/** `**` toggles bold. */
function inline(text: string): ReactNode {
  return text.split("**").map((seg, i) => (i % 2 ? <strong key={i}>{links(seg)}</strong> : <Fragment key={i}>{links(seg)}</Fragment>));
}

/* [label](url) (in case the model slips into markdown), bare URLs, and email addresses. */
const TOKEN = /\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<>()]*[^\s<>().,;:!?'"])|([\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;

/** Text with its links made live; a bare URL shows without its scheme, so it stays short. */
function links(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let at = 0;
  for (const m of text.matchAll(TOKEN)) {
    const start = m.index ?? 0;
    if (start > at) out.push(text.slice(at, start));
    const [, label, mdUrl, url, email] = m;
    const href = mdUrl ?? url ?? `mailto:${email}`;
    const web = !email;
    out.push(
      <a key={start} href={href} target={web ? "_blank" : undefined} rel={web ? "noreferrer noopener" : undefined} className="hue-text">
        {label ?? (url ? url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "") : email)}
      </a>,
    );
    at = start + m[0].length;
  }
  if (at < text.length) out.push(text.slice(at));
  return out;
}
