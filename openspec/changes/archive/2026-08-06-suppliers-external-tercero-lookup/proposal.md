## Why

Al crear un tercero en el Maestro de Terceros, el usuario debe digitar manualmente
el nombre (razón social) y el correo electrónico, aunque esos datos ya existen en el
proveedor externo de facturación electrónica (`iqsas.apifacturacionelectronica.com`)
asociados al número de identificación. Consultar automáticamente ese servicio al
digitar el número de identificación evita trabajo manual y errores de digitación.

## What Changes

- **Backend (`ApiAstilPos`)**: nuevo endpoint propio en `TercerosController` que
  recibe `type_document_identification_id` e `identification_number`, y hace de
  proxy hacia `POST https://iqsas.apifacturacionelectronica.com/api/ubl2.1/status/acquirer`
  (reutilizando el patrón y las credenciales ya usados para otras integraciones con
  el mismo proveedor, sección `ApiExterna` de `appsettings.json`). El frontend nunca
  llama directamente a la URL externa.
- **Frontend (`pos-itq` / `SuppliersMaster.tsx`)**: al digitar el número de
  identificación (mismo evento `onBlur` del campo, después de la validación de
  duplicidad ya existente — ver `suppliers-validate-existing-tercero`), si el
  tercero **no** existía localmente, se consulta el nuevo endpoint propio y se
  autocompletan `razonSocial` (con `name`) y `emailTercero` (con `email`) de la
  respuesta.
- Manejo de estados de carga y error sin bloquear el formulario: si el servicio
  externo falla, no responde, o no encuentra el documento, el usuario puede seguir
  digitando manualmente esos campos.
- No se repite la consulta si el número de identificación no cambió desde la última
  consulta exitosa o fallida.

## Capabilities

### New Capabilities
- `suppliers-external-tercero-lookup`: Autocompletado de nombre y correo del
  tercero desde el proveedor externo de facturación electrónica al digitar el
  número de identificación en el Maestro de Terceros.

### Modified Capabilities
- `suppliers-validate-existing-tercero`: se añade la regla de precedencia entre esta
  validación (duplicidad local) y la nueva consulta externa, ambas disparadas por el
  mismo evento `onBlur` del campo "Número de Identificación".

## Impact

- **Backend** — `ApiAstilPos/Controllers/TercerosController.cs`: nuevo endpoint
  (p. ej. `POST /terceros-consulta-externa`). `ApiAstilPos/Models/`: nuevos DTOs de
  request/response para la llamada externa. `appsettings.json`: nueva clave de URL
  bajo `ApiExterna` (reutilizando `BearerToken` ya existente para el mismo
  proveedor).
- **Frontend** — `src/services/TerceroService.ts`: nuevo método de consulta.
  `src/config/api.config.ts`: nuevo endpoint. `src/features/suppliers/SuppliersMaster.tsx`:
  orquestación de la consulta en el mismo `onBlur` que ya dispara la validación de
  duplicidad.
- No afecta directamente facturación DIAN de ventas, pero sí la calidad de los datos
  de contacto (`razonSocial`, `emailTercero`) de los terceros creados, que luego se
  usan en ventas, cotizaciones y notas de crédito.
- Riesgo de disponibilidad: el formulario de creación de terceros pasa a depender
  (de forma no bloqueante) de un servicio externo de terceros; debe degradar con
  gracia si ese servicio falla.
