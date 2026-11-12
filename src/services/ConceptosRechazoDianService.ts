import { API_CONFIG } from "@/config/api.config";
import { IConceptosRechazoDian } from "@/types/IConceptosRechazoDian";

export const ConceptosRechazoDianService = {
    async getAll(): Promise<IConceptosRechazoDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONCEPTOS_RECHAZO_DIAN),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar conceptos de rechazo de la DIAN');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ConceptosRechazoDianService.getAll:', error);
            throw error;
        }
    }
}
