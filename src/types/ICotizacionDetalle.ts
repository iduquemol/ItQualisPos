export interface ICotizacionDetalle {
    idDetalleCotizacion: number;
    registroCotizacion: number;
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    cantidadCotizacion: number;    
    precioUnitarioCotizacion: number;
    porcentajeIvaCotizacion: number;
    ivaCotizacion: number;
    porcentajeDescuentoCotizacion: number;
    descuentoCotizacion: number;
    totalCotizacion: number;
    costoUnitarioCotizacion: number;
    costoTotalCotizacion: number;    
}