import { INotaCreditoDetalle } from "./INotaCreditoDetalle";

export interface INotaCredito {
    idNotaCredito: number | null;
    idTipoDocumento: number;
    codigoDocumento: string;
    nombreDocumento: string | null;    
    numeroNotaCredito: number | null;
    prefijoNotaCredito: string | null;
    conceptoNotaCredito: number | null;
    fechaNotaCredito: string | null;    
    idUsuario: number | null;
    totalRegistros: number | null;
    cantidadProductos: number | null;
    totalPrecio: number | null;
    totalDescuento: number | null;
    totalBaseIva: number | null;
    totalIva: number | null;
    totalVenta: number | null;
    idTerceroNotaCredito: number | null;
    numeroIdentificacionTerceroNotaCredito: string | null;
    nombreTerceroNotaCredito: string | null;
    idVenta: number | null;
    idConceptoCorreccionNota: number | null;
    detalleNotaCredito: INotaCreditoDetalle[] | null;    
}