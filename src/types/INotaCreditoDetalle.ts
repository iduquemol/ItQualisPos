export interface INotaCreditoDetalle {
    idDetalleNotaCredito: number;
    registroNotaCredito: number;
    idDetalleVenta: number;
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    cantidadNotaCredito: number;
    cantidadFactura: number;
    precioUnitarioNotaCredito: number;
    precioUnitarioFactura: number;
    porcentajeIvaNotaCredito: number;
    porcentajeIvaFactura: number;
    ivaNotaCredito: number;
    ivaFactura: number;
    porcentajeDescuentoNotaCredito: number;
    porcentajeDescuentoFactura: number;
    descuentoNotaCredito: number;
    descuentoFactura: number;
    totalNotaCredito: number;
    totalFactura: number;
    costoUnitarioNotaCredito: number;
    costoUnitarioFactura: number;
    costoTotalNotaCredito: number;    
    costoTotalFactura: number;
}