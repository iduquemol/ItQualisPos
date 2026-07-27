## Why

En el Maestro de Terceros (`SuppliersMaster.tsx`), al crear un tercero nuevo el
formulario no valida si el número de identificación digitado ya existe en el
sistema. El usuario puede diligenciar todos los datos y guardar, y el sistema
simplemente crea un tercero duplicado mostrando "Tercero creado correctamente" — sin
detectar la duplicidad hasta que ya es tarde. La duplicidad debe detectarse desde el
momento en que se digita el número de identificación, no después de guardar.

## What Changes

- Al perder el foco (`onBlur`) del campo "Número de Identificación" en el formulario
  de creación/edición de terceros, el sistema consulta si ese número ya existe.
- La consulta se hace contra el endpoint que envuelve `sp_Search_terceros`
  (`POST /terceros-busqueda`, ya existente en el backend `ApiAstilPos`, pero sin
  consumir todavía desde el frontend).
- Si el tercero **no existe**: el formulario continúa en modo creación normal (sin
  cambios de comportamiento respecto a hoy).
- Si el tercero **sí existe**: el formulario se autocompleta con los datos
  retornados y cambia a modo edición; al guardar se ejecuta `TerceroService.update`
  en vez de `create`, y se avisa al usuario que el tercero ya existía y se cargó
  para edición (para que no piense que está creando uno nuevo).
- Si el usuario modifica el número de identificación después de que el formulario ya
  quedó en modo edición, la validación se vuelve a evaluar (puede volver a modo
  creación, o cargar otro tercero distinto).
- Se maneja estado de carga/error de la validación sin bloquear el resto del
  formulario, y se evita disparar la consulta en cada tecla (solo en `onBlur`).

## Capabilities

### New Capabilities
- `suppliers-validate-existing-tercero`: Comportamiento de validación de duplicidad
  de terceros por número de identificación en el Maestro de Terceros, incluyendo el
  cambio automático entre modo creación y modo edición.

### Modified Capabilities
(ninguna - no existe todavía una spec para el módulo de suppliers)

## Impact

- `src/features/suppliers/SuppliersMaster.tsx`: el campo de número de identificación
  (`onBlur`), el estado del formulario (modo creación vs. edición), y
  `handleSaveTercero`.
- `src/services/TerceroService.ts`: nuevo método para consumir
  `POST /terceros-busqueda` (el backend ya lo expone; falta el consumo desde el
  frontend).
- `src/config/api.config.ts`: agregar el endpoint `TERCEROS_BUSQUEDA` a
  `API_CONFIG.ENDPOINTS` (hoy no está registrado).
- No afecta directamente facturación DIAN, pero sí evita que se generen terceros
  duplicados que luego aparecerían en ventas, cotizaciones o notas de crédito.
