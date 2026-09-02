import { API_CONFIG } from '@/config/api.config';
import { IRoles } from '@/types/IRoles';

const rolesServiceBase = {
  getAll: async (): Promise<IRoles[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ROLES}`);
    if (!response.ok) throw new Error('Error al obtener roles');
    return await response.json();
  },
  
};

export const RolesService = rolesServiceBase;
export const RolService = rolesServiceBase;