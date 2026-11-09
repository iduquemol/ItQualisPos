import { ITerceroDefault } from "./ITerceroDefault";
import { ITipoDocumentoDefault } from "./ITipoDocumentoDefault";

export interface IParametrosVentaDefault {
    terceroVenta: ITerceroDefault[];
    documentoVenta: ITipoDocumentoDefault[];
    documentoNotaCredito: ITipoDocumentoDefault[];
    documentoNotaDebito?: ITipoDocumentoDefault[];
    documentoCotizacion: ITipoDocumentoDefault[];
}