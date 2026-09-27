import { INotaCreditoDetalle } from "./INotaCreditoDetalle";

export interface INotaCredito {
  idNotaCredito: number | null;
  idTipoDocumento: number;
  numeroNotaCredito: number | null;
  prefijoNotaCredito: string | null;
  idTerceroNotaCredito: number;
  fechaNotaCredito: string | null;
  idPuntoVenta?: number | null;
  idUsuario: number | null;
  idVenta: number | null;
  idConceptoCorreccionNota: number | null;
  observaciones?: string | null;
  totalRegistros: number | null;
  cantidadProductos: number | null;
  totalPrecio: number | null;
  totalDescuento: number | null;
  totalBaseIva: number | null;
  totalIva: number | null;
  totalNotaCredito?: number | null; 
  totalVenta?: number | null;       
  idConceptoCorreccionDian?: number | null;
  cufe?: string | null;
  firmaDigital?: string | null;
  fechaHoraAutorizacion?: string | null;
  idResponseDian?: number | null;
  fechaGrabacionNotaCredito?: string | null;
  totalBaseRetelva?: number | null;
  totalRetelva?: number | null;
  totalBaseReteRenta?: number | null;
  totalReteRenta?: number | null;
  totalBaseRetelca?: number | null;
  totalRetelca?: number | null;
  idTipoOperacionDian?: number | null;
  idResolucion?: number | null;
  idFormaPago?: number | null;
  plazoDias?: number | null;
  fechaVencimiento?: string | null;
  idTipoDocumentoExterno?: number | null;
  detalleNotaCredito: INotaCreditoDetalle[] | null;

  codigoDocumento?: string | null;
  nombreDocumento?: string | null;
  conceptoNotaCredito?: number | null;
  numeroIdentificacionTerceroNotaCredito?: string | null;
  nombreTerceroNotaCredito?: string | null;
}