# items-product-search Specification

## Purpose
TBD - created by archiving change fix-items-search-product-details. Update Purpose after archive.
## Requirements
### Requirement: Carga completa de datos al seleccionar un producto por búsqueda
Cuando el usuario selecciona un producto desde el diálogo de búsqueda (ícono de lupa)
en el Catálogo de Productos, el sistema SHALL poblar el formulario con el % Máx.
Descuento, la tabla de Impuestos y la tabla de Precios correspondientes a ese
producto, además de los datos básicos (código, nombre, categoría, unidad de medida,
etc.) que ya se cargan hoy.

#### Scenario: Selección muestra el % Máx. Descuento del producto
- **WHEN** el usuario busca un producto por código o descripción y hace clic sobre
  una fila del resultado
- **THEN** el campo "% Máx. Descuento" del formulario muestra el valor de
  `porcentajeDescuento` de ese producto (o 0 si el producto no tiene descuento
  configurado, nunca vacío o el valor de otro producto previamente cargado)

#### Scenario: Selección muestra los impuestos del producto en la tabla de Impuestos
- **WHEN** el usuario selecciona un producto que tiene uno o más impuestos
  (`tributosProducto`) configurados
- **THEN** la pestaña "Impuestos" muestra cada impuesto del producto seleccionado con
  su código, nombre y tarifa, reemplazando cualquier impuesto que estuviera visible
  del producto anterior

#### Scenario: Selección muestra los precios del producto en la tabla de Precios
- **WHEN** el usuario selecciona un producto que tiene uno o más precios por lista
  (`preciosProducto`) configurados
- **THEN** la pestaña "Precios" muestra cada precio del producto seleccionado con su
  lista de precios, nombre y valor, reemplazando cualquier precio que estuviera
  visible del producto anterior

#### Scenario: Selección de un producto sin impuestos o precios configurados
- **WHEN** el usuario selecciona un producto que no tiene impuestos ni precios
  asociados
- **THEN** las tablas de Impuestos y Precios se muestran vacías (sin filas), sin
  arrastrar datos de una selección anterior

### Requirement: Los datos mostrados al seleccionar coinciden con los datos persistidos del producto
El sistema SHALL obtener los datos de impuestos, precios y % Máx. Descuento
directamente de la fuente de verdad del producto (backend), sin depender de que el
listado usado para la búsqueda ya los incluya, si dicho listado no los provee de forma
completa.

#### Scenario: El listado de búsqueda no incluye impuestos/precios anidados
- **WHEN** el endpoint que alimenta el diálogo de búsqueda devuelve productos sin los
  arreglos `tributosProducto` y `preciosProducto` completos (por ser un listado
  ligero)
- **THEN** el sistema obtiene el detalle completo del producto seleccionado antes de
  poblar el formulario, de modo que el usuario vea siempre los impuestos y precios
  reales del producto

