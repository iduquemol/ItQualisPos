import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Pencil, Search, X, CircleX, Save, Trash } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";
import { toast } from "sonner"
import { ITercero } from "@/types/ITercero";
import { TerceroService } from "@/services/TerceroService";
import { TipoDocumentoIdentidadService } from "@/services/TipoDocumentoIdentidadService";
import { ITipoDocumentoIdentidad } from "@/types/ITipoDocumentoIdentidad";
import { MunicipioService } from "@/services/MunicipioService";
import { IMunicipio } from "@/types/IMunicipio";
import { IResponsabilidadTercero } from "@/types/IResponsabilidadTercero";
import { ResponsabilidadFiscalService } from "@/services/ResponsabilidadFiscalService";
import { IResponsabilidadFiscal } from "@/types/IResponsabilidadFiscal";

export default function SuppliersMaster() {
    const [search, setSearch] = useState("");
    // Estado para los campos iniciales del tercero
    const [tercero, setTercero] = useState<ITercero>({
        idTercero: null,
        idTipoDocumentoId: 0,
        nombreTipoDocumentoId: "",
        digitoVerificacion: "",
        numeroIdentificacion: "",
        primerNombre: "",
        primerApellido: "",
        razonSocial: "",
        telefonoTercero: 0,
        direccionTercero: "",
        emailTercero: "",
        idMunicipio: 0,
        nombreMunicipio: null,
        responsabilidadesTerceros: [],
    });

    // Estados para edición inline de responsabilidades
    const [editIdx, setEditIdx] = useState<number | null>(null);
    const [editResponsabilidad, setEditResponsabilidad] = useState<IResponsabilidadTercero>({
        idResponsabilidadTercero: 0,
        idResponsabilidadFiscal: 0,
        nombreResponsabilidadFiscal: "",
    });
    const [addMode, setAddMode] = useState(false);
    const [nuevaResponsabilidad, setNuevaResponsabilidad] = useState<IResponsabilidadTercero>({
        idResponsabilidadTercero: 0,
        idResponsabilidadFiscal: 0,
        nombreResponsabilidadFiscal: "",
    });
    const [suppliers, setSuppliers] = useState<ITercero[]>([]);
    const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true);
    const [supplierError, setSupplierError] = useState<string | null>(null);
    const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<ITipoDocumentoIdentidad[]>([]);
    const [isLoadingTipos, setIsLoadingTipos] = useState(true);
    const [tipoError, setTipoError] = useState<string | null>(null);
    const [municipios, setMunicipios] = useState<IMunicipio[]>([]);
    const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(true);
    const [municipioError, setMunicipioError] = useState<string | null>(null);
    const [responsabilidadesFiscales, setResponsabilidadesFiscales] = useState<IResponsabilidadFiscal[]>([]);
    const [isLoadingResponsabilidadFiscales, setIsLoadingResponsabilidadFiscales] = useState(true);
    const [responsabilidadFiscalError, setResponsabilidadFiscalError] = useState<string | null>(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTercero, setSelectedTercero] = useState<ITercero | null>(null);
    const [formError, setFormError] = useState<string | null>(null);


    const handleSelectTercero = (terc: ITercero) => {
        setSelectedTercero(terc);
        setTercero({
            ...terc,
            idTercero: terc.idTercero,
            idTipoDocumentoId: terc.idTipoDocumentoId,
            nombreTipoDocumentoId: terc.nombreTipoDocumentoId,
            digitoVerificacion: terc.digitoVerificacion,
            numeroIdentificacion: terc.numeroIdentificacion,
            primerNombre: terc.primerNombre,
            primerApellido: terc.primerApellido,
            razonSocial: terc.razonSocial,
            emailTercero: terc.emailTercero,
            telefonoTercero: terc.telefonoTercero,
            direccionTercero: terc.direccionTercero,
            idMunicipio: terc.idMunicipio,
            nombreMunicipio: terc.nombreMunicipio,
            responsabilidadesTerceros: terc.responsabilidadesTerceros || [],
        });
        setOpenDialog(false);
    };
    // Editar responsabilidad
    const handleEdit = (idx: number) => {
        const responsabilidad = tercero.responsabilidadesTerceros?.[idx];
        if (responsabilidad) {
            setEditIdx(idx);
            setEditResponsabilidad({ ...responsabilidad });
        }
    };

    // Guardar edición
    const handleSave = (idx: number) => {
        const nuevasResponsabilidades = [...(tercero.responsabilidadesTerceros || [])];
        nuevasResponsabilidades[idx] = { ...editResponsabilidad };
        setTercero({ ...tercero, responsabilidadesTerceros: nuevasResponsabilidades });
        setEditIdx(null);
    };

    // Cancelar edición
    const handleCancel = () => {
        setEditIdx(null);
    };

    const handleSaveTercero = async () => {
        // Validación de campos obligatorios
        if (!tercero.numeroIdentificacion?.trim()) {
            setFormError("El número de identificación es obligatorio.");
            return;
        }
        setFormError(null);
        try {
            if (tercero.idTercero) {
                // Actualizar tercero existente
                await TerceroService.update(tercero);
                console.log("Tercero actualizado:", tercero);
                toast.success("Tercero actualizado correctamente", {
                    position: "top-center",
                });
            } else {
                await TerceroService.create(tercero);
                console.log("Tercero guardado:", tercero);
                toast.success("Tercero guardado correctamente", {
                    position: "top-center",
                });
            }
            fetchSuppliers();
        } catch (error) {
            console.error('Error al guardar el tercero:', error);
        }
    };

    // Función para agregar la responsabilidad desde la fila inline
    const handleAddResponsabilidad = () => {
        // Validar que los campos no estén vacíos
        if (!nuevaResponsabilidad.idResponsabilidadFiscal || !nuevaResponsabilidad.nombreResponsabilidadFiscal) return;
        setTercero({
            ...tercero,
            responsabilidadesTerceros: [
                ...(tercero.responsabilidadesTerceros || []),
                {
                    ...nuevaResponsabilidad,
                    idResponsabilidadTercero: null, // Asignar null para que el backend lo maneje como nuevo
                },
            ],
        });
        setNuevaResponsabilidad({
            idResponsabilidadTercero: 0,
            idResponsabilidadFiscal: 0,
            nombreResponsabilidadFiscal: "",
        });
        setAddMode(false);
    };


    // Filtrado simple por concepto o descripción de responsabilidades
    const filteredResponsabilidades = (tercero.responsabilidadesTerceros || []).filter(
        (item) =>
            item.nombreResponsabilidadFiscal?.toLowerCase().includes(search.toLowerCase())
    );

    const handleDeleteTercero = async () => {
        // Verificar que hay un tercero seleccionado para eliminar
        if (!tercero.idTercero) {
            toast.error("No hay un tercero seleccionado para eliminar", {
                position: "top-center",
            });
            return;
        }

        // Confirmar la eliminación
        if (!window.confirm(`¿Está seguro de que desea eliminar el tercero "${tercero.nombreTercero}"?`)) {
            return;
        }

        try {
            //await TerceroService.delete(tercero.idTercero);
            console.log("Tercero eliminado:", tercero.idTercero);
            toast.success("Tercero eliminado correctamente", {
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

    const fetchSuppliers = async () => {
        try {
            setSupplierError(null);
            setIsLoadingSuppliers(true);
            const data = await TerceroService.getAll();
            setSuppliers(data);
        } catch (error) {
            console.error('Error:', error);
            setSupplierError('Error al cargar los terceros');
        } finally {
            setIsLoadingSuppliers(false);
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

    const fetchMunicipios = async () => {
        try {
            setMunicipioError(null);
            setIsLoadingMunicipios(true);
            const data = await MunicipioService.getAll();
            setMunicipios([
                { idMunicipio: 0, codigoMunicipio: "0", nombreMunicipio: "Seleccione un municipio", codigoDepartamento: "0", nombreDepartamento: "" },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setMunicipioError('Error al cargar los municipios');
            // Municipios por defecto en caso de error
            setMunicipios([
                { idMunicipio: 0, codigoMunicipio: "0", nombreMunicipio: "Seleccione un municipio", codigoDepartamento: "0", nombreDepartamento: "" }
            ]);
        } finally {
            setIsLoadingMunicipios(false);
        }
    };

    const fetchResponsabilidadesFiscales = async () => {
        try {
            setResponsabilidadFiscalError(null);
            setIsLoadingResponsabilidadFiscales(true);
            const data = await ResponsabilidadFiscalService.getAll();
            setResponsabilidadesFiscales([
                { idResponsabilidadFiscal: 0, codigoResponsabilidadFiscal: "0", nombreResponsabilidadFiscal: "Seleccione una responsabilidad fiscal" },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setResponsabilidadFiscalError('Error al cargar las responsabilidades fiscales');
            // Responsabilidades fiscales por defecto en caso de error
            setResponsabilidadesFiscales([
                { idResponsabilidadFiscal: 0, codigoResponsabilidadFiscal: "0", nombreResponsabilidadFiscal: "Seleccione una responsabilidad fiscal" }
            ]);
        } finally {
            setIsLoadingResponsabilidadFiscales(false);
        }
    };

    // Cargar data al iniciar el componente
    useEffect(() => {
        fetchTipoDocumentoIdentidad();
        fetchMunicipios();
        fetchResponsabilidadesFiscales();
        fetchSuppliers();
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
                    <h2 className="text-2xl font-bold">Maestro de Terceros</h2>
                    <p className="text-muted-foreground text-sm">Consulta y gestión de terceros</p>
                </div>
                <div className="flex gap-2">
                    {/* Dialog de búsqueda */}
                    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="icon" title="Buscar tercero">
                                <Search className="w-5 h-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                            <DialogHeader>
                                <DialogTitle>Buscar tercero</DialogTitle>
                            </DialogHeader>
                            {/* Input de búsqueda */}
                            <Input
                                className="mb-4"
                                placeholder="Buscar por número o nombre o apellido o razon social..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
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
                                        {suppliers
                                            .filter(
                                                supplier =>
                                                    supplier.numeroIdentificacion?.toLowerCase().includes(search.toLowerCase()) ||
                                                    supplier.razonSocial?.toLowerCase().includes(search.toLowerCase()) ||
                                                    supplier.primerNombre?.toLowerCase().includes(search.toLowerCase()) ||
                                                    supplier.primerApellido?.toLowerCase().includes(search.toLowerCase())
                                            )
                                            .map((supplier) => (
                                                <TableRow
                                                    key={supplier.idTercero}
                                                    className="cursor-pointer hover:bg-primary/10"
                                                    onClick={() => handleSelectTercero(supplier)}
                                                >
                                                    <TableCell>{supplier.numeroIdentificacion}</TableCell>
                                                    <TableCell>{supplier.primerNombre}</TableCell>
                                                    <TableCell>{supplier.primerApellido}</TableCell>
                                                    <TableCell>{supplier.razonSocial}</TableCell>
                                                </TableRow>
                                            ))}
                                    </TableBody>
                                </Table>
                                {isLoadingSuppliers && (
                                    <div className="text-center text-muted-foreground py-4">Cargando...</div>
                                )}
                                {supplierError && (
                                    <div className="text-center text-red-500 py-4">{supplierError}</div>
                                )}
                            </div>
                        </DialogContent>
                    </Dialog>
                    <Button variant="default" onClick={handleSaveTercero}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteTercero}>
                        <Trash className="w-4 h-4 mr-2" />
                        Eliminar
                    </Button>
                </div>
            </div>

            {/* Campos de terceros */}
            <Card className="mb-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Tipo de Documento</label>
                        <select
                            className={
                                (!tercero.idTipoDocumentoId || tercero.idTipoDocumentoId === 0) && formError
                                    ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                    : "w-full rounded border px-3 py-2 text-sm bg-background"
                            }
                            value={tercero.idTipoDocumentoId}
                            onChange={e => setTercero({ ...tercero, idTipoDocumentoId: Number(e.target.value) })}
                            required
                        >
                            {tiposDocumentoIdentidad.map(cat => (
                                <option key={cat.idTipoDocumentoId} value={cat.idTipoDocumentoId}>
                                    {cat.nombreTipoDocumentoId} ({cat.codigoTipoDocumentoId})
                                </option>
                            ))}
                        </select>
                        {/* {formError && (!tercero.idTipoDocumentoId || tercero.idTipoDocumentoId === 0) && (
                            <span className="text-xs text-red-500">El tipo de documento es obligatorio.</span>
                        )} */}
                        {tipoError && (
                            <span className="text-xs text-red-500">{tipoError}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Digito de Verificación</label>
                        <Input
                            value={tercero.digitoVerificacion ?? ""}
                            onChange={e => setTercero({ ...tercero, digitoVerificacion: e.target.value })}
                            placeholder="Dígito de verificación"
                            required
                            className={
                                !tercero.digitoVerificacion?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && !tercero.digitoVerificacion?.trim() && (
                            <span className="text-xs text-red-500">El dígito de verificación es obligatorio.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Número de Identificación</label>
                        <Input
                            value={tercero.numeroIdentificacion ?? ""}
                            onChange={e => setTercero({ ...tercero, numeroIdentificacion: e.target.value })}
                            placeholder="Número de identificación"
                            required
                            className={
                                !tercero.numeroIdentificacion?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {formError && !tercero.numeroIdentificacion?.trim() && (
                            <span className="text-xs text-red-500">El número de identificación es obligatorio.</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Primer Nombre</label>
                        <Input
                            value={tercero.primerNombre ?? ""}
                            onChange={e => setTercero({ ...tercero, primerNombre: e.target.value })}
                            placeholder="Primer nombre"
                            className={
                                !tercero.primerNombre?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.primerNombre?.trim()) && (
                            <span className="text-xs text-red-500">El primer nombre es obligatorio.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Primer Apellido</label>
                        <Input
                            value={tercero.primerApellido ?? ""}
                            onChange={e => setTercero({ ...tercero, primerApellido: e.target.value })}
                            placeholder="Primer apellido"
                            className={
                                !tercero.primerApellido?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.primerApellido?.trim()) && (
                            <span className="text-xs text-red-500">El primer apellido es obligatorio.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Razón Social</label>
                        <Input
                            value={tercero.razonSocial ?? ""}
                            onChange={e => setTercero({ ...tercero, razonSocial: e.target.value })}
                            placeholder="Razón social"
                            className={
                                !tercero.razonSocial?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.razonSocial?.trim()) && (
                            <span className="text-xs text-red-500">La razón social es obligatoria.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Dirección</label>
                        <Input
                            value={tercero.direccionTercero ?? ""}
                            onChange={e => setTercero({ ...tercero, direccionTercero: e.target.value })}
                            placeholder="Dirección"
                            className={
                                !tercero.direccionTercero?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.direccionTercero?.trim()) && (
                            <span className="text-xs text-red-500">La dirección es obligatoria.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Teléfono</label>
                        <Input
                            type="number"
                            value={tercero.telefonoTercero || ""}
                            onChange={e => setTercero({ ...tercero, telefonoTercero: Number(e.target.value) })}
                            placeholder="Teléfono"
                            className={
                                !tercero.telefonoTercero && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.telefonoTercero) && (
                            <span className="text-xs text-red-500">El teléfono es obligatorio.</span>
                        )} */}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Municipio</label>
                        <select
                            className={
                                (!tercero.idMunicipio || tercero.idMunicipio === 0) && formError
                                    ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                    : "w-full rounded border px-3 py-2 text-sm bg-background"
                            }
                            value={tercero.idMunicipio}
                            onChange={e => setTercero({ ...tercero, idMunicipio: Number(e.target.value) })}
                            required
                        >
                            {municipios.map(cat => (
                                <option key={cat.idMunicipio} value={cat.idMunicipio}>
                                    {cat.nombreMunicipio}
                                </option>
                            ))}
                        </select>
                        {/* {formError && (!tercero.idMunicipio || tercero.idMunicipio === 0) && (
                            <span className="text-xs text-red-500">El municipio es obligatorio.</span>
                        )} */}
                        {tipoError && (
                            <span className="text-xs text-red-500">{tipoError}</span>
                        )}
                    </div>
                    <div>
                        <label className="block text-xs text-muted-foreground mb-1">Email</label>
                        <Input
                            type="email"
                            value={tercero.emailTercero ?? ""}
                            onChange={e => setTercero({ ...tercero, emailTercero: e.target.value })}
                            placeholder="Email"
                            className={
                                !tercero.emailTercero?.trim() && formError
                                    ? "border border-red-500"
                                    : ""
                            }
                        />
                        {/* {formError && (!tercero.emailTercero?.trim()) && (
                            <span className="text-xs text-red-500">El email es obligatorio.</span>
                        )} */}
                    </div>
                </div>
            </Card>

            {/* Tabla de responsabilidades */}
            <Card className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-muted">
                            <th className="px-2 py-2 text-left font-semibold w-64">Código Responsabilidad</th>
                            <th className="px-4 py-2 text-left font-semibold w-96">Nombre Responsabilidad</th>
                            <th className="px-4 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResponsabilidades.map((item, idx) => (
                            <tr key={idx} className="border-b hover:bg-accent">
                                {editIdx === idx ? (
                                    <>
                                        <td className="px-4 py-2">
                                            <select
                                                className="w-full border rounded px-2 py-1"
                                                value={editResponsabilidad.idResponsabilidadFiscal || "0"}
                                                onChange={e => {
                                                    const selectedId = e.target.value;
                                                    const selectedResponsabilidad = responsabilidadesFiscales.find(t => String(t.idResponsabilidadFiscal) === selectedId);
                                                    setEditResponsabilidad({
                                                        ...editResponsabilidad,
                                                        idResponsabilidadFiscal: selectedResponsabilidad ? Number(selectedResponsabilidad.codigoResponsabilidadFiscal) : 0,
                                                        nombreResponsabilidadFiscal: selectedResponsabilidad ? selectedResponsabilidad.nombreResponsabilidadFiscal : "",
                                                    });
                                                }}
                                            >
                                                <option value="0">Seleccione la responsabilidad...</option>
                                                {responsabilidadesFiscales
                                                    .filter(t => t.idResponsabilidadFiscal !== 0)
                                                    .map(t => (
                                                        <option key={t.idResponsabilidadFiscal} value={t.idResponsabilidadFiscal}>
                                                            {t.nombreResponsabilidadFiscal} ({t.codigoResponsabilidadFiscal})
                                                        </option>
                                                    ))}
                                            </select>
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                className="w-full border rounded px-2 py-1"
                                                value={editResponsabilidad.nombreResponsabilidadFiscal}
                                                onChange={e => setEditResponsabilidad({ ...editResponsabilidad, nombreResponsabilidadFiscal: e.target.value })}
                                                disabled
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
                                        <td className="px-2 py-2">{item.idResponsabilidadFiscal}</td>
                                        <td className="px-4 py-2">{item.nombreResponsabilidadFiscal}</td>
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
                                        value={nuevaResponsabilidad.idResponsabilidadFiscal || "0"}
                                        onChange={e => {
                                            const selectedId = e.target.value;
                                            const selectedResponsabilidad = responsabilidadesFiscales.find(t => String(t.idResponsabilidadFiscal) === selectedId);
                                            setNuevaResponsabilidad({
                                                ...nuevaResponsabilidad,
                                                idResponsabilidadFiscal: selectedResponsabilidad ? selectedResponsabilidad.idResponsabilidadFiscal : 0,
                                                nombreResponsabilidadFiscal: selectedResponsabilidad ? selectedResponsabilidad.nombreResponsabilidadFiscal : "",
                                            });
                                        }}
                                    >
                                        <option value="0">Seleccione la responsabilidad fiscal...</option>
                                        {responsabilidadesFiscales
                                            .filter(t => t.idResponsabilidadFiscal !== 0)
                                            .map(t => (
                                                <option key={t.idResponsabilidadFiscal} value={t.idResponsabilidadFiscal}>
                                                    {t.nombreResponsabilidadFiscal} ({t.codigoResponsabilidadFiscal})
                                                </option>
                                            ))}
                                    </select>
                                </td>
                                <td className="px-4 py-2">
                                    <input
                                        className="w-full border rounded px-2 py-1"
                                        value={nuevaResponsabilidad.nombreResponsabilidadFiscal}
                                        onChange={e => setNuevaResponsabilidad({ ...nuevaResponsabilidad, nombreResponsabilidadFiscal: e.target.value })}
                                        placeholder="Nombre"
                                        disabled
                                    />
                                </td>
                                <td className="px-4 py-2 flex gap-2">
                                    <button
                                        className="text-green-600 font-semibold flex items-center"
                                        onClick={handleAddResponsabilidad}
                                        title="Guardar"
                                    >
                                        <Check className="w-6 h-6" />
                                    </button>
                                    <button
                                        className="text-red-600 font-semibold flex items-center"
                                        onClick={() => {
                                            setAddMode(false);
                                            setNuevaResponsabilidad({
                                                idResponsabilidadFiscal: 0,
                                                idResponsabilidadTercero: 0,
                                                nombreResponsabilidadFiscal: "",
                                            });
                                        }}
                                        title="Cancelar"
                                    >
                                        <CircleX className="w-6 h-6" /> {/* Icono más grande */}
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
                                        + Agregar responsabilidad
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </Card>

        </div>
    );
}