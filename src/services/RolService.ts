import { API_CONFIG } from '@/config/api.config';
import { IRoles } from '@/types/IRoles';

export const RolService = {
    async getAll(): Promise<IRoles[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ROLES),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener roles');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en RolService.getAll:', error);
            throw error;
        }
    }
};

