import { IVentaDetalle } from "./IVentaDetalle";
import { IVentaMedioPago } from "./IVentaMedioPago";
import { IVentaTercero } from "./IVentaTercero";

export interface IVenta {
    idVenta: number | null;
    idTipoDocumento: number;
    codigoDocumento: string;
    nombreDocumento: string | null;
    idMetodoDian: number | null;
    idFormaPago: number | null;
    numeroVenta: number | null;
    prefijoVenta: string | null;
    fechaVenta: string | null;
    idPuntoVenta: number | null;
    idUsuario: number | null;
    totalRegistros: number | null;
    cantidadProductos: number | null;
    totalPrecio: number | null;
    totalDescuento: number | null;
    totalBaseIva: number | null;
    totalIva: number | null;
    totalVenta: number | null;
    terceroVenta: IVentaTercero | null;
    detalleVenta: IVentaDetalle[] | null;
    mediosPagoVenta: IVentaMedioPago[] | null;
}