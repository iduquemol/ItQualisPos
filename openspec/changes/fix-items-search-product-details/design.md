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
  - **Si el listado SÍ trae los datos completos**: el bug es puramente de UI/estado en
    `handleSelectProduct` o en cómo se renderizan las tablas (por ejemplo, un estado
    obsoleto de `producto` que no se está reemplazando correctamente, o un
    `filteredTributos` que sigue filtrando por un `search` que no se limpia al
    cambiar de producto). La corrección se hace únicamente en
    `ItemsMaster.tsx`.
  - **Si el listado NO trae los datos completos (listado liviano)**: se debe agregar
    un método `ProductoService.getById(id)` (o reutilizar uno existente si el backend
    ya lo expone) y llamarlo desde `handleSelectProduct` para completar
    `tributosProducto`, `preciosProducto` y `porcentajeDescuento` antes de cerrar el
    diálogo de búsqueda.
- **Reset explícito de las tablas al seleccionar**: independientemente de la causa raíz,
  `handleSelectProduct` debe reemplazar por completo `tributosProducto` y
  `preciosProducto` (no hacer merge) para evitar que datos de un producto previo queden
  visibles al seleccionar uno nuevo sin esos arreglos.
- **`search` del diálogo de búsqueda vs. `search` de filtrado de impuestos**: el
  componente reutiliza el mismo estado `search` para filtrar el listado de productos en
  el diálogo y para filtrar `tributosProducto` en la tabla de Impuestos
  (`filteredTributos`). Esto es una fuente probable de confusión visual: si el usuario
  deja texto en el buscador de productos, ese mismo texto sigue filtrando la tabla de
  impuestos después de cerrar el diálogo. Se evaluará separar estos dos estados
  (`productSearch` vs. `tributoSearch`) como parte de la corrección si se confirma que
  contribuye al síntoma reportado.

## Risks / Trade-offs

- [Riesgo] Sin confirmar la forma real de la respuesta del backend, se podría
  implementar una llamada de detalle innecesaria → Mitigación: el primer paso de
  las tareas es una verificación manual (Network tab) antes de decidir la rama de
  implementación.
- [Riesgo] Agregar una llamada adicional (`getById`) por cada selección introduce
  latencia perceptible en la búsqueda → Mitigación: solo se agrega si se confirma que
  es necesario; se puede mostrar un estado de carga breve en el formulario mientras se
  resuelve.
- [Riesgo] Compartir el estado `search` entre el diálogo de productos y el filtro de
  impuestos puede seguir causando confusión si no se separa → Mitigación: cubrir con un
  escenario de prueba explícito (ver specs) y separar los estados si aplica.

## Confirmado tras investigación (tasks 1.1-1.3)

Se verificó contra la API real (`http://localhost:5264/api/productos`, backend
`ApiAstilPos`):

- `GET /productos` (281 productos) **nunca** incluye las claves `porcentajeDescuento`
  ni `preciosProducto` en el JSON. `tributosProducto` sí viene completo.
- `POST /productos-venta-tercero` tiene el mismo problema.
- No existe un endpoint de detalle por producto (`GET /productos/{id}` → 404); tampoco
  hay uno para precios (`/productos/{id}/precios` → 404).
- En `ApiAstilPos/Controllers/ProductosController.cs`, `GetProductos()` ejecuta el
  stored procedure `sp_Read_productos` y devuelve el JSON que ese SP arma
  directamente (aparentemente `FOR JSON` en SQL Server). El SP no está proyectando
  `porcentajeDescuento` ni `preciosProducto`.

**Conclusión**: este NO es un bug de frontend. `handleSelectProduct` en
`ItemsMaster.tsx` ya hace lo correcto con los datos que recibe; el problema es que el
backend nunca envía esos dos campos. Ninguna corrección dentro de `pos-itq` puede
mostrar datos que la API no entrega.

## Open Questions

- ¿Se debe ampliar `sp_Read_productos` (y probablemente `sp_Read_productosVenta`) en
  el repositorio `ApiAstilPos` para incluir `porcentajeDescuento` y
  `preciosProducto`? Esto está fuera del alcance de este repositorio (`pos-itq`) y
  del `openspec/` aquí configurado.
- Si se amplía el backend, ¿se debe crear un cambio OpenSpec espejo en `ApiAstilPos`
  (si ese repo también adopta OpenSpec), o se coordina manualmente?
- Mientras no se resuelva el backend, ¿se prefiere: (a) dejar esos campos en 0/vacío
  como hasta ahora, (b) deshabilitar visualmente esos campos con un aviso de "no
  disponible" en vez de mostrar 0 engañoso, o (c) no tocar el frontend todavía y
  esperar el fix de backend?
