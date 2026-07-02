import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Printer, Loader2 } from "lucide-react";
import { VentaService } from '@/services/VentaService';

interface FacturaModalProps {
  idVenta: number;
  idMetodoDian?: number;
  facturaData?: any;
  triggerText?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

const FacturaModal: React.FC<FacturaModalProps> = ({
  idVenta,
  idMetodoDian = 1,
  facturaData,
  triggerText = "Ver Factura",
  triggerVariant = "default",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar el PDF cuando se abre el modal
  useEffect(() => {
    if (isOpen && !pdfUrl) {
      loadPdf();
    }
  }, [isOpen]);

  // Limpiar URL cuando se cierra el modal
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const loadPdf = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const pdfBlob = await VentaService.previewPdf(idVenta, idMetodoDian);
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
    } catch (err) {
      console.error('Error al cargar PDF:', err);
      setError('Error al cargar la factura. Por favor intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const pdfBlob = await VentaService.previewPdf(idVenta, idMetodoDian);
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = getFileName();
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error al descargar PDF:', err);
    }
  };

  const getFileName = () => {
    if (facturaData?.numeroVenta) {
      return `Factura_${facturaData.numeroVenta}.pdf`;
    }
    return `Factura_${idVenta}_${new Date().toISOString().split('T')[0]}.pdf`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className="h-10 px-4 flex items-center gap-2">
          <Printer size={16} />
          {triggerText}
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Factura Electrónica</span>
            <div className="flex items-center gap-2">
              {facturaData?.numeroVenta && (
                <Badge variant="secondary">
                  {facturaData.numeroVenta}
                </Badge>
              )}

              {/* Botón de descarga */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isLoading || !pdfUrl}
                className="flex items-center gap-2"
              >
                <Download size={14} />
                Descargar PDF
              </Button>
            </div>
          </DialogTitle>

          <DialogDescription>
            {facturaData?.clienteRazonSocial
              ? `Cliente: ${facturaData.clienteRazonSocial}`
              : 'Vista previa de la factura electrónica'
            }
            {facturaData?.fechaHoraAutorizacion &&
              ` - Fecha: ${facturaData.fechaHoraAutorizacion}`
            }
          </DialogDescription>
        </DialogHeader>

        {/* Visor del PDF */}
        <div className="flex-1 border rounded-lg overflow-hidden bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-600">Cargando factura...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="mb-4">{error}</p>
                <Button onClick={loadPdf} variant="outline">
                  Reintentar
                </Button>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              className="w-full h-full"
              title="Vista previa de factura"
            />
          ) : null}
        </div>

        {/* Footer con información adicional */}
        <div className="flex justify-between items-center pt-4 border-t text-sm text-gray-600">
          <div className="flex items-center gap-4">
            {facturaData?.totalVenta && (
              <span className="font-semibold">
                Total: {new Intl.NumberFormat('es-CO', {
                  style: 'currency',
                  currency: 'COP'
                }).format(facturaData.totalVenta)}
              </span>
            )}

            {facturaData?.items?.length && (
              <span>Items: {facturaData.items.length}</span>
            )}
          </div>

          <div className="text-xs text-gray-500">
            {facturaData?.fechaHoraAutorizacion || 'Generado automáticamente'}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FacturaModal;