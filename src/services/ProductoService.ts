import { IProducto } from "@/types/IProducto";
import { API_CONFIG } from "@/config/api.config";

export const ProductoService = {
    async getAll(): Promise<IProducto[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ProductoService.getAll:', error);
            throw error;
        }
    },

    async create(producto: IProducto): Promise<IProducto> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(producto)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear producto');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ProductoService.create:', error);
            throw error;
        }
    },

    async update(producto: IProducto): Promise<IProducto> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRODUCTS),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(producto)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar producto');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ProductoService.update:', error);
            throw error;
        }
    },

    async getProductosVentaByTercero(idTercero: string): Promise<IProducto[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRODUCTS_VENTA_TERCERO),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ tercero: idTercero })
                }
            );
            //console.log(response.url);
            if (!response.ok) {
                throw new Error('Error al cargar productos por tercero');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en ProductoService.getProductosVentaByTercero:', error);
            throw error;
        }
    }


};