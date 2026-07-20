import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Clock, Star, Scan, Package, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen } from 'lucide-react';
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
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tesseract from 'tesseract.js';
import { CategoryService } from '@/services/CategoryService';
import { ProductoService } from '@/services/ProductoService';
import { TerceroService } from '@/services/TerceroService';
import { ICategory } from '@/types/ICategoria';
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
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";
import { ITerceroDefault } from '@/types/ITerceroDefault';
import { IVentaMedioPago } from '@/types/IVentaMedioPago';
import FacturaModal from '../reports/FacturaModal';
import { ICotizacion } from '@/types/ICotizacion';
import { IParametrosVentaDefault } from '@/types/IParametrosVentaDefault';
import { CotizacionService } from '@/services/CotizacionService';

const MainEstimate = () => {
    const navigate = useNavigate();
    const [cotizacion, setCotizacion] = useState<ICotizacion>({
        idCotizacion: 0,
        idTipoDocumento: 7,
        codigoDocumento: '',
        nombreDocumento: null,
        numeroCotizacion: 0,
        prefijoCotizacion: '',
        fechaCotizacion: '',
        idUsuario: 1,
        totalRegistros: 0,
        cantidadProductos: 0,
        totalPrecio: 0,
        totalDescuento: 0,
        totalBaseIva: 0,
        totalIva: 0,
        totalCotizacion: 0,
        terceroCotizacion: {
            idTercero: null,
            idTipoDocumentoId: 0,
            digitoVerificacion: null,
            numeroIdentificacion: null,
            primerNombre: null,
            primerApellido: null,
            razonSocial: null,
            telefonoTercero: null,
            direccionTercero: null,
            idMunicipio: 0,
            emailTercero: null,
            idTipoPersona: null
        },
        detalleCotizacion: []

    });
    const [selectedFactura, setSelectedFactura] = useState<IVenta | null>(null);
    const [factura, setFactura] = useState<IVenta>({
        idVenta: null,
        idTipoDocumento: 0,
        codigoDocumento: '',
        nombreDocumento: null,
        idMetodoDian: null,
        idFormaPago: null,
        numeroVenta: null,
        prefijoVenta: '',
        fechaVenta: '',
        idPuntoVenta: null,
        idUsuario: null,
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
        terceroVenta: null,
        detalleVenta: [],
        mediosPagoVenta: [],
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [showPayment, setShowPayment] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState('');
    const [customerDiscount, setCustomerDiscount] = useState('0');
    const [terceroInfo, setTerceroInfo] = useState<ITercero>({
        
        idTercero: 1,
        idTipoDocumentoId: 7,
        nombreTipoDocumentoId: "CC",
        digitoVerificacion: "7",
        numeroIdentificacion: "222222222222",
        primerNombre: "Consumidor",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        razonSocial: "",
        telefonoTercero: 0,
        direccionTercero: "",
        emailTercero: 'iduque2001@hotmail.com',
        idDepartamento: 0,
        nombreDepartamento: 'Bogota',
        idMunicipio: 0,
        nombreMunicipio: 'Bogota',
        terceroActivo: true,
        terceroCliente: true,
        terceroEmpleado: true,
        terceroProveedor: true,
        terceroGeneral: true,
        idTipoRegimen: 0,
        idListaPreciosTercero: 0,
        retenedorIva: false,
        retenedorRenta: false,
        retenedorIca: false,
        declaraRenta: false,
        tarifaIca: 0,
        responsabilidadesTerceros: [],
    });
    const [showCustomer, setShowCustomer] = useState(false);
    const [barcodeInput, setBarcodeInput] = useState('');
    const [loyaltyPoints, setLoyaltyPoints] = useState(0);
    const [showScanner, setShowScanner] = useState(false);
    const [showOCR, setShowOCR] = useState(false);
    const [categories, setCategories] = useState<ICategory[]>([]);
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

    const BARCODE_DELAY = 50;

    const paymentMethods = [
        { id: '1', name: 'Efectivo', icon: DollarSign, color: 'bg-green-500' },
        { id: '2', name: 'Nequi', icon: CreditCard, color: 'bg-blue-500' },
        { id: '3', name: 'Daviplata', icon: Zap, color: 'bg-purple-500' },
        { id: '4', name: 'Tarjeta Débito', icon: Zap, color: 'bg-purple-500' },
        { id: '5', name: 'Tarjeta Crédito', icon: Zap, color: 'bg-purple-500' },
        { id: '6', name: 'Bonos', icon: Zap, color: 'bg-purple-500' },
        { id: '7', name: 'Vales', icon: Zap, color: 'bg-purple-500' },
        { id: '8', name: 'Otro', icon: Zap, color: 'bg-purple-500' },
    ];

    const [vendedores, setVendedores] = useState<any[]>([
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Vendedor 1" },
        { id: 3, nombre: "Vendedor 2" },
    ]);

    const fetchCategories = async () => {
        try {
            setCategoryError(null);
            setIsLoadingCategories(true);
            const data = await CategoryService.getAll();
            setCategories([
                { idCategoria: 0, codigoCategoria: 'all', nombreCategoria: 'Todo', iconCategoria: '🏪' },
                ...data
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
            const data = await TipoDocumentoService.getAll();
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

    const fetchProducts = async () => {
        try {
            setProductError(null);
            setIsLoadingProducts(true);
            const data = await ProductoService.getProductosVentaByTercero(cotizacion.terceroCotizacion?.numeroIdentificacion || "0");
            setProducts(data);
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
            const data = await TerceroService.getAll();
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

    const fetchParametrosVentaDefault = async () => {
        try {
            setParametrosVentaDefault(null);
            setIsLoadingTerceroDefault(true);
            const data = await VentaService.getParametrosVentaDefault();
            //console.log('Terceros por defecto cargado:', data);
            setParametrosVentaDefault(data);
            setCotizacion({
                ...cotizacion,
                idTipoDocumento: data.documentoCotizacion[0].idTipoDocumento,
                terceroCotizacion: {
                    idTercero: data.terceroVenta[0].idTercero,
                    idTipoDocumentoId: data.terceroVenta[0].idTipoDocumentoId,
                    numeroIdentificacion: data.terceroVenta[0].numeroIdentificacion,
                    primerNombre: data.terceroVenta[0].primerNombre,
                    primerApellido: data.terceroVenta[0].primerApellido,
                    razonSocial: data.terceroVenta[0].razonSocial,
                    emailTercero: data.terceroVenta[0].emailTercero,
                    telefonoTercero: 0,
                    direccionTercero: "",
                    idMunicipio: 0,
                    idTipoPersona: null,
                    digitoVerificacion: null,
                }
            });
        } catch (error) {
            console.error('Error:', error);
            setTerceroDefaultError('Error al cargar el tercero por defecto');
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

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.codigoBarras ? product.codigoBarras.includes(searchTerm) : false);
        const matchesCategory = parseInt(selectedCategory) === 0 || product.idCategoria === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const handleSelectTercero = (terc: ITercero) => {
        setFactura({
            ...factura,
            terceroVenta: {
                idTercero: terc.idTercero,
                idTipoDocumentoId: terc.idTipoDocumentoId,
                digitoVerificacion: terc.digitoVerificacion,
                numeroIdentificacion: terc.numeroIdentificacion,
                primerNombre: terc.primerNombre,
                primerApellido: terc.primerApellido,
                razonSocial: terc.razonSocial,
                telefonoTercero: terc.telefonoTercero,
                direccionTercero: terc.direccionTercero,
                idMunicipio: terc.idMunicipio,
                emailTercero: terc.emailTercero,
                idTipoPersona: 1
            }
        });
        setOpenDialogTercero(false);
    };

    const handleNew = async () => {
        await initializeComponent();
        setCotizacion({
            ...cotizacion,
            idCotizacion: 0,
            idTipoDocumento: cotizacion.idTipoDocumento || 7,
            codigoDocumento: '',
            nombreDocumento: null,
            numeroCotizacion: 0,
            prefijoCotizacion: '',
            fechaCotizacion: '',
            idUsuario: 1,
            totalRegistros: 0,
            cantidadProductos: 0,
            totalPrecio: 0,
            totalDescuento: 0,
            totalBaseIva: 0,
            totalIva: 0,
            totalCotizacion: 0,
            terceroCotizacion: {
                idTercero: cotizacion.terceroCotizacion?.idTercero || null,
                idTipoDocumentoId: cotizacion.terceroCotizacion?.idTipoDocumentoId || 0,
                digitoVerificacion: null,
                numeroIdentificacion: cotizacion.terceroCotizacion?.numeroIdentificacion || null,
                primerNombre: cotizacion.terceroCotizacion?.primerNombre || null,
                primerApellido: cotizacion.terceroCotizacion?.primerApellido || null,
                razonSocial: cotizacion.terceroCotizacion?.razonSocial || null,
                telefonoTercero: null,
                direccionTercero: null,
                idMunicipio: 0,
                emailTercero: cotizacion.terceroCotizacion?.emailTercero || null,
                idTipoPersona: null
            },
            detalleCotizacion: [],
        });
        setActivePaymentMethod('');
    };

    // Manejo de eventos para buscar tercero por número de identificación
    const handleSearchTercero = (numeroIdentificacion: string) => {
        const tercero = terceros.find(t => t.numeroIdentificacion === numeroIdentificacion);
        if (tercero) {
            setFactura({
                ...factura,
                terceroVenta: {
                    idTercero: tercero.idTercero ?? 0,
                    idTipoDocumentoId: tercero.idTipoDocumentoId ?? 7,
                    digitoVerificacion: tercero.digitoVerificacion ?? null,
                    numeroIdentificacion: tercero.numeroIdentificacion ?? null,
                    primerNombre: tercero.primerNombre ?? null,
                    primerApellido: tercero.primerApellido ?? null,
                    razonSocial: tercero.razonSocial ?? null,
                    telefonoTercero: tercero.telefonoTercero ?? null,
                    direccionTercero: tercero.direccionTercero ?? null,
                    idMunicipio: tercero.idMunicipio ?? 0,
                    emailTercero: tercero.emailTercero ?? null,
                    idTipoPersona: null
                }
            });
        } else {

        }
    };

    const handleSelectVenta = async (documento: IDocumentoLista) => {
        const data = await VentaService.getById(documento.idVenta);
        setSelectedFactura(data);
        setFactura({
            ...factura,
            idVenta: data?.idVenta ?? null,
            idTipoDocumento: data?.idTipoDocumento ?? 0,
            codigoDocumento: data?.codigoDocumento ?? '',
            nombreDocumento: data?.nombreDocumento ?? null,
            numeroVenta: data?.numeroVenta ?? null,
            prefijoVenta: data?.prefijoVenta ?? '',
            fechaVenta: data?.fechaVenta ?? '',
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
                idTercero: null,
                idTipoDocumentoId: 0,
                digitoVerificacion: null,
                numeroIdentificacion: null,
                primerNombre: null,
                primerApellido: null,
                razonSocial: null,
                telefonoTercero: null,
                direccionTercero: null,
                idMunicipio: 0,
                emailTercero: null,
                idTipoPersona: null
            },
            detalleVenta: data?.detalleVenta ?? [],
            mediosPagoVenta: data?.mediosPagoVenta ?? [],

        });
        setOpenDialog(false);
    };

    const handleSaveVenta = async () => {
        const todayLocal = new Date();
        const offsetMs = todayLocal.getTimezoneOffset() * 60 * 1000;
        const localISODate = new Date(todayLocal.getTime() - offsetMs).toISOString().split('T')[0];
        const updatedCotizacion = {
            ...cotizacion,
            fechaCotizacion: localISODate,
        };
        try {
            if (updatedCotizacion.idCotizacion) {
                // Actualizar cotización existente
                //await VentaService.update(cotizacion);
                console.log("Cotizacion actualizada:", cotizacion);
                toast.success("Cotizacion actualizada correctamente", {
                    position: "top-center",
                });
            } else {
                console.log("Cotizacion a guardar:", updatedCotizacion);
                const result = await CotizacionService.create(updatedCotizacion);
                console.log("Cotizacion guardada:", result);
                toast.success(
                    result.message + " " + result.idCotizacion,
                    {
                        position: "top-center",
                    }
                );
                const facturaId = result.idFactura ?? result.idCotizacion ?? 0;
                const data = await VentaService.getById(facturaId);
                setSelectedFactura(data);
                setFactura({
                    ...factura,
                    idVenta: data?.idVenta ?? null,
                    idTipoDocumento: data?.idTipoDocumento ?? 0,
                    codigoDocumento: data?.codigoDocumento ?? '',
                    nombreDocumento: data?.nombreDocumento ?? null,
                    numeroVenta: data?.numeroVenta ?? null,
                    prefijoVenta: data?.prefijoVenta ?? '',
                    fechaVenta: data?.fechaVenta ?? '',
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
                        idTercero: null,
                        idTipoDocumentoId: 0,
                        digitoVerificacion: null,
                        numeroIdentificacion: null,
                        primerNombre: null,
                        primerApellido: null,
                        razonSocial: null,
                        telefonoTercero: null,
                        direccionTercero: null,
                        idMunicipio: 0,
                         emailTercero: null,
                         idTipoPersona: null
                     },
                     detalleVenta: data?.detalleVenta ?? [],
                     mediosPagoVenta: data?.mediosPagoVenta ?? [],

                });
                 const dataPrint = await VentaService.printById(facturaId);
                 setFacturaModalData(dataPrint);
                 setShowFacturaModal(true);
            }
            await fetchProducts();
        } catch (error) {
            console.error('Error al guardar la cotizacion:', error);
        }
    };

    // Funciones del carrito
    const addToCart = (product: IProducto) => {

        const existingItem = cotizacion.detalleCotizacion?.find(item => item.idProducto === product.idProducto);
        if (existingItem) {
            // Si el producto ya está en el carrito, incrementa la cantidad
            setCotizacion({
                ...cotizacion,
                detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(item =>
                    item.idProducto === product.idProducto
                        ? { ...item, cantidadCotizacion: item.cantidadCotizacion + 1 }
                        : item
                )
            });
        } else {
            setCotizacion({
                ...cotizacion,
                detalleCotizacion: [
                    ...(cotizacion.detalleCotizacion || []),
                    {
                        idDetalleCotizacion: 0, // Asignar un ID único si es necesario
                        registroCotizacion: (cotizacion.detalleCotizacion ? cotizacion.detalleCotizacion.length : 0) + 1,
                        idProducto: product.idProducto ?? 0,
                        codigoProducto: product.codigoProducto,
                        nombreProducto: product.nombreProducto,
                        precioUnitarioCotizacion: product.precioUnitario,
                        cantidadCotizacion: 1.0,
                        descuentoCotizacion: 0, // Asignar descuento si es necesario
                        ivaCotizacion: parseFloat((product.precioUnitario * ((product.porcentajeIva || 0) / 100)).toFixed(2)),
                        totalCotizacion: 0,
                        costoUnitarioCotizacion: 0,
                        costoTotalCotizacion: 0, // Asignar costo si es necesario
                        porcentajeIvaCotizacion: product.porcentajeIva || 0,
                        porcentajeDescuentoCotizacion: 0
                    }
                ]
            });
        }
    };

    const updateQuantity = (id: number, change: number) => {
        setCotizacion({
            ...cotizacion,
            detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(item => {
                if (item.idProducto === id) {
                    const newQuantity = item.cantidadCotizacion + change;
                    return {
                        ...item,
                        cantidadCotizacion: newQuantity,
                        ivaCotizacion: parseFloat(
                            ((item.precioUnitarioCotizacion * newQuantity - item.descuentoCotizacion) * ((item.porcentajeIvaCotizacion || 0) / 100)).toFixed(2)
                        ),
                        descuentoCotizacion: parseFloat(
                            ((item.precioUnitarioCotizacion * newQuantity) * ((item.porcentajeDescuentoCotizacion || 0) / 100)).toFixed(2)
                        ),
                    };
                }
                return item;
            })
        });

    };

    const removeFromCart = (id: number) => {
        // Elimina el producto del carrito
        setCotizacion({
            ...cotizacion,
            detalleCotizacion: cotizacion.detalleCotizacion ? cotizacion.detalleCotizacion.filter(item => item.idProducto !== id) : []
        });
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
    const subtotal = (cotizacion.detalleCotizacion ?? []).reduce((sum, item) => sum + (item.precioUnitarioCotizacion * item.cantidadCotizacion), 0);
    const discount = (cotizacion.detalleCotizacion ?? []).reduce((descuento, item) => descuento + (item.descuentoCotizacion || 0), 0);
    const tax = (cotizacion.detalleCotizacion ?? []).reduce((iva, item) => iva + (item.ivaCotizacion || 0), 0);
    // const loyaltyDiscount = customerInfo.loyalty ? subtotal * 0.05 : 0; // 5% descuento por lealtad
    const total = subtotal - discount + tax;
    const totalItems = cotizacion.detalleCotizacion?.reduce((sum, item) => sum + item.cantidadCotizacion, 0);
    const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Panel Superior */}
            <div className="w-full border-b bg-card p-1">
                <div className="flex items-center justify-between">
                    {/* Lado izquierdo - Logo y título */}
                    <div className="flex items-center space-x-4 mb-2">
                        <div className="bg-primary p-3 rounded-lg">
                            <Package className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Astil</h1>
                            <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
                        </div>
                    </div>

                    {/* Centro - Total de la cotización */}
                    <div className="flex items-center space-x-4 mb-2">
                        <Badge className="flex items-center gap-2 px-4 py-2 text-lg bg-orange-500 text-white">
                            <span className="font-medium">Cotización</span>
                        </Badge>
                        <Badge className="flex items-center gap-2 px-4 py-2 text-lg bg-primary text-primary-foreground">
                            {/* <DollarSign className="w-5 h-5" /> */}
                            <span className="font-medium">Total:</span>
                            <span className="font-bold text-xl">${formatCurrency(total)}</span>
                        </Badge>
                    </div>

                    {/* Lado derecho - Reloj */}
                    <div className="flex items-center space-x-4 mb-2">
                        {showFacturaModal && (
                            <FacturaModal
                                idVenta={(factura?.idVenta ?? selectedFactura?.idVenta) ?? 0}
                                facturaData={facturaModalData}
                                triggerText="Imprimir Factura"
                                triggerVariant="secondary"
                                idMetodoDian={factura?.idMetodoDian || 0}
                            />
                        )}
                        <Button
                            variant="default"
                            size="icon"
                            title="Nueva factura"
                            onClick={() => handleNew()}
                            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <Plus className="w-5 h-5" />
                        </Button>
                        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" title="Buscar documento">
                                    <Search className="w-5 h-5" />
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
                        {/* Select de vendedor */}
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="vendedor-select" className="text-sm font-medium whitespace-nowrap">
                                Vendedor:
                            </Label>
                            <Select
                                value={vendedorSeleccionado.toString()}
                                onValueChange={(value) => setVendedorSeleccionado(parseInt(value))}
                            >
                                <SelectTrigger className="w-36" id="vendedor-select">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {vendedores.map(vendedor => (
                                        <SelectItem key={vendedor.id} value={vendedor.id.toString()}>
                                            {vendedor.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Badge className="flex items-center gap-1 px-2 py-1 text-base bg-primary text-primary-foreground">
                            <User className="w-4 h-4 mr-1" />
                            Administrador
                        </Badge>
                        <Clock className="h-5 w-5" />
                        <span>{new Date().toLocaleTimeString()}</span>
                        <Button
                            variant="default"
                            size="icon"
                            title="Salir"
                            onClick={() => {
                                navigate('/main-menu');
                            }}
                            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
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
                                    className="rounded border px-3 py-2 text-sm bg-background w-48"
                                    value={cotizacion.idTipoDocumento}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                        console.log(selectedId);
                                        const selectedTipoDocumento = tiposDocumento.find(td => td.idTipoDocumento === selectedId);
                                        setCotizacion({
                                            ...cotizacion,
                                            idTipoDocumento: selectedId,
                                            codigoDocumento: selectedTipoDocumento?.codigoDocumento || '',
                                            nombreDocumento: selectedTipoDocumento?.nombreDocumento || null
                                        });
                                    }}
                                    required
                                >
                                    {tiposDocumento.map(td => (
                                        <option key={td.idTipoDocumento} value={td.idTipoDocumento}>
                                            {td.nombreDocumento} ({td.codigoDocumento})
                                        </option>
                                    ))}
                                </select>
                                <h2 className="text-sm font-normal">Prefijo</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={cotizacion.prefijoCotizacion ?? ''}
                                    onChange={(e) => setCotizacion({ ...cotizacion, prefijoCotizacion: e.target.value })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                                                value={cotizacion.numeroCotizacion ?? ''}
                                                                onChange={(e) => setCotizacion({ ...cotizacion, numeroCotizacion: e.target.value === '' ? null : parseInt(e.target.value) })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Fecha</h2>
                                <input
                                    type="date"
                                    className="rounded border px-3 py-2 text-sm bg-background w-30"
                                    value={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setCotizacion({ ...cotizacion, fechaCotizacion: e.target.value })}
                                    readOnly
                                />
                            </div>

                            <Badge className="bg-primary text-primary-foreground">
                                {totalItems}
                            </Badge>
                        </div>
                    </div>

                    {/* Panel de Cliente */}

                    <div className="border-b bg-muted/50">
                        <div className="flex items-center gap-2 ml-3 mt-2 mb-2 mr-2">
                            <h2 className="text-sm font-normal">Cliente</h2>
                            <div className="grid grid-cols-5 gap-1">
                                <select
                                    className="w-full rounded border px-2 py-2 text-sm bg-background w-42"
                                    value={cotizacion.terceroCotizacion?.idTipoDocumentoId ?? 0}
                                        onChange={(e) => setCotizacion({ ...cotizacion, terceroCotizacion: { ...(cotizacion.terceroCotizacion ?? {} as any), idTipoDocumentoId: parseInt(e.target.value) } })}
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
                                    value={cotizacion.terceroCotizacion?.numeroIdentificacion || ''}
                                        onChange={(e) => {
                                        const value = e.target.value;
                                        setCotizacion({
                                            ...cotizacion,
                                            terceroCotizacion: {
                                                ...(cotizacion.terceroCotizacion ?? {} as any),
                                                numeroIdentificacion: value
                                            }
                                        });
                                        // Buscar tercero después de un pequeño delay para evitar muchas búsquedas
                                        if (value.length >= 3) {
                                            handleSearchTercero(value);
                                        }
                                    }}
                                    onFocus={(e) => e.target.select()}
                                    onBlur={(e) => {
                                        // Búsqueda al perder el foco
                                        if (e.target.value) {
                                            handleSearchTercero(e.target.value);
                                        }
                                    }}
                                />
                                <Input
                                    placeholder="Primer Nombre"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={cotizacion.terceroCotizacion?.primerNombre || ''}
                                    onChange={(e) => setCotizacion({
                                        ...cotizacion,
                                        terceroCotizacion: {
                                            ...(cotizacion.terceroCotizacion ?? {} as any),
                                            primerNombre: e.target.value
                                        }
                                    })}
                                />
                                <Input
                                    placeholder="Primer Apellido"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={cotizacion.terceroCotizacion?.primerApellido || ''}
                                    onChange={(e) => setCotizacion({
                                        ...cotizacion,
                                        terceroCotizacion: {
                                            ...(cotizacion.terceroCotizacion ?? {} as any),
                                            primerApellido: e.target.value
                                        }
                                    })}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={cotizacion.terceroCotizacion?.emailTercero || ''}
                                    onChange={(e) => setCotizacion({
                                        ...cotizacion,
                                        terceroCotizacion: {
                                            ...(cotizacion.terceroCotizacion ?? {} as any),
                                            emailTercero: e.target.value
                                        }
                                    })}
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
                        </div>

                    </div>


                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {(cotizacion.detalleCotizacion ?? []).length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-muted-foreground font-medium">Carrito vacío</p>
                                <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {(cotizacion.detalleCotizacion ?? []).map(item => (
                                    <Card key={item.idProducto} className="p-1">
                                        <div className="flex items-center justify-between">
                                            {/* Información del producto */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{item.nombreProducto}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">{item.codigoProducto}</Badge>
                                                    <span className="text-sm text-muted-foreground">${formatCurrency(item.precioUnitarioCotizacion)}</span>
                                                </div>
                                            </div>

                                            {/* Contenedor para campos alineados */}
                                            <div className="flex items-end gap-2">
                                                {/* Campos de descuento e IVA */}
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeDescuentoCotizacion || ''}
                                                            onChange={(e) => {
                                                                const valorDescuento = parseFloat(((item.precioUnitarioCotizacion * item.cantidadCotizacion) * ((parseFloat(e.target.value) || 0) / 100)).toFixed(2));
                                                                setCotizacion({
                                                                    ...cotizacion,
                                                                    detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                porcentajeDescuentoCotizacion: parseFloat(e.target.value) || 0,
                                                                                descuentoCotizacion: valorDescuento
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                });
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.descuentoCotizacion || ''}
                                                            onChange={(e) => {
                                                                setCotizacion({
                                                                    ...cotizacion,
                                                                    detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, descuentoCotizacion: parseFloat(e.target.value) || 0 }
                                                                            : detalleItem
                                                                    )
                                                                });
                                                            }}
                                                            placeholder="0"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% IVA</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeIvaCotizacion || ''}
                                                            onChange={(e) => {
                                                                setCotizacion({
                                                                    ...cotizacion,
                                                                    detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem, porcentajeIvaCotizacion: parseFloat(e.target.value) || 0,
                                                                                ivaCotizacion: (detalleItem.precioUnitarioCotizacion * detalleItem.cantidadCotizacion) * ((parseFloat(e.target.value) || 0) / 100)
                                                                            }
                                                                            : detalleItem
                                                                    )
                                                                });
                                                            }}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor IVA</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.ivaCotizacion || ''}
                                                            onChange={(e) => {
                                                                setCotizacion({
                                                                    ...cotizacion,
                                                                    detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, ivaCotizacion: parseFloat(e.target.value) || 0 }
                                                                            : detalleItem
                                                                    )
                                                                });
                                                            }}
                                                            placeholder="0"
                                                            disabled
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
                                                                onClick={() => updateQuantity(item.idProducto, -1)}
                                                                className="h-8 w-8 rounded-r-none"
                                                            >
                                                                <Minus className="h-4 w-4" />
                                                            </Button>
                                                            <Input
                                                                type="number"
                                                                value={item.cantidadCotizacion}
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newQuantity = value === '' ? 0 : parseFloat(value);
                                                                    if (newQuantity >= 0) {
                                                                        setCotizacion({
                                                                            ...cotizacion,
                                                                            detalleCotizacion: (cotizacion.detalleCotizacion ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        cantidadCotizacion: newQuantity,
                                                                                        ivaCotizacion: parseFloat(((item.precioUnitarioCotizacion * newQuantity - item.descuentoCotizacion) * ((item.porcentajeIvaCotizacion || 0) / 100)).toFixed(2)),
                                                                                        descuentoCotizacion: parseFloat(((item.precioUnitarioCotizacion * newQuantity) * ((item.porcentajeDescuentoCotizacion || 0) / 100)).toFixed(2)),
                                                                                    }
                                                                                    : detalleItem
                                                                            )
                                                                        });
                                                                    }
                                                                }}
                                                                className="w-16 h-8 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                            />
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => updateQuantity(item.idProducto, 1)}
                                                                className="h-8 w-8 rounded-l-none"
                                                            >
                                                                <Plus className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 whitespace-nowrap text-center">Valor Total</span>
                                                        <span className="font-bold text-primary min-w-[80px] text-right h-8 flex items-center justify-end">
                                                            ${formatCurrency((item.precioUnitarioCotizacion * item.cantidadCotizacion) - item.descuentoCotizacion + item.ivaCotizacion)}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 text-transparent">Eliminar</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => removeFromCart(item.idProducto)}
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
                    {(cotizacion.detalleCotizacion ?? []).length > 0 && (
                        <div className="border-t flex flex-col h-[400px]" >
                            <div className="h-[100px] overflow-y-auto">

                                {/* Totales */}
                                <div className="p-2 space-y-2">
                                    {/* Resumen */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>${formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Descuento</span>
                                            <span>${formatCurrency(discount)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">IVA</span>
                                            <span>${formatCurrency(tax)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botón de Pago */}
                            <div className="h-[60px] p-4 border-t bg-background">
                                <Button
                                    onClick={handleSaveVenta}
                                    className="w-full h-[40px] text-lg font-bold"
                                    size="lg"
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    Guardar cotización
                                </Button>
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
                                className="pl-10 w-full"
                            />
                        </div>

                    </div>


                    {/* Categorías */}
                    <div className="border-b p-2 h-[80px]">
                        <Tabs value={selectedCategory.toString()} onValueChange={setSelectedCategory} className="w-full">
                            <TabsList className="flex flex-wrap gap-1 h-full">
                                {categories.map(category => (
                                    <TabsTrigger
                                        key={category.idCategoria}
                                        value={category.idCategoria.toString()}
                                        disabled={isLoadingCategories}
                                        className="flex items-center space-x-1 px-2 py-1 flex-1 min-w-[calc(33.33%-4px)]"
                                    >
                                        <span>{category.iconCategoria}</span>
                                        <span className="text-sm">{category.nombreCategoria}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* Grid de Productos */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredProducts.map(product => (
                                <Card
                                    key={product.idProducto}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${((product.stockActualProducto ?? 0) <= 0) ? 'border-destructive/50' : ''
                                        }`}
                                    onClick={() => addToCart(product)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="text-xs">
                                                {product.codigoProducto}
                                            </Badge>
                                            {/* {product.stockActualProducto !== null && product.stockActualProducto <= 0 && (
                                                <AlertTriangle className="h-4 w-4 text-destructive" />
                                            )} */}
                                        </div>
                                    </CardHeader>

                                    <CardContent className="text-center space-y-2">
                                        {/* <div className="text-4xl mb-2">{product.image}</div> */}
                                        <CardTitle className="text-sm leading-tight line-clamp-2">
                                            {product.nombreProducto}
                                        </CardTitle>
                                        {/* <CardDescription className="text-xs">{product.brand}</CardDescription> */}
                                        {/* {product.size && (
                                            <Badge variant="outline" className="text-xs">
                                                Talla {product.size}
                                            </Badge>
                                        )} */}
                                    </CardContent>

                                    <CardFooter className="flex flex-col space-y-2 pt-2">
                                        <div className="text-lg font-bold text-primary">
                                            ${formatCurrency(product.precioPos)}
                                        </div>
                                            <Badge
                                                variant={(product.stockActualProducto ?? 0) > 0 ? "secondary" : "destructive"}
                                                className="text-xs"
                                            >
                                                Stock: {product.stockActualProducto ?? 0}
                                            </Badge>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

            </div>

        </div >
    );
};

export default MainEstimate;