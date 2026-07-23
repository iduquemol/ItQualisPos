export interface IParametrosVentas {
  idParametroVenta?: number;
  idTerceroDefault?: number | null;
  idTipoDocumentoDefault?: number | null;
  idTipoNotaCreditoDefault?: number | null;
  idTipoCotizacionDefault?: number | null;
  idListaPrecioDefault?: number | null;
  idTipoRegimenClienteDefault?: number | null;
  diasAceptacionTacita?: number;
  ambienteEnvioDian?: number;
  idEnvironment?: string;
  pinEnvironment?: string;
  nombreFabricante?: string;
  nombreSoftware?: string;
  valorUVT?: number;
  aplicaTopeReteIva?: boolean;
  aplicaTopeReteRenta?: boolean;
  aplicaTopeRetelca?: boolean;
}