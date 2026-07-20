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
    
    // Inventario y costos
    stockActualProducto: number | null;
    costoPromedioActualProducto: number | null;

    // Porcentajes e Impuestos
    porcentajeIva: number | null;
    porcentajeImpoConsumo: number | null;
    porcentajeReteIva: number | null;
    porcentajeReteRenta: number | null;
    porcentajeReteIca: number | null;
    porcentajeMaxDescuento: number | null; // Corregido aquí

    quantity: number;
    idTipoProducto: number; // ID of the product type
    productoActivo: boolean; // Indicates if the product is active
    
    // Tercero Mandato y Sector
    idItemSector: number | null; // Corregido a number para manejar el ID del sector
    idTerceroMandato: number | null; // ID of the third-party mandate
    indicadorMandato: boolean; 
    
    // Arrays / Relaciones
    preciosProducto: IPrecioProducto[]; // Array of IPrecioProducto
    tributosProducto: ITributoProducto[]; // Array of ITributo
}