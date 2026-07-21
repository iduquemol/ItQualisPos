import { IResoluciones } from "@/types/IResoluciones";
import { API_CONFIG } from "@/config/api.config";
    
export const ResolucionesService = {
    async getAll(): Promise<IResoluciones[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESOLUCIONES),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar resoluciones');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ResolucionesService.getAll:', error);
            throw error;
        }
    },

    async create(resoluciones: IResoluciones): Promise<IResoluciones> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESOLUCIONES),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(resoluciones)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear resolución');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ResolucionesService.create:', error);
            throw error;
        }
    },

    async update(resoluciones: IResoluciones): Promise<IResoluciones> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESOLUCIONES),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(resoluciones)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar resolución');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ResolucionesService.update:', error);
            throw error;
        }
    },

    async delete(idResolucion: number): Promise<void> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.RESOLUCIONES),
                {
                    method: "DELETE",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idResolucion })
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar resolución');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ResolucionesService.delete:', error);
            throw error;
        }
    },                        

};