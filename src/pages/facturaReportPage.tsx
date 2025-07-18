import FacturaReport from '@/features/reports/FacturaReport';
import { PDFViewer } from '@react-pdf/renderer';

const sampleData = [
  { id: 1, name: "Laptop Dell XPS 13", amount: 1299.99 },
  { id: 2, name: "Mouse Inalámbrico Logitech", amount: 45.50 },
  { id: 3, name: "Teclado Mecánico", amount: 89.75 },
  { id: 4, name: "Monitor 4K Samsung", amount: 349.99 },
  { id: 5, name: "Auriculares Bluetooth", amount: 125.00 },
  { id: 6, name: "Webcam HD Logitech", amount: 67.99 },
  { id: 7, name: "Impresora HP LaserJet", amount: 199.99 },
  { id: 8, name: "Disco Duro Externo 1TB", amount: 79.99 },
  { id: 9, name: "Cable USB-C", amount: 12.99 },
  { id: 10, name: "Adaptador HDMI", amount: 24.99 },
  { id: 11, name: "Memoria RAM 16GB", amount: 89.99 },
  { id: 12, name: "SSD 500GB", amount: 69.99 },
  { id: 13, name: "Router Wi-Fi 6", amount: 159.99 },
  { id: 14, name: "Tablet Samsung Galaxy", amount: 299.99 },
  { id: 15, name: "Smartphone iPhone 14", amount: 999.99 }
];

export default function FacturaReportPage() {
  return (
    <div className="w-full h-screen">
      <PDFViewer 
        style={{ height: '100%', width: '100%' }} 
        className="w-full h-full"
      >
        <FacturaReport data={sampleData} />
      </PDFViewer>
    </div>
  );
}