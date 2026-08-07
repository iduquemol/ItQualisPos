# suppliers-validate-existing-tercero Specification

## Purpose
TBD - created by archiving change suppliers-validate-existing-tercero. Update Purpose after archive.
## Requirements
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

### Requirement: Guardar en el modo correcto según si el tercero existe
El sistema SHALL ejecutar la operación de actualización (no creación) cuando el
formulario esté en modo edición como resultado de haber detectado un tercero
existente.

#### Scenario: Guardar un tercero recién detectado como existente
- **WHEN** el formulario cambió a modo edición porque el número de identificación
  digitado ya existía, y el usuario hace clic en "Guardar"
- **THEN** el sistema ejecuta la actualización del tercero (no la creación), y no
  muestra el mensaje "Tercero creado correctamente"

#### Scenario: Guardar un tercero nuevo cuyo número no existe
- **WHEN** el número de identificación digitado no existe y el usuario hace clic en
  "Guardar"
- **THEN** el sistema ejecuta la creación del tercero, mostrando
  "Tercero creado correctamente", igual que hoy

### Requirement: Re-evaluar la validación si cambia el número de identificación en modo edición
Si el usuario modifica el número de identificación después de que el formulario ya
haya cambiado a modo edición por una detección previa, el sistema SHALL volver a
evaluar la existencia del nuevo número digitado.

#### Scenario: El usuario cambia a un número que no existe estando en modo edición
- **WHEN** el formulario está en modo edición (por una detección previa) y el usuario
  modifica el número de identificación a uno que no existe, y el campo pierde el foco
- **THEN** el formulario vuelve a modo creación con los datos limpios

#### Scenario: El usuario cambia a un número de otro tercero existente
- **WHEN** el formulario está en modo edición y el usuario modifica el número de
  identificación a uno que corresponde a otro tercero existente, y el campo pierde el
  foco
- **THEN** el formulario se autocompleta con los datos del nuevo tercero encontrado

### Requirement: La validación no bloquea la edición del resto del formulario
El sistema SHALL manejar el estado de carga y error de la validación de forma que el
usuario pueda seguir diligenciando otros campos del formulario mientras se resuelve,
y sin que un error de red o del backend impida continuar usando el formulario.

#### Scenario: La validación está en curso
- **WHEN** el sistema está consultando si el número de identificación existe
- **THEN** el usuario puede seguir diligenciando otros campos del formulario; solo el
  botón "Guardar" queda deshabilitado hasta que la validación concluya

#### Scenario: La consulta de validación falla
- **WHEN** la consulta a `sp_Search_terceros` falla por error de red o del backend
- **THEN** el formulario permanece utilizable (no se bloquea) y se informa el error
  al usuario, sin asumir que el tercero existe o no existe

