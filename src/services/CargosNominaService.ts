import { API_CONFIG } from "@/config/api.config";
import { ICargosNomina } from "@/types/ICargosNomina";

export const CargosNominaService = {
    async getAll(): Promise<ICargosNomina[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CARGOS_NOMINA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar cargos de nómina');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CargosNominaService.getAll:', error);
            throw error;
        }
    }
}
