## ADDED Requirements

### Requirement: El backend actúa como proxy hacia el proveedor externo de facturación electrónica
El frontend SHALL consultar únicamente un endpoint propio del backend (`ApiAstilPos`)
para obtener los datos del tercero desde el proveedor externo; el frontend SHALL NUNCA
llamar directamente a la URL del proveedor externo.

#### Scenario: El backend consulta el proveedor externo por el frontend
- **WHEN** el frontend solicita el endpoint propio de consulta externa con un tipo y
  número de identificación
- **THEN** el backend arma y envía el request hacia
  `POST https://iqsas.apifacturacionelectronica.com/api/ubl2.1/status/acquirer` y
  devuelve al frontend la información relevante (`name`, `email`, `message`)

### Requirement: Autocompletar nombre y correo desde el proveedor externo
Cuando el usuario digita el número de identificación en el formulario de creación de
terceros y ese número no corresponde a un tercero ya existente localmente, el sistema
SHALL consultar el proveedor externo de facturación electrónica y autocompletar
`razonSocial` y `emailTercero` con los datos retornados.

#### Scenario: El proveedor externo encuentra el documento
- **WHEN** el número de identificación no corresponde a un tercero local existente, y
  el proveedor externo retorna `name` y `email` para ese documento
- **THEN** el campo "Razón Social" se autocompleta con `name` y el campo "Email" se
  autocompleta con `email`, sobrescribiendo cualquier valor digitado manualmente antes

#### Scenario: El proveedor externo no encuentra el documento o falla
- **WHEN** el proveedor externo no responde, responde con error, o no encuentra datos
  para el número de identificación digitado
- **THEN** el formulario permanece utilizable y el usuario puede seguir digitando
  manualmente "Razón Social" y "Email" sin que la creación del tercero se bloquee

#### Scenario: No se dispara la consulta externa si el tercero ya existe localmente
- **WHEN** la validación de duplicidad local (`suppliers-validate-existing-tercero`)
  detecta que el número de identificación ya corresponde a un tercero existente
- **THEN** el sistema NO consulta el proveedor externo, para no sobrescribir los
  datos ya guardados de ese tercero

#### Scenario: No se repite la consulta para el mismo número de identificación
- **WHEN** el campo de número de identificación pierde el foco nuevamente sin que su
  valor haya cambiado desde la última consulta externa (exitosa o fallida)
- **THEN** el sistema no repite la llamada al proveedor externo
