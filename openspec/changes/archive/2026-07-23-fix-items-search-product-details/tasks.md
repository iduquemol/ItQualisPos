## 1. Investigación (causa raíz)

- [x] 1.1 Reproducir el bug en `ItemsMaster.tsx`: abrir el buscador (lupa), seleccionar
      un producto que tenga % Máx. Descuento, impuestos y precios configurados, y
      confirmar qué campos no se muestran correctamente.
- [x] 1.2 Inspeccionar la respuesta real de `GET /productos` contra la API corriendo
      en `http://localhost:5264/api/productos`. Una primera pasada (281 productos)
      buscando la clave `porcentajeDescuento` no la encontró en ningún producto, lo
      que sugería un dato faltante en el backend. Una segunda pasada contra el
      listado completo (558 productos), buscando el nombre de campo correcto, mostró
      que el backend sí envía el descuento máximo, bajo el nombre
      `porcentajeMaxDescuento` (no `porcentajeDescuento`). `preciosProducto` también
      viene en la respuesta, pero sin `codigoListaPrecio`/`nombreListaPrecio` (solo
      `idListaPrecio` + `precio`).
- [x] 1.3 Causa raíz confirmada: desajuste de nombre de campo entre frontend
      (`porcentajeDescuento`) y backend (`porcentajeMaxDescuento`), más falta de
      enriquecimiento de `preciosProducto` contra `listaPrecios` para mostrar
      código/nombre de la lista de precios. Corregible enteramente en `pos-itq`, sin
      cambios de backend.

## 2. Implementación

- [x] 2.1 Renombrar `porcentajeDescuento` → `porcentajeMaxDescuento` en
      `IProducto.ts` y en todas las referencias de `ItemsMaster.tsx` (estado inicial,
      `handleSelectProduct`, `handleNew`, `confirmDeleteProduct`, reset al cambiar de
      código, input del formulario).
- [x] 2.2 Enriquecer `preciosProducto` en `handleSelectProduct`, cruzando cada
      `idListaPrecio` contra `listaPrecios` para completar `codigoListaPrecio` y
      `nombreListaPrecio` antes de guardarlos en el estado.
- [x] 2.3 Eliminar `filteredTributos` (variable muerta) y usar
      `producto.tributosProducto` directo en la tabla de Impuestos, separando así el
      filtro de esa tabla del estado `search` del diálogo de búsqueda de productos.
- [x] 2.4 (hallazgo colateral) Corregir `MainPos.tsx` (`addToCart`), que también
      leía `product.porcentajeDescuento` sobre un `IProducto` y por eso el descuento
      máximo nunca se aplicaba en el cálculo de la base de IVA del carrito. Renombrado
      a `product.porcentajeMaxDescuento`.

## 3. Pruebas

- [x] 3.1 Agregada prueba con Vitest + Testing Library en
      `src/features/items/ItemsMaster.test.tsx` que selecciona un producto con %
      descuento, impuestos y precios configurados desde el buscador y verifica que el
      formulario y ambas tablas muestran esos datos (incluyendo el enriquecimiento de
      `codigoListaPrecio`/`nombreListaPrecio`).
- [x] 3.2 Agregada prueba que selecciona un producto sin impuestos ni precios y
      verifica que ambas tablas quedan vacías.
- [x] 3.3 `npm test` corrido: 3/3 pruebas pasan (incluye el smoke test de Vitest).

## 4. Verificación manual

- [x] 4.1 Confirmado por el usuario en el navegador: el % Máx. Descuento, la tabla de
      Impuestos y la tabla de Precios quedan correctamente pobladas tras seleccionar
      un producto por búsqueda.
- [x] 4.2 Confirmado por el usuario: crear un producto nuevo (`+`) y luego
      buscar/seleccionar otro producto existente no arrastra datos del formulario
      anterior.
