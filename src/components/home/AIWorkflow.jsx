import { aiWorkflow } from '../../lib/content'
import SectionHeading from '../ui/SectionHeading'

export default function AIWorkflow() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20 border-t border-rule">
      <SectionHeading id="ai-workflow" label="04 — how I work" title="AI-assisted, end to end" />
      <p className="max-w-prose text-lg leading-relaxed mb-8">{aiWorkflow.intro}</p>
      <ol className="space-y-4 max-w-prose">
        {aiWorkflow.steps.map((step, i) => (
          <li key={i} className="grid grid-cols-[40px_1fr] gap-4 items-start">
            <span className="font-mono text-xs text-navy pt-1">{String(i + 1).padStart(2, '0')}</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
