import { IRolOpcionServicio, IRolOpcionServicioResponse } from "@/types/IRolOpcionServicio";
import { API_CONFIG } from "@/config/api.config";

export const RolOpcionServicioService = {
    async getAll(params?: {
        idRolOpcion?: number;
        idRol?: number;
        idOpcion?: number;
    }): Promise<IRolOpcionServicio[]> {
        try {
            const baseUrl = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ROLES_OPCIONES_SERVICIO);
            const query = new URLSearchParams();

            if (params?.idRolOpcion != null) query.append("idRolOpcion", String(params.idRolOpcion));
            if (params?.idRol != null) query.append("idRol", String(params.idRol));
            if (params?.idOpcion != null) query.append("idOpcion", String(params.idOpcion));

            const url = query.toString() ? `${baseUrl}?${query.toString()}` : baseUrl;

            const response = await fetch(url, {
                headers: API_CONFIG.OPTIONS.headers,
                mode: "cors",
                credentials: "same-origin",
            });

            if (!response.ok) {
                throw new Error("Error al cargar permisos de roles y opciones de servicio");
            }

            const data: IRolOpcionServicio[] = await response.json();
            return data;
        } catch (error) {
            console.error("Error en RolOpcionServicioService.getAll:", error);
            throw error;
        }
    },

    async create(permiso: IRolOpcionServicio): Promise<IRolOpcionServicioResponse> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ROLES_OPCIONES_SERVICIO),
                {
                    method: "POST",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                    credentials: "same-origin",
                    body: JSON.stringify(permiso),
                }
            );

            const data: IRolOpcionServicioResponse = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.mensaje || "Error al guardar permiso");
            }

            return data;
        } catch (error) {
            console.error("Error en RolOpcionServicioService.create:", error);
            throw error;
        }
    },

    async update(permiso: IRolOpcionServicio): Promise<IRolOpcionServicioResponse> {
        try {
            const response = await fetch(
                API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ROLES_OPCIONES_SERVICIO),
                {
                    method: "PUT",
                    headers: {
                        ...API_CONFIG.OPTIONS.headers,
                        "Content-Type": "application/json",
                    },
                    mode: "cors",
                    credentials: "same-origin",
                    body: JSON.stringify(permiso),
                }
            );

            const data: IRolOpcionServicioResponse = await response.json();

            if (!response.ok || data.error) {
                throw new Error(data.mensaje || "Error al actualizar permiso");
            }

            return data;
        } catch (error) {
            console.error("Error en RolOpcionServicioService.update:", error);
            throw error;
        }
    },

    async delete(id: number): Promise<void> {
        try {
            const response = await fetch(
                `${API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.ROLES_OPCIONES_SERVICIO)}/${id}`,
                {
                    method: "DELETE",
                    headers: API_CONFIG.OPTIONS.headers,
                    mode: "cors",
                    credentials: "same-origin",
                }
            );

            if (!response.ok) {
                throw new Error("Error al eliminar permiso");
            }
        } catch (error) {
            console.error("Error en RolOpcionServicioService.delete:", error);
            throw error;
        }
    },
};