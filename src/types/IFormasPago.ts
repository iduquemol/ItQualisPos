export interface IFormasPago {
  idFormaPago: number;
  codigoFormaPago: string;
  nombreFormaPago: string;
  idMedioPagoDefault?: number | null;
  idFormaPagoExterna?: string | null;
  fechaGrabacionFormaPago?: string | null;
}