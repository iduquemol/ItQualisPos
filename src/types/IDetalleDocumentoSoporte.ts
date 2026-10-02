export interface IDetalleDocumentoSoporte {
    idDetalleDsa: number;
    idDsa: number;
    registroDsa: number;
    idProducto: number;
    codigoProducto?: string | null;
    cantidadDsa?: number | null;
    precioUnitarioDsa?: number | null;
    precioTotalDsa?: number | null;
    porcentajeDescuentoDsa?: number | null;
    descuentoDsa?: number | null;
    totalDsa?: number | null;
    costoUnitarioDsa?: number | null;
    costoTotalDsa?: number | null;
    porcentajeReteRenta?: number | null;
    baseReteRenta?: number | null;
    reteRentaDsa?: number | null;
    porcentajeReteIca?: number | null;
    baseReteIca?: number | null;
    reteIcaDsa?: number | null;
    nombreProducto?: string | null;
    fechaGrabacionDetalleDsa?: string | null;
}