import { ITributo } from "@/types/ITributo";
import { API_CONFIG } from "@/config/api.config";
import { IActividadesCiiu } from "@/types/IActividadesCiiu";

export const ActividadesCiiuService = {
    async getAll(): Promise<IActividadesCiiu[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_ACTIVIDADES_CIIU),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener actividades CIIU');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ActividadesCiiuService.getAll:', error);
            throw error;
        }
    }
};