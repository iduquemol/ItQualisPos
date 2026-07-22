export interface ITipoDocumentoExterno {
  idTipoDocumentoExterno: number | null;
  codigoTipoDocumentoExterno: string | null;
  nombreTipoDocumentoExterno: string | null;
  idTipoDocumento: number;
  
  // Campos opcionales (notas FE)
  notaFe1Externo: string | null;
  notaFe2Externo: string | null;
  notaFe3Externo: string | null;
  notaFe4Externo: string | null;
  notaFe5Externo: string | null;
  
  fechaGrabacionDocumentoExterno: string | null;
}