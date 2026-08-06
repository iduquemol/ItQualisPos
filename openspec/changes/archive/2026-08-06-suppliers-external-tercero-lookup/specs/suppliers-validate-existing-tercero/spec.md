## MODIFIED Requirements

### Requirement: Validar duplicidad de tercero al digitar el número de identificación
Cuando el usuario diligencia el campo "Número de Identificación" en el formulario de
creación de terceros y ese campo pierde el foco, el sistema SHALL consultar si ya
existe un tercero con ese número de identificación antes de permitir continuar en
modo creación. Esta validación de duplicidad local SHALL ejecutarse antes que
cualquier consulta al proveedor externo de facturación electrónica
(`suppliers-external-tercero-lookup`) disparada por el mismo evento.

#### Scenario: El número de identificación no existe
- **WHEN** el usuario digita un número de identificación que no corresponde a ningún
  tercero existente y el campo pierde el foco
- **THEN** el formulario permanece en modo creación, sin cambios visibles para el
  usuario, y el sistema procede a consultar el proveedor externo para autocompletar
  nombre y correo

#### Scenario: El número de identificación ya existe
- **WHEN** el usuario digita un número de identificación que sí corresponde a un
  tercero existente y el campo pierde el foco
- **THEN** el formulario se autocompleta con los datos del tercero encontrado, cambia
  a modo edición, se muestra un aviso indicando que el tercero ya existía y se cargó
  para edición, y el sistema NO consulta el proveedor externo
