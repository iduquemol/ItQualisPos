export interface ITipoDocumento {
    idTipoDocumento: number;
    codigoDocumento: string;
    nombreDocumento: string;
    idTipoDocumentoE: number | null;
    idFormaPago: number | null;
    nombreFormaPago: string;
    idMetodoDian: number | null;
    nombreMetodo: string;
}