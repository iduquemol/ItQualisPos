## Context

**Backend (`ApiAstilPos`)** — investigación confirmada contra el código real:

- Los controladores devuelven datos crudos vía `Ok(...)` y errores vía
  `BadRequest($"Error: {ex.Message}")`, sin envelope `{ success, data, error }`.
  Patrón uniforme en `ProductosController`, `TercerosController`, `VentasController`,
  `NotaCreditoController`, `PortalController`.
- Ya existe un patrón de llamada HTTP a un proveedor externo: `VentasController.cs`
  usa un `HttpClient` estático (`private static readonly HttpClient httpClient = new
  HttpClient();`, no `IHttpClientFactory` — no hay `AddHttpClient()` registrado en
  `Program.cs`), lee la URL y el token desde `IConfiguration` con sintaxis de
  indexador (`_configuration["ApiExterna:InvoiceUrl"]`,
  `_configuration["ApiExterna:BearerToken"]`), limpia y setea el header
  `Authorization: Bearer <token>`, y hace `httpClient.PostAsync(...)`.
- `appsettings.json` ya tiene una sección `ApiExterna` para el **mismo proveedor**
  (`iqsas.apifacturacionelectronica.com`): `BearerToken`, `InvoiceUrl`, `PosUrl`,
  `XmlUrl`, `NotaCUrl`, etc. El token ya existente probablemente sirve también para
  el endpoint `status/acquirer` (mismo proveedor/contrato), a confirmar como primera
  tarea antes de implementar.
- Los modelos de request/response de integraciones externas viven en
  `ApiAstilPos/Models/` con nombres PascalCase por archivo (hay precedente directo:
  `XmlApiRequest.cs` / `XmlApiResponse.cs`, `ResponseDian.cs`).
- Logging con Serilog vía `ILogger<T>` inyectado; patrón uniforme
  `try { ...; _logger.LogInformation(...); } catch (Exception ex) {
  _logger.LogError($"Error al ...: {ex.Message}"); return BadRequest($"Error:
  {ex.Message}"); }`.
- No hay middleware de resiliencia (Polly), ni timeout explícito configurado en el
  `HttpClient` estático actual — los timeouts de las integraciones existentes
  dependen del default de `HttpClient` (100s).

**Frontend (`pos-itq`)** — ya existe (del cambio `suppliers-validate-existing-tercero`)
un `onBlur` en el campo "Número de Identificación" de `SuppliersMaster.tsx`
(`handleValidarTerceroExistente`) que valida duplicidad contra `sp_Search_terceros` a
través de `TerceroService.search`. El campo `razonSocial` es el nombre/razón social
único del tercero (validado, requerido); `emailTercero` es el correo (validado con
regex, requerido). Ambos son los campos objetivo del autocompletado externo.

## Goals / Non-Goals

**Goals:**
- Exponer un endpoint propio en el backend que actúe como proxy hacia
  `POST https://iqsas.apifacturacionelectronica.com/api/ubl2.1/status/acquirer`,
  sin exponer la URL ni el token al frontend.
- Autocompletar `razonSocial` y `emailTercero` al digitar el número de
  identificación, solo cuando el tercero no existía ya localmente (ver precedencia
  abajo).
- Degradar con gracia: si el servicio externo falla, no responde, o no encuentra el
  documento, el formulario sigue siendo utilizable para digitar manualmente.
- No repetir la consulta si el número de identificación no cambió desde la última
  consulta (exitosa o fallida) para ese mismo valor.

**Non-Goals:**
- No se introduce `IHttpClientFactory` ni Polly en este cambio: se sigue el patrón
  ya usado (`HttpClient` estático) para no introducir un patrón nuevo, aunque es una
  mejora técnica preexistente pendiente en el proyecto (fuera de alcance).
- No se cambia el envelope de respuesta del backend (se sigue `Ok(...)` /
  `BadRequest(...)` plano).
- No se persiste histórico de las consultas realizadas al servicio externo.
- No se valida ni corrige la relación entre `idTipoDocumentoId` (catálogo interno) y
  `type_document_identification_id` (catálogo DIAN/UBL del proveedor externo) más
  allá de mapear el valor correcto — ver Open Questions.

## Decisions

- **Endpoint backend**: `POST /terceros-consulta-externa` en `TercerosController`
  (mismo controller, seguido el naming en kebab-case de `terceros-busqueda`),
  recibiendo `{ typeDocumentIdentificationId: number, identificationNumber: string }`
  desde el frontend (nombres en camelCase del lado .NET, se mapean 1:1 a los nombres
  snake_case que espera el proveedor externo al armar el request saliente).
- **DTOs nuevos**: `Models/AcquirerStatusRequest.cs` y
  `Models/AcquirerStatusResponse.cs`, siguiendo el precedente de
  `XmlApiRequest`/`XmlApiResponse`. `AcquirerStatusResponse` expone `Message`,
  `Email`, `Name` (mismo shape de la respuesta del proveedor).
- **Configuración**: reutilizar `ApiExterna:BearerToken` y agregar
  `ApiExterna:AcquirerStatusUrl` con el valor
  `https://iqsas.apifacturacionelectronica.com/api/ubl2.1/status/acquirer` en
  `appsettings.json` (y `appsettings.Development.json` si aplica), siguiendo la
  convención ya usada para `InvoiceUrl`, `PosUrl`, etc.
- **Manejo de errores backend**: mismo patrón try/catch + `_logger.LogError` +
  `BadRequest(...)`. Si el proveedor externo responde con `message` no nulo (posible
  indicador de "no encontrado" o error de negocio), el backend igual responde `Ok(...)`
  con el payload tal cual (no es un error HTTP) — es el frontend quien decide qué
  hacer con `message` (ver más abajo). Solo se responde `BadRequest` ante errores de
  transporte/timeout/deserialización.
- **`type_document_identification_id`**: **no hay correspondencia 1:1** con
  `idTipoDocumentoId` ni con `codigoTipoDocumentoId` del catálogo interno. El
  proveedor externo usa el catálogo oficial DIAN/UBL 2.1 "Tipos de Documento"
  (1-12). Se implementa una tabla de mapeo explícita en el backend, por
  `codigoTipoDocumentoId` → id externo:
  `{"11":1,"12":2,"13":3,"21":4,"22":5,"31":6,"41":7,"42":8,"47":9,"48":10,"50":11,"91":12}`.
  Confirmado empíricamente para Cédula (`"13"` → `3`, respuesta real de una persona
  real); el resto se infiere del mismo catálogo oficial. Si el `codigoTipoDocumentoId`
  del tercero no está en la tabla, o no hay tipo de documento seleccionado, no se
  dispara la consulta externa.
- **Precedencia con la validación de duplicidad** (modifica
  `suppliers-validate-existing-tercero`): en el mismo `onBlur`, primero se ejecuta
  `handleValidarTerceroExistente` (duplicidad local); la consulta externa solo se
  dispara si, tras esa validación, el formulario **sigue en modo creación** (no se
  encontró un tercero local con ese número). Si el tercero ya existe localmente, no
  se consulta el proveedor externo, para no sobrescribir datos ya guardados con los
  del proveedor.
- **Sobrescritura de campos**: si el usuario ya había digitado `razonSocial`/
  `emailTercero` manualmente antes de que la consulta externa responda, la respuesta
  igual los sobrescribe (regla sugerida por la especificación original), dejando que
  el usuario los edite después si lo desea.
- **`message` con contenido**: se interpreta como informativo/advertencia, no como
  fatal — se muestra vía `toast` (consistente con el aviso ya usado para el hallazgo
  de tercero existente) pero no bloquea ni limpia lo que el usuario haya digitado.
- **No repetir consulta**: se guarda en una ref el último número de identificación
  consultado (éxito o fallo) para el lookup externo; si el `onBlur` se dispara de
  nuevo con el mismo valor, no se repite la llamada.
- **Estado de carga**: se reutiliza el mismo mecanismo que deshabilita "Guardar"
  durante `isValidandoTercero` (se amplía para cubrir también la consulta externa),
  en vez de introducir un segundo flag visualmente independiente que confunda al
  usuario.

## Risks / Trade-offs

- [Riesgo] El token/URL del proveedor externo son secretos en texto plano en
  `appsettings.json` (patrón ya existente en el proyecto, no introducido por este
  cambio) → Mitigación: fuera de alcance de este cambio; no se debe imprimir el
  token real en ningún artefacto de este spec.
- [Riesgo] Si `type_document_identification_id` no está bien mapeado, la consulta
  externa fallaría silenciosamente (degradación esperada) o traería datos de otra
  persona → Mitigación: verificar el mapeo contra datos reales antes de dar por
  cerrada la implementación (tarea explícita), y validar que el backend no haga
  "best effort" con un valor por defecto si no está claro.
- [Riesgo] Latencia perceptible en el `onBlur` si se encadenan dos llamadas
  (duplicidad local + consulta externa) → Mitigación: son secuenciales por diseño
  (la externa depende del resultado de la primera), y ambas ya están cubiertas por
  el mismo estado de carga que deshabilita "Guardar", no el resto del formulario.
- [Riesgo] Reusar el `HttpClient` estático de `VentasController` en otro controller
  duplicaría el campo; se declara uno nuevo en `TercerosController` siguiendo el
  mismo patrón (no se comparte una instancia entre controllers en el código actual).

## Open Questions

Ninguna pendiente — las tres preguntas originales se confirmaron empíricamente
contra el proveedor real (ver tasks.md, sección 1): el `BearerToken` existente
sirve, `type_environment_id` es `1`, y `type_document_identification_id` requiere
la tabla de mapeo explícita documentada en Decisions.
