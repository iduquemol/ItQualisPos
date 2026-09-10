export interface IResoluciones {
    idResolucion: number;
    numeroResolucion?: string | null;
    nombreResolucion?: string | null;
    claveTecnica?: string | null;
    fechaAutorizacion?: string | Date | null;
    vigenciaMeses?: number | null;
    fechaInicial?: string | Date | null;
    fechaVencimiento?: string | Date | null;
    prefijoResolucion?: string | null;
    numeroInicialResolucion: number;
    numeroFinalResolucion: number;
    numeroActual?: number | null;
    resolucionActiva?: boolean | null;
    idTipoDocumentoDian: number;
    nombreDocumentoE?: string | null;
}