import { useApp, getDay } from '../store.jsx'
import { Card, Check } from '../ui.jsx'

export default function NightProtocol() {
  const { state, today, updateDay } = useApp()
  const day = getDay(state, today)

  const toggleCheck = (id) =>
    updateDay(today, (d) => {
      d.night[id] = !d.night[id]
    })

  const setText = (id, value) =>
    updateDay(today, (d) => {
      d.nightText[id] = value
    })

  const setIntention = (i, value) =>
    updateDay(today, (d) => {
      if (!Array.isArray(d.intentions)) d.intentions = ['', '', '']
      d.intentions[i] = value
    })

  return (
    <Card className="p-6 sm:p-7">
      <div className="flex items-center gap-2">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          Protocolo de noche
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {state.nightItems.map((item) => {
          if (item.kind === 'check') {
            return (
              <div key={item.id} className="-mx-1">
                <Check checked={!!day.night[item.id]} onChange={() => toggleCheck(item.id)}>
                  {item.label}
                </Check>
              </div>
            )
          }
          if (item.kind === 'text') {
            return (
              <div key={item.id}>
                <label className="mb-1.5 block px-1 text-[14px] font-medium text-neutral-700 dark:text-neutral-200">
                  {item.label}
                </label>
                <textarea
                  rows={2}
                  value={day.nightText[item.id] || ''}
                  onChange={(e) => setText(item.id, e.target.value)}
                  placeholder={item.placeholder}
                  className="w-full resize-none rounded-2xl bg-neutral-100/70 px-4 py-3 text-[15px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
                />
              </div>
            )
          }
          if (item.kind === 'intentions') {
            return (
              <div key={item.id}>
                <label className="mb-1.5 block px-1 text-[14px] font-medium text-neutral-700 dark:text-neutral-200">
                  {item.label}
                </label>
                <div className="space-y-2">
                  {[0, 1, 2].map((i) => (
                    <input
                      key={i}
                      value={(day.intentions && day.intentions[i]) || ''}
                      onChange={(e) => setIntention(i, e.target.value)}
                      placeholder={item.placeholder}
                      className="w-full rounded-2xl bg-neutral-100/70 px-4 py-2.5 text-[15px] outline-none ring-accent-400 focus:ring-2 dark:bg-white/[0.04]"
                    />
                  ))}
                </div>
              </div>
            )
          }
          return null
        })}
      </div>
    </Card>
  )
}
