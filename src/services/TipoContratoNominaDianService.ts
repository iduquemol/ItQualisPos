import { ITipoContratoNominaDian } from "@/types/ITipoContratoNominaDian";
import { API_CONFIG } from "@/config/api.config";

export const TipoContratoNominaDianService = {
    async getAll(): Promise<ITipoContratoNominaDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_TIPOS_CONTRATO_NOMINA_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los tipos de contrato de nómina DIAN');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoContratoNominaDianService.getAll:', error);
            throw error;
        }
    }
};