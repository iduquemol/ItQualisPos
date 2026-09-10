export interface ITipoDocumento {
    idTipoDocumento: number;
    codigoDocumento?: string | null;
    nombreDocumento?: string | null;
    idTipoDocumentoE?: number | null;
    nombreDocumentoE?: string | null;
    idFormaPago?: number | null;
    nombreFormaPago?: string | null;
    idMetodoDian?: number | null;
    nombreMetodo?: string | null;
    documentoVenta?: boolean | null;
    documentoNotaCredito?: boolean | null;
    ordenTipoDocumento?: number | null;
    tipoDocumentoActivo?: boolean | null;
    documentoRemision?: boolean | null;
    documentoCotizacion?: boolean | null;
    idTipoDocumentoNC?: number | null;
    idTipoDocumentoCotiza?: number | null;
    idTipoDocumentoND?: number | null;
    idConsecutivoHabilitacion?: number | null;
    idTipoDocumentoExterno: number;
    nombreTipoDocumentoExterno?: string | null;
    codigoTipoDocumentoExterno?: string | null;
}