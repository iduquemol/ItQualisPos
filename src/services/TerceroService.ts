import { ITercero } from "@/types/ITercero";
import { API_CONFIG } from "@/config/api.config";

export const TerceroService = {
    async getAll(): Promise<ITercero[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUPPLIERS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar terceros');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.getAll:', error);
            throw error;
        }
    },

    async create(tercero: ITercero): Promise<ITercero> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUPPLIERS),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(tercero)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear tercero');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.create:', error);
            throw error;
        }
    },

    async update(tercero: ITercero): Promise<ITercero> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUPPLIERS),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(tercero)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar tercero');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.update:', error);
            throw error;
        }
    }
};