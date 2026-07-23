## Why

En el Catálogo de Productos (`ItemsMaster.tsx`), al buscar un producto con la lupa y
seleccionarlo desde el diálogo de búsqueda, el formulario no refleja correctamente el
% Máx. Descuento, ni la tabla de Impuestos, ni la tabla de Precios del producto
seleccionado. El usuario ve el producto "vacío" en esos campos aunque el producto sí
tenga descuento, impuestos y precios configurados, lo que obliga a editarlo a ciegas o
a re-consultarlo por otro medio.

## What Changes

- Al seleccionar un producto desde el diálogo de búsqueda (lupa), el formulario debe
  quedar poblado con:
  - El % Máx. Descuento (`porcentajeDescuento`) del producto seleccionado.
  - La tabla de Impuestos (`tributosProducto`) del producto seleccionado.
  - La tabla de Precios (`preciosProducto`) del producto seleccionado.
- Si la lista que alimenta el diálogo de búsqueda (`ProductoService.getAll`) no trae
  estos datos anidados (impuestos/precios/descuento) por ser un listado ligero, se debe
  ajustar el flujo de selección para obtener el detalle completo del producto antes de
  poblar el formulario, en vez de asumir que el listado ya los trae.
- No se modifica el comportamiento de creación, edición inline o guardado de
  impuestos/precios; solo el llenado inicial del formulario al seleccionar un producto
  por búsqueda.

## Capabilities

### New Capabilities
- `items-product-search`: Comportamiento de búsqueda y selección de productos en el
  Catálogo de Productos, incluyendo qué datos del producto deben quedar cargados en el
  formulario (datos básicos, % descuento, impuestos, precios) al seleccionarlo.

### Modified Capabilities
(ninguna - no existen specs previas en el proyecto)

## Impact

- `src/features/items/ItemsMaster.tsx`: función `handleSelectProduct` y, si aplica,
  el diálogo de búsqueda de productos.
- `src/services/ProductoService.ts`: puede requerir un método adicional para obtener
  el detalle completo de un producto por id, si `getAll` no incluye impuestos/precios.
- `src/types/IProducto.ts`: sin cambios de forma esperados (los campos ya existen en
  la interfaz); el ajuste es de datos/flujo, no de tipos.
- No afecta facturación DIAN, notas de crédito ni cotizaciones directamente, pero el
  % Máx. Descuento y los precios por lista sí son consumidos luego en el flujo de venta
  (POS), por lo que un dato incorrecto aquí puede propagarse a la venta.
