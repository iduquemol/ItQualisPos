## Context

`SuppliersMaster.tsx` ya sigue el mismo patrón que `ItemsMaster.tsx`:
`handleSaveTercero` decide crear vs. actualizar según si `tercero.idTercero` tiene
valor. Hoy no existe ninguna validación de duplicidad: el usuario puede diligenciar
un número de identificación ya existente y el formulario simplemente lo crea de
nuevo.

El backend (`ApiAstilPos/Controllers/TercerosController.cs`) ya expone
`POST /terceros-busqueda`, que recibe `{ query: string }`, ejecuta
`sp_Search_terceros` con `@searchText = query`, y devuelve un array de `Tercero`
bajo la clave JSON `"tercero"` (nombre en singular, distinto a otros endpoints del
mismo controller que usan claves en plural). Este endpoint no está registrado en
`API_CONFIG.ENDPOINTS` ni consumido por `TerceroService` todavía.

No se identificó ningún hook o capa intermedia adicional en `suppliers/`: el
componente llama directamente a `TerceroService`, igual que `ItemsMaster.tsx` llama a
`ProductoService`. Se seguirá ese mismo patrón (servicio centralizado, sin
hooks/React Query).

## Goals / Non-Goals

**Goals:**
- Detectar en `onBlur` del campo "Número de Identificación" si ese número ya existe,
  usando el endpoint que envuelve `sp_Search_terceros`.
- Si existe: autocompletar el formulario y pasar a modo edición de forma transparente
  (mismo formulario, cambia el submit y los datos precargados).
- Si no existe: no cambiar el comportamiento actual (modo creación).
- Volver a evaluar la validación si el usuario edita el número de identificación
  estando ya en modo edición.
- No bloquear el formulario mientras se resuelve la validación; manejar errores de
  red/API sin impedir que el usuario siga diligenciando otros campos.

**Non-Goals:**
- No se modifica `sp_Search_terceros` ni ningún otro procedimiento del backend (se
  asume que ya existe y funciona, según el request original).
- No se valida ningún otro campo del formulario más allá del número de
  identificación.
- No se introduce debounce por tecla: la validación se dispara solo en `onBlur`, no
  mientras el usuario escribe.
- No se introduce React Query/SWR ni un state manager nuevo; se sigue el patrón
  actual (fetch directo vía servicio + `useState` local).

## Decisions

- **Nuevo endpoint en `API_CONFIG.ENDPOINTS`**: agregar `TERCEROS_BUSQUEDA:
  '/terceros-busqueda'`, siguiendo la convención de nombres en mayúsculas ya usada
  (`SUPPLIERS`, `TERCEROS_PROVEEDORES`, etc.).
- **Nuevo método en `TerceroService`**: `search(query: string): Promise<ITercero[]>`
  (POST con body `{ query }`, mismo patrón de manejo de errores que el resto de
  métodos del servicio). El nombre `search` se alinea con el uso ya existente de
  `getTercerosProveedores` como convención de nombres descriptivos por método.
- **Disparo en `onBlur`, no debounce por tecla**: como pide la especificación
  original, se evalúa solo cuando el campo pierde el foco, evitando llamadas
  innecesarias mientras el usuario escribe.
- **Coincidencia exacta, no prefijo**: `sp_Search_terceros` es un buscador genérico
  (usado también en autocompletar/combobox de terceros); para esta validación se debe
  filtrar en el frontend el resultado exacto donde
  `numeroIdentificacion === valor digitado` (no basta con "hay resultados"), ya que
  el SP podría devolver coincidencias parciales.
- **Estado de "validando" separado del estado de guardado**: se añade un estado
  (p. ej. `isValidandoTercero`) para deshabilitar el botón "Guardar" únicamente
  mientras la validación está en curso, sin afectar el resto de la interacción con el
  formulario.
- **Aviso al usuario**: al detectar duplicado, se usa `sonner` (`toast`), ya usado en
  el resto del módulo (`toast.error`, `toast.success`), para avisar
  "Tercero existente. Se cargó para edición." en vez de un `AlertDialog` nuevo.
- **Re-evaluación al editar el número en modo edición**: si el usuario cambia
  `numeroIdentificacion` estando en modo edición (`tercero.idTercero` seteado), se
  vuelve a disparar la misma validación en el próximo `onBlur`; si el nuevo número no
  existe, se debe volver a modo creación (limpiar `idTercero` y los demás campos,
  igual que ya hace `ItemsMaster.tsx` con `codigoProducto` en un escenario análogo).

## Risks / Trade-offs

- [Riesgo] `sp_Search_terceros` es una búsqueda genérica (por nombre, NIT parcial,
  etc.), no una búsqueda exacta por identificación → Mitigación: filtrar en el
  frontend por coincidencia exacta de `numeroIdentificacion` antes de decidir si
  "existe" o no.
- [Riesgo] Confundir al usuario si el cambio a modo edición no es evidente →
  Mitigación: aviso explícito vía `toast` cuando se detecta el duplicado.
- [Riesgo] Llamadas duplicadas o carreras si el usuario sale y vuelve a entrar rápido
  al campo → Mitigación: usar un flag de "validación en curso" que ignore/cancele
  resultados de una validación anterior si ya se disparó una nueva.
- [Riesgo] El endpoint podría no devolver todos los campos que el formulario necesita
  para autocompletar (por ejemplo `responsabilidadesTerceros`) → Mitigación: verificar
  el contrato real de respuesta contra la API antes de implementar el mapeo completo
  (primera tarea de implementación).
