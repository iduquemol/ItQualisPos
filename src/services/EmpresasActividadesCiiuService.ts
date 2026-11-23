import { IEmpresasActividadesCiiu } from "@/types/IEmpresasActividadesCiiu";
import { API_CONFIG } from "@/config/api.config";

export const EmpresasActividadesCiiuService = {
    async getAll(): Promise<IEmpresasActividadesCiiu[]> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS_ACTIVIDADES_CIIU),
                {
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al cargar las relaciones de empresas y actividades CIIU');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresasActividadesCiiuService.getAll:', error);
            throw error;
        }
    },

    async create(entidad: IEmpresasActividadesCiiu): Promise<{ message: string; idEmpresaActividadCiiu: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS_ACTIVIDADES_CIIU),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(entidad)
                }
            );
            if (!response.ok) {
                throw new Error('Error al crear la relación empresa-actividad CIIU');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresasActividadesCiiuService.create:', error);
            throw error;
        }
    },

    async update(entidad: IEmpresasActividadesCiiu): Promise<{ message: string; idEmpresaActividadCiiu: number }> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS_ACTIVIDADES_CIIU),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json"
                    },
                    mode: 'cors',
                    credentials: 'same-origin',
                    body: JSON.stringify(entidad)
                }
            );
            if (!response.ok) {
                throw new Error('Error al actualizar la relación empresa-actividad CIIU');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error en EmpresasActividadesCiiuService.update:', error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.EMPRESAS_ACTIVIDADES_CIIU)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: 'cors',
                    credentials: 'same-origin'
                }
            );
            if (!response.ok) {
                throw new Error('Error al eliminar la relación empresa-actividad CIIU');
            }
        } catch (error) {
            console.error('Error en EmpresasActividadesCiiuService.delete:', error);
            throw error;
        }
    }
};