import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Check,
  Pencil,
  X,
  CircleX,
  Save,
  Trash,
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


  // Helper para normalizar fechas a YYYY-MM-DD
  const formatDateInput = (date: string | Date | null | undefined): string =>
    date ? new Date(date).toISOString().split("T")[0] : "";

  // Estado para la empresa única
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

  // Estado para manejar el medio de pago unificado
  const [selectedMedioPago, setSelectedMedioPago] = useState<number>(0);

  const tarifaReteIcaStrRef = useRef<string>(
    empresa.tarifaReteIca !== null && empresa.tarifaReteIca !== 0
      ? empresa.tarifaReteIca.toString()
      : ""
  );

  const tarifaReteIvaStrRef = useRef<string>(
    empresa.tarifaReteIva !== null && empresa.tarifaReteIva !== 0
      ? empresa.tarifaReteIva.toString()
      : ""
  );

  useEffect(() => {
    const unified = empresa.idMedioPagoContado || empresa.idMedioPagoCredito || 0;
    if (unified !== selectedMedioPago) {
      setSelectedMedioPago(unified);
    }
  }, [empresa.idMedioPagoContado, empresa.idMedioPagoCredito, selectedMedioPago]);

  const [isLoadingEmpresa, setIsLoadingEmpresa] = useState(true);
  const [empresaError, setEmpresaError] = useState<string | null>(null);

  const [tiposDocumentoIdentidad, setTiposDocumentoIdentidad] = useState<ITipoDocumentoIdentidad[]>([]);
  const [tipoError, setTipoError] = useState<string | null>(null);

  const [municipiosPorDepartamento, setMunicipiosPorDepartamento] = useState<IMunicipiosPorDepartamento[]>([]);
  const [departamentos, setDepartamentos] = useState<IDepartamento[]>([]);

  const [tiposPersona, setTiposPersona] = useState<ITipoPersona[]>([]);

  const [mediosPago, setMediosPago] = useState<IMediosPago[]>([]);
  const [responsabilidadesFiscales, setResponsabilidadesFiscales] = useState<IResponsabilidadFiscal[]>([]);
  const [tiposRegimen, setTiposRegimen] = useState<ITipoRegimen[]>([]);

  const [listaPrecios, setListaPrecios] = useState<IListaPrecio[]>([]);

  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const isFormDisabled = !isEditing;


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
    idCodigoPostal: null,
    registroMercantil: null,
    responsabilidadesTerceros: [],
  });

  // Estados para edición inline de responsabilidades
  const [editIdx, setEditIdx] = useState<number | null>(null);
  const [editResponsabilidad, setEditResponsabilidad] = useState<IResponsabilidadTercero>({
    idResponsabilidadTercero: 0,
    idResponsabilidadFiscal: 0,
    nombreResponsabilidadFiscal: "",
  });

  // Modo para agregar nueva responsabilidad
  const [addMode, setAddMode] = useState(false);
  const [nuevaResponsabilidad, setNuevaResponsabilidad] = useState<IResponsabilidadTercero>({
    idResponsabilidadTercero: 0,
    idResponsabilidadFiscal: 0,
    nombreResponsabilidadFiscal: "",
  });

  const isResponsabilidadAlreadyAssigned = (
    idResponsabilidadFiscal: number | null | undefined,
    excludeIdx?: number
  ) => {
    if (!idResponsabilidadFiscal || idResponsabilidadFiscal === 0) return false;

    return (tercero.responsabilidadesTerceros || []).some((item, idx) => {
      if (excludeIdx !== undefined && idx === excludeIdx) return false;
      return Number(item.idResponsabilidadFiscal) === Number(idResponsabilidadFiscal);
    });
  };

  const getResponsabilidadesDisponibles = (
    excludeIdx?: number,
    currentId?: number | null
  ) => {
    const usadas = (tercero.responsabilidadesTerceros || [])
      .filter((_, idx) => excludeIdx === undefined || idx !== excludeIdx)
      .map((item) => Number(item.idResponsabilidadFiscal))
      .filter((id) => !Number.isNaN(id) && id !== 0);

    return responsabilidadesFiscales.filter((item) => {
      const id = Number(item.idResponsabilidadFiscal);
      if (!id || id === 0) return false;
      if (currentId && id === Number(currentId)) return true;
      return !usadas.includes(id);
    });
  };


  const handleAddResponsabilidad = () => {
    if (
      !nuevaResponsabilidad.idResponsabilidadFiscal ||
      !nuevaResponsabilidad.nombreResponsabilidadFiscal
    )
      return;

    if (isResponsabilidadAlreadyAssigned(nuevaResponsabilidad.idResponsabilidadFiscal)) {
      toast.error("Esta responsabilidad ya está agregada.");
      return;
    }

    setTercero({
      ...tercero,
      responsabilidadesTerceros: [
        ...(tercero.responsabilidadesTerceros || []),
        {
          ...nuevaResponsabilidad,
          idResponsabilidadTercero: null,
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

  const filteredResponsabilidades = tercero.responsabilidadesTerceros || [];

  // Lógica para la tabla de notas FE
  const [notasFe, setNotasFe] = useState<string[]>([]);
  const [editNotaIdx, setEditNotaIdx] = useState<number | null>(null);
  const [editNota, setEditNota] = useState<string>("");
  const [addNotaMode, setAddNotaMode] = useState(false);
  const [newNota, setNewNota] = useState<string>("");

  const handleEditNota = (idx: number) => {
    setEditNotaIdx(idx);
    setEditNota(notasFe[idx]);
  };

  const handleDeleteNota = (idx: number) => {
    const copia = [...notasFe];
    copia.splice(idx, 1);
    setNotasFe(copia);
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


  const handleEdit = (idx: number) => {
    const responsabilidad = tercero.responsabilidadesTerceros?.[idx];
    if (responsabilidad) {
      setEditIdx(idx);
      setEditResponsabilidad({ ...responsabilidad });
    }
  };

  const handleDelete = (idx: number) => {
    const nuevasResponsabilidades = [...(tercero.responsabilidadesTerceros || [])];
    nuevasResponsabilidades.splice(idx, 1);
    setTercero({ ...tercero, responsabilidadesTerceros: nuevasResponsabilidades });
  };


  const handleSave = (idx: number) => {
    if (isResponsabilidadAlreadyAssigned(editResponsabilidad.idResponsabilidadFiscal, idx)) {
      toast.error("Esta responsabilidad ya está agregada.");
      return;
    }

    const nuevasResponsabilidades = [...(tercero.responsabilidadesTerceros || [])];
    nuevasResponsabilidades[idx] = { ...editResponsabilidad };
    setTercero({
      ...tercero,
      responsabilidadesTerceros: nuevasResponsabilidades,
    });
    setEditIdx(null);
  };


  const handleCancel = () => {
    setEditIdx(null);
  };



  const handleSaveEmpresa = async () => {
    if (!empresa.nitEmpresa || !empresa.nitEmpresa.trim()) {
      setFormError("El número de NIT es obligatorio.");
      return;
    }


    if (!selectedMedioPago || selectedMedioPago === 0) {
      setFormError("El medio de pago es obligatorio.");
      return;
    }


    if (!empresa.idTipoPersona || empresa.idTipoPersona === 0) {
      setFormError("El tipo de persona es obligatorio.");
      return;
    }


    const empresaToSave: IEmpresas = {
      ...empresa,
      notaFe1: notasFe[0] || null,
      notaFe2: notasFe[1] || null,
      notaFe3: notasFe[2] || null,
    };

    setFormError(null);
    try {
      await EmpresaService.update(empresaToSave);
      setSuccessMessage("Empresa actualizada correctamente");
      setShowSuccessDialog(true);
      fetchEmpresa();
    } catch (error) {
      console.error("Error al actualizar la empresa:", error);
      toast.error("Error al guardar la información de la empresa");
    }
  };

  const fetchEmpresa = async () => {
    try {
      setEmpresaError(null);
      setIsLoadingEmpresa(true);
      const response = await EmpresaService.get();

      // Normalizar la respuesta por si el backend retorna un Array o un wrapper { data: ... }
      const data = (Array.isArray(response)
        ? response[0]
        : response && typeof response === "object" && "data" in response
          ? (response as { data?: IEmpresas }).data
          : response) as IEmpresas | undefined;

      if (data && Object.keys(data).length > 0) {
        setEmpresa({
          ...data,
          fechaGrabacionEmpresa: data.fechaGrabacionEmpresa
            ? new Date(data.fechaGrabacionEmpresa).toISOString().split("T")[0]
            : null,
        });

        // Cargar notas de Facturación Electrónica si existen
        const notas: string[] = [];
        if (data.notaFe1) notas.push(data.notaFe1);
        if (data.notaFe2) notas.push(data.notaFe2);
        if (data.notaFe3) notas.push(data.notaFe3);
        setNotasFe(notas);

        const unified = data.idMedioPagoContado || data.idMedioPagoCredito || 0;
        setSelectedMedioPago(unified);
      }
    } catch (error) {
      console.error("Error al obtener la empresa:", error);
      setEmpresaError("Error al cargar los datos de la empresa");
    } finally {
      setIsLoadingEmpresa(false);
    }
  };

  const fetchTipoDocumentoIdentidad = async () => {
    try {
      setTipoError(null);
      const data = await TipoDocumentoIdentidadService.getAll();
      setTiposDocumentoIdentidad([
        {
          idTipoDocumentoId: 0,
          nombreTipoDocumentoId: "Seleccione un tipo de documento",
          codigoTipoDocumentoId: "0",
          observacionTipoDocumentoId: null,
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
      setTipoError("Error al cargar los tipos de documento");
    }
  };

  const fetchMunicipios = async () => {
    try {
      const data = await MunicipioService.getAll();
      setMunicipiosPorDepartamento(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchDepartamentos = async () => {
    try {
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
    }
  };

  const fetchMediosPago = async () => {
    try {
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
    }
  };

  const fetchTiposPersona = async () => {
    try {
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
    }
  };

  const fetchResponsabilidadesFiscales = async () => {
    try {
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
    }
  };

  const fetchTiposRegimen = async () => {
    try {
      const data = await TipoRegimenService.getAll();
      setTiposRegimen([
        {
          idTipoRegimen: 0,
          codigoTipoRegimen: "0",
          nombreTipoRegimen: "Seleccione un tipo de régimen",
          idTipoRegimenFe: null,
        },
        ...data,
      ]);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchListaPrecios = async () => {
    try {
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
    }
  };

  useEffect(() => {
    fetchTipoDocumentoIdentidad();
    fetchDepartamentos();
    fetchMunicipios();
    fetchResponsabilidadesFiscales();
    fetchTiposRegimen();
    fetchListaPrecios();
    fetchEmpresa();
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
          <h2 className="text-2xl font-bold">Configuración de la Empresa</h2>
          <p className="text-muted-foreground text-sm">
            Gestión del perfil único de empresa usuaria
          </p>
        </div>        
        <div className="flex gap-2">
          <Button
          variant={isEditing ? "destructive" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancelar Edición" : "Modo Edición"}
          <Pencil className="w-4 h-4 mr-2"/>
          </Button>
          <Button
            variant="default"
            title="Guardar empresa"
            onClick={handleSaveEmpresa}
            disabled={!isEditing}
          >
            <Save className="w-4 h-4 mr-2" />
            Guardar
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

      {isLoadingEmpresa ? (
        <div className="text-center py-8 text-muted-foreground">
          Cargando información de la empresa...
        </div>
      ) : empresaError ? (
        <div className="text-center py-8 text-red-500">{empresaError}</div>
      ) : (
        <>
          {/* Campos de empresas */}
          <div className="w-full">
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
                    disabled={isFormDisabled}
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
                    disabled={isFormDisabled}
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
                    Dígito de Verificación
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
                    disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                          (t) => t.idTipoPersona === id
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
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
                      type="text"
                      value={empresa.telefonoEmpresa || ""}
                      onChange={(e) => {
                        const digitos = e.target.value.replace(/\D/g, "");
                        const digitosLimitados = digitos.slice(0, 10);

                        let formatoTelefono = digitosLimitados;
                        if (
                          digitosLimitados.length > 3 &&
                          digitosLimitados.length <= 6
                        ) {
                          formatoTelefono = `${digitosLimitados.slice(0, 3)} ${digitosLimitados.slice(3)}`;
                        } else if (digitosLimitados.length > 6) {
                          formatoTelefono = `${digitosLimitados.slice(0, 3)} ${digitosLimitados.slice(3, 6)} ${digitosLimitados.slice(6)}`;
                        }

                        setEmpresa({
                          ...empresa,
                          telefonoEmpresa: formatoTelefono,
                        });
                      }}
                      placeholder="Ej: 300 123 4567"
                      disabled={isFormDisabled}
                      className={
                        (!empresa.telefonoEmpresa || !empresa.telefonoEmpresa.trim()) && formError
                          ? "border border-red-500"
                          : ""
                      }
                    />
                    {formError && (!empresa.telefonoEmpresa || !empresa.telefonoEmpresa.trim()) && (
                      <span className="text-xs text-red-500">El teléfono es obligatorio.</span>
                    )}
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
                          idMunicipio: 0,
                        });
                      }}
                      required
                      disabled={isFormDisabled}
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
                      disabled={isFormDisabled}
                    >
                      <option value={0}>Seleccione un municipio</option>
                      {municipiosPorDepartamento
                        .find(
                          (dep) => dep.idDepartamento === empresa.idDepartamento
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
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Email de la Empresa
                    </label>
                    <Input
                      type="email"
                      value={empresa.emailEmpresa ?? ""}
                      onChange={(e) => {
                        const emailLimpio = e.target.value
                          .toLowerCase()
                          .replace(/\s/g, "");
                        setEmpresa({ ...empresa, emailEmpresa: emailLimpio });
                      }}
                      placeholder="Email"
                      disabled={isFormDisabled}
                      aria-label="Email de la Empresa"
                      className={
                        (formError && !empresa.emailEmpresa?.trim()) ||
                        (empresa.emailEmpresa?.trim() &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.emailEmpresa))
                          ? "border border-red-500"
                          : ""
                      }
                    />
                    {empresa.emailEmpresa?.trim() &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(empresa.emailEmpresa) && (
                        <span className="text-xs text-red-500">
                          El formato de correo electrónico no es válido.
                        </span>
                      )}
                    {formError && !empresa.emailEmpresa?.trim() && (
                      <span className="text-xs text-red-500">
                        El correo electrónico es obligatorio.
                      </span>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      ID del Representante Legal
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
                      disabled={isFormDisabled}
                      className={
                        !empresa.idRepresentanteLegal?.trim() && formError
                          ? "border border-red-500"
                          : ""
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Email del Representante Legal
                    </label>
                    <Input
                      type="email"
                      value={empresa.correoElectronicoRepresentante ?? ""}
                      onChange={(e) => {
                        const emailLimpio = e.target.value
                          .toLowerCase()
                          .replace(/\s/g, "");
                        setEmpresa({
                          ...empresa,
                          correoElectronicoRepresentante: emailLimpio,
                        });
                      }}
                      placeholder="Email del Representante Legal"
                      disabled={isFormDisabled}
                      aria-label="Email del Representante Legal"
                      className={
                        (formError &&
                          !empresa.correoElectronicoRepresentante?.trim()) ||
                        (empresa.correoElectronicoRepresentante?.trim() &&
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                            empresa.correoElectronicoRepresentante
                          ))
                          ? "border border-red-500"
                          : ""
                      }
                    />
                    {empresa.correoElectronicoRepresentante?.trim() &&
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                        empresa.correoElectronicoRepresentante
                      ) && (
                        <span className="text-xs text-red-500">
                          El formato de correo electrónico no es válido.
                        </span>
                      )}
                    {formError &&
                      !empresa.correoElectronicoRepresentante?.trim() && (
                        <span className="text-xs text-red-500">
                          El correo electrónico es obligatorio.
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
                          (m) => m.idMedioPago === newId
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
                      disabled={isFormDisabled}
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
                  </div>
                </div>
                <div className="md:col-span-4 mt-4 space-y-6">
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.habilitacionFacturacion ? "Sí" : "No"}
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.responsableIva ? "Sí" : "No"}
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.granContribuyente ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">
                        Autoretenedor de IVA
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.autoretenedor ? "Sí" : "No"}
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.responsableImpoConsumo ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-muted-foreground mb-1">
                        Agente de Retención de IVA
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.agenteRetenedorIva ? "Sí" : "No"}
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
                          disabled={isFormDisabled}
                          className="w-4 h-4 text-primary bg-background border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="text-sm text-muted-foreground">
                          {empresa.agenteRetenedorRenta ? "Sí" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tarifas y ambiente */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-4">
                      <label className="text-xs text-muted-foreground w-32">
                        ID Tipo Asignación Resol.
                      </label>
                      <Input
                        value={empresa.idTipoAsignacionResolucion ?? ""}
                        onChange={(e) =>
                          setEmpresa({
                            ...empresa,
                            idTipoAsignacionResolucion: Number(e.target.value),
                          })
                        }
                        placeholder="ID Tipo Asignación"
                        disabled={isFormDisabled}
                        className="flex-1 max-w-xs"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-xs text-muted-foreground min-w-32">
                        Tarifa ReteIca
                      </label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        value={
                          tarifaReteIcaStrRef.current ||
                          (empresa.tarifaReteIca === 0 || empresa.tarifaReteIca === null
                            ? ""
                            : (empresa.tarifaReteIca ?? "").toString())
                        }
                        onChange={(e) => {
                          const rawValue = e.target.value;

                          if (/^[0-9]*[.,]?[0-9]*$/.test(rawValue)) {
                            tarifaReteIcaStrRef.current = rawValue;

                            if (rawValue === "") {
                              tarifaReteIcaStrRef.current = "";
                              setEmpresa({
                                ...empresa,
                                tarifaReteIca: 0,
                              });
                              return;
                            }

                            const normalized = rawValue.replace(",", ".");
                            const parsed = parseFloat(normalized);
                            const numericValue = Number.isNaN(parsed) ? 0 : parsed;

                            setEmpresa({
                              ...empresa,
                              tarifaReteIca: numericValue,
                            });
                          }
                        }}
                        placeholder="Tarifa ReteIca"
                        disabled={isFormDisabled}
                        className="w-48"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="text-xs text-muted-foreground min-w-32">
                        Tarifa ReteIva
                      </label>
                      <Input
                        type="text"
                        inputMode="decimal"
                        pattern="[0-9]*[.,]?[0-9]*"
                        value={
                          tarifaReteIvaStrRef.current ||
                          (empresa.tarifaReteIva === 0 || empresa.tarifaReteIva === null
                            ? ""
                            : (empresa.tarifaReteIva ?? "").toString())
                        }
                        onChange={(e) => {
                          const rawValue = e.target.value;

                          if (/^[0-9]*[.,]?[0-9]*$/.test(rawValue)) {
                            tarifaReteIvaStrRef.current = rawValue;

                            if (rawValue === "") {
                              tarifaReteIvaStrRef.current = "";
                              setEmpresa({
                                ...empresa,
                                tarifaReteIva: 0,
                              });
                              return;
                            }

                            const normalized = rawValue.replace(",", ".");
                            const parsed = parseFloat(normalized);
                            const numericValue = Number.isNaN(parsed) ? 0 : parsed;

                            setEmpresa({
                              ...empresa,
                              tarifaReteIva: numericValue,
                            });
                          }
                        }}
                        placeholder="Tarifa ReteIva"
                        disabled={isFormDisabled}
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
                        disabled={isFormDisabled}
                        className="w-48"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

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
                                    selectedId
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
                            {getResponsabilidadesDisponibles(
                              idx,
                              editResponsabilidad.idResponsabilidadFiscal
                            )
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
                        <td className="px-4 py-2 flex gap-2 items-center">
                          <button
                            className="text-blue-600 font-semibold flex items-center disabled:opacity-50"
                            onClick={() => handleEdit(idx)}
                            title="Editar"
                            disabled={!isEditing}
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 font-semibold flex items-center disabled:opacity-50"
                            onClick={() => handleDelete(idx)}
                            title="Eliminar"
                            disabled={!isEditing}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
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
                                String(t.idResponsabilidadFiscal) === selectedId
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
                        {getResponsabilidadesDisponibles()
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
                        <CircleX className="w-6 h-6" />
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={3} className="px-0 py-2">
                      <button
                        className="bg-black text-white font-semibold px-4 py-2 rounded text-left disabled:opacity-50"
                        onClick={() => setAddMode(true)}
                        disabled={!isEditing}
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
                  <th className="px-4 py-2 text-left font-semibold">
                    Nota Facturación Electrónica
                  </th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {notasFe.map((nota, idx) => (
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
                        <td className="px-4 py-2 flex gap-2 items-center">
                          <button
                            className="text-blue-600 font-semibold flex items-center"
                            onClick={() => handleEditNota(idx)}
                            disabled={!isEditing}
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            className="text-red-600 font-semibold flex items-center"
                            onClick={() => handleDeleteNota(idx)}
                            disabled={!isEditing}
                            title="Eliminar"
                          >
                            <Trash className="w-4 h-4" />
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
                        placeholder="Nueva nota Facturación Electrónica"
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
                        disabled={!isEditing}
                      >
                        + Agregar nota Facturación Electrónica
                      </button>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Card>
        </>
      )}

      {/* Dialog de éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Operación exitosa!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}