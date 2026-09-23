export interface IVentaTercero {
    idTercero: number;
    idTipoDocumentoId: number;
    digitoVerificacion?: string | null;
    numeroIdentificacion: string;
    primerNombre: string;
    primerApellido: string;
    razonSocial: string;
    emailTercero?: string | null;    
    terceroGeneral?: boolean | null;
}