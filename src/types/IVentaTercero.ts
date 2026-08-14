export interface IVentaTercero {
    idTercero: number | null;
    idTipoDocumentoId: number;
    digitoVerificacion: string | null;
    numeroIdentificacion: string | null;
    primerNombre: string | null;
    primerApellido: string | null;
    razonSocial: string | null;
    telefonoTercero: string | null;
    direccionTercero: string | null;
    idMunicipio?: number | null;
    emailTercero: string | null;    
    idTipoPersona?: number | null; 
    terceroGeneral?: boolean | null;
}