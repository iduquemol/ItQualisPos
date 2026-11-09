export interface ICotizacionDetalle {
    idDetalleCotizacion: number | null;
    idCotizacion: number;
    registroCotizacion: number;
    idProducto?: number | null;
    cantidadCotizacion?: number | null;
    precioUnitarioCotizacion?: number | null;
    precioTotalCotizacion?: number | null;
    porcentajeDescuentoCotizacion?: number | null;
    descuentoCotizacion?: number | null;
    porcentajeImpoConsumo?: number | null;
    impoConsumoCotizacion?: number | null;
    baseIvaCotizacion?: number | null;
    porcentajeIvaCotizacion?: number | null;
    ivaCotizacion?: number | null;
    totalCotizacion?: number | null;
    costoUnitarioCotizacion?: number | null;
    costoTotalCotizacion?: number | null;
    fechaGrabacionDetalleCotizacion?: string | null;
    
    porcentajeReteIva?: number | null;
    baseReteIvaCotizacion?: number | null;
    reteIvaCotizacion?: number | null;
    porcentajeReteRenta?: number | null;
    baseReteRenta?: number | null;
    reteRentaCotizacion?: number | null;
    porcentajeReteIca?: number | null;
    baseReteIcaCotizacion?: number | null;
    reteIcaCotizacion?: number | null;

    nombreProducto?: string | null;
    idTerceroMandato?: number | null;
    idItemSector?: number | null;
    indicadorMuestra?: boolean | null;
    valorReferenciaUnidad?: number | null;
    valorReferenciaTotal?: number | null;
    
    codigoProducto?: string | null;
    idTipoProducto?: number | null;
}