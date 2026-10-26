export interface IAlmacen {
  idAlmacen: number;
  codigoAlmacen: string;
  nombreAlmacen: string;
  idSucursal: number;
  direccionAlmacen?: string | null;
  idTerceroResponsable?: number | null;
  fechaGrabacionAlmacen?: string | null;
  nombreSucursal?: string | null;
  razonSocial?: string | null;
}