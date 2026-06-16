// ---------------------------------------------------------------------------
// Contenido por defecto de la app.
// Todo esto es editable desde la interfaz; aquí solo vive el estado inicial.
// ---------------------------------------------------------------------------

// Declaración de identidad inicial (editable desde la pantalla "Hoy").
export const DEFAULT_IDENTITY =
  'Soy alguien que abre conversaciones de venta todos los días y maneja el no sin tomármelo personal.'

// Protocolo de mañana (lista de hábitos marcables, editable).
export const DEFAULT_MORNING_HABITS = [
  { id: 'm1', label: 'Despertar + agua con sal' },
  { id: 'm2', label: '10 min de sol sin gafas' },
  { id: 'm3', label: 'Declaración de identidad + objetivo #1 del día en voz alta' },
  { id: 'm4', label: 'Ducha fría 2–3 min' },
  { id: 'm5', label: 'Visualización + ensayo de guion de ventas' },
  { id: 'm6', label: 'Movimiento (caminar / gimnasio / flexiones)' },
]

// Cuatro áreas de vida, cada una con tareas marcables (editable).
export const DEFAULT_LIFE_AREAS = [
  {
    id: 'negocio',
    name: 'Negocio',
    emoji: '💼',
    tasks: [
      { id: 'n1', label: 'Prospección del día' },
      { id: 'n2', label: 'Seguimientos' },
      { id: 'n3', label: 'Registro de cada contacto' },
    ],
  },
  {
    id: 'fisico',
    name: 'Físico',
    emoji: '🏋️',
    tasks: [
      { id: 'f1', label: 'Gimnasio' },
      { id: 'f2', label: 'Caminata' },
      { id: 'f3', label: 'Alimentación cuidada' },
      { id: 'f4', label: 'Sueño suficiente' },
    ],
  },
  {
    id: 'mental',
    name: 'Mental',
    emoji: '🧠',
    tasks: [
      { id: 'me1', label: 'Lectura' },
      { id: 'me2', label: 'Registro de pensamiento de dos columnas' },
      { id: 'me3', label: 'Journaling' },
    ],
  },
  {
    id: 'relaciones',
    name: 'Relaciones',
    emoji: '🤝',
    tasks: [
      { id: 'r1', label: 'Encuentro social presencial (semanal)' },
      { id: 'r2', label: 'Conversación vulnerable (semanal)' },
    ],
  },
]

// Protocolo de noche: mezcla de checkboxes y campos de texto.
// kind: 'check' = casilla | 'text' = campo corto | 'intentions' = tres intenciones
export const DEFAULT_NIGHT_ITEMS = [
  { id: 'noche_telefono', kind: 'check', label: 'Teléfono en otra habitación, luces tenues' },
  {
    id: 'noche_auditoria',
    kind: 'text',
    label: 'Auditoría de identidad del día',
    placeholder: '¿Actué hoy como la persona que quiero ser? ¿Dónde sí, dónde no?',
  },
  {
    id: 'noche_intenciones',
    kind: 'intentions',
    label: 'Tres intenciones de implementación para mañana',
    placeholder: 'Si son las 9 AM, entonces…',
  },
  { id: 'noche_visualizacion', kind: 'check', label: 'Visualización de cinco sentidos' },
  { id: 'noche_lectura', kind: 'check', label: 'Lectura en papel' },
]

// Frase del día: dataset inicial. Agrega más objetos a este array cuando quieras.
export const DEFAULT_QUOTES = [
  {
    text: 'Cada acción que tomas es un voto por el tipo de persona que deseas ser.',
    author: 'James Clear',
    source: 'Hábitos Atómicos',
  },
  {
    text: 'Cambias mejor sintiéndote bien, no sintiéndote mal.',
    author: 'BJ Fogg',
    source: 'Tiny Habits',
  },
  {
    text: 'Una vez formas un hábito, se necesita fuerza de voluntad para inhibir la respuesta automática.',
    author: 'Wendy Wood',
    source: '',
  },
]

// Metas del mes.
export const DEFAULT_MONTH_GOALS = {
  process: [
    'Contactar las 100 empresas del mes a un ritmo de 8–10 por día.',
    'Dar seguimiento a cada contacto a los 3–4 días.',
    'Registrar cada contacto realizado.',
    'Identificar 50 empresas nuevas durante la semana 2.',
  ],
  outcome: ['Primera venta del mes.', '2–3 ventas en el mes.'],
}

// Total de días del módulo del curso.
export const COURSE_TOTAL_DAYS = 78
