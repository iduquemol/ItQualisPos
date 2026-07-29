import { IActividadesIca } from "@/types/IActividadesIca";
import { API_CONFIG } from "@/config/api.config";

export const ActividadesIcaService = {
    async getAll(): Promise<IActividadesIca[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ACTIVIDADES_ICA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar actividades ICA');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ActividadIcaService.getAll:', error);
            throw error;
        }
    },

    async create(actividad: IActividadesIca): Promise<{ message: string; idActividadIca: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ACTIVIDADES_ICA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(actividad)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear actividad ICA');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ActividadIcaService.create:', error);
            throw error;
        }
    },

    async update(actividad: IActividadesIca): Promise<{ message: string; idActividadIca: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ACTIVIDADES_ICA),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(actividad)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar actividad ICA');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ActividadIcaService.update:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ACTIVIDADES_ICA)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar actividad ICA');
            }
        } catch (error) {
            console.error('Error en ActividadIcaService.delete:', error);
            throw error;
        }
    }
};