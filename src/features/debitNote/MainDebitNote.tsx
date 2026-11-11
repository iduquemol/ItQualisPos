import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Star, Scan, Package, AlertTriangle, Tag, Gift, Users, Trash, DoorOpen, Save } from 'lucide-react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
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
import { INotaDebito } from '@/types/INotaDebito';
import { INotaDebitoDetalle } from '@/types/INotaDebitoDetalle';
import { IDocumentoLista } from '@/types/IDocumentoLista';
import { DocumentoListaService } from '@/services/DocumentoListaService';
import { VentaService } from '@/services/VentaService';
import { toast } from "sonner";
import { ITerceroDefault } from '@/types/ITerceroDefault';
import { IVentaMedioPago } from '@/types/IVentaMedioPago';
import FacturaModal from '../reports/FacturaModal';
import { IParametrosVentaDefault } from '@/types/IParametrosVentaDefault';
import { ConceptoNotaDebitoService } from '@/services/ConceptoNotaDebitoService';
import { IConceptoNotaDebito } from '@/types/IConceptoNotaDebito';
import { NotaDebitoService } from '@/services/NotaDebitoService';

type DebitNoteDetail = Omit<INotaDebitoDetalle,
    | 'idProducto'
    | 'cantidadNotaDebito'
    | 'precioUnitarioNotaDebito'
    | 'porcentajeDescuentoNotaDebito'
    | 'descuentoNotaDebito'
    | 'porcentajeIvaNotaDebito'
    | 'ivaNotaDebito'
> & {
    idProducto: number;
    cantidadNotaDebito: number;
    precioUnitarioNotaDebito: number;
    porcentajeDescuentoNotaDebito: number;
    descuentoNotaDebito: number;
    porcentajeIvaNotaDebito: number;
    ivaNotaDebito: number;
    cantidadFactura: number;
    precioUnitarioFactura: number;
    porcentajeIvaFactura: number;
    ivaFactura: number;
    porcentajeDescuentoFactura: number;
    descuentoFactura: number;
    costoTotalFactura: number;
    totalFactura: number;
    costoUnitarioFactura: number;
};

type DebitNoteForm = Omit<INotaDebito, 'detalleNotaDebito'> & {
    detalleNotaDebito: DebitNoteDetail[] | null;
};

const MainDebitNote = () => {
    const navigate = useNavigate();
    const createInitialNotaDebito = (): DebitNoteForm => ({
        idNotaDebito: 0,
        idTipoDocumento: 9,
        codigoDocumento: '',
        nombreDocumento: null,
        numeroNotaDebito: 0,
        prefijoNotaDebito: '',
        fechaNotaDebito: '',
        observaciones: '',
        conceptoNotaDebito: null,
        idUsuario: 1,
        totalRegistros: null,
        cantidadProductos: null,
        totalPrecio: null,
        totalDescuento: null,
        totalBaseIva: null,
        totalIva: null,
        totalVenta: null,
        idTerceroNotaDebito: 0,
        numeroIdentificacionTerceroNotaDebito: null,
        nombreTerceroNotaDebito: null,
        idVenta: null,
        idConceptoCorreccionNota: null,
        detalleNotaDebito: [],
    });
    const [notaDebito, setNotaDebito] = useState<DebitNoteForm>(createInitialNotaDebito);

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
    const [categories, setCategories] = useState<ICategorias[]>([]);
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
    const [conceptosNotaDebito, setConceptosNotaDebito] = useState<IConceptoNotaDebito[]>([]);
    const [isLoadingConceptosNotaDebito, setIsLoadingConceptosNotaDebito] = useState(true);
    const [conceptoNotaDebitoError, setConceptoNotaDebitoError] = useState<string | null>(null);
    const [notasDebito, setNotasDebito] = useState<INotaDebito[]>([]);
    const [isLoadingNotasDebito, setIsLoadingNotasDebito] = useState(false);
    const [notasDebitoError, setNotasDebitoError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialogFactura, setOpenDialogFactura] = useState(false);
    const [searchDocumento, setSearchDocumento] = useState("");
    const [searchNotaDebito, setSearchNotaDebito] = useState("");
    const [barcodeBuffer, setBarcodeBuffer] = useState<string>('');
    const [lastKeyTime, setLastKeyTime] = useState<number>(0);
    const [showFacturaModal, setShowFacturaModal] = useState(false);
    const [facturaModalData, setFacturaModalData] = useState<any>(null);
    const [savedNotaDebitoId, setSavedNotaDebitoId] = useState<number | null>(null);
    const [searchTercero, setSearchTercero] = useState("");
    const [vendedorSeleccionado, setVendedorSeleccionado] = useState(1);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showConfirmSaveDialog, setShowConfirmSaveDialog] = useState(false);
    const [isSavingNotaDebito, setIsSavingNotaDebito] = useState(false);

    const BARCODE_DELAY = 50;

    const [vendedores, setVendedores] = useState<any[]>([
        { id: 1, nombre: "Administrador" },
        { id: 2, nombre: "Vendedor 1" },
        { id: 3, nombre: "Vendedor 2" },
    ]);

    useEffect(() => {
        const selectedTipoDocumento = tiposDocumento.find(
            (tipoDocumento) =>
                Number(tipoDocumento.idTipoDocumentoExterno) === Number(notaDebito.idTipoDocumentoExterno) &&
                Number(tipoDocumento.idTipoDocumento) === Number(notaDebito.idTipoDocumento)
        ) ?? tiposDocumento.find(
            (tipoDocumento) => Number(tipoDocumento.idTipoDocumento) === Number(notaDebito.idTipoDocumento)
        );
        if (!selectedTipoDocumento) return;

        const idTipoDocumentoExterno = Number(selectedTipoDocumento.idTipoDocumentoExterno);
        const prefijoConsecutivo = selectedTipoDocumento.prefijoConsecutivo ?? '';
        const idMetodoDian = selectedTipoDocumento.idMetodoDian ?? null;
        if (
            notaDebito.idTipoDocumentoExterno !== idTipoDocumentoExterno ||
            notaDebito.prefijoNotaDebito !== prefijoConsecutivo ||
            notaDebito.idMetodoDian !== idMetodoDian
        ) {
            setNotaDebito((previous) => ({
                ...previous,
                idTipoDocumentoExterno,
                prefijoNotaDebito: prefijoConsecutivo,
                idMetodoDian,
            }));
        }
    }, [tiposDocumento, notaDebito.idTipoDocumento, notaDebito.idTipoDocumentoExterno, notaDebito.prefijoNotaDebito, notaDebito.idMetodoDian]);



    const fetchTiposDocumento = async () => {
        try {
            setTipoDocumentoError(null);
            setIsLoadingTiposDocumento(true);
            const data = await TipoDocumentoService.getTiposNotasDebito();
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
            const documentoNotaDebito = data.documentoNotaDebito?.[0];
            if (documentoNotaDebito) {
                setNotaDebito(previous => ({
                    ...previous,
                    idTipoDocumento: documentoNotaDebito.idTipoDocumento,
                }));
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
                documentoNotaDebito: [
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
                documentoNotaCredito: [],
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

    const fetchConceptosNotaDebito = async () => {
        try {
            setConceptoNotaDebitoError(null);
            setIsLoadingConceptosNotaDebito(true);
            const data = await ConceptoNotaDebitoService.getAll();
            setConceptosNotaDebito(data);
        } catch (error) {
            console.error('Error:', error);
            setConceptoNotaDebitoError('Error al cargar los conceptos de nota débito');
        } finally {
            setIsLoadingConceptosNotaDebito(false);
        }
    };

    const initializeComponent = async () => {
        await Promise.all([

            fetchTipoDocumentoIdentidad(),
            fetchParametrosVentaDefault(),
            fetchTiposDocumento(),
            fetchDocumentoLista(),
            fetchConceptosNotaDebito(),
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

    const applyVentaToNotaDebito = (data: IVenta) => {
        setSavedNotaDebitoId(null);
        setSelectedFactura(data);
        setNotaDebito(previous => ({
            ...previous,
            conceptoNotaDebito: previous.conceptoNotaDebito,
            idConceptoCorreccionNota: previous.idConceptoCorreccionNota,
            idVenta: data?.idVenta ?? null,
            idUsuario: data?.idUsuario ?? null,
            totalRegistros: data?.totalRegistros ?? 0,
            cantidadProductos: data?.cantidadProductos ?? 0,
            totalPrecio: data?.totalPrecio ?? 0,
            totalDescuento: data?.totalDescuento ?? 0,
            totalBaseIva: data?.totalBaseIva ?? 0,
            totalIva: data?.totalIva ?? 0,
            totalVenta: data?.totalVenta ?? 0,
            idTerceroNotaDebito: data?.terceroVenta?.idTercero ?? 0,
            numeroIdentificacionTerceroNotaDebito: data?.terceroVenta?.numeroIdentificacion ?? null,
            nombreTerceroNotaDebito: data?.terceroVenta?.razonSocial ||
                (data?.terceroVenta?.primerNombre && data?.terceroVenta?.primerApellido
                    ? `${data.terceroVenta.primerNombre} ${data.terceroVenta.primerApellido}`
                    : null),
            detalleNotaDebito: (data?.detalleVenta ?? []).map(item => ({
                idDetalleNotaDebito: 0,
                idNotaDebito: 0,
                registroNotaDebito: 0,
                idProducto: item.idProducto ?? 0,
                codigoProducto: item.codigoProducto ?? '',
                nombreProducto: item.nombreProducto ?? '',
                cantidadNotaDebito: item.cantidadVenta ?? 0,
                cantidadFactura: item.cantidadVenta ?? 0,
                precioUnitarioNotaDebito: item.precioUnitarioVenta ?? 0,
                precioUnitarioFactura: item.precioUnitarioVenta ?? 0,
                porcentajeIvaNotaDebito: item.porcentajeIvaVenta ?? 0,
                porcentajeIvaFactura: item.porcentajeIvaVenta ?? 0,
                ivaNotaDebito: item.ivaVenta ?? 0,
                ivaFactura: item.ivaVenta ?? 0,
                porcentajeDescuentoNotaDebito: item.porcentajeDescuentoVenta ?? 0,
                porcentajeDescuentoFactura: item.porcentajeDescuentoVenta ?? 0,
                descuentoNotaDebito: item.descuentoVenta ?? 0,
                descuentoFactura: item.descuentoVenta ?? 0,
                costoTotalNotaDebito: item.costoTotalVenta ?? 0,
                costoTotalFactura: item.costoTotalVenta ?? 0,
                totalNotaDebito: item.totalVenta ?? 0,
                totalFactura: item.totalVenta ?? 0,
                costoUnitarioNotaDebito: item.costoUnitarioVenta ?? 0,
                costoUnitarioFactura: item.costoUnitarioVenta ?? 0,
                idDetalleVenta: item.idDetalleVenta,
            })),
        }));
    };

    const handleNew = async () => {
        setSavedNotaDebitoId(null);
        setSelectedFactura(null);
        setNotaDebito(createInitialNotaDebito());
        setSearchDocumento('');
        setActivePaymentMethod('');
        await initializeComponent();
    };

    const handleSelectVenta = async (documento: IDocumentoLista) => {
        try {
            const data = await VentaService.getById(documento.idVenta);
            if (!data) {
                throw new Error('La factura no fue encontrada');
            }
            applyVentaToNotaDebito(data);
            setSearchDocumento(documento.numeroDocumento);
            setOpenDialogFactura(false);
        } catch (error) {
            console.error('Error al cargar la factura:', error);
            toast.error('No fue posible cargar la factura', { position: 'top-center' });
        }
    };

    const handleSelectNotaDebito = async (notaSeleccionada: INotaDebito) => {
        try {
            const notas = await NotaDebitoService.getAll();
            const nota = notas.find(
                (item) => Number(item.idNotaDebito) === Number(notaSeleccionada.idNotaDebito)
            );
            if (!nota) {
                throw new Error('La nota débito seleccionada no fue encontrada');
            }

            setNotasDebito(notas);
            setSelectedFactura(null);
            setSavedNotaDebitoId(nota.idNotaDebito ?? null);
            setNotaDebito({
                ...nota,
                idNotaDebito: nota.idNotaDebito ?? 0,
                observaciones: nota.observaciones ?? '',
                detalleNotaDebito: (nota.detalleNotaDebito ?? []).map((detalle) => ({
                    ...detalle,
                    idProducto: detalle.idProducto ?? 0,
                    cantidadNotaDebito: detalle.cantidadNotaDebito ?? 0,
                    precioUnitarioNotaDebito: detalle.precioUnitarioNotaDebito ?? 0,
                    porcentajeDescuentoNotaDebito: detalle.porcentajeDescuentoNotaDebito ?? 0,
                    descuentoNotaDebito: detalle.descuentoNotaDebito ?? 0,
                    porcentajeIvaNotaDebito: detalle.porcentajeIvaNotaDebito ?? 0,
                    ivaNotaDebito: detalle.ivaNotaDebito ?? 0,
                    cantidadFactura: detalle.cantidadNotaDebito ?? 0,
                    precioUnitarioFactura: detalle.precioUnitarioNotaDebito ?? 0,
                    porcentajeIvaFactura: detalle.porcentajeIvaNotaDebito ?? 0,
                    ivaFactura: detalle.ivaNotaDebito ?? 0,
                    porcentajeDescuentoFactura: detalle.porcentajeDescuentoNotaDebito ?? 0,
                    descuentoFactura: detalle.descuentoNotaDebito ?? 0,
                    costoTotalFactura: detalle.costoTotalNotaDebito ?? 0,
                    totalFactura: detalle.totalNotaDebito ?? 0,
                    costoUnitarioFactura: detalle.costoUnitarioNotaDebito ?? 0,
                })),
            });
            setOpenDialog(false);
        } catch (error) {
            console.error('Error al cargar la nota débito:', error);
            toast.error('No fue posible cargar la nota débito seleccionada', { position: 'top-center' });
        }
    };

    const handleSearchFactura = async () => {
        const numeroFactura = searchDocumento.trim().toLowerCase();
        if (!numeroFactura) return;

        const documento = documentosLista.find(item =>
            item.numeroDocumento?.trim().toLowerCase() === numeroFactura
        );
        if (!documento) {
            toast.error('No se encontró una factura con ese número', { position: 'top-center' });
            return;
        }

        await handleSelectVenta(documento);
    };

    const handleOpenDialogChange = async (open: boolean) => {
        setOpenDialog(open);
        if (!open) return;

        try {
            setIsLoadingNotasDebito(true);
            setNotasDebitoError(null);
            const data = await NotaDebitoService.getAll();
            setNotasDebito(data);
        } catch (error) {
            console.error('Error al cargar notas débito:', error);
            setNotasDebitoError('Error al cargar las notas débito');
        } finally {
            setIsLoadingNotasDebito(false);
        }
    };

    const handleSaveNotaDebito = async () => {
        const todayLocal = new Date();
        const offsetMs = todayLocal.getTimezoneOffset() * 60 * 1000;
        const localISODate = new Date(todayLocal.getTime() - offsetMs).toISOString().split('T')[0];
        const updatedNotaDebito = {
            ...notaDebito,
            idNotaDebito: Number.isInteger(notaDebito.idNotaDebito)
                ? notaDebito.idNotaDebito
                : 0,
            numeroNotaDebito: Number.isInteger(notaDebito.numeroNotaDebito)
                ? notaDebito.numeroNotaDebito
                : 0,
            fechaNotaDebito: localISODate,
        };
        try {
            setIsSavingNotaDebito(true);
            if (updatedNotaDebito.idNotaDebito) {
                // Actualizar nota débito existente
                //await VentaService.update(notaDebito);
                console.log("Nota débito actualizada:", notaDebito);
                setSavedNotaDebitoId(updatedNotaDebito.idNotaDebito);
                setSuccessMessage("Nota débito actualizada correctamente");
                setShowSuccessDialog(true);
            } else {
                console.log("Nota débito a guardar:", updatedNotaDebito);
                const result = await NotaDebitoService.create(updatedNotaDebito);
                console.log("Nota débito guardada:", result);
                setSavedNotaDebitoId(result.idNotaDebito || null);
                setNotaDebito((previous) => ({
                    ...previous,
                    idNotaDebito: result.idNotaDebito,
                }));
                setSuccessMessage(result.message +
                    "\nNúmero Documento Dian: " + result.idNotaDebito);
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
            toast.error('No fue posible guardar la nota de débito', { position: 'top-center' });
        } finally {
            setIsSavingNotaDebito(false);
        }
    };

    const updateQuantity = (id: number, change: number) => {
        setNotaDebito({
            ...notaDebito,
            detalleNotaDebito: (notaDebito.detalleNotaDebito ?? []).map(item => {
                if (item.idProducto === id) {
                    const newQuantity = item.cantidadNotaDebito + change;
                    // Validar que la nueva cantidad no exceda la cantidad facturada ni sea menor a 0
                    if (newQuantity >= 0 && newQuantity <= item.cantidadFactura) {
                        return {
                            ...item,
                            cantidadNotaDebito: newQuantity,
                            porcentajeDescuentoNotaDebito: item.porcentajeDescuentoNotaDebito,
                            descuentoNotaDebito: parseFloat(((item.precioUnitarioNotaDebito * newQuantity) * ((item.porcentajeDescuentoNotaDebito || 0) / 100)).toFixed(2))
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
    const subtotal = notaDebito.detalleNotaDebito?.reduce((sum, item) => sum + (item.precioUnitarioNotaDebito * item.cantidadNotaDebito), 0) ?? 0;
    const discount = notaDebito.detalleNotaDebito?.reduce((descuento, item) => descuento + item.descuentoNotaDebito, 0) ?? 0;
    const tax = notaDebito.detalleNotaDebito?.reduce((iva, item) => iva + item.ivaNotaDebito, 0) ?? 0;
    // const loyaltyDiscount = customerInfo.loyalty ? subtotal * 0.05 : 0; // 5% descuento por lealtad
    const total = subtotal - discount + tax;
    const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Panel Superior */}
            <div className="w-full border-b bg-card px-4 py-2.5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                        <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-foreground ml-0 sm:ml-2">
                            Nota Débito
                        </h1>
                    </div>


                    <div className="flex items-center gap-3">

                        <Badge className="flex items-center gap-2 px-3.5 py-1 text-sm bg-primary text-primary-foreground shadow-sm">
                            <span className="font-normal opacity-90 text-xs uppercase tracking-wider">Total:</span>
                            <span className="font-bold text-base">${formatCurrency(total)}</span>
                        </Badge>

                        {selectedFactura && (
                            <Badge variant="secondary" className="px-2.5 py-0.5 text-xs font-medium">
                                {selectedFactura.estadoDian?.trim() || 'Pendiente DIAN'}
                            </Badge>
                        )}

                        {/* Selector de Vendedor */}
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
                                    {vendedores.map((vendedor) => (
                                        <SelectItem key={vendedor.id} value={vendedor.id.toString()} className="text-xs">
                                            {vendedor.nombre}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Botón Nueva Nota Débito */}
                        <Button
                            variant="default"
                            size="icon"
                            title="Nueva nota débito"
                            onClick={() => handleNew()}
                            className="h-9 w-9 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
                        >
                            <Plus className="w-4 h-4" />
                        </Button>

                        {/* Diálogo / Botón Buscar Nota Débito */}
                        <Dialog open={openDialog} onOpenChange={handleOpenDialogChange}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="icon" title="Buscar nota débito" className="h-9 w-9">
                                    <Search className="w-4 h-4" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                                <DialogHeader>
                                    <DialogTitle>Buscar Nota Débito</DialogTitle>
                                </DialogHeader>
                                <Input
                                    className="mb-4"
                                    placeholder="Buscar por número de nota, nombre cliente o número de identificación"
                                    value={searchNotaDebito}
                                    onChange={(e) => setSearchNotaDebito(e.target.value)}
                                />
                                <div className="overflow-x-auto max-h-[400px]">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Documento</TableHead>
                                                <TableHead>Número Nota Débito</TableHead>
                                                <TableHead>Fecha</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {notasDebito
                                                .filter(
                                                    (nota) =>
                                                        `${nota.prefijoNotaDebito ?? ''}${nota.numeroNotaDebito ?? ''}`
                                                            .toLowerCase()
                                                            .includes(searchNotaDebito.toLowerCase()) ||
                                                        nota.nombreTerceroNotaDebito
                                                            ?.toLowerCase()
                                                            .includes(searchNotaDebito.toLowerCase()) ||
                                                        nota.numeroIdentificacionTerceroNotaDebito
                                                            ?.toString()
                                                            .includes(searchNotaDebito.toLowerCase()) ||
                                                        nota.nombreDocumento
                                                            ?.toLowerCase()
                                                            .includes(searchNotaDebito.toLowerCase())
                                                )
                                                .map((nota) => (
                                                    <TableRow
                                                        key={nota.idNotaDebito}
                                                        className="cursor-pointer hover:bg-primary/10"
                                                        onClick={() => void handleSelectNotaDebito(nota)}
                                                    >
                                                        <TableCell>{nota.nombreDocumento ?? nota.codigoDocumento}</TableCell>
                                                        <TableCell>
                                                            {nota.prefijoNotaDebito}
                                                            {nota.numeroNotaDebito}
                                                        </TableCell>
                                                        <TableCell>{nota.fechaNotaDebito}</TableCell>
                                                        <TableCell>{nota.totalNotaDebito ?? nota.totalVenta ?? 0}</TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {isLoadingNotasDebito && (
                                        <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                    )}
                                    {notasDebitoError && (
                                        <div className="text-center text-red-500 py-4">{notasDebitoError}</div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        {/* Botón Salir */}
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
                <div className="w-full flex flex-col flex-1 overflow-y-auto">
                    {/* Header del Carrito */}
                    <div className="p-3 border-b bg-background">
                        {/* Estructura de rejilla responsiva (4 columnas en pantallas medianas/grandes) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

                            {/* Tipo de Documento (Ocupa 5 columnas en escritorio) */}
                            <div className="lg:col-span-5 flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap min-w-[130px]">
                                    Tipo de documento
                                </label>
                                <select
                                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                    value={notaDebito.idTipoDocumentoExterno?.toString() ?? ''}
                                    onChange={(e) => {
                                        const selectedValue = e.target.value;
                                        if (!selectedValue) return;

                                        const selectedTipoDocumento = tiposDocumento.find(
                                            (td) => String(td.idTipoDocumentoExterno) === String(selectedValue)
                                        );

                                        if (!selectedTipoDocumento) return;

                                        setNotaDebito((previous) => ({
                                            ...previous,
                                            idTipoDocumento: selectedTipoDocumento.idTipoDocumento,
                                            idTipoDocumentoExterno: selectedTipoDocumento.idTipoDocumentoExterno,
                                            prefijoNotaDebito: selectedTipoDocumento.prefijoConsecutivo ?? '',
                                            idMetodoDian: selectedTipoDocumento.idMetodoDian ?? null
                                        }));
                                    }}
                                    disabled={isLoadingTiposDocumento}
                                    required
                                >
                                    <option value="">-- Seleccione --</option>
                                    {tiposDocumento.map((td) => (
                                        <option key={td.idTipoDocumentoExterno} value={td.idTipoDocumentoExterno}>
                                            {`${td.nombreTipoDocumentoExterno || ""} - ${td.codigoTipoDocumentoExterno || ""}`}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Prefijo (Ocupa 2 columnas en escritorio) */}
                            <div className="lg:col-span-2 flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">
                                    Prefijo
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm text-center shadow-sm font-medium"
                                    value={notaDebito.prefijoNotaDebito ?? ''}
                                    readOnly
                                />
                            </div>

                            {/* Número (Ocupa 2 columnas en escritorio) */}
                            <div className="lg:col-span-2 flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">
                                    Número
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm text-center shadow-sm font-medium"
                                    value={notaDebito.numeroNotaDebito ?? ''}
                                    readOnly
                                />
                            </div>

                            {/* Fecha (Ocupa 3 columnas en escritorio) */}
                            <div className="lg:col-span-3 flex items-center gap-2">
                                <label className="text-sm font-medium whitespace-nowrap">
                                    Fecha
                                </label>
                                <input
                                    type="date"
                                    className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm shadow-sm"
                                    value={
                                        notaDebito.fechaNotaDebito
                                            ? new Date(notaDebito.fechaNotaDebito).toISOString().split('T')[0]
                                            : new Date().toISOString().split('T')[0]
                                    }
                                    readOnly
                                />
                            </div>

                        </div>
                    </div>

                    {/* Panel de Número de Factura */}

                    <div className="p-3 border-b bg-muted/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

                            {/* Campo Búsqueda de Factura + Botón Lupa (Ocupa 5 columnas en escritorio) */}
                            <div className="lg:col-span-5 flex items-center gap-2">
                                <Label className="text-sm font-medium whitespace-nowrap min-w-[130px]">
                                    Número de Factura
                                </Label>
                                <div className="flex items-center gap-1.5 w-full">
                                    <Input
                                        placeholder="Ingrese el número de la factura"
                                        className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm"
                                        value={searchDocumento}
                                        onChange={(e) => setSearchDocumento(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                void handleSearchFactura();
                                            }
                                        }}
                                        onBlur={() => void handleSearchFactura()}
                                    />

                                    {/* Modal Diálogo para Búsqueda Avanzada */}
                                    <Dialog open={openDialogFactura} onOpenChange={setOpenDialogFactura}>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="icon" title="Buscar documento" className="shrink-0 h-9 w-9">
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
                                                onChange={(e) => setSearchDocumento(e.target.value)}
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
                                                                (doc) =>
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
                                </div>
                            </div>

                            {/* Identificación del Cliente (Ocupa 3 columnas en escritorio) */}
                            <div className="lg:col-span-3 flex items-center gap-2">
                                <Label className="text-sm font-medium whitespace-nowrap">
                                    Cliente:
                                </Label>
                                <Input
                                    placeholder="Número de identificación"
                                    className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm shadow-sm font-medium"
                                    value={notaDebito.numeroIdentificacionTerceroNotaDebito || ''}
                                    readOnly
                                />
                            </div>

                            {/* Nombre del Cliente (Ocupa 4 columnas en escritorio) */}
                            <div className="lg:col-span-4 flex items-center gap-2">
                                <Label className="text-sm font-medium whitespace-nowrap">
                                    Nombre:
                                </Label>
                                <Input
                                    placeholder="Nombre del cliente"
                                    className="w-full rounded-md border border-input bg-muted px-3 py-1.5 text-sm shadow-sm font-medium truncate"
                                    value={notaDebito.nombreTerceroNotaDebito || ''}
                                    readOnly
                                />
                            </div>

                        </div>
                    </div>

                    <div className="p-3 border-b bg-muted/50">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">

                            {/* Observaciones (Ocupa 7 columnas en escritorio) */}
                            <div className="lg:col-span-7 flex items-center gap-2">
                                <Label className="text-sm font-medium whitespace-nowrap min-w-[130px]">
                                    Observaciones:
                                </Label>
                                <Input
                                    placeholder="Observaciones de la nota débito"
                                    className="w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm"
                                    value={notaDebito.observaciones ?? ''}
                                    onChange={(e) =>
                                        setNotaDebito({
                                            ...notaDebito,
                                            observaciones: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Concepto Nota Débito (Ocupa 5 columnas en escritorio) */}
                            <div className="lg:col-span-5 flex items-center gap-2">
                                <Label htmlFor="concepto-nota-debito" className="text-sm font-medium whitespace-nowrap">
                                    Concepto Nota Débito:
                                </Label>
                                <select
                                    id="concepto-nota-debito"
                                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    value={notaDebito.conceptoNotaDebito ?? ''}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10);
                                        const selectedId = Number.isNaN(val) ? null : val;

                                        setNotaDebito((prev) => ({
                                            ...prev,
                                            conceptoNotaDebito: selectedId,
                                            idConceptoCorreccionNota: selectedId,
                                        }));
                                    }}
                                    required
                                >
                                    <option value="">-- Seleccione --</option>
                                    {conceptosNotaDebito.map((td) => (
                                        <option key={td.idConceptoCorreccionNota} value={td.idConceptoCorreccionNota}>
                                            {td.nombreConceptoCorreccionNota}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>
                    </div>

                    {/* Items del Carrito */}
                    <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
                        {(notaDebito.detalleNotaDebito?.length ?? 0) === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🧾</div>
                                <p className="text-muted-foreground font-medium">Seleccione la factura</p>
                                <p className="text-sm text-muted-foreground mt-1">a la que le desea aplicar la nota débito</p>
                            </div>
                        ) : (
                            <div className="space-y-1.5">
                                {(notaDebito.detalleNotaDebito ?? []).map(item => (
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
                                                            value={item.descuentoNotaDebito || ''}
                                                            placeholder="0"
                                                            disabled
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% IVA</span>
                                                        <input
                                                            type="number"
                                                            className="w-20 h-8 border rounded px-2 text-sm text-center"
                                                            value={item.porcentajeIvaNotaDebito || ''}
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
                                                            value={item.ivaNotaDebito || ''}
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
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">% Descuento N.D.</span>
                                                            <input
                                                                type="number"
                                                                value={item.porcentajeDescuentoNotaDebito || ''}
                                                                className="w-32 h-8 border rounded px-2 text-sm text-center"
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newDiscountPercent = value === '' ? 0 : parseFloat(value);
                                                                    if (newDiscountPercent >= 0 && newDiscountPercent <= 100) {
                                                                        setNotaDebito({
                                                                            ...notaDebito,
                                                                            detalleNotaDebito: (notaDebito.detalleNotaDebito ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        porcentajeDescuentoNotaDebito: newDiscountPercent,
                                                                                        descuentoNotaDebito: parseFloat(((item.precioUnitarioNotaDebito * detalleItem.cantidadNotaDebito) * (newDiscountPercent / 100)).toFixed(2)),
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
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Valor Descuento N.D.</span>
                                                            <input
                                                                type="number"
                                                                className="w-32 h-8 border rounded px-2 text-sm text-center"
                                                                value={item.descuentoNotaDebito || ''}
                                                                placeholder="0"
                                                                onChange={(e) => {
                                                                    const value = e.target.value;
                                                                    const newDiscountValue = value === '' ? 0 : parseFloat(value);
                                                                    if (newDiscountValue >= 0) {
                                                                        setNotaDebito({
                                                                            ...notaDebito,
                                                                            detalleNotaDebito: (notaDebito.detalleNotaDebito ?? []).map(detalleItem =>
                                                                                detalleItem.idProducto === item.idProducto
                                                                                    ? {
                                                                                        ...detalleItem,
                                                                                        descuentoNotaDebito: newDiscountValue,
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
                                                            <span className="text-xs font-medium mb-1 whitespace-nowrap text-center">Cantidad N.D.</span>
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
                                                                    value={item.cantidadNotaDebito}
                                                                    onFocus={(e) => e.target.select()}
                                                                    onChange={(e) => {
                                                                        const value = e.target.value;
                                                                        const newQuantity = value === '' ? 0 : parseFloat(value);
                                                                        if (newQuantity >= 0 && newQuantity <= item.cantidadFactura) {
                                                                            setNotaDebito({
                                                                                ...notaDebito,
                                                                                detalleNotaDebito: (notaDebito.detalleNotaDebito ?? []).map(detalleItem =>
                                                                                    detalleItem.idProducto === item.idProducto
                                                                                        ? {
                                                                                            ...detalleItem,
                                                                                            cantidadNotaDebito: newQuantity,
                                                                                        }
                                                                                        : detalleItem
                                                                                )
                                                                            });
                                                                        }
                                                                        else {
                                                                            setNotaDebito({
                                                                                ...notaDebito,
                                                                                detalleNotaDebito: (notaDebito.detalleNotaDebito ?? []).map(detalleItem =>
                                                                                    detalleItem.idProducto === item.idProducto
                                                                                        ? {
                                                                                            ...detalleItem,
                                                                                            cantidadNotaDebito: item.cantidadFactura,
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
                    {(notaDebito.detalleNotaDebito ?? []).length > 0 && (
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
                                <div className="flex gap-2">
                                    {savedNotaDebitoId ? (
                                        <div className="flex-1 [&>button]:w-full [&>button]:h-[40px] [&>button]:text-lg [&>button]:font-bold">
                                            <FacturaModal
                                                key={savedNotaDebitoId}
                                                idVenta={savedNotaDebitoId}
                                                idMetodoDian={3}
                                                triggerText="Ver Nota Débito"
                                                triggerVariant="default"
                                            />
                                        </div>
                                    ) : (
                                        <Button
                                            onClick={() => setShowConfirmSaveDialog(true)}
                                            disabled={isSavingNotaDebito}
                                            className="flex-1 h-[40px] text-lg font-bold"
                                            size="lg"
                                        >
                                            <Check className="h-5 w-5 mr-2" />
                                            {isSavingNotaDebito ? 'Guardando...' : 'Guardar Nota Débito'}
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <AlertDialog open={showConfirmSaveDialog} onOpenChange={setShowConfirmSaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmar guardado</AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Desea guardar esta nota de débito?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            disabled={isSavingNotaDebito}
                            onClick={() => {
                                setShowConfirmSaveDialog(false);
                                void handleSaveNotaDebito();
                            }}
                        >
                            Confirmar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
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

export default MainDebitNote;