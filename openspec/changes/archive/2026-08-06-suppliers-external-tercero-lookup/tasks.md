## 1. Verificación previa (backend y contrato externo)

- [x] 1.1 Confirmado con una llamada real (`curl`) contra
      `https://iqsas.apifacturacionelectronica.com/api/ubl2.1/status/acquirer` usando
      el `ApiExterna:BearerToken` ya configurado en `appsettings.json`: responde
      `200 OK` con datos reales (`{"message":null,"email":"astridiazc@gmail.com","name":"DIAZ CAMACHO ASTRID"}`
      para el ejemplo del spec). El mismo token sirve, no se requiere credencial
      distinta.
- [x] 1.2 Confirmado que **no hay correspondencia 1:1** ni con `idTipoDocumentoId`
      (interno) ni con `codigoTipoDocumentoId` (código DIAN de identificación, ej.
      `"13"` = Cédula). El proveedor externo usa el catálogo oficial DIAN/UBL 2.1 de
      "Tipos de Documento" (1-12), donde `3` = Cédula de ciudadanía — confirmado
      empíricamente (la llamada de la tarea 1.1 con `type_document_identification_id: 3`
      devolvió una persona real). Se requiere una **tabla de mapeo explícita** en el
      backend, por `codigoTipoDocumentoId` → id del catálogo externo:
      `11→1, 12→2, 13→3, 21→4, 22→5, 31→6, 41→7, 42→8, 47→9, 48→10, 50→11, 91→12`.
      Solo el caso Cédula (13→3) quedó verificado con una respuesta real; el resto se
      infiere del catálogo oficial DIAN — verificar al menos un caso adicional (NIT)
      en la verificación manual (tarea 6) si hay un NIT real de prueba disponible.
- [x] 1.3 Confirmado: `type_environment_id: 1` es el valor correcto (usado en la
      llamada real de la tarea 1.1, exitosa). El único precedente en el código
      (`PrintVenta.TypeEnvironmentId`, usado en el flujo de XML de facturación) está
      actualmente comentado/sin uso activo en `VentasController.cs`, por lo que no
      aplica como referencia dinámica para este endpoint distinto. Se usa el valor
      fijo `1`.

## 2. Backend (`ApiAstilPos`)

- [x] 2.1 Agregado `AcquirerStatusUrl` a la sección `ApiExterna` de
      `appsettings.json` (no requiere override en `appsettings.Development.json`,
      que no tiene sección `ApiExterna`).
- [x] 2.2 Creados `Models/AcquirerStatusRequest.cs` y `Models/AcquirerStatusResponse.cs`
      siguiendo el precedente de `XmlApiRequest`/`XmlApiResponse`.
- [x] 2.3 Agregado `POST /terceros-consulta-externa` en `TercerosController.cs`, con
      la tabla de mapeo `TipoDocumentoExternoMap` (ver tarea 1.2), armando el request
      hacia el proveedor externo y enviándolo con `HttpClient` estático (mismo patrón
      de `VentasController`), retornando `Ok(...)` con `message`/`email`/`name`.
      Manejo de errores con try/catch + `_logger.LogError` + `BadRequest(...)`, igual
      que el resto del controller. Compilado sin errores (`dotnet build`).
- [x] 2.4 Confirmado: los logs solo registran el número de identificación consultado
      y el status/contenido de la respuesta de error; nunca el `BearerToken` ni la
      URL externa. El frontend solo recibe `message`/`email`/`name` en la respuesta.

## 3. Frontend — servicio y configuración

- [x] 3.1 Agregado `TERCEROS_CONSULTA_EXTERNA: '/terceros-consulta-externa'` a
      `API_CONFIG.ENDPOINTS`.
- [x] 3.2 Agregado `TerceroService.consultarDatosExternos(codigoTipoDocumentoId,
      identificationNumber)`, con el mismo patrón de manejo de errores del resto del
      servicio. Tipo de respuesta `IConsultaTerceroExterna` (`message`, `email`,
      `name`) creado en `src/types/`.

## 4. Frontend — formulario de Maestro de Terceros

- [x] 4.1 Agregada `handleConsultarDatosExternos`, llamada desde
      `handleValidarTerceroExistente` solo cuando el tercero ya estaba en modo
      creación (`!encontrado && !tercero.idTercero`) y hay un tipo de documento
      seleccionado (resuelto vía `tiposDocumentoIdentidad` → `codigoTipoDocumentoId`).
- [x] 4.2 Si `resultado.name`/`resultado.email` vienen con datos: sobrescribe
      `razonSocial`/`emailTercero` (`resultado.name ?? prev.razonSocial`, análogo
      para email).
- [x] 4.3 Si `resultado.message` tiene contenido, se muestra vía `toast(...)` sin
      tocar los campos ni bloquear.
- [x] 4.4 Si la consulta falla (catch) o `name`/`email` vienen vacíos, no se
      modifica `razonSocial`/`emailTercero`; el error solo se loguea, no se
      propaga ni bloquea el formulario.
- [x] 4.5 Agregado `ultimaConsultaExternaRef` (clave `codigoTipoDocumentoId|numero`)
      para no repetir la consulta si no cambió desde la última vez.
- [x] 4.6 Reutilizado `isValidandoTercero` (ya activo desde
      `handleValidarTerceroExistente`, que envuelve el `await` a
      `handleConsultarDatosExternos`) — no se introdujo un segundo indicador de
      carga.
- [x] 4.7 Confirmado: la consulta externa solo se alcanza en la rama donde no se
      encontró un tercero local (`else` de `if (encontrado)`), nunca cuando ya
      existe.

## 5. Pruebas

- [x] 5.1 Agregada prueba: número nuevo (sin duplicado local, tipo de documento
      seleccionado) → la consulta externa se dispara y autocompleta
      `razonSocial`/`emailTercero`.
- [x] 5.2 Agregada prueba: número que ya existe localmente → la consulta externa NO
      se dispara.
- [x] 5.3 Agregada prueba: la consulta externa falla (error de red) → el formulario
      sigue utilizable, `razonSocial` permanece editable manualmente.
- [x] 5.4 Agregada prueba: disparar `onBlur` dos veces seguidas con el mismo número
      → el servicio externo se llama solo una vez.
- [x] 5.5 `npm test`: 11/11 pruebas pasan en toda la suite. Se detectó y corrigió un
      bug real en el camino: `tiposDocumentoIdentidad` incluye una opción
      placeholder `{ idTipoDocumentoId: 0, codigoTipoDocumentoId: "0", ... }`
      ("Seleccione un tipo de documento"); el chequeo original
      (`if (!codigoTipoDocumentoId) return;`) no la descartaba porque `"0"` es un
      string truthy en JS. Se agregó un chequeo explícito de
      `tercero.idTipoDocumentoId` antes de resolver el código. También se agregó
      `clearMocks: true` a `vite.config.ts` (faltaba reset de mocks entre tests,
      necesario para las aserciones de conteo de llamadas de esta sección).

## 6. Verificación manual

- [x] 6.1 Confirmado por el usuario contra el backend real: un número de
      identificación nuevo válido autocompleta `razonSocial`/`emailTercero` desde el
      proveedor externo.
- [x] 6.2 Confirmado por el usuario: un número de identificación ya existente
      localmente no dispara la consulta externa.
- [x] 6.3 Confirmado por el usuario: con el servicio externo inalcanzable, el
      formulario sigue permitiendo crear el tercero manualmente.
