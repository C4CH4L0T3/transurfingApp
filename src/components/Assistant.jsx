import { useEffect, useRef, useState } from 'react'
import { useApp, todayKey } from '../store.jsx'
import { IconButton, Icon } from '../ui.jsx'
import { buildBriefingText, speak, stopSpeaking, speechSupported } from '../briefing.js'

// Botón de la asistente de voz. Reproduce el saludo + resumen del día.
// Además, saluda automáticamente una vez al día al abrir la app.
export default function Assistant() {
  const { state, update } = useApp()
  const [speaking, setSpeaking] = useState(false)
  const didGreet = useRef(false)

  if (!speechSupported()) return null

  const play = () => {
    const text = buildBriefingText(state)
    setSpeaking(true)
    speak(text, { onend: () => setSpeaking(false) })
  }

  const toggle = () => {
    if (speaking || window.speechSynthesis.speaking) {
      stopSpeaking()
      setSpeaking(false)
    } else {
      play()
    }
  }

  // Saludo automático: una sola vez por día (si está activado).
  useEffect(() => {
    if (didGreet.current) return
    didGreet.current = true
    if (!state.settings.voiceGreeting) return
    const t = todayKey()
    if (state.settings.lastGreetedDate === t) return

    const id = setTimeout(() => {
      setSpeaking(true)
      speak(buildBriefingText(state), { onend: () => setSpeaking(false) })
      update((d) => {
        d.settings.lastGreetedDate = t
      })
    }, 1400)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <IconButton
      label={speaking ? 'Detener' : 'Buenos días (resumen de hoy)'}
      onClick={toggle}
      active={speaking}
    >
      {speaking ? <Icon.Stop /> : <Icon.Speaker />}
    </IconButton>
  )
}
