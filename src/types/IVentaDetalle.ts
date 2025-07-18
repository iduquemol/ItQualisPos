export interface IVentaDetalle {
    idDetalleVenta: number;
    registroVenta: number;
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    cantidadVenta: number;
    precioUnitarioVenta: number;
    porcentajeIvaVenta: number;
    ivaVenta: number;
    porcentajeDescuentoVenta: number;
    descuentoVenta: number;
    totalVenta: number;
    costoUnitarioVenta: number;
    costoTotalVenta: number;    
}