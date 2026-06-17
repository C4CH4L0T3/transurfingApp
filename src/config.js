// ---------------------------------------------------------------------------
// Configuración editable
// ---------------------------------------------------------------------------

// Ruta al PDF de tu plan completo.
// Coloca el archivo en la carpeta /public y, si cambias el nombre, edita aquí.
// Se usa ruta relativa ('./') para que abra tanto en la web como en la app de escritorio.
// Ejemplo: si tu archivo es /public/mi-plan.pdf -> usa './mi-plan.pdf'
export const PLAN_PDF_PATH = './plan.pdf'

// Fecha de inicio del programa (formato 'YYYY-MM-DD').
// La rotación de obras y el "Día 1" del hero cuentan desde aquí.
export const PROGRAM_START = '2026-06-17'

// Meta total de empresas a contactar en el mes.
export const PROSPECTING_GOAL = 100

// Meta diaria de empresas nuevas contactadas (rango sugerido).
export const DAILY_PROSPECTING_MIN = 8
export const DAILY_PROSPECTING_MAX = 10

// Clave usada en localStorage.
export const STORAGE_KEY = 'transformacion.v1'
