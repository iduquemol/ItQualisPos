export interface IResponseCotizacion {
    message: string | null;
    idCotizacion: number;
    idFactura?: number; // some endpoints may return the generated factura id
}