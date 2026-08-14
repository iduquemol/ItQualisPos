import { ITercero, ITerceroResponse } from "@/types/ITercero";
import { API_CONFIG } from "@/config/api.config";
import { ITerceroProveedor } from "@/types/ITerceroProveedor";
import { IConsultaTerceroExterna } from "@/types/IConsultaTerceroExterna";

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

    async create(tercero: ITercero): Promise<ITerceroResponse> {
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

            const data: ITerceroResponse = await response.json();

            // Si la respuesta no es OK (ej. status 400), lanzamos el mensaje del backend
            if (!response.ok) {
                throw new Error(data.mensaje || 'Error al crear tercero');
            }

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
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.SUPPLIERS)}/${id}`,                
                {
                    method: "DELETE",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin'                    
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar tercero');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.delete:', error);
            throw error;
        }
    },   
    
    async search(query: string): Promise<ITercero[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TERCEROS_BUSQUEDA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ query })
                }
            );
            if (!response.ok) {
                throw new Error('Error al buscar terceros');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.search:', error);
            throw error;
        }
    },

    async consultarDatosExternos(codigoTipoDocumentoId: string, identificationNumber: string): Promise<IConsultaTerceroExterna> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TERCEROS_CONSULTA_EXTERNA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ codigoTipoDocumentoId, identificationNumber })
                }
            );
            if (!response.ok) {
                throw new Error('Error al consultar datos externos del tercero');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.consultarDatosExternos:', error);
            throw error;
        }
    },

    async getTercerosProveedores(): Promise<ITerceroProveedor[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TERCEROS_PROVEEDORES),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar terceros proveedores');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TerceroService.getTercerosProveedores:', error);
            throw error;
        }
    },
    
    

};