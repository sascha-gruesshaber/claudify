import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

import { readFragments, regionsIn, run, syncText, targets } from './skills.mjs'

// A fixture plugin tree: skills/ and agents/ beside a _shared/fragments directory.
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'claudify-'))
  mkdirSync(join(root, 'skills', '_shared', 'fragments'), { recursive: true })
  mkdirSync(join(root, 'agents'), { recursive: true })
  return root
}

function frag(root, name, body) {
  writeFileSync(join(root, 'skills', '_shared', 'fragments', `${name}.md`), body)
}

function skill(root, name, body) {
  mkdirSync(join(root, 'skills', name), { recursive: true })
  const p = join(root, 'skills', name, 'SKILL.md')
  writeFileSync(p, body)
  return p
}

function region(name, body) {
  return `<!-- shared:${name}:start source=${name}.md -->\n${body}<!-- shared:${name}:end -->`
}

function opts(root) {
  return {
    root,
    fragmentsDir: join(root, 'skills', '_shared', 'fragments'),
    manifestPath: join(root, 'skills', '_shared', 'fragments.json'),
  }
}

function manifest(root, obj) {
  writeFileSync(join(root, 'skills', '_shared', 'fragments.json'), JSON.stringify(obj))
}

test('readFragments normalises every fragment to a single trailing newline', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n\n\n')
  const got = readFragments(join(root, 'skills', '_shared', 'fragments'))
  assert.equal(got.get('law'), 'the law\n')
})

test('regionsIn does not read two adjacent regions as one', () => {
  const text = `${region('a', 'A\n')}\n\n${region('b', 'B\n')}`
  const found = regionsIn(text)
  assert.deepEqual(
    found.map((r) => r.name),
    ['a', 'b'],
  )
  assert.equal(found[0].body, 'A\n')
})

test('syncText replaces a drifted body and leaves the markers intact', () => {
  const fragments = new Map([['law', 'the real law\n']])
  const out = syncText(region('law', 'somebody edited this\n'), fragments, () => {
    assert.fail('no problem expected')
  })
  assert.equal(out, region('law', 'the real law\n'))
})

test('syncText reports a region whose fragment file is missing', () => {
  const problems = []
  const out = syncText(region('ghost', 'body\n'), new Map(), (m) => problems.push(m))
  assert.equal(out, region('ghost', 'body\n')) // left untouched
  assert.match(problems[0], /no fragment file/)
})

test('syncText reports a region whose declared source does not match its name', () => {
  const problems = []
  const text = '<!-- shared:law:start source=other.md -->\nbody\n<!-- shared:law:end -->'
  syncText(text, new Map([['law', 'body\n']]), (m) => problems.push(m))
  assert.match(problems[0], /declares source=other\.md/)
})

test('targets walks skills and agents, and skips fragments and templates', () => {
  const root = fixture()
  skill(root, 'alpha', 'x')
  mkdirSync(join(root, 'skills', 'alpha', 'templates'), { recursive: true })
  writeFileSync(join(root, 'skills', 'alpha', 'templates', 'example.md'), 'x')
  frag(root, 'law', 'x')
  writeFileSync(join(root, 'agents', 'scout.md'), 'x')

  const found = targets(root).map((p) => p.replace(root, ''))
  assert.deepEqual(found, ['/agents/scout.md', '/skills/alpha/SKILL.md'])
})

test('check fails on a drifted copy and sync repairs it', () => {
  const root = fixture()
  frag(root, 'law', 'the real law\n')
  const path = skill(root, 'alpha', `# Alpha\n\n${region('law', 'stale\n')}\n`)
  manifest(root, { requires: { 'skills/alpha/SKILL.md': ['law'] } })

  const bad = run('check', opts(root))
  assert.equal(bad.problems.length, 1)
  assert.match(bad.problems[0], /does not match its fragment/)

  const fixed = run('sync', opts(root))
  assert.equal(fixed.changed, 1)
  assert.deepEqual(fixed.problems, [])
  assert.match(readFileSync(path, 'utf8'), /the real law/)

  assert.deepEqual(run('check', opts(root)).problems, [])
})

test('check fails when a required fragment is absent from a skill', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n')
  skill(root, 'alpha', `# Alpha\n\n${region('law', 'the law\n')}\n`)
  skill(root, 'beta', '# Beta\n\nno regions here\n')
  manifest(root, { requires: { 'skills/beta/SKILL.md': ['law'] } })

  const r = run('check', opts(root))
  assert.equal(r.problems.length, 1)
  assert.match(r.problems[0], /missing the required fragment "law"/)
})

test('check fails when a skill carries a forbidden fragment', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n')
  skill(root, 'alpha', `# Alpha\n\n${region('law', 'the law\n')}\n`)
  manifest(root, { forbids: { 'skills/alpha/SKILL.md': ['law'] } })

  const r = run('check', opts(root))
  assert.match(r.problems[0], /carries the forbidden fragment "law"/)
})

test('check fails when the manifest names a file that does not exist', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n')
  skill(root, 'alpha', `# Alpha\n\n${region('law', 'the law\n')}\n`)
  manifest(root, { requires: { 'skills/gone/SKILL.md': ['law'] } })

  const r = run('check', opts(root))
  assert.match(r.problems[0], /which does not exist/)
})

test('check fails on an orphan fragment nothing declares', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n')
  frag(root, 'orphan', 'nobody applies me\n')
  skill(root, 'alpha', `# Alpha\n\n${region('law', 'the law\n')}\n`)
  manifest(root, {})

  const r = run('check', opts(root))
  assert.equal(r.problems.length, 1)
  assert.match(r.problems[0], /orphan\.md is declared by nothing/)
})

test('a $comment key in the manifest is documentation, not a rule', () => {
  const root = fixture()
  frag(root, 'law', 'the law\n')
  skill(root, 'alpha', `# Alpha\n\n${region('law', 'the law\n')}\n`)
  manifest(root, {
    requires: { $comment: 'read by the tool only', 'skills/alpha/SKILL.md': ['law'] },
  })

  assert.deepEqual(run('check', opts(root)).problems, [])
})
