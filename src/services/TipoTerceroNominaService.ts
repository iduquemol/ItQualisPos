import { ITipoTerceroNomina } from "@/types/ITipoTerceroNomina";
import { API_CONFIG } from "@/config/api.config";

export const TipoTerceroNominaService = {
    async getAll(): Promise<ITipoTerceroNomina[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_TIPOS_TERCERO_NOMINA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los tipos de tercero de nómina');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoTerceroNominaService.getAll:', error);
            throw error;
        }
    }
};