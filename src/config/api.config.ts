const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.VITE_ON_PREMISE === 'true';

export const API_CONFIG = {
    BASE_URL: isDevelopment 
        ? 'http://localhost:5264/api'
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
        LISTAS_PRECIOS: '/listasprecios',
        PARAMETROS_VENTA_DEFAULT: '/parametrosVentaDefault',
        PRODUCTS_VENTA_TERCERO: '/productos-venta-tercero',
        PRINT_VENTA: '/print-venta',
        DEPARTAMENTOS: '/departamentos',
        TIPOS_REGIMEN: '/tiposregimen',
        TIPOS_NOTAS_CREDITO: '/tiposDocumentoNotaCredito',
        TIPOS_DOCUMENTO_VENTA: '/tiposDocumentoVenta',
        COTIZACION: '/cotizacion',
        CONCEPTOS_NOTA_CREDITO: '/conceptosnotacredito',
        NOTA_CREDITO: '/notacredito',
        TARIFAS_POR_TRIBUTO: '/tarifastributo',
        RESEND_VENTA: '/enviar-dian',
        PREVIEW_PDF: '/preview-pdf',
        TERCEROS_PROVEEDORES: '/terceros-proveedores',
        EMPRESAS: '/empresas',
        TIPO_PERSONA: '/tipospersona',
        MEDIOS_PAGO: '/mediospago'
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