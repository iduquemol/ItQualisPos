# items-product-search Specification

## Purpose
Define el comportamiento de búsqueda y selección de productos en el Catálogo de
Productos (`ItemsMaster.tsx`): qué datos del producto deben quedar cargados en el
formulario (datos básicos, % Máx. Descuento, impuestos, precios) al seleccionarlo
desde el diálogo de búsqueda.

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
  `porcentajeMaxDescuento` de ese producto (o 0 si el producto no tiene descuento
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

### Requirement: Los precios mostrados incluyen el código y nombre de su lista de precios
El backend expone cada precio de `preciosProducto` únicamente con `idListaPrecio` y
`precio`, sin `codigoListaPrecio` ni `nombreListaPrecio`. El sistema SHALL enriquecer
cada precio del producto seleccionado cruzando su `idListaPrecio` contra el catálogo
de listas de precios (`listaPrecios`) antes de mostrarlo en la tabla de Precios.

#### Scenario: El precio del producto se muestra con el nombre de su lista de precios
- **WHEN** el usuario selecciona un producto con uno o más precios configurados
- **THEN** la tabla de Precios muestra, para cada precio, el código y nombre de la
  lista de precios correspondiente (resueltos vía `idListaPrecio`), no solo el valor
  numérico del precio

