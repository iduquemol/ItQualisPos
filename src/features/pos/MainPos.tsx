import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Clock, Star, Scan, Package, AlertTriangle, Tag, Gift, Users, Trash } from 'lucide-react';
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
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";

const RetailPOS = () => {
    // const [cart, setCart] = useState<IProducto[]>([]);
    const [factura, setFactura] = useState<IVenta>({
        idVenta: 0,
        idTipoDocumento: 1,
        codigoDocumento: '',
        nombreDocumento: null,
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
    const [activePaymentMethod, setActivePaymentMethod] = useState('cash');
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
        emailTercero: 'iduque2001@hotmail.com'
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
    const [openDialog, setOpenDialog] = useState(false);
    const [searchDocumento, setSearchDocumento] = useState("");
    const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
    const [lastKeyTime, setLastKeyTime] = useState<number>(0);
    const BARCODE_DELAY = 50;

    const paymentMethods = [
        { id: 'cash', name: 'Efectivo', icon: DollarSign, color: 'bg-green-500' },
        { id: 'card', name: 'Tarjeta', icon: CreditCard, color: 'bg-blue-500' },
        { id: 'digital', name: 'Credito', icon: Zap, color: 'bg-purple-500' }
    ];

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
            const data = await ProductoService.getAll();
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
        fetchCategories();
        fetchTipoDocumentoIdentidad();
        fetchTiposDocumento();
        fetchDocumentoLista();
        fetchProducts();
        fetchTerceros();
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
            idTipoDocumento: data.idTipoDocumento,
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

        try {
            if (factura.idVenta) {
                // Actualizar factura existente
                //await VentaService.update(factura);
                console.log("Factura actualizada:", factura);
                toast.success("Factura actualizada correctamente", {
                    position: "top-center",
                });
            } else {
                const result = await VentaService.create(factura);
                console.log("Factura guardada:", result);
                toast.success(
                    result.message +
                    "\nNúmero de factura: " + result.idFactura +
                    "\nNúmero Documento Dian: " + result.numeroDocumentoDian,
                    {
                        position: "top-center",
                    }
                );
            }
            //fetchProducts();
        } catch (error) {
            console.error('Error al guardar la factura:', error);
        }
    };



    // Funciones del carrito
    const addToCart = (product: IProducto) => {
        if (product.stockActualProducto < 0) {
            return;
        }

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
                        idDetalleVenta: 0, // Asignar un ID único si es necesario
                        registroVenta: (factura.detalleVenta ? factura.detalleVenta.length : 0) + 1,
                        idProducto: product.idProducto ?? 0,
                        codigoProducto: product.codigoProducto,
                        nombreProducto: product.nombreProducto,
                        precioUnitarioVenta: product.precioUnitario,
                        cantidadVenta: 1.0,
                        descuentoVenta: 0, // Asignar descuento si es necesario
                        ivaVenta: (product.precioUnitario * 1) * 0.19, // Asignar IVA si es necesario
                        totalVenta: 0,
                        costoUnitarioVenta: 0,
                        costoTotalVenta: 0, // Asignar costo si es necesario
                        porcentajeIvaVenta: 19,
                        porcentajeDescuentoVenta: 0
                    }
                ]
            });
        }
    };

    const updateQuantity = (id, change) => {
        const product = products.find(p => p.idProducto === id);
        setCart(cart.map(item => {
            if (item.idProducto === id) {
                const newQuantity = item.quantity + change;
                if (newQuantity <= 0) return null;
                if (newQuantity > product.stock) {
                    return item;
                }
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(Boolean));
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
    const discount = subtotal * (Number(customerDiscount) / 100);
    const tax = 0; // IVA 16%
    // const loyaltyDiscount = customerInfo.loyalty ? subtotal * 0.05 : 0; // 5% descuento por lealtad
    const total = subtotal - discount + tax;
    const totalItems = factura.detalleVenta?.reduce((sum, item) => sum + item.cantidadVenta, 0);
    const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            {/* Panel Superior */}
            <div className="w-full border-b bg-card p-4">
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

                    {/* Centro - Botón Cliente y Badge Online */}
                    <div className="flex items-center space-x-4 mb-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowCustomer(!showCustomer)}
                            className="flex items-center space-x-2"
                        >
                            <Users className="h-4 w-4" />
                            <span>Cliente</span>
                        </Button>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                            Online
                        </Badge>
                    </div>

                    {/* Lado derecho - Reloj */}
                    <div className="flex items-center space-x-4 mb-2">
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
                        <Badge className="flex items-center gap-1 px-2 py-1 text-base bg-primary text-primary-foreground">
                            <User className="w-4 h-4 mr-1" />
                            Usuario Actual : Administrador
                        </Badge>
                        <Clock className="h-5 w-5" />
                        <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">

                {/* Panel Izquierdo - Carrito (70%) */}
                <div className="w-[70%] flex flex-col h-screen">
                    {/* Header del Carrito */}
                    <div className="p-3 border-b h-[60px] shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-normal">Tipo de documento</h2>
                                <select
                                    className="rounded border px-3 py-2 text-sm bg-background w-48"
                                    value={factura.idTipoDocumento}
                                    onChange={(e) => setFactura({ ...factura, idTipoDocumento: parseInt(e.target.value) })}
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
                                    value={factura.prefijoVenta}
                                    onChange={(e) => setFactura({ ...factura, prefijoVenta: e.target.value })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                    value={factura.numeroVenta}
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
                    {showCustomer && (
                        <div className="border-b bg-muted/50">
                            <div className="p-4">
                                <div className="grid grid-cols-5 gap-3">
                                    <select
                                        className="w-full rounded border px-3 py-2 text-sm bg-background"
                                        value={factura.terceroVenta.idTipoDocumentoId}
                                        onChange={(e) => setFactura({ ...factura, terceroVenta: { ...factura.terceroVenta, idTipoDocumentoId: parseInt(e.target.value) } })}
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
                                        value={factura.terceroVenta.numeroIdentificacion || ''}
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
                                        value={factura.terceroVenta.primerNombre || ''}
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
                                        value={factura.terceroVenta.primerApellido || ''}
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
                            </div>
                        </div>
                    )}

                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {factura.detalleVenta.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-muted-foreground font-medium">Carrito vacío</p>
                                <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {(factura.detalleVenta ?? []).map(item => (
                                    <Card key={item.idProducto} className="p-3">
                                        <div className="flex items-center justify-between">
                                            {/* Información del producto */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{item.nombreProducto}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">{item.codigoProducto}</Badge>
                                                    <span className="text-sm text-muted-foreground">${formatCurrency(item.precioUnitarioVenta)}</span>
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
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: (factura.detalleVenta ?? []).map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? {
                                                                                ...detalleItem, porcentajeDescuentoVenta: parseFloat(e.target.value) || 0,
                                                                                descuentoVenta: (item.precioUnitarioVenta * item.cantidadVenta) * ((parseFloat(e.target.value) || 0) / 100)
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
                                                                setFactura({
                                                                    ...factura,
                                                                    detalleVenta: factura.detalleVenta.map(detalleItem =>
                                                                        detalleItem.idProducto === item.idProducto
                                                                            ? { ...detalleItem, descuentoVenta: parseFloat(e.target.value) || 0 }
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
                                                                    detalleVenta: factura.detalleVenta.map(detalleItem =>
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
                                                                    if (newQuantity >= 0) {
                                                                        setFactura({
                                                                            ...factura,
                                                                            detalleVenta: factura.detalleVenta.map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? { ...detalleItem, cantidadVenta: newQuantity }
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
                                                        <span className="text-xs font-bold mb-1 whitespace-nowrap text-center">Precio Total</span>
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
                        <div className="border-t flex flex-col h-[300px]" >
                            <div className="h-[120px] overflow-y-auto">

                                {/* Totales */}
                                <div className="p-4 space-y-4">
                                    {/* Resumen */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">Subtotal</span>
                                            <span>${formatCurrency(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">IVA (19%)</span>
                                            <span>${formatCurrency(tax)}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${formatCurrency(total)}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>

                            {/* Botón de Pago */}
                            <div className="h-[60px] p-4 border-t bg-background">
                                <Button
                                    onClick={() => setShowPayment(true)}
                                    className="w-full h-[40px] text-lg font-bold"
                                    size="lg"
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    Procesar Venta
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
                                            ${formatCurrency(product.precioUnitario)}
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
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {paymentMethods.map(method => {
                                const IconComponent = method.icon;
                                return (
                                    <Button
                                        key={method.id}
                                        variant={activePaymentMethod === method.id ? "default" : "outline"}
                                        onClick={() => setActivePaymentMethod(method.id)}
                                        className="flex flex-col items-center p-3 h-auto"
                                    >
                                        <IconComponent className="h-5 w-5 mb-1" />
                                        <span className="text-xs">{method.name}</span>
                                    </Button>
                                );
                            })}
                        </div>

                        {/* Información del Cliente */}
                        {factura.terceroVenta.primerApellido && (
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

                        {/* Panel de Descuentos */}
                        <div className="space-y-4 mb-6">
                            <div className="space-y-2">
                                <Label htmlFor="discount">Descuento</Label>
                                <Select value={customerDiscount} onValueChange={setCustomerDiscount}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Sin descuento</SelectItem>
                                        <SelectItem value="5">5% - Promoción</SelectItem>
                                        <SelectItem value="10">10% - Cliente Frecuente</SelectItem>
                                        <SelectItem value="15">15% - Liquidación</SelectItem>
                                        <SelectItem value="20">20% - Empleado</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* <Separator /> */}
                        </div>


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
                                    handleSaveVenta();
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
        </div >
    );
};

export default RetailPOS;