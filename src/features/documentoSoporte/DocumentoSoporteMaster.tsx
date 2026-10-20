import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Star, Scan, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen, FileText, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import { ProductoService } from '@/services/ProductoService';
import { TerceroService } from '@/services/TerceroService';
import { IProducto } from '@/types/IProducto';
import { ITercero } from '@/types/ITercero';
import { ITipoDocumento } from '@/types/ITipoDocumento';
import { TipoDocumentoService } from '@/services/TipoDocumentoService';
import { ITipoDocumentoIdentidad } from '@/types/ITipoDocumentoIdentidad';
import { TipoDocumentoIdentidadService } from '@/services/TipoDocumentoIdentidadService';
import { IVenta } from '@/types/IVenta';
import { IVentaDetalle } from '@/types/IVentaDetalle';
import { IVentaTercero } from '@/types/IVentaTercero';
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
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
import { VendedorService } from '@/services/VendedorService';
import { IVendedores } from '@/types/IVendedores';
import { IDocumentoSoporte } from '@/types/IDocumentoSoporte';
import { DocumentoSoporteService } from '@/services/DocumentoSoporteService';
import { IDetalleDocumentoSoporte } from '@/types/IDetalleDocumentoSoporte';
import { IDocumentoSoporteTercero } from '@/types/IDocumentoSoporteTercero';



const getLocalDate = (date = new Date()): string => {
    const offsetMs = date.getTimezoneOffset() * 60 * 1000;
    return new Date(date.getTime() - offsetMs).toISOString().split('T')[0];
};

const normalizeDateInputValue = (value?: string | null): string | null =>
    value ? value.split('T')[0] : null;

const addDaysToDate = (date: string, days: number): string => {
    const result = new Date(`${date}T00:00:00`);
    result.setDate(result.getDate() + days);
    return getLocalDate(result);
};

const emptyDocumentoSoporteTercero: IDocumentoSoporteTercero = {
    idTercero: 0,
    idTipoDocumentoId: 0,
    nombreTipoDocumentoId: null,
    numeroIdentificacion: '',
    primerNombre: '',
    primerApellido: '',
    razonSocial: '',
    emailTercero: null,
};

const buildDocumentoSoporteDetalle = (product: IProducto, quantity: number = 1, registroDsa: number = 1): IDetalleDocumentoSoporte => {
    const precioUnitario = Number(
        product.precioPos
        ?? (product as unknown as Record<string, unknown>).precioVenta
        ?? product.precioUnitario
        ?? 0
    );
    const cantidad = Number(quantity ?? 1);
    const porcentajeDescuento = Number(product.porcentajeMaxDescuento ?? 0);

    // Impuestos / Retenciones
    const porcentajeReteRenta = Number(product.porcentajeReteRenta ?? 0);
    const porcentajeReteIca = Number(product.porcentajeReteIca ?? 0);

    // CÁLCULOS
    const precioTotal = parseFloat((precioUnitario * cantidad).toFixed(2));
    const descuento = parseFloat(((precioTotal * porcentajeDescuento) / 100).toFixed(2));
    const total = parseFloat((precioTotal - descuento).toFixed(2));

    // Bases y Retenciones (Documento Soporte no requiere IVA ni Impoconsumo)
    const baseReteRenta = total;
    const reteRenta = parseFloat(((baseReteRenta * porcentajeReteRenta) / 100).toFixed(2));

    const baseReteIca = total;
    const reteIca = parseFloat((((baseReteIca * porcentajeReteIca) / 100) / 1000).toFixed(2));

    const costoUnitario = Number(precioUnitario);
    const costoTotal = parseFloat((costoUnitario * cantidad).toFixed(2));

    return {
        idDetalleDsa: 0,
        idDsa: 0,
        registroDsa,
        idProducto: Number(product.idProducto ?? 0),
        codigoProducto: product.codigoProducto ?? '',
        nombreProducto: product.nombreProducto ?? '',
        cantidadDsa: cantidad,
        precioUnitarioDsa: precioUnitario,
        precioTotalDsa: precioTotal,
        porcentajeDescuentoDsa: porcentajeDescuento,
        descuentoDsa: descuento,
        totalDsa: total,
        costoUnitarioDsa: costoUnitario,
        costoTotalDsa: costoTotal,
        porcentajeReteRenta: porcentajeReteRenta,
        baseReteRenta: baseReteRenta,
        reteRentaDsa: reteRenta,
        porcentajeReteIca: porcentajeReteIca,
        baseReteIca: baseReteIca,
        reteIcaDsa: reteIca,
        fechaGrabacionDetalleDsa: null,
        idTipoProducto: product.idTipoProducto,
    };
};

const createEmptyDocumentoSoporteDetalle = (): IDetalleDocumentoSoporte => ({
    idDetalleDsa: 0,
    idDsa: 0,
    registroDsa: -1,
    idProducto: 0,
    codigoProducto: '',
    nombreProducto: '',
    cantidadDsa: 1,
    precioUnitarioDsa: 0,
    precioTotalDsa: 0,
    porcentajeDescuentoDsa: 0,
    descuentoDsa: 0,
    totalDsa: 0,
    costoUnitarioDsa: 0,
    costoTotalDsa: 0,
    porcentajeReteRenta: 0,
    baseReteRenta: 0,
    reteRentaDsa: 0,
    porcentajeReteIca: 0,
    baseReteIca: 0,
    reteIcaDsa: 0,
    fechaGrabacionDetalleDsa: null,
    idTipoProducto: 2,
});

const buildVentaTercero = (values: Partial<IDocumentoSoporteTercero> = {}): IDocumentoSoporteTercero => ({
    ...emptyDocumentoSoporteTercero,
    ...values,
});

const recalculateDocumentoSoporteDetalle = (item: IDetalleDocumentoSoporte, newQuantity: number): IDetalleDocumentoSoporte => {
    const cantidad = Number(newQuantity);
    const precioUnitario = Number(item.precioUnitarioDsa ?? 0);
    const porcentajeDescuento = Number(item.porcentajeDescuentoDsa ?? 0);

    const precioTotal = parseFloat((precioUnitario * cantidad).toFixed(2));
    const descuento = parseFloat(((precioTotal * porcentajeDescuento) / 100).toFixed(2));
    const total = parseFloat((precioTotal - descuento).toFixed(2));

    const porcentajeReteRenta = Number(item.porcentajeReteRenta ?? 0);
    const baseReteRenta = total;
    const reteRenta = parseFloat(((baseReteRenta * porcentajeReteRenta) / 100).toFixed(2));

    const porcentajeReteIca = Number(item.porcentajeReteIca ?? 0);
    const baseReteIca = total;
    const reteIca = parseFloat((((baseReteIca * porcentajeReteIca) / 100) / 1000).toFixed(2));

    const costoUnitario = Number(item.costoUnitarioDsa ?? precioUnitario);
    const costoTotal = parseFloat((costoUnitario * cantidad).toFixed(2));

    return {
        ...item,
        cantidadDsa: cantidad,
        precioTotalDsa: precioTotal,
        descuentoDsa: descuento,
        totalDsa: total,
        costoTotalDsa: costoTotal,
        baseReteRenta: baseReteRenta,
        reteRentaDsa: reteRenta,
        baseReteIca: baseReteIca,
        reteIcaDsa: reteIca,
    };
};

const DocumentoSoporteMaster = () => {
    const navigate = useNavigate();

    const [documentoSoporte, setDocumentoSoporte] = useState<IDocumentoSoporte>({
        idDsa: 0,
        idTipoDocumentoDsa: 0,
        numeroDsa: 0,
        prefijoDsa: '',
        idTerceroDsa: 0,
        fechaDsa: getLocalDate(),
        plazoDiasDsa: 0,
        fechaVencimientoDsa: getLocalDate(),
        idUsuario: 1,
        idFormaPagoDsa: 2,
        ordenReferenciaDsa: null,
        fechaOrdenReferenciaDsa: null,
        observacionesDsa: null,
        totalRegistrosDsa: 0,
        cantidadProductosDsa: 0,
        totalPrecioDsa: 0,
        totalDescuentoDsa: 0,
        totalDsa: 0,
        cufe: null,
        firmaDigital: null,
        fechaHoraAutorizacion: null,
        idResolucionDsa: null,
        idResponseDianDsa: null,
        totalBaseReteRentaDsa: 0,
        totalReteRentaDsa: 0,
        totalBaseReteIcaDsa: 0,
        totalReteIcaDsa: 0,
        idTipoOperacionDian: null,
        idTipoDocumentoExterno: null,
        fechaInicialServicio: null,
        idMetodoDian: 5,
        fechaFinalServicio: null,
        estadoDian: null,
        fechaGrabacionDsa: null,
        terceroDsa: buildVentaTercero(),
        detalleDsa: [],
    });

    const [selectedDocumentoSoporte, setSelectedDocumentoSoporte] = useState<IDocumentoSoporte | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
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
    const [products, setProducts] = useState<IProducto[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [draftItem, setDraftItem] = useState<IDetalleDocumentoSoporte>(createEmptyDocumentoSoporteDetalle);
    const [terceros, setTerceros] = useState<ITercero[]>([]);
    const [isLoadingTerceros, setIsLoadingTerceros] = useState(true);
    const [terceroError, setTerceroError] = useState<string | null>(null);
    const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([]);
    const [isLoadingTiposDocumento, setIsLoadingTiposDocumento] = useState(true);
    const [tipoDocumentoError, setTipoDocumentoError] = useState<string | null>(null);
    const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<ITipoDocumentoIdentidad[]>([]);
    const [isLoadingTipos, setIsLoadingTipos] = useState(true);
    const [tipoError, setTipoError] = useState<string | null>(null);
    const [isLoadingDocumentoSoporte, setIsLoadingDocumentoSoporte] = useState(true);
    const [documentosSoporte, setDocumentosSoporte] = useState<IDocumentoSoporte[]>([]);
    const [documentoSoporteError, setDocumentoSoporteError] = useState<string | null>(null);
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
    const [showDocumentoSoporteModal, setShowDocumentoSoporteModal] = useState(false);
    const [documentoSoporteModalData, setDocumentoSoporteModalData] = useState<any>(null);
    const [searchTercero, setSearchTercero] = useState("");
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(1);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const selectedFormaPago = formasPago.find(
        forma => forma.idFormaPago === documentoSoporte.idFormaPagoDsa
    );

    const idTipoDocumentoExternoSeleccionado = Number(documentoSoporte.idTipoDocumentoExterno ?? 0);
    const tipoDocumentoSeleccionado = (
        idTipoDocumentoExternoSeleccionado > 0
            ? tiposDocumento.find(tipo =>
                Number(tipo.idTipoDocumentoExterno) === idTipoDocumentoExternoSeleccionado
            )
            : undefined
    ) ?? tiposDocumento.find(
        tipo => Number(tipo.idTipoDocumento) === Number(documentoSoporte.idTipoDocumentoDsa)
    ) ?? (
        !documentoSoporte.idDsa && !isLoadingTerceroDefault
            ? tiposDocumento[0]
            : undefined
    );

    const documentoSoporteValidadoDian = documentoSoporte.estadoDian === 'Validado DIAN';

    const primerTercero = documentoSoporte.terceroDsa;
    const numeroIdentificacionTercero = primerTercero?.numeroIdentificacion?.trim() ?? '';

    const terceroRegistrado = Number(primerTercero?.idTercero ?? 0) > 0
        || terceros.some(tercero =>
            Boolean(numeroIdentificacionTercero)
            && tercero.numeroIdentificacion?.trim() === numeroIdentificacionTercero
        );

    const esCredito = selectedFormaPago?.nombreFormaPago
        ?.trim()
        ?.toLowerCase() === 'crédito' || selectedFormaPago?.nombreFormaPago
            ?.trim()
            ?.toLowerCase() === 'credito';

    useEffect(() => {
        const idMedioPago = tipoDocumentoSeleccionado?.idMedioPago;
        setActivePaymentMethod(idMedioPago != null ? String(idMedioPago) : '');
    }, [
        documentoSoporte.idTipoDocumentoExterno,
        documentoSoporte.idTipoDocumentoDsa,
        tipoDocumentoSeleccionado?.idMedioPago,
    ]);

    const BARCODE_DELAY = 50;

    const [vendedores, setVendedores] = useState<IVendedores[]>([]);

    const fetchVendedores = async () => {
        try {
            const data = await VendedorService.getAll();
            setVendedores(data);
            setVendedorSeleccionado(current =>
                data.some(vendedor => vendedor.idVendedor === current)
                    ? current
                    : data[0]?.idVendedor ?? current
            );
        } catch (error) {
            console.error('Error al cargar vendedores:', error);
            toast.error('Error al cargar los vendedores');
        }
    };

    const fetchTiposDocumento = async () => {
        try {
            setTipoDocumentoError(null);
            setIsLoadingTiposDocumento(true);
            const data = await TipoDocumentoService.getTiposDocumentoDsa();
            setTiposDocumento(data);
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
            const data = await ProductoService.getProductosCompra();

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

    const fetchDocumentoSoporte = async () => {
        try {
            setDocumentoSoporteError(null);
            setIsLoadingDocumentoSoporte(true);
            const data = await DocumentoSoporteService.getAll();
            setDocumentosSoporte(data);
        } catch (error) {
            console.error('Error:', error);
            setDocumentoSoporteError('Error al cargar los documentos de soporte');
            setDocumentosSoporte([]);
        } finally {
            setIsLoadingDocumentoSoporte(false);
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

            setDocumentoSoporte((prev) => ({
                ...prev,
                idTipoDocumentoDsa: data.documentoVenta[0]?.idTipoDocumento ?? prev.idTipoDocumentoDsa,
                idTerceroDsa: data.terceroVenta[0]?.idTercero ?? 0,
                terceroDsa: buildVentaTercero({
                    idTercero: data.terceroVenta[0]?.idTercero ?? 0,
                    idTipoDocumentoId: data.terceroVenta[0]?.idTipoDocumentoId ?? 0,
                    nombreTipoDocumentoId: data.terceroVenta[0]?.nombreTipoDocumentoId ?? null,
                    numeroIdentificacion: data.terceroVenta[0]?.numeroIdentificacion ?? '',
                    primerNombre: data.terceroVenta[0]?.primerNombre ?? '',
                    primerApellido: data.terceroVenta[0]?.primerApellido ?? '',
                    razonSocial: data.terceroVenta[0]?.razonSocial ?? '',
                    emailTercero: data.terceroVenta[0]?.emailTercero ?? null,
                }),
            }));
        } catch (error) {
            console.error('Error al cargar parámetros por defecto:', error);
            setTerceroDefaultError('Error al cargar los parámetros de documento soporte por defecto');
            setParametrosVentaDefault({
                terceroVenta: [
                    {
                        idTercero: 0,
                        idTipoDocumentoId: 0,
                        nombreTipoDocumentoId: '0',
                        numeroIdentificacion: '',
                        primerNombre: '',
                        primerApellido: '',
                        razonSocial: '',
                        emailTercero: '',
                    },
                ],
                documentoVenta: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: '0',
                        nombreDocumento: '0',
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: '0',
                        idMetodoDian: 0,
                        nombreMetodo: '0',
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    },
                ],
                documentoNotaCredito: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: '0',
                        nombreDocumento: '0',
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: '0',
                        idMetodoDian: 0,
                        nombreMetodo: '0',
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    },
                ],
                documentoCotizacion: [
                    {
                        idTipoDocumento: 0,
                        codigoDocumento: '0',
                        nombreDocumento: '0',
                        idTipoDocumentoE: 0,
                        idFormaPago: 0,
                        nombreFormaPago: '0',
                        idMetodoDian: 0,
                        nombreMetodo: '0',
                        ordenTipoDocumento: 0,
                        tipoDocumentoActivo: false,
                    },
                ],
            });
        } finally {
            setIsLoadingTerceroDefault(false);
        }
    };

    const initializeComponent = async () => {
        await Promise.all([
            fetchVendedores(),
            fetchTipoDocumentoIdentidad(),
            fetchParametrosVentaDefault(),
            fetchTiposDocumento(),
            fetchDocumentoSoporte(),
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
        const selectedTipoDocumento = tipoDocumentoSeleccionado;
        if (!selectedTipoDocumento) return;

        const idTipoDocumentoDsa = Number(selectedTipoDocumento.idTipoDocumento);
        const idTipoDocumentoExterno = Number(selectedTipoDocumento.idTipoDocumentoExterno);
        const prefijoConsecutivo = selectedTipoDocumento.prefijoConsecutivo ?? '';

        if (
            documentoSoporte.idTipoDocumentoDsa !== idTipoDocumentoDsa ||
            documentoSoporte.idTipoDocumentoExterno !== idTipoDocumentoExterno ||
            documentoSoporte.prefijoDsa !== prefijoConsecutivo
        ) {
            setDocumentoSoporte((previous) => ({
                ...previous,
                idTipoDocumentoDsa,
                idTipoDocumentoExterno,
                prefijoDsa: prefijoConsecutivo,
            }));
        }
    }, [
        tiposDocumento,
        idTipoDocumentoExternoSeleccionado,
        documentoSoporte.idDsa,
        documentoSoporte.idTipoDocumentoDsa,
        documentoSoporte.prefijoDsa,
        isLoadingTerceroDefault,
    ]);

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

    // Filtrar productos por búsqueda
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

        return matchesSearch;
    });


    const handleSelectTercero = (terc: ITercero) => {
        setDocumentoSoporte((prev) => ({
            ...prev,
            idTerceroDsa: terc.idTercero ?? 0,
            terceroDsa: buildVentaTercero({
                idTercero: terc.idTercero ?? 0,
                idTipoDocumentoId: terc.idTipoDocumentoId ?? 0,
                nombreTipoDocumentoId: terc.nombreTipoDocumentoId ?? null,
                numeroIdentificacion: terc.numeroIdentificacion ?? '',
                primerNombre: terc.primerNombre ?? '',
                primerApellido: terc.primerApellido ?? '',
                razonSocial: terc.razonSocial ?? '',
                emailTercero: terc.emailTercero ?? null,
            }),
        }));
        setOpenDialogTercero(false);
    };

    const handleNew = async () => {
        let parametros = parametrosVentaDefault;

        try {
            parametros = await VentaService.getParametrosVentaDefault();
            setParametrosVentaDefault(parametros);
        } catch (error) {
            console.error('Error al cargar los parametros por defecto para el nuevo documento soporte:', error);
        }

        const documentoDefault = parametros?.documentoVenta?.[0];
        const terceroDefault = parametros?.terceroVenta?.[0];

        setPagosAgregados([]);
        setMontoIngresado(0);
        setCambioEfectivo(0);
        setDocumentoSoporte(() => ({
            idDsa: 0,
            idTipoDocumentoDsa: documentoDefault?.idTipoDocumento ?? 1,
            numeroDsa: 0,
            prefijoDsa: '',
            idTerceroDsa: terceroDefault?.idTercero ?? 0,
            fechaDsa: getLocalDate(),
            plazoDiasDsa: 0,
            fechaVencimientoDsa: getLocalDate(),
            idUsuario: 1,
            idFormaPagoDsa: documentoDefault?.idFormaPago ?? 1,
            ordenReferenciaDsa: null,
            fechaOrdenReferenciaDsa: null,
            observacionesDsa: null,
            totalRegistrosDsa: 0,
            cantidadProductosDsa: 0,
            totalPrecioDsa: 0,
            totalDescuentoDsa: 0,
            totalDsa: 0,
            cufe: null,
            firmaDigital: null,
            fechaHoraAutorizacion: null,
            idResolucionDsa: null,
            idResponseDianDsa: null,
            totalBaseReteRentaDsa: 0,
            totalReteRentaDsa: 0,
            totalBaseReteIcaDsa: 0,
            totalReteIcaDsa: 0,
            idTipoOperacionDian: null,
            idTipoDocumentoExterno: null,
            fechaInicialServicio: null,
            fechaFinalServicio: null,
            idMetodoDian: null,
            estadoDian: null,
            fechaGrabacionDsa: null,
            terceroDsa: buildVentaTercero({
                idTercero: terceroDefault?.idTercero ?? 0,
                idTipoDocumentoId: terceroDefault?.idTipoDocumentoId ?? 0,
                nombreTipoDocumentoId: terceroDefault?.nombreTipoDocumentoId ?? null,
                numeroIdentificacion: terceroDefault?.numeroIdentificacion ?? '',
                primerNombre: terceroDefault?.primerNombre ?? '',
                primerApellido: terceroDefault?.primerApellido ?? '',
                razonSocial: terceroDefault?.razonSocial ?? '',
                emailTercero: terceroDefault?.emailTercero ?? null,
            }),
            detalleDsa: [],
        }));

        setSelectedDocumentoSoporte(null);
        setShowDocumentoSoporteModal(false);
        setDocumentoSoporteModalData(null);
        setActivePaymentMethod('');
    };


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

        setDocumentoSoporte(prev => {
            if (prev.terceroDsa?.numeroIdentificacion?.trim() !== numeroNormalizado) {
                return prev;
            }

            return {
                ...prev,
                terceroDsa: buildVentaTercero({
                    ...prev.terceroDsa,
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

            setDocumentoSoporte(prev => {
                if (prev.terceroDsa?.numeroIdentificacion?.trim() !== numeroNormalizado) {
                    return prev;
                }

                return {
                    ...prev,
                    terceroDsa: buildVentaTercero({
                        ...prev.terceroDsa,
                        razonSocial: resultado.name ?? prev.terceroDsa?.razonSocial ?? '',
                        emailTercero: resultado.email ?? prev.terceroDsa?.emailTercero ?? null,
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
            setDocumentoSoporte(prev => ({
                ...prev,
                terceroDsa: buildVentaTercero({
                    ...prev.terceroDsa,
                    idTercero: tercero.idTercero ?? 0,
                    idTipoDocumentoId: tercero.idTipoDocumentoId ?? 7,
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
        const terceroDsa = documentoSoporte.terceroDsa;
        const numeroIdentificacion = terceroDsa?.numeroIdentificacion?.trim();
        if (!numeroIdentificacion) {
            return;
        }

        const terceroLocal = handleSearchTercero(numeroIdentificacion);
        if (!terceroLocal) {
            await handleConsultarDatosExternos(
                numeroIdentificacion,
                terceroDsa?.idTipoDocumentoId ?? 0
            );
        }
    };

    const handleSelectDocumentoSoporte = async (documento: IDocumentoSoporte) => {
        const idDsaSelect = documento.idDsa ?? 0;
        const data = await DocumentoSoporteService.getById(idDsaSelect);

        if (!data) {
            console.error('No se encontró el documento soporte');
            return;
        }

        setSelectedDocumentoSoporte(data);

        setDocumentoSoporte((prev) => ({
            ...prev,
            idDsa: data.idDsa ?? idDsaSelect,
            idTipoDocumentoDsa: data.idTipoDocumentoDsa ?? 0,
            numeroDsa: data.numeroDsa ?? 0,
            prefijoDsa: data.prefijoDsa ?? '',
            idTerceroDsa: data.idTerceroDsa ?? 0,
            fechaDsa: data.fechaDsa ?? '',
            plazoDiasDsa: data.plazoDiasDsa ?? 0,
            fechaVencimientoDsa: data.fechaVencimientoDsa ?? data.fechaDsa ?? '',
            idUsuario: data.idUsuario ?? null,
            idFormaPagoDsa: data.idFormaPagoDsa ?? 1,
            ordenReferenciaDsa: data.ordenReferenciaDsa ?? null,
            fechaOrdenReferenciaDsa: normalizeDateInputValue(data.fechaOrdenReferenciaDsa),
            observacionesDsa: data.observacionesDsa ?? null,
            totalRegistrosDsa: data.totalRegistrosDsa ?? 0,
            cantidadProductosDsa: data.cantidadProductosDsa ?? 0,
            totalPrecioDsa: data.totalPrecioDsa ?? 0,
            totalDescuentoDsa: data.totalDescuentoDsa ?? 0,
            totalDsa: data.totalDsa ?? 0,
            cufe: data.cufe ?? null,
            firmaDigital: data.firmaDigital ?? null,
            fechaHoraAutorizacion: data.fechaHoraAutorizacion ?? null,
            idResolucionDsa: data.idResolucionDsa ?? null,
            idResponseDianDsa: data.idResponseDianDsa ?? null,
            totalBaseReteRentaDsa: data.totalBaseReteRentaDsa ?? 0,
            totalReteRentaDsa: data.totalReteRentaDsa ?? 0,
            totalBaseReteIcaDsa: data.totalBaseReteIcaDsa ?? 0,
            totalReteIcaDsa: data.totalReteIcaDsa ?? 0,
            idTipoOperacionDian: data.idTipoOperacionDian ?? null,
            idTipoDocumentoExterno: data.idTipoDocumentoExterno ?? null,
            fechaInicialServicio: normalizeDateInputValue(data.fechaInicialServicio),
            fechaFinalServicio: normalizeDateInputValue(data.fechaFinalServicio),
            idMetodoDian: data.idMetodoDian ?? 2,
            estadoDian: data.estadoDian ?? null,
            fechaGrabacionDsa: data.fechaGrabacionDsa ?? null,
            terceroDsa: data.terceroDsa ? buildVentaTercero(data.terceroDsa) : buildVentaTercero(),
            detalleDsa: data.detalleDsa ?? [],
        }));

        if (data.estadoDian === 'Validado DIAN') {
            setShowPayment(false);
        }

        setOpenDialog(false);
        setShowDocumentoSoporteModal(true);

        const dataPrint = await DocumentoSoporteService.printById(idDsaSelect);
        setDocumentoSoporteModalData(dataPrint);
    };

    const DEFAULT_TIPO_DOC_NIT = 7; // idTipoDocumentoId = 7 para NIT (código 31)

    const handleSaveDocumentoSoporte = async () => {
        if (documentoSoporteValidadoDian) return;

        if (!tipoDocumentoSeleccionado) {
            toast.error('Seleccione un tipo de documento válido');
            return;
        }

        const localISODate = getLocalDate();

        // 1. Normalizar cada ítem del detalle según IDetalleDocumentoSoporte
        const detalleNormalizado: IDetalleDocumentoSoporte[] = (documentoSoporte.detalleDsa ?? []).map((item, index) => {
            const cantidad = Number(item.cantidadDsa || 1);
            const precioUnitario = Number(item.precioUnitarioDsa || 0);
            const precioTotalCalculado = parseFloat((precioUnitario * cantidad).toFixed(2));

            const porcentajeDescuento = Number(item.porcentajeDescuentoDsa || 0);
            const descuentoCalculado = parseFloat(((precioTotalCalculado * porcentajeDescuento) / 100).toFixed(2));
            const totalCalculado = parseFloat((precioTotalCalculado - descuentoCalculado).toFixed(2));

            // Cálculos de ReteRenta y ReteIca
            const porcentajeReteRenta = Number(item.porcentajeReteRenta || 0);
            const baseReteRenta = totalCalculado;
            const reteRentaCalculada = parseFloat(((baseReteRenta * porcentajeReteRenta) / 100).toFixed(2));

            const porcentajeReteIca = Number(item.porcentajeReteIca || 0);
            const baseReteIca = totalCalculado;
            const reteIcaCalculada = parseFloat((((baseReteIca * porcentajeReteIca) / 100) / 1000).toFixed(2));

            return {
                ...item,
                registroDsa: index + 1,
                cantidadDsa: cantidad,
                precioUnitarioDsa: precioUnitario,
                precioTotalDsa: precioTotalCalculado,
                porcentajeDescuentoDsa: porcentajeDescuento,
                descuentoDsa: descuentoCalculado,
                totalDsa: totalCalculado,
                porcentajeReteRenta: porcentajeReteRenta,
                baseReteRenta: baseReteRenta,
                reteRentaDsa: reteRentaCalculada,
                porcentajeReteIca: porcentajeReteIca,
                baseReteIca: baseReteIca,
                reteIcaDsa: reteIcaCalculada,
            };
        });

        // 2. Calcular totales generales a partir del detalle normalizado
        const totalCantidadCalculada = detalleNormalizado.reduce((acc, item) => acc + Number(item.cantidadDsa || 0), 0);
        const totalPrecioCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.precioTotalDsa || 0), 0);
        const totalDescuentoCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.descuentoDsa || 0), 0);
        const totalDsaCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.totalDsa || 0), 0);

        const totalBaseReteRentaCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.baseReteRenta || 0), 0);
        const totalReteRentaCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.reteRentaDsa || 0), 0);

        const totalBaseReteIcaCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.baseReteIca || 0), 0);
        const totalReteIcaCalculado = detalleNormalizado.reduce((acc, item) => acc + Number(item.reteIcaDsa || 0), 0);

        // 3. Normalizar el tercero del documento
        const idTipoDocumentoId = documentoSoporte.terceroDsa?.idTipoDocumentoId;
        const terceroNormalizado: IDocumentoSoporteTercero = buildVentaTercero({
            ...documentoSoporte.terceroDsa,
            idTipoDocumentoId: idTipoDocumentoId && idTipoDocumentoId !== 0
                ? idTipoDocumentoId
                : DEFAULT_TIPO_DOC_NIT,
        });

        // 4. Estructurar el objeto de documento soporte final
        const updatedDocumentoSoporte: IDocumentoSoporte = {
            ...documentoSoporte,
            idTipoDocumentoDsa: Number(tipoDocumentoSeleccionado.idTipoDocumento),
            idTipoDocumentoExterno: Number(tipoDocumentoSeleccionado.idTipoDocumentoExterno),
            fechaDsa: localISODate,
            plazoDiasDsa: esCredito ? Math.max(0, Number(documentoSoporte.plazoDiasDsa ?? 0)) : 0,
            fechaVencimientoDsa: esCredito
                ? addDaysToDate(localISODate, Math.max(0, Number(documentoSoporte.plazoDiasDsa ?? 0)))
                : localISODate,

            idTerceroDsa: terceroNormalizado.idTercero || 0,

            // Detalle normalizado
            detalleDsa: detalleNormalizado,

            // Cantidades y Totales
            cantidadProductosDsa: totalCantidadCalculada > 0 ? totalCantidadCalculada : documentoSoporte.cantidadProductosDsa,
            totalRegistrosDsa: detalleNormalizado.length,
            totalPrecioDsa: totalPrecioCalculado,
            totalDescuentoDsa: totalDescuentoCalculado,
            totalDsa: totalDsaCalculado,

            // Totales de Retenciones
            totalBaseReteRentaDsa: totalBaseReteRentaCalculado,
            totalReteRentaDsa: totalReteRentaCalculado,
            totalBaseReteIcaDsa: totalBaseReteIcaCalculado,
            totalReteIcaDsa: totalReteIcaCalculado,

            // Tercero normalizado
            terceroDsa: terceroNormalizado,
        };

        try {
            if (updatedDocumentoSoporte.idDsa) {
                console.log("Documento Soporte actualizado:", documentoSoporte);
                setSuccessMessage("Documento Soporte actualizado correctamente");
                setShowSuccessDialog(true);
            } else {
                console.log("Documento Soporte a guardar:", updatedDocumentoSoporte);
                const result = await DocumentoSoporteService.create(updatedDocumentoSoporte);
                console.log("Documento Soporte guardado:", result);

                setSuccessMessage(
                    (result.message || "Guardado exitosamente") +
                    (result.numeroDocumentoDian ? "\nNúmero Documento Dian: " + result.numeroDocumentoDian : "")
                );
                setShowSuccessDialog(true);

                const createdDocumentoId = Number(result.idDsa ?? result.idFactura ?? 0);
                let data: IDocumentoSoporte | null = null;

                if (createdDocumentoId > 0) {
                    data = await DocumentoSoporteService.getById(createdDocumentoId);
                    setSelectedDocumentoSoporte(data);
                }

                const documentoCargado = data ?? documentoSoporte;
                setDocumentoSoporte({
                    ...documentoSoporte,
                    idDsa: documentoCargado.idDsa ?? createdDocumentoId,
                    idTipoDocumentoDsa: documentoCargado.idTipoDocumentoDsa ?? 0,
                    numeroDsa: documentoCargado.numeroDsa ?? 0,
                    prefijoDsa: documentoCargado.prefijoDsa ?? '',
                    idTerceroDsa: documentoCargado.idTerceroDsa ?? 0,
                    fechaDsa: documentoCargado.fechaDsa ?? '',
                    plazoDiasDsa: documentoCargado.plazoDiasDsa ?? 0,
                    fechaVencimientoDsa: documentoCargado.fechaVencimientoDsa ?? '',
                    idUsuario: documentoCargado.idUsuario ?? null,
                    idFormaPagoDsa: documentoCargado.idFormaPagoDsa ?? 1,
                    ordenReferenciaDsa: documentoCargado.ordenReferenciaDsa ?? null,
                    fechaOrdenReferenciaDsa: normalizeDateInputValue(documentoCargado.fechaOrdenReferenciaDsa),
                    observacionesDsa: documentoCargado.observacionesDsa ?? null,
                    totalRegistrosDsa: documentoCargado.totalRegistrosDsa ?? 0,
                    cantidadProductosDsa: documentoCargado.cantidadProductosDsa ?? 0,
                    totalPrecioDsa: documentoCargado.totalPrecioDsa ?? 0,
                    totalDescuentoDsa: documentoCargado.totalDescuentoDsa ?? 0,
                    totalDsa: documentoCargado.totalDsa ?? 0,
                    cufe: documentoCargado.cufe ?? null,
                    firmaDigital: documentoCargado.firmaDigital ?? null,
                    fechaHoraAutorizacion: documentoCargado.fechaHoraAutorizacion ?? null,
                    idResolucionDsa: documentoCargado.idResolucionDsa ?? null,
                    idResponseDianDsa: documentoCargado.idResponseDianDsa ?? null,
                    totalBaseReteRentaDsa: documentoCargado.totalBaseReteRentaDsa ?? 0,
                    totalReteRentaDsa: documentoCargado.totalReteRentaDsa ?? 0,
                    totalBaseReteIcaDsa: documentoCargado.totalBaseReteIcaDsa ?? 0,
                    totalReteIcaDsa: documentoCargado.totalReteIcaDsa ?? 0,
                    idTipoOperacionDian: documentoCargado.idTipoOperacionDian ?? null,
                    idTipoDocumentoExterno: documentoCargado.idTipoDocumentoExterno ?? null,
                    fechaInicialServicio: normalizeDateInputValue(documentoCargado.fechaInicialServicio),
                    fechaFinalServicio: normalizeDateInputValue(documentoCargado.fechaFinalServicio),
                    estadoDian: documentoCargado.estadoDian ?? null,
                    fechaGrabacionDsa: documentoCargado.fechaGrabacionDsa ?? null,
                    terceroDsa: documentoCargado.terceroDsa
                        ? buildVentaTercero(documentoCargado.terceroDsa)
                        : buildVentaTercero(),
                    detalleDsa: documentoCargado.detalleDsa ?? [],
                });

                if (createdDocumentoId > 0) {
                    const dataPrint = await DocumentoSoporteService.printById(createdDocumentoId);
                    setDocumentoSoporteModalData(dataPrint);
                    setShowDocumentoSoporteModal(true);
                }

            }
        } catch (error) {
            console.error('Error al guardar el documento soporte:', error);
        }
    };

    // Funciones del carrito
    const addToCart = (product: IProducto) => {
        setDocumentoSoporte((prev) => {
            if (documentoSoporteValidadoDian) return prev;

            const detalleDsaActual = prev.detalleDsa ?? [];
            const existingItemIndex = detalleDsaActual.findIndex(
                (item) =>
                    (Number(product.idProducto ?? 0) > 0 && item.idProducto === Number(product.idProducto)) ||
                    (Boolean(product.codigoProducto) && item.codigoProducto === product.codigoProducto)
            );

            if (existingItemIndex !== -1) {
                const detalleActualizado = detalleDsaActual.map((item, index) =>
                    index === existingItemIndex
                        ? recalculateDocumentoSoporteDetalle(item, Number(item.cantidadDsa ?? 0) + 1)
                        : item
                );
                return {
                    ...prev,
                    detalleDsa: detalleActualizado,
                };
            }

            const nuevoDetalle = buildDocumentoSoporteDetalle(product, 1, detalleDsaActual.length + 1);
            return {
                ...prev,
                detalleDsa: [...detalleDsaActual, nuevoDetalle],
            };
        });
    };

    const updateQuantity = (id: number, change: number) => {
        setDocumentoSoporte((prev) => {
            if (documentoSoporteValidadoDian) return prev;
            return {
                ...prev,
                detalleDsa: (prev.detalleDsa ?? []).map((item) =>
                    item.idProducto === id
                        ? recalculateDocumentoSoporteDetalle(item, Math.max(0, Number(item.cantidadDsa ?? 0) + change))
                        : item
                ),
            };
        });
    };

    const removeFromCart = (registroDsa: number) => {
        setDocumentoSoporte((prev) =>
            documentoSoporteValidadoDian
                ? prev
                : {
                    ...prev,
                    detalleDsa: (prev.detalleDsa ?? []).filter((item) => item.registroDsa !== registroDsa),
                }
        );
    };

    const updateDetailItem = (
        registroDsa: number,
        update: (item: IDetalleDocumentoSoporte) => IDetalleDocumentoSoporte
    ) => {
        if (registroDsa === draftItem.registroDsa) {
            setDraftItem(update);
            return;
        }

        setDocumentoSoporte((prev) => ({
            ...prev,
            detalleDsa: (prev.detalleDsa ?? []).map((item) =>
                item.registroDsa === registroDsa ? update(item) : item
            ),
        }));
    };

    const addDraftItemToCart = () => {
        if (
            documentoSoporteValidadoDian
            || !draftItem.nombreProducto?.trim()
            || !(Number(draftItem.precioUnitarioDsa) > 0)
            || !(Number(draftItem.cantidadDsa) > 0)
        ) {
            return;
        }

        setDocumentoSoporte((prev) => ({
            ...prev,
            detalleDsa: [
                ...(prev.detalleDsa ?? []),
                {
                    ...draftItem,
                    registroDsa: Math.max(0, ...(prev.detalleDsa ?? []).map(item => Number(item.registroDsa) || 0)) + 1,
                },
            ],
        }));
        setDraftItem(createEmptyDocumentoSoporteDetalle());
        setSearchTerm('');
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
    const [pagosAgregados, setPagosAgregados] = useState<Array<{ idMedioPago: number; valorMedioPago: number }>>([]);

    const subtotal = documentoSoporte.detalleDsa?.reduce(
        (sum, item) => sum + (item.precioUnitarioDsa ?? 0) * (item.cantidadDsa ?? 0),
        0
    ) ?? 0;

    const discount = documentoSoporte.detalleDsa?.reduce(
        (descuento, item) => descuento + (item.descuentoDsa ?? 0),
        0
    ) ?? 0;

    // En Documento Soporte no aplica IVA ni ReteIVA
    const tax = 0;
    const totalReteIva = 0;

    const totalReteRenta = documentoSoporte.detalleDsa?.reduce(
        (reteRenta, item) => reteRenta + (item.reteRentaDsa ?? 0),
        0
    ) ?? 0;

    const totalReteIca = documentoSoporte.detalleDsa?.reduce(
        (reteIca, item) => reteIca + (item.reteIcaDsa ?? 0),
        0
    ) ?? 0;

    // Total neto = Subtotal - Descuentos - Retenciones (ReteRenta + ReteIca)
    const total = subtotal - discount - totalReteRenta - totalReteIca;

    const totalPagado = esCredito
        ? 0
        : pagosAgregados.reduce((acc, curr) => acc + (curr.valorMedioPago || 0), 0);
    const saldoPendiente = Math.max(0, total - totalPagado);
    const esEfectivo = activePaymentMethod === '1';
    const efectivoAgregado = pagosAgregados.some(medioPago => medioPago.idMedioPago === 1);
    const cambioCalculado = efectivoAgregado ? cambioEfectivo : 0;

    const totalItems = documentoSoporte.detalleDsa?.reduce(
        (sum, item) => sum + (item.cantidadDsa ?? 0),
        0
    ) ?? 0;

    const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10

    const handlePaymentModalChange = (open: boolean) => {
        setShowPayment(open);
        if (!open) return;

        const idMedioPago = tipoDocumentoSeleccionado?.idMedioPago;
        setActivePaymentMethod(idMedioPago != null ? String(idMedioPago) : '');
        if (documentoSoporte.idFormaPagoDsa === 1) {
            setMontoIngresado(total);
            setPagosAgregados([]);
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

                        {selectedDocumentoSoporte && (
                            <Badge variant="outline" className="px-2.5 py-0.5 text-xs font-medium">
                                {documentoSoporteValidadoDian ? 'Validado DIAN' : 'Pendiente DIAN'}
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
                                disabled={documentoSoporteValidadoDian}
                            >
                                <SelectTrigger className="h-9 w-32 text-xs" id="vendedor-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendedores.map(vendedor => (
                                        <SelectItem key={vendedor.idVendedor} value={vendedor.idVendedor.toString()} className="text-xs">
                                            {vendedor.nombreVendedor}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <Button
                            variant="default"
                            size="icon"
                            title="Nuevo documento soporte"
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
                                            {documentosSoporte
                                                .filter(
                                                    (doc: IDocumentoSoporte) =>
                                                        doc.numeroDsa?.toString().toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        doc.terceroDsa?.razonSocial?.toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        `${doc.terceroDsa?.primerNombre ?? ''} ${doc.terceroDsa?.primerApellido ?? ''}`.trim().toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        doc.terceroDsa?.numeroIdentificacion?.toLowerCase().includes(searchDocumento.toLowerCase()) ||
                                                        doc.prefijoDsa?.toLowerCase().includes(searchDocumento.toLowerCase())
                                                )
                                                .map((doc: IDocumentoSoporte) => (
                                                    <TableRow
                                                        key={doc.idDsa}
                                                        className="cursor-pointer hover:bg-primary/10"
                                                        onClick={() => handleSelectDocumentoSoporte(doc)}
                                                    >
                                                        <TableCell>{doc.prefijoDsa}</TableCell>
                                                        <TableCell>{doc.numeroDsa}</TableCell>
                                                        <TableCell>{doc.terceroDsa?.numeroIdentificacion ?? ''}</TableCell>
                                                        <TableCell>
                                                            {doc.terceroDsa?.razonSocial
                                                                ? doc.terceroDsa.razonSocial
                                                                : `${doc.terceroDsa?.primerNombre ?? ''} ${doc.terceroDsa?.primerApellido ?? ''}`.trim() || 'Sin cliente'}
                                                        </TableCell>
                                                        <TableCell>{doc.totalDsa ?? 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {isLoadingDocumentoSoporte && (
                                        <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                    )}
                                    {documentoSoporteError && (
                                        <div className="text-center text-red-500 py-4">{documentoSoporteError}</div>
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
                <div className="w-full flex flex-col h-[calc(100vh-80px)]">
                    {/* Header del Carrito */}
                    <div className="p-3 border-b h-[60px] shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-normal">Tipo de documento</h2>
                                <select
                                    className="rounded border px-3 py-2 text-sm bg-background w-80 font-bold"
                                    value={documentoSoporte.idTipoDocumentoExterno?.toString() ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => {
                                        const selectedId = Number(e.target.value);
                                        if (!selectedId) return;

                                        const selectedTipoDocumento = tiposDocumento.find(
                                            (td) => Number(td.idTipoDocumentoExterno) === selectedId
                                        );

                                        if (!selectedTipoDocumento) return;

                                        setDocumentoSoporte((previous) => ({
                                            ...previous,
                                            idTipoDocumentoExterno: Number(selectedTipoDocumento.idTipoDocumentoExterno),
                                            idTipoDocumentoDsa: Number(selectedTipoDocumento.idTipoDocumento),
                                            idFormaPagoDsa: selectedTipoDocumento.idFormaPago || 0,
                                            prefijoDsa: selectedTipoDocumento.prefijoConsecutivo || '',
                                        }));
                                    }}
                                    required
                                >
                                    {tiposDocumento.map((td) => (
                                        <option
                                            key={td.idTipoDocumentoExterno}
                                            value={td.idTipoDocumentoExterno}
                                        >
                                            {`${td.nombreTipoDocumentoExterno || ''} - ${td.codigoTipoDocumentoExterno || ''}`}
                                        </option>
                                    ))}
                                </select>
                                <h2 className="text-sm font-normal">Prefijo</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={documentoSoporte.prefijoDsa || ''}
                                    onChange={(e) => setDocumentoSoporte(prev => ({ ...prev, prefijoDsa: e.target.value }))}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                    value={documentoSoporte.numeroDsa || ''}
                                    onChange={(e) => setDocumentoSoporte(prev => ({ ...prev, numeroDsa: parseInt(e.target.value) || 0 }))}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Fecha</h2>
                                <input
                                    type="date"
                                    className="rounded border px-3 py-2 text-sm bg-background w-30"
                                    value={documentoSoporte.fechaDsa ? documentoSoporte.fechaDsa.split('T')[0] : new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDocumentoSoporte(prev => ({ ...prev, fechaDsa: e.target.value }))}
                                    readOnly
                                />
                            </div>
                        </div>
                    </div>

                    {/* Panel de Cliente / Tercero */}
                    <div className="border-b bg-muted/50">
                        <div className="flex items-center gap-2 ml-3 mt-2 mb-2 mr-2">
                            <h2 className="text-sm font-normal">Cliente</h2>
                            <div className="grid grid-cols-6 gap-1">
                                <select
                                    className="w-full rounded border px-2 py-2 text-sm bg-background w-42"
                                    value={documentoSoporte.terceroDsa?.idTipoDocumentoId ?? 0}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => {
                                        const idTipo = Number.parseInt(e.target.value, 10) || 0;
                                        setDocumentoSoporte(prev => ({
                                            ...prev,
                                            terceroDsa: buildVentaTercero({
                                                ...prev.terceroDsa,
                                                idTipoDocumentoId: idTipo
                                            })
                                        }));
                                    }}
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
                                    value={documentoSoporte.terceroDsa?.numeroIdentificacion ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        const primerT = documentoSoporte.terceroDsa ?? buildVentaTercero();

                                        setDocumentoSoporte(prev => ({
                                            ...prev,
                                            terceroDsa: buildVentaTercero({
                                                    ...primerT,
                                                    idTercero: value === primerT.numeroIdentificacion ? primerT.idTercero : 0,
                                                    numeroIdentificacion: value
                                                })
                                        }));
                                        if (value.length >= 3) {
                                            handleSearchTercero(value);
                                        }
                                        void fetchProducts(value);
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={() => {
                                        void handleValidarTercero();
                                    }}
                                />
                                <Input
                                    placeholder="Primer Nombre"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={documentoSoporte.terceroDsa?.primerNombre ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => setDocumentoSoporte(prev => ({
                                        ...prev,
                                        terceroDsa: buildVentaTercero({
                                                ...prev.terceroDsa,
                                                primerNombre: e.target.value
                                            })
                                    }))}
                                />
                                <Input
                                    placeholder="Primer Apellido"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={documentoSoporte.terceroDsa?.primerApellido ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => setDocumentoSoporte(prev => ({
                                        ...prev,
                                        terceroDsa: buildVentaTercero({
                                                ...prev.terceroDsa,
                                                primerApellido: e.target.value
                                            })
                                    }))}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={documentoSoporte.terceroDsa?.emailTercero ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => setDocumentoSoporte(prev => ({
                                        ...prev,
                                        terceroDsa: buildVentaTercero({
                                                ...prev.terceroDsa,
                                                emailTercero: e.target.value
                                            })
                                    }))}
                                />
                                <Input
                                    placeholder="Razón Social"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={documentoSoporte.terceroDsa?.razonSocial ?? ''}
                                    disabled={documentoSoporteValidadoDian}
                                    onChange={(e) => setDocumentoSoporte(prev => ({
                                        ...prev,
                                        terceroDsa: buildVentaTercero({
                                                ...prev.terceroDsa,
                                                razonSocial: e.target.value
                                            })
                                    }))}
                                />
                            </div>
                            <Dialog open={openDialogTercero} onOpenChange={setOpenDialogTercero}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" title="Buscar cliente" disabled={documentoSoporteValidadoDian}>
                                        <Search className="w-8 h-8" />
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl">
                                    <DialogHeader>
                                        <DialogTitle>Buscar cliente</DialogTitle>
                                    </DialogHeader>
                                    <Input
                                        className="mb-4"
                                        placeholder="Buscar por número o nombre o apellido o razón social..."
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
                                        documentoSoporte,
                                        crearTercero: (documentoSoporte.terceroDsa?.idTercero ?? 0) === 0
                                    }
                                })}
                                disabled={documentoSoporteValidadoDian}
                            >
                                <FileText className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Panel de Información Adicional */}
                    <div className="border-b bg-muted/50">
                        <div className="flex flex-col gap-2 p-3">
                            {/* Fila 1: Observaciones ocupando toda la fila */}
                            <div className="flex items-center gap-2 w-full">
                                <Label className="text-sm font-medium whitespace-nowrap">Observaciones:</Label>
                                <Input
                                    placeholder="Observaciones"
                                    className="rounded border px-2 py-2 text-base bg-background flex-1"
                                    value={documentoSoporte.observacionesDsa || ''}
                                    onChange={(e) => setDocumentoSoporte(prev => ({
                                        ...prev,
                                        observacionesDsa: e.target.value
                                    }))}
                                    disabled={documentoSoporteValidadoDian}
                                />
                            </div>

                            {/* Fila 2: Orden Ref, Fecha Ref, Del y Al */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 w-full">
                                {/* Orden Ref */}
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Orden Ref:</Label>
                                    <Input
                                        placeholder="Orden Referencia"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={documentoSoporte.ordenReferenciaDsa || ''}
                                        onChange={(e) => setDocumentoSoporte(prev => ({
                                            ...prev,
                                            ordenReferenciaDsa: e.target.value
                                        }))}
                                        disabled={documentoSoporteValidadoDian}
                                    />
                                </div>

                                {/* Fecha Ref */}
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Fecha Ref:</Label>
                                    <Input
                                        type="date"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={documentoSoporte.fechaOrdenReferenciaDsa || ''}
                                        onChange={(e) => setDocumentoSoporte(prev => ({
                                            ...prev,
                                            fechaOrdenReferenciaDsa: e.target.value
                                        }))}
                                        disabled={documentoSoporteValidadoDian}
                                    />
                                </div>

                                {/* Fecha Servicio (Inicial) */}
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap">Fecha del Servicio:</Label>
                                    <Input
                                        type="date"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={documentoSoporte.fechaInicialServicio || ''}
                                        disabled={documentoSoporteValidadoDian}
                                        onChange={(e) => setDocumentoSoporte(prev => ({
                                            ...prev,
                                            fechaInicialServicio: e.target.value
                                        }))}
                                    />
                                </div>

                                {/* Fecha Servicio (Final) */}
                                <div className="flex items-center gap-2">
                                    <Label className="text-sm font-medium whitespace-nowrap"> - </Label>
                                    <Input
                                        type="date"
                                        className="rounded border px-2 py-2 text-base bg-background flex-1"
                                        value={documentoSoporte.fechaFinalServicio || ''}
                                        disabled={documentoSoporteValidadoDian}
                                        onChange={(e) => setDocumentoSoporte(prev => ({
                                            ...prev,
                                            fechaFinalServicio: e.target.value
                                        }))}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        <div className="relative mb-3 mx-3 sm:mx-6 md:mx-10">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar productos por nombre, código o barras..."
                                value={searchTerm}
                                disabled={documentoSoporteValidadoDian || isLoadingProducts}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                            {searchTerm && (
                                <button
                                    type="button"
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                                    aria-label="Limpiar búsqueda de productos"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                            {searchTerm.trim() && (
                                <div className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-background shadow-lg">
                                    {filteredProducts.slice(0, 10).map((product) => (
                                        <button
                                            key={product.idProducto}
                                            type="button"
                                            onClick={() => {
                                                setDraftItem(buildDocumentoSoporteDetalle(product, 1, -1));
                                                setSearchTerm('');
                                            }}
                                            className="flex w-full items-center justify-between gap-3 border-b px-3 py-2 text-left last:border-b-0 hover:bg-muted"
                                        >
                                            <span className="min-w-0">
                                                <span className="block truncate text-sm font-medium">{product.nombreProducto}</span>
                                                <span className="block text-xs text-muted-foreground">{product.codigoProducto}</span>
                                            </span>
                                            <span className="shrink-0 text-sm font-medium">${formatCurrency(product.precioPos ?? product.precioUnitario)}</span>
                                        </button>
                                    ))}
                                    {!isLoadingProducts && filteredProducts.length === 0 && (
                                        <p className="px-3 py-2 text-sm text-muted-foreground">No se encontraron productos.</p>
                                    )}
                                </div>
                            )}
                        </div>
                        {isLoadingProducts && <p className="mb-2 text-sm text-muted-foreground">Cargando productos...</p>}
                        {productError && <p className="mb-2 text-sm text-destructive">{productError}</p>}

                        <div className="space-y-1.5">
                            {[draftItem, ...(documentoSoporte.detalleDsa ?? [])].map((item, idx) => {
                                const isDraftItem = item.registroDsa === draftItem.registroDsa;
                                const regKey = isDraftItem ? 'draft-item' : (item.registroDsa || idx + 1);
                                return (
                                    <Card key={regKey} className={`p-3 mx-3 sm:mx-6 md:mx-10 ${isDraftItem ? 'border-primary/50 bg-muted/20' : ''}`}>
                                        {isDraftItem && <div className="px-1 pt-1 pb-2 text-xs font-semibold text-primary">Nuevo item</div>}
                                        <div className="flex items-center justify-between">
                                            {/* Información del producto */}
                                            <div className="flex flex-col gap-3 w-full px-2">
                                                {/* Fila 1: Código y Nombre del producto */}
                                                <div className="flex items-center gap-3 w-full">
                                                    {/* Código del producto */}
                                                    {isDraftItem ? (
                                                        <Input
                                                            value={item.codigoProducto ?? ''}
                                                            onChange={(e) => updateDetailItem(item.registroDsa, current => ({ ...current, codigoProducto: e.target.value }))}
                                                            className="h-9 w-36 text-xs bg-background"
                                                            placeholder="Código"
                                                            disabled={documentoSoporteValidadoDian}
                                                        />
                                                    ) : (
                                                        <Badge variant="outline" className="text-xs h-9 px-3 flex items-center bg-background">{item.codigoProducto || 'Sin código'}</Badge>
                                                    )}

                                                    {/* Nombre del producto */}
                                                    <div className="flex-1 min-w-0">
                                                        {item.idTipoProducto === 2 || isDraftItem ? (
                                                            <Input
                                                                value={item.nombreProducto ?? ''}
                                                                onChange={(e) => updateDetailItem(item.registroDsa, current => ({ ...current, nombreProducto: e.target.value }))}
                                                                className="font-medium text-sm w-full bg-background"
                                                                placeholder="Nombre del producto"
                                                                disabled={documentoSoporteValidadoDian}
                                                            />
                                                        ) : (
                                                            <h4 className="font-medium text-sm truncate">{item.nombreProducto}</h4>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Fila 2: Precio, Cantidad y el resto de campos */}
                                                <div className="flex flex-wrap items-end justify-between gap-2 w-full">
                                                    {/* Precio (Primer campo de la segunda fila) */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-center">Precio</span>
                                                        {item.idTipoProducto === 2 || isDraftItem ? (
                                                            <Input
                                                                type="number"
                                                                value={item.precioUnitarioDsa || ''}
                                                                onChange={(e) => {
                                                                    const newPrice = parseFloat(e.target.value) || 0;
                                                                    updateDetailItem(item.registroDsa, current =>
                                                                        recalculateDocumentoSoporteDetalle({
                                                                            ...current,
                                                                            precioUnitarioDsa: newPrice,
                                                                            costoUnitarioDsa: newPrice,
                                                                        }, current.cantidadDsa ?? 1)
                                                                    );
                                                                }}
                                                                className="text-sm text-muted-foreground w-28 h-8 text-center bg-background"
                                                                placeholder="Precio"
                                                                min={0}
                                                                disabled={documentoSoporteValidadoDian}
                                                                onFocus={(e) => e.target.select()}
                                                            />
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground font-medium h-8 flex items-center px-2">${formatCurrency(item.precioUnitarioDsa)}</span>
                                                        )}
                                                    </div>

                                                    {/* Cantidad */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-center">Cantidad</span>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={item.cantidadDsa ?? ''}
                                                            disabled={documentoSoporteValidadoDian}
                                                            onFocus={(e) => e.target.select()}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                const newQuantity = value === '' ? 0 : Number(value);
                                                                if (Number.isFinite(newQuantity)) {
                                                                    updateDetailItem(item.registroDsa, current =>
                                                                        recalculateDocumentoSoporteDetalle(current, newQuantity)
                                                                    );
                                                                }
                                                            }}
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center bg-background"
                                                        />
                                                    </div>

                                                    {/* % Descuento */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            disabled={documentoSoporteValidadoDian}
                                                            value={item.porcentajeDescuentoDsa || ''}
                                                            onChange={(e) => {
                                                                const pctDesc = parseFloat(e.target.value) || 0;
                                                                const precioTot = (item.cantidadDsa ?? 0) * (item.precioUnitarioDsa ?? 0);
                                                                const valDesc = parseFloat(((precioTot * pctDesc) / 100).toFixed(2));
                                                                const tot = precioTot - valDesc;
                                                                const pctRete = item.porcentajeReteRenta || 0;
                                                                const valRete = parseFloat(((tot * pctRete) / 100).toFixed(2));
                                                                const pctIca = item.porcentajeReteIca || 0;
                                                                const valIca = parseFloat((((tot * pctIca) / 100) / 1000).toFixed(2));

                                                                updateDetailItem(item.registroDsa, current => ({
                                                                    ...current,
                                                                    porcentajeDescuentoDsa: pctDesc,
                                                                    descuentoDsa: valDesc,
                                                                    totalDsa: tot,
                                                                    baseReteRenta: tot,
                                                                    reteRentaDsa: valRete,
                                                                    baseReteIca: tot,
                                                                    reteIcaDsa: valIca,
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
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            disabled={documentoSoporteValidadoDian}
                                                            value={item.descuentoDsa || ''}
                                                            onChange={(e) => {
                                                                const valDesc = parseFloat(e.target.value) || 0;
                                                                const precioTot = (item.cantidadDsa ?? 0) * (item.precioUnitarioDsa ?? 0);
                                                                const tot = precioTot - valDesc;
                                                                const pctRete = item.porcentajeReteRenta || 0;
                                                                const valRete = parseFloat(((tot * pctRete) / 100).toFixed(2));
                                                                const pctIca = item.porcentajeReteIca || 0;
                                                                const valIca = parseFloat((((tot * pctIca) / 100) / 1000).toFixed(2));

                                                                updateDetailItem(item.registroDsa, current => ({
                                                                    ...current,
                                                                    descuentoDsa: valDesc,
                                                                    totalDsa: tot,
                                                                    baseReteRenta: tot,
                                                                    reteRentaDsa: valRete,
                                                                    baseReteIca: tot,
                                                                    reteIcaDsa: valIca,
                                                                }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* % Retefuente */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Retefuente</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            value={item.porcentajeReteRenta || ''}
                                                            disabled={documentoSoporteValidadoDian}
                                                            onChange={(e) => {
                                                                const pctRete = parseFloat(e.target.value) || 0;
                                                                const baseCalculada = item.totalDsa ?? (((item.cantidadDsa ?? 0) * (item.precioUnitarioDsa ?? 0)) - (item.descuentoDsa ?? 0));
                                                                const valorRetefuente = parseFloat(((baseCalculada * pctRete) / 100).toFixed(2));

                                                                updateDetailItem(item.registroDsa, current => ({
                                                                    ...current,
                                                                    porcentajeReteRenta: pctRete,
                                                                    reteRentaDsa: valorRetefuente,
                                                                    baseReteRenta: baseCalculada
                                                                }));
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* Valor Retefuente */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Retefuente</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            value={item.reteRentaDsa || ''}
                                                            disabled={documentoSoporteValidadoDian}
                                                            onChange={(e) => {
                                                                const valRete = parseFloat(e.target.value) || 0;
                                                                updateDetailItem(item.registroDsa, current => ({ ...current, reteRentaDsa: valRete }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* % ReteICA */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% ReteICA</span>
                                                        <input
                                                            type="number"
                                                            step="any"
                                                            min={0}
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            value={item.porcentajeReteIca || ''}
                                                            disabled={documentoSoporteValidadoDian}
                                                            onChange={(e) => {
                                                                const rawValue = e.target.value;
                                                                const pctIca = rawValue === '' ? 0 : parseFloat(rawValue);
                                                                const baseCalculada = item.totalDsa ?? (((item.cantidadDsa ?? 0) * (item.precioUnitarioDsa ?? 0)) - (item.descuentoDsa ?? 0));
                                                                const valorReteIca = parseFloat((((baseCalculada * (isNaN(pctIca) ? 0 : pctIca)) / 100) / 1000).toFixed(2));

                                                                updateDetailItem(item.registroDsa, current => ({
                                                                    ...current,
                                                                    porcentajeReteIca: rawValue === '' ? 0 : pctIca,
                                                                    reteIcaDsa: valorReteIca,
                                                                    baseReteIca: baseCalculada
                                                                }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* Valor ReteICA */}
                                                    <div className="flex flex-col">
                                                        <span className="z-10 text-xs font-medium mb-1 whitespace-nowrap text-center">Valor ReteICA</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center bg-background"
                                                            value={item.reteIcaDsa || ''}
                                                            disabled={documentoSoporteValidadoDian}
                                                            onChange={(e) => {
                                                                const valIca = parseFloat(e.target.value) || 0;
                                                                updateDetailItem(item.registroDsa, current => ({ ...current, reteIcaDsa: valIca }));
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>

                                                    {/* Valor Total */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 whitespace-nowrap text-center">Valor Total</span>
                                                        <span className="font-bold text-primary min-w-[80px] text-right h-8 flex items-center justify-center px-2">
                                                            ${formatCurrency((item.totalDsa ?? 0) - (item.reteRentaDsa ?? 0) - (item.reteIcaDsa ?? 0))}
                                                        </span>
                                                    </div>

                                                    {/* Botón Agregar / Eliminar */}
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-transparent">{isDraftItem ? 'Agregar' : 'Eliminar'}</span>
                                                        {isDraftItem ? (
                                                            <Button
                                                                type="button"
                                                                size="sm"
                                                                onClick={addDraftItemToCart}
                                                                disabled={
                                                                    documentoSoporteValidadoDian
                                                                    || !item.nombreProducto?.trim()
                                                                    || !(Number(item.precioUnitarioDsa) > 0)
                                                                    || !(Number(item.cantidadDsa) > 0)
                                                                }
                                                                className="h-8 gap-1 px-3"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                                Agregar
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeFromCart(item.registroDsa)}
                                                                disabled={documentoSoporteValidadoDian}
                                                                className="text-destructive hover:text-destructive h-8 w-8 p-0 flex items-center justify-center"
                                                            >
                                                                <Trash className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    {/* Panel de Totales y Pago */}
                    {(documentoSoporte.detalleDsa ?? []).length > 0 && (
                        <div className="border-t flex flex-col h-[400px]">
                            <div className="h-[100px] overflow-y-auto">
                                {/* Totales */}
                                <div className="p-2 space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
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
                                    {documentoSoporteValidadoDian ? (
                                        <FacturaModal
                                            key={`ver-factura-${documentoSoporte.idDsa}`}
                                            facturaData={documentoSoporteModalData ?? undefined}
                                            triggerText="Ver DSA"
                                            triggerVariant="default"
                                            triggerClassName="flex-1 h-full text-sm font-bold gap-2"
                                            idVenta={documentoSoporte.idDsa}
                                            idMetodoDian={documentoSoporte.idMetodoDian || 0}
                                        />
                                    ) : (
                                        <Button
                                            onClick={() => handlePaymentModalChange(true)}
                                            disabled={!(total > 0)}
                                            className="flex-1 h-full text-sm font-bold"
                                            size="lg"
                                        >
                                            <Check className="h-4 w-4 mr-2" />
                                            Procesar DSA
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
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
                                value={documentoSoporte.idFormaPagoDsa?.toString() || ""}
                                disabled={documentoSoporteValidadoDian}
                                onValueChange={(value) => {
                                    const idForma = parseInt(value);
                                    const formaPago = formasPago.find(
                                        forma => forma.idFormaPago === idForma
                                    );
                                    const nombreNuevaFormaPago = formaPago?.nombreFormaPago?.trim().toLowerCase() ?? '';
                                    const esNuevaFormaCredito = ['crédito', 'credito'].includes(nombreNuevaFormaPago);
                                    const resetearPagos = idForma !== documentoSoporte.idFormaPagoDsa && nombreNuevaFormaPago !== 'contado';
                                    const idMedioPagoPredeterminado = tipoDocumentoSeleccionado?.idMedioPago;
                                    const fechaDocumento = documentoSoporte.fechaDsa || getLocalDate();
                                    const plazoDias = esNuevaFormaCredito
                                        ? Math.max(0, Number(documentoSoporte.plazoDiasDsa ?? 30))
                                        : 0;

                                    setDocumentoSoporte(prev => ({
                                        ...prev,
                                        idFormaPagoDsa: idForma,
                                        plazoDiasDsa: plazoDias,
                                        fechaVencimientoDsa: esNuevaFormaCredito
                                            ? addDaysToDate(fechaDocumento, plazoDias)
                                            : fechaDocumento,
                                    }));
                                    setCambioEfectivo(0);
                                    setPagosAgregados(resetearPagos ? [] : pagosAgregados);
                                    setActivePaymentMethod(idMedioPagoPredeterminado != null ? String(idMedioPagoPredeterminado) : '');
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
                                        value={documentoSoporte.plazoDiasDsa ? String(documentoSoporte.plazoDiasDsa) : ''}
                                        disabled={documentoSoporteValidadoDian}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === '') {
                                                const fechaDocumento = documentoSoporte.fechaDsa || getLocalDate();
                                                setDocumentoSoporte(prev => ({
                                                    ...prev,
                                                    plazoDiasDsa: 0,
                                                    fechaVencimientoDsa: addDaysToDate(fechaDocumento, 0)
                                                }));
                                                return;
                                            }

                                            const parsed = parseInt(val, 10);
                                            const plazoDias = isNaN(parsed) ? 0 : Math.max(0, parsed);
                                            const fechaDocumento = documentoSoporte.fechaDsa || getLocalDate();

                                            setDocumentoSoporte(prev => ({
                                                ...prev,
                                                plazoDiasDsa: plazoDias,
                                                fechaVencimientoDsa: addDaysToDate(fechaDocumento, plazoDias)
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
                                        value={documentoSoporte.fechaVencimientoDsa ?? ''}
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
                                            disabled={documentoSoporteValidadoDian}
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
                                            disabled={documentoSoporteValidadoDian}
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
                                                documentoSoporteValidadoDian ||
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
                                                const nuevoMedioPago = {
                                                    idMedioPago: parseInt(activePaymentMethod),
                                                    valorMedioPago: montoAplicado,
                                                };

                                                setPagosAgregados(prev => [...prev, nuevoMedioPago]);
                                                setActivePaymentMethod('');
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

                        {!esCredito && pagosAgregados.length > 0 && (
                            <div className="border rounded-md p-3 mb-4 space-y-2 max-h-32 overflow-y-auto">
                                <span className="text-xs text-muted-foreground font-medium block">Pagos agregados:</span>
                                {pagosAgregados.map((item, index) => (
                                    <div key={`${item.idMedioPago}-${index}`} className="flex justify-between items-center text-sm border-b pb-1">
                                        <span>{mediosPago.find(medioPago => medioPago.idMedioPago === item.idMedioPago)?.nombreMedioPago || 'Método'}</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="font-semibold">${formatCurrency(item.valorMedioPago)}</span>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                disabled={documentoSoporteValidadoDian}
                                                className="h-6 w-6 p-0 text-red-500"
                                                onClick={() => {
                                                    setPagosAgregados(prev => prev.filter((_, i) => i !== index));
                                                    setCambioEfectivo(0);
                                                }}
                                            >
                                                ✕
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Información del Cliente / Tercero */}
                        {documentoSoporte.terceroDsa?.primerApellido && (
                            <Alert className="mb-4">
                                <User className="h-4 w-4" />
                                <AlertDescription className="flex flex-col space-y-1">
                                    <span className="text-xs text-muted-foreground">Nombre Tercero</span>
                                    <div className="flex items-center justify-between">
                                        <span>{`${documentoSoporte.terceroDsa.primerNombre} ${documentoSoporte.terceroDsa.primerApellido}`}</span>
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
                                disabled={documentoSoporteValidadoDian || (!esCredito && saldoPendiente !== 0)}
                                onClick={() => {
                                    setShowPayment(false);
                                    handleSaveDocumentoSoporte();
                                }}
                                className="flex-1"
                            >
                                Confirmar Pago
                            </Button>
                            <Button
                                variant="outline"
                                disabled={documentoSoporteValidadoDian}
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
        </div>
    );
};

export default DocumentoSoporteMaster;