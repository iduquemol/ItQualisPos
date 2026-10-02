import { IPrecioProducto } from "./IPrecioProducto";
import { ITributoProducto } from "./ITributoProducto";

export interface IProducto {
    idProducto: number;
    codigoProducto: string;
    nombreProducto: string;
    imagenProducto?: string | null;
    codigoBarras?: string | null;
    idCategoria: number;
    idUnidadMedida: number;
    precioUnitario?: number | null;
    stockActualProducto?: number | null;
    costoPromedioActualProducto?: number | null;
    productoActivo?: boolean | null; 
    precioPos?: number | null; 

    porcentajeIva?: number | null;
    porcentajeImpoConsumo?: number | null;
    porcentajeReteIva?: number | null;
    idTipoProducto: number; 
    porcentajeReteRenta?: number | null;
    porcentajeReteIca?: number | null;
    porcentajeMaxDescuento?: number | null; 

    quantity: number;
    
    fechaGrabacionProducto?: string | null; 
    idItemSector?: number | null; 
    idTerceroMandato?: number | null; 
    indicadorMandato?: boolean | null; 
    itemVenta?: boolean | null;
    itemCompra?: boolean | null;
    
    preciosProducto: IPrecioProducto[]; 
    tributosProducto: ITributoProducto[]; 
}