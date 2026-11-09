import { ITributo } from "@/types/ITributo";
import { API_CONFIG } from "@/config/api.config";
import { ICotizacion } from "@/types/ICotizacion";
import { IResponseCotizacion } from "@/types/IResponseCotizacion";

export const CotizacionService = {
    async getAll(): Promise<ICotizacion[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CONSULTAR_COTIZACION),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener cotizaciones');
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CotizacionService.getAll:', error);
            throw error;
        }
    },

    async getById(idCotizacion: number): Promise<ICotizacion | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.OBTENER_COTIZACION),
                {
                    method: "post",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idCotizacion: idCotizacion })
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar cotización por ID');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CotizacionService.getById:', error);
            throw error;
        }
    },

    async create(cotizacion: ICotizacion): Promise<IResponseCotizacion> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.COTIZACION),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(cotizacion)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear cotización');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CotizacionService.create:', error);
            throw error;
        }
    },

    async update(cotizacion: ICotizacion): Promise<IResponseCotizacion> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ACTUALIZAR_COTIZACION), 
                {
                    method: "POST", 
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(cotizacion)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar cotización');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CotizacionService.update:', error);
            throw error;
        }
    },
};