import { ITributo } from "@/types/ITributo";
import { API_CONFIG } from "@/config/api.config";
import { ICotizacion } from "@/types/ICotizacion";
import { IResponseCotizacion } from "@/types/IResponseCotizacion";

export const CotizacionService = {
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
};