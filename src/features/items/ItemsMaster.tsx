import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Pencil, Search, X, CircleX, Trash, Save, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IProducto } from '@/types/IProducto';
import { ICategory } from '@/types/ICategoria';
import { Package } from "lucide-react";
import { CategoryService } from '@/services/CategoryService';
import { IUnidadDeMedida } from '@/types/IUnidadDeMedida';
import { UnidadDeMedidaService } from '@/services/UnidadDeMedidaService';
import { ITributoProducto } from "@/types/ITributoProducto";
import { ProductoService } from "@/services/ProductoService";
import { TributoService } from "@/services/TributoService";
import { ITributo } from "@/types/ITributo";
import { toast } from "sonner"
import { TipoProductoService } from "@/services/TipoProductoService";
import { ITipoProducto } from "@/types/ITipoProducto";
import { IPrecioProducto } from "@/types/IPrecioProducto";
import { IListaPrecio } from "@/types/IListaPrecio";
import { ListaPrecioService } from "@/services/ListaPrecioService";
import { ITerceroDefault } from "@/types/ITerceroDefault";
import { VentaService } from "@/services/VentaService";

export default function ItemsMaster() {
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    // Estado para los campos del producto
    const [producto, setProducto] = useState<IProducto>({
        idProducto: null,
        codigoProducto: "",
        nombreProducto: "",
        imagenProducto: "",
        codigoBarras: "",
        idCategoria: 0,
        idUnidadMedida: 0,
        precioUnitario: 0,
        stockActualProducto: 0,
        costoPromedioActualProducto: 0,
        quantity: 0,
        idTipoProducto: 0,
        productoActivo: true,
        porcentajeDescuento: 0,
        tributosProducto: [],
        preciosProducto: [],
    });
    const [categories, setCategories] = useState<ICategory[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState(true);
    const [categoryError, setCategoryError] = useState<string | null>(null);
    const [unidadesDeMedida, setUnidadesDeMedida] = useState<IUnidadDeMedida[]>([]);
    const [isLoadingUnidades, setIsLoadingUnidades] = useState(true);
    const [unidadError, setUnidadError] = useState<string | null>(null);
    const [tributos, setTributos] = useState<ITributo[]>([]);
    const [isLoadingTributos, setIsLoadingTributos] = useState(true);
    const [tributoError, setTributoError] = useState<string | null>(null);
    const [tiposProducto, setTiposProducto] = useState<ITipoProducto[]>([]);
    const [isLoadingTipos, setIsLoadingTipos] = useState(true);
    const [tipoError, setTipoError] = useState<string | null>(null);
    const [listaPrecios, setListaPrecios] = useState<IListaPrecio[]>([]);
    const [isLoadingListaPrecios, setIsLoadingListaPrecios] = useState(true);
    const [listaPreciosError, setListaPreciosError] = useState<string | null>(null);

    // Estados para edición inline de tributos
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editImpuesto, setEditImpuesto] = useState<ITributoProducto>({
        idTributo: "0",
        codigoTributo: "",
        nombreTributo: "",
        tarifa: 0,
        idTributoProducto: 0,
    });
    const [addMode, setAddMode] = useState(false);
    const [nuevoImpuesto, setNuevoImpuesto] = useState<ITributoProducto>({
        idTributo: "0",
        codigoTributo: "",
        nombreTributo: "",
        tarifa: 0,
        idTributoProducto: 0,
    });
    // Estados para edición inline de precios
    const [editPrecioIdx, setEditPrecioIdx] = useState<number | null>(null);
    const [editPrecio, setEditPrecio] = useState<IPrecioProducto>({
        idListaPrecio: 0,
        codigoListaPrecio: "",
        nombreListaPrecio: "",
        precio: 0,
        idPrecioProducto: 0,
    });
    const [addPrecioMode, setAddPrecioMode] = useState(false);
    const [nuevoPrecio, setNuevoPrecio] = useState<IPrecioProducto>({
        idListaPrecio: 0,
        codigoListaPrecio: "",
        nombreListaPrecio: "",
        precio: 0,
        idPrecioProducto: 0,
    });
    const [products, setProducts] = useState<IProducto[]>([]);
    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [productError, setProductError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProducto | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const precioUnitarioRef = useRef<HTMLInputElement>(null);

    const handleSelectProduct = (prod: IProducto) => {
        setSelectedProduct(prod);
        setProducto({
            ...producto,
            idProducto: prod.idProducto,
            codigoProducto: prod.codigoProducto,
            nombreProducto: prod.nombreProducto,
            codigoBarras: prod.codigoBarras,
            idCategoria: prod.idCategoria,
            idUnidadMedida: prod.idUnidadMedida,
            precioUnitario: prod.precioUnitario,
            idTipoProducto: prod.idTipoProducto,
            productoActivo: prod.productoActivo,
            porcentajeDescuento: prod.porcentajeDescuento || 0,
            tributosProducto: prod.tributosProducto || [],
            preciosProducto: prod.preciosProducto || [],
        });
        setOpenDialog(false);
    };

    const handleNew = async () => {
        setSelectedProduct(null);
        setProducto({
            idProducto: 0,
            codigoProducto: "",
            nombreProducto: "",
            codigoBarras: "",
            idCategoria: 0,
            idUnidadMedida: 0,
            precioUnitario: 0,
            idTipoProducto: 0,
            productoActivo: true,
            porcentajeDescuento: 0,
            imagenProducto: "",
            precioPos: 0,
            porcentajeIva: 0,
            quantity: 0,
            tributosProducto: [],
            preciosProducto: [],
        });
    };
    // Editar tributo
    const handleEdit = (idx: number) => {
        const tributo = producto.tributosProducto?.[idx];
        if (tributo) {
            setEditIdx(idx);
            setEditImpuesto({ ...tributo });
        }
    };

    // Editar precio
    const handleEditPrecio = (idx: number) => {
        const precio = producto.preciosProducto?.[idx];
        if (precio) {
            setEditPrecioIdx(idx);
            setEditPrecio({ ...precio });
        }
    };

    // Guardar edición tributos
    const handleSave = (idx: number) => {
        const nuevosTributos = [...(producto.tributosProducto || [])];
        nuevosTributos[idx] = { ...editImpuesto };
        setProducto({ ...producto, tributosProducto: nuevosTributos });
        setEditIdx(null);
    };

    // Guardar edición de precio
    const handleSavePrecio = (idx: number) => {
        const nuevosPrecios = [...(producto.preciosProducto || [])];
        nuevosPrecios[idx] = { ...editPrecio };
        setProducto({ ...producto, preciosProducto: nuevosPrecios });
        setEditPrecioIdx(null);
    };

    // Cancelar edición de tributos
    const handleCancel = () => {
        setEditIdx(null);
    };

    // Cancelar edición de precios
    const handleCancelPrecio = () => {
        setEditPrecioIdx(null);
    };

    const handleSaveProduct = async () => {
        // Validación de campos obligatorios
        if (
            !producto.codigoProducto.trim() ||
            !producto.nombreProducto.trim() ||
            !producto.idCategoria ||
            !producto.idUnidadMedida
        ) {
            setFormError("Los campos Código, Nombre, Categoría y Unidad de Medida son obligatorios.");
            return;
        }
        setFormError(null);
        try {
            if (producto.idProducto) {
                // Actualizar producto existente
                await ProductoService.update(producto);
                console.log("Producto actualizado:", producto);
                toast.success("Producto actualizado correctamente", {
                    position: "top-center",
                });
            } else {
                await ProductoService.create(producto);
                console.log("Producto guardado:", producto);
                toast.success("Producto guardado correctamente", {
                    position: "top-center",
                });
            }
            fetchProducts();
        } catch (error) {
            console.error('Error al guardar el producto:', error);
        }
    };

    const handleDeleteProduct = async () => {
        // Verificar que hay un producto seleccionado para eliminar
        if (!producto.idProducto) {
            toast.error("No hay un producto seleccionado para eliminar", {
                position: "top-center",
            });
            return;
        }

        // Confirmar la eliminación
        if (!window.confirm(`¿Está seguro de que desea eliminar el producto "${producto.nombreProducto}"?`)) {
            return;
        }

        try {
            //await ProductoService.delete(producto.idProducto);
            console.log("Producto eliminado:", producto.idProducto);
            toast.success("Producto eliminado correctamente", {
                position: "top-center",
            });

            // Limpiar el formulario después de eliminar
            setProducto({
                idProducto: null,
                codigoProducto: "",
                nombreProducto: "",
                imagenProducto: "",
                codigoBarras: "",
                idCategoria: 0,
                idUnidadMedida: 0,
                precioUnitario: 0,
                stockActualProducto: 0,
                costoPromedioActualProducto: 0,
                quantity: 0,
                idTipoProducto: 0,
                productoActivo: true,
                porcentajeDescuento: 0,
                preciosProducto: [],
                tributosProducto: [],
            });
            setSelectedProduct(null);

            // Recargar la lista de productos
            fetchProducts();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            toast.error("Error al eliminar el producto", {
                position: "top-center",
            });
        }
    };

    // Función para agregar el impuesto desde la fila inline
    const handleAddImpuesto = () => {
        // Validar que los campos no estén vacíos
        if (!nuevoImpuesto.idTributo || !nuevoImpuesto.nombreTributo || !nuevoImpuesto.tarifa) return;
        setProducto({
            ...producto,
            tributosProducto: [
                ...(producto.tributosProducto || []),
                {
                    ...nuevoImpuesto,
                    idTributoProducto: null, // Asignar null para que el backend lo maneje como nuevo                        
                },
            ],
        });
        setNuevoImpuesto({
            idTributo: "0",
            codigoTributo: "",
            nombreTributo: "",
            tarifa: 0,
            idTributoProducto: null,
        });
        setAddMode(false);
    };

    // Función para agregar el precio desde la fila inline
    const handleAddPrecio = () => {
        // Validar que los campos no estén vacíos
        if (!nuevoPrecio.nombreListaPrecio || !nuevoPrecio.precio) return;

        setProducto({
            ...producto,
            preciosProducto: [
                ...(producto.preciosProducto || []),
                {
                    ...nuevoPrecio,
                    idPrecioProducto: null, // Asignar null para que el backend lo maneje como nuevo
                },
            ],
        });
        setNuevoPrecio({
            idPrecioProducto: 0,
            idListaPrecio: 0,
            codigoListaPrecio: "",
            nombreListaPrecio: "",
            precio: 0,
        });
        setAddPrecioMode(false);
    };

    // Filtrado simple por concepto o descripción de tributos
    const filteredTributos = (producto.tributosProducto || []).filter(
        (item) =>
            item.idTributo.toLowerCase().includes(search.toLowerCase()) ||
            item.nombreTributo.toLowerCase().includes(search.toLowerCase())
    );

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

    const fetchCategories = async () => {
        try {
            setCategoryError(null);
            setIsLoadingCategories(true);
            const data = await CategoryService.getAll();
            setCategories([
                { idCategoria: 0, nombreCategoria: "Seleccione una categoría", iconCategoria: "🏪", codigoCategoria: "0" }, // Categoría por defecto
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setCategoryError('Error al cargar las categorías');
            // Categorías por defecto en caso de error
            setCategories([
                { idCategoria: 0, nombreCategoria: "Seleccione una categoría", iconCategoria: "🏪", codigoCategoria: "0" },
            ]);
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const fetchUnidadesDeMedida = async () => {
        try {
            setUnidadError(null);
            setIsLoadingUnidades(true);
            const data = await UnidadDeMedidaService.getAll();
            setUnidadesDeMedida([
                { idUnidadMedida: 0, codigoUnidadMedida: "0", nombreUnidadMedida: "Seleccione una unidad de medida", fechaGrabacionUnidadMedida: null },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setUnidadError('Error al cargar las unidades de medida');
            // Unidades por defecto en caso de error
            setUnidadesDeMedida([
                { idUnidadMedida: 0, codigoUnidadMedida: "0", nombreUnidadMedida: "Seleccione una unidad de medida", fechaGrabacionUnidadMedida: null }
            ]);
        } finally {
            setIsLoadingUnidades(false);
        }
    };

    const fetchTipoProducto = async () => {
        try {
            setTiposProducto([]);
            setIsLoadingTipos(true);
            const data = await TipoProductoService.getAll();
            setTiposProducto([
                { idTipoProducto: 0, codigoTipoProducto: "0", nombreTipoProducto: "Seleccione un tipo de producto", manejaInventario: null },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setTipoError('Error al cargar los tipos de producto');
            // Tipos de producto por defecto en caso de error
            setTiposProducto([
                { idTipoProducto: 0, codigoTipoProducto: "0", nombreTipoProducto: "Seleccione un tipo de producto", manejaInventario: null }
            ]);
        } finally {
            setIsLoadingTipos(false);
        }
    };

    const fetchTributos = async () => {
        try {
            setTributoError(null);
            setIsLoadingTributos(true);
            const data = await TributoService.getAll();
            setTributos([
                { idTributo: 0, codigoTributo: "0", nombreTributo: "Seleccione un tributo", descripcionTributo: "" },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setTributoError('Error al cargar los tributos');
            // Tributos por defecto en caso de error
            setTributos([
                { idTributo: 0, codigoTributo: "0", nombreTributo: "Seleccione un tributo", descripcionTributo: "" }
            ]);
        } finally {
            setIsLoadingTributos(false);
        }
    };

    const fetchListasPrecios = async () => {
        try {
            setListaPrecios([]);
            setIsLoadingListaPrecios(true);
            const data = await ListaPrecioService.getAll();
            console.log('Listas de precios cargadas:', data);
            setListaPrecios([
                { idListaPrecio: 0, codigoListaPrecio: "0", nombreListaPrecio: "Seleccione una lista de precios" },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setListaPreciosError('Error al cargar las listas de precios');
            // Listas de precios por defecto en caso de error
            setListaPrecios([
                { idListaPrecio: 0, codigoListaPrecio: "0", nombreListaPrecio: "Seleccione una lista de precios" }
            ]);
        } finally {
            setIsLoadingListaPrecios(false);
        }
    };

    // Cargar data al iniciar el componente
    useEffect(() => {
        fetchCategories();
        fetchUnidadesDeMedida();
        fetchProducts();
        fetchTributos();
        fetchTipoProducto();
        fetchListasPrecios();

    }, []);

    return (
        <div className="p-6 bg-muted min-h-screen">
            {/* Logo y título principal */}
            <div className="flex items-center space-x-4 mb-8">
                <div className="bg-primary p-3 rounded-lg">
                    <Package className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold">Astil</h1>
                    <p className="text-sm text-muted-foreground">Sistema de Punto de Venta</p>
                </div>
            </div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Catálogo de Productos</h2>
                    <p className="text-muted-foreground text-sm">Consulta y gestión de productos</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="default"
                        size="icon"
                        title="Nuevo producto"
                        onClick={() => handleNew()}
                        className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                    {/* Dialog de búsqueda */}
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="Buscar producto">
                                <Search className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Buscar producto</DialogTitle>
                            </DialogHeader>
                            {/* Input de búsqueda */}
                            <Input
                                className="mb-4"
                                placeholder="Buscar por código o descripción..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                            <div className="overflow-x-auto max-h-[400px]">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Código</TableHead>
                                            <TableHead>Descripción</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {products
                                            .filter(
                                                prod =>
                                                    prod.codigoProducto.toLowerCase().includes(search.toLowerCase()) ||
                                                    prod.nombreProducto.toLowerCase().includes(search.toLowerCase())
                                            )
                                            .map((prod) => (
                                                <TableRow
                                                    key={prod.idProducto}
                                                    className="cursor-pointer hover:bg-primary/10"
                                                    onClick={() => handleSelectProduct(prod)}
                                                >
                                                    <TableCell>{prod.codigoProducto}</TableCell>
                                                    <TableCell>{prod.nombreProducto}</TableCell>
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
                    <Button variant="default"
                        title="Guardar producto"
                        onClick={handleSaveProduct}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                    </Button>
                    <Button
                        variant="default"
                        title="Eliminar producto"
                        onClick={handleDeleteProduct}
                    >
                        <Trash className="w-4 h-4 mr-2" />
                        Eliminar
                    </Button>
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

            {/* Campos de producto */}
            <Card className="mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Código</label>
                        <Input
                            value={producto.codigoProducto}
                            onChange={e => {
                                const newValue = e.target.value;
                                // Si había un ID y el código realmente cambió, limpiar todo el producto
                                if (producto.idProducto && newValue !== producto.codigoProducto) {
                                    setProducto({
                                        idProducto: null,
                                        codigoProducto: newValue,
                                        nombreProducto: "",
                                        imagenProducto: "",
                                        codigoBarras: "",
                                        idCategoria: 0,
                                        idUnidadMedida: 0,
                                        precioUnitario: 0,                                     
                                        quantity: 0,
                                        precioPos: 0,
                                        idTipoProducto: 0,
                                        productoActivo: false,
                                        porcentajeDescuento: 0,
                                        preciosProducto: [],
                                        tributosProducto: [],
                                    });
                                    // También limpiar el producto seleccionado
                                    setSelectedProduct(null);
                                } else {
                                    // Si no hay cambio significativo, solo actualizar el código
                                    setProducto({
                                        ...producto,
                                        codigoProducto: newValue
                                    });
                                }
                            }}
                            placeholder="Código del producto"
                            required
                            className={
                                !producto.codigoProducto.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {formError && !producto.codigoProducto.trim() && (
                            <span className="text-xs text-red-500">El código del producto es obligatorio.</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Nombre</label>
                        <Input
                            value={producto.nombreProducto}
                            onChange={e => setProducto({ ...producto, nombreProducto: e.target.value })}
                            placeholder="Nombre del producto"
                            required
                            className={
                                !producto.nombreProducto.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {formError && !producto.nombreProducto.trim() && (
                            <span className="text-xs text-red-500">El nombre del producto es obligatorio.</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Código de Barras</label>
                        <Input
                            value={producto.codigoBarras ?? ""}
                            onChange={e => setProducto({ ...producto, codigoBarras: e.target.value })}
                            placeholder="Código de barras"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Categoría</label>
                        <select
                            className={
                                (!producto.idCategoria || producto.idCategoria === 0) && formError
                                    ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                    : "w-full rounded border px-3 py-2 text-sm bg-background"
                            }
                            value={producto.idCategoria}
                            onChange={e => setProducto({ ...producto, idCategoria: Number(e.target.value) })}
                            required
                        >
                            {categories.map(cat => (
                                <option key={cat.idCategoria} value={cat.idCategoria}>
                                    {cat.iconCategoria} {cat.nombreCategoria}
                                </option>
                            ))}
                        </select>
                        {formError && (!producto.idCategoria || producto.idCategoria === 0) && (
                            <span className="text-xs text-red-500">La categoría es obligatoria.</span>
                        )}
                        {categoryError && (
                            <span className="text-xs text-red-500">{categoryError}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Unidad de Medida</label>
                        <select
                            className={
                                (!producto.idUnidadMedida || producto.idUnidadMedida === 0) && formError
                                    ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                    : "w-full rounded border px-3 py-2 text-sm bg-background"
                            }
                            value={producto.idUnidadMedida}
                            onChange={e => setProducto({ ...producto, idUnidadMedida: Number(e.target.value) })}
                            required
                        >
                            {unidadesDeMedida.map(unidad => (
                                <option key={unidad.idUnidadMedida} value={unidad.idUnidadMedida}>
                                    {unidad.nombreUnidadMedida}
                                </option>
                            ))}
                        </select>
                        {formError && (!producto.idUnidadMedida || producto.idUnidadMedida === 0) && (
                            <span className="text-xs text-red-500">La unidad de medida es obligatoria.</span>
                        )}
                        {unidadError && (
                            <span className="text-xs text-red-500">{unidadError}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Precio Unitario</label>
                        <Input
                            type="number"
                            value={producto.precioUnitario ?? ""}
                            onChange={e => setProducto({ ...producto, precioUnitario: Number(e.target.value) })}
                            placeholder="Precio unitario"
                            ref={precioUnitarioRef}
                            onFocus={e => e.target.select()}
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Stock Actual</label>
                        <Input
                            type="number"
                            value={producto.stockActualProducto ?? ""}
                            onChange={e => setProducto({ ...producto, stockActualProducto: Number(e.target.value) })}
                            placeholder="Stock actual"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Costo Promedio</label>
                        <Input
                            type="number"
                            value={producto.costoPromedioActualProducto ?? ""}
                            onChange={e => setProducto({ ...producto, costoPromedioActualProducto: Number(e.target.value) })}
                            placeholder="Costo promedio"
                            disabled
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tipo Producto</label>
                        <select
                            className={
                                (!producto.idTipoProducto || producto.idTipoProducto === 0) && formError
                                    ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                    : "w-full rounded border px-3 py-2 text-sm bg-background"
                            }
                            value={producto.idTipoProducto}
                            onChange={e => setProducto({ ...producto, idTipoProducto: Number(e.target.value) })}
                            required
                        >
                            {tiposProducto.map(cat => (
                                <option key={cat.idTipoProducto} value={cat.idTipoProducto}>
                                    {cat.nombreTipoProducto}
                                </option>
                            ))}
                        </select>
                        {formError && (!producto.idTipoProducto || producto.idTipoProducto === 0) && (
                            <span className="text-xs text-red-500">El tipo de producto es obligatorio.</span>
                        )}
                        {tipoError && (
                            <span className="text-xs text-red-500">{tipoError}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Estado</label>
                        <div className="flex items-center space-x-2 mt-2">
                            <input
                                type="checkbox"
                                checked={producto.productoActivo || false}
                                onChange={e => setProducto({ ...producto, productoActivo: e.target.checked })}
                                className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                            />
                            <span className="text-sm text-muted-foreground">
                                {producto.productoActivo ? "Producto activo" : "Producto inactivo"}
                            </span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Porcentaje Máximo Descuento</label>
                        <Input
                            type="number"
                            value={producto.porcentajeDescuento ?? ""}
                            onChange={e => setProducto({ ...producto, porcentajeDescuento: Number(e.target.value) })}
                            placeholder="Porcentaje máximo descuento"
                        />
                    </div>
                </div>
                {/* {formError && (
                    <div className="text-red-600 text-sm mt-2">{formError}</div>
                )} */}
            </Card>

            {/* Tabla de impuestos */}
            <Tabs defaultValue="impuestos" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="impuestos">Impuestos</TabsTrigger>
                    <TabsTrigger value="precios">Precios</TabsTrigger>
                </TabsList>

                <TabsContent value="impuestos" className="mt-4">
                    <Card className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="px-2 py-2 text-left font-semibold w-64">Código Impuesto</th>
                                    <th className="px-4 py-2 text-left font-semibold w-96">Nombre</th>
                                    <th className="px-4 py-2 text-left font-semibold w-32">Valor</th>
                                    <th className="px-4 py-2"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTributos.map((item, idx) => (
                                    <tr key={idx} className="border-b hover:bg-accent">
                                        {editIdx === idx ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <select
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editImpuesto.codigoTributo || "0"}
                                                        onChange={e => {
                                                            const selectedId = e.target.value;
                                                            const selectedTributo = tributos.find(t => String(t.codigoTributo) === selectedId);
                                                            setEditImpuesto({
                                                                ...editImpuesto,
                                                                idTributo: selectedTributo ? selectedTributo.idTributo.toString() : "0",
                                                                codigoTributo: selectedTributo ? selectedTributo.codigoTributo : "",
                                                                nombreTributo: selectedTributo ? selectedTributo.nombreTributo : "",
                                                            });
                                                        }}
                                                    >
                                                        <option value="0">Seleccione el impuesto...</option>
                                                        {tributos
                                                            .filter(t => t.idTributo !== 0)
                                                            .map(t => (
                                                                <option key={t.idTributo} value={t.idTributo}>
                                                                    {t.nombreTributo} ({t.codigoTributo})
                                                                </option>
                                                            ))}
                                                    </select>
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editImpuesto.nombreTributo}
                                                        onChange={e => setEditImpuesto({ ...editImpuesto, nombreTributo: e.target.value })}
                                                        disabled
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editImpuesto.tarifa}
                                                        onChange={e => setEditImpuesto({ ...editImpuesto, tarifa: Number(e.target.value) })}
                                                    />
                                                </td>
                                                <td className="px-4 py-2 flex gap-2">
                                                    <button
                                                        className="text-green-600 font-semibold flex items-center"
                                                        onClick={() => handleSave(idx)}
                                                        title="Guardar"
                                                    >
                                                        <Check className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 font-semibold flex items-center"
                                                        onClick={handleCancel}
                                                        title="Cancelar"
                                                    >
                                                        <CircleX className="w-6 h-6" />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-2 py-2">{item.codigoTributo}</td>
                                                <td className="px-4 py-2">{item.nombreTributo}</td>
                                                <td className="px-4 py-2">{item.tarifa}</td>
                                                <td className="px-4 py-2">
                                                    <button
                                                        className="text-blue-600 font-semibold flex items-center"
                                                        onClick={() => handleEdit(idx)}
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {/* Fila para agregar un nuevo impuesto inline */}
                                {addMode ? (
                                    <tr className="border-b bg-accent/40">
                                        <td className="px-2 py-2">
                                            <select
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoImpuesto.codigoTributo || "0"}
                                                onChange={e => {
                                                    const selectedId = e.target.value;
                                                    const selectedTributo = tributos.find(t => String(t.codigoTributo) === selectedId);
                                                    setNuevoImpuesto({
                                                        ...nuevoImpuesto,
                                                        idTributo: selectedTributo ? selectedTributo.idTributo.toString() : "0",
                                                        nombreTributo: selectedTributo ? selectedTributo.nombreTributo : "",
                                                        codigoTributo: selectedTributo ? selectedTributo.codigoTributo : "",
                                                    });
                                                }}
                                            >
                                                <option value="0">Seleccione el impuesto...</option>
                                                {tributos
                                                    .filter(t => t.idTributo !== 0)
                                                    .map(t => (
                                                        <option key={t.codigoTributo} value={t.codigoTributo}>
                                                            {t.nombreTributo} ({t.codigoTributo})
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoImpuesto.nombreTributo}
                                                onChange={e => setNuevoImpuesto({ ...nuevoImpuesto, nombreTributo: e.target.value })}
                                                placeholder="Nombre"
                                                disabled
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoImpuesto.tarifa || ""}
                                                onChange={e => setNuevoImpuesto({ ...nuevoImpuesto, tarifa: Number(e.target.value) })}
                                                placeholder="Valor"
                                            />
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button
                                                className="text-green-600 font-semibold flex items-center"
                                                onClick={handleAddImpuesto}
                                                title="Guardar"
                                            >
                                                <Check className="w-6 h-6" />
                                            </button>
                                            <button
                                                className="text-red-600 font-semibold flex items-center"
                                                onClick={() => {
                                                    setAddMode(false);
                                                    setNuevoImpuesto({
                                                        idTributoProducto: 0,
                                                        idTributo: "0",
                                                        codigoTributo: "",
                                                        nombreTributo: "",
                                                        tarifa: 0,
                                                    });
                                                }}
                                                title="Cancelar"
                                            >
                                                <CircleX className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="px-0 py-2">
                                            <button
                                                className="bg-black text-white font-semibold px-4 py-2 rounded text-left"
                                                onClick={() => setAddMode(true)}
                                            >
                                                + Agregar impuesto
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

                <TabsContent value="precios" className="mt-4">
                    <Card className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-muted">
                                    <th className="px-2 py-2 text-left font-semibold w-64">Código Lista de Precios</th>
                                    <th className="px-4 py-2 text-left font-semibold w-96">Nombre</th>
                                    <th className="px-4 py-2 text-left font-semibold w-32">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(producto.preciosProducto || []).map((precio, idx) => (
                                    <tr key={idx} className="border-b hover:bg-accent">
                                        {editPrecioIdx === idx ? (
                                            <>
                                                <td className="px-4 py-2">
                                                    <select
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editPrecio.codigoListaPrecio || "0"}
                                                        onChange={e => {
                                                            const selectedId = e.target.value;
                                                            const selectedPrecio = listaPrecios.find(t => String(t.codigoListaPrecio) === selectedId);
                                                            setEditPrecio({
                                                                ...editPrecio,
                                                                idListaPrecio: selectedPrecio ? selectedPrecio.idListaPrecio : 0,
                                                                codigoListaPrecio: selectedPrecio ? selectedPrecio.codigoListaPrecio : "",
                                                                nombreListaPrecio: selectedPrecio ? selectedPrecio.nombreListaPrecio : "",
                                                            });
                                                        }}
                                                    >
                                                        <option value="0">Seleccione el precio...</option>
                                                        {listaPrecios
                                                            .filter(t => t.idListaPrecio !== 0)
                                                            .map(t => (
                                                                <option key={t.idListaPrecio} value={t.idListaPrecio}>
                                                                    {t.nombreListaPrecio} ({t.codigoListaPrecio})
                                                                </option>
                                                            ))}
                                                    </select>
                                                </td>
                                                <td className="px-2 py-2">
                                                    <input
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editPrecio.nombreListaPrecio}
                                                        onChange={e => setEditPrecio({ ...editPrecio, nombreListaPrecio: e.target.value })}
                                                        placeholder="Nombre del precio"
                                                    />
                                                </td>
                                                <td className="px-4 py-2">
                                                    <input
                                                        type="number"
                                                        className="w-full border rounded px-2 py-1"
                                                        value={editPrecio.precio}
                                                        onChange={e => setEditPrecio({ ...editPrecio, precio: Number(e.target.value) })}
                                                        placeholder="Valor"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 flex gap-2">
                                                    <button
                                                        className="text-green-600 font-semibold flex items-center"
                                                        onClick={() => handleSavePrecio(idx)}
                                                        title="Guardar"
                                                    >
                                                        <Check className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        className="text-red-600 font-semibold flex items-center"
                                                        onClick={handleCancelPrecio}
                                                        title="Cancelar"
                                                    >
                                                        <CircleX className="w-6 h-6" />
                                                    </button>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                <td className="px-2 py-2">{precio.codigoListaPrecio}</td>
                                                <td className="px-4 py-2">${precio.nombreListaPrecio}</td>
                                                <td className="px-4 py-2">{precio.precio}</td>
                                                <td className="px-4 py-2 flex gap-2">
                                                    <button
                                                        className="text-blue-600 font-semibold flex items-center"
                                                        onClick={() => handleEditPrecio(idx)}
                                                        title="Editar"
                                                    >
                                                        <Pencil className="w-4 h-4" />
                                                    </button>

                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))}
                                {/* Fila para agregar un nuevo precio inline */}
                                {addPrecioMode ? (
                                    <tr className="border-b bg-accent/40">
                                        <td className="px-2 py-2">
                                            <select
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoPrecio.codigoListaPrecio || "0"}
                                                onChange={e => {
                                                    const selectedId = e.target.value;
                                                    const selectedPrecio = listaPrecios.find(t => String(t.codigoListaPrecio) === selectedId);
                                                    setNuevoPrecio({
                                                        ...nuevoPrecio,
                                                        idListaPrecio: selectedPrecio ? selectedPrecio.idListaPrecio : 0,
                                                        nombreListaPrecio: selectedPrecio ? selectedPrecio.nombreListaPrecio : "",
                                                        codigoListaPrecio: selectedPrecio ? selectedPrecio.codigoListaPrecio : "",
                                                    });
                                                }}
                                            >
                                                <option value="0">Seleccione la lista de precios...</option>
                                                {listaPrecios
                                                    .filter(t => t.idListaPrecio !== 0)
                                                    .map(t => (
                                                        <option key={t.codigoListaPrecio} value={t.codigoListaPrecio}>
                                                            {t.nombreListaPrecio} ({t.codigoListaPrecio})
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoPrecio.nombreListaPrecio || ""}
                                                onChange={e => setNuevoPrecio({ ...nuevoPrecio, nombreListaPrecio: e.target.value })}
                                                placeholder="Nombre del precio"
                                                disabled
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                className="w-full border rounded px-2 py-1"
                                                value={nuevoPrecio.precio}
                                                onChange={e => setNuevoPrecio({ ...nuevoPrecio, precio: Number(e.target.value) })}
                                            />
                                        </td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button
                                                className="text-green-600 font-semibold flex items-center"
                                                onClick={handleAddPrecio}
                                                title="Guardar"
                                            >
                                                <Check className="w-6 h-6" />
                                            </button>
                                            <button
                                                className="text-red-600 font-semibold flex items-center"
                                                onClick={() => {
                                                    setAddPrecioMode(false);
                                                    setNuevoPrecio({
                                                        idPrecioProducto: 0,
                                                        codigoListaPrecio: "",
                                                        nombreListaPrecio: "",
                                                        precio: 0,
                                                        idListaPrecio: null,
                                                    });
                                                }}
                                                title="Cancelar"
                                            >
                                                <CircleX className="w-6 h-6" />
                                            </button>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-0 py-2">
                                            <button
                                                className="bg-black text-white font-semibold px-4 py-2 rounded text-left"
                                                onClick={() => setAddPrecioMode(true)}
                                            >
                                                + Agregar precio
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </Card>
                </TabsContent>

            </Tabs>

        </div>
    );
}