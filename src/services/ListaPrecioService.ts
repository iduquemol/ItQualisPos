import { API_CONFIG } from "@/config/api.config";
import { IListaPrecio } from "@/types/IListaPrecio";

export const ListaPrecioService = {
    async getAll(): Promise<IListaPrecio[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LISTAS_PRECIOS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar la lista de precios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ListaPrecioService.getAll:', error);
            throw error;
        }
    },

    async create(listaPrecio: IListaPrecio): Promise<{ message: string; idListaPrecio: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LISTAS_PRECIOS),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(listaPrecio)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear la lista de precios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ListaPrecioService.create:', error);
            throw error;
        }
    },

    async update(listaPrecio: IListaPrecio): Promise<{ message: string; idListaPrecio: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LISTAS_PRECIOS),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(listaPrecio)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar la lista de precios');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ListaPrecioService.update:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.LISTAS_PRECIOS)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar la lista de precios');
            }
        } catch (error) {
            console.error('Error en ListaPrecioService.delete:', error);
            throw error;
        }
    }
};