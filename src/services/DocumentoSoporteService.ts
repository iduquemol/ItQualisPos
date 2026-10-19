import { API_CONFIG } from "@/config/api.config";
import { IDocumentoSoporte } from "@/types/IDocumentoSoporte";
import { IResponseVenta } from "@/types/IResponseVenta";

export interface IResponseDocumentoSoporte extends IResponseVenta {
    idDsa?: number | null;
}

export const DocumentoSoporteService = {
    async getAll(): Promise<IDocumentoSoporte[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DOCUMENTO_SOPORTE),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar documentos de soporte');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DocumentoSoporteService.getAll:', error);
            throw error;
        }
    },

    async getById(idDsa: number): Promise<IDocumentoSoporte | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.OBTENER_DOCUMENTO_SOPORTE),
                {
                    method: "post",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idDsa: idDsa })
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar documento de soporte por ID');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DocumentoSoporteService.getById:', error);
            throw error;
        }
    },

    async create(dsa: IDocumentoSoporte): Promise<IResponseDocumentoSoporte> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.DSA_CREATE),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(dsa)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear documento de soporte');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en DocumentoSoporteService.create:', error);
            throw error;
        }
    },

    async printById(idDsa: number): Promise<unknown | null> {
        if (!idDsa || Number.isNaN(Number(idDsa))) {
            return null;
        }

        console.warn('DocumentoSoporteService.printById no está implementado para este endpoint.');
        return null;
    },


};