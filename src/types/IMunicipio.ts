export interface IMunicipiosPorDepartamento {
    idDepartamento: number;
    codigoDepartamento: string;
    nombreDepartamento: string;
    municipios: {
        idMunicipio: number;
        codigoMunicipio: string;
        nombreMunicipio: string;
        idMunicipioFe: number;
    }[];
}
    