import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Check,
    FileText,
    Minus,
    Package,
    Plus,
    Search,
    ShoppingCart,
    Trash,
    X,
    type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CategoriasService } from '@/services/CategoryService';
import { CotizacionService } from '@/services/CotizacionService';
import { ParametrosVentasService } from '@/services/ParametrosVentaService';
import { ProductoService } from '@/services/ProductoService';
import { TerceroService } from '@/services/TerceroService';
import { TipoDocumentoService } from '@/services/TipoDocumentoService';
import { TipoDocumentoIdentidadService } from '@/services/TipoDocumentoIdentidadService';
import { CATEGORY_ICONS, iconMap } from '@/types/ICategoryIcons';
import type { ICategorias } from '@/types/ICategorias';
import type { ICotizacion } from '@/types/ICotizacion';
import type { ICotizacionTercero } from '@/types/ICotizacionTercero';
import type { ICotizacionDetalle } from '@/types/ICotizacionDetalle';
import type { IProducto } from '@/types/IProducto';
import type { ITercero } from '@/types/ITercero';
import type { ITipoDocumento } from '@/types/ITipoDocumento';
import type { ITipoDocumentoIdentidad } from '@/types/ITipoDocumentoIdentidad';

type PosCategory = ICategorias & { icon: LucideIcon };

const getLocalDate = (): string => {
    const now = new Date();
    const offsetMs = now.getTimezoneOffset() * 60 * 1000;
    return new Date(now.getTime() - offsetMs).toISOString().slice(0, 10);
};

const roundCurrency = (amount: number): number =>
    Number(amount.toFixed(2));

const resolveCategoryIcon = (iconId?: string | null): LucideIcon => {
    if (!iconId) return Package;

    const normalizedIconId = iconId.trim().toLowerCase();
    const categoryIcon = CATEGORY_ICONS.find(
        ({ id }) => id.toLowerCase() === normalizedIconId
    );

    return categoryIcon?.icon ?? iconMap[iconId.trim()] ?? Package;
};

const buildCotizacionTercero = (
    tercero: Partial<ICotizacionTercero> | null | undefined = null
): ICotizacionTercero => ({
    idTercero: tercero?.idTercero ?? 0,
    idTipoDocumentoId: tercero?.idTipoDocumentoId ?? 0,
    digitoVerificacion: tercero?.digitoVerificacion ?? null,
    numeroIdentificacion: tercero?.numeroIdentificacion ?? '',
    primerNombre: tercero?.primerNombre ?? '',
    primerApellido: tercero?.primerApellido ?? '',
    razonSocial: tercero?.razonSocial ?? '',
    emailTercero: tercero?.emailTercero ?? null,
});

const createEmptyCotizacion = (
    tercero: Partial<ICotizacionTercero> | null = null,
    idTipoDocumento = 7
): ICotizacion => ({
    idCotizacion: 0,
    idTipoDocumento,
    codigoDocumento: '',
    nombreDocumento: null,
    numeroCotizacion: 0,
    prefijoCotizacion: '',
    fechaCotizacion: getLocalDate(),
    esBorrador: false,
    idUsuario: 1,
    totalRegistros: 0,
    cantidadProductos: 0,
    totalPrecio: 0,
    totalDescuento: 0,
    totalBaseIva: 0,
    totalIva: 0,
    totalCotizacion: 0,
    observaciones: '',
    terceroCotizacion: buildCotizacionTercero(tercero),
    detalleCotizacion: [],
});

const buildCotizacionDetalle = (
    product: IProducto,
    registroCotizacion: number
): ICotizacionDetalle => {
    const price = Number(product.precioUnitario ?? product.precioPos ?? 0);

    return recalculateCotizacionDetalle({
        idDetalleCotizacion: 0,
        idCotizacion: 0,
        registroCotizacion,
        idProducto: Number(product.idProducto ?? 0),
        codigoProducto: product.codigoProducto ?? '',
        nombreProducto: product.nombreProducto ?? '',
        cantidadCotizacion: 1,
        precioUnitarioCotizacion: price,
        precioTotalCotizacion: price,
        porcentajeDescuentoCotizacion: 0,
        descuentoCotizacion: 0,
        porcentajeImpoConsumo: Number(product.porcentajeImpoConsumo ?? 0),
        impoConsumoCotizacion: 0,
        baseIvaCotizacion: price,
        porcentajeIvaCotizacion: Number(product.porcentajeIva ?? 0),
        ivaCotizacion: 0,
        totalCotizacion: 0,
        costoUnitarioCotizacion: 0,
        costoTotalCotizacion: 0,
        porcentajeReteIva: Number(product.porcentajeReteIva ?? 0),
        baseReteIvaCotizacion: 0,
        reteIvaCotizacion: 0,
        porcentajeReteRenta: Number(product.porcentajeReteRenta ?? 0),
        baseReteRenta: 0,
        reteRentaCotizacion: 0,
        porcentajeReteIca: Number(product.porcentajeReteIca ?? 0),
        baseReteIcaCotizacion: 0,
        reteIcaCotizacion: 0,
        idTipoProducto: Number(product.idTipoProducto ?? 0),
        indicadorMuestra: false,
    });
};

const recalculateCotizacionDetalle = (
    detail: ICotizacionDetalle
): ICotizacionDetalle => {
    const quantity = Math.max(0, Number(detail.cantidadCotizacion ?? 0));
    const unitPrice = Math.max(0, Number(detail.precioUnitarioCotizacion ?? 0));
    const grossAmount = quantity * unitPrice;
    const discountPercent = Math.min(
        100,
        Math.max(0, Number(detail.porcentajeDescuentoCotizacion ?? 0))
    );
    const discount = Math.min(
        grossAmount,
        Math.max(0, Number(detail.descuentoCotizacion ?? 0))
    );
    const taxBase = grossAmount - discount;
    const taxPercent = Math.max(0, Number(detail.porcentajeIvaCotizacion ?? 0));
    const consumptionPercent = Math.max(
        0,
        Number(detail.porcentajeImpoConsumo ?? 0)
    );
    const tax = roundCurrency(taxBase * taxPercent / 100);
    const consumption = roundCurrency(grossAmount * consumptionPercent / 100);

    return {
        ...detail,
        cantidadCotizacion: quantity,
        precioTotalCotizacion: roundCurrency(grossAmount),
        porcentajeDescuentoCotizacion: discountPercent,
        descuentoCotizacion: roundCurrency(discount),
        baseIvaCotizacion: roundCurrency(taxBase),
        ivaCotizacion: tax,
        impoConsumoCotizacion: consumption,
        totalCotizacion: roundCurrency(taxBase + tax + consumption),
        baseReteIvaCotizacion: roundCurrency(tax),
        reteIvaCotizacion: roundCurrency(
            tax * Number(detail.porcentajeReteIva ?? 0) / 100
        ),
        baseReteRenta: roundCurrency(taxBase),
        reteRentaCotizacion: roundCurrency(
            taxBase * Number(detail.porcentajeReteRenta ?? 0) / 100
        ),
        baseReteIcaCotizacion: roundCurrency(taxBase),
        reteIcaCotizacion: roundCurrency(
            taxBase * Number(detail.porcentajeReteIca ?? 0) / 1000
        ),
    };
};

const MainEstimate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const cotizacionDesdeTerceros = location.state?.from === 'terceros'
        ? location.state.cotizacion as ICotizacion
        : null;
    const [cotizacion, setCotizacion] = useState<ICotizacion>(
        cotizacionDesdeTerceros ?? createEmptyCotizacion()
    );
    const [idTerceroDefault, setIdTerceroDefault] = useState<number | null>(null);
    const [cotizaciones, setCotizaciones] = useState<ICotizacion[]>([]);
    const [searchDocumento, setSearchDocumento] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('0');
    const [searchTercero, setSearchTercero] = useState('');
    const [openDialogTercero, setOpenDialogTercero] = useState(false);
    const [categories, setCategories] = useState<PosCategory[]>([]);
    const [products, setProducts] = useState<IProducto[]>([]);
    const [terceros, setTerceros] = useState<ITercero[]>([]);
    const [tiposDocumento, setTiposDocumento] = useState<ITipoDocumento[]>([]);
    const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] =
        useState<ITipoDocumentoIdentidad[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isLoadingTerceros, setIsLoadingTerceros] = useState(true);
    const [isLoadingCotizaciones, setIsLoadingCotizaciones] = useState(true);
    const [isLoadingTiposDocumento, setIsLoadingTiposDocumento] =
        useState(true);
    const [isLoadingTiposIdentidad, setIsLoadingTiposIdentidad] =
        useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [productError, setProductError] = useState<string | null>(null);
    const [terceroError, setTerceroError] = useState<string | null>(null);
    const [cotizacionError, setCotizacionError] = useState<string | null>(null);
    const [tipoDocumentoError, setTipoDocumentoError] = useState<string | null>(
        null
    );
    const [tipoIdentidadError, setTipoIdentidadError] = useState<string | null>(
        null
    );
    const barcodeBuffer = useRef('');
    const lastBarcodeKeyTime = useRef(0);

    const fetchCategories = async () => {
        try {
            setCategoryError(null);
            setIsLoadingCategories(true);
            const data = await CategoriasService.getAll();
            setCategories([
                {
                    idCategoria: 0,
                    codigoCategoria: 'all',
                    nombreCategoria: 'Todo',
                    iconoCategoria: 'Package',
                    icon: Package,
                },
                ...data.map((category) => ({
                    ...category,
                    icon: resolveCategoryIcon(category.iconoCategoria),
                })),
            ]);
        } catch (error) {
            console.error('Error al cargar categorías:', error);
            setCategoryError('Error al cargar las categorías');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchProducts = async (
        numeroIdentificacion = cotizacion.terceroCotizacion?.numeroIdentificacion || '0'
    ) => {
        try {
            setProductError(null);
            setIsLoadingProducts(true);
            const data =
                await ProductoService.getProductosVentaByTercero(numeroIdentificacion);
            setProducts(data);
        } catch (error) {
            console.error('Error al cargar productos para cotización:', error);
            setProductError('Error al cargar los productos');
        } finally {
            setIsLoadingProducts(false);
        }
    };

    const fetchTerceros = async () => {
        try {
            setTerceroError(null);
            setIsLoadingTerceros(true);
            setTerceros(await TerceroService.getAll());
        } catch (error) {
            console.error('Error al cargar terceros:', error);
            setTerceroError('Error al cargar los terceros');
        } finally {
            setIsLoadingTerceros(false);
        }
    };

    const fetchCotizaciones = async () => {
        try {
            setCotizacionError(null);
            setIsLoadingCotizaciones(true);
            setCotizaciones(await CotizacionService.getAll());
        } catch (error) {
            console.error('Error al cargar cotizaciones:', error);
            setCotizacionError('Error al cargar las cotizaciones');
        } finally {
            setIsLoadingCotizaciones(false);
        }
    };

    const fetchTiposDocumento = async () => {
        try {
            setTipoDocumentoError(null);
            setIsLoadingTiposDocumento(true);
            setTiposDocumento(
                await TipoDocumentoService.getTiposDocumentoCotizacion()
            );
        } catch (error) {
            console.error('Error al cargar tipos de documento:', error);
            setTipoDocumentoError('Error al cargar los tipos de documento');
        } finally {
            setIsLoadingTiposDocumento(false);
        }
    };

    const fetchTiposDocumentoIdentidad = async () => {
        try {
            setTipoIdentidadError(null);
            setIsLoadingTiposIdentidad(true);
            const data = await TipoDocumentoIdentidadService.getAll();
            setTiposDocumentoIdentidad([
                {
                    idTipoDocumentoId: 0,
                    nombreTipoDocumentoId: 'Seleccione un tipo de documento',
                    codigoTipoDocumentoId: '0',
                    observacionTipoDocumentoId: null,
                },
                ...data,
            ]);
        } catch (error) {
            console.error('Error al cargar tipos de identificación:', error);
            setTipoIdentidadError('Error al cargar los tipos de documento');
        } finally {
            setIsLoadingTiposIdentidad(false);
        }
    };

    const fetchParametrosDefault = async () => {
        try {
            const data = await ParametrosVentasService.getDefault();
            const defaultThird = data.terceroVenta[0];
            const defaultDocument = data.documentoCotizacion[0];
            const third = buildCotizacionTercero(defaultThird);
            setIdTerceroDefault(defaultThird?.idTercero ?? null);
            if (!cotizacionDesdeTerceros) {
                setCotizacion((current) => ({
                    ...current,
                    idTipoDocumento:
                        defaultDocument?.idTipoDocumento ?? current.idTipoDocumento,
                    codigoDocumento: defaultDocument?.codigoDocumento ?? '',
                    nombreDocumento: defaultDocument?.nombreDocumento ?? null,
                    terceroCotizacion: third,
                }));
            }

            return cotizacionDesdeTerceros?.terceroCotizacion?.numeroIdentificacion
                || third.numeroIdentificacion
                || '0';
        } catch (error) {
            console.error('Error al cargar parámetros para cotización:', error);
            toast.error('No fue posible cargar los datos predeterminados');
            return cotizacionDesdeTerceros?.terceroCotizacion?.numeroIdentificacion
                || '0';
        }
    };

    const initializeComponent = async () => {
        const [, , , , , numeroIdentificacion] = await Promise.all([
            fetchCategories(),
            fetchTiposDocumentoIdentidad(),
            fetchTiposDocumento(),
            fetchTerceros(),
            fetchCotizaciones(),
            fetchParametrosDefault(),
        ]);
        await fetchProducts(numeroIdentificacion);
    };

    useEffect(() => {
        void initializeComponent();
    }, []);

    useEffect(() => {
        const selectedDocument = tiposDocumento.find(
            (document) =>
                Number(document.idTipoDocumentoExterno) ===
                Number(cotizacion.idTipoDocumentoExterno)
        ) ?? tiposDocumento.find(
            (document) =>
                Number(document.idTipoDocumento) ===
                Number(cotizacion.idTipoDocumento)
        );
        if (!selectedDocument) return;

        const prefijoConsecutivo = selectedDocument.prefijoConsecutivo ?? '';
        if (
            cotizacion.idTipoDocumentoExterno !== selectedDocument.idTipoDocumentoExterno ||
            cotizacion.prefijoCotizacion !== prefijoConsecutivo
        ) {
            setCotizacion((current) => ({
                ...current,
                idTipoDocumento: selectedDocument.idTipoDocumento,
                idTipoDocumentoExterno: selectedDocument.idTipoDocumentoExterno,
                codigoDocumento: selectedDocument.codigoDocumento ?? '',
                nombreDocumento: selectedDocument.nombreDocumento ?? null,
                prefijoCotizacion: prefijoConsecutivo,
            }));
        }
    }, [
        tiposDocumento,
        cotizacion.idTipoDocumento,
        cotizacion.idTipoDocumentoExterno,
        cotizacion.prefijoCotizacion,
    ]);

    const addToCart = (product: IProducto) => {
        setCotizacion((current) => {
            const existing = current.detalleCotizacion.find(
                (detail) => detail.idProducto === product.idProducto
            );

            if (existing) {
                return {
                    ...current,
                    detalleCotizacion: current.detalleCotizacion.map((detail) =>
                        detail.idProducto === product.idProducto
                            ? recalculateCotizacionDetalle({
                                ...detail,
                                cantidadCotizacion:
                                    Number(detail.cantidadCotizacion ?? 0) + 1,
                            })
                            : detail
                    ),
                };
            }

            return {
                ...current,
                detalleCotizacion: [
                    ...current.detalleCotizacion,
                    buildCotizacionDetalle(
                        product,
                        current.detalleCotizacion.length + 1
                    ),
                ],
            };
        });
    };

    useEffect(() => {
        const handleBarcodeKeypress = (event: KeyboardEvent) => {
            const now = Date.now();
            if (event.key === 'Enter') {
                const barcode = barcodeBuffer.current;
                barcodeBuffer.current = '';
                if (!barcode) return;

                const product = products.find(
                    (item) => item.codigoBarras === barcode
                );
                if (product) {
                    addToCart(product);
                } else {
                    console.warn('Producto no encontrado:', barcode);
                }
                return;
            }

            if (event.key.length !== 1) return;
            barcodeBuffer.current =
                now - lastBarcodeKeyTime.current < 50
                    ? barcodeBuffer.current + event.key
                    : event.key;
            lastBarcodeKeyTime.current = now;
        };

        window.addEventListener('keypress', handleBarcodeKeypress);
        return () =>
            window.removeEventListener('keypress', handleBarcodeKeypress);
    }, [products]);

    const updateDetail = (
        productId: number | null | undefined,
        updates: Partial<ICotizacionDetalle>
    ) => {
        setCotizacion((current) => ({
            ...current,
            detalleCotizacion: current.detalleCotizacion.map((detail) => {
                if (detail.idProducto !== productId) return detail;

                const next = { ...detail, ...updates };
                const grossAmount =
                    Number(next.precioUnitarioCotizacion ?? 0) *
                    Number(next.cantidadCotizacion ?? 0);

                const discountPercentChanged =
                    Object.prototype.hasOwnProperty.call(
                        updates,
                        'porcentajeDescuentoCotizacion'
                    );
                const discountAmountChanged =
                    Object.prototype.hasOwnProperty.call(
                        updates,
                        'descuentoCotizacion'
                    );

                if (discountPercentChanged) {
                    next.descuentoCotizacion =
                        grossAmount *
                        Number(next.porcentajeDescuentoCotizacion ?? 0) /
                        100;
                } else if (discountAmountChanged) {
                    next.porcentajeDescuentoCotizacion =
                        grossAmount > 0
                            ? Number(next.descuentoCotizacion ?? 0) /
                            grossAmount *
                            100
                            : 0;
                } else if (
                    Object.prototype.hasOwnProperty.call(
                        updates,
                        'cantidadCotizacion'
                    ) ||
                    Object.prototype.hasOwnProperty.call(
                        updates,
                        'precioUnitarioCotizacion'
                    )
                ) {
                    next.descuentoCotizacion =
                        grossAmount *
                        Number(next.porcentajeDescuentoCotizacion ?? 0) /
                        100;
                }

                return recalculateCotizacionDetalle(next);
            }),
        }));
    };

    const updateQuantity = (productId: number | null | undefined, change: number) => {
        const detail = cotizacion.detalleCotizacion.find(
            (item) => item.idProducto === productId
        );
        if (!detail) return;

        updateDetail(productId, {
            cantidadCotizacion: Math.max(
                0,
                Number(detail.cantidadCotizacion ?? 0) + change
            ),
        });
    };

    const removeFromCart = (productId: number | null | undefined) => {
        setCotizacion((current) => ({
            ...current,
            detalleCotizacion: current.detalleCotizacion.filter(
                (item) => item.idProducto !== productId
            ),
        }));
    };

    const updateTercero = (updates: Partial<ICotizacionTercero>) => {
        const identificationChanged =
            Object.prototype.hasOwnProperty.call(
                updates,
                'numeroIdentificacion'
            ) && updates.idTercero === undefined;
        setCotizacion((current) => ({
            ...current,
            idTerceroCotizacion: identificationChanged
                ? null
                : updates.idTercero ??
                current.terceroCotizacion?.idTercero ??
                null,
            terceroCotizacion: {
                ...buildCotizacionTercero(current.terceroCotizacion),
                ...updates,
                ...(identificationChanged ? { idTercero: 0 } : {}),
            },
        }));
    };

    const handleSelectTercero = (tercero: ITercero) => {
        updateTercero({
            idTercero: tercero.idTercero ?? 0,
            idTipoDocumentoId: tercero.idTipoDocumentoId ?? 0,
            digitoVerificacion: tercero.digitoVerificacion ?? null,
            numeroIdentificacion: tercero.numeroIdentificacion ?? '',
            primerNombre: tercero.primerNombre ?? '',
            primerApellido: tercero.primerApellido ?? '',
            razonSocial: tercero.razonSocial ?? '',
            emailTercero: tercero.emailTercero ?? null,
        });
        setOpenDialogTercero(false);
        void fetchProducts(tercero.numeroIdentificacion || '0');
    };

    const handleSearchTercero = (numeroIdentificacion: string) => {
        const tercero = terceros.find(
            (item) => item.numeroIdentificacion === numeroIdentificacion
        );
        if (tercero) handleSelectTercero(tercero);
    };

    const handleNewCotizacion = () => {
        setCotizacion((current) => ({
            ...createEmptyCotizacion(
                current.terceroCotizacion,
                current.idTipoDocumento
            ),
            idTipoDocumentoExterno: current.idTipoDocumentoExterno,
            codigoDocumento: current.codigoDocumento,
            nombreDocumento: current.nombreDocumento,
            prefijoCotizacion: current.prefijoCotizacion,
        }));
        setSearchTerm('');
        setSelectedCategory('0');
    };

    const formatCurrency = (amount: number | null | undefined): string =>
        Number(amount ?? 0).toLocaleString('es-CO', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

    const subtotal = cotizacion.detalleCotizacion.reduce(
        (sum, item) =>
            sum +
            Number(item.precioUnitarioCotizacion ?? 0) *
            Number(item.cantidadCotizacion ?? 0),
        0
    );
    const discount = cotizacion.detalleCotizacion.reduce(
        (sum, item) => sum + Number(item.descuentoCotizacion ?? 0),
        0
    );
    const tax = cotizacion.detalleCotizacion.reduce(
        (sum, item) => sum + Number(item.ivaCotizacion ?? 0),
        0
    );
    const consumption = cotizacion.detalleCotizacion.reduce(
        (sum, item) => sum + Number(item.impoConsumoCotizacion ?? 0),
        0
    );
    const total = cotizacion.detalleCotizacion.reduce(
        (sum, item) => sum + Number(item.totalCotizacion ?? 0),
        0
    );
    const totalItems = cotizacion.detalleCotizacion.reduce(
        (sum, item) => sum + Number(item.cantidadCotizacion ?? 0),
        0
    );

    const filteredProducts = products.filter((product) => {
        const search = searchTerm.toLowerCase();
        const matchesSearch =
            (product.nombreProducto ?? '').toLowerCase().includes(search) ||
            (product.codigoProducto ?? '').toLowerCase().includes(search) ||
            (product.codigoBarras ?? '').toLowerCase().includes(search);
        const matchesCategory =
            selectedCategory === '0' ||
            Number(product.idCategoria) === Number(selectedCategory);
        return matchesSearch && matchesCategory;
    });

    const filteredCotizaciones = cotizaciones.filter((document) => {
        const query = searchDocumento.trim().toLowerCase();
        return [
            document.numeroCotizacion?.toString(),
            document.terceroCotizacion?.numeroIdentificacion,
            document.terceroCotizacion?.razonSocial,
            document.terceroCotizacion?.primerNombre,
            document.terceroCotizacion?.primerApellido,
            `${document.terceroCotizacion?.primerNombre ?? ''} ${document.terceroCotizacion?.primerApellido ?? ''}`,
        ].some((value) =>
            (value ?? '').toLowerCase().includes(query)
        );
    });

    const handleSaveCotizacion = async () => {
        const idCotizacion = cotizacion.idCotizacion;
        const isEditing = idCotizacion !== null && idCotizacion > 0;
        if (!cotizacion.detalleCotizacion.length) {
            toast.error('Agregue al menos un producto a la cotización');
            return;
        }
        if (!cotizacion.idTipoDocumento) {
            toast.error('Seleccione el tipo de documento de la cotización');
            return;
        }

        const payload: ICotizacion = {
            ...cotizacion,
            idCotizacion: isEditing ? idCotizacion : cotizacion.idCotizacion,
            fechaCotizacion: getLocalDate(),
            idTerceroCotizacion:
                cotizacion.terceroCotizacion?.idTercero || null,
            totalRegistros: cotizacion.detalleCotizacion.length,
            cantidadProductos: totalItems,
            totalPrecio: subtotal,
            totalDescuento: discount,
            totalBaseIva: subtotal - discount,
            totalIva: tax,
            totalCotizacion: total,
            detalleCotizacion: cotizacion.detalleCotizacion.map((item) => ({
                ...item,
                totalCotizacion: Number(item.totalCotizacion ?? 0),
            })),
        };

        try {
            setIsSaving(true);
            let savedCotizacion: ICotizacion;
            let successMessage: string;

            if (isEditing) {
                const result = await CotizacionService.update(payload);
                savedCotizacion = { ...payload, idCotizacion };
                successMessage =
                    `${result.message || 'Cotización actualizada correctamente'} ${idCotizacion}`;
            } else {
                const result = await CotizacionService.create(payload);
                savedCotizacion = {
                    ...payload,
                    idCotizacion: result.idCotizacion,
                };
                successMessage =
                    `${result.message || 'Cotización guardada correctamente'} ${result.idCotizacion}`;
            }

            setCotizaciones((current) => [
                savedCotizacion,
                ...current.filter(
                    (item) => item.idCotizacion !== savedCotizacion.idCotizacion
                ),
            ]);
            toast.success(successMessage, { position: 'top-center' });
            handleNewCotizacion();
        } catch (error) {
            console.error(
                `Error al ${isEditing ? 'actualizar' : 'guardar'} la cotización:`,
                error
            );
            toast.error(
                isEditing
                    ? 'No fue posible actualizar la cotización'
                    : 'No fue posible guardar la cotización'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleSelectCotizacion = async (documento: ICotizacion) => {
        try {
            const data = await CotizacionService.getById(
                documento.idCotizacion ?? 0
            );
            if (!data) {
                toast.error('No se encontró la cotización');
                return;
            }

            setCotizacion((current) => ({
                ...current,
                ...data,
                idCotizacion: data.idCotizacion ?? documento.idCotizacion ?? 0,
                idTipoDocumento: data.idTipoDocumento ?? current.idTipoDocumento,
                idTipoDocumentoExterno:
                    data.idTipoDocumentoExterno ??
                    documento.idTipoDocumentoExterno ??
                    current.idTipoDocumentoExterno,
                codigoDocumento: data.codigoDocumento ?? current.codigoDocumento,
                nombreDocumento: data.nombreDocumento ?? current.nombreDocumento,
                prefijoCotizacion:
                    data.prefijoCotizacion ?? documento.prefijoCotizacion ?? '',
                fechaCotizacion:
                    data.fechaCotizacion?.split('T')[0] ??
                    documento.fechaCotizacion ??
                    '',
                terceroCotizacion: buildCotizacionTercero(
                    data.terceroCotizacion ?? documento.terceroCotizacion
                ),
                detalleCotizacion: data.detalleCotizacion ?? [],
            }));
            setOpenDialog(false);
            setSearchDocumento('');
        } catch (error) {
            console.error('Error al cargar la cotización:', error);
            toast.error('No fue posible cargar la cotización');
        }
    };

    return (
        <div className="h-screen bg-background flex flex-col overflow-hidden">
            <div className="w-full border-b bg-card px-4 py-2.5 shadow-sm">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-foreground">
                        Cotización
                    </h1>
                    <div className="flex items-center gap-3">
                        <Badge className="flex items-center gap-2 px-3.5 py-1 text-sm bg-primary text-primary-foreground shadow-sm">
                            <span className="font-normal opacity-90 text-xs uppercase tracking-wider">
                                Total:
                            </span>
                            <span className="font-bold text-base">
                                ${formatCurrency(total)}
                            </span>
                        </Badge>
                        
                        <Button
                            variant="default"
                            size="icon"
                            title="Nueva cotización"
                            onClick={handleNewCotizacion}
                            className="h-9 w-9 shadow-sm"
                        >
                            <Plus className="h-4 w-4" />
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
                                    placeholder="Buscar por número de cotización o datos del tercero"
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
                                            {filteredCotizaciones.map((doc) => (
                                                    <TableRow
                                                        key={doc.idCotizacion}
                                                        className="cursor-pointer hover:bg-primary/10"
                                                        onClick={() => handleSelectCotizacion(doc)}
                                                    >
                                                        <TableCell>
                                                            {doc.nombreDocumento ?? doc.codigoDocumento}
                                                        </TableCell>
                                                        <TableCell>
                                                            {doc.prefijoCotizacion ?? ''}
                                                            {doc.numeroCotizacion}
                                                        </TableCell>
                                                        <TableCell>
                                                            {doc.terceroCotizacion?.numeroIdentificacion ?? ''}
                                                        </TableCell>
                                                        <TableCell>
                                                            {doc.terceroCotizacion?.razonSocial ||
                                                                `${doc.terceroCotizacion?.primerNombre ?? ''} ${doc.terceroCotizacion?.primerApellido ?? ''}`.trim() ||
                                                                'Sin cliente'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatCurrency(doc.totalCotizacion)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                    {isLoadingCotizaciones && (
                                        <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                    )}
                                    {cotizacionError && (
                                        <div className="text-center text-red-500 py-4">{cotizacionError}</div>
                                    )}
                                    {!isLoadingCotizaciones &&
                                        !cotizacionError &&
                                        cotizaciones.length === 0 && (
                                            <div className="py-4 text-center text-muted-foreground">
                                                No hay cotizaciones para mostrar
                                            </div>
                                        )}
                                    {!isLoadingCotizaciones &&
                                        !cotizacionError &&
                                        cotizaciones.length > 0 &&
                                        filteredCotizaciones.length === 0 && (
                                            <div className="py-4 text-center text-muted-foreground">
                                                No se encontraron cotizaciones
                                            </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

                        <Button
                            variant="destructive"
                            size="icon"
                            title="Salir"
                            onClick={() => navigate('/main-menu')}
                            className="h-9 w-9 shadow-sm"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="w-[70%] flex flex-col min-h-0">
                    <div className="p-3 border-b h-[60px] shrink-0">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <h2 className="text-sm font-normal">
                                    Tipo de documento
                                </h2>
                                <select
                                    id="tipo-documento-cotizacion"
                                    className="rounded border px-3 py-2 text-sm bg-background w-50 font-bold"
                                    value={cotizacion.idTipoDocumentoExterno?.toString() ?? ''}
                                    disabled={isLoadingTiposDocumento || !!cotizacion.idCotizacion}
                                    onChange={(event) => {
                                        const idTipoDocumentoExterno = Number(event.target.value);
                                        const selectedDocument = tiposDocumento.find(
                                            (item) =>
                                                Number(item.idTipoDocumentoExterno) ===
                                                idTipoDocumentoExterno
                                        );
                                        if (!selectedDocument) return;

                                        setCotizacion((current) => ({
                                            ...current,
                                            idTipoDocumento: selectedDocument.idTipoDocumento,
                                            idTipoDocumentoExterno:
                                                selectedDocument.idTipoDocumentoExterno,
                                            codigoDocumento:
                                                selectedDocument.codigoDocumento ?? '',
                                            nombreDocumento:
                                                selectedDocument.nombreDocumento ?? null,
                                            prefijoCotizacion:
                                                selectedDocument.prefijoConsecutivo ?? '',
                                        }));
                                    }}
                                >
                                    {tiposDocumento.map((document) => (
                                        <option
                                            key={document.idTipoDocumentoExterno}
                                            value={document.idTipoDocumentoExterno ?? ''}
                                        >
                                            {`${document.nombreTipoDocumentoExterno || document.nombreDocumento || 'Documento'} - ${document.codigoTipoDocumentoExterno || document.codigoDocumento || document.idTipoDocumento}`}
                                        </option>
                                    ))}
                                </select>
                                <h2 className="text-sm font-normal">Prefijo</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-20"
                                    value={cotizacion.prefijoCotizacion ?? ''}
                                    readOnly
                                    aria-label="Prefijo de cotización"
                                />
                                <h2 className="text-sm font-normal">Número</h2>
                                <input
                                    type="text"
                                    className="rounded border px-3 py-2 text-sm bg-background w-28"
                                    value={cotizacion.numeroCotizacion || ''}
                                    readOnly
                                    aria-label="Número de cotización"
                                />
                                <h2 className="text-sm font-normal">Fecha</h2>
                                <input
                                    type="date"
                                    className="rounded border px-3 py-2 text-sm bg-background w-25"
                                    value={cotizacion.fechaCotizacion || getLocalDate()}
                                    readOnly
                                    aria-label="Fecha de cotización"
                                />
                            </div>
                        </div>
                        {tipoDocumentoError && (
                            <p className="mt-2 text-sm text-destructive">
                                {tipoDocumentoError}
                            </p>
                        )}
                    </div>

                    <div className="shrink-0 border-b bg-muted/50 p-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-sm font-medium whitespace-nowrap">
                                Cliente
                            </h2>
                            <div className="grid flex-1 grid-cols-6 gap-1">
                                <select
                                    className="w-full rounded border px-2 py-2 text-sm bg-background"
                                    value={
                                        cotizacion.terceroCotizacion?.idTipoDocumentoId ?? 0
                                    }
                                    onChange={(event) =>
                                        updateTercero({
                                            idTipoDocumentoId:
                                                Number.parseInt(event.target.value, 10) || 0,
                                        })
                                    }
                                >
                                    {tiposDocumentoIdentidad.map((item) => (
                                        <option
                                            key={item.idTipoDocumentoId}
                                            value={item.idTipoDocumentoId}
                                        >
                                            {item.nombreTipoDocumentoId} (
                                            {item.codigoTipoDocumentoId})
                                        </option>
                                    ))}
                                </select>
                                <Input
                                    placeholder="Número de identificación"
                                    className="rounded border px-2 py-2 text-sm bg-background"
                                    value={
                                        cotizacion.terceroCotizacion?.numeroIdentificacion ?? ''
                                    }
                                    onChange={(event) => {
                                        const value = event.target.value;
                                        updateTercero({ numeroIdentificacion: value });
                                        if (value.length >= 3) handleSearchTercero(value);
                                    }}
                                    onBlur={(event) => {
                                        if (event.target.value) {
                                            handleSearchTercero(event.target.value);
                                        }
                                    }}
                                />
                                <Input
                                    placeholder="Primer nombre"
                                    className="rounded border px-2 py-2 text-sm bg-background"
                                    value={cotizacion.terceroCotizacion?.primerNombre ?? ''}
                                    onChange={(event) =>
                                        updateTercero({ primerNombre: event.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Primer apellido"
                                    className="rounded border px-2 py-2 text-sm bg-background"
                                    value={cotizacion.terceroCotizacion?.primerApellido ?? ''}
                                    onChange={(event) =>
                                        updateTercero({ primerApellido: event.target.value })
                                    }
                                />
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    className="rounded border px-2 py-2 text-sm bg-background"
                                    value={cotizacion.terceroCotizacion?.emailTercero ?? ''}
                                    onChange={(event) =>
                                        updateTercero({ emailTercero: event.target.value })
                                    }
                                />
                                <Input
                                    placeholder="Razón Social"
                                    className="rounded border px-2 py-2 text-sm bg-background"
                                    value={cotizacion.terceroCotizacion?.razonSocial ?? ''}
                                    onChange={(event) =>
                                        updateTercero({ razonSocial: event.target.value })
                                    }
                                />
                            </div>
                            <Dialog
                                open={openDialogTercero}
                                onOpenChange={setOpenDialogTercero}
                            >
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            title="Buscar cliente"
                                        >
                                            <Search className="h-4 w-4" />
                                            <span className="sr-only">Buscar cliente</span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Buscar cliente</DialogTitle>
                                        </DialogHeader>
                                        <Input
                                            className="mb-2"
                                            placeholder="Buscar por número, nombre o razón social..."
                                            value={searchTercero}
                                            onChange={(event) =>
                                                setSearchTercero(event.target.value)
                                            }
                                        />
                                        <div className="max-h-[400px] overflow-auto">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>Número identificación</TableHead>
                                                        <TableHead>Primer nombre</TableHead>
                                                        <TableHead>Primer apellido</TableHead>
                                                        <TableHead>Razón social</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {terceros
                                                        .filter((tercero) => {
                                                            const query =
                                                                searchTercero.toLowerCase();
                                                            return [
                                                                tercero.numeroIdentificacion,
                                                                tercero.primerNombre,
                                                                tercero.primerApellido,
                                                                tercero.razonSocial,
                                                            ].some((value) =>
                                                                (value ?? '')
                                                                    .toLowerCase()
                                                                    .includes(query)
                                                            );
                                                        })
                                                        .map((tercero) => (
                                                            <TableRow
                                                                key={tercero.idTercero}
                                                                className="cursor-pointer hover:bg-primary/10"
                                                                onClick={() =>
                                                                    handleSelectTercero(tercero)
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {tercero.numeroIdentificacion}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {tercero.primerNombre}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {tercero.primerApellido}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {tercero.razonSocial}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                </TableBody>
                                            </Table>
                                            {isLoadingTerceros && (
                                                <p className="py-4 text-center text-muted-foreground">
                                                    Cargando clientes...
                                                </p>
                                            )}
                                            {terceroError && (
                                                <p className="py-4 text-center text-destructive">
                                                    {terceroError}
                                                </p>
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
                                        from: 'estimate',
                                        cotizacion,
                                        crearTercero:
                                            !cotizacion.terceroCotizacion?.idTercero ||
                                            cotizacion.terceroCotizacion.idTercero === idTerceroDefault
                                    }
                                })}
                            >
                                <FileText className="w-5 h-5" />
                            </Button>
                        </div>
                        {tipoIdentidadError && (
                            <p className="mt-2 text-sm text-destructive">
                                {tipoIdentidadError}
                            </p>
                        )}
                    </div>

                    <div className="shrink-0 border-b bg-muted/50">
                        <div className="ml-3 mr-2 mt-2 mb-2">
                            <div className="grid w-full grid-cols-[2fr_1fr_1fr] gap-2">
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="observaciones-cotizacion"
                                        className="whitespace-nowrap text-sm font-medium"
                                    >
                                        Observaciones:
                                    </Label>
                                    <Input
                                        id="observaciones-cotizacion"
                                        placeholder="Observaciones"
                                        className="flex-1 rounded border bg-background px-2 py-2 text-base"
                                        value={cotizacion.observaciones ?? ''}
                                        onChange={(event) =>
                                            setCotizacion((current) => ({
                                                ...current,
                                                observaciones: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="orden-referencia-cotizacion"
                                        className="whitespace-nowrap text-sm font-medium"
                                    >
                                        Orden Ref:
                                    </Label>
                                    <Input
                                        id="orden-referencia-cotizacion"
                                        placeholder="Orden Referencia"
                                        className="flex-1 rounded border bg-background px-2 py-2 text-base"
                                        value={cotizacion.ordenReferencia ?? ''}
                                        onChange={(event) =>
                                            setCotizacion((current) => ({
                                                ...current,
                                                ordenReferencia: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <Label
                                        htmlFor="fecha-orden-referencia-cotizacion"
                                        className="whitespace-nowrap text-sm font-medium"
                                    >
                                        Fecha Ref:
                                    </Label>
                                    <Input
                                        id="fecha-orden-referencia-cotizacion"
                                        type="date"
                                        placeholder="Fecha Orden Referencia"
                                        className="flex-1 rounded border bg-background px-2 py-2 text-base"
                                        value={cotizacion.fechaOrdenReferencia?.split('T')[0] ?? ''}
                                        onChange={(event) =>
                                            setCotizacion((current) => ({
                                                ...current,
                                                fechaOrdenReferencia: event.target.value,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto p-3">
                        {!cotizacion.detalleCotizacion.length ? (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">🛒</div>
                                <p className="text-muted-foreground font-medium">Carrito vacío</p>
                                <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {cotizacion.detalleCotizacion.map((item) => (
                                    <Card
                                        key={item.idProducto}
                                        className="p-3"
                                    >
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3 w-full min-w-0 px-2">
                                                <Badge
                                                    variant="outline"
                                                    className="text-xs h-9 px-3 flex items-center bg-background"
                                                >
                                                    {item.codigoProducto || 'Sin código'}
                                                </Badge>
                                                <div className="min-w-0 flex-1">
                                                    {item.idTipoProducto === 2 ? (
                                                        <Input
                                                            value={item.nombreProducto ?? ''}
                                                            onChange={(event) =>
                                                                updateDetail(item.idProducto, {
                                                                    nombreProducto: event.target.value,
                                                                })
                                                            }
                                                            className="max-w-xl text-sm font-medium"
                                                            placeholder="Nombre del producto"
                                                        />
                                                    ) : (
                                                        <h3 className="truncate text-sm font-medium">
                                                            {item.nombreProducto}
                                                        </h3>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap items-end justify-between gap-2 w-full px-2">
                                                <div className="flex flex-col">
                                                    <span className="mb-1 text-center text-xs font-bold">
                                                        Precio
                                                    </span>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        value={item.precioUnitarioCotizacion ?? ''}
                                                        onFocus={(event) =>
                                                            event.target.select()
                                                        }
                                                        onChange={(event) =>
                                                            updateDetail(item.idProducto, {
                                                                precioUnitarioCotizacion:
                                                                    Number(event.target.value) || 0,
                                                            })
                                                        }
                                                        className="h-8 w-28 bg-background text-center text-sm text-muted-foreground"
                                                        placeholder="Precio"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap items-end gap-2">
                                                <div className="flex flex-col">
                                                    <label className="mb-1 text-center text-xs">
                                                        % Descuento
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        max={100}
                                                        className="h-8 w-20 text-center"
                                                        value={
                                                            item.porcentajeDescuentoCotizacion ?? 0
                                                        }
                                                        onChange={(event) =>
                                                            updateDetail(item.idProducto, {
                                                                porcentajeDescuentoCotizacion:
                                                                    Number(event.target.value) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="mb-1 text-center text-xs">
                                                        Valor descuento
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        className="h-8 w-24 text-center"
                                                        value={Number(
                                                            item.descuentoCotizacion ?? 0
                                                        ).toFixed(2)}
                                                        onChange={(event) =>
                                                            updateDetail(item.idProducto, {
                                                                descuentoCotizacion:
                                                                    Number(event.target.value) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="mb-1 text-center text-xs">
                                                        % IVA
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        min={0}
                                                        className="h-8 w-20 text-center"
                                                        value={item.porcentajeIvaCotizacion ?? 0}
                                                        onChange={(event) =>
                                                            updateDetail(item.idProducto, {
                                                                porcentajeIvaCotizacion:
                                                                    Number(event.target.value) || 0,
                                                            })
                                                        }
                                                    />
                                                </div>
                                                <div className="flex flex-col">
                                                    <label className="mb-1 text-center text-xs">
                                                        Valor IVA
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        className="h-8 w-24 text-center"
                                                        value={Number(
                                                            item.ivaCotizacion ?? 0
                                                        ).toFixed(2)}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="h-8 w-px bg-border" />
                                                <div className="flex flex-col">
                                                    <span className="mb-1 text-center text-xs font-bold">
                                                        Cantidad
                                                    </span>
                                                    <div className="flex items-center">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 rounded-r-none"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.idProducto,
                                                                    -1
                                                                )
                                                            }
                                                        >
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <Input
                                                            type="number"
                                                            min={0}
                                                            value={
                                                                item.cantidadCotizacion ?? 0
                                                            }
                                                            onFocus={(event) =>
                                                                event.target.select()
                                                            }
                                                            onChange={(event) =>
                                                                updateDetail(item.idProducto, {
                                                                    cantidadCotizacion:
                                                                        Number(event.target.value) ||
                                                                        0,
                                                                })
                                                            }
                                                            className="h-8 w-16 rounded-none text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 w-8 rounded-l-none"
                                                            onClick={() =>
                                                                updateQuantity(
                                                                    item.idProducto,
                                                                    1
                                                                )
                                                            }
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="mb-1 text-center text-xs font-bold">
                                                        Valor total
                                                    </span>
                                                    <span className="flex h-8 min-w-20 items-center justify-end font-bold text-primary">
                                                        ${formatCurrency(
                                                            item.totalCotizacion
                                                        )}
                                                    </span>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    title="Eliminar producto"
                                                    onClick={() =>
                                                        removeFromCart(item.idProducto)
                                                    }
                                                >
                                                    <Trash className="h-4 w-4 text-destructive" />
                                                </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="shrink-0 border-t bg-background p-3">
                        <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Subtotal</span>
                                <span>${formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Descuento</span>
                                <span>${formatCurrency(discount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">IVA</span>
                                <span>${formatCurrency(tax)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    Impuesto al consumo
                                </span>
                                <span>${formatCurrency(consumption)}</span>
                            </div>
                            <div className="col-span-2 flex justify-between border-t pt-2 font-bold">
                                <span>Total cotización</span>
                                <span>${formatCurrency(total)}</span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            onClick={handleSaveCotizacion}
                            disabled={
                                isSaving ||
                                !cotizacion.detalleCotizacion.length
                            }
                            className="h-10 w-full text-lg font-bold"
                            size="lg"
                        >
                            <Check className="mr-2 h-5 w-5" />
                            {isSaving
                                ? cotizacion.idCotizacion
                                    ? 'Actualizando...'
                                    : 'Guardando...'
                                : cotizacion.idCotizacion
                                    ? 'Actualizar Cotización'
                                    : 'Guardar Cotización'}
                        </Button>
                    </div>
                </div>

                <div className="flex w-[30%] flex-col border-l bg-card">
                    <div className="border-b p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Buscar por nombre, código..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                                className="w-full pl-10"
                            />
                        </div>
                    </div>
                    <div className="h-20 border-b p-2">
                        <Tabs
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}
                            className="w-full"
                        >
                            <TabsList className="flex h-full flex-wrap gap-1">
                                {categories.map((category, index) => {
                                    const CategoryIcon =
                                        category.icon ||
                                        resolveCategoryIcon(category.iconoCategoria);
                                    return (
                                        <TabsTrigger
                                            key={category.idCategoria ?? index}
                                            value={
                                                category.idCategoria?.toString() ?? '0'
                                            }
                                            disabled={isLoadingCategories}
                                            className="flex min-w-[calc(33.33%-4px)] flex-1 items-center space-x-1 px-2 py-1"
                                        >
                                            <CategoryIcon className="h-4 w-4 shrink-0" />
                                            <span className="text-sm">
                                                {category.nombreCategoria}
                                            </span>
                                        </TabsTrigger>
                                    );
                                })}
                            </TabsList>
                        </Tabs>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoadingProducts && (
                            <p className="py-4 text-center text-muted-foreground">
                                Cargando productos...
                            </p>
                        )}
                        {productError && (
                            <p className="py-4 text-center text-destructive">
                                {productError}
                            </p>
                        )}
                        {categoryError && (
                            <p className="py-2 text-center text-destructive">
                                {categoryError}
                            </p>
                        )}
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {filteredProducts.map((product) => (
                                <Card
                                    key={product.idProducto}
                                    className={`cursor-pointer transition-all hover:shadow-lg ${(product.stockActualProducto ?? 0) <= 0
                                            ? 'border-destructive/50'
                                            : ''
                                        }`}
                                    onClick={() => addToCart(product)}
                                >
                                    <CardHeader className="pb-2">
                                        <Badge
                                            variant="secondary"
                                            className="w-fit text-xs"
                                        >
                                            {product.codigoProducto}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="space-y-2 text-center">
                                        <CardTitle className="line-clamp-2 text-sm leading-tight">
                                            {product.nombreProducto}
                                        </CardTitle>
                                    </CardContent>
                                    <CardFooter className="flex flex-col space-y-2 pt-2">
                                        <div className="text-lg font-bold text-primary">
                                            ${formatCurrency(
                                                product.precioPos ??
                                                product.precioUnitario
                                            )}
                                        </div>
                                        <Badge
                                            variant={
                                                (product.stockActualProducto ?? 0) > 0
                                                    ? 'secondary'
                                                    : 'destructive'
                                            }
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
        </div>
    );
};

export default MainEstimate;
