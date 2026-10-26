import { IAlmacen } from "@/types/IAlmacen";
import { API_CONFIG } from "@/config/api.config";

export const AlmacenesService = {
    async getAll(): Promise<IAlmacen[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ALMACENES),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar almacenes');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en AlmacenesService.getAll:', error);
            throw error;
        }
    },

    async create(almacen: IAlmacen): Promise<{ error: boolean; idAlmacen: number; mensaje: string }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ALMACENES),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(almacen)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear almacén');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en AlmacenesService.create:', error);
            throw error;
        }
    },

    async update(almacen: IAlmacen): Promise<{ error: boolean; idAlmacen: number; mensaje: string }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ALMACENES),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(almacen)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar almacén');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en AlmacenesService.update:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<{ error: boolean; idAlmacen: number; mensaje: string }> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ALMACENES)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar almacén');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en AlmacenesService.delete:', error);
            throw error;
        }
    }
};