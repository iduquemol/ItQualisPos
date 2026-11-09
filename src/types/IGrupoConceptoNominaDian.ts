export interface IGrupoConceptoNominaDian {
    idGrupoConcepto: number;
    nombreGrupoConcepto: string | null;
    idNaturaleza: number;
    reportarDian: boolean | null;
    fechaGrabacionGrupoConcepto?: string | null;
}