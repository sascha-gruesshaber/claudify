#!/usr/bin/env node

// Keeps one rule in one file. `sync` copies each fragment into every managed region that declares it;
// `check` fails when a copy drifted or the manifest is broken. See ../README.md.
//
// This runs in THIS repo, at author time. A consumer never runs it: the published plugin ships the
// regions already filled in, so a run pays no lookup for a rule that never varies per repo.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const SHARED = dirname(dirname(fileURLToPath(import.meta.url))) // .../skills/_shared
const PLUGIN = dirname(dirname(SHARED)) // the plugin root
const FRAGMENTS = join(SHARED, 'fragments')
const MANIFEST = join(SHARED, 'fragments.json')

// Captures name, declared source and the generated body. The back-reference on the closing marker is
// what stops two adjacent regions being read as one.
const REGION = /<!-- shared:([a-z0-9-]+):start source=([^\s]+) -->\r?\n([\s\S]*?)<!-- shared:\1:end -->/g

export function readFragments(dir = FRAGMENTS) {
  const out = new Map()
  if (!existsSync(dir)) return out
  for (const f of readdirSync(dir)) {
    if (!f.endsWith('.md')) continue
    out.set(basename(f, '.md'), `${readFileSync(join(dir, f), 'utf8').replace(/\s+$/, '')}\n`)
  }
  return out
}

// Every document a region may live in: skill markdown and agent definitions.
export function targets(root = PLUGIN) {
  const found = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry)
      if (statSync(p).isDirectory()) {
        // `templates` holds example config for the target repo, not documents that carry rules.
        if (entry === 'worktrees' || entry === 'node_modules' || entry === 'fragments' || entry === 'templates') continue
        walk(p)
      } else if (entry.endsWith('.md')) {
        found.push(p)
      }
    }
  }
  walk(join(root, 'skills'))
  walk(join(root, 'agents'))
  return found.sort()
}

export function regionsIn(text) {
  const out = []
  for (const m of text.matchAll(REGION)) {
    out.push({ name: m[1], source: m[2], body: m[3], whole: m[0] })
  }
  return out
}

function rendered(name, source, body) {
  return `<!-- shared:${name}:start source=${source} -->\n${body}<!-- shared:${name}:end -->`
}

export function syncText(text, fragments, onProblem) {
  // The body capture is deliberately dropped: it is the stale copy we are replacing.
  return text.replace(REGION, (whole, name, source) => {
    const frag = fragments.get(name)
    if (frag === undefined) {
      onProblem(`region "${name}" has no fragment file fragments/${name}.md`)
      return whole
    }
    if (source !== `${name}.md`) {
      onProblem(`region "${name}" declares source=${source}, expected ${name}.md`)
      return whole
    }
    return rendered(name, source, frag)
  })
}

function loadManifest(path = MANIFEST) {
  if (!existsSync(path)) return { requires: {}, forbids: {} }
  const raw = JSON.parse(readFileSync(path, 'utf8'))
  return { requires: raw.requires ?? {}, forbids: raw.forbids ?? {} }
}

// Walks every target once: rewrites drifted regions under `sync`, reports them under `check`, and
// returns which fragments each file declares.
function walkTargets(cmd, root, fragments, note) {
  const declared = new Set()
  const byTarget = new Map()
  let changed = 0

  for (const file of targets(root)) {
    const text = readFileSync(file, 'utf8')
    const found = regionsIn(text)
    if (found.length === 0) continue

    const key = relative(root, file).split('\\').join('/')
    byTarget.set(key, new Set(found.map((r) => r.name)))
    for (const r of found) declared.add(r.name)

    const next = syncText(text, fragments, (m) => note(`${key}: ${m}`))
    if (next === text) continue

    if (cmd === 'sync') {
      writeFileSync(file, next)
      changed++
    } else {
      note(`${key}: a managed region does not match its fragment — run \`skills.mjs sync\``)
    }
  }

  return { declared, byTarget, changed }
}

function checkRequired(names, key, root, byTarget, note) {
  if (!existsSync(join(root, key))) {
    note(`manifest names ${key}, which does not exist`)
    return
  }
  const have = byTarget.get(key) ?? new Set()
  for (const n of names) {
    if (!have.has(n)) note(`${key} is missing the required fragment "${n}"`)
  }
}

function checkForbidden(names, key, byTarget, note) {
  const have = byTarget.get(key) ?? new Set()
  for (const n of names) {
    if (have.has(n)) note(`${key} carries the forbidden fragment "${n}"`)
  }
}

// `$comment` keys live beside the real entries in fragments.json, so anything that is not an array
// of fragment names is documentation and is skipped.
function checkManifest(manifest, root, byTarget, note) {
  for (const [key, names] of Object.entries(manifest.requires)) {
    if (Array.isArray(names)) checkRequired(names, key, root, byTarget, note)
  }
  for (const [key, names] of Object.entries(manifest.forbids)) {
    if (Array.isArray(names)) checkForbidden(names, key, byTarget, note)
  }
}

// `opts` exists so the tests can point the whole run at a fixture tree. Production passes nothing.
function run(cmd, opts = {}) {
  const root = opts.root ?? PLUGIN
  const fragments = readFragments(opts.fragmentsDir ?? FRAGMENTS)
  const manifest = loadManifest(opts.manifestPath ?? MANIFEST)
  const problems = []
  const note = (m) => problems.push(m)

  const { declared, byTarget, changed } = walkTargets(cmd, root, fragments, note)
  checkManifest(manifest, root, byTarget, note)

  for (const name of fragments.keys()) {
    if (!declared.has(name)) {
      note(`fragments/${name}.md is declared by nothing — delete it or use it`)
    }
  }

  return { problems, changed, fragments: fragments.size, targets: byTarget.size }
}

export { run }

if (import.meta.url === `file://${process.argv[1]}`) {
  const cmd = process.argv[2]
  if (cmd !== 'sync' && cmd !== 'check') {
    console.error('usage: skills.mjs sync | check')
    process.exit(2)
  }
  const r = run(cmd)
  if (cmd === 'sync') console.log(`sync: ${r.fragments} fragments → ${r.targets} files, ${r.changed} updated`)
  if (r.problems.length) {
    for (const p of r.problems) console.error(`  ✗ ${p}`)
    console.error(`${r.problems.length} problem(s)`)
    process.exit(1)
  }
  if (cmd === 'check') console.log(`check: ${r.fragments} fragments across ${r.targets} files — clean`)
}
