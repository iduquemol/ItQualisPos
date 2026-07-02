import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Clock, Star, Scan, Package, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen, FileText, Send } from 'lucide-react';
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
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";
import { ITerceroDefault } from '@/types/ITerceroDefault';
import { IVentaMedioPago } from '@/types/IVentaMedioPago';
import FacturaModal from '../reports/FacturaModal';
import { IParametrosVentaDefault } from '@/types/IParametrosVentaDefault';

const RetailPOS = () => {
    const navigate = useNavigate();
    const [factura, setFactura] = useState<IVenta>({
        idVenta: 0,
        idTipoDocumento: 4,
        codigoDocumento: '',
        nombreDocumento: null,
        idMetodoDian: 2,
        idFormaPago: 1,
        numeroVenta: 0,
        prefijoVenta: '',
        fechaVenta: '',
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
        terceroVenta: {
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
        detalleVenta: [],
        mediosPagoVenta: []
    });
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
        primerApellido: 'Final',
        razonSocial: '',
        telefonoTercero: 0,
        direccionTercero: '',
        idMunicipio: 0,
        nombreTipoDocumentoId: 'CC',
        nombreMunicipio: 'Bogota',
        emailTercero: 'iduque2001@hotmail.com',
        terceroActivo: true,
        terceroCliente: true,
        terceroEmpleado: true,
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
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

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

    const fetchProducts = async () => {
        try {
            setProductError(null);
            setIsLoadingProducts(true);
            const data = await ProductoService.getProductosVentaByTercero(factura.terceroVenta?.numeroIdentificacion || "0");
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
            setParametrosVentaDefault(data);
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
                    telefonoTercero: 0,
                    direccionTercero: "",
                    idMunicipio: 0,
                    idTipoPersona: null,
                    digitoVerificacion: null,
                }
            });
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
        setFactura({
            ...factura,
            idVenta: 0,
            idTipoDocumento: 4,
            codigoDocumento: '',
            nombreDocumento: null,
            idMetodoDian: 2,
            idFormaPago: 1,
            numeroVenta: 0,
            prefijoVenta: '',
            fechaVenta: '',
            idPuntoVenta: 1,
            idUsuario: 1,
            totalRegistros: 0,
            cantidadProductos: 0,
            totalPrecio: 0,
            totalDescuento: 0,
            totalBaseIva: 0,
            totalIva: 0,
            totalVenta: 0,
            terceroVenta: {
                idTercero: factura.terceroVenta?.idTercero ?? null,
                idTipoDocumentoId: factura.terceroVenta?.idTipoDocumentoId ?? 0,
                digitoVerificacion: factura.terceroVenta?.digitoVerificacion || null,
                numeroIdentificacion: factura.terceroVenta?.numeroIdentificacion || null,
                primerNombre: factura.terceroVenta?.primerNombre || null,
                primerApellido: factura.terceroVenta?.primerApellido || null,
                razonSocial: factura.terceroVenta?.razonSocial || null,
                telefonoTercero: factura.terceroVenta?.telefonoTercero || null,
                direccionTercero: factura.terceroVenta?.direccionTercero || null,
                idMunicipio: factura.terceroVenta?.idMunicipio ?? 0,
                emailTercero: factura.terceroVenta?.emailTercero || null,
                idTipoPersona: factura.terceroVenta?.idTipoPersona || null
            },
            detalleVenta: [],
            mediosPagoVenta: [],
        });
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

    // Manejo de eventos para buscar tercero por número de identificación
    const handleSearchTercero = (numeroIdentificacion: string) => {
        const tercero = terceros.find(t => t.numeroIdentificacion === numeroIdentificacion);
        if (tercero) {
            setFactura({
                ...factura,
                terceroVenta: {
                    ...tercero,
                    idTercero: tercero.idTercero ?? 0, // Asegurarse de que idTercero sea un número
                    idTipoDocumentoId: tercero.idTipoDocumentoId ?? 7, // Asignar un tipo de documento por defecto si es necesario
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
        setShowFacturaModal(true);
        const dataPrint = await VentaService.printById(documento.idVenta);
        setFacturaModalData(dataPrint);        
    };

    const handleSaveVenta = async (indBorrador: boolean) => {
        const todayLocal = new Date();
        const offsetMs = todayLocal.getTimezoneOffset() * 60 * 1000;
        const localISODate = new Date(todayLocal.getTime() - offsetMs).toISOString().split('T')[0];
        const updatedFactura = {
            ...factura,
            fechaVenta: localISODate,
            esBorrador: indBorrador ? 1 : 0,
        };
        try {
            if (updatedFactura.idVenta) {
                // Actualizar factura existente
                //await VentaService.update(factura);
                console.log("Factura actualizada:", factura);
                setSuccessMessage("Factura actualizada correctamente");
                setShowSuccessDialog(true);
            } else {
                console.log("Factura a guardar:", updatedFactura);
                const result = await VentaService.create(updatedFactura);
                console.log("Factura guardada:", result);
                setSuccessMessage(result.message +
                    "\nNúmero Documento Dian: " + result.numeroDocumentoDian);
                setShowSuccessDialog(true);
                const data = await VentaService.getById(result.idFactura);
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
                const dataPrint = await VentaService.printById(result.idFactura);
                setFacturaModalData(dataPrint);
                setShowFacturaModal(true);

            }
            //await fetchProducts();
        } catch (error) {
            console.error('Error al guardar la factura:', error);
        }
    };

    // Funciones del carrito
    const addToCart = (product: IProducto) => {
        const baseIvaVentaCalculada = parseFloat((product.precioUnitario - (product.porcentajeDescuento || 0) / 100).toFixed(2));
        const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * ((product.porcentajeIva || 0) / 100)).toFixed(2));
        // Si el tipo de producto es 2, siempre agregar como nuevo item
        if (product.idTipoProducto === 2) {
            setFactura({
                ...factura,
                detalleVenta: [
                    ...(factura.detalleVenta || []),
                    {
                        idDetalleVenta: 0,
                        registroVenta: (factura.detalleVenta ? factura.detalleVenta.length : 0) + 1,
                        idProducto: product.idProducto ?? 0,
                        codigoProducto: product.codigoProducto,
                        nombreProducto: product.nombreProducto,
                        precioUnitarioVenta: product.precioUnitario,
                        cantidadVenta: 1.0,
                        descuentoVenta: 0,
                        baseIvaVenta: baseIvaVentaCalculada,
                        ivaVenta: ivaVentaCalculada,
                        totalVenta: 0,
                        costoUnitarioVenta: 0,
                        costoTotalVenta: 0,
                        porcentajeIvaVenta: product.porcentajeIva || 0,
                        porcentajeDescuentoVenta: 0,
                        porcentajeImpoConsumo: product.porcentajeImpoConsumo || 0,
                        impoConsumoVenta: parseFloat((product.precioUnitario * ((product.porcentajeImpoConsumo || 0) / 100)).toFixed(2)),
                        porcentajeReteIva: product.porcentajeReteIva || 0,
                        reteIvaVenta: parseFloat((ivaVentaCalculada * ((product.porcentajeReteIva || 0) / 100)).toFixed(2)),
                        porcentajeReteRenta: product.porcentajeReteRenta || 0,
                        reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((product.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                        baseReteRenta: baseIvaVentaCalculada,
                        porcentajeReteIca: product.porcentajeReteIca || 0,
                        reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((product.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                        cantidadNotaCredito: 0,
                        indNotaCredito: false,
                        idTipoProducto: product.idTipoProducto || 0
                    }
                ]
            });
        } else {
            // Para otros tipos de producto, mantener la lógica original
            const existingItem = factura.detalleVenta?.find(item => item.idProducto === product.idProducto);
            if (existingItem) {
                // Si el producto ya está en el carrito, incrementa la cantidad
                setFactura({
                    ...factura,
                    detalleVenta: (factura.detalleVenta ?? []).map(item =>
                        item.idProducto === product.idProducto
                            ? { ...item, cantidadVenta: item.cantidadVenta + 1 }
                            : item
                    )
                });
            } else {
                setFactura({
                    ...factura,
                    detalleVenta: [
                        ...(factura.detalleVenta || []),
                        {
                            idDetalleVenta: 0,
                            registroVenta: (factura.detalleVenta ? factura.detalleVenta.length : 0) + 1,
                            idProducto: product.idProducto ?? 0,
                            codigoProducto: product.codigoProducto,
                            nombreProducto: product.nombreProducto,
                            precioUnitarioVenta: product.precioUnitario,
                            cantidadVenta: 1.0,
                            descuentoVenta: 0,
                            baseIvaVenta: baseIvaVentaCalculada,
                            ivaVenta: ivaVentaCalculada,
                            totalVenta: 0,
                            costoUnitarioVenta: 0,
                            costoTotalVenta: 0,
                            porcentajeIvaVenta: product.porcentajeIva || 0,
                            porcentajeDescuentoVenta: 0,
                            porcentajeImpoConsumo: product.porcentajeImpoConsumo || 0,
                            impoConsumoVenta: parseFloat((product.precioUnitario * ((product.porcentajeImpoConsumo || 0) / 100)).toFixed(2)),
                            porcentajeReteIva: product.porcentajeReteIva || 0,
                            reteIvaVenta: parseFloat((ivaVentaCalculada * ((product.porcentajeReteIva || 0) / 100)).toFixed(2)),
                            porcentajeReteRenta: product.porcentajeReteRenta || 0,
                            reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((product.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                            baseReteRenta: baseIvaVentaCalculada,
                            porcentajeReteIca: product.porcentajeReteIca || 0,
                            reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((product.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                            cantidadNotaCredito: 0,
                            indNotaCredito: false,
                            idTipoProducto: product.idTipoProducto || 0
                        }
                    ]
                });
            }
        }
    };

    const updateQuantity = (id: number, change: number) => {
        setFactura({
            ...factura,
            detalleVenta: (factura.detalleVenta ?? []).map(item => {
                if (item.idProducto === id) {
                    const newQuantity = item.cantidadVenta + change;
                    const baseIvaVentaCalculada = parseFloat((newQuantity * item.precioUnitarioVenta - (item.porcentajeDescuentoVenta || 0) / 100).toFixed(2));
                    const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * ((item.porcentajeIvaVenta || 0) / 100)).toFixed(2));
                    return {
                        ...item,
                        cantidadVenta: newQuantity,
                        baseIvaVenta: baseIvaVentaCalculada,
                        ivaVenta: ivaVentaCalculada,
                        descuentoVenta: parseFloat(
                            ((item.precioUnitarioVenta * newQuantity) * ((item.porcentajeDescuentoVenta || 0) / 100)).toFixed(2)
                        ),
                        reteIvaVenta: parseFloat((ivaVentaCalculada * ((item.porcentajeReteIva || 0) / 100)).toFixed(2)),
                        reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                        baseReteRenta: baseIvaVentaCalculada,
                        reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                    };
                }
                return item;
            })
        });

    };

    const removeFromCart = (id: number) => {
        // Elimina el producto del carrito
        setFactura({
            ...factura,
            detalleVenta: factura.detalleVenta ? factura.detalleVenta.filter(item => item.idProducto !== id) : []
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
    const subtotal = factura.detalleVenta?.reduce((sum, item) => sum + (item.precioUnitarioVenta * item.cantidadVenta), 0);
    const discount = factura.detalleVenta?.reduce((descuento, item) => descuento + item.descuentoVenta, 0);
    const tax = factura.detalleVenta?.reduce((iva, item) => iva + item.ivaVenta, 0);
    const totalReteIva = factura.detalleVenta?.reduce((reteIva, item) => reteIva + (item.reteIvaVenta || 0), 0);
    const totalReteRenta = factura.detalleVenta?.reduce((reteRenta, item) => reteRenta + (item.reteRentaVenta || 0), 0);
    const totalReteIca = factura.detalleVenta?.reduce((reteIca, item) => reteIca + (item.reteIcaVenta || 0), 0);
    const total = (subtotal || 0) - (discount || 0) + (tax || 0) - (totalReteIva || 0) - (totalReteRenta || 0) - (totalReteIca || 0);
    const totalItems = factura.detalleVenta?.reduce((sum, item) => sum + item.cantidadVenta, 0);
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

                    {/* Centro - Total de la factura */}
                    <div className="flex items-center space-x-4 mb-2">
                        <Badge className="flex items-center gap-2 px-4 py-2 text-lg bg-orange-500 text-white">
                            <span className="font-medium">Factura</span>
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
                            <div className="flex items-center space-x-2">
                                <FacturaModal
                                    facturaData={facturaModalData}
                                    triggerText="Imprimir Factura"
                                    triggerVariant="secondary"
                                    idVenta={factura?.idVenta || 0}
                                    idMetodoDian={factura?.idMetodoDian || 0}
                                />
                                <Button
                                    variant="outline"
                                    size="sm"
                                    title="Reenviar documento"
                                    onClick={() => handleResend()}
                                    className="flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Reenviar
                                </Button>
                            </div>
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
                                    value={factura.idTipoDocumento}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                        console.log(selectedId);
                                        const selectedTipoDocumento = tiposDocumento.find(td => td.idTipoDocumento === selectedId);
                                        setFactura({
                                            ...factura,
                                            idTipoDocumento: selectedId,
                                            idMetodoDian: selectedTipoDocumento?.idMetodoDian || 0,
                                            idFormaPago: selectedTipoDocumento?.idFormaPago || 0,
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
                                    value={factura.terceroVenta?.idTipoDocumentoId}
                                    onChange={(e) => setFactura({
                                        ...factura,
                                        terceroVenta: {
                                            ...factura.terceroVenta,
                                            idTipoDocumentoId: parseInt(e.target.value)
                                        }
                                    })}
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
                                    value={factura.terceroVenta?.numeroIdentificacion || ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFactura({
                                            ...factura,
                                            terceroVenta: {
                                                ...factura.terceroVenta,
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
                                    value={factura.terceroVenta?.primerNombre || ''}
                                    onChange={(e) => setFactura({
                                        ...factura,
                                        terceroVenta: {
                                            ...factura.terceroVenta,
                                            primerNombre: e.target.value
                                        }
                                    })}
                                />
                                <Input
                                    placeholder="Primer Apellido"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta?.primerApellido || ''}
                                    onChange={(e) => setFactura({
                                        ...factura,
                                        terceroVenta: {
                                            ...factura.terceroVenta,
                                            primerApellido: e.target.value
                                        }
                                    })}
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="rounded border px-2 py-2 text-sm bg-background w-26"
                                    value={factura.terceroVenta.emailTercero || ''}
                                    onChange={(e) => setFactura({
                                        ...factura,
                                        terceroVenta: {
                                            ...factura.terceroVenta,
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
                            </div>
                        </div>
                    </div>


                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {!factura.detalleVenta || factura.detalleVenta.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-muted-foreground font-medium">Carrito vacío</p>
                                <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {(factura.detalleVenta ?? []).map(item => (
                                    <Card key={item.idProducto} className="p-1">
                                        <div className="flex items-center justify-between">
                                            {/* Información del producto */}
                                            <div className="flex-1 min-w-0">
                                                {item.idTipoProducto === 2 ? (
                                                    <Input
                                                        value={item.nombreProducto}
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
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.registroVenta === item.registroVenta
                                                                            ? { ...detalleItem, precioUnitarioVenta: parseFloat(e.target.value) || 0 }
                                                                            : detalleItem
                                                                    )
                                                                });
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
                                                            checked={item.indMuestra || false}
                                                            onCheckedChange={(checked) => {
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.registroVenta === item.registroVenta
                                                                            ? { ...detalleItem, indMuestra: checked as boolean }
                                                                            : detalleItem
                                                                    )
                                                                });
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
                                                {/* Campos de descuento e IVA */}
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeDescuentoVenta || ''}
                                                            onChange={(e) => {
                                                                const baseIvaVentaCalculada = parseFloat((item.cantidadVenta * item.precioUnitarioVenta - (parseFloat(e.target.value) || 0) / 100).toFixed(2));
                                                                const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * ((item.porcentajeIvaVenta || 0) / 100)).toFixed(2));
                                                                const valorDescuento = parseFloat(((item.precioUnitarioVenta * item.cantidadVenta) * ((parseFloat(e.target.value) || 0) / 100)).toFixed(2));
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                porcentajeDescuentoVenta: parseFloat(e.target.value) || 0,
                                                                                descuentoVenta: valorDescuento,
                                                                                reteIvaVenta: parseFloat((ivaVentaCalculada * ((item.porcentajeReteIva || 0) / 100)).toFixed(2)),
                                                                                reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                                                                                baseReteRenta: baseIvaVentaCalculada,
                                                                                reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
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
                                                            value={item.descuentoVenta || ''}
                                                            onChange={(e) => {
                                                                const baseIvaVentaCalculada = parseFloat((item.cantidadVenta * item.precioUnitarioVenta - (item.porcentajeDescuentoVenta || 0) / 100).toFixed(2));
                                                                const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * ((item.porcentajeIvaVenta || 0) / 100)).toFixed(2));
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem,
                                                                                descuentoVenta: parseFloat(e.target.value) || 0,
                                                                                reteIvaVenta: parseFloat((ivaVentaCalculada * ((item.porcentajeReteIva || 0) / 100)).toFixed(2)),
                                                                                reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                                                                                baseReteRenta: baseIvaVentaCalculada,
                                                                                reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
                                                                            }
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
                                                            value={item.porcentajeIvaVenta || ''}
                                                            onChange={(e) => {
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem, porcentajeIvaVenta: parseFloat(e.target.value) || 0,
                                                                                ivaVenta: (detalleItem.precioUnitarioVenta * detalleItem.cantidadVenta) * ((parseFloat(e.target.value) || 0) / 100)
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
                                                            value={item.ivaVenta || ''}
                                                            onChange={(e) => {
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: factura.detalleVenta.map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, ivaVenta: parseFloat(e.target.value) || 0 }
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
                                                                value={item.cantidadVenta}
                                                                onFocus={(e) => e.target.select()}
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newQuantity = value === '' ? 0 : parseFloat(value);
                                                                    const baseIvaVentaCalculada = parseFloat((newQuantity * item.precioUnitarioVenta - (item.porcentajeDescuentoVenta || 0) / 100).toFixed(2));
                                                                    const ivaVentaCalculada = parseFloat((baseIvaVentaCalculada * ((item.porcentajeIvaVenta || 0) / 100)).toFixed(2));
                                                                    if (newQuantity >= 0) {
                                                                        setFactura({
                                                                            ...factura,
                                                                            detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        cantidadVenta: newQuantity,
                                                                                        baseIvaVenta: baseIvaVentaCalculada,
                                                                                        ivaVenta: ivaVentaCalculada,
                                                                                        descuentoVenta: parseFloat(((item.precioUnitarioVenta * newQuantity) * ((item.porcentajeDescuentoVenta || 0) / 100)).toFixed(2)),
                                                                                        reteIvaVenta: parseFloat((ivaVentaCalculada * ((item.porcentajeReteIva || 0) / 100)).toFixed(2)),
                                                                                        reteRentaVenta: parseFloat((baseIvaVentaCalculada * ((item.porcentajeReteRenta || 0) / 100)).toFixed(2)),
                                                                                        baseReteRenta: baseIvaVentaCalculada,
                                                                                        reteIcaVenta: parseFloat(((baseIvaVentaCalculada * ((item.porcentajeReteIca || 0) / 100)) / 1000).toFixed(2)),
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
                                                            ${formatCurrency((item.precioUnitarioVenta * item.cantidadVenta) - item.descuentoVenta + item.ivaVenta)}
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
                    {factura.detalleVenta.length > 0 && (
                        <div className="border-t flex flex-col h-[400px]" >
                            <div className="h-[100px] overflow-y-auto">
                                {/* Totales */}
                                <div className="p-2 space-y-2">
                                    {/* Resumen en dos columnas */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Primera columna - Subtotal, Descuento, IVA */}
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

                                        {/* Segunda columna - ReteFuente, ReteIVA, ReteICA */}
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">ReteFuente</span>
                                                <span>${formatCurrency(totalReteRenta)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-muted-foreground">ReteIVA</span>
                                                <span>${formatCurrency(totalReteIva)}</span>
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
                                    <Button
                                        onClick={() => setShowPayment(true)}
                                        className="flex-1 h-full text-sm font-bold"
                                        size="lg"
                                    >
                                        <Check className="h-4 w-4 mr-2" />
                                        Procesar Venta
                                    </Button>
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
                                    className={`cursor-pointer transition-all hover:shadow-lg ${product.stock <= product.minStock ? 'border-destructive/50' : ''
                                        }`}
                                    onClick={() => addToCart(product)}
                                >
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <Badge variant="secondary" className="text-xs">
                                                {product.codigoProducto}
                                            </Badge>
                                            {/* {product.stock <= product.minStock && (
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
                                        {/* <Badge
                                            variant={product.stock > product.minStock ? "secondary" :
                                                product.stock > 0 ? "outline" : "destructive"}
                                            className="text-xs"
                                        >
                                            Stock: {product.stock}
                                        </Badge> */}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal de Pago */}
                <Dialog open={showPayment} onOpenChange={setShowPayment}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader className="text-center">
                            <DialogTitle className="text-xl mb-4">Seleccionar método de pago</DialogTitle>
                        </DialogHeader>

                        {/* Métodos de Pago */}
                        <div className="mb-6">
                            <Label className="mb-2 block text-sm font-medium">Método de pago</Label>
                            <Select value={activePaymentMethod}
                                onValueChange={(value) => {
                                    setActivePaymentMethod(value);

                                    // Crear un nuevo medio de pago
                                    const nuevoMedioPago: IVentaMedioPago = {
                                        idMedioPagoVenta: 0,
                                        idMedioPago: parseInt(value),
                                        valorMedioPago: total
                                    };

                                    setFactura(prev => ({
                                        ...prev,
                                        //idFormaPago: nuevoMedioPago.idMedioPago,
                                        mediosPagoVenta: [nuevoMedioPago], // reemplaza o haz append si es necesario
                                    }));
                                }}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Selecciona un método de pago" />
                                </SelectTrigger>
                                <SelectContent>
                                    {paymentMethods.map(method => (
                                        <SelectItem key={method.id} value={method.id}>
                                            {method.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Información del Cliente */}
                        {factura.terceroVenta?.primerApellido && (
                            <Alert className="mb-6">
                                <User className="h-4 w-4" />
                                <AlertDescription className="flex flex-col space-y-1">
                                    <span className="text-xs text-muted-foreground">Nombre Cliente</span>
                                    <div className="flex items-center justify-between">
                                        <span>{`${factura.terceroVenta.primerNombre} ${factura.terceroVenta.primerApellido}`}</span>
                                        {/* {factura.terceroVenta.loyalty && (
                                            <Badge variant="secondary" className="ml-2">
                                                <Star className="h-3 w-3 mr-1 fill-current" />
                                                VIP
                                            </Badge>
                                        )} */}
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        <Card className="p-4 mb-6">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Total a Pagar</span>
                                    <span className="text-2xl font-bold text-primary">${formatCurrency(total)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Artículos</span>
                                    <span className="font-medium">{totalItems}</span>
                                </div>
                                {/* {customerInfo.loyalty && pointsEarned > 0 && (
                                    <div className="flex justify-between items-center text-amber-600">
                                        <span>Puntos a Ganar</span>
                                        <span className="font-medium">{pointsEarned} pts</span>
                                    </div>
                                )} */}
                            </div>
                        </Card>

                        <DialogFooter className="flex space-x-2">
                            <Button
                                onClick={() => {
                                    // Mostrar confirmación de pago
                                    setShowPayment(false);
                                    handleSaveVenta(false);
                                    // Aquí podrías mostrar otro modal de confirmación
                                }}
                                className="flex-1"
                            >
                                Confirmar Pago
                            </Button>
                            <Button
                                variant="outline"
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

export default RetailPOS;