import { API_CONFIG } from "@/config/api.config";
import { ITipoRegimen } from "@/types/ITipoRegimen";

export const TipoRegimenService = {
    async getAll(): Promise<ITipoRegimen[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPOS_REGIMEN),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de regimen');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoRegimenService.getAll:', error);
            throw error;
        }
    }
};