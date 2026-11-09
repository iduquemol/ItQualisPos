const isDevelopment = import.meta.env.MODE === 'development' || import.meta.env.VITE_ON_PREMISE === 'true';

export const API_CONFIG = {
    BASE_URL: isDevelopment 
        ? 'http://localhost:5264/api'
        : import.meta.env.VITE_API_URL,
    ENDPOINTS: {
        DOCUMENTO_SOPORTE: '/documentos-soporte',
        OBTENER_DOCUMENTO_SOPORTE: '/obtener-documento-soporte',
        TIPOS_DOCUMENTO_NOTA_CREDITO: '/tipos-documento-notas-credito',
        TIPOS_DOCUMENTO_DSA: '/tipos-documento-dsa',
        TIPOS_DOCUMENTO_COTIZACION: '/tipos-documento-cotizacion',
        CONSULTAR_TIPOS_TRABAJADOR_NOMINA_DIAN: '/tipos-trabajador-nomina-dian',
        CONSULTAR_TIPOS_TERCERO_NOMINA: '/tipos-tercero-nomina',
        CONSULTAR_TIPOS_CONTRATO_NOMINA_DIAN: '/tipos-contrato-nomina-dian',
        CONSULTAR_NATURALEZA_CONCEPTOS_NOMINA: '/naturaleza-conceptos-nomina',
        CONSULTAR_GRUPOS_CONCEPTO_NOMINA_DIAN: '/grupos-concepto-nomina-dian',
        CONSULTAR_FRECUENCIA_PAGOS_NOMINA: '/frecuencia-pagos-nomina',
        CONSULTAR_PARAMETROS_NOMINA: '/parametros-nomina',
        DSA_CREATE: '/dsa-create',
        NOTAS_CREDITO: '/notascredito',
        NOTAS_DEBITO: '/notasdebito',
        CATEGORIES: '/categorias',
        PRODUCTS: '/productos',
        PRODUCTOS_COMPRA: '/productos-compra',
        PRODUCTOS_BUSQUEDA: '/productos-busqueda',
        SALES: '/venta',
        SUPPLIERS: '/terceros',
        UNIDADES_DE_MEDIDA: '/unidadesdemedida',
        UNIDADES_MEDIDA_DIAN: '/unidadesmedidadian',
        TRIBUTOS: '/tributos',
        TIPO_DOCUMENTO_IDENTIDAD: '/tiposdocumentoidentidad',
        MUNICIPIOS: '/municipios',
        RESPONSABILIDADES_F: '/responsabilidadesfiscales',
        TIPOS_DOCUMENTO: '/tiposdocumento',
        DOCUMENTO_LISTA: '/documentoslista',
        VENTA: '/venta',
        OBTENER_VENTA: '/obtener-venta',
        TIPOS_PRODUCTO: '/tiposproducto',
        LISTAS_PRECIOS: '/listasprecios',
        PARAMETROS_VENTA_DEFAULT: '/parametrosVentaDefault',
        PARAMETROS_VENTA: '/parametrosVentas',
        PRODUCTS_VENTA_TERCERO: '/productos-venta-tercero',
        PRINT_VENTA: '/print-venta',
        DEPARTAMENTOS: '/departamentos',
        TIPOS_REGIMEN: '/tiposregimen',
        TIPOS_NOTAS_CREDITO: '/notacredito',
        TIPOS_NOTAS_DEBITO: '/notadebito',
        TIPOS_DOCUMENTO_VENTA: '/tiposDocumentoVenta',
        COTIZACION: '/crear-cotizaciones',
        CONSULTAR_COTIZACION: '/consultar-cotizaciones',
        OBTENER_COTIZACION: '/obtener-cotizacion',
        ACTUALIZAR_COTIZACION: '/actualizar-cotizacion',
        CONCEPTOS_NOTA_CREDITO: '/conceptosnotacredito',
        CONCEPTOS_NOTA_DEBITO: '/conceptosnotadebito',
        NOTA_CREDITO: '/notacredito',
        NOTA_DEBITO: '/notadebito',
        TARIFAS_POR_TRIBUTO: '/tarifastributo',
        RESEND_VENTA: '/enviar-dian',
        PREVIEW_PDF: '/preview-pdf',
        TERCEROS_PROVEEDORES: '/terceros-proveedores',
        TERCEROS_BUSQUEDA: '/terceros-busqueda',
        TERCEROS_CONSULTA_EXTERNA: '/terceros-consulta-externa',
        EMPRESAS: '/empresas',
        TIPO_PERSONA: '/tipospersona',
        MEDIOS_PAGO: '/mediospago',
        MEDIOS_PAGO_DIAN: '/mediospagodian',
        RESOLUCIONES: '/resoluciones',
        TIPOS_DOCUMENTO_EXTERNO: '/tiposdocumentoexterno',
        ACTIVIDADES_ICA: '/actividadesIca',
        RESOLUCIONES_SINCRONIZAR_EXTERNAS: '/sincronizar-resoluciones-externas',
        FORMAS_PAGO: '/FormasPago/formasPago',
        CONSECUTIVOS: '/Consecutivos/consecutivos',
        SUCURSALES: '/sucursales',
        TIPOS_DOCUMENTO_DIAN: '/tiposdocumentodian',
        VENDEDORES: '/vendedores',
        USUARIOS: '/usuarios',
        ROLES: '/roles',
        ALMACENES: '/almacenes',

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