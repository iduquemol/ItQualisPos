import { IUnidadDeMedida } from "@/types/IUnidadDeMedida";
import { API_CONFIG } from "@/config/api.config";

export const UnidadDeMedidaService = {
    async getAll(): Promise<IUnidadDeMedida[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.UNIDADES_DE_MEDIDA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar unidades de medida');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en UnidadDeMedidaService.getAll:', error);
            throw error;
        }
    },

    async create(actividad: IUnidadDeMedida): Promise<{ message: string; idUnidadMedida: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.UNIDADES_DE_MEDIDA),
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
                throw new Error('Error al crear unidad de medida');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en UnidadDeMedidaService.create:', error);
            throw error;
        }
    },

    async update(actividad: IUnidadDeMedida): Promise<{ message: string; idUnidadMedida: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.UNIDADES_DE_MEDIDA),
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
                throw new Error('Error al actualizar unidad de medida');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en UnidadDeMedidaService.update:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.UNIDADES_DE_MEDIDA)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar unidad de medida');
            }
        } catch (error) {
            console.error('Error en UnidadDeMedidaService.delete:', error);
            throw error;
        }
    }
};