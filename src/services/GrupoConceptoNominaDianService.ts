import { IGrupoConceptoNominaDian } from "@/types/IGrupoConceptoNominaDian";
import { API_CONFIG } from "@/config/api.config";

export const GrupoConceptoNominaDianService = {
    async getAll(): Promise<IGrupoConceptoNominaDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_GRUPOS_CONCEPTO_NOMINA_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los grupos de concepto de nómina DIAN');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en GrupoConceptoNominaDianService.getAll:', error);
            throw error;
        }
    }
};