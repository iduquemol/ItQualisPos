export interface IVentaMedioPago {
    idMedioPagoVenta: number;
    idVenta?: number | null;
    idMedioPago?: number | null;
    valorMedioPago?: number | null;
    fechaGrabacionMedioPagoVenta?: string | null;
    idTipoDocumento?: number | null;
    idTipoDocumentoExterno?: number | null;
}