import { ITipoTrabajadorNominaDian } from "@/types/ITipoTrabajadorNominaDian";
import { API_CONFIG } from "@/config/api.config";

export const TipoTrabajadorNominaDianService = {
    async getAll(): Promise<ITipoTrabajadorNominaDian[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_TIPOS_TRABAJADOR_NOMINA_DIAN), 
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los tipos de trabajador de nómina DIAN');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoTrabajadorNominaDianService.getAll:', error);
            throw error;
        }
    }
};