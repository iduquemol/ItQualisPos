## 1. Verificación del contrato de API

- [x] 1.1 Confirmado contra la API real (`POST /terceros-busqueda`): devuelve un
      array plano de objetos con la misma forma que `GET /terceros` (incluye
      `responsabilidadesTerceros` poblado). El objeto real trae campos que no están
      en `ITercero.ts` (`idTipoPersona`, `nombreTipoPersona`, `nombreTipoRegimen`,
      `tercerosEmpleado`) y le faltan otros que sí declara el tipo (`retenedorIva`,
      `retenedorRenta`, `retenedorIca`, `declaraRenta`, `tarifaIca`) — es el mismo
      desfase de tipos preexistente ya usado (sin corregir) en el resto del código
      (`TerceroService.getAll()`), fuera de alcance de este cambio.
- [x] 1.2 Confirmado: `sp_Search_terceros` hace coincidencia **parcial** (por NIT o
      por nombre, con posibles resultados duplicados), no exacta. Es obligatorio
      filtrar en frontend por `numeroIdentificacion` exacto antes de decidir si el
      tercero "existe".

## 2. Servicio y configuración

- [x] 2.1 Agregado `TERCEROS_BUSQUEDA: '/terceros-busqueda'` a
      `API_CONFIG.ENDPOINTS` en `src/config/api.config.ts`.
- [x] 2.2 Agregado `TerceroService.search(query: string): Promise<ITercero[]>` en
      `src/services/TerceroService.ts`, siguiendo el mismo patrón de manejo de
      errores de los demás métodos del servicio.

## 3. Formulario de Maestro de Terceros

- [x] 3.1 Agregado `onBlur={handleValidarTerceroExistente}` al campo "Número de
      Identificación" en `SuppliersMaster.tsx`; no dispara si el campo está vacío.
- [x] 3.2 Filtrado en frontend por coincidencia exacta de `numeroIdentificacion`
      (`resultados.find(t => t.numeroIdentificacion === numeroIdentificacion)`).
- [x] 3.3 Si hay coincidencia exacta y es un tercero distinto al ya cargado:
      `handleSelectTercero(encontrado)` autocompleta el formulario y setea
      `idTercero` (pasa a modo edición), y se muestra un `toast` informando que el
      tercero ya existía y se cargó para edición.
- [x] 3.4 Si no hay coincidencia y el formulario estaba en modo creación, no se
      modifica el estado (permanece igual).
- [x] 3.5 Agregado estado `isValidandoTercero` que deshabilita el botón "Guardar"
      mientras la validación está en curso, sin bloquear el resto del formulario.
- [x] 3.6 La consulta está en try/catch; ante error se informa vía `toast.error` sin
      bloquear el formulario.
- [x] 3.7 Confirmado: `handleSaveTercero` ya ejecuta `update` cuando `idTercero`
      está seteado y `create` cuando no (patrón existente, sin cambios necesarios).

## 4. Pruebas

- [x] 4.1 Agregada prueba en `SuppliersMaster.test.tsx`: número inexistente no
      cambia el formulario de modo creación.
- [x] 4.2 Agregada prueba: número existente autocompleta el formulario, pasa a modo
      edición, y al guardar ejecuta `update` (no `create`).
- [x] 4.3 Agregada prueba: cambiar el número a uno inexistente estando en modo
      edición vuelve a modo creación, conservando el número recién digitado.
- [x] 4.4 Agregada prueba: error de red en `TerceroService.search` no bloquea el
      formulario (se puede seguir escribiendo en otros campos).
- [x] 4.5 `npm test` corrido: 7/7 pruebas pasan (incluye las 4 nuevas de este
      cambio).

## 5. Verificación manual

- [x] 5.1 Confirmado por el usuario en el navegador, contra el backend real: crear un
      tercero con un número de identificación nuevo se crea normalmente
      ("Tercero creado correctamente").
- [x] 5.2 Confirmado por el usuario: intentar crear un tercero con un número de
      identificación ya existente autocompleta el formulario, cambia a modo edición,
      muestra el aviso, y al guardar actualiza (no duplica) el tercero.
