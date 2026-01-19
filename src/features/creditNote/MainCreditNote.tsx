import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Clock, Star, Scan, Package, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen, Save } from 'lucide-react';
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
import { INotaCredito } from '@/types/INotaCredito';
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";
import { ITerceroDefault } from '@/types/ITerceroDefault';
import { IVentaMedioPago } from '@/types/IVentaMedioPago';
import FacturaModal from '../reports/FacturaModal';
import { IParametrosVentaDefault } from '@/types/IParametrosVentaDefault';
import { ConceptoNotaCreditoService } from '@/services/ConceptoNotaCreditoService';
import { IConceptoNotaCredito } from '@/types/IConceptoNotaCredito';
import { NotaCreditoService } from '@/services/NotaCreditoService';

const MainCreditNote = () => {
    const navigate = useNavigate();
    const [notaCredito, setNotaCredito] = useState<INotaCredito>({
        idNotaCredito: null,
        idTipoDocumento: 5,
        codigoDocumento: '',
        nombreDocumento: null,
        numeroNotaCredito: null,
        prefijoNotaCredito: '',
        fechaNotaCredito: '',
        conceptoNotaCredito: null,
        idUsuario: 1,
        totalRegistros: null,
        cantidadProductos: null,
        totalPrecio: null,
        totalDescuento: null,
        totalBaseIva: null,
        totalIva: null,
        totalVenta: null,
        idTerceroNotaCredito: null,
        numeroIdentificacionTerceroNotaCredito: null,
        nombreTerceroNotaCredito: null,
        idVenta: null,
        idConceptoCorreccionNota: null,
        detalleNotaCredito: [],
    });

    const [selectedFactura, setSelectedFactura] = useState<IVenta | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [showPayment, setShowPayment] = useState(false);
    const [activePaymentMethod, setActivePaymentMethod] = useState('');
    const [customerDiscount, setCustomerDiscount] = useState('0');
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
    const [conceptosNotaCredito, setConceptosNotaCredito] = useState<IConceptoNotaCredito[]>([]);
    const [isLoadingConceptosNotaCredito, setIsLoadingConceptosNotaCredito] = useState(true);
    const [conceptoNotaCreditoError, setConceptoNotaCreditoError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogFactura, setOpenDialogFactura] = useState(false);
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

    const [vendedores, setVendedores] = useState<any[]>([
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Vendedor 1" },
        { id: 3, nombre: "Vendedor 2" },
    ]);



    const fetchTiposDocumento = async () => {
        try {
            setTipoDocumentoError(null);
            setIsLoadingTiposDocumento(true);
            const data = await TipoDocumentoService.getTiposNotasCredito();
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
            setNotaCredito({
                ...notaCredito,
                idTipoDocumento: data.documentoNotaCredito[0].idTipoDocumento,
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

    const fetchConceptosNotaCredito = async () => {
        try {
            setDocumentoListaError(null);
            setIsLoadingDocumentoLista(true);
            const data = await ConceptoNotaCreditoService.getAll();
            setConceptosNotaCredito(data);
        } catch (error) {
            console.error('Error:', error);
            setConceptoNotaCreditoError('Error al cargar los conceptos de nota de crédito');
        } finally {
            setIsLoadingConceptosNotaCredito(false);
        }
    };

    const initializeComponent = async () => {
        await Promise.all([

            fetchTipoDocumentoIdentidad(),
            fetchParametrosVentaDefault(),
            fetchTiposDocumento(),
            fetchDocumentoLista(),
            fetchConceptosNotaCredito(),
            fetchTerceros()
        ]);
    };


    useEffect(() => {
        initializeComponent();
    }, []);


    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nombreProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigoProducto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.codigoBarras ? product.codigoBarras.includes(searchTerm) : false);
        const matchesCategory = parseInt(selectedCategory) === 0 || product.idCategoria === parseInt(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const handleNew = async () => {
        await initializeComponent();
        setActivePaymentMethod('');
    };

    const handleSelectVenta = async (documento: IDocumentoLista) => {
        const data = await VentaService.getById(documento.idVenta);
        setSelectedFactura(data);
        setNotaCredito({
            ...notaCredito,
            idVenta: data?.idVenta ?? null,
            idUsuario: data?.idUsuario ?? null,
            totalRegistros: data?.totalRegistros ?? 0,
            cantidadProductos: data?.cantidadProductos ?? 0,
            totalPrecio: data?.totalPrecio ?? 0,
            totalDescuento: data?.totalDescuento ?? 0,
            totalBaseIva: data?.totalBaseIva ?? 0,
            totalIva: data?.totalIva ?? 0,
            totalVenta: data?.totalVenta ?? 0,
            idTerceroNotaCredito: data?.terceroVenta?.idTercero ?? null,
            numeroIdentificacionTerceroNotaCredito: data?.terceroVenta?.numeroIdentificacion ?? null,
            nombreTerceroNotaCredito: data?.terceroVenta?.razonSocial ? data.terceroVenta.razonSocial : (data?.terceroVenta?.primerNombre && data?.terceroVenta?.primerApellido ? `${data.terceroVenta.primerNombre} ${data.terceroVenta.primerApellido}` : null),
            detalleNotaCredito: (data?.detalleVenta ?? []).map(item => ({
                idDetalleNotaCredito: 0,
                registroNotaCredito: 0,
                idProducto: item.idProducto,
                codigoProducto: item.codigoProducto,
                nombreProducto: item.nombreProducto,
                cantidadNotaCredito: item.cantidadVenta,
                cantidadFactura: item.cantidadVenta,
                precioUnitarioNotaCredito: item.precioUnitarioVenta ?? 0,
                precioUnitarioFactura: item.precioUnitarioVenta ?? 0,
                porcentajeIvaNotaCredito: item.porcentajeIvaVenta ?? 0,
                porcentajeIvaFactura: item.porcentajeIvaVenta ?? 0,
                ivaNotaCredito: item.ivaVenta ?? 0,
                ivaFactura: item.ivaVenta ?? 0,
                porcentajeDescuentoNotaCredito: item.porcentajeDescuentoVenta ?? 0,
                porcentajeDescuentoFactura: item.porcentajeDescuentoVenta ?? 0,
                descuentoNotaCredito: item.descuentoVenta ?? 0,
                descuentoFactura: item.descuentoVenta ?? 0,
                costoTotalNotaCredito: item.costoTotalVenta ?? 0,
                costoTotalFactura: item.costoTotalVenta ?? 0,
                totalNotaCredito: item.totalVenta ?? 0,
                totalFactura: item.totalVenta ?? 0,
                costoUnitarioNotaCredito: item.costoUnitarioVenta ?? 0,
                costoUnitarioFactura: item.costoUnitarioVenta ?? 0,
                idDetalleVenta: item.idDetalleVenta,
            })),
        });
        setSearchDocumento(documento.numeroDocumento);
        setOpenDialogFactura(false);
    };

    const handleSaveNotaCredito = async () => {
        const todayLocal = new Date();
        const offsetMs = todayLocal.getTimezoneOffset() * 60 * 1000;
        const localISODate = new Date(todayLocal.getTime() - offsetMs).toISOString().split('T')[0];
        const updatedNotaCredito = {
            ...notaCredito,
            fechaNotaCredito: localISODate,
        };
        try {
            if (updatedNotaCredito.idNotaCredito) {
                // Actualizar nota credito existente
                //await VentaService.update(notaCredito);
                console.log("Nota crédito actualizada:", notaCredito);
                setSuccessMessage("Nota crédito actualizada correctamente");
                setShowSuccessDialog(true);
            } else {
                console.log("Nota crédito a guardar:", updatedNotaCredito);
                const result = await NotaCreditoService.create(updatedNotaCredito);
                console.log("Nota crédito guardada:", result);
                setSuccessMessage(result.message +
                    "\nNúmero Documento Dian: " + result.idNotaCredito);
                setShowSuccessDialog(true);
                // const data = await VentaService.getById(result.idFactura);
                // setSelectedFactura(data);
                // setFactura({
                //     ...factura,
                //     idVenta: data?.idVenta ?? null,
                //     idTipoDocumento: data?.idTipoDocumento ?? 0,
                //     codigoDocumento: data?.codigoDocumento ?? '',
                //     nombreDocumento: data?.nombreDocumento ?? null,
                //     numeroVenta: data?.numeroVenta ?? null,
                //     prefijoVenta: data?.prefijoVenta ?? '',
                //     fechaVenta: data?.fechaVenta ?? '',
                //     idPuntoVenta: data?.idPuntoVenta ?? null,
                //     idUsuario: data?.idUsuario ?? null,
                //     totalRegistros: data?.totalRegistros ?? 0,
                //     cantidadProductos: data?.cantidadProductos ?? 0,
                //     totalPrecio: data?.totalPrecio ?? 0,
                //     totalDescuento: data?.totalDescuento ?? 0,
                //     totalBaseIva: data?.totalBaseIva ?? 0,
                //     totalIva: data?.totalIva ?? 0,
                //     totalVenta: data?.totalVenta ?? 0,
                //     terceroVenta: data?.terceroVenta ?? {
                //         idTercero: null,
                //         idTipoDocumentoId: 0,
                //         digitoVerificacion: null,
                //         numeroIdentificacion: null,
                //         primerNombre: null,
                //         primerApellido: null,
                //         razonSocial: null,
                //         telefonoTercero: null,
                //         direccionTercero: null,
                //         idMunicipio: 0,
                //         emailTercero: null,
                //         idTipoPersona: null
                //     },
                //     detalleVenta: data?.detalleVenta ?? [],
                //     mediosPagoVenta: data?.mediosPagoVenta ?? [],

                // });
                // const dataPrint = await VentaService.printById(result.idFactura);
                // setFacturaModalData(dataPrint);
                // setShowFacturaModal(true);
            }
            //await fetchProducts();
        } catch (error) {
            console.error('Error al guardar la factura:', error);
        }
    };

    const updateQuantity = (id: number, change: number) => {
        setNotaCredito({
            ...notaCredito,
            detalleNotaCredito: (notaCredito.detalleNotaCredito ?? []).map(item => {
                if (item.idProducto === id) {
                    const newQuantity = item.cantidadNotaCredito + change;
                    // Validar que la nueva cantidad no exceda la cantidad facturada ni sea menor a 0
                    if (newQuantity >= 0 && newQuantity <= item.cantidadFactura) {
                        return {
                            ...item,
                            cantidadNotaCredito: newQuantity,
                            porcentajeDescuentoNotaCredito: item.porcentajeDescuentoNotaCredito,
                            descuentoNotaCredito: parseFloat(((item.precioUnitarioNotaCredito * newQuantity) * ((item.porcentajeDescuentoNotaCredito || 0) / 100)).toFixed(2))
                        };
                    } else {
                        toast.error("La cantidad no puede ser mayor a la facturada ni menor a 0", {
                            position: "top-center"
                        });
                        return item; // Mantener el valor actual si excede los límites
                    }
                }
                return item;
            })
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
    const subtotal = notaCredito.detalleNotaCredito?.reduce((sum, item) => sum + (item.precioUnitarioNotaCredito * item.cantidadNotaCredito), 0);
    const discount = notaCredito.detalleNotaCredito?.reduce((descuento, item) => descuento + item.descuentoNotaCredito, 0);
    const tax = notaCredito.detalleNotaCredito?.reduce((iva, item) => iva + item.ivaNotaCredito, 0);
    // const loyaltyDiscount = customerInfo.loyalty ? subtotal * 0.05 : 0; // 5% descuento por lealtad
    const total = subtotal - discount + tax;
    const totalItems = notaCredito.detalleNotaCredito?.reduce((sum, item) => sum + item.cantidadNotaCredito, 0);
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

                    {/* Centro - Total de la Nota */}
                    <div className="flex items-center space-x-4 mb-2">
                        <Badge className="flex items-center gap-2 px-4 py-2 text-lg bg-orange-500 text-white">
                            <span className="font-medium">Nota Crédito</span>
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
                                facturaData={facturaModalData}
                                triggerText="Imprimir Factura"
                                triggerVariant="secondary"
                                idMetodoDian={factura?.idMetodoDian || 0}
                            />
                        )}
                        <Button
                            variant="default"
                            size="icon"
                            title="Nueva nota crédito"
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
                <div className="w-full flex flex-col h-[calc(100vh-80px)]">
                    {/* Header del Carrito */}
                    <div className="p-3 border-b h-[60px] shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-normal">Tipo de documento</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={notaCredito.idTipoDocumento ?? ''}
                                    onChange={(e) => setNotaCredito({ ...notaCredito, idTipoDocumento: parseInt(e.target.value) })}
                                    readOnly
                                />
                                {/* <select
                                    className="rounded border px-3 py-2 text-sm bg-background w-48"
                                    value={notaCredito.idTipoDocumento}
                                    onChange={(e) => {
                                        const selectedId = parseInt(e.target.value);
                                        console.log(selectedId);
                                        const selectedTipoDocumento = tiposDocumento.find(td => td.idTipoDocumento === selectedId);
                                        setNotaCredito({
                                            ...notaCredito,
                                            idTipoDocumento: selectedId,
                                            idMetodoDian: selectedTipoDocumento?.idMetodoDian || 0,
                                        });
                                    }}
                                    required
                                >
                                    {tiposDocumento.map(td => (
                                        <option key={td.idTipoDocumento} value={td.idTipoDocumento}>
                                            {td.nombreDocumento} ({td.codigoDocumento})
                                        </option>
                                    ))}
                                </select> */}
                                <h2 className="text-sm font-normal">Prefijo</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={notaCredito.prefijoNotaCredito ?? ''}
                                    onChange={(e) => setNotaCredito({ ...notaCredito, prefijoNotaCredito: e.target.value })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                    value={notaCredito.numeroNotaCredito ?? ''}
                                    onChange={(e) => setNotaCredito({ ...notaCredito, numeroNotaCredito: parseInt(e.target.value) })}
                                    readOnly
                                />
                                <h2 className="text-sm font-normal">Fecha</h2>
                                <input
                                    type="date"
                                    className="rounded border px-3 py-2 text-sm bg-background w-30"
                                    value={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setNotaCredito({ ...notaCredito, fechaNotaCredito: e.target.value })}
                                    readOnly
                                />
                            </div>
                            <Badge className="bg-primary text-primary-foreground">
                                {totalItems}
                            </Badge>
                        </div>
                    </div>

                    {/* Panel de Número de Factura */}

                    <div className="border-b bg-muted/50">
                        <div className="flex items-center gap-2 ml-3 mt-2 mb-2 mr-2">
                            <h2 className="text-sm font-normal">Número de Factura</h2>
                            <Input
                                placeholder="Ingrese el número de la factura"
                                className="rounded border px-2 py-2 text-sm bg-background w-64"
                                value={searchDocumento}
                                onChange={(e) => setSearchDocumento(e.target.value)}
                            />
                            <Dialog open={openDialogFactura} onOpenChange={setOpenDialogFactura}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="icon" title="Buscar documento">
                                        <Search className="w-8 h-8" />
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
                                        {isLoadingDocumentoLista && (
                                            <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                        )}
                                        {documentoListaError && (
                                            <div className="text-center text-red-500 py-4">{documentoListaError}</div>
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Label className="text-sm font-normal whitespace-nowrap">
                                Cliente:
                            </Label>
                            <Input
                                placeholder="Número de identificación"
                                className="rounded border px-2 py-2 text-sm bg-background w-32"
                                value={notaCredito.numeroIdentificacionTerceroNotaCredito || ''}
                                readOnly
                            />
                            <Label className="text-sm font-normal whitespace-nowrap">
                                Nombre:
                            </Label>
                            <Input
                                placeholder="Nombre del cliente"
                                className="rounded border px-2 py-2 text-sm bg-background w-48"
                                value={notaCredito.nombreTerceroNotaCredito || ''}
                                readOnly
                            />
                            <Label htmlFor="concepto-nota-credito" className="text-sm font-normal whitespace-nowrap">
                                Concepto Nota Crédito:
                            </Label>
                            <select
                                className="rounded border px-3 py-2 text-sm bg-background w-48"
                                value={notaCredito.conceptoNotaCredito ?? ''}
                                onChange={(e) => {
                                    const selectedId = parseInt(e.target.value);
                                    setNotaCredito({
                                        ...notaCredito,
                                        conceptoNotaCredito: selectedId,
                                        idConceptoCorreccionNota: selectedId,
                                    });
                                }}
                                required
                            >
                                {conceptosNotaCredito.map(td => (
                                    <option key={td.idConceptoCorreccionNota} value={td.idConceptoCorreccionNota}>
                                        {td.nombreConceptoCorreccionNota}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {(notaCredito.detalleNotaCredito?.length ?? 0) === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🧾</div>
                                <p className="text-muted-foreground font-medium">Seleccione la factura</p>
                                <p className="text-sm text-muted-foreground mt-1">a la que le desea aplicar la nota crédito</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {(notaCredito.detalleNotaCredito ?? []).map(item => (
                                    <Card key={item.idProducto} className="p-1">
                                        <div className="flex items-center gap-32">
                                            {/* Información del producto */}
                                            <div className="flex-shrink-0">
                                                <h4 className="font-medium text-sm truncate">{item.nombreProducto}</h4>
                                                <div className="flex items-center space-x-2 mt-1">
                                                    <Badge variant="outline" className="text-xs">{item.codigoProducto}</Badge>
                                                    <span className="text-sm text-muted-foreground">${formatCurrency(item.precioUnitarioFactura)}</span>
                                                </div>
                                            </div>

                                            {/* Contenedor para campos alineados */}
                                            <div className="flex items-end gap-2 flex-1">
                                                {/* Campos de descuento e IVA */}
                                                <div className="flex gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeDescuentoFactura || ''}
                                                            min={0}
                                                            max={100}
                                                            placeholder="0"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Descuento</span>
                                                        <input
                                                            type="number"
                                                            className="w-24 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.descuentoNotaCredito || ''}
                                                            placeholder="0"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% IVA</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeIvaNotaCredito || ''}
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
                                                            value={item.ivaNotaCredito || ''}
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
                                                            <Input
                                                                type="number"
                                                                value={item.cantidadFactura}
                                                                onFocus={(e) => e.target.select()}
                                                                className="w-16 h-8 text-center rounded-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                                                disabled
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-bold mb-1 whitespace-nowrap text-center">Valor Total</span>
                                                        <span className="font-bold text-primary min-w-[80px] text-right h-8 flex items-center justify-end">
                                                            ${formatCurrency((item.precioUnitarioFactura * item.cantidadFactura) - item.descuentoFactura + item.ivaFactura)}
                                                        </span>
                                                    </div>
                                                    {/* Segundo separador visual */}
                                                    <div className="w-px h-8 bg-border mx-8"></div>
                                                    {/* Campos: Descuento a aplicar y Cantidad a modificar */}
                                                    <div className="flex items-end gap-2 bg-blue-100 p-2 rounded-md border border-slate-200/50">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento N.C.</span>
                                                            <input
                                                                type="number"
                                                                value={item.porcentajeDescuentoNotaCredito || ''}
                                                                className="w-32 h-8 border rounded px-2 text-sm text-center"
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newDiscountPercent = value === '' ? 0 : parseFloat(value);
                                                                    if (newDiscountPercent >= 0 && newDiscountPercent <= 100) {
                                                                        setNotaCredito({
                                                                            ...notaCredito,
                                                                            detalleNotaCredito: (notaCredito.detalleNotaCredito ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        porcentajeDescuentoNotaCredito: newDiscountPercent,
                                                                                        descuentoNotaCredito: parseFloat(((item.precioUnitarioNotaCredito * detalleItem.cantidadNotaCredito) * (newDiscountPercent / 100)).toFixed(2)),
                                                                                    }
                                                                                    : detalleItem
                                                                            )
                                                                        });
                                                                    }
                                                                }}
                                                                min={0}
                                                                max={100}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Descuento N.C.</span>
                                                            <input
                                                                type="number"
                                                                className="w-32 h-8 border rounded px-2 text-sm text-center"
                                                                value={item.descuentoNotaCredito || ''}
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newDiscountValue = value === '' ? 0 : parseFloat(value);
                                                                    if (newDiscountValue >= 0) {
                                                                        setNotaCredito({
                                                                            ...notaCredito,
                                                                            detalleNotaCredito: (notaCredito.detalleNotaCredito ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        descuentoNotaCredito: newDiscountValue,
                                                                                    }
                                                                                    : detalleItem
                                                                            )
                                                                        });
                                                                    }
                                                                }}
                                                                min={0}
                                                                max={100}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Cantidad N.C.</span>
                                                            <div className="flex items-center">
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => updateQuantity(item.idProducto, -1)}
                                                                    className="h-8 w-8 rounded-r-none"
                                                                >
                                                                    <Minus className="h-4 w-4" />
                                                                </Button>
                                                                <input
                                                                    type="number"
                                                                    value={item.cantidadNotaCredito}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const newQuantity = value === '' ? 0 : parseFloat(value);
                                                                        if (newQuantity >= 0 && newQuantity <= item.cantidadFactura) {
                                                                            setNotaCredito({
                                                                                ...notaCredito,
                                                                                detalleNotaCredito: (notaCredito.detalleNotaCredito ?? []).map(detalleItem =>
                                                                                    detalleItem.idProducto === item.idProducto
                                                                                        ? {
                                                                                            ...detalleItem,
                                                                                            cantidadNotaCredito: newQuantity,
                                                                                        }
                                                                                        : detalleItem
                                                                                )
                                                                            });
                                                                        }
                                                                        else {
                                                                            setNotaCredito({
                                                                                ...notaCredito,
                                                                                detalleNotaCredito: (notaCredito.detalleNotaCredito ?? []).map(detalleItem =>
                                                                                    detalleItem.idProducto === item.idProducto
                                                                                        ? {
                                                                                            ...detalleItem,
                                                                                            cantidadNotaCredito: item.cantidadFactura,
                                                                                        }
                                                                                        : detalleItem
                                                                                )
                                                                            });
                                                                            toast.error("La cantidad no puede ser mayor a la facturada ni menor a 0", {
                                                                                position: "top-center"
                                                                            });
                                                                        }
                                                                    }}
                                                                    className="w-16 h-8 border rounded px-2 text-sm text-center"
                                                                    placeholder="0"
                                                                    min={0}
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
                    {(notaCredito.detalleNotaCredito ?? []).length > 0 && (
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

                            <div className="h-[60px] p-4 border-t bg-background">
                                <Button
                                    onClick={() => handleSaveNotaCredito()}
                                    className="w-full h-[40px] text-lg font-bold"
                                    size="lg"
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    Guardar Nota Crédito
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
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

export default MainCreditNote;