import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

interface LessonContentProps {
  content: string
  className?: string
}

export default function LessonContent({ content, className = '' }: LessonContentProps) {
  return (
    <div className={`lesson-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h2: ({ children }) => (
            <h2 className="font-display text-lg font-bold text-cyan-300 mt-6 mb-3 text-glow-cyan">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="font-display text-base font-semibold text-purple-300 mt-4 mb-2">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-foreground/85 leading-relaxed mb-3 text-sm">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="text-cyan-300 font-semibold">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="text-purple-300 italic">{children}</em>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-purple-500/60 pl-4 my-4 bg-purple-500/5 rounded-r-lg py-2">
              <span className="text-purple-200/80 text-sm italic">{children}</span>
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-none space-y-1.5 mb-4 ml-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-1.5 mb-4 ml-1 text-sm text-foreground/85">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-foreground/85 flex gap-2 items-start">
              <span className="text-cyan-400 mt-0.5 shrink-0">◆</span>
              <span>{children}</span>
            </li>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-4 rounded-xl border border-border/30">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/20">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-3 py-2 text-left text-cyan-300 font-semibold text-xs uppercase tracking-wide">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-3 py-2 text-foreground/80 border-t border-border/20">{children}</td>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            if (isInline) {
              return (
                <code className="bg-muted/30 text-cyan-300 px-1.5 py-0.5 rounded text-xs font-mono">
                  {children}
                </code>
              )
            }
            return <code className={className}>{children}</code>
          },
          pre: ({ children }) => (
            <pre className="bg-muted/20 border border-border/30 rounded-xl p-4 overflow-x-auto mb-4 text-xs">
              {children}
            </pre>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
