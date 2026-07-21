import { API_CONFIG } from "@/config/api.config";
import { IEmpresas } from "@/types/IEmpresas"; 
    
export const EmpresaService = {
    async getAll(): Promise<IEmpresas[]> {
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
                throw new Error('Error al cargar empresas');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.getAll:', error);
            throw error;
        }
    },

    async create(empresas: IEmpresas): Promise<IEmpresas> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS),
                {
                    method: "POST",
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
                throw new Error('Error al crear empresa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.create:', error);
            throw error;
        }
    },

    async update(empresas: IEmpresas): Promise<IEmpresas> {
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
                throw new Error('Error al actualizar empresa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.update:', error);
            throw error;
        }
    },

    async delete(idEmpresa: number): Promise<void> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS),
                {
                    method: "DELETE",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify({ idEmpresa })
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar empresa');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresaService.delete:', error);
            throw error;
        }
    },                        

};