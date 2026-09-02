import { API_CONFIG } from '@/config/api.config';
import { ITipoDocumentoDian } from '@/types/ITipoDocumentoDian';

const tipoDocumentoDianServiceBase = {
  getAll: async (): Promise<ITipoDocumentoDian[]> => {
    const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.TIPOS_DOCUMENTO_DIAN}`);
    if (!response.ok) throw new Error('Error al obtener tipos de documento DIAN');
    return await response.json();
  },
};

export default tipoDocumentoDianServiceBase;