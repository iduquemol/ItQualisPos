import { API_CONFIG } from "@/config/api.config";
import { IEmpresas } from "@/types/IEmpresas";

export const EmpresaService = {
    
    async get(): Promise<IEmpresas | null> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar la empresa');
            }
            const data: IEmpresas | null = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.get:', error);
            throw error;
        }
    },
    
    async update(empresas: IEmpresas): Promise<{ message: string; rowsAffected: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(empresas)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar la empresa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.update:', error);
            throw error;
        }
    }
};