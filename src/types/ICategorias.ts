import { ITributoCategoria } from "./ITributoCategoria";

export interface ICategorias {
  idCategoria?: number | null;
  codigoCategoria: string;
  nombreCategoria: string;
  iconoCategoria?: string;
  categoriaActiva?: boolean;
  fechaGrabacionCategoria?: string | Date | null;
  tributosCategoria?: ITributoCategoria[];
}