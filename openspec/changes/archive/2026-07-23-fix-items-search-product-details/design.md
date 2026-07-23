## Context

`ItemsMaster.tsx` ya tiene lógica en `handleSelectProduct` que copia
`porcentajeDescuento`, `tributosProducto` y `preciosProducto` del producto elegido
hacia el estado `producto` del formulario. Sin embargo, el usuario reporta que estos
tres datos no aparecen correctamente tras seleccionar por búsqueda.

La lista que alimenta el diálogo de búsqueda viene de `ProductoService.getAll()`
(`GET /productos`), la misma lista que se usa para la tabla general de productos. Es
común que un endpoint de listado devuelva una versión "liviana" del producto (sin los
arreglos anidados de impuestos/precios) por razones de performance, mientras que un
endpoint de detalle sí los incluye. No se ha confirmado todavía cuál es el caso real
en este backend.

## Goals / Non-Goals

**Goals:**
- Que al seleccionar un producto por búsqueda, el % Máx. Descuento, la tabla de
  Impuestos y la tabla de Precios reflejen siempre los datos reales de ese producto.
- Que la solución no dependa de suposiciones sobre la forma de la respuesta del
  backend: primero se debe confirmar qué trae realmente `GET /productos`.

**Non-Goals:**
- No se cambia el comportamiento de edición inline, alta o guardado de
  impuestos/precios (tablas ya funcionales una vez cargadas).
- No se optimiza el endpoint de listado en el backend (fuera del alcance de este
  frontend), salvo que se decida agregar un endpoint/consulta de detalle nuevo.
- No se introduce un state manager global; el estado sigue siendo local al
  componente.

## Decisions

- **Investigar primero, luego implementar**: antes de tocar código, se debe inspeccionar
  la respuesta real de `GET /productos` (Network tab o log temporal) para
  confirmar si trae `tributosProducto`, `preciosProducto` y `porcentajeDescuento`
  completos por producto.
- **Reset explícito de las tablas al seleccionar**: independientemente de la causa raíz,
  `handleSelectProduct` debe reemplazar por completo `tributosProducto` y
  `preciosProducto` (no hacer merge) para evitar que datos de un producto previo queden
  visibles al seleccionar uno nuevo sin esos arreglos.
- **`search` del diálogo de búsqueda vs. `search` de filtrado de impuestos**: el
  componente reutilizaba el mismo estado `search` para filtrar el listado de productos
  en el diálogo y para filtrar `tributosProducto` en la tabla de Impuestos
  (`filteredTributos`). Esto era una fuente de confusión visual: si el usuario dejaba
  texto en el buscador de productos, ese mismo texto seguía filtrando la tabla de
  impuestos después de cerrar el diálogo.

## Risks / Trade-offs

- [Riesgo] Sin confirmar la forma real de la respuesta del backend, se podría
  implementar una llamada de detalle innecesaria → Mitigación: el primer paso de
  las tareas fue una verificación manual (Network tab) antes de decidir la rama de
  implementación.
- [Riesgo] Compartir el estado `search` entre el diálogo de productos y el filtro de
  impuestos podía seguir causando confusión → Mitigación: se eliminó el filtro
  (`filteredTributos`) y la tabla ahora usa `producto.tributosProducto` directo.

## Investigación inicial (tasks 1.1-1.3) — hallazgo incorrecto, superado

Una primera verificación contra la API real (`http://localhost:5264/api/productos`,
backend `ApiAstilPos`, muestra parcial de 281 productos) sugirió que el backend nunca
enviaba el descuento ni los precios: se buscó la clave `porcentajeDescuento` y no
apareció en ningún producto, y tampoco existía un endpoint de detalle por producto
(`GET /productos/{id}` → 404). Esa lectura fue **incorrecta**: se estaba buscando el
nombre de campo equivocado. Ver la sección siguiente.

## Causa raíz real (confirmada)

Al repetir la verificación contra el listado completo (558 productos) buscando el
nombre de campo correcto, se confirmó:

- El backend expone el descuento máximo como **`porcentajeMaxDescuento`** (no
  `porcentajeDescuento`, que es como lo tenía tipado y usado el frontend). El campo
  viene poblado en el 100% de los productos.
- `preciosProducto` **sí viene en la respuesta**, pero cada elemento solo trae
  `idPrecioProducto`, `idListaPrecio` y `precio` — **no** trae `codigoListaPrecio` ni
  `nombreListaPrecio`, que es lo que la tabla de Precios necesita mostrar. Hay que
  enriquecer cada precio cruzando `idListaPrecio` contra la lista ya cargada en el
  componente (`listaPrecios`, vía `ListaPrecioService.getAll()`).
- `tributosProducto` siempre vino completo (no era parte del problema).

**Conclusión final**: el bug era corregible enteramente en `pos-itq`, sin tocar el
backend. La causa fue un desajuste de nombre de campo (`porcentajeDescuento` vs.
`porcentajeMaxDescuento`) más una falta de enriquecimiento de `preciosProducto` con
los datos de `listaPrecios`.

## Cambios aplicados

- `src/types/IProducto.ts`: se eliminó el campo obsoleto `porcentajeDescuento` y se
  dejó únicamente `porcentajeMaxDescuento`, alineado con el nombre real del backend.
- `src/features/items/ItemsMaster.tsx`:
  - Todas las referencias a `porcentajeDescuento` se renombraron a
    `porcentajeMaxDescuento` (estado inicial, `handleNew`, `confirmDeleteProduct`, el
    reset al cambiar de código, y el input del formulario).
  - `handleSelectProduct` ahora enriquece `preciosProducto` cruzando cada
    `idListaPrecio` contra `listaPrecios` para completar `codigoListaPrecio` y
    `nombreListaPrecio` antes de guardarlos en el estado.
  - Se eliminó `filteredTributos` (variable muerta tras usar
    `producto.tributosProducto` directo en la tabla), resolviendo también el riesgo
    de compartir el estado `search` entre el buscador de productos y el filtro de la
    tabla de Impuestos.
- `src/features/pos/MainPos.tsx`: `addToCart` calculaba la base de IVA usando
  `product.porcentajeDescuento` (el mismo nombre incorrecto) sobre un objeto
  `IProducto`. Como ese campo nunca existía en la API, el descuento máximo nunca se
  aplicaba realmente en el cálculo de la base gravable del carrito. Se corrigió a
  `product.porcentajeMaxDescuento`. Este hallazgo fue colateral al fix de
  `ItemsMaster`, pero corrige un cálculo real de facturación en el POS.

## Verificación

- `npx tsc --noEmit` sin errores nuevos relacionados con este cambio (los únicos
  errores restantes en `ItemsMaster.tsx`, sobre `stockActualProducto` y
  `costoPromedioActualProducto`, son preexistentes y no forman parte de este cambio).
- Pruebas automatizadas con Vitest + Testing Library en
  `src/features/items/ItemsMaster.test.tsx` (ver tasks.md, sección 3).
- Verificación manual en navegador confirmada por el usuario: al seleccionar un
  producto por búsqueda, el % Máx. Descuento, la tabla de Impuestos y la tabla de
  Precios quedan correctamente pobladas.

## Open Questions

Ninguna pendiente. El cambio quedó resuelto enteramente dentro de `pos-itq`; no se
requirió ningún cambio en el backend `ApiAstilPos`.
