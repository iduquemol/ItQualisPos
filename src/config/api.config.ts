const isDevelopment = import.meta.env.MODE === 'development';

export const API_CONFIG = {
    BASE_URL: isDevelopment 
        ? 'http://localhost:7049/api'
        : import.meta.env.VITE_API_URL,
    ENDPOINTS: {
        CATEGORIES: '/categorias',
        PRODUCTS: '/productos',
        SALES: '/ventas',
        SUPPLIERS: '/terceros',
        UNIDADES_DE_MEDIDA: '/unidadesdemedida',
        TRIBUTOS: '/tributos',
        TIPO_DOCUMENTO_IDENTIDAD: '/tiposdocumentoidentidad',
        MUNICIPIOS: '/municipios',
        RESPONSABILIDADES_F: '/responsabilidadesfiscales',
        TIPOS_DOCUMENTO: '/tiposdocumento',
        DOCUMENTO_LISTA: '/documentoslista',
        VENTA: '/ventas',
        OBTENER_VENTA: '/obtener-venta',
        TIPOS_PRODUCTO: '/tiposproducto',
        LISTAS_PRECIOS: '/listasprecio',
        TERCERO_DEFAULT: '/terceroVentaDefault',
        PRODUCTS_VENTA_TERCERO: '/productos-venta-tercero',
        PRINT_VENTA: '/print-venta',
    },
    getUrl: (endpoint: string) => {
        const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
        if (!isDevelopment && import.meta.env.VITE_API_KEY) {
            url.searchParams.append('code', import.meta.env.VITE_API_KEY);
        }
        return url.toString();
    },
    OPTIONS: {
        headers: {
            'Content-Type': 'application/json'
        }
    }
};