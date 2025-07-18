    import { API_CONFIG } from "@/config/api.config";
import { IMunicipio } from "@/types/IMunicipio";

export const MunicipioService = {
    async getAll(): Promise<IMunicipio[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.MUNICIPIOS),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar municipios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en MunicipioService.getAll:', error);
            throw error;
        }
    }
};