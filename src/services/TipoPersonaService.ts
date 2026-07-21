import { API_CONFIG } from "@/config/api.config";
import { ITipoPersona } from "@/types/ITipoPersona";
    
export const TipoPersonaService = {
    async getAll(): Promise<ITipoPersona[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPO_PERSONA),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar tipos de personas');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoPersonaService.getAll:', error);
            throw error;
        }
    },

    async create(tipoPersona: ITipoPersona): Promise<ITipoPersona> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPO_PERSONA),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(tipoPersona)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear tipo persona');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoPersonaService.create:', error);
            throw error;
        }
    },

    async update(tipoPersona: ITipoPersona): Promise<ITipoPersona> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPO_PERSONA),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(tipoPersona)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar tipo persona');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoPersonaService.update:', error);
            throw error;
        }
    },

    async delete(idTipoPersona: number): Promise<void> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.TIPO_PERSONA),
                {
                    method: "DELETE",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idTipoPersona })
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar tipo persona');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en TipoPersonaService.delete:', error);
            throw error;
        }
    },                        

};