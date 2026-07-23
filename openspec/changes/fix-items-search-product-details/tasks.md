## 1. Investigación (causa raíz)

- [x] 1.1 Reproducir el bug en `ItemsMaster.tsx`: abrir el buscador (lupa), seleccionar
      un producto que tenga % Máx. Descuento, impuestos y precios configurados, y
      confirmar qué campos no se muestran correctamente.
- [x] 1.2 Inspeccionar la respuesta real de `GET /productos` (confirmado contra la API
      corriendo en `http://localhost:5264/api/productos`, 281 productos): el JSON
      **no incluye en absoluto** las claves `porcentajeDescuento` ni `preciosProducto`
      en ningún producto. Sí incluye `tributosProducto` correctamente. Se probó
      también `POST /productos-venta-tercero`: mismo resultado (sin descuento ni
      precios).
- [x] 1.3 Causa raíz confirmada: **no es un bug de frontend**. El backend
      (`ApiAstilPos/Controllers/ProductosController.cs`, método `GetProductos`) arma
      la respuesta ejecutando el stored procedure `sp_Read_productos` y devuelve tal
      cual el JSON que ese SP construye (probablemente con `FOR JSON`) - dicho SP no
      está proyectando `porcentajeDescuento` ni `preciosProducto`. Tampoco existe
      ningún endpoint de detalle por producto (`GET /productos/{id}` devuelve 404) que
      pudiera usarse como alternativa. La rama "listado no trae los datos" del
      `design.md` aplica, pero la solución no puede resolverse únicamente en
      `pos-itq`: requiere un cambio en el repositorio backend `ApiAstilPos` (columna/
      proyección del SP `sp_Read_productos`, y posiblemente `sp_Read_productosVenta`).
      **Bloqueado a la espera de decisión del usuario** sobre cómo abordar el cambio
      de backend (ver conversación).

## 2. Implementación

- [ ] 2.1 Si el listado ya trae los datos completos: corregir `handleSelectProduct`
      y/o el estado relacionado en `ItemsMaster.tsx` para que `porcentajeDescuento`,
      `tributosProducto` y `preciosProducto` del producto seleccionado se reflejen
      siempre en el formulario (reemplazo completo, no merge parcial).
- [ ] 2.2 Si el listado NO trae los datos completos: agregar un método de detalle
      (ej. `ProductoService.getById(id)`) y llamarlo desde `handleSelectProduct` para
      completar `porcentajeDescuento`, `tributosProducto` y `preciosProducto` antes de
      cerrar el diálogo de búsqueda, mostrando un estado de carga breve si aplica.
- [ ] 2.3 Separar el estado `search` del diálogo de búsqueda de productos del estado
      usado para filtrar la tabla de Impuestos (`filteredTributos`), si el análisis de
      la tarea 1.1 confirma que compartir ese estado contribuye al síntoma reportado.

## 3. Pruebas

- [ ] 3.1 Agregar una prueba con Vitest + Testing Library para `ItemsMaster` que
      seleccione un producto con % descuento, impuestos y precios configurados desde
      el buscador y verifique que el formulario y ambas tablas muestran esos datos.
- [ ] 3.2 Agregar una prueba que seleccione un producto sin impuestos ni precios y
      verifique que ambas tablas quedan vacías (sin arrastrar filas del producto
      previamente seleccionado).
- [ ] 3.3 Correr `npm test` y confirmar que todas las pruebas (incluidas las nuevas)
      pasan.

## 4. Verificación manual

- [ ] 4.1 En el navegador, repetir el escenario de la tarea 1.1 y confirmar
      visualmente que el % Máx. Descuento, la tabla de Impuestos y la tabla de
      Precios quedan correctamente pobladas tras la selección.
- [ ] 4.2 Verificar que crear un producto nuevo (`+`) y luego buscar/seleccionar otro
      producto existente no arrastra datos del formulario anterior.
