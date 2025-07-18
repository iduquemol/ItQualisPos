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
    stockActualProducto: number;
    costoPromedioActualProducto: number | null;
    quantity: number;  
    idTipoProducto: number; // ID of the product type
    productoActivo: boolean; // Indicates if the product is active
    porcentajeDescuento: number | null; // Percentage discount applied to the product
    preciosProducto: IPrecioProducto[]; // Array of IPrecioProducto
    tributosProducto: ITributoProducto[]; // Array of ITributo  
}