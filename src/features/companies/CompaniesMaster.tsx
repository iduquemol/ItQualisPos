import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  Pencil,
  Search,
  X,
  CircleX,
  Save,
  Trash,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { toast } from "sonner";
import { TipoDocumentoIdentidadService } from "@/services/TipoDocumentoIdentidadService";
import { ITipoDocumentoIdentidad } from "@/types/ITipoDocumentoIdentidad";
import { MunicipioService } from "@/services/MunicipioService";
import { IMunicipiosPorDepartamento } from "@/types/IMunicipio";
import { ResponsabilidadFiscalService } from "@/services/ResponsabilidadFiscalService";
import { IResponsabilidadFiscal } from "@/types/IResponsabilidadFiscal";
import { DepartamentoService } from "@/services/DepartamentoService";
import { IDepartamento } from "@/types/IDepartamento";
import { ITipoRegimen } from "@/types/ITipoRegimen";
import { TipoRegimenService } from "@/services/TipoRegimenService";
import { IListaPrecio } from "@/types/IListaPrecio";
import { ListaPrecioService } from "@/services/ListaPrecioService";
import { IEmpresas } from "@/types/IEmpresas";
import { EmpresaService } from "@/services/EmpresaService";
import { IMediosPago } from "@/types/IMediosPago";
import { MediosPagoService } from "@/services/MediosPagoService";
import { ITipoPersona } from "@/types/ITipoPersona";
import { TipoPersonaService } from "@/services/TipoPersonaService";
import { ITercero } from "@/types/ITercero";
import { IResponsabilidadTercero } from "@/types/IResponsabilidadTercero";

export default function CompaniesMaster() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // helper para normalizar fechas a YYYY-MM-DD (valor que acepta el <input type="date"/>)
  const formatDateInput = (date: string | Date | null | undefined): string =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  // Estado para los campos iniciales de la empresa
  const [empresa, setEmpresa] = useState<IEmpresas>({
    idEmpresa: 0,
    idTipoDocumentoId: 0,
    nombreTipoDocumentoId: null,
    nitEmpresa: "",
    digitoVerificacion: null,
    nombreEmpresa: "",
    nombreComercial: null,
    idTipoPersona: 0,
    nombreTipoPersona: null,
    idResponsabilidadFiscal: null,
    idResponsabilidadFiscal2: null,
    idResponsabilidadFiscal3: null,
    monedaEmpresa: null,
    idTipoRegimen: 0,
    nombreTipoRegimen: null,
    registroMercantil: null,
    direccionEmpresa: null,
    telefonoEmpresa: null,
    idDepartamento: 0,
    nombreDepartamento: null,
    idMunicipio: 0,
    nombreMunicipio: null,
    emailEmpresa: null,
    notaFe1: null,
    notaFe2: null,
    idTipoAsignacionResolucion: null,
    habilitacionFacturacion: false,
    responsableIva: false,
    granContribuyente: false,
    autoretenedor: false,
    responsableImpoConsumo: false,
    agenteRetenedorIva: false,
    agenteRetenedorRenta: false,
    idRepresentanteLegal: null,
    correoElectronicoRepresentante: null,
    tarifaReteIca: null,
    tarifaReteIva: null,
    actividadEconomica: null,
    ambienteDian: null,
    fechaGrabacionEmpresa: null,
    notaFe3: null,
    idMedioPagoContado: 0,
    nombreMedioPagoContado: null,
    idMedioPagoCredito: 0,
    nombreMedioPagoCredito: null,
  });

  // state used to drive the single unified payment-method select
  const [selectedMedioPago, setSelectedMedioPago] = useState<number>(0);

  // keep unified selection in sync if company object is replaced by some other mechanism
  useEffect(() => {
    const unified =
      empresa.idMedioPagoContado || empresa.idMedioPagoCredito || 0;
    if (unified !== selectedMedioPago) {
      setSelectedMedioPago(unified);
    }
  }, [
    empresa.idMedioPagoContado,
    empresa.idMedioPagoCredito,
    selectedMedioPago,
  ]);

  const [companies, setCompanies] = useState<IEmpresas[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const [companiesError, setCompaniesError] = useState<string | null>(null);
  const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<
    ITipoDocumentoIdentidad[]
  >([]);
  const [isLoadingTipos, setIsLoadingTipos] = useState(true);
  const [tipoError, setTipoError] = useState<string | null>(null);
  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState<
    IMunicipiosPorDepartamento[]
  >([]);
  const [isLoadingMunicipios, setIsLoadingMunicipios] = useState(true);
  const [municipioError, setMunicipioError] = useState<string | null>(null);
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);
  const [isLoadingDepartamentos, setIsLoadingDepartamentos] = useState(true);
  const [departamentoError, setDepartamentoError] = useState<string | null>(
    null,
  );
  const [tiposPersona, setTiposPersona] = useState<ITipoPersona[]>([]);
  const [isLoadingTiposPersona, setIsLoadingTiposPersona] = useState(true);
  const [tipoPersonaError, setTipoPersonaError] = useState<string | null>(null);
  const [mediosPago, setMediosPago] = useState<IMediosPago[]>([]);
  const [isLoadingMediosPago, setIsLoadingMediosPago] = useState(true);
  const [mediosPagoError, setMediosPagoError] = useState<string | null>(null);
  const [responsabilidadesFiscales, setResponsabilidadesFiscales] = useState<
    IResponsabilidadFiscal[]
  >([]);
  const [
    isLoadingResponsabilidadFiscales,
    setIsLoadingResponsabilidadFiscales,
  ] = useState(true);
  const [responsabilidadFiscalError, setResponsabilidadFiscalError] = useState<
    string | null
  >(null);
  const [tiposRegimen, setTiposRegimen] = useState<ITipoRegimen[]>([]);
  const [isLoadingTiposRegimen, setIsLoadingTiposRegimen] = useState(true);
  const [tipoRegimenError, setTipoRegimenError] = useState<string | null>(null);
  const [listaPrecios, setListaPrecios] = useState<IListaPrecio[]>([]);
  const [isLoadingListaPrecios, setIsLoadingListaPrecios] = useState(true);
  const [listaPreciosError, setListaPreciosError] = useState<string | null>(
    null,
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEmpresas, setSelectedEmpresas] = useState<IEmpresas | null>(
    null,
  );
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleSelectEmpresas = (empresa: IEmpresas) => {
    setSelectedEmpresas(empresa);
    const unified = empresa.idMedioPagoContado || empresa.idMedioPagoCredito;
    setSelectedMedioPago(unified);
    const unifiedName =
      empresa.nombreMedioPagoContado || empresa.nombreMedioPagoCredito || null;
    const derivedTipoPersonaName =
      empresa.nombreTipoPersona ||
      tiposPersona.find((t) => t.idTipoPersona === empresa.idTipoPersona)
        ?.nombreTipoPersona ||
      null;

    setEmpresa({
      ...empresa,
      idEmpresa: empresa.idEmpresa,
      idTipoDocumentoId: empresa.idTipoDocumentoId,
      nombreTipoDocumentoId: empresa.nombreTipoDocumentoId,
      nitEmpresa: empresa.nitEmpresa,
      digitoVerificacion: empresa.digitoVerificacion,
      nombreEmpresa: empresa.nombreEmpresa,
      nombreComercial: empresa.nombreComercial,
      idTipoPersona: empresa.idTipoPersona,
      nombreTipoPersona: derivedTipoPersonaName,
      idResponsabilidadFiscal: empresa.idResponsabilidadFiscal,
      idResponsabilidadFiscal2: empresa.idResponsabilidadFiscal2,
      idResponsabilidadFiscal3: empresa.idResponsabilidadFiscal3,
      monedaEmpresa: empresa.monedaEmpresa,
      idTipoRegimen: empresa.idTipoRegimen,
      nombreTipoRegimen: empresa.nombreTipoRegimen,
      registroMercantil: empresa.registroMercantil,
      direccionEmpresa: empresa.direccionEmpresa,
      telefonoEmpresa: empresa.telefonoEmpresa,
      idDepartamento: empresa.idDepartamento,
      nombreDepartamento: empresa.nombreDepartamento,
      idMunicipio: empresa.idMunicipio,
      nombreMunicipio: empresa.nombreMunicipio,
      emailEmpresa: empresa.emailEmpresa,
      notaFe1: empresa.notaFe1,
      notaFe2: empresa.notaFe2,
      idTipoAsignacionResolucion: empresa.idTipoAsignacionResolucion,
      habilitacionFacturacion: empresa.habilitacionFacturacion,
      responsableIva: empresa.responsableIva,
      granContribuyente: empresa.granContribuyente,
      autoretenedor: empresa.autoretenedor,
      responsableImpoConsumo: empresa.responsableImpoConsumo,
      agenteRetenedorIva: empresa.agenteRetenedorIva,
      agenteRetenedorRenta: empresa.agenteRetenedorRenta,
      idRepresentanteLegal: empresa.idRepresentanteLegal,
      correoElectronicoRepresentante: empresa.correoElectronicoRepresentante,
      tarifaReteIca: empresa.tarifaReteIca,
      tarifaReteIva: empresa.tarifaReteIva,
      actividadEconomica: empresa.actividadEconomica,
      ambienteDian: empresa.ambienteDian,
      // asegurarnos que el valor sea YYYY-MM-DD para el input
      fechaGrabacionEmpresa: empresa.fechaGrabacionEmpresa
        ? new Date(empresa.fechaGrabacionEmpresa).toISOString().split("T")[0]
        : null,
      notaFe3: empresa.notaFe3,
      idMedioPagoContado: empresa.idMedioPagoContado,
      nombreMedioPagoContado: unifiedName,
      idMedioPagoCredito: empresa.idMedioPagoCredito,
      nombreMedioPagoCredito: unifiedName,
    });

    // resetear la tabla de responsabilidades (estado de "tercero")
    setTercero({
      idTercero: null,
      idTipoDocumentoId: 0,
      nombreTipoDocumentoId: "",
      digitoVerificacion: "",
      numeroIdentificacion: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      razonSocial: "",
      telefonoTercero: "",
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
      retenedorIva: false,
      retenedorRenta: false,
      retenedorIca: false,
      declaraRenta: false,
      tarifaIca: 0,
      responsabilidadesTerceros: [],
    });
    setAddMode(false);
    setEditIdx(null);

    setOpenDialog(false);
  };

  const [tercero, setTercero] = useState<ITercero>({
    idTercero: null,
    idTipoDocumentoId: 0,
    nombreTipoDocumentoId: "",
    digitoVerificacion: "",
    numeroIdentificacion: "",
    primerNombre: "",
    segundoNombre: "",
    primerApellido: "",
    segundoApellido: "",
    razonSocial: "",
    telefonoTercero: "",
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
    retenedorIva: false,
    retenedorRenta: false,
    retenedorIca: false,
    declaraRenta: false,
    tarifaIca: 0,
    responsabilidadesTerceros: [],
  });

  // Estados para edición inline de responsabilidades
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editResponsabilidad, setEditResponsabilidad] =
    useState<IResponsabilidadTercero>({
      idResponsabilidadTercero: 0,
      idResponsabilidadFiscal: 0,
      nombreResponsabilidadFiscal: "",
    });

  // modo para agregar nueva responsabilidad y estado temporal
  const [addMode, setAddMode] = useState(false);
  const [nuevaResponsabilidad, setNuevaResponsabilidad] =
    useState<IResponsabilidadTercero>({
      idResponsabilidadTercero: 0,
      idResponsabilidadFiscal: 0,
      nombreResponsabilidadFiscal: "",
    });

  // función para insertar fila desde el inline table
  const handleAddResponsabilidad = () => {
    if (
      !nuevaResponsabilidad.idResponsabilidadFiscal ||
      !nuevaResponsabilidad.nombreResponsabilidadFiscal
    )
      return;

    setTercero({
      ...tercero,
      responsabilidadesTerceros: [
        ...(tercero.responsabilidadesTerceros || []),
        {
          ...nuevaResponsabilidad,
          idResponsabilidadTercero: null, // backend trata como nuevo
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

  // lista filtrada que utiliza la tabla
  const filteredResponsabilidades = tercero.responsabilidadesTerceros || [];

  // --------------------------------------------------
  // Estados y lógica para la tabla de notas FE
  const [notasFe, setNotasFe] = useState<string[]>([]);
  const [editNotaIdx, setEditNotaIdx] = useState<number | null>(null);
  const [editNota, setEditNota] = useState<string>("");
  const [addNotaMode, setAddNotaMode] = useState(false);
  const [newNota, setNewNota] = useState<string>("");

  const handleEditNota = (idx: number) => {
    setEditNotaIdx(idx);
    setEditNota(notasFe[idx]);
  };

  const handleSaveNota = (idx: number) => {
    const copia = [...notasFe];
    copia[idx] = editNota;
    setNotasFe(copia);
    setEditNotaIdx(null);
  };

  const handleCancelNota = () => {
    setEditNotaIdx(null);
  };

  const handleAddNota = () => {
    if (!newNota.trim()) return;
    setNotasFe([...notasFe, newNota.trim()]);
    setNewNota("");
    setAddNotaMode(false);
  };

  const filteredNotasFe = notasFe;

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
    const nuevasResponsabilidades = [
      ...(tercero.responsabilidadesTerceros || []),
    ];
    nuevasResponsabilidades[idx] = { ...editResponsabilidad };
    setTercero({
      ...tercero,
      responsabilidadesTerceros: nuevasResponsabilidades,
    });
    setEditIdx(null);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditIdx(null);
  };

  // utilitario para actualizar cualquiera de los tres selects de responsabilidad
  const handleResponsabilidadChange = (
    field:
      | "idResponsabilidadFiscal"
      | "idResponsabilidadFiscal2"
      | "idResponsabilidadFiscal3",
    value: string,
  ) => {
    setEmpresa({ ...empresa, [field]: value });
  };

  const handleSaveEmpresa = async () => {
    // Validación de campos obligatorios
    if (
      !empresa.idEmpresa &&
      (!empresa.nitEmpresa || !empresa.nitEmpresa.trim())
    ) {
      setFormError("El número de NIT es obligatorio.");
      return;
    }

    if (!formatDateInput(empresa.fechaGrabacionEmpresa)) {
      setFormError("La fecha de grabación de la empresa es obligatoria.");
      return;
    }

    // el campo de medio de pago unificado debe seleccionarse
    if (!selectedMedioPago || selectedMedioPago === 0) {
      setFormError("El medio de pago es obligatorio.");
      return;
    }

    // validar tipo de persona
    if (!empresa.idTipoPersona || empresa.idTipoPersona === 0) {
      setFormError("El tipo de persona es obligatorio.");
      return;
    }

    // preparar empresa con las notas FE actuales
    const empresaToSave: IEmpresas = {
      ...empresa,
      notaFe1: notasFe[0] || null,
      notaFe2: notasFe[1] || null,
      notaFe3: notasFe[2] || null,
    };

    setFormError(null);
    try {
      if (empresa.idEmpresa) {
        // Actualizar empresa existente
        await EmpresaService.update(empresaToSave);
        console.log("Empresa actualizada:", empresaToSave);
        setSuccessMessage("Empresa actualizada correctamente");
        setShowSuccessDialog(true);
      } else {
        const result = await EmpresaService.create(empresaToSave);
        console.log("Empresa guardada:", result);
        setSuccessMessage("Empresa guardada correctamente");
        setShowSuccessDialog(true);
      }
      fetchCompanies();
    } catch (error) {
      console.error("Error al guardar la empresa:", error);
    }
  };

  const handleNew = async () => {
    const today = new Date().toISOString().split("T")[0];
    setEmpresa({
      idEmpresa: 0,
      idTipoDocumentoId: 0,
      nombreTipoDocumentoId: null,
      nitEmpresa: "",
      digitoVerificacion: null,
      nombreEmpresa: "",
      nombreComercial: null,
      idTipoPersona: 0,
      nombreTipoPersona: null,
      idResponsabilidadFiscal: null,
      idResponsabilidadFiscal2: null,
      idResponsabilidadFiscal3: null,
      monedaEmpresa: null,
      idTipoRegimen: 0,
      nombreTipoRegimen: null,
      registroMercantil: null,
      direccionEmpresa: null,
      telefonoEmpresa: null,
      idDepartamento: 0,
      nombreDepartamento: null,
      idMunicipio: 0,
      nombreMunicipio: null,
      emailEmpresa: null,
      notaFe1: null,
      notaFe2: null,
      idTipoAsignacionResolucion: null,
      habilitacionFacturacion: false,
      responsableIva: false,
      granContribuyente: false,
      autoretenedor: false,
      responsableImpoConsumo: false,
      agenteRetenedorIva: false,
      agenteRetenedorRenta: false,
      idRepresentanteLegal: null,
      correoElectronicoRepresentante: null,
      tarifaReteIca: null,
      tarifaReteIva: null,
      actividadEconomica: null,
      ambienteDian: null,
      fechaGrabacionEmpresa: today,
      notaFe3: null,
      idMedioPagoContado: 0,
      nombreMedioPagoContado: null,
      idMedioPagoCredito: 0,
      nombreMedioPagoCredito: null,
    });
    setSelectedMedioPago(0);

    // también limpiar estado de tercero/tablas
    setTercero({
      idTercero: null,
      idTipoDocumentoId: 0,
      nombreTipoDocumentoId: "",
      digitoVerificacion: "",
      numeroIdentificacion: "",
      primerNombre: "",
      segundoNombre: "",
      primerApellido: "",
      segundoApellido: "",
      razonSocial: "",
      telefonoTercero: "",
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
      retenedorIva: false,
      retenedorRenta: false,
      retenedorIca: false,
      declaraRenta: false,
      tarifaIca: 0,
      responsabilidadesTerceros: [],
    });
    setAddMode(false);
    setEditIdx(null);

    // limpiar también notas FE y su estado de edición
    setNotasFe([]);
    setAddNotaMode(false);
    setEditNotaIdx(null);
  };

  // abre el diálogo de confirmación de eliminación
  const handleDeleteEmpresa = async () => {
    if (!empresa.idEmpresa) {
      toast.error("No hay una empresa seleccionada para eliminar", {
        position: "top-center",
      });
      return;
    }
    setShowDeleteDialog(true);
  };

  // Agregar esta nueva función para confirmar la eliminación
  const confirmDeleteEmpresa = async () => {
    try {
      if (empresa.idEmpresa === null) {
        toast.error("No se puede eliminar: ID de empresa no válido", {
          position: "top-center",
        });
        setShowDeleteDialog(false);
        return;
      }
      await EmpresaService.delete(empresa.idEmpresa);
      console.log("Empresa eliminada:", empresa.idEmpresa);
      toast.success("Empresa eliminada correctamente", {
        position: "top-center",
      });

      // Limpiar el formulario después de eliminar
      setEmpresa({
        idEmpresa: 0,
        idTipoDocumentoId: 0,
        nombreTipoDocumentoId: null,
        nitEmpresa: "",
        digitoVerificacion: null,
        nombreEmpresa: "",
        nombreComercial: null,
        idTipoPersona: 0,
        nombreTipoPersona: null,
        idResponsabilidadFiscal: null,
        idResponsabilidadFiscal2: null,
        idResponsabilidadFiscal3: null,
        monedaEmpresa: null,
        idTipoRegimen: 0,
        nombreTipoRegimen: null,
        registroMercantil: null,
        direccionEmpresa: null,
        telefonoEmpresa: null,
        idDepartamento: 0,
        nombreDepartamento: null,
        idMunicipio: 0,
        nombreMunicipio: null,
        emailEmpresa: null,
        notaFe1: null,
        notaFe2: null,
        idTipoAsignacionResolucion: null,
        habilitacionFacturacion: false,
        responsableIva: false,
        granContribuyente: false,
        autoretenedor: false,
        responsableImpoConsumo: false,
        agenteRetenedorIva: false,
        agenteRetenedorRenta: false,
        idRepresentanteLegal: null,
        correoElectronicoRepresentante: null,
        tarifaReteIca: null,
        tarifaReteIva: null,
        actividadEconomica: null,
        ambienteDian: null,
        fechaGrabacionEmpresa: null,
        notaFe3: null,
        idMedioPagoContado: 0,
        nombreMedioPagoContado: null,
        idMedioPagoCredito: 0,
        nombreMedioPagoCredito: null,
      });
      setSelectedEmpresas(null);

      // Recargar la lista de empresas
      fetchCompanies();

      // Cerrar el diálogo
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar la empresa:", error);
      toast.error("Error al eliminar la empresa", {
        position: "top-center",
      });
      setShowDeleteDialog(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      setCompaniesError(null);
      setIsLoadingCompanies(true);
      const data = await EmpresaService.getAll();
      setCompanies(data);
    } catch (error) {
      console.error("Error:", error);
      setCompaniesError("Error al cargar las empresas");
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const fetchTipoDocumentoIdentidad = async () => {
    try {
      setTipoError(null);
      setIsLoadingTipos(true);
      const data = await TipoDocumentoIdentidadService.getAll();
      setTiposDocumentoIdentidad([
        {
          idTipoDocumentoId: 0,
          nombreTipoDocumentoId: "Seleccione un tipo de documento",
          codigoTipoDocumentoId: "0",
          observacionTipoDocumentoId: null,
        }, // Tipo de documento por defecto
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setTipoError("Error al cargar los tipos de documento");
      // Tipos de documento por defecto en caso de error
      setTiposDocumentoIdentidad([
        {
          idTipoDocumentoId: 0,
          nombreTipoDocumentoId: "Seleccione un tipo de documento",
          codigoTipoDocumentoId: "0",
          observacionTipoDocumentoId: null,
        },
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
      console.error("Error:", error);
      setMunicipioError("Error al cargar los municipios");
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
        {
          idDepartamento: 0,
          codigoDepartamento: "0",
          nombreDepartamento: "Seleccione un departamento",
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setDepartamentoError("Error al cargar los departamentos");
      // Departamentos por defecto en caso de error
      setDepartamentos([
        {
          idDepartamento: 0,
          codigoDepartamento: "0",
          nombreDepartamento: "Seleccione un departamento",
        },
      ]);
    } finally {
      setIsLoadingDepartamentos(false);
    }
  };

  const fetchMediosPago = async () => {
    try {
      setMediosPagoError(null);
      setIsLoadingMediosPago(true);
      const data = await MediosPagoService.getAll();
      setMediosPago([
        {
          idMedioPago: 0,
          codigoMedioPago: "0",
          nombreMedioPago: "Seleccione un medio de pago",
          codigoDianMedioPago: "0",
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setMediosPagoError("Error al cargar los medios de pago");
      // Medios de pago por defecto en caso de error
      setMediosPago([
        {
          idMedioPago: 0,
          codigoMedioPago: "0",
          nombreMedioPago: "Seleccione un medio de pago",
          codigoDianMedioPago: "0",
        },
      ]);
    } finally {
      setIsLoadingMediosPago(false);
    }
  };

  const fetchTiposPersona = async () => {
    try {
      setTipoPersonaError(null);
      setIsLoadingTiposPersona(true);
      const data = await TipoPersonaService.getAll();
      setTiposPersona([
        {
          idTipoPersona: 0,
          codigoTipoPersona: "0",
          nombreTipoPersona: "Seleccione un tipo de persona",
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setTipoPersonaError("Error al cargar los tipos de persona");
      // Tipos de persona por defecto en caso de error
      setTiposPersona([
        {
          idTipoPersona: 0,
          codigoTipoPersona: "0",
          nombreTipoPersona: "Seleccione un tipo de persona",
        },
      ]);
    } finally {
      setIsLoadingTiposPersona(false);
    }
  };

  const fetchResponsabilidadesFiscales = async () => {
    try {
      setResponsabilidadFiscalError(null);
      setIsLoadingResponsabilidadFiscales(true);
      const data = await ResponsabilidadFiscalService.getAll();
      setResponsabilidadesFiscales([
        {
          idResponsabilidadFiscal: 0,
          codigoResponsabilidadFiscal: "0",
          nombreResponsabilidadFiscal: "Seleccione una responsabilidad fiscal",
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setResponsabilidadFiscalError(
        "Error al cargar las responsabilidades fiscales",
      );
      // Responsabilidades fiscales por defecto en caso de error
      setResponsabilidadesFiscales([
        {
          idResponsabilidadFiscal: 0,
          codigoResponsabilidadFiscal: "0",
          nombreResponsabilidadFiscal: "Seleccione una responsabilidad fiscal",
        },
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
        {
          idTipoRegimen: 0,
          codigoTipoRegimen: "0",
          nombreTipoRegimen: "Seleccione un tipo de regimen",
          idTipoRegimenFe: null,
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setTipoRegimenError("Error al cargar los tipos de regimen");
      // Tipos de regimen por defecto en caso de error
      setTiposRegimen([
        {
          idTipoRegimen: 0,
          codigoTipoRegimen: "0",
          nombreTipoRegimen: "Seleccione un tipo de regimen",
          idTipoRegimenFe: null,
        },
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
        {
          idListaPrecio: 0,
          codigoListaPrecio: "0",
          nombreListaPrecio: "Seleccione una lista de precios",
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setListaPreciosError("Error al cargar las listas de precios");
      // Listas de precios por defecto en caso de error
      setListaPrecios([
        {
          idListaPrecio: 0,
          codigoListaPrecio: "0",
          nombreListaPrecio: "Seleccione una lista de precios",
        },
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
    fetchCompanies();
    fetchMediosPago();
    fetchTiposPersona();
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
          <p className="text-sm text-muted-foreground">
            Sistema de Punto de Venta
          </p>
        </div>
      </div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Maestro de Empresas</h2>
          <p className="text-muted-foreground text-sm">
            Consulta y gestión de empresas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nueva empresa"
            onClick={() => handleNew()}
            className="bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          {/* Dialog de búsqueda */}
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" title="Buscar empresa">
                <Search className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Buscar empresas</DialogTitle>
              </DialogHeader>
              {/* Input de búsqueda */}
              <Input
                className="mb-4"
                placeholder="Buscar por ID o nombre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="overflow-x-auto max-h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número Identificación</TableHead>
                      <TableHead>Nombre de la empresa</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies
                      .filter(
                        (company) =>
                          company.idEmpresa
                            ?.toString()
                            .includes(search.toLowerCase()) ||
                          company.nombreEmpresa
                            ?.toLowerCase()
                            .includes(search.toLowerCase()),
                      )
                      .map((company) => (
                        <TableRow
                          key={company.idEmpresa}
                          className="cursor-pointer hover:bg-primary/10"
                          onClick={() => handleSelectEmpresas(company)}
                        >
                          <TableCell>{company.idEmpresa}</TableCell>
                          <TableCell>{company.nombreEmpresa}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {isLoadingCompanies && (
                  <div className="text-center text-muted-foreground py-4">
                    Cargando...
                  </div>
                )}
                {companiesError && (
                  <div className="text-center text-red-500 py-4">
                    {companiesError}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="default"
            title="Guardar empresa"
            onClick={handleSaveEmpresa}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>
          <Button
            variant="default"
            title="Eliminar empresa"
            onClick={handleDeleteEmpresa}
          >
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>
          <Button
            variant="default"
            size="icon"
            title="Salir"
            onClick={() => {
              navigate("/main-menu");
            }}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Campos de empresas */}
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">Información General</TabsTrigger>
          <TabsTrigger value="impuestos">Impuestos</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Tipo de Documento
                </label>
                <select
                  className={
                    (!empresa.idTipoDocumentoId ||
                      empresa.idTipoDocumentoId === 0) &&
                    formError
                      ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                      : "w-full rounded border px-3 py-2 text-sm bg-background"
                  }
                  value={empresa.idTipoDocumentoId}
                  onChange={(e) =>
                    setEmpresa({
                      ...empresa,
                      idTipoDocumentoId: Number(e.target.value),
                    })
                  }
                  required
                >
                  {tiposDocumentoIdentidad.map((cat) => (
                    <option
                      key={cat.idTipoDocumentoId}
                      value={cat.idTipoDocumentoId}
                    >
                      {cat.nombreTipoDocumentoId} ({cat.codigoTipoDocumentoId})
                    </option>
                  ))}
                </select>
                {formError &&
                  (!empresa.idTipoDocumentoId ||
                    empresa.idTipoDocumentoId === 0) && (
                    <span className="text-xs text-red-500">
                      El tipo de documento es obligatorio.
                    </span>
                  )}
                {tipoError && (
                  <span className="text-xs text-red-500">{tipoError}</span>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  NIT de la empresa
                </label>
                <Input
                  value={empresa.nitEmpresa ?? ""}
                  onChange={(e) =>
                    setEmpresa({
                      ...empresa,
                      nitEmpresa: e.target.value,
                    })
                  }
                  placeholder="Número de identificación"
                  required
                  className={
                    !empresa.nitEmpresa?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }
                />
                {formError && !empresa.nitEmpresa?.trim() && (
                  <span className="text-xs text-red-500">
                    El NIT de la empresa es obligatorio.
                  </span>
                )}
              </div>
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Digito de Verificación
                </label>
                <Input
                  value={empresa.digitoVerificacion ?? ""}
                  onChange={(e) =>
                    setEmpresa({
                      ...empresa,
                      digitoVerificacion: e.target.value,
                    })
                  }
                  placeholder="DV"
                  readOnly
                  className={`w-20 ${
                    !empresa.digitoVerificacion?.trim() && formError
                      ? "border border-red-500"
                      : ""
                  }`}
                />
              </div>
              <div className="md:col-span-4 grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Nombre de la empresa
                  </label>
                  <Input
                    value={empresa.nombreEmpresa ?? ""}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, nombreEmpresa: e.target.value })
                    }
                    placeholder="Nombre de la empresa"
                    className={
                      !empresa.nombreEmpresa?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Nombre comercial
                  </label>
                  <Input
                    value={empresa.nombreComercial ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        nombreComercial: e.target.value,
                      })
                    }
                    placeholder="Nombre comercial"
                    className={
                      !empresa.nombreComercial?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Tipo Persona
                  </label>
                  <select
                    className={
                      (!empresa.idTipoPersona || empresa.idTipoPersona === 0) &&
                      formError
                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                    }
                    value={empresa.idTipoPersona}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      const found = tiposPersona.find(
                        (t) => t.idTipoPersona === id,
                      );
                      setEmpresa({
                        ...empresa,
                        idTipoPersona: id,
                        nombreTipoPersona: found
                          ? found.nombreTipoPersona
                          : null,
                      });
                    }}
                    required
                  >
                    {tiposPersona.map((cat) => (
                      <option key={cat.idTipoPersona} value={cat.idTipoPersona}>
                        {cat.nombreTipoPersona} ({cat.codigoTipoPersona})
                      </option>
                    ))}
                  </select>
                  {formError &&
                    (!empresa.idTipoPersona || empresa.idTipoPersona === 0) && (
                      <span className="text-xs text-red-500">
                        El tipo de persona es obligatorio.
                      </span>
                    )}
                  {tipoError && (
                    <span className="text-xs text-red-500">{tipoError}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Moneda de la empresa
                  </label>
                  <Input
                    value={empresa.monedaEmpresa ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        monedaEmpresa: e.target.value,
                      })
                    }
                    placeholder="Moneda de la empresa"
                    className={
                      !empresa.monedaEmpresa?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Tipo Régimen
                  </label>
                  <select
                    className={
                      (!empresa.idTipoRegimen || empresa.idTipoRegimen === 0) &&
                      formError
                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                    }
                    value={empresa.idTipoRegimen}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        idTipoRegimen: Number(e.target.value),
                      })
                    }
                    required
                  >
                    {tiposRegimen.map((cat) => (
                      <option key={cat.idTipoRegimen} value={cat.idTipoRegimen}>
                        {cat.nombreTipoRegimen}
                      </option>
                    ))}
                  </select>
                  {formError &&
                    (!empresa.idTipoRegimen || empresa.idTipoRegimen === 0) && (
                      <span className="text-xs text-red-500">
                        El tipo de régimen es obligatorio.
                      </span>
                    )}
                  {tipoError && (
                    <span className="text-xs text-red-500">{tipoError}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Registro mercantil
                  </label>
                  <Input
                    value={empresa.registroMercantil ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        registroMercantil: e.target.value,
                      })
                    }
                    placeholder="Registro mercantil"
                    className={
                      !empresa.registroMercantil?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Dirección de la empresa
                  </label>
                  <Input
                    value={empresa.direccionEmpresa ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        direccionEmpresa: e.target.value,
                      })
                    }
                    placeholder="Dirección de la empresa"
                    className={
                      !empresa.direccionEmpresa?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Teléfono
                  </label>
                  <Input
                    type="number"
                    value={empresa.telefonoEmpresa || ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        telefonoEmpresa: e.target.value,
                      })
                    }
                    placeholder="Teléfono"
                    className={
                      !empresa.telefonoEmpresa && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {/* {formError && (!empresa.telefonoEmpresa) && (
                            <span className="text-xs text-red-500">El teléfono es obligatorio.</span>
                        )} */}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Departamento
                  </label>
                  <select
                    className={
                      (!empresa.idDepartamento ||
                        empresa.idDepartamento === 0) &&
                      formError
                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                    }
                    value={empresa.idDepartamento}
                    onChange={(e) => {
                      const newDepartamentoId = Number(e.target.value);
                      setEmpresa({
                        ...empresa,
                        idDepartamento: newDepartamentoId,
                        idMunicipio: 0, // Resetear municipio cuando cambia el departamento
                      });
                    }}
                    required
                  >
                    {departamentos.map((cat) => (
                      <option
                        key={cat.idDepartamento}
                        value={cat.idDepartamento}
                      >
                        {cat.nombreDepartamento}
                      </option>
                    ))}
                  </select>
                  {formError &&
                    (!empresa.idDepartamento ||
                      empresa.idDepartamento === 0) && (
                      <span className="text-xs text-red-500">
                        El departamento es obligatorio.
                      </span>
                    )}
                  {tipoError && (
                    <span className="text-xs text-red-500">{tipoError}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Municipio
                  </label>
                  <select
                    className={
                      (!empresa.idMunicipio || empresa.idMunicipio === 0) &&
                      formError
                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                    }
                    value={empresa.idMunicipio}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        idMunicipio: Number(e.target.value),
                      })
                    }
                    required
                  >
                    <option value={0}>Seleccione un municipio</option>
                    {municipiosPorDepartamento
                      .find(
                        (dep) => dep.idDepartamento === empresa.idDepartamento,
                      )
                      ?.municipios.map((mun) => (
                        <option key={mun.idMunicipio} value={mun.idMunicipio}>
                          {mun.nombreMunicipio}
                        </option>
                      ))}
                  </select>
                  {formError &&
                    (!empresa.idMunicipio || empresa.idMunicipio === 0) && (
                      <span className="text-xs text-red-500">
                        El municipio es obligatorio.
                      </span>
                    )}
                  {tipoError && (
                    <span className="text-xs text-red-500">{tipoError}</span>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Email de la Empresa
                  </label>
                  <Input
                    type="email"
                    value={empresa.emailEmpresa ?? ""}
                    onChange={(e) =>
                      setEmpresa({ ...empresa, emailEmpresa: e.target.value })
                    }
                    placeholder="Email"
                    className={
                      !empresa.emailEmpresa?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {/* {formError && (!empresa.emailEmpresa?.trim()) && (
                            <span className="text-xs text-red-500">El email es obligatorio.</span>
                        )} */}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    ID del Respresentante Legal
                  </label>
                  <Input
                    type="text"
                    value={empresa.idRepresentanteLegal ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        idRepresentanteLegal: e.target.value,
                      })
                    }
                    placeholder="ID del Representante Legal"
                    className={
                      !empresa.idRepresentanteLegal?.trim() && formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {/* {formError && (!empresa.idRepresentanteLegal?.trim()) && (
                            <span className="text-xs text-red-500">El ID del representante legal es obligatorio.</span>
                        )} */}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Email del Respresentante Legal
                  </label>
                  <Input
                    type="email"
                    value={empresa.correoElectronicoRepresentante ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        correoElectronicoRepresentante: e.target.value,
                      })
                    }
                    placeholder="Email del Representante Legal"
                    className={
                      !empresa.correoElectronicoRepresentante?.trim() &&
                      formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {/* {formError && (!empresa.correoElectronicoRepresentante?.trim()) && (
                            <span className="text-xs text-red-500">El correo del representante legal es obligatorio.</span>
                        )} */}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Fecha de grabación de la empresa
                  </label>
                  <Input
                    type="date"
                    value={formatDateInput(empresa.fechaGrabacionEmpresa)}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        fechaGrabacionEmpresa: e.target.value,
                      })
                    }
                    placeholder="Fecha de grabación de la empresa"
                    required
                    className={
                      !formatDateInput(empresa.fechaGrabacionEmpresa) &&
                      formError
                        ? "border border-red-500"
                        : ""
                    }
                  />
                  {formError &&
                    !formatDateInput(empresa.fechaGrabacionEmpresa) && (
                      <span className="text-xs text-red-500">
                        La fecha de grabación de la empresa es obligatoria.
                      </span>
                    )}
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Medio de pago
                  </label>
                  <select
                    className={
                      (!selectedMedioPago || selectedMedioPago === 0) &&
                      formError
                        ? "w-full rounded border px-3 py-2 text-sm bg-background border-red-500"
                        : "w-full rounded border px-3 py-2 text-sm bg-background"
                    }
                    value={selectedMedioPago}
                    onChange={(e) => {
                      const newId = Number(e.target.value);
                      const found = mediosPago.find(
                        (m) => m.idMedioPago === newId,
                      );
                      const nombre = found ? found.nombreMedioPago : null;
                      setSelectedMedioPago(newId);
                      setEmpresa({
                        ...empresa,
                        idMedioPagoContado: newId,
                        nombreMedioPagoContado: nombre,
                        idMedioPagoCredito: newId,
                        nombreMedioPagoCredito: nombre,
                      });
                    }}
                    required
                  >
                    {mediosPago.map((cat) => (
                      <option key={cat.idMedioPago} value={cat.idMedioPago}>
                        {cat.nombreMedioPago}
                      </option>
                    ))}
                  </select>
                  {formError &&
                    (!selectedMedioPago || selectedMedioPago === 0) && (
                      <span className="text-xs text-red-500">
                        El medio de pago es obligatorio.
                      </span>
                    )}
                  {tipoError && (
                    <span className="text-xs text-red-500">{tipoError}</span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
        <TabsContent value="impuestos" className="mt-4">
          <Card className="mb-6 p-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Habilitación de facturación electrónica
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.habilitacionFacturacion || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          habilitacionFacturacion: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.habilitacionFacturacion ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Responsable de IVA
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.responsableIva || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          responsableIva: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.responsableIva ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Gran Contribuyente
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.granContribuyente || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          granContribuyente: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.granContribuyente ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Autoretenedor de Iva
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.autoretenedor || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          autoretenedor: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.autoretenedor ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Responsable de Impoconsumo
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.responsableImpoConsumo || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          responsableImpoConsumo: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.responsableImpoConsumo ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Agente de Retención de Iva
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.agenteRetenedorIva || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          agenteRetenedorIva: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.agenteRetenedorIva ? "Si" : "No"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground mb-1">
                    Agente de Retención de Renta
                  </span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={empresa.agenteRetenedorRenta || false}
                      onChange={(e) =>
                        setEmpresa({
                          ...empresa,
                          agenteRetenedorRenta: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-sm text-muted-foreground">
                      {empresa.agenteRetenedorRenta ? "Si" : "No"}
                    </span>
                  </div>
                </div>
              </div>

              {/* fila 3: tarifas y ambiente */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground w-32">
                    ID Tipo Asignacion de Resolución
                  </label>
                  <Input
                    value={empresa.idTipoAsignacionResolucion ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        idTipoAsignacionResolucion: Number(e.target.value),
                      })
                    }
                    placeholder="ID Tipo Asignacion de Resolución"
                    className="flex-1 max-w-xs"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground min-w-32">
                    Tarifa ReteIca
                  </label>
                  <Input
                    value={empresa.tarifaReteIca ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        tarifaReteIca: Number(e.target.value),
                      })
                    }
                    placeholder="Tarifa ReteIca"
                    className="w-48"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground min-w-32">
                    Tarifa ReteIva
                  </label>
                  <Input
                    value={empresa.tarifaReteIva ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        tarifaReteIva: Number(e.target.value),
                      })
                    }
                    placeholder="Tarifa ReteIva"
                    className="w-48"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="text-xs text-muted-foreground min-w-32">
                    Ambiente DIAN
                  </label>
                  <Input
                    value={empresa.ambienteDian ?? ""}
                    onChange={(e) =>
                      setEmpresa({
                        ...empresa,
                        ambienteDian: Number(e.target.value),
                      })
                    }
                    placeholder="Ambiente DIAN"
                    className="w-48"
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Tabla de responsabilidades */}
      <Card className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-2 py-2 text-left font-semibold w-64">
                Código Responsabilidad
              </th>
              <th className="px-4 py-2 text-left font-semibold w-96">
                Nombre Responsabilidad
              </th>
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
                        value={
                          editResponsabilidad.idResponsabilidadFiscal || "0"
                        }
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedResponsabilidad =
                            responsabilidadesFiscales.find(
                              (t) =>
                                String(t.idResponsabilidadFiscal) ===
                                selectedId,
                            );
                          setEditResponsabilidad({
                            ...editResponsabilidad,
                            idResponsabilidadFiscal: selectedResponsabilidad
                              ? selectedResponsabilidad.idResponsabilidadFiscal
                              : 0,
                            nombreResponsabilidadFiscal: selectedResponsabilidad
                              ? selectedResponsabilidad.nombreResponsabilidadFiscal
                              : "",
                          });
                        }}
                      >
                        <option value="0">
                          Seleccione la responsabilidad...
                        </option>
                        {responsabilidadesFiscales
                          .filter((t) => t.idResponsabilidadFiscal !== 0)
                          .map((t) => (
                            <option
                              key={t.idResponsabilidadFiscal}
                              value={t.idResponsabilidadFiscal}
                            >
                              {t.nombreResponsabilidadFiscal} (
                              {t.codigoResponsabilidadFiscal})
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-4 py-2">
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={editResponsabilidad.nombreResponsabilidadFiscal}
                        onChange={(e) =>
                          setEditResponsabilidad({
                            ...editResponsabilidad,
                            nombreResponsabilidadFiscal: e.target.value,
                          })
                        }
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
                    <td className="px-2 py-2">
                      {item.idResponsabilidadFiscal}
                    </td>
                    <td className="px-4 py-2">
                      {item.nombreResponsabilidadFiscal}
                    </td>
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
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedResponsabilidad =
                        responsabilidadesFiscales.find(
                          (t) =>
                            String(t.idResponsabilidadFiscal) === selectedId,
                        );
                      setNuevaResponsabilidad({
                        ...nuevaResponsabilidad,
                        idResponsabilidadFiscal: selectedResponsabilidad
                          ? selectedResponsabilidad.idResponsabilidadFiscal
                          : 0,
                        nombreResponsabilidadFiscal: selectedResponsabilidad
                          ? selectedResponsabilidad.nombreResponsabilidadFiscal
                          : "",
                      });
                    }}
                  >
                    <option value="0">
                      Seleccione la responsabilidad fiscal...
                    </option>
                    {responsabilidadesFiscales
                      .filter((t) => t.idResponsabilidadFiscal !== 0)
                      .map((t) => (
                        <option
                          key={t.idResponsabilidadFiscal}
                          value={t.idResponsabilidadFiscal}
                        >
                          {t.nombreResponsabilidadFiscal} (
                          {t.codigoResponsabilidadFiscal})
                        </option>
                      ))}
                  </select>
                </td>
                <td className="px-4 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={nuevaResponsabilidad.nombreResponsabilidadFiscal}
                    onChange={(e) =>
                      setNuevaResponsabilidad({
                        ...nuevaResponsabilidad,
                        nombreResponsabilidadFiscal: e.target.value,
                      })
                    }
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
      {/* Tabla de notas FE */}
      <Card className="overflow-x-auto mt-4">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="px-4 py-2 text-left font-semibold">Nota FE</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {filteredNotasFe.map((nota, idx) => (
              <tr key={idx} className="border-b hover:bg-accent">
                {editNotaIdx === idx ? (
                  <>
                    <td className="px-2 py-2">
                      <input
                        className="w-full border rounded px-2 py-1"
                        value={editNota}
                        onChange={(e) => setEditNota(e.target.value)}
                      />
                    </td>
                    <td className="px-4 py-2 flex gap-2">
                      <button
                        className="text-green-600 font-semibold flex items-center"
                        onClick={() => handleSaveNota(idx)}
                        title="Guardar"
                      >
                        <Check className="w-6 h-6" />
                      </button>
                      <button
                        className="text-red-600 font-semibold flex items-center"
                        onClick={handleCancelNota}
                        title="Cancelar"
                      >
                        <CircleX className="w-6 h-6" />
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-2 py-2">{nota}</td>
                    <td className="px-4 py-2">
                      <button
                        className="text-blue-600 font-semibold flex items-center"
                        onClick={() => handleEditNota(idx)}
                        title="Editar"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {addNotaMode ? (
              <tr className="border-b bg-accent/40">
                <td className="px-2 py-2">
                  <input
                    className="w-full border rounded px-2 py-1"
                    value={newNota}
                    onChange={(e) => setNewNota(e.target.value)}
                    placeholder="Nueva nota FE"
                  />
                </td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="text-green-600 font-semibold flex items-center"
                    onClick={handleAddNota}
                    title="Guardar"
                  >
                    <Check className="w-6 h-6" />
                  </button>
                  <button
                    className="text-red-600 font-semibold flex items-center"
                    onClick={() => {
                      setAddNotaMode(false);
                      setNewNota("");
                    }}
                    title="Cancelar"
                  >
                    <CircleX className="w-6 h-6" />
                  </button>
                </td>
              </tr>
            ) : (
              <tr>
                <td colSpan={2} className="px-0 py-2">
                  <button
                    className="bg-black text-white font-semibold px-4 py-2 rounded text-left"
                    onClick={() => setAddNotaMode(true)}
                  >
                    + Agregar nota FE
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* AlertDialog de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Todo ha salido bien!!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la empresa "
              {empresa.nombreEmpresa || empresa.idEmpresa}
              "? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteEmpresa}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}