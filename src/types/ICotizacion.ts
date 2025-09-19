import { ICotizacionDetalle } from "./ICotizacionDetalle";
import { IVentaTercero } from "./IVentaTercero";

export interface ICotizacion {
    idCotizacion: number | null;
    idTipoDocumento: number;
    codigoDocumento: string;
    nombreDocumento: string | null;
    numeroCotizacion: number | null;
    prefijoCotizacion: string | null;
    fechaCotizacion: string | null;
    idUsuario: number | null;
    totalRegistros: number | null;
    cantidadProductos: number | null;
    totalPrecio: number | null;
    totalDescuento: number | null;
    totalBaseIva: number | null;
    totalIva: number | null;
    totalCotizacion: number | null;
    terceroCotizacion: IVentaTercero | null;
    detalleCotizacion: ICotizacionDetalle[] | null;    
}