import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Star, Scan, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen, FileText, Send, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import { CategoriasService } from '@/services/CategoryService';
import { ProductoService } from '@/services/ProductoService';
import { TerceroService } from '@/services/TerceroService';
import { ICategorias } from '@/types/ICategorias';
import { IProducto } from '@/types/IProducto';
import { ITercero } from '@/types/ITercero';
import { ITipoDocumento } from '@/types/ITipoDocumento';
import { TipoDocumentoService } from '@/services/TipoDocumentoService';
import { ITipoDocumentoIdentidad } from '@/types/ITipoDocumentoIdentidad';
import { TipoDocumentoIdentidadService } from '@/services/TipoDocumentoIdentidadService';
import { IVenta } from '@/types/IVenta';
import { IVentaDetalle } from '@/types/IVentaDetalle';
import { IVentaTercero } from '@/types/IVentaTercero';
import { IDocumentoSoporte } from '@/types/IDocumentoSoporte';
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
import { DocumentoSoporteService } from '@/services/DocumentoSoporteService';
import { FormasPagoService } from '@/services/FormasPagoService';
import { MediosPagoService } from '@/services/MediosPagoService';
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";
import { ITerceroDefault } from '@/types/ITerceroDefault';
import { IFormasPago } from '@/types/IFormasPago';
import { IMediosPago } from '@/types/IMediosPago';
import { IVentaMedioPago } from '@/types/IVentaMedioPago';
import FacturaModal from '../reports/FacturaModal';
import { IParametrosVentaDefault } from '@/types/IParametrosVentaDefault';
import { Package, type LucideIcon } from "lucide-react";
import { CATEGORY_ICONS, iconMap } from '@/types/ICategoryIcons';


type PosCategory = ICategorias & { icon: LucideIcon };
type DocumentoSoporteForm = IVenta & Pick<IDocumentoSoporte, 'fechaInicialServicio' | 'fechaFinalServicio'>;

const getLocalDate = (date = new Date()): string => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
};

const addDaysToDate = (date: string, days: number): string => {
    const result = new Date(`${date}T00:00:00`);
    result.setDate(result.getDate() + days);
    return getLocalDate(result);
};

const resolveCategoryIcon = (iconId?: string | null): LucideIcon => {
    if (!iconId) return Package;

    const normalizedIconId = iconId.trim().toLowerCase();
    const categoryIcon = CATEGORY_ICONS.find(
        ({ id }) => id.toLowerCase() === normalizedIconId
    );

    return categoryIcon?.icon ?? iconMap[iconId.trim()] ?? Package;
};

const emptyVentaTercero: IVentaTercero = {
    idTercero: 0,
    idTipoDocumentoId: 0,
    digitoVerificacion: null,
    numeroIdentificacion: '',
    primerNombre: '',
    primerApellido: '',
    razonSocial: '',
    emailTercero: null,
};

const buildVentaDetalle = (product: IProducto, quantity: number = 1, registroVenta: number = 1): IVentaDetalle => {
    const precioUnitario = Number(product.precioUnitario ?? 0);
    const porcentajeIva = Number(product.porcentajeIva ?? 0);
    const porcentajeImpoConsumo = Number(product.porcentajeImpoConsumo ?? 0);
    const porcentajeReteIva = Number(product.porcentajeReteIva ?? 0);
    const porcentajeReteRenta = Number(product.porcentajeReteRenta ?? 0);
    const porcentajeReteIca = Number(product.porcentajeReteIca ?? 0);
    const porcentajeDescuento = Number(product.porcentajeMaxDescuento ?? 0);
    const cantidadVenta = Number(quantity ?? 1);
    const baseIvaVentaCalculada = parseFloat((precioUnitario - (porcentajeDescuento / 100)).toFixed(2));
    const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * (porcentajeIva / 100)).toFixed(2));
    const impoConsumoVenta = parseFloat((precioUnitario * (porcentajeImpoConsumo / 100)).toFixed(2));
    const reteIvaVenta = parseFloat((ivaVentaCalculada * (porcentajeReteIva / 100)).toFixed(2));
    const reteRentaVenta = parseFloat((baseIvaVentaCalculada * (porcentajeReteRenta / 100)).toFixed(2));
    const reteIcaVenta = parseFloat(((baseIvaVentaCalculada * (porcentajeReteIca / 100)) / 1000).toFixed(2));

    return {
        idDetalleVenta: 0,
        idVenta: 0,
        registroVenta,
        idProducto: Number(product.idProducto ?? 0),
        codigoProducto: product.codigoProducto ?? '',
        nombreProducto: product.nombreProducto ?? '',
        cantidadVenta,
        cantidadNotaCredito: 0,
        indNotaCredito: false,
        precioUnitarioVenta: precioUnitario,
        baseIvaVenta: baseIvaVentaCalculada,
        porcentajeIvaVenta: porcentajeIva,
        ivaVenta: ivaVentaCalculada,
        porcentajeDescuentoVenta: 0,
        descuentoVenta: 0,
        porcentajeImpoConsumo,
        impoConsumoVenta,
        porcentajeReteIva,
        reteIvaVenta,
        porcentajeReteRenta,
        reteRentaVenta,
        baseReteRenta: baseIvaVentaCalculada,
        porcentajeReteIca,
        reteIcaVenta,
        totalVenta: 0,
        costoUnitarioVenta: 0,
        costoTotalVenta: 0,
        idTipoProducto: Number(product.idTipoProducto ?? 0),
        indicadorMuestra: false,
    };
};

const recalculateVentaDetalle = (item: IVentaDetalle, quantity: number): IVentaDetalle => {
    const cantidadVenta = Number.isFinite(quantity) ? Math.max(0, quantity) : 0;
    const precioUnitario = Number(item.precioUnitarioVenta ?? 0);
    const porcentajeDescuento = Number(item.porcentajeDescuentoVenta ?? 0);
    const baseIvaVenta = parseFloat((cantidadVenta * precioUnitario - porcentajeDescuento / 100).toFixed(2));
    const ivaVenta = parseFloat((baseIvaVenta * (Number(item.porcentajeIvaVenta ?? 0) / 100)).toFixed(2));

    return {
        ...item,
        cantidadVenta,
        baseIvaVenta,
        ivaVenta,
        descuentoVenta: parseFloat((precioUnitario * cantidadVenta * (porcentajeDescuento / 100)).toFixed(2)),
        reteIvaVenta: parseFloat((ivaVenta * (Number(item.porcentajeReteIva ?? 0) / 100)).toFixed(2)),
        reteRentaVenta: parseFloat((baseIvaVenta * (Number(item.porcentajeReteRenta ?? 0) / 100)).toFixed(2)),
        baseReteRenta: baseIvaVenta,
        reteIcaVenta: parseFloat(((baseIvaVenta * (Number(item.porcentajeReteIca ?? 0) / 100)) / 1000).toFixed(2)),
    };
};

const buildVentaTercero = (values: Partial<IVentaTercero> = {}): IVentaTercero => ({
    ...emptyVentaTercero,
    ...values,
});

const mapDocumentoSoporteToVentaView = (documento: IDocumentoSoporte): DocumentoSoporteForm => {
    const tercero = documento.terceroDsa?.[0];

    return {
        idVenta: documento.idDsa,
        idTipoDocumento: documento.idTipoDocumentoDsa,
        idTipoDocumentoExterno: documento.idTipoDocumentoExterno,
        codigoDocumento: '',
        nombreDocumento: null,
        idMetodoDian: null,
        idFormaPago: documento.idFormaPagoDsa ?? null,
        numeroVenta: documento.numeroDsa,
        prefijoVenta: documento.prefijoDsa,
        idTerceroVenta: documento.idTerceroDsa,
        fechaVenta: documento.fechaDsa,
        plazoDias: documento.plazoDiasDsa,
        fechaVencimiento: documento.fechaVencimientoDsa,
        esBorrador: false,
        idPuntoVenta: null,
        idUsuario: documento.idUsuario ?? null,
        totalRegistros: documento.totalRegistrosDsa ?? 0,
        cantidadProductos: documento.cantidadProductosDsa ?? 0,
        totalPrecio: documento.totalPrecioDsa ?? 0,
        totalDescuento: documento.totalDescuentoDsa ?? 0,
        totalBaseIva: 0,
        totalIva: 0,
        totalVenta: documento.totalDsa ?? 0,
        totalBaseReteRenta: documento.totalBaseReteRentaDsa ?? 0,
        totalReteRenta: documento.totalReteRentaDsa ?? 0,
        totalBaseReteIca: documento.totalBaseReteIcaDsa ?? 0,
        totalReteIca: documento.totalReteIcaDsa ?? 0,
        cufe: documento.cufe ?? null,
        firmaDigital: documento.firmaDigital ?? null,
        fechaHoraAutorizacion: documento.fechaHoraAutorizacion ?? null,
        idResolucion: documento.idResolucionDsa ?? null,
        idResponseDian: documento.idResponseDianDsa ?? null,
        idTipoOperacionDian: documento.idTipoOperacionDian ?? null,
        fechaGrabacionVenta: documento.fechaGrabacionDsa ?? null,
        estadoDian: documento.validadoDian ? 'Validado DIAN' : null,
        observaciones: documento.observacionesDsa ?? null,
        ordenReferencia: documento.ordenReferenciaDsa ?? null,
        fechaOrdenReferencia: documento.fechaOrdenReferenciaDsa ?? null,
        fechaInicialServicio: documento.fechaInicialServicio ?? null,
        fechaFinalServicio: documento.fechaFinalServicio ?? null,
        terceroVenta: tercero ? buildVentaTercero({
            idTercero: tercero.idTercero,
            idTipoDocumentoId: tercero.idTipoDocumentoId ?? 0,
            numeroIdentificacion: tercero.numeroIdentificacion ?? '',
            primerNombre: tercero.primerNombre ?? '',
            primerApellido: tercero.primerApellido ?? '',
            razonSocial: tercero.razonSocial ?? '',
            emailTercero: tercero.emailTercero ?? null,
        }) : buildVentaTercero(),
        detalleVenta: (documento.detalleDsa ?? []).map(item => ({
            idDetalleVenta: item.idDetalleDsa,
            idVenta: item.idDsa,
            registroVenta: item.registroDsa,
            idProducto: item.idProducto,
            codigoProducto: item.codigoProducto ?? '',
            nombreProducto: item.nombreProducto ?? '',
            cantidadVenta: item.cantidadDsa ?? 0,
            precioUnitarioVenta: item.precioUnitarioDsa ?? 0,
            precioTotalVenta: item.precioTotalDsa ?? 0,
            porcentajeDescuentoVenta: item.porcentajeDescuentoDsa ?? 0,
            descuentoVenta: item.descuentoDsa ?? 0,
            totalVenta: item.totalDsa ?? 0,
            costoUnitarioVenta: item.costoUnitarioDsa ?? 0,
            costoTotalVenta: item.costoTotalDsa ?? 0,
            porcentajeReteRenta: item.porcentajeReteRenta ?? 0,
            baseReteRenta: item.baseReteRenta ?? 0,
            reteRentaVenta: item.reteRentaDsa ?? 0,
            porcentajeReteIca: item.porcentajeReteIca ?? 0,
            baseReteIca: item.baseReteIca ?? 0,
            reteIcaVenta: item.reteIcaDsa ?? 0,
            porcentajeImpoConsumo: 0,
            impoConsumoVenta: 0,
            baseIvaVenta: 0,
            porcentajeIvaVenta: 0,
            ivaVenta: 0,
            porcentajeReteIva: 0,
            baseReteIvaVenta: 0,
            reteIvaVenta: 0,
            fechaGrabacionDetalleVenta: item.fechaGrabacionDetalleDsa ?? null,
            idTipoProducto: 0,
            cantidadNotaCredito: 0,
            indNotaCredito: false,
            idTerceroMandato: null,
            idItemSector: null,
            indicadorMuestra: false,
            valorReferenciaUnidad: null,
            valorReferenciaTotal: null,
        })),
        mediosPagoVenta: [],
    };
};

const DocumentoSoporteMaster = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const facturaDesdeTerceros = location.state?.from === 'terceros'
        ? location.state.factura as IVenta
        : null;
    const [factura, setFactura] = useState<DocumentoSoporteForm>(facturaDesdeTerceros ?? {
        idVenta: 0,
        idTipoDocumento: 1,
        codigoDocumento: '',
        nombreDocumento: null,
        idMetodoDian: 1,
        idFormaPago: 1,
        numeroVenta: 0,
        prefijoVenta: '',
        fechaVenta: getLocalDate(),
        plazoDias: 0,
        fechaVencimiento: getLocalDate(),
        esBorrador: false,
        idPuntoVenta: 1,
        idUsuario: 1,
        totalRegistros: 0,
        cantidadProductos: 0,
        totalPrecio: 0,
        totalDescuento: 0,
        totalBaseIva: 0,
        totalIva: 0,
        totalVenta: 0,
        observaciones: null,
        ordenReferencia: null,
        fechaOrdenReferencia: null,
        terceroVenta: buildVentaTercero(),
        detalleVenta: [],
        mediosPagoVenta: []
    });
    const [documentoSoporteCargado, setDocumentoSoporteCargado] = useState<IDocumentoSoporte | null>(null);
    const [selectedFactura, setSelectedFactura] = useState<IVenta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [showPayment, setShowPayment] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState('');
    const [customerDiscount, setCustomerDiscount] = useState('0');
    const [terceroInfo, setTerceroInfo] = useState<ITercero>({
        idTercero: 1,
        idTipoDocumentoId: 7,
        digitoVerificacion: '7',
        numeroIdentificacion: '222222222222',
        primerNombre: 'Consumidor',
        segundoNombre: '',
        primerApellido: 'Final',
        segundoApellido: '',
        razonSocial: '',
        telefonoTercero: "",
        direccionTercero: '',
        idMunicipio: 0,
        nombreTipoDocumentoId: 'CC',
        nombreMunicipio: 'Bogota',
        emailTercero: 'iduque2001@hotmail.com',
        terceroActivo: true,
        terceroCliente: true,
        tercerosEmpleado: true,
        terceroProveedor: true,
        terceroGeneral: true,
        idTipoRegimen: 0,
        idListaPreciosTercero: 0,
        idDepartamento: 0,
        nombreDepartamento: 'Bogota',
        retenedorIva: false,
        retenedorRenta: false,
        retenedorIca: false,
        declaraRenta: false,
        tarifaIca: 0,
        idCodigoPostal: 0,
        registroMercantil: '',
        responsabilidadesTerceros: [],
    });
    const [showCustomer, setShowCustomer] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [showScanner, setShowScanner] = useState(false);
    const [showOCR, setShowOCR] = useState(false);
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [products, setProducts] = useState<IProducto[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [terceros, setTerceros] = useState<ITercero[]>([]);
    const [isLoadingTerceros, setIsLoadingTerceros] = useState(true);
    const [terceroError, setTerceroError] = useState<string | null>(null);
    const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([]);
    const [isLoadingTiposDocumento, setIsLoadingTiposDocumento] = useState(true);
    const [tipoDocumentoError, setTipoDocumentoError] = useState<string | null>(null);
    const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<ITipoDocumentoIdentidad[]>([]);
    const [isLoadingTipos, setIsLoadingTipos] = useState(true);
    const [tipoError, setTipoError] = useState<string | null>(null);
    const [documentosLista, setDocumentoLista] = useState<IDocumentoLista[]>([]);
    const [isLoadingDocumentoLista, setIsLoadingDocumentoLista] = useState(true);
    const [documentoListaError, setDocumentoListaError] = useState<string | null>(null);
    const [formasPago, setFormasPago] = useState<IFormasPago[]>([]);
    const [mediosPago, setMediosPago] = useState<IMediosPago[]>([]);
    const [parametrosVentaDefault, setParametrosVentaDefault] = useState<IParametrosVentaDefault | null>(null);
    const [isLoadingTerceroDefault, setIsLoadingTerceroDefault] = useState(true);
    const [terceroDefaultError, setTerceroDefaultError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogTercero, setOpenDialogTercero] = useState(false);
    const [searchDocumento, setSearchDocumento] = useState("");
    const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
    const [lastKeyTime, setLastKeyTime] = useState<number>(0);
    const [showFacturaModal, setShowFacturaModal] = useState(false);
    const [facturaModalData, setFacturaModalData] = useState<any>(null);
    const [searchTercero, setSearchTercero] = useState("");
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(1);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const selectedFormaPago = formasPago.find(
        forma => forma.idFormaPago === factura.idFormaPago
    );
    const tipoDocumentoSeleccionado = tiposDocumento.find(
        tipo => Number(factura.idTipoDocumentoExterno ?? 0) > 0
            && Number(tipo.idTipoDocumentoExterno) === Number(factura.idTipoDocumentoExterno)
    ) ?? tiposDocumento.find(
        tipo => Number(tipo.idTipoDocumento) === Number(factura.idTipoDocumento)
    );
    const facturaValidadaDian = documentoSoporteCargado
        ? documentoSoporteCargado.validadoDian === true
        : factura.estadoDian === 'Validado DIAN';
    const esCredito = selectedFormaPago?.nombreFormaPago
        ?.trim()
        .toLowerCase() === 'crédito' || selectedFormaPago?.nombreFormaPago
            ?.trim()
            .toLowerCase() === 'credito';

    const BARCODE_DELAY = 50;

    const [vendedores, setVendedores] = useState<any[]>([
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Vendedor 1" },
        { id: 3, nombre: "Vendedor 2" },
    ]);

    const fetchCategories = async () => {
        try {
            setCategoryError(null);
            setIsLoadingCategories(true);
            const data = await CategoriasService.getAll();
            const categoriesWithIcons = data
                .filter((category) => category.categoriaActiva === true)
                .map((category) => ({
                    ...category,
                    icon: resolveCategoryIcon(category.iconoCategoria),
                }));
            setCategories([
                { idCategoria: 0, codigoCategoria: 'all', nombreCategoria: 'Todo', iconoCategoria: 'Package', icon: Package },
                ...categoriesWithIcons
            ]);
        } catch (error) {
            console.error('Error:', error);
            setCategoryError('Error al cargar las categorías');
            // Categorías por defecto en caso de error
            setCategories([
                // ... otras categorías por defecto
            ]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchTiposDocumento = async () => {
        try {
            setTipoDocumentoError(null);
            setIsLoadingTiposDocumento(true);
            const data = await TipoDocumentoService.getTiposVenta();
            setTiposDocumento([
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setTipoDocumentoError('Error al cargar los tipos de documento');
            // Tipos de documento por defecto en caso de error
            setTiposDocumento([]);
        } finally {
            setIsLoadingTiposDocumento(false);
        }
    };

    const fetchTipoDocumentoIdentidad = async () => {
        try {
            setTipoError(null);
            setIsLoadingTipos(true);
            const data = await TipoDocumentoIdentidadService.getAll();
            setTiposDocumentoIdentidad([
                {
                    idTipoDocumentoId: 0, nombreTipoDocumentoId: "Seleccione un tipo de documento", codigoTipoDocumentoId: "0",
                    observacionTipoDocumentoId: null
                }, // Tipo de documento por defecto
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setTipoError('Error al cargar los tipos de documento');
            // Tipos de documento por defecto en caso de error
            setTiposDocumentoIdentidad([
                { idTipoDocumentoId: 0, nombreTipoDocumentoId: "Seleccione un tipo de documento", codigoTipoDocumentoId: "0", observacionTipoDocumentoId: null },
            ]);
        } finally {
            setIsLoadingTipos(false);
        }
    };

    const fetchProducts = async (numeroIdentificacion?: string) => {
        try {
            setProductError(null);
            setIsLoadingProducts(true);
            const data = await ProductoService.getProductosVentaByTercero(
                numeroIdentificacion || factura.terceroVenta?.numeroIdentificacion || "0"
            );

            // 🔒 Filtramos duplicados por idProducto antes de guardar en el estado
            const uniqueProducts = Array.from(
                new Map(data.map((item: any) => [item.idProducto, item])).values()
            );

            setProducts(uniqueProducts);
        } catch (error) {
            console.error('Error:', error);
            setProductError('Error al cargar los productos');
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchTerceros = async () => {
        try {
            setTerceroError(null);
            setIsLoadingTerceros(true);
            const data = await TerceroService.getAll(undefined, 2);
            setTerceros(data);
        } catch (error) {
            console.error('Error:', error);
            setTerceroError('Error al cargar los terceros');
        } finally {
            setIsLoadingTerceros(false);
        }
    };

    const fetchDocumentoLista = async () => {
        try {
            setDocumentoListaError(null);
            setIsLoadingDocumentoLista(true);
            const data = await DocumentoListaService.getAll();
            setDocumentoLista(data);
        } catch (error) {
            console.error('Error:', error);
            setDocumentoListaError('Error al cargar los documentos de la lista');
        } finally {
            setIsLoadingDocumentoLista(false);
        }
    };

    const fetchFormasPago = async () => {
        try {
            const data = await FormasPagoService.getAll();
            setFormasPago(data);
        } catch (error) {
            console.error('Error al cargar formas de pago:', error);
            setFormasPago([]);
        }
    };

    const fetchMediosPago = async () => {
        try {
            const data = await MediosPagoService.getAll();
            setMediosPago(data);
        } catch (error) {
            console.error('Error al cargar medios de pago:', error);
            setMediosPago([]);
        }
    };

    const fetchParametrosVentaDefault = async () => {
        try {
            setParametrosVentaDefault(null);
            setIsLoadingTerceroDefault(true);
            const data = await VentaService.getParametrosVentaDefault();
            setParametrosVentaDefault(data);
            if (!facturaDesdeTerceros) {
                setFactura({
                    ...factura,
                    idTipoDocumento: data.documentoVenta[0].idTipoDocumento,
                    idMetodoDian: data.documentoVenta[0].idMetodoDian,
                    terceroVenta: {
                        idTercero: data.terceroVenta[0].idTercero,
                        idTipoDocumentoId: data.terceroVenta[0].idTipoDocumentoId,
                        numeroIdentificacion: data.terceroVenta[0].numeroIdentificacion,
                        primerNombre: data.terceroVenta[0].primerNombre,
                        primerApellido: data.terceroVenta[0].primerApellido,
                        razonSocial: data.terceroVenta[0].razonSocial,
                        emailTercero: data.terceroVenta[0].emailTercero,
                        digitoVerificacion: null,
                    }
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setTerceroDefaultError('Error al cargar los parametros de venta por defecto');
            setParametrosVentaDefault({
                terceroVenta: [
                    {
                        idTercero: 0,
                        idTipoDocumentoId: 0,
                        nombreTipoDocumentoId: "0",
                        numeroIdentificacion: "",
                        primerNombre: "",
                        primerApellido: "",
                        razonSocial: "",
                        emailTercero: ""
                    }
                ],
                documentoVenta: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: "0",
                        nombreDocumento: "0",
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: "0",
                        idMetodoDian: 0,
                        nombreMetodo: "0",
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    }
                ],
                documentoNotaCredito: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: "0",
                        nombreDocumento: "0",
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: "0",
                        idMetodoDian: 0,
                        nombreMetodo: "0",
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    }
                ],
                documentoCotizacion: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: "0",
                        nombreDocumento: "0",
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: "0",
                        idMetodoDian: 0,
                        nombreMetodo: "0",
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    }
                ]
            });
        } finally {
            setIsLoadingTerceroDefault(false);
        }
    };

    const initializeComponent = async () => {
        await Promise.all([
            fetchCategories(),
            fetchTipoDocumentoIdentidad(),
            fetchParametrosVentaDefault(),
            fetchTiposDocumento(),
            fetchDocumentoLista(),
            fetchFormasPago(),
            fetchMediosPago(),
            fetchProducts(),
            fetchTerceros()
        ]);
    };

    const playBeep = (success: boolean) => {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.setValueAtTime(success ? 1000 : 400, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };

    useEffect(() => {
        initializeComponent();
    }, []);

    useEffect(() => {
        const idDsa = Number(location.state?.idDsa ?? location.state?.documentoSoporteId ?? 0);
        if (!Number.isInteger(idDsa) || idDsa <= 0) return;

        let cancelled = false;
        const loadDocumentoSoporte = async () => {
            try {
                const data = await DocumentoSoporteService.getById(idDsa);
                if (!data) {
                    throw new Error(`No se encontró el documento soporte ${idDsa}`);
                }
                if (cancelled) return;

                setDocumentoSoporteCargado(data);
                setFactura(mapDocumentoSoporteToVentaView(data));
                setSelectedFactura(null);
                setFacturaModalData(null);
            } catch (error) {
                console.error('Error al cargar el documento soporte seleccionado:', error);
                if (!cancelled) {
                    toast.error('No se pudo cargar el documento soporte seleccionado.', {
                        position: 'top-center',
                    });
                }
            }
        };

        void loadDocumentoSoporte();
        return () => {
            cancelled = true;
        };
    }, [location.state]);

    useEffect(() => {
        const selectedTipoDocumento = tiposDocumento.find(
            (tipoDocumento) =>
                Number(tipoDocumento.idTipoDocumentoExterno) === Number(factura.idTipoDocumentoExterno) &&
                Number(tipoDocumento.idTipoDocumento) === Number(factura.idTipoDocumento)
        ) ?? tiposDocumento.find(
            (tipoDocumento) => Number(tipoDocumento.idTipoDocumento) === Number(factura.idTipoDocumento)
        );
        if (!selectedTipoDocumento) return;

        const idTipoDocumentoExterno = Number(selectedTipoDocumento.idTipoDocumentoExterno);
        const prefijoConsecutivo = selectedTipoDocumento.prefijoConsecutivo ?? '';
        if (
            factura.idTipoDocumentoExterno !== idTipoDocumentoExterno ||
            factura.prefijoVenta !== prefijoConsecutivo
        ) {
            setFactura((previous) => ({
                ...previous,
                idTipoDocumentoExterno,
                prefijoVenta: prefijoConsecutivo,
            }));
        }
    }, [tiposDocumento, factura.idTipoDocumento, factura.idTipoDocumentoExterno, factura.prefijoVenta]);

    // Manejo de eventos del teclado para escaneo de código de barras
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const currentTime = new Date().getTime();
            const timeDiff = currentTime - lastKeyTime;

            // Si es entrada del scanner (caracteres vienen rápido)
            if (timeDiff < BARCODE_DELAY) {
                setBarcodeBuffer(prev => prev + e.key);
            } else {
                // Nueva secuencia de caracteres
                setBarcodeBuffer(e.key);
            }

            setLastKeyTime(currentTime);

            // Si detecta Enter, procesa el código
            if (e.key === 'Enter' && barcodeBuffer) {
                const product = products.find(p => p.codigoBarras === barcodeBuffer);
                if (product) {
                    addToCart(product);
                    playBeep(true);
                } else {
                    console.log('Producto no encontrado:', barcodeBuffer);
                    playBeep(false);
                }
                setBarcodeBuffer('');
            }
        };

        window.addEventListener('keypress', handleKeyPress);
        return () => window.removeEventListener('keypress', handleKeyPress);
    }, [barcodeBuffer, lastKeyTime, products]);

    // Filtrar productos por búsqueda y categoría
    const filteredProducts = products.filter(product => {
        // 1. Limpiar el texto buscado
        const term = searchTerm.trim().toLowerCase();

        // 2. Extraer y convertir a string de forma segura todos los campos
        const nombre = String(product?.nombreProducto ?? '').toLowerCase();
        const codigo = String(product?.codigoProducto ?? '').toLowerCase();
        const barras = String(product?.codigoBarras ?? '').toLowerCase();

        // 3. Evaluar la búsqueda
        const matchesSearch = term === ''
            ? true
            : (nombre.includes(term) || codigo.includes(term) || barras.includes(term));

        // 4. Evaluar la categoría (0 = "Todo")
        const categoryId = parseInt(selectedCategory, 10);
        const matchesCategory = categoryId === 0 || Number(product?.idCategoria) === categoryId;

        // Ambas condiciones deben cumplirse
        return matchesSearch && matchesCategory;
    });


    const handleSelectTercero = (terc: ITercero) => {
        setFactura(prev => ({
            ...prev,
            terceroVenta: buildVentaTercero({
                idTercero: terc.idTercero ?? 0,
                idTipoDocumentoId: terc.idTipoDocumentoId ?? 0,
                digitoVerificacion: terc.digitoVerificacion ?? null,
                numeroIdentificacion: terc.numeroIdentificacion ?? '',
                primerNombre: terc.primerNombre ?? '',
                primerApellido: terc.primerApellido ?? '',
                razonSocial: terc.razonSocial ?? '',
                emailTercero: terc.emailTercero ?? null,
            })
        }));
        setOpenDialogTercero(false);
    };

    const handleNew = async () => {
        let parametros = parametrosVentaDefault;

        try {
            parametros = await VentaService.getParametrosVentaDefault();
            setParametrosVentaDefault(parametros);
        } catch (error) {
            console.error('Error al cargar los parametros por defecto para la nueva factura:', error);
        }

        const documentoDefault = parametros?.documentoVenta?.[0];
        const terceroDefault = parametros?.terceroVenta?.[0];

        setFactura(prev => ({
            ...prev,
            idVenta: 0,
            idTipoDocumento: documentoDefault?.idTipoDocumento ?? 4,
            codigoDocumento: '',
            nombreDocumento: null,
            idMetodoDian: documentoDefault?.idMetodoDian ?? 2,
            idFormaPago: documentoDefault?.idFormaPago ?? 1,
            numeroVenta: 0,
            prefijoVenta: '',
            fechaVenta: getLocalDate(),
            plazoDias: 0,
            fechaVencimiento: getLocalDate(),
            idPuntoVenta: 1,
            idUsuario: 1,
            totalRegistros: 0,
            cantidadProductos: 0,
            totalPrecio: 0,
            totalDescuento: 0,
            totalBaseIva: 0,
            totalIva: 0,
            totalVenta: 0,
            fechaInicialServicio: null,
            fechaFinalServicio: null,
            terceroVenta: buildVentaTercero({
                idTercero: terceroDefault?.idTercero ?? 0,
                idTipoDocumentoId: terceroDefault?.idTipoDocumentoId ?? 0,
                numeroIdentificacion: terceroDefault?.numeroIdentificacion ?? '',
                primerNombre: terceroDefault?.primerNombre ?? '',
                primerApellido: terceroDefault?.primerApellido ?? '',
                razonSocial: terceroDefault?.razonSocial ?? '',
                emailTercero: terceroDefault?.emailTercero ?? null,
            }),
            observaciones: null,
            ordenReferencia: null,
            fechaOrdenReferencia: null,
            detalleVenta: [],
            mediosPagoVenta: [],
        }));
        setSelectedFactura(null);
        setDocumentoSoporteCargado(null);
        setShowFacturaModal(false);
        setFacturaModalData(null);
        setActivePaymentMethod('');
    };

    const handleResend = async () => {
        console.log("Enviando factura a la Dian:");
        if (factura.idVenta) {
            const result = await VentaService.resend(factura.idVenta, factura.idMetodoDian || 2);
            console.log("Factura enviada a la Dian:", result);
            setSuccessMessage(result.message || "Operación completada");
            setShowSuccessDialog(true);
        }
    }

    const ultimaConsultaExternaRef = useRef<string | null>(null);

    const handleConsultarDatosExternos = async (
        numeroIdentificacion: string,
        idTipoDocumentoId: number
    ) => {
        const tipoDocumento = tiposDocumentoIdentidad.find(
            tipo => tipo.idTipoDocumentoId === idTipoDocumentoId
        );
        const numeroNormalizado = numeroIdentificacion.trim();
        const codigoTipoDocumentoId = tipoDocumento?.codigoTipoDocumentoId;

        if (!numeroNormalizado || !codigoTipoDocumentoId || codigoTipoDocumentoId === '0') {
            return;
        }

        const claveConsulta = `${codigoTipoDocumentoId}|${numeroNormalizado}`;
        if (ultimaConsultaExternaRef.current === claveConsulta) {
            return;
        }
        ultimaConsultaExternaRef.current = claveConsulta;

        setFactura(prev => {
            if (prev.terceroVenta?.numeroIdentificacion?.trim() !== numeroNormalizado) {
                return prev;
            }

            return {
                ...prev,
                terceroVenta: buildVentaTercero({
                    ...(prev.terceroVenta ?? buildVentaTercero()),
                    primerNombre: '',
                    primerApellido: '',
                })
            };
        });

        try {
            const resultado = await TerceroService.consultarDatosExternos(
                codigoTipoDocumentoId,
                numeroNormalizado
            );

            setFactura(prev => {
                if (prev.terceroVenta?.numeroIdentificacion?.trim() !== numeroNormalizado) {
                    return prev;
                }

                return {
                    ...prev,
                    terceroVenta: buildVentaTercero({
                        ...(prev.terceroVenta ?? buildVentaTercero()),
                        razonSocial: resultado.name ?? prev.terceroVenta?.razonSocial ?? '',
                        emailTercero: resultado.email ?? prev.terceroVenta?.emailTercero ?? null,
                    })
                };
            });

            if (resultado.message) {
                toast(resultado.message, { position: 'top-center' });
            }
        } catch (error) {
            console.error('Error al consultar datos externos del cliente:', error);
        }
    };

    // Manejo de eventos para buscar tercero por número de identificación
    const handleSearchTercero = (numeroIdentificacion: string) => {
        const tercero = terceros.find(t => t.numeroIdentificacion === numeroIdentificacion);
        if (tercero) {
            setFactura(prev => ({
                ...prev,
                terceroVenta: buildVentaTercero({
                    idTercero: tercero.idTercero ?? 0,
                    idTipoDocumentoId: tercero.idTipoDocumentoId ?? 7,
                    digitoVerificacion: tercero.digitoVerificacion ?? null,
                    numeroIdentificacion: tercero.numeroIdentificacion ?? '',
                    primerNombre: tercero.primerNombre ?? '',
                    primerApellido: tercero.primerApellido ?? '',
                    razonSocial: tercero.razonSocial ?? '',
                    emailTercero: tercero.emailTercero ?? null,
                })
            }));
        }
        return tercero;
    };

    const handleValidarTercero = async () => {
        const terceroVenta = factura.terceroVenta;
        const numeroIdentificacion = terceroVenta?.numeroIdentificacion?.trim();
        if (!numeroIdentificacion) {
            return;
        }

        const terceroLocal = handleSearchTercero(numeroIdentificacion);
        if (!terceroLocal) {
            await handleConsultarDatosExternos(
                numeroIdentificacion,
                terceroVenta?.idTipoDocumentoId ?? 0
            );
        }
    };

    const handleSelectVenta = async (documento: IDocumentoLista) => {
        const data = await VentaService.getById(documento.idVenta);
        setDocumentoSoporteCargado(null);
        setSelectedFactura(data);
        setFactura(prev => ({
            ...prev,
            idVenta: data?.idVenta ?? 0,
            idTipoDocumento: data?.idTipoDocumento ?? 0,
            codigoDocumento: data?.codigoDocumento ?? '',
            nombreDocumento: data?.nombreDocumento ?? null,
            estadoDian: data?.estadoDian ?? null,
            idFormaPago: data?.idFormaPago ?? 1,
            numeroVenta: data?.numeroVenta ?? 0,
            prefijoVenta: data?.prefijoVenta ?? '',
            fechaVenta: data?.fechaVenta ?? '',
            plazoDias: data?.plazoDias ?? 0,
            fechaVencimiento: data?.fechaVencimiento ?? data?.fechaVenta ?? '',
            idMetodoDian: data?.idMetodoDian ?? 2,
            idPuntoVenta: data?.idPuntoVenta ?? null,
            idUsuario: data?.idUsuario ?? null,
            totalRegistros: data?.totalRegistros ?? 0,
            cantidadProductos: data?.cantidadProductos ?? 0,
            totalPrecio: data?.totalPrecio ?? 0,
            totalDescuento: data?.totalDescuento ?? 0,
            totalBaseIva: data?.totalBaseIva ?? 0,
            totalIva: data?.totalIva ?? 0,
            totalVenta: data?.totalVenta ?? 0,
            fechaInicialServicio: null,
            fechaFinalServicio: null,
            terceroVenta: data?.terceroVenta ? buildVentaTercero(data.terceroVenta) : buildVentaTercero(),
            detalleVenta: data?.detalleVenta ?? [],
            mediosPagoVenta: data?.mediosPagoVenta ?? [],

        }));
        setOpenDialog(false);
        if (data?.estadoDian === 'Validado DIAN') {
            setShowPayment(false);
        }
        setShowFacturaModal(true);
        const dataPrint = await VentaService.printById(documento.idVenta);
        setFacturaModalData(dataPrint);
    };

    const DEFAULT_TIPO_DOC_NIT = 7; // idTipoDocumentoId = 7 para NIT (código 31)

    const handleSaveVenta = async (indBorrador: boolean) => {
        if (facturaValidadaDian) return;

        const localISODate = getLocalDate();

        // 1. Normalizar cada ítem del detalle
        const detalleNormalizado = (factura.detalleVenta ?? []).map(item => {
            const totalItemCalculado = (item.totalVenta && item.totalVenta > 0)
                ? item.totalVenta
                : (item.precioUnitarioVenta || 0) * (item.cantidadVenta || 1);

            // Si porcentajeIvaVenta es 0 o no hay ivaVenta, la baseIvaVenta debe ser 0
            const tieneIva = (item.porcentajeIvaVenta && item.porcentajeIvaVenta > 0) || (item.ivaVenta && item.ivaVenta > 0);
            const baseIvaCalculada = tieneIva
                ? ((item.baseIvaVenta && item.baseIvaVenta > 0) ? item.baseIvaVenta : totalItemCalculado)
                : 0;

            return {
                ...item,
                totalVenta: totalItemCalculado,
                baseIvaVenta: baseIvaCalculada
            };
        });

        // 2. Calcular totales reales desde el detalle normalizado
        const totalCantidadCalculada = detalleNormalizado.reduce((acc, item) => acc + (item.cantidadVenta || 0), 0);
        const totalPrecioCalculado = total ?? detalleNormalizado.reduce((acc, item) => acc + (item.totalVenta || 0), 0);
        const totalBaseIvaCalculado = detalleNormalizado.reduce((acc, item) => acc + (item.baseIvaVenta || 0), 0);
        const totalIvaCalculado = detalleNormalizado.reduce((acc, item) => acc + (item.ivaVenta || 0), 0);
        const totalDescuentoCalculado = detalleNormalizado.reduce((acc, item) => acc + (item.descuentoVenta || 0), 0);

        // 3. Normalizar medio de pago (Efectivo = 1)
        const mediosPagoNormalizados = esCredito
            ? []
            : (factura.mediosPagoVenta && factura.mediosPagoVenta.length > 0)
                ? factura.mediosPagoVenta
                : [{
                    idMedioPagoVenta: 0,
                    idMedioPago: 1,
                    valorMedioPago: totalPrecioCalculado
                }];

        // 4. Estructurar la factura final
        const updatedFactura = {
            ...factura,
            fechaVenta: localISODate,
            plazoDias: esCredito ? Math.max(0, Number(factura.plazoDias ?? 0)) : 0,
            fechaVencimiento: esCredito
                ? addDaysToDate(localISODate, Math.max(0, Number(factura.plazoDias ?? 0)))
                : localISODate,
            esBorrador: indBorrador,

            // Detalle corregido
            detalleVenta: detalleNormalizado,

            // Totales y Cantidades
            cantidadProductos: totalCantidadCalculada > 0 ? totalCantidadCalculada : factura.cantidadProductos,
            totalRegistros: detalleNormalizado.length,
            totalPrecio: totalPrecioCalculado > 0 ? totalPrecioCalculado : factura.totalPrecio,
            totalVenta: totalPrecioCalculado > 0 ? totalPrecioCalculado : factura.totalVenta,
            totalBaseIva: totalBaseIvaCalculado,
            totalIva: totalIvaCalculado,
            totalDescuento: totalDescuentoCalculado,

            // Medios de pago
            mediosPagoVenta: mediosPagoNormalizados,

            // Tercero normalizado según el contrato actual
            terceroVenta: factura.terceroVenta ? {
                ...factura.terceroVenta,
                idTipoDocumentoId: (factura.terceroVenta.idTipoDocumentoId && factura.terceroVenta.idTipoDocumentoId !== 0)
                    ? factura.terceroVenta.idTipoDocumentoId
                    : DEFAULT_TIPO_DOC_NIT,
                terceroGeneral: factura.terceroVenta.terceroGeneral ?? false
            } : null
        };

        try {
            if (updatedFactura.idVenta) {
                console.log("Factura actualizada:", factura);
                setSuccessMessage("Factura actualizada correctamente");
                setShowSuccessDialog(true);
            } else {
                console.log("Factura a guardar:", updatedFactura);
                const result = await VentaService.create(updatedFactura);
                console.log("Factura guardada:", result);
                setSuccessMessage(
                    result.message || + "\nNúmero Documento Dian: " + result.numeroDocumentoDian
                );
                setShowSuccessDialog(true);

                const data = await VentaService.getById(result.idFactura);
                setSelectedFactura(data);
                setFactura({
                    ...factura,
                    idVenta: data?.idVenta ?? 0,
                    idTipoDocumento: data?.idTipoDocumento ?? 0,
                    codigoDocumento: data?.codigoDocumento ?? '',
                    nombreDocumento: data?.nombreDocumento ?? null,
                    estadoDian: data?.estadoDian ?? null,
                    idFormaPago: data?.idFormaPago ?? 1,
                    numeroVenta: data?.numeroVenta ?? 0,
                    prefijoVenta: data?.prefijoVenta ?? '',
                    fechaVenta: data?.fechaVenta ?? '',
                    plazoDias: data?.plazoDias ?? 0,
                    fechaVencimiento: data?.fechaVencimiento ?? data?.fechaVenta ?? '',
                    esBorrador: data?.esBorrador ?? false,
                    idPuntoVenta: data?.idPuntoVenta ?? null,
                    idUsuario: data?.idUsuario ?? null,
                    totalRegistros: data?.totalRegistros ?? 0,
                    cantidadProductos: data?.cantidadProductos ?? 0,
                    totalPrecio: data?.totalPrecio ?? 0,
                    totalDescuento: data?.totalDescuento ?? 0,
                    totalBaseIva: data?.totalBaseIva ?? 0,
                    totalIva: data?.totalIva ?? 0,
                    totalVenta: data?.totalVenta ?? 0,
                    terceroVenta: data?.terceroVenta ?? {
                        idTercero: 0,
                        idTipoDocumentoId: DEFAULT_TIPO_DOC_NIT,
                        digitoVerificacion: null,
                        numeroIdentificacion: '',
                        primerNombre: '',
                        primerApellido: '',
                        razonSocial: '',
                        emailTercero: null,
                        terceroGeneral: false
                    },
                    detalleVenta: data?.detalleVenta ?? [],
                    mediosPagoVenta: data?.mediosPagoVenta ?? [],
                });

                const dataPrint = await VentaService.printById(result.idFactura);
                setFacturaModalData(dataPrint);
                setShowFacturaModal(true);
            }
        } catch (error) {
            console.error('Error al guardar la factura:', error);
        }
    };

    // Funciones del carrito
    const addToCart = (product: IProducto) => {
        setFactura(prev => {
            const detalleVentaActual = prev.detalleVenta ?? [];
            const existingItemIndex = detalleVentaActual.findIndex(item =>
                (Number(product.idProducto ?? 0) > 0 && item.idProducto === Number(product.idProducto))
                || (Boolean(product.codigoProducto) && item.codigoProducto === product.codigoProducto)
            );

            if (existingItemIndex !== -1) {
                return {
                    ...prev,
                    detalleVenta: detalleVentaActual.map((item, index) =>
                        index === existingItemIndex
                            ? recalculateVentaDetalle(item, Number(item.cantidadVenta ?? 0) + 1)
                            : item
                    ),
                };
            }

            const siguienteRegistro = detalleVentaActual.reduce(
                (maxRegistro, item) => Math.max(maxRegistro, Number(item.registroVenta) || 0),
                0
            ) + 1;
            const nuevoDetalle = buildVentaDetalle(product, 1, siguienteRegistro);
            return {
                ...prev,
                detalleVenta: [...detalleVentaActual, nuevoDetalle],
            };
        });
    };

    const updateQuantity = (registroVenta: number, change: number) => {
        setFactura(prev => ({
            ...prev,
            detalleVenta: (prev.detalleVenta ?? []).map(item => {
                return item.registroVenta === registroVenta
                    ? recalculateVentaDetalle(item, Number(item.cantidadVenta ?? 0) + change)
                    : item;
            })
        }));

    };

    const removeFromCart = (registroVenta: number) => {
        setFactura(prev => ({
            ...prev,
            detalleVenta: (prev.detalleVenta ?? []).filter(item => item.registroVenta !== registroVenta)
        }));
    };

    const formatCurrency = (amount: number | null | undefined): string => {
        // Si el monto es nulo o indefinido, retorna "0.00"
        if (amount === null || amount === undefined) {
            return '0.00';
        }

        // Si el monto es un número
        try {
            return amount.toLocaleString('es-CO', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        } catch (error) {
            console.error('Error formatting currency:', error);
            return '0.00';
        }
    };

    // Cálculos
    const [montoIngresado, setMontoIngresado] = useState<number>(0);
    const [cambioEfectivo, setCambioEfectivo] = useState<number>(0);
    const subtotal = factura.detalleVenta?.reduce((sum, item) => sum + ((item.precioUnitarioVenta ?? 0) * (item.cantidadVenta ?? 0)), 0);
    const discount = factura.detalleVenta?.reduce((descuento, item) => descuento + (item.descuentoVenta ?? 0), 0);

    // Eliminamos el IVA y ReteIVA de los cálculos
    const tax = 0;
    const totalReteIva = 0;

    const totalReteRenta = factura.detalleVenta?.reduce((reteRenta, item) => reteRenta + (item.reteRentaVenta || 0), 0);
    const totalReteIca = factura.detalleVenta?.reduce((reteIca, item) => reteIca + (item.reteIcaVenta || 0), 0);

    // Total final: Subtotal - Descuento - Retefuente - ReteICA
    const total = (subtotal || 0) - (discount || 0) - (totalReteRenta || 0) - (totalReteIca || 0);
    const totalPagado = esCredito
        ? 0
        : factura.mediosPagoVenta?.reduce((acc, curr) => acc + (curr.valorMedioPago || 0), 0) || 0;
    const saldoPendiente = Math.max(0, total - totalPagado);
    const esEfectivo = activePaymentMethod === '1';
    const efectivoAgregado = factura.mediosPagoVenta?.some(
        medioPago => medioPago.idMedioPago === 1
    ) ?? false;
    const cambioCalculado = efectivoAgregado ? cambioEfectivo : 0;
    const totalItems = factura.detalleVenta?.reduce((sum, item) => sum + (item.cantidadVenta ?? 0), 0);
    const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10
    const handlePaymentModalChange = (open: boolean) => {
        if (open && facturaValidadaDian) return;
        setShowPayment(open);
        if (!open) return;

        const idMedioPago = tipoDocumentoSeleccionado?.idMedioPago;
        setActivePaymentMethod(idMedioPago != null ? String(idMedioPago) : '');
        if (factura.idFormaPago === 1) {
            setMontoIngresado(total);
        }
    };

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Panel Superior */}
            <div className="w-full border-b bg-card px-4 py-2.5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-foreground ml-0 sm:ml-2">
                            Documento Soporte
                        </h1>
                    </div>

                    {/* Lado derecho*/}
                    <div className="flex items-center gap-3">


                        <Badge className="flex items-center gap-2 px-3.5 py-1 text-sm bg-primary text-primary-foreground shadow-sm">
                            <span className="font-normal opacity-90 text-xs uppercase tracking-wider">Total:</span>
                            <span className="font-bold text-base">${formatCurrency(total)}</span>
                        </Badge>
                        <Badge variant="outline" className="px-2.5 py-1 text-xs font-medium">
                            Artículos: {totalItems ?? 0}
                        </Badge>

                        {(selectedFactura || documentoSoporteCargado) && (
                            <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium">
                                {documentoSoporteCargado
                                    ? facturaValidadaDian ? 'Validado DIAN' : 'Pendiente DIAN'
                                    : factura.estadoDian?.trim() || 'Pendiente DIAN'}
                            </Badge>
                        )}

                        {/* Select de vendedor */}
                        <div className="flex items-center gap-2">
                            <Label htmlFor="vendedor-select" className="text-xs font-medium text-muted-foreground whitespace-nowrap hidden sm:inline">
                                Vendedor:
                            </Label>
                            <Select
                                value={vendedorSeleccionado.toString()}
                                onValueChange={(value) => setVendedorSeleccionado(parseInt(value))}
                            >
                                <SelectTrigger className="h-9 w-32 text-xs" id="vendedor-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendedores.map(vendedor => (
                                        <SelectItem key={vendedor.id} value={vendedor.id.toString()} className="text-xs">
                                            {vendedor.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="default"
                            size="icon"
                            title="Nueva factura"
                            onClick={() => handleNew()}
                            className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>

                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" title="Buscar documento" className="h-9 w-9">
                                    <Search className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Buscar documento</DialogTitle>
                                </DialogHeader>
                                {/* Input de búsqueda */}
                                <Input
                                    className="mb-4"
                                    placeholder="Buscar por número de documento, nombre cliente o número identificación"
                                    value={searchDocumento}
                                    onChange={e => setSearchDocumento(e.target.value)}
                                />
                                <div className="overflow-x-auto max-h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Documento</TableHead>
                                                <TableHead>Número Documento</TableHead>
                                                <TableHead>Número Identificación</TableHead>
                                                <TableHead>Nombre Cliente</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {documentosLista
                                                .filter(
                                                    doc =>
                                                        doc.numeroDocumento?.toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        doc.nombreCliente?.toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        doc.numeroIdentificacion?.toString().includes(searchDocumento.toLowerCase()) ||
                                                        doc.documento?.toLowerCase().includes(searchDocumento.toLowerCase())
                                                )
                                                .map((doc) => (
                                                    <TableRow
                                                        key={doc.idVenta}
                                                        className="cursor-pointer hover:bg-primary/10"
                                                        onClick={() => handleSelectVenta(doc)}
                                                    >
                                                        <TableCell>{doc.documento}</TableCell>
                                                        <TableCell>{doc.numeroDocumento}</TableCell>
                                                        <TableCell>{doc.numeroIdentificacion}</TableCell>
                                                        <TableCell>{doc.nombreCliente}</TableCell>
                                                        <TableCell>{doc.totalVenta}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {isLoadingProducts && (
                                        <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                    )}
                                    {productError && (
                                        <div className="text-center text-red-500 py-4">{productError}</div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>



                        <Button
                            variant="destructive"
                            size="icon"
                            title="Salir"
                            onClick={() => {
                                navigate('/main-menu');
                            }}
                            className="h-9 w-9 shadow-sm transition-all"
                        >
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Panel Izquierdo - Carrito (70%) */}
                <div className="w-[70%] flex flex-col h-[calc(100vh-80px)]">
                    {/* Header del Carrito */}
                    <div className="p-3 border-b h-[60px] shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-normal">Tipo de documento</h2>
                                <select
                                    className="rounded border px-3 py-2 text-sm bg-background w-80 font-bold"
                                    value={factura.idTipoDocumentoExterno?.toString() || ''}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        if (!selectedId) return;

                                        const selectedTipoDocumento = tiposDocumento.find(
                                            (td) => Number(td.idTipoDocumentoExterno) === selectedId
                                        );
                                        if (!selectedTipoDocumento) return;

                                        setFactura((prev) => ({
                                            ...prev,
                                            idTipoDocumentoExterno: selectedId,
                                            idTipoDocumento: selectedTipoDocumento?.idTipoDocumento || 0,
                                            idMetodoDian: selectedTipoDocumento?.idMetodoDian || 0,
                                            idFormaPago: selectedTipoDocumento?.idFormaPago || 0,
                                            prefijoVenta: selectedTipoDocumento.prefijoConsecutivo || '',
                                        }));
                                    }}
                                    required
                                >
                                    {tiposDocumento.map((td) => (
                                        <option key={td.idTipoDocumentoExterno} value={td.idTipoDocumentoExterno}>
                                            {`${td.nombreTipoDocumentoExterno || ''} - ${td.codigoTipoDocumentoExterno || ''}`}
                                        </option>
                                    ))}
                                </select>
                                <h2 className="text-sm font-normal">Prefijo</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={factura.prefijoVenta || ''}
                                    onChange={(e) => setFactura({ ...factura, prefijoVenta: e.target.value })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                    value={factura.numeroVenta || ''}
                                    onChange={(e) => setFactura({ ...factura, numeroVenta: parseInt(e.target.value) })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Fecha</h2>
                                <input
                                    type="date"
                                    className="rounded border px-3 py-2 text-sm bg-background w-30"
                                    value={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setFactura({ ...factura, fechaVenta: e.target.value })}
                                    readOnly
                                />
                            </div>

                            {/* Indicador de Escaneo */}
                            {/* {barcodeBuffer && (
                                <div className="flex items-center space-x-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg border shadow-lg">
                                    <Scan className="h-4 w-4 animate-pulse text-primary" />
                                    <span className="text-sm font-mono">{barcodeBuffer}</span>
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* Panel de Cliente */}

                    <div className="border-b bg-muted/50">
                        <div className="flex items-center gap-2 ml-3 mt-2 mb-2 mr-2">
                            <h2 className="text-sm font-normal">Cliente</h2>
                            <div className="grid grid-cols-6 gap-1">
                                <select
                                    className="w-full rounded border px-2 py-2 text-sm bg-background w-42"
                                    value={factura.terceroVenta?.idTipoDocumentoId ?? 0}
                                    onChange={(e) => setFactura(prev => ({
                                        ...prev,
                                        terceroVenta: buildVentaTercero({
                                            ...(prev.terceroVenta ?? buildVentaTercero()),
                                            idTipoDocumentoId: Number.parseInt(e.target.value, 10) || 0
                                        })
                                    }))}
                                    required
                                >
                                    {tiposDocumentoIdentidad.map(cat => (
                                        <option key={cat.idTipoDocumentoId} value={cat.idTipoDocumentoId}>
                                            {cat.nombreTipoDocumentoId} ({cat.codigoTipoDocumentoId})
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    placeholder="Número de Identificación"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.numeroIdentificacion ?? ''}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        setFactura(prev => ({
                                            ...prev,
                                            terceroVenta: buildVentaTercero({
                                                ...(prev.terceroVenta ?? buildVentaTercero()),
                                                idTercero: value === prev.terceroVenta?.numeroIdentificacion
                                                    ? prev.terceroVenta?.idTercero ?? 0
                                                    : 0,
                                                numeroIdentificacion: value
                                            })
                                        }));
                                        // Buscar tercero después de un pequeño delay para evitar muchas búsquedas
                                        if (value.length >= 3) {
                                            handleSearchTercero(value);
                                        }
                                        void fetchProducts(value);
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => {
                                        void handleValidarTercero();
                                    }}
                                />
                                <Input
                                    placeholder="Primer Nombre"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.primerNombre ?? ''}
                                    onChange={(e) => setFactura(prev => ({
                                        ...prev,
                                        terceroVenta: buildVentaTercero({
                                            ...(prev.terceroVenta ?? buildVentaTercero()),
                                            primerNombre: e.target.value
                                        })
                                    }))}
                                />
                                <Input
                                    placeholder="Primer Apellido"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.primerApellido ?? ''}
                                    onChange={(e) => setFactura(prev => ({
                                        ...prev,
                                        terceroVenta: buildVentaTercero({
                                            ...(prev.terceroVenta ?? buildVentaTercero()),
                                            primerApellido: e.target.value
                                        })
                                    }))}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.emailTercero ?? ''}
                                    onChange={(e) => setFactura(prev => ({
                                        ...prev,
                                        terceroVenta: buildVentaTercero({
                                            ...(prev.terceroVenta ?? buildVentaTercero()),
                                            emailTercero: e.target.value
                                        })
                                    }))}
                                />
                                <Input
                                    placeholder="Razón Social"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.razonSocial ?? ''}
                                    onChange={(e) => setFactura(prev => ({
                                        ...prev,
                                        terceroVenta: buildVentaTercero({
                                            ...(prev.terceroVenta ?? buildVentaTercero()),
                                            razonSocial: e.target.value
                                        })
                                    }))}
                                />
                            </div>
                            <Dialog open={openDialogTercero} onOpenChange={setOpenDialogTercero}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" title="Buscar cliente">
                                        <Search className="w-8 h-8" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle>Buscar cliente</DialogTitle>
                                    </DialogHeader>
                                    {/* Input de búsqueda */}
                                    <Input
                                        className="mb-4"
                                        placeholder="Buscar por número o nombre o apellido o razon social..."
                                        value={searchTercero}
                                        onChange={e => setSearchTercero(e.target.value)}
                                    />
                                    <div className="overflow-x-auto max-h-[400px]">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Número Identificación</TableHead>
                                                    <TableHead>Primer Nombre</TableHead>
                                                    <TableHead>Primer Apellido</TableHead>
                                                    <TableHead>Razón Social</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {terceros
                                                    .filter(
                                                        cliente =>
                                                            cliente.numeroIdentificacion?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                                                            cliente.razonSocial?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                                                            cliente.primerNombre?.toLowerCase().includes(searchTercero.toLowerCase()) ||
                                                            cliente.primerApellido?.toLowerCase().includes(searchTercero.toLowerCase())
                                                    )
                                                    .map((cliente) => (
                                                        <TableRow
                                                            key={cliente.idTercero}
                                                            className="cursor-pointer hover:bg-primary/10"
                                                            onClick={() => handleSelectTercero(cliente)}
                                                        >
                                                            <TableCell>{cliente.numeroIdentificacion}</TableCell>
                                                            <TableCell>{cliente.primerNombre}</TableCell>
                                                            <TableCell>{cliente.primerApellido}</TableCell>
                                                            <TableCell>{cliente.razonSocial}</TableCell>
                                                        </TableRow>
                                                    ))}
                                            </TableBody>
                                        </Table>
                                        {isLoadingTerceros && (
                                            <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                        )}
                                        {terceroError && (
                                            <div className="text-center text-red-500 py-4">{terceroError}</div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Button
                                variant="outline"
                                size="icon"
                                title="Diligenciar información ampliada del tercero"
                                onClick={() => navigate('/terceros', {
                                    state: {
                                        from: 'pos',
                                        factura,
                                        crearTercero: factura.terceroVenta?.idTercero === parametrosVentaDefault?.terceroVenta?.[0]?.idTercero
                                    }
                                })}
                            >
                                <FileText className="w-5 h-5" />
                            </Button>
                        </div>

                    </div>

                    {/* Panel de Información Adicional */}
                    <div className="border-b bg-muted/50">
                        <div className="flex items-center gap-2 ml-3 mt-2 mb-2 mr-2">
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 w-full">
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Observaciones:</Label>
                                    <Input
                                        placeholder="Observaciones"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={factura.observaciones || ''}
                                        onChange={(e) => setFactura({
                                            ...factura,
                                            observaciones: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Orden Ref:</Label>
                                    <Input
                                        placeholder="Orden Referencia"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={factura.ordenReferencia || ''}
                                        onChange={(e) => setFactura({
                                            ...factura,
                                            ordenReferencia: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Fecha Ref:</Label>
                                    <Input
                                        type="date"
                                        placeholder="Fecha Orden Referencia"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={factura.fechaOrdenReferencia || ''}
                                        onChange={(e) => setFactura({
                                            ...factura,
                                            fechaOrdenReferencia: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Fecha Inicial del Servicio:</Label>
                                    <Input
                                        type="date"
                                        placeholder="Fecha Inicial del Servicio"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={factura.fechaInicialServicio || ''}
                                        onChange={(e) => setFactura({
                                            ...factura,
                                            fechaInicialServicio: e.target.value
                                        })}
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Fecha Final del Servicio:</Label>
                                    <Input
                                        type="date"
                                        placeholder="Fecha Final del Servicio"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={factura.fechaFinalServicio || ''}
                                        onChange={(e) => setFactura({
                                            ...factura,
                                            fechaFinalServicio: e.target.value
                                        })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {!(factura.detalleVenta ?? []).length ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-muted-foreground font-medium">Carrito vacío</p>
                                <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {(factura.detalleVenta ?? []).map(item => (
                                    <Card key={item.registroVenta} className="p-1">
                                        <div className="flex items-center justify-between">
                                            {/* Información del producto */}
                                            <div className="flex-1 min-w-0">
                                                {item.idTipoProducto === 2 ? (
                                                    <Input
                                                        value={item.nombreProducto ?? ''}
                                                        onChange={(e) => {
                                                            setFactura({
                                                                ...factura,
                                                                detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                    detalleItem.registroVenta === item.registroVenta
                                                                        ? { ...detalleItem, nombreProducto: e.target.value }
                                                                        : detalleItem
                                                                )
                                                            });
                                                        }}
                                                        className="font-medium text-sm max-w-xl"
                                                        placeholder="Nombre del producto"
                                                    />
                                                ) : (
                                                    <h4 className="font-medium text-sm truncate">{item.nombreProducto}</h4>
                                                )}
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">{item.codigoProducto}</Badge>
                                                    {item.idTipoProducto === 2 ? (
                                                        <Input
                                                            type="number"
                                                            value={item.precioUnitarioVenta || ''}
                                                            onChange={(e) => {
                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.registroVenta === item.registroVenta
                                                                            ? { ...detalleItem, precioUnitarioVenta: parseFloat(e.target.value) || 0 }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            className="text-sm text-muted-foreground w-24"
                                                            placeholder="Precio"
                                                            min={0}
                                                            onFocus={(e) => e.target.select()}
                                                        />
                                                    ) : (
                                                        <span className="text-sm text-muted-foreground">${formatCurrency(item.precioUnitarioVenta)}</span>
                                                    )}
                                                    <div className="flex items-center space-x-1">
                                                        <Checkbox
                                                            id={`muestra-${item.registroVenta}`}
                                                            checked={item.indicadorMuestra || false}
                                                            onCheckedChange={(checked) => {
                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.registroVenta === item.registroVenta
                                                                            ? { ...detalleItem, indicadorMuestra: checked as boolean }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                        />
                                                        <Label
                                                            htmlFor={`muestra-${item.registroVenta}`}
                                                            className="text-xs cursor-pointer"
                                                        >
                                                            Es una Muestra?
                                                        </Label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Contenedor para campos alineados */}
                                            <div className="flex items-end gap-2">
                                                {/* Campos de Descuento, Retefuente y Reteica */}
                                                <div className="flex gap-2">
                                                    {/* % Descuento */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeDescuentoVenta || ''}
                                                            onChange={(e) => {
                                                                const pctDesc = parseFloat(e.target.value) || 0;
                                                                const baseCalculada = parseFloat(((item.cantidadVenta ?? 0) * (item.precioUnitarioVenta ?? 0) - pctDesc / 100).toFixed(2));
                                                                const valorDescuento = parseFloat((((item.precioUnitarioVenta ?? 0) * (item.cantidadVenta ?? 0)) * (pctDesc / 100)).toFixed(2));

                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                porcentajeDescuentoVenta: pctDesc,
                                                                                descuentoVenta: valorDescuento,
                                                                                reteRentaVenta: parseFloat((baseCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                                                                                baseReteRenta: baseCalculada,
                                                                                reteIcaVenta: parseFloat(((baseCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* Valor Descuento */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.descuentoVenta || ''}
                                                            onChange={(e) => {
                                                                const valDesc = parseFloat(e.target.value) || 0;
                                                                const baseCalculada = parseFloat(((item.cantidadVenta ?? 0) * (item.precioUnitarioVenta ?? 0) - (item.porcentajeDescuentoVenta || 0) / 100).toFixed(2));

                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                descuentoVenta: valDesc,
                                                                                reteRentaVenta: parseFloat((baseCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                                                                                baseReteRenta: baseCalculada,
                                                                                reteIcaVenta: parseFloat(((baseCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* % RETEFUENTE */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Retefuente</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeReteRenta || ''}
                                                            onChange={(e) => {
                                                                const pctRete = parseFloat(e.target.value) || 0;
                                                                const baseCalculada = ((item.cantidadVenta ?? 0) * (item.precioUnitarioVenta ?? 0)) - (item.descuentoVenta ?? 0);
                                                                const valorRetefuente = parseFloat((baseCalculada * (pctRete / 100)).toFixed(2));

                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                porcentajeReteRenta: pctRete,
                                                                                reteRentaVenta: valorRetefuente,
                                                                                baseReteRenta: baseCalculada
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* VALOR RETEFUENTE */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Retefuente</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.reteRentaVenta || ''}
                                                            onChange={(e) => {
                                                                const valRete = parseFloat(e.target.value) || 0;
                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, reteRentaVenta: valRete }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* % RETEICA */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% ReteICA</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeReteIca || ''}
                                                            onChange={(e) => {
                                                                const pctIca = parseFloat(e.target.value) || 0;
                                                                const baseCalculada = ((item.cantidadVenta ?? 0) * (item.precioUnitarioVenta ?? 0)) - (item.descuentoVenta ?? 0);
                                                                // Cálculo estándar ReteICA (por mil): (base * pct) / 1000
                                                                const valorReteIca = parseFloat(((baseCalculada * pctIca) / 1000).toFixed(2));

                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                porcentajeReteIca: pctIca,
                                                                                reteIcaVenta: valorReteIca
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            min={0}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* VALOR RETEICA */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor ReteICA</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.reteIcaVenta || ''}
                                                            onChange={(e) => {
                                                                const valIca = parseFloat(e.target.value) || 0;
                                                                setFactura(prev => ({
                                                                    ...prev,
                                                                    detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, reteIcaVenta: valIca }
                                                                            : detalleItem
                                                                    )
                                                                }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Separador visual */}
                                                <div className="w-px h-8 bg-border"></div>

                                                {/* Controles de cantidad, precio y eliminar */}
                                                <div className="flex items-end gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-center">Cantidad</span>
                                                        <div className="flex items-center">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.registroVenta, -1)}
                                                                className="h-8 w-8 rounded-r-none"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                value={item.cantidadVenta ?? ''}
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newQuantity = value === '' ? 0 : Number(value);
                                                                    if (Number.isFinite(newQuantity)) {
                                                                        setFactura(prev => ({
                                                                            ...prev,
                                                                            detalleVenta: (prev.detalleVenta ?? []).map(detalleItem =>
                                                                                detalleItem.registroVenta === item.registroVenta
                                                                                    ? recalculateVentaDetalle(detalleItem, newQuantity)
                                                                                    : detalleItem
                                                                            )
                                                                        }));
                                                                    }
                                                                }}
                                                                className="w-16 h-8 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.registroVenta, 1)}
                                                                className="h-8 w-8 rounded-l-none"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 whitespace-nowrap text-center">Valor Total</span>
                                                        <span className="font-bold text-primary min-w-[80px] text-right h-8 flex items-center justify-end">
                                                            ${formatCurrency(((item.precioUnitarioVenta ?? 0) * (item.cantidadVenta ?? 0)) - (item.descuentoVenta ?? 0) + (item.ivaVenta ?? 0))}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-transparent">Eliminar</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFromCart(item.registroVenta)}
                                                            className="text-destructive hover:text-destructive h-8 w-8"
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Panel de Totales y Pago */}
                    {(factura.detalleVenta ?? []).length > 0 && (
                        <div className="border-t flex flex-col h-[400px]" >
                            <div className="h-[100px] overflow-y-auto">
                                {/* Totales */}
                                <div className="p-2 space-y-2">
                                    {/* Resumen en dos columnas */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Primera columna - Subtotal y Descuento */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Subtotal</span>
                                                <span>${formatCurrency(subtotal)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">Descuento</span>
                                                <span>${formatCurrency(discount)}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">ReteFuente</span>
                                                <span>${formatCurrency(totalReteRenta)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">ReteICA</span>
                                                <span>${formatCurrency(totalReteIca)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Pago */}
                            <div className="payment-button-container h-[60px] p-2 border-t bg-background">
                                <div className="flex gap-2 h-[44px]">
                                    {/* Botón anterior de borrador conservado como referencia:
                                    <Button
                                        onClick={() => {
                                            handleSaveVenta(true);
                                        }}
                                        variant="outline"
                                        className="flex-1 h-full text-sm font-bold"
                                        size="lg"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Guardar Borrador
                                    </Button>
                                    */}
                                    {facturaValidadaDian && !documentoSoporteCargado ? (
                                        <FacturaModal
                                            key={factura.idVenta}
                                            facturaData={facturaModalData ?? undefined}
                                            triggerText="Ver Factura"
                                            triggerVariant="default"
                                            triggerClassName="flex-1 h-full text-sm font-bold gap-2"
                                            idVenta={factura.idVenta}
                                            idMetodoDian={factura?.idMetodoDian || 0}
                                        />
                                    ) : documentoSoporteCargado ? (
                                        <Button
                                            variant={facturaValidadaDian ? "outline" : "default"}
                                            disabled
                                            className="flex-1 h-full text-sm font-bold"
                                            size="lg"
                                            title={facturaValidadaDian
                                                ? "La impresión de documentos soporte requiere el endpoint PDF correspondiente"
                                                : "El documento soporte cargado no se puede procesar desde el flujo de ventas"}
                                        >
                                            {facturaValidadaDian ? (
                                                <>
                                                    <Printer className="h-4 w-4 mr-2" />
                                                    Imprimir Documento Soporte
                                                </>
                                            ) : (
                                                <>
                                                    <Check className="h-4 w-4 mr-2" />
                                                    Procesar Documento Soporte
                                                </>
                                            )}
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() => handlePaymentModalChange(true)}
                                            disabled={!(total > 0) || facturaValidadaDian}
                                            className="flex-1 h-full text-sm font-bold"
                                            size="lg"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Procesar Documento Soporte
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Panel Derecho - Productos (30%) */}
                <div className="w-[30%] border-l bg-card flex flex-col">
                    {/* Header */}
                    <div className="border-b p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-10 w-full"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                    </div>


                    {/* Categorías */}
                    <div className="border-b p-2 h-[80px]">
                        <Tabs value={selectedCategory.toString()} onValueChange={setSelectedCategory} className="w-full">
                            <TabsList className="flex flex-wrap gap-1 h-full">
                                {categories.map((category, index) => {
                                    // Garantizamos que la variable empiece por mayúscula para que React la trate como componente JSX
                                    const RenderIcon = category.icon || resolveCategoryIcon(category.iconoCategoria) || Package;

                                    return (
                                        <TabsTrigger
                                            key={category.idCategoria ?? index}
                                            value={category.idCategoria?.toString() ?? ""}
                                            disabled={isLoadingCategories}
                                            className="flex items-center space-x-1 px-2 py-1 flex-1 min-w-[calc(33.33%-4px)]"
                                        >
                                            <RenderIcon className="h-4 w-4 shrink-0" />
                                            <span className="text-sm">{category.nombreCategoria}</span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Grid de Productos */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Agregamos index en los argumentos del map: (product, index) */}
                            {filteredProducts.map((product, index) => (
                                <Card
                                    key={`${product.idProducto}-${index}`}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${(product.stockActualProducto ?? 0) <= 0 ? 'border-destructive/50' : ''
                                        }`}
                                    onClick={() => addToCart(product)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="text-xs">
                                                {product.codigoProducto}
                                            </Badge>

                                        </div>
                                    </CardHeader>

                                    <CardContent className="text-center space-y-2">

                                        <CardTitle className="text-sm leading-tight line-clamp-2">
                                            {product.nombreProducto}
                                        </CardTitle>

                                    </CardContent>

                                    <CardFooter className="flex flex-col space-y-2 pt-2">
                                        <div className="text-lg font-bold text-primary">
                                            ${formatCurrency(product.precioPos)}
                                        </div>

                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal de Pago */}
                <Dialog open={showPayment} onOpenChange={handlePaymentModalChange}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl mb-4">Seleccionar métodos y forma de pago</DialogTitle>
                        </DialogHeader>

                        <div className="mb-4">
                            <Label className="mb-2 block text-sm font-medium">Forma de pago</Label>
                            <Select
                                value={factura.idFormaPago?.toString() || ""}
                                disabled={facturaValidadaDian}
                                onValueChange={(value) => {
                                    const idForma = parseInt(value);
                                    const formaPago = formasPago.find(
                                        forma => forma.idFormaPago === idForma
                                    );
                                    const nombreNuevaFormaPago = formaPago?.nombreFormaPago?.trim().toLowerCase() ?? '';
                                    const esNuevaFormaCredito = ['crédito', 'credito'].includes(nombreNuevaFormaPago);
                                    const resetearPagos = idForma !== factura.idFormaPago
                                        && nombreNuevaFormaPago !== 'contado';
                                    const idMedioPagoPredeterminado = tipoDocumentoSeleccionado?.idMedioPago;
                                    const fechaDocumento = factura.fechaVenta || getLocalDate();
                                    const plazoDias = esNuevaFormaCredito
                                        ? Math.max(0, Number(factura.plazoDias ?? 30))
                                        : 0;

                                    setFactura(prev => ({
                                        ...prev,
                                        idFormaPago: idForma,
                                        plazoDias,
                                        fechaVencimiento: esNuevaFormaCredito
                                            ? addDaysToDate(fechaDocumento, plazoDias)
                                            : fechaDocumento,
                                        mediosPagoVenta: resetearPagos ? [] : prev.mediosPagoVenta
                                    }));
                                    if (resetearPagos || esNuevaFormaCredito) {
                                        setCambioEfectivo(0);
                                    }
                                    setActivePaymentMethod(idMedioPagoPredeterminado != null
                                        ? String(idMedioPagoPredeterminado)
                                        : '');
                                    setMontoIngresado(idForma === 1 ? total : 0);
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona forma de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    {formasPago.map(forma => (
                                        <SelectItem key={forma.idFormaPago} value={forma.idFormaPago.toString()}>
                                            {forma.nombreFormaPago}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {esCredito ? (
                            <div className="space-y-4 mb-4">
                                <div>
                                    <Label htmlFor="plazo-dias" className="mb-2 block text-sm font-medium">
                                        Días de plazo
                                    </Label>
                                    <Input
                                        id="plazo-dias"
                                        type="number"
                                        min={0}
                                        placeholder="0"
                                        value={factura.plazoDias ? String(factura.plazoDias) : ''}
                                        disabled={facturaValidadaDian}
                                        onChange={(e) => {
                                            const val = e.target.value;

                                            // Si el usuario borra todo el contenido, dejamos el plazo en 0
                                            if (val === '') {
                                                const fechaDocumento = factura.fechaVenta || getLocalDate();
                                                setFactura(prev => ({
                                                    ...prev,
                                                    plazoDias: 0,
                                                    fechaVencimiento: addDaysToDate(fechaDocumento, 0)
                                                }));
                                                return;
                                            }

                                            // Convertimos a entero para eliminar cualquier "0" a la izquierda (ej. "030" pasa a ser 30)
                                            const parsed = parseInt(val, 10);
                                            const plazoDias = isNaN(parsed) ? 0 : Math.max(0, parsed);
                                            const fechaDocumento = factura.fechaVenta || getLocalDate();

                                            setFactura(prev => ({
                                                ...prev,
                                                plazoDias,
                                                fechaVencimiento: addDaysToDate(fechaDocumento, plazoDias)
                                            }));
                                        }}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="fecha-vencimiento" className="mb-2 block text-sm font-medium">
                                        Fecha de vencimiento
                                    </Label>
                                    <Input
                                        id="fecha-vencimiento"
                                        type="date"
                                        value={factura.fechaVencimiento ?? ''}
                                        readOnly
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4 mb-4">
                                <div className="grid grid-cols-12 gap-2 items-end">
                                    <div className="col-span-6">
                                        <Label className="mb-2 block text-xs font-medium">Método de pago</Label>
                                        <Select
                                            value={activePaymentMethod}
                                            onValueChange={setActivePaymentMethod}
                                            disabled={facturaValidadaDian}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Seleccionar..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mediosPago.map(medioPago => (
                                                    <SelectItem key={medioPago.idMedioPago} value={medioPago.idMedioPago.toString()}>
                                                        {medioPago.nombreMedioPago}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="col-span-4">
                                        <Label className="mb-2 block text-xs font-medium">Monto</Label>
                                        <Input
                                            type="number"
                                            placeholder="0"
                                            value={montoIngresado || ''}
                                            disabled={facturaValidadaDian}
                                            onChange={(e) => {
                                                setMontoIngresado(Number(e.target.value));
                                                if (!esEfectivo) {
                                                    setCambioEfectivo(0);
                                                }
                                            }}
                                        />
                                    </div>

                                    <div className="col-span-2">
                                        <Button
                                            disabled={
                                                facturaValidadaDian ||
                                                !activePaymentMethod ||
                                                montoIngresado <= 0 ||
                                                saldoPendiente <= 0 ||
                                                (!esEfectivo && montoIngresado > saldoPendiente)
                                            }
                                            onClick={() => {
                                                const montoAplicado = esEfectivo
                                                    ? Math.min(montoIngresado, Math.max(saldoPendiente, 0))
                                                    : montoIngresado;
                                                const cambio = esEfectivo
                                                    ? Math.max(0, montoIngresado - Math.max(saldoPendiente, 0))
                                                    : 0;
                                                const nuevoMedioPago: IVentaMedioPago = {
                                                    idMedioPagoVenta: 0,
                                                    idMedioPago: parseInt(activePaymentMethod),
                                                    valorMedioPago: montoAplicado
                                                };

                                                setFactura(prev => ({
                                                    ...prev,
                                                    mediosPagoVenta: [...(prev.mediosPagoVenta || []), nuevoMedioPago]
                                                }));

                                                setActivePaymentMethod("");
                                                setMontoIngresado(0);
                                                setCambioEfectivo(cambio);
                                            }}
                                            className="w-full"
                                        >
                                            +
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Lista de medios de pago ingresados */}
                        {!esCredito && factura.mediosPagoVenta && factura.mediosPagoVenta.length > 0 && (
                            <div className="border rounded-md p-3 mb-4 space-y-2 max-h-32 overflow-y-auto">
                                <span className="text-xs text-muted-foreground font-medium block">Pagos agregados:</span>
                                {factura.mediosPagoVenta.map((item, index) => (
                                    <div key={index} className="flex justify-between items-center text-sm border-b pb-1">
                                        <span>{mediosPago.find(medioPago => medioPago.idMedioPago === item.idMedioPago)?.nombreMedioPago || 'Método'}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">${formatCurrency(item.valorMedioPago)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-6 w-6 p-0 text-red-500"
                                                onClick={() => {
                                                    setFactura(prev => ({
                                                        ...prev,
                                                        mediosPagoVenta: prev.mediosPagoVenta ? prev.mediosPagoVenta.filter((_, i) => i !== index) : []
                                                    }));
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Información del Cliente */}
                        {factura.terceroVenta?.primerApellido && (
                            <Alert className="mb-4">
                                <User className="h-4 w-4" />
                                <AlertDescription className="flex flex-col space-y-1">
                                    <span className="text-xs text-muted-foreground">Nombre Cliente</span>
                                    <div className="flex items-center justify-between">
                                        <span>{`${factura.terceroVenta.primerNombre} ${factura.terceroVenta.primerApellido}`}</span>
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Cómputo de Totales */}
                        <Card className="p-4 mb-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total a Pagar</span>
                                    <span className="text-xl font-bold">${formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Artículos</span>
                                    <span>{totalItems ?? 0}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-muted-foreground">Total Recibido</span>
                                    <span className="font-medium text-green-600">${formatCurrency(totalPagado)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm border-t pt-1">
                                    <span className="text-muted-foreground">Saldo</span>
                                    <span className={`font-bold ${saldoPendiente === 0 ? 'text-green-600' : 'text-red-500'}`}>
                                        ${formatCurrency(saldoPendiente)}
                                    </span>
                                </div>
                                {cambioCalculado > 0 && (
                                    <div className="flex justify-between items-center text-sm border-t pt-1 font-semibold text-green-700">
                                        <span>Cambio / Devuelto</span>
                                        <span>${formatCurrency(cambioCalculado)}</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Botones de acción */}
                        <DialogFooter className="flex space-x-2">
                            <Button
                                disabled={facturaValidadaDian || (!esCredito && saldoPendiente !== 0)} // En crédito no se exige pago inmediato
                                onClick={() => {
                                    setShowPayment(false);
                                    handleSaveVenta(false);
                                }}
                                className="flex-1"
                            >
                                Confirmar Pago
                            </Button>
                            <Button
                                variant="outline"
                                disabled={facturaValidadaDian}
                                onClick={() => setShowPayment(false)}
                            >
                                Cancelar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            {/* AlertDialog de éxito */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Todo ha salido bien!!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {successMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
                            Aceptar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </div >
    );
};

export default DocumentoSoporteMaster;