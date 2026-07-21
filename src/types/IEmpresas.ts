export interface IEmpresas {
    idEmpresa: number; // Hecho
    idTipoDocumentoId: number; // Hecho
    nombreTipoDocumentoId: string | null; // Hecho
    nitEmpresa: string; // Hecho
    digitoVerificacion: string | null; // Hecho
    nombreEmpresa: string; // Hecho
    nombreComercial: string | null;  // Hecho
    idTipoPersona: number; // Hecho
    nombreTipoPersona: string | null; // Hecho
    idResponsabilidadFiscal: string | null; // TABLA - Hecho
    idResponsabilidadFiscal2: string | null; // TABLA -Hecho
    idResponsabilidadFiscal3: string | null; // TABLA - Hecho
    monedaEmpresa: string | null; // Hecho
    idTipoRegimen: number; // Hecho
    nombreTipoRegimen: string | null; // Lo trae
    registroMercantil: string | null; // Hecho
    direccionEmpresa: string | null; //Hecho
    telefonoEmpresa: string | null; // Hecho
    idDepartamento: number;       //  Hecho                             
    nombreDepartamento: string | null; // Lo trae
    idMunicipio: number;        // Hecho
    nombreMunicipio: string | null; // Lo trae
    emailEmpresa: string | null;    // Hecho    
    notaFe1: string | null; // TABLA - Hecho
    notaFe2: string | null; // TABLA - Hecho
    idTipoAsignacionResolucion: number | null; // IMPUESTOS Hecho
    habilitacionFacturacion: boolean; // IMPUESTOS Hecho
    responsableIva: boolean; // IMPUESTOS Hecho
    granContribuyente: boolean; // IMPUESTOS Hecho
    autoretenedor: boolean; // IMPUESTOS Hecho
    responsableImpoConsumo: boolean; // IMPUESTOS Hecho
    agenteRetenedorIva: boolean; // IMPUESTOS Hecho
    agenteRetenedorRenta: boolean; // IMPUESTOS Hecho
    idRepresentanteLegal: string | null; // Hecho
    correoElectronicoRepresentante: string | null; // Hecho
    tarifaReteIca: number | null; // IMPUESTOS Hecho
    tarifaReteIva: number | null; // IMPUESTOS Hecho
    actividadEconomica: string | null; // IMPUESTOS Hecho
    ambienteDian: number | null; // IMPUESTOS
    fechaGrabacionEmpresa: string | Date | null; // Hecho
    notaFe3: string | null; // TABLA - Hecho
    idMedioPagoContado: number; // Hecho
    nombreMedioPagoContado: string | null; // Lo trae
    idMedioPagoCredito: number; // Hecho
    nombreMedioPagoCredito: string | null; // Lo trae
}