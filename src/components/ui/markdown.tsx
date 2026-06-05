import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

// Lightweight Markdown renderer — no external dependency. Supports headings,
// bold/italic/inline-code, ordered/unordered lists, blockquotes, fenced code
// blocks, horizontal rules and paragraphs. Sufficient for clinical protocol
// documents authored in Markdown.

interface MarkdownProps {
  content: string
  className?: string
}

// Inline formatting: **bold**, *italic*, `code`
function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0

  while ((m = regex.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const token = m[0]
    const key = `${keyPrefix}-${i++}`
    if (token.startsWith('**')) {
      nodes.push(<strong key={key} className="font-semibold text-[var(--text-primary)]">{token.slice(2, -2)}</strong>)
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key} className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] text-[var(--text-brand-primary)] text-[0.875em] font-mono">{token.slice(1, -1)}</code>)
    } else {
      nodes.push(<em key={key} className="italic">{token.slice(1, -1)}</em>)
    }
    last = m.index + token.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export function Markdown({ content, className }: MarkdownProps) {
  const lines = content.replace(/\r\n/g, '\n').split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.trim().startsWith('```')) {
      const code: string[] = []
      i++
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i])
        i++
      }
      i++ // skip closing fence
      blocks.push(
        <pre key={key++} className="bg-[#0b1220] rounded-xl p-4 overflow-x-auto my-3">
          <code className="text-[13px] font-mono text-[#e2e8f0] whitespace-pre">{code.join('\n')}</code>
        </pre>,
      )
      continue
    }

    // Headings
    if (line.startsWith('### ')) { blocks.push(<h3 key={key++} className="text-[16px] font-bold text-[var(--text-primary)] mt-5 mb-2">{renderInline(line.slice(4), `h3-${key}`)}</h3>); i++; continue }
    if (line.startsWith('## '))  { blocks.push(<h2 key={key++} className="text-[19px] font-bold text-[var(--text-primary)] mt-6 mb-2.5">{renderInline(line.slice(3), `h2-${key}`)}</h2>); i++; continue }
    if (line.startsWith('# '))   { blocks.push(<h1 key={key++} className="text-[24px] font-bold text-[var(--text-primary)] mt-2 mb-3">{renderInline(line.slice(2), `h1-${key}`)}</h1>); i++; continue }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) { blocks.push(<hr key={key++} className="my-5 border-[var(--border-secondary)]" />); i++; continue }

    // Blockquote
    if (line.startsWith('> ')) {
      const quote: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) { quote.push(lines[i].slice(2)); i++ }
      blocks.push(
        <blockquote key={key++} className="border-l-4 border-[var(--border-brand)] bg-[var(--bg-brand-primary)] rounded-r-lg pl-4 pr-3 py-2.5 my-3 text-[14px] text-[var(--text-secondary)]">
          {renderInline(quote.join(' '), `bq-${key}`)}
        </blockquote>,
      )
      continue
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*] /.test(lines[i])) { items.push(lines[i].slice(2)); i++ }
      blocks.push(
        <ul key={key++} className="my-2.5 space-y-1.5">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <span className="mt-2 size-1.5 rounded-full bg-[var(--fg-brand-primary)] shrink-0" />
              <span>{renderInline(it, `ul-${key}-${idx}`)}</span>
            </li>
          ))}
        </ul>,
      )
      continue
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\. /.test(lines[i])) { items.push(lines[i].replace(/^\d+\. /, '')); i++ }
      blocks.push(
        <ol key={key++} className="my-2.5 space-y-1.5">
          {items.map((it, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-[14px] text-[var(--text-secondary)] leading-relaxed">
              <span className="mt-0.5 size-5 rounded-md bg-[var(--bg-brand-primary)] text-[var(--text-brand-primary)] text-[11px] font-bold flex items-center justify-center shrink-0">{idx + 1}</span>
              <span>{renderInline(it, `ol-${key}-${idx}`)}</span>
            </li>
          ))}
        </ol>,
      )
      continue
    }

    // Blank line
    if (line.trim() === '') { i++; continue }

    // Paragraph (gather consecutive non-empty, non-special lines)
    const para: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^(#{1,3} |[-*] |\d+\. |> |```|---+)/.test(lines[i])
    ) {
      para.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="text-[14px] text-[var(--text-secondary)] leading-relaxed my-2.5">
        {renderInline(para.join(' '), `p-${key}`)}
      </p>,
    )
  }

  return <div className={cn('max-w-none', className)}>{blocks}</div>
}
