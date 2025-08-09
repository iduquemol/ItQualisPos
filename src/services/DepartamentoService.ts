import { API_CONFIG } from "@/config/api.config";
import { IDepartamento } from "@/types/IDepartamento";

export const DepartamentoService = {
    async getAll(): Promise<IDepartamento[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DEPARTAMENTOS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar departamentos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DepartamentoService.getAll:', error);
            throw error;
        }
    }
};