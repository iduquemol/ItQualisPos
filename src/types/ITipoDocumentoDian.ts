export interface ITipoDocumentoDian {
  idTipoDocumentoE: number;
  codigoDocumentoE: string;
  nombreDocumentoE: string;
  observacionDocumentoE?: string | null;
  admiteEventosDian?: boolean | null;
  idTipoDocumentoFe?: number | null;
  idMetodoDian?: number | null;
  fechaGrabacionTipoDocumentoE?: string | null;
}