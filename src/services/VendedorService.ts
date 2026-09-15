import { API_CONFIG } from '@/config/api.config';
import { IVendedores } from '@/types/IVendedores';

export const VendedorService = {
    async getAll(): Promise<IVendedores[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.VENDEDORES),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al obtener vendedores');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VendedorService.getAll:', error);
            throw error;
        }
    },

    async create(vendedor: IVendedores): Promise<{ message: string; idVendedor: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.VENDEDORES),
                {
                    method: 'POST',
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(vendedor)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear vendedor');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VendedorService.create:', error);
            throw error;
        }
    },

    async update(vendedor: IVendedores): Promise<{ message: string; idVendedor: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.VENDEDORES),
                {
                    method: 'PUT',
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        'Content-Type': 'application/json'
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(vendedor)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar vendedor');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en VendedorService.update:', error);
            throw error;
        }
    },

    async delete(idVendedor: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.VENDEDORES)}/${idVendedor}`,
                {
                    method: 'DELETE',
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar vendedor');
            }
        } catch (error) {
            console.error('Error en VendedorService.delete:', error);
            throw error;
        }
    }
};

