import { IParametroNomina } from "@/types/IParametroNomina";
import { API_CONFIG } from "@/config/api.config";

export const ParametroNominaService = {
    async getAll(idParametroNomina?: number): Promise<IParametroNomina[]> {
        try {
            let url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_PARAMETROS_NOMINA);
            if (idParametroNomina) {
                url += `?idParametroNomina=${idParametroNomina}`;
            }

            const response = await fetch(
                url,
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los parámetros de nómina');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ParametroNominaService.getAll:', error);
            throw error;
        }
    }
};