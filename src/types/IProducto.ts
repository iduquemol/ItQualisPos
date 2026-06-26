import { IPrecioProducto } from "./IPrecioProducto";
import { ITributoProducto } from "./ITributoProducto";

export interface IProducto {
    idProducto: number | null;
    codigoProducto: string;
    nombreProducto: string;
    imagenProducto: string | null;
    codigoBarras: string | null;
    idCategoria: number;
    idUnidadMedida: number;
    precioUnitario: number;
    precioPos: number;
    porcentajeIva: number | null;
    porcentajeImpoConsumo: number | null;
    porcentajeReteIva: number | null;
    porcentajeReteRenta: number | null;
    porcentajeReteIca: number | null;
    quantity: number;  
    idTipoProducto: number; // ID of the product type
    productoActivo: boolean; // Indicates if the product is active
    porcentajeDescuento: number | null; // Percentage discount applied to the product
    codigoItemSector: boolean | null; 
    idTerceroMandato: number | null; // ID of the third-party mandate
    preciosProducto: IPrecioProducto[]; // Array of IPrecioProducto
    tributosProducto: ITributoProducto[]; // Array of ITributo  
}