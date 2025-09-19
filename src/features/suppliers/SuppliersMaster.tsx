import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Check, Pencil, Search, X, CircleX, Save, Trash, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { toast } from "sonner"
import { ITercero } from "@/types/ITercero";
import { TerceroService } from "@/services/TerceroService";
import { TipoDocumentoIdentidadService } from "@/services/TipoDocumentoIdentidadService";
import { ITipoDocumentoIdentidad } from "@/types/ITipoDocumentoIdentidad";
import { MunicipioService } from "@/services/MunicipioService";
import { IMunicipiosPorDepartamento } from "@/types/IMunicipio";
import { IResponsabilidadTercero } from "@/types/IResponsabilidadTercero";
import { ResponsabilidadFiscalService } from "@/services/ResponsabilidadFiscalService";
import { IResponsabilidadFiscal } from "@/types/IResponsabilidadFiscal";
import { DepartamentoService } from "@/services/DepartamentoService";
import { IDepartamento } from "@/types/IDepartamento";
import { ITipoRegimen } from "@/types/ITipoRegimen";
import { TipoRegimenService } from "@/services/TipoRegimenService";
import { IListaPrecio } from "@/types/IListaPrecio";
import { ListaPrecioService } from "@/services/ListaPrecioService";

export default function SuppliersMaster() {
    const navigate = useNavigate();
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
        idDepartamento: 0,
        nombreDepartamento: null,
        idMunicipio: 0,
        nombreMunicipio: null,
        terceroActivo: false,
        terceroCliente: false,
        terceroEmpleado: false,
        terceroProveedor: false,
        terceroGeneral: false,
        idTipoRegimen: 0,
        idListaPreciosTercero: 0,
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
    const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState<IMunicipiosPorDepartamento[]>([]);
    const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(true);
    const [municipioError, setMunicipioError] = useState<string | null>(null);
    const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
    const [isLoadingDepartamentos, setIsLoadingDepartamentos] = useState(true);
    const [departamentoError, setDepartamentoError] = useState<string | null>(null);
    const [responsabilidadesFiscales, setResponsabilidadesFiscales] = useState<IResponsabilidadFiscal[]>([]);
    const [isLoadingResponsabilidadFiscales, setIsLoadingResponsabilidadFiscales] = useState(true);
    const [responsabilidadFiscalError, setResponsabilidadFiscalError] = useState<string | null>(null);
    const [tiposRegimen, setTiposRegimen] = useState<ITipoRegimen[]>([]);
    const [isLoadingTiposRegimen, setIsLoadingTiposRegimen] = useState(true);
    const [tipoRegimenError, setTipoRegimenError] = useState<string | null>(null);
    const [listaPrecios, setListaPrecios] = useState<IListaPrecio[]>([]);
    const [isLoadingListaPrecios, setIsLoadingListaPrecios] = useState(true);
    const [listaPreciosError, setListaPreciosError] = useState<string | null>(null);
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
            idDepartamento: terc.idDepartamento,
            nombreDepartamento: terc.nombreDepartamento,
            terceroActivo: terc.terceroActivo,
            terceroCliente: terc.terceroCliente,
            terceroProveedor: terc.terceroProveedor,
            terceroEmpleado: terc.terceroEmpleado,
            terceroGeneral: terc.terceroGeneral,
            idTipoRegimen: terc.idTipoRegimen,
            idListaPreciosTercero: terc.idListaPreciosTercero,
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
                const result = await TerceroService.create(tercero);
                console.log("Tercero guardado:", result);
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
    const filteredResponsabilidades = (tercero.responsabilidadesTerceros || []);

    const handleNew = async () => {
        setTercero({
            idTercero: null,
            idTipoDocumentoId: 0,
            nombreTipoDocumentoId: "",
            digitoVerificacion: "",
            numeroIdentificacion: "",
            primerNombre: "",
            primerApellido: "",
            razonSocial: "",
            telefonoTercero: null,
            direccionTercero: "",
            emailTercero: "",
            idDepartamento: 0,
            nombreDepartamento: null,
            idMunicipio: 0,
            nombreMunicipio: null,
            terceroActivo: false,
            terceroCliente: false,
            terceroProveedor: false,
            terceroEmpleado: false,
            terceroGeneral: false,
            idTipoRegimen: 0,
            idListaPreciosTercero: 0,
            responsabilidadesTerceros: [],
        });
    };

    const handleDeleteTercero = async () => {
        // Verificar que hay un tercero seleccionado para eliminar
        if (!tercero.idTercero) {
            toast.error("No hay un tercero seleccionado para eliminar", {
                position: "top-center",
            });
            return;
        }

        // Confirmar la eliminación
        if (!window.confirm(`¿Está seguro que desea eliminar el tercero "${tercero.razonSocial}"?`)) {
            return;
        }

        try {
            await TerceroService.delete(tercero.idTercero);
            console.log("Tercero eliminado:", tercero.idTercero);
            toast.success("Tercero eliminado correctamente", {
                position: "top-center",
            });

            // Limpiar el formulario después de eliminar
            setTercero({
                idTercero: null,
                idTipoDocumentoId: 0,
                nombreTipoDocumentoId: "",
                digitoVerificacion: "",
                numeroIdentificacion: "",
                primerNombre: "",
                primerApellido: "",
                razonSocial: "",
                telefonoTercero: null,
                direccionTercero: "",
                emailTercero: "",
                idDepartamento: 0,
                nombreDepartamento: null,
                idMunicipio: 0,
                nombreMunicipio: null,
                terceroActivo: false,
                terceroCliente: false,
                terceroProveedor: false,
                terceroEmpleado: false,
                terceroGeneral: false,
                idTipoRegimen: 0,
                idListaPreciosTercero: 0,
                responsabilidadesTerceros: [],
            });
            setSelectedTercero(null);

            // Recargar la lista de terceros
            fetchSuppliers();
        } catch (error) {
            console.error('Error al eliminar el tercero:', error);
            toast.error("Error al eliminar el tercero", {
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
            setMunicipiosPorDepartamento(data);
        } catch (error) {
            console.error('Error:', error);
            setMunicipioError('Error al cargar los municipios');
            setMunicipiosPorDepartamento([]);
        } finally {
            setIsLoadingMunicipios(false);
        }
    };

    const fetchDepartamentos = async () => {
        try {
            setDepartamentoError(null);
            setIsLoadingDepartamentos(true);
            const data = await DepartamentoService.getAll();
            setDepartamentos([
                { idDepartamento: 0, codigoDepartamento: "0", nombreDepartamento: "Seleccione un departamento" },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setDepartamentoError('Error al cargar los departamentos');
            // Departamentos por defecto en caso de error
            setDepartamentos([
                { idDepartamento: 0, codigoDepartamento: "0", nombreDepartamento: "Seleccione un departamento" }
            ]);
        } finally {
            setIsLoadingDepartamentos(false);
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

    const fetchTiposRegimen = async () => {
        try {
            setTipoRegimenError(null);
            setIsLoadingTiposRegimen(true);
            const data = await TipoRegimenService.getAll();
            setTiposRegimen([
                { idTipoRegimen: 0, codigoTipoRegimen: "0", nombreTipoRegimen: "Seleccione un tipo de regimen", idTipoRegimenFe: null },
                ...data
            ]);
        } catch (error) {
            console.error('Error:', error);
            setTipoRegimenError('Error al cargar los tipos de regimen');
            // Tipos de regimen por defecto en caso de error
            setTiposRegimen([
                { idTipoRegimen: 0, codigoTipoRegimen: "0", nombreTipoRegimen: "Seleccione un tipo de regimen", idTipoRegimenFe: null }
            ]);
        } finally {
            setIsLoadingTiposRegimen(false);
        }
    };

    const fetchListaPrecios = async () => {
        try {
            setListaPreciosError(null);
            setIsLoadingListaPrecios(true);
            const data = await ListaPrecioService.getAll();
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
        fetchTipoDocumentoIdentidad();
        fetchDepartamentos();
        fetchMunicipios();
        fetchResponsabilidadesFiscales();
        fetchTiposRegimen();
        fetchListaPrecios();
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
                    <Button
                        variant="default"
                        size="icon"
                        title="Nuevo tercero"
                        onClick={() => handleNew()}
                        className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>


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
                    <Button
                        variant="default"
                        title="Guardar tercero"
                        onClick={handleSaveTercero}>
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                    </Button>
                    <Button
                        variant="default"
                        title="Eliminar tercero"
                        onClick={handleDeleteTercero}>
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
                        {formError && (!tercero.idTipoDocumentoId || tercero.idTipoDocumentoId === 0) && (
                            <span className="text-xs text-red-500">El tipo de documento es obligatorio.</span>
                        )}
                        {tipoError && (
                            <span className="text-xs text-red-500">{tipoError}</span>
                        )}
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
                        <label className="block text-xs text-muted-foreground mb-1">Digito de Verificación</label>
                        <Input
                            value={tercero.digitoVerificacion ?? ""}
                            onChange={e => setTercero({ ...tercero, digitoVerificacion: e.target.value })}
                            placeholder="DV"
                            readOnly
                            className={`w-20 ${!tercero.digitoVerificacion?.trim() && formError
                                ? "border border-red-500"
                                : ""
                                }`}
                        />
                    </div>
                    <div className="md:col-span-4 grid grid-cols-4 gap-4">
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
                    </div>
                    <div className="md:col-span-4 grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Departamento</label>
                            <select
                                className={
                                    (!tercero.idDepartamento || tercero.idDepartamento === 0) && formError
                                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                                }
                                value={tercero.idDepartamento}
                                onChange={e => {
                                    const newDepartamentoId = Number(e.target.value);
                                    setTercero({
                                        ...tercero,
                                        idDepartamento: newDepartamentoId,
                                        idMunicipio: 0 // Resetear municipio cuando cambia el departamento
                                    });
                                }}
                                required
                            >
                                {departamentos.map(cat => (
                                    <option key={cat.idDepartamento} value={cat.idDepartamento}>
                                        {cat.nombreDepartamento}
                                    </option>
                                ))}
                            </select>
                            {formError && (!tercero.idDepartamento || tercero.idDepartamento === 0) && (
                                <span className="text-xs text-red-500">El departamento es obligatorio.</span>
                            )}
                            {tipoError && (
                                <span className="text-xs text-red-500">{tipoError}</span>
                            )}
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
                                <option value={0}>Seleccione un municipio</option>
                                {municipiosPorDepartamento
                                    .find(dep => dep.idDepartamento === tercero.idDepartamento)
                                    ?.municipios.map(mun => (
                                        <option key={mun.idMunicipio} value={mun.idMunicipio}>
                                            {mun.nombreMunicipio}
                                        </option>
                                    ))}
                            </select>
                            {formError && (!tercero.idMunicipio || tercero.idMunicipio === 0) && (
                                <span className="text-xs text-red-500">El municipio es obligatorio.</span>
                            )}
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
                    </div>
                    <div className="md:col-span-4 grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Estado</label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={tercero.terceroActivo || false}
                                    onChange={e => setTercero({ ...tercero, terceroActivo: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {tercero.terceroActivo ? "Tercero activo" : "Tercero inactivo"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Es Cliente?</label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={tercero.terceroCliente || false}
                                    onChange={e => setTercero({ ...tercero, terceroCliente: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {tercero.terceroCliente ? "Si" : "No"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Es Proveedor?</label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={tercero.terceroProveedor || false}
                                    onChange={e => setTercero({ ...tercero, terceroProveedor: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {tercero.terceroProveedor ? "Si" : "No"}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Es General?</label>
                            <div className="flex items-center space-x-2 mt-2">
                                <input
                                    type="checkbox"
                                    checked={tercero.terceroGeneral || false}
                                    onChange={e => setTercero({ ...tercero, terceroGeneral: e.target.checked })}
                                    className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="text-sm text-muted-foreground">
                                    {tercero.terceroGeneral ? "Si" : "No"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-4 grid grid-cols-4 gap-4">
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Tipo Régimen</label>
                            <select
                                className={
                                    (!tercero.idTipoRegimen || tercero.idTipoRegimen === 0) && formError
                                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                                }
                                value={tercero.idTipoRegimen}
                                onChange={e => setTercero({ ...tercero, idTipoRegimen: Number(e.target.value) })}
                                required
                            >
                                {tiposRegimen.map(cat => (
                                    <option key={cat.idTipoRegimen} value={cat.idTipoRegimen}>
                                        {cat.nombreTipoRegimen}
                                    </option>
                                ))}
                            </select>
                            {formError && (!tercero.idTipoRegimen || tercero.idTipoRegimen === 0) && (
                                <span className="text-xs text-red-500">El tipo de régimen es obligatorio.</span>
                            )}
                            {tipoError && (
                                <span className="text-xs text-red-500">{tipoError}</span>
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-muted-foreground mb-1">Lista de Precios</label>
                            <select
                                className={
                                    (!tercero.idListaPreciosTercero || tercero.idListaPreciosTercero === 0) && formError
                                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                                }
                                value={tercero.idListaPreciosTercero}
                                onChange={e => setTercero({ ...tercero, idListaPreciosTercero: Number(e.target.value) })}
                                required
                            >
                                {listaPrecios.map(cat => (
                                    <option key={cat.idListaPrecio} value={cat.idListaPrecio}>
                                        {cat.nombreListaPrecio}
                                    </option>
                                ))}
                            </select>
                            {formError && (!tercero.idListaPreciosTercero || tercero.idListaPreciosTercero === 0) && (
                                <span className="text-xs text-red-500">La lista de precios es obligatoria.</span>
                            )}
                            {tipoError && (
                                <span className="text-xs text-red-500">{tipoError}</span>
                            )}
                        </div>
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
                                                        idResponsabilidadFiscal: selectedResponsabilidad ? selectedResponsabilidad.idResponsabilidadFiscal : 0,
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