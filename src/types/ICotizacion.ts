import { ICotizacionDetalle } from "./ICotizacionDetalle";
import { ICotizacionTercero } from "./ICotizacionTercero";

export interface ICotizacion {
    idCotizacion: number | null;
    idTipoDocumento: number;
    idTipoDocumentoExterno?: number | null;
    codigoDocumento: string;
    nombreDocumento?: string | null;
    numeroCotizacion: number;
    prefijoCotizacion?: string | null;
    idTerceroCotizacion?: number | null;
    fechaCotizacion: string;
    fechaVencimiento?: string | null;
    esBorrador: boolean;
    idUsuario?: number | null;
    totalRegistros?: number | null;
    cantidadProductos?: number | null;
    totalPrecio?: number | null;
    totalDescuento?: number | null;
    totalBaseIva?: number | null;
    totalIva?: number | null;
    totalCotizacion?: number | null;

    totalBaseReteIva?: number | null;
    totalReteIva?: number | null;
    totalBaseReteRenta?: number | null;
    totalReteRenta?: number | null;
    totalBaseReteIca?: number | null;
    totalReteIca?: number | null;

    fechaGrabacionCotizacion?: string | null;

    observaciones?: string | null;
    ordenReferencia?: string | null;
    fechaOrdenReferencia?: string | null;

    terceroCotizacion?: ICotizacionTercero | null;
    detalleCotizacion: ICotizacionDetalle[];
}