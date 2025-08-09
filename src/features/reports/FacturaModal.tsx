import React, { useState } from 'react';
import { PDFViewer, PDFDownloadLink } from '@react-pdf/renderer';
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
import { Download, Eye, Printer, X } from "lucide-react";
import FacturaElectronica from './FacturaReport'; // Tu componente existente
import FacturaReportTira from './FacturaReportTira';

interface FacturaModalProps {
  facturaData?: any; // Reemplaza con el tipo específico de tu factura
  triggerText?: string;
  triggerVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  idMetodoDian?: number;
}

const FacturaModal: React.FC<FacturaModalProps> = ({
  facturaData,
  triggerText = "Ver Factura",
  triggerVariant = "default",
  idMetodoDian = 1
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Función para obtener el componente PDF correcto según idMetodoDian
  const getPDFComponent = () => {
    switch (idMetodoDian) {
      case 1:
        return <FacturaElectronica facturaData={facturaData} />;
      case 2:
        return <FacturaReportTira facturaData={facturaData} />;
      default:
        return <FacturaElectronica facturaData={facturaData} />;
    }
  };

  // Generar nombre del archivo basado en los datos de la factura
  const getFileName = () => {
    if (facturaData?.numeroVenta) {
      return `Factura_${facturaData.numeroVenta}.pdf`;
    }
    return `Factura_${new Date().toISOString().split('T')[0]}.pdf`;
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
              <PDFDownloadLink
                document={<FacturaElectronica facturaData={facturaData} />}
                fileName={getFileName()}
              >
                {({ blob, url, loading, error }) => (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    className="flex items-center gap-2"
                  >
                    <Download size={14} />
                    {loading ? 'Generando...' : 'Descargar PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
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
          <PDFViewer
            width="100%"
            height="100%"
            showToolbar={true}
            className="border-0"
          >
            {getPDFComponent()}
          </PDFViewer>
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

// Componente de ejemplo de uso
const FacturaExample: React.FC = () => {
  // Datos de ejemplo (puedes usar los mismos datos por defecto del componente original)
  const facturaEjemplo = {
    empresa: {
      nombre: 'ROSA MARCELA PEA BUSTOS',
      nit: '40341382',
    },
    factura: {
      numero: 'EFE-4',
      fechaEmision: '18/07/2025',
    },
    cliente: {
      nombre: 'BIOSERVI SOLUCIONES S.A.S',
    },
    totales: {
      totalPagar: 13347190,
    },
    items: [
      { item: 1, descripcion: 'Producto ejemplo' }
    ]
  };

  return (
    <div className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">Sistema de Facturación</h1>

      <div className="flex gap-4">
        {/* Diferentes variantes del botón trigger */}
        <FacturaModal
          facturaData={facturaEjemplo}
          triggerText="Ver Factura Completa"
          triggerVariant="default"
        />

        <FacturaModal
          facturaData={facturaEjemplo}
          triggerText="Vista Rápida"
          triggerVariant="outline"
        />

        <FacturaModal
          facturaData={facturaEjemplo}
          triggerText="Previsualizar"
          triggerVariant="secondary"
        />
      </div>
    </div>
  );
};

export { FacturaModal, FacturaExample };
export default FacturaModal;