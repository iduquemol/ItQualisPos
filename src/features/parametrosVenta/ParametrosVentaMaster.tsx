import { Button } from "@/components/ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Trash, Plus, X, Package, RefreshCw, FileText, ShieldCheck, Calculator } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ParametrosVentasService } from "@/services/ParametrosVentaService";
import { IParametrosVentaDefault } from "@/types/IParametrosVentaDefault";
import { IParametrosVentas } from "@/types/IParametrosVenta";

export default function ParametrosVentaMaster() {
  const navigate = useNavigate();

  // Estado completo del formulario
  const [parametros, setParametros] = useState<IParametrosVentas>({
    idParametroVenta: 0,
    idTerceroDefault: null,
    idTipoDocumentoDefault: null,
    idTipoNotaCreditoDefault: null,
    idTipoCotizacionDefault: null,
    idListaPrecioDefault: null,
    idTipoRegimenClienteDefault: null,
    diasAceptacionTacita: 3,
    ambienteEnvioDian: 1, // 1: Habilitación, 2: Producción
    idEnvironment: "",
    pinEnvironment: "",
    nombreFabricante: "",
    nombreSoftware: "",
    valorUVT: 0,
    aplicaTopeReteIva: false,
    aplicaTopeReteRenta: false,
    aplicaTopeRetelca: false,
  });

  // Datos para poblar los dropdowns
  const [dataDefaults, setDataDefaults] = useState<IParametrosVentaDefault | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modales y mensajes
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false);

  const fetchParametrosDefaults = async () => {
    try {
      setIsLoading(true);
      const data = await ParametrosVentasService.getDefault();
      setDataDefaults(data);

      if (data) {
        setParametros((prev) => ({
          ...prev,
          idParametroVenta: 0,
          idTerceroDefault: data.terceroVenta?.[0]?.idTercero ?? null,
          idTipoDocumentoDefault: data.documentoVenta?.[0]?.idTipoDocumento ?? null,
          idTipoNotaCreditoDefault: data.documentoNotaCredito?.[0]?.idTipoDocumento ?? null,
          idTipoCotizacionDefault: data.documentoCotizacion?.[0]?.idTipoDocumento ?? null,
          idListaPrecioDefault: (data as any).listaPrecios?.[0]?.idListaPrecio ?? null,
          idTipoRegimenClienteDefault: (data as any).tipoRegimen?.[0]?.idTipoRegimen ?? null,
        }));
      }
    } catch (error) {
      console.error("Error al cargar parámetros por defecto:", error);
      toast.error("Error al cargar los parámetros de venta por defecto");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchParametrosDefaults();
  }, []);

  const handleNew = () => {
    if (dataDefaults) {
      setParametros({
        idParametroVenta: 0,
        idTerceroDefault: dataDefaults.terceroVenta?.[0]?.idTercero ?? null,
        idTipoDocumentoDefault: dataDefaults.documentoVenta?.[0]?.idTipoDocumento ?? null,
        idTipoNotaCreditoDefault: dataDefaults.documentoNotaCredito?.[0]?.idTipoDocumento ?? null,
        idTipoCotizacionDefault: dataDefaults.documentoCotizacion?.[0]?.idTipoDocumento ?? null,
        idListaPrecioDefault: (dataDefaults as any).listaPrecios?.[0]?.idListaPrecio ?? null,
        idTipoRegimenClienteDefault: (dataDefaults as any).tipoRegimen?.[0]?.idTipoRegimen ?? null,
        diasAceptacionTacita: 3,
        ambienteEnvioDian: 1,
        idEnvironment: "",
        pinEnvironment: "",
        nombreFabricante: "",
        nombreSoftware: "",
        valorUVT: 0,
        aplicaTopeReteIva: false,
        aplicaTopeReteRenta: false,
        aplicaTopeRetelca: false,
      });
    }
    setFormError(null);
  };

  const handleSaveParametros = async () => {
    if (!parametros.idTerceroDefault || !parametros.idTipoDocumentoDefault) {
      setFormError("Debe seleccionar al menos el Tercero y el Documento de Venta.");
      return;
    }

    setFormError(null);
    try {
      if (parametros.idParametroVenta && parametros.idParametroVenta > 0) {
        await ParametrosVentasService.update(parametros);
        setSuccessMessage("Parámetros de venta actualizados correctamente");
      } else {
        await ParametrosVentasService.create(parametros);
        setSuccessMessage("Parámetros de venta guardados correctamente");
      }
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Error al guardar los parámetros de venta:", error);
      toast.error("Error al guardar los parámetros de venta");
    }
  };

  const handleDeleteParametros = () => {
    if (!parametros.idParametroVenta) {
      toast.error("No hay un parámetro de venta guardado seleccionado para eliminar");
      return;
    }
    setShowDeleteDialog(true);
  };

  const confirmDeleteParametros = async () => {
    try {
      toast.success("Parámetros eliminados correctamente");
      handleNew();
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error al eliminar:", error);
      toast.error("Error al eliminar los parámetros");
      setShowDeleteDialog(false);
    }
  };

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

      {/* Header con Acciones */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Parámetros de Ventas</h2>
          <p className="text-muted-foreground text-sm">
            Configuración general, fiscal y DIAN por defecto para ventas
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="default"
            size="icon"
            title="Nuevo parámetro"
            onClick={handleNew}
            className="bg-primary hover:bg-primary/90 text-white shadow-md transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            title="Recargar valores por defecto"
            onClick={fetchParametrosDefaults}
            disabled={isLoading}
          >
            <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="default" title="Guardar parámetros" onClick={handleSaveParametros}>
            <Save className="w-4 h-4 mr-2" />
            Guardar
          </Button>

          <Button variant="default" title="Eliminar parámetros" onClick={handleDeleteParametros}>
            <Trash className="w-4 h-4 mr-2" />
            Eliminar
          </Button>

          <Button
            variant="default"
            size="icon"
            title="Salir"
            onClick={() => navigate("/main-menu")}
            className="bg-red-600 hover:bg-red-700 text-white shadow-md transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Tabs Formulario */}
      <Tabs defaultValue="documentos" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4 bg-background/50 p-1 rounded-lg">
          <TabsTrigger value="documentos" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documentos y Terceros
          </TabsTrigger>
          <TabsTrigger value="dian" className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            Configuración DIAN
          </TabsTrigger>
          <TabsTrigger value="fiscal" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Valores Fiscales y Retenciones
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DOCUMENTOS Y TERCEROS */}
        <TabsContent value="documentos">
          <Card className="p-6">
            {isLoading ? (
              <div className="p-8 text-center text-muted-foreground">Cargando opciones...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tercero Venta */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Tercero Venta por Defecto *
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idTerceroDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idTerceroDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione un tercero...</option>
                    {dataDefaults?.terceroVenta?.map((t) => (
                      <option key={t.idTercero} value={t.idTercero}>
                        {t.razonSocial || `${t.primerNombre} ${t.primerApellido}`}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Documento Venta */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Documento Venta por Defecto *
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idTipoDocumentoDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idTipoDocumentoDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione un documento...</option>
                    {dataDefaults?.documentoVenta?.map((d) => (
                      <option key={d.idTipoDocumento} value={d.idTipoDocumento}>
                        {d.nombreDocumento} ({d.codigoDocumento})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Nota Crédito */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Documento Nota Crédito por Defecto
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idTipoNotaCreditoDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idTipoNotaCreditoDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione nota crédito...</option>
                    {dataDefaults?.documentoNotaCredito?.map((d) => (
                      <option key={d.idTipoDocumento} value={d.idTipoDocumento}>
                        {d.nombreDocumento} ({d.codigoDocumento})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cotización */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Documento Cotización por Defecto
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idTipoCotizacionDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idTipoCotizacionDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione cotización...</option>
                    {dataDefaults?.documentoCotizacion?.map((d) => (
                      <option key={d.idTipoDocumento} value={d.idTipoDocumento}>
                        {d.nombreDocumento} ({d.codigoDocumento})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Lista de Precios */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Lista de Precios por Defecto
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idListaPrecioDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idListaPrecioDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione lista de precios...</option>
                    {((dataDefaults as any)?.listaPrecios || [])?.map((lp: any) => (
                      <option key={lp.idListaPrecio} value={lp.idListaPrecio}>
                        {lp.nombreListaPrecio || lp.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Régimen Cliente */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Régimen Cliente por Defecto
                  </label>
                  <select
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.idTipoRegimenClienteDefault ?? ""}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        idTipoRegimenClienteDefault: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                  >
                    <option value="">Seleccione régimen...</option>
                    {((dataDefaults as any)?.tipoRegimen || [])?.map((r: any) => (
                      <option key={r.idTipoRegimen} value={r.idTipoRegimen}>
                        {r.nombreRegimen || r.descripcion}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Días Aceptación Tácita */}
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    Días Aceptación Tácita
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                    value={parametros.diasAceptacionTacita ?? 3}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        diasAceptacionTacita: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
            )}
          </Card>
        </TabsContent>

        {/* TAB 2: CONFIGURACIÓN DIAN */}
        <TabsContent value="dian">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Ambiente Envío DIAN */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Ambiente de Envío DIAN
                </label>
                <select
                  className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                  value={parametros.ambienteEnvioDian ?? 1}
                  onChange={(e) =>
                    setParametros({
                      ...parametros,
                      ambienteEnvioDian: Number(e.target.value),
                    })
                  }
                >
                  <option value={1}>1 - Habilitación / Pruebas</option>
                  <option value={2}>2 - Producción</option>
                </select>
              </div>

              {/* ID Environment (Readonly) */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  ID Environment (DIAN)
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 text-sm border rounded-md bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                  value={parametros.idEnvironment || "Generado por DIAN"}
                />
              </div>

              {/* PIN Environment (Readonly) */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  PIN Environment
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 text-sm border rounded-md bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                  value={parametros.pinEnvironment || "No asignado"}
                />
              </div>

              {/* Nombre Fabricante (Readonly) */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Fabricante
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 text-sm border rounded-md bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                  value={parametros.nombreFabricante || "IT Qualis"}
                />
              </div>

              {/* Nombre Software (Readonly) */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Nombre Software
                </label>
                <input
                  type="text"
                  readOnly
                  className="w-full p-2 text-sm border rounded-md bg-muted text-muted-foreground cursor-not-allowed focus:outline-none"
                  value={parametros.nombreSoftware || "Astil POS"}
                />
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TAB 3: FISCAL Y RETENCIONES */}
        <TabsContent value="fiscal">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valor UVT */}
              <div>
                <label className="block text-xs text-muted-foreground mb-1">
                  Valor UVT Vigente ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 text-sm border rounded-md bg-background focus:ring-2 focus:ring-primary"
                  value={parametros.valorUVT ?? 0}
                  onChange={(e) =>
                    setParametros({
                      ...parametros,
                      valorUVT: Number(e.target.value),
                    })
                  }
                />
              </div>

              {/* Checkboxes Retenciones */}
              <div className="flex flex-col justify-center gap-3 border p-4 rounded-md bg-background">
                <span className="text-xs font-semibold text-muted-foreground">
                  Aplicación de Topes
                </span>
                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    checked={parametros.aplicaTopeReteIva ?? false}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        aplicaTopeReteIva: e.target.checked,
                      })
                    }
                  />
                  <span>Aplica Tope ReteIVA</span>
                </label>

                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    checked={parametros.aplicaTopeReteRenta ?? false}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        aplicaTopeReteRenta: e.target.checked,
                      })
                    }
                  />
                  <span>Aplica Tope ReteRenta</span>
                </label>

                <label className="flex items-center space-x-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    checked={parametros.aplicaTopeRetelca ?? false}
                    onChange={(e) =>
                      setParametros({
                        ...parametros,
                        aplicaTopeRetelca: e.target.checked,
                      })
                    }
                  />
                  <span>Aplica Tope ReteICA</span>
                </label>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Alerta de Error local */}
      {formError && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 text-xs rounded-md font-medium">
          {formError}
        </div>
      )}

      {/* AlertDialog Éxito */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¡Operación Exitosa!</AlertDialogTitle>
            <AlertDialogDescription>{successMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              Aceptar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AlertDialog Eliminación */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar eliminación</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro que desea eliminar la configuración de parámetros de venta actual?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteParametros}>
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}