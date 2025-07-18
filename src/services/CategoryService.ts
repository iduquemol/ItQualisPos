import { ICategory } from "@/types/ICategoria";
import { API_CONFIG } from "@/config/api.config";

export const CategoryService = {
    async getAll(): Promise<ICategory[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.CATEGORIES),
                { 
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar categorías');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en CategoryService.getAll:', error);
            throw error;
        }
    }
};