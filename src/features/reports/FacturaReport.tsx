import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font, Image } from '@react-pdf/renderer';

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    paddingTop: 20,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    lineHeight: 1.2,
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  companySection: {
    marginBottom: 15,
  },
  companyName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  leftColumn: {
    width: '50%',
  },
  rightColumn: {
    width: '50%',
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  facturaInfo: {
    backgroundColor: '#f8f8f8',
    padding: 10,
    marginBottom: 15,
    border: '1px solid #ddd',
  },
  facturaHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  cufeText: {
    fontSize: 8,
    wordBreak: 'break-all',
    marginBottom: 8,
  },
  clientSection: {
    marginBottom: 15,
    padding: 10,
    border: '1px solid #ddd',
  },
  clientHeader: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
    padding: 5,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    minHeight: 25,
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
    fontSize: 8,
  },
  tableCell: {
    flex: 1,
    padding: 2,
    textAlign: 'center',
    fontSize: 7,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  tableCellLast: {
    flex: 1,
    padding: 2,
    textAlign: 'center',
    fontSize: 6,
  },
  tableCellWide: {
    flex: 3,
    padding: 4,
    textAlign: 'left',
    fontSize: 8,
    borderRightWidth: 1,
    borderRightColor: '#000',
    borderRightStyle: 'solid',
  },
  totalsSection: {
    marginTop: 15,
    alignItems: 'flex-end',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginBottom: 3,
    paddingHorizontal: 10,
  },
  totalLabel: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  totalValue: {
    fontSize: 9,
    textAlign: 'right',
  },
  finalTotal: {
    backgroundColor: '#f0f0f0',
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    fontWeight: 'bold',
    fontSize: 11,
  },
  observaciones: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#f8f8f8',
    border: '1px solid #ddd',
  },
  autorizacion: {
    marginTop: 15,
    fontSize: 8,
    padding: 10,
    backgroundColor: '#f8f8f8',
    border: '1px solid #ddd',
  },
  firma: {
    marginTop: 15,
    fontSize: 7,
    padding: 10,
    backgroundColor: '#f8f8f8',
    border: '1px solid #ddd',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    fontSize: 8,
    color: '#666',
  },
});

// Types
type FacturaReportItem = {
  id: string | number;
  name: string;
  amount: number;
};

type FacturaReportProps = {
  data: FacturaReportItem[];
  reportTitle?: string;
};

// Componente de la factura

type FacturaElectronicaProps = {
  facturaData?: any; // Replace 'any' with a more specific type if available
};

const FacturaElectronica: React.FC<FacturaElectronicaProps> = ({ facturaData }) => {
  // Datos por defecto si no se proporcionan
  const defaultData = {
    empresa: {
      nombre: 'ROSA MARCELA PEA BUSTOS',
      nit: '40341382',
      tipoContribuyente: 'Persona Jurídica',
      tipoResponsabilidad: '01 - IVA',
      regimenFiscal: 'R-99-PN (No aplica – Otros)',
      actividadEconomica: '4731;4732',
      municipio: 'La Primavera',
      direccion: 'CL 13 CR 5 18 BRR SAN FERNANDO',
      correo: 'eds.llanura@gmail.com',
      telefono: '3124314808',
    },
    factura: {
      numero: 'EFE-4',
      cufe: 'cdfe136ae599859c8f8b4134d380b1c0f472fbffa06f2e517022e77f7f23abab6c5eb4734ec99e32c34d45cc1363011f',
      fechaEmision: '18/07/2025',
      fechaVencimiento: '18/07/2025',
      ordenReferencia: '-',
      medioPago: 'Efectivo',
      prefijo: 'EFE',
      formaPago: 'Contado',
      tipoOperacion: 'Estandar',
      plazo: '',
    },
    cliente: {
      nombre: 'BIOSERVI SOLUCIONES S.A.S',
      nit: '901326353',
      tipoDocumento: 'NIT',
      tipoPersona: 'Persona Juridica',
      departamento: 'Vichada',
      municipio: 'La Primavera',
      direccion: '',
      correo: 'bioservisoluciones@gmail.com',
      telefono: '',
      regimenFiscal: 'R-99-PN (No aplica – Otros)',
      tipoResponsabilidad: 'ZZ - No aplica',
    },
    items: [
      {
        item: 1,
        codigo: 'P0009',
        descripcion: 'MOBIL 4T 20W50 SUPER  CUARTO',
        cantidad: 40,
        unidadMedida: 'Unidad',
        valorUnitario: 30000,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 1200000,
      },
      {
        item: 2,
        codigo: 'P0016',
        descripcion: 'SUPERMOTO 2T  CUARTOPM',
        cantidad: 72,
        unidadMedida: 'Unidad',
        valorUnitario: 20500,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 1476000,
      },
      {
        item: 3,
        codigo: 'P0023',
        descripcion: 'TERPEL ULTREX 50  GALON',
        cantidad: 5,
        unidadMedida: 'Unidad',
        valorUnitario: 95000,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 475000,
      },
      {
        item: 4,
        codigo: 'P0018',
        descripcion: 'SUPERMOTO 4T 20W50  CUARTO',
        cantidad: 20,
        unidadMedida: 'Unidad',
        valorUnitario: 24600,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 492000,
      },
      {
        item: 4,
        codigo: 'P0018_1',
        descripcion: 'SUPERMOTO 4T 20W50  CUARTO',
        cantidad: 4,
        unidadMedida: 'Unidad',
        valorUnitario: 30000,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 120000,
      },
      {
        item: 5,
        codigo: 'P0013',
        descripcion: 'MOBIL MX 15W40  GALON',
        cantidad: 6,
        unidadMedida: 'Unidad',
        valorUnitario: 115000,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 690000,
      },
      {
        item: 5,
        codigo: 'ACPM',
        descripcion: 'ACPM',
        cantidad: 269,
        unidadMedida: 'Galon',
        valorUnitario: 10950,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 2945550,
      },
      {
        item: 6,
        codigo: 'Gasolina',
        descripcion: 'Gasolina Corriente',
        cantidad: 367.2,
        unidadMedida: 'Galon',
        valorUnitario: 16200,
        descuento: '0%',
        iva: '0%',
        inc: '',
        valorTotal: 5948640,
      },

    ],
    totales: {
      subtotalBruto: 13347190,
      descuentos: 0.00,
      recargos: 0.00,
      subtotalNeto: 13347190,
      impuestoIVA: 0.00,
      subtotalMasImpuestos: 13347190,
      reteRenta: 0.00,
      totalDeducciones: 0.00,
      totalPagar: 13347190,
    },
    observaciones: '',
    autorizacion: {
      numero: '18764095619176',
      rango: 'desde 1 hasta 100',
      expedida: '2025-07-15',
      vigencia: '12 meses',
      vencimiento: '2027-07-15',
    },
    firma: 'NzqvG6aG14hPSOA7+cojxHQoc82gKF1lAe8CZJWf3vJg/cVza4zxYvTv4fxwRGyGDV47VT4J8laeqJCi0jpEaH2TcvrPSEBtQTghyw7BhR/wrW21mk86qUMQHLkBSqZGEKqX9MXzoKvY0WWx2yD8Y/f9aaNc+BrQX1B3U7qvDF1fpb17G5u2AA6mmpx/kPBLLfrpsz2IB8qfznguXEMbq/syewiUFZO9WtAJv+3M+Qk2T9poPe9OwXKhcE7ceEU9ry2XumisjAmlj8bVLsXccuCEORqAp2Jkl3y/7lkzM0iNpoSn0oziXlOs/tk5XsNvfBdZkKsq8QdrOQaUEYsdRw==',
    moneda: 'COP',
    fechaHoraGeneracion: '2025-07-18 16:22:52',
  };

  const data = facturaData || defaultData;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text>Representación gráfica</Text>
          <Text>FACTURA ELECTRÓNICA DE VENTA {data.numeroVenta}</Text>
        </View>

        {/* Información de la empresa */}
        <View style={styles.companySection}>
          <Text style={styles.companyName}>{data.facturadorNombre}</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text><Text style={styles.label}>NIT:</Text> {data.facturadorNumeroIdentificacion}</Text>
              <Text><Text style={styles.label}>Tipo de contribuyente:</Text> {data.clienteTipoContribuyente}</Text>
              <Text><Text style={styles.label}>Tipo de responsabilidad:</Text> {data.facturadorResponsabilidadFiscal}</Text>
              <Text><Text style={styles.label}>Régimen fiscal:</Text> {data.facturadorTipoRegimen}</Text>
              <Text><Text style={styles.label}>Actividades económicas:</Text> {}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text><Text style={styles.label}>Municipio:</Text> {data.facturadorMunicipio}</Text>
              <Text><Text style={styles.label}>Dirección:</Text> {data.facturadorDireccion}</Text>
              <Text><Text style={styles.label}>Correo:</Text> {data.facturadorEmail}</Text>
              <Text><Text style={styles.label}>Teléfono:</Text> {data.facturadorTelefono}</Text>
            </View>
          </View>
        </View>

        {/* Información de la factura */}
        <View style={styles.facturaInfo}>
          {/* <Text style={styles.facturaHeader}>Software Qenta - NIT 901.195.532 - Qenta SAS - Desarrollo Propio Pag. 1 de 1</Text> */}
          <Text style={styles.cufeText}>CUFE: {data.cufe}</Text>
          
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text><Text style={styles.label}>Fecha de emisión:</Text> {data.fechaVenta}</Text>
              <Text><Text style={styles.label}>Fecha de vencimiento:</Text> {data.fechaVencimiento}</Text>
              <Text><Text style={styles.label}>Orden de referencia:</Text> {}</Text>
              <Text><Text style={styles.label}>Fecha y hora de autorización:</Text>{data.fechaHoraAutorizacion}</Text>
              <Text><Text style={styles.label}>Medio de pago:</Text> {}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text><Text style={styles.label}>Prefijo:</Text> {data.prefijoVenta}</Text>
              <Text><Text style={styles.label}>Forma de Pago:</Text> {data.nombreFormaPago}</Text>
              <Text><Text style={styles.label}>Tipo de operación:</Text> {}</Text>
              <Text><Text style={styles.label}>Plazo:</Text> {data.plazoDias}</Text>
            </View>
          </View>
        </View>

        {/* Información del cliente */}
        <View style={styles.clientSection}>
          <Text style={styles.clientHeader}>Adquiriente</Text>
          <View style={styles.row}>
            <View style={styles.leftColumn}>
              <Text><Text style={styles.label}>Nombres y apellidos:</Text> {data.clienteRazonSocial}</Text>
              <Text><Text style={styles.label}>Número de documento:</Text> {data.clienteTipoId} - {data.clienteNumeroIdentificacion}</Text>
              <Text><Text style={styles.label}>Departamento:</Text> {data.clienteMunicipio}</Text>
              <Text><Text style={styles.label}>Correo:</Text> {data.clienteEmail}</Text>
              <Text><Text style={styles.label}>Tipo de persona:</Text> {}</Text>
            </View>
            <View style={styles.rightColumn}>
              <Text><Text style={styles.label}>Municipio:</Text> {data.clienteMunicipio}</Text>
              <Text><Text style={styles.label}>Régimen fiscal:</Text> {data.clienteResponsabilidadFiscal}</Text>
              <Text><Text style={styles.label}>Dirección:</Text> {data.clienteDireccion}</Text>
              <Text><Text style={styles.label}>Tipo de responsabilidad:</Text> {data.clienteTipoRegimen}</Text>
              <Text><Text style={styles.label}>Teléfono:</Text> {data.clienteTelefono}</Text>
            </View>
          </View>
        </View>

        {/* Tabla de productos */}
        <Text style={[styles.label, { marginBottom: 5 }]}>Detalle de los productos y/o servicios facturados</Text>
        <View style={styles.table}>
          {/* Header de la tabla */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={styles.tableCell}>
              <Text>Item</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Código</Text>
            </View>
            <View style={styles.tableCellWide}>
              <Text>Descripción</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Cantidad</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>U. de Med.</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Valor unitario</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>Dcto</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>IVA</Text>
            </View>
            <View style={styles.tableCell}>
              <Text>INC</Text>
            </View>
            <View style={styles.tableCellLast}>
              <Text>Valor total</Text>
            </View>
          </View>

          {/* Filas de datos */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCell}>
                <Text>{item.registroVenta}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.codigoProducto}</Text>
              </View>
              <View style={styles.tableCellWide}>
                <Text>{item.nombreProducto}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.cantidadVenta.toFixed(2)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.nombreUnidadMedida}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{formatCurrency(item.precioUnitarioVenta)}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.porcentajeDescuentoVenta}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{item.porcentajeIvaVenta}</Text>
              </View>
              <View style={styles.tableCell}>
                <Text>{}</Text>
              </View>
              <View style={styles.tableCellLast}>
                <Text>{formatCurrency(item.precioTotalVenta)}</Text>
              </View>
            </View>
          ))}
        </View>

        <Text style={styles.label}>Total Items: {data.items.length}</Text>

        {/* Totales */}
        <View style={styles.totalsSection}>
          <Text style={[styles.label, { marginBottom: 10 }]}>Moneda {data.moneda}</Text>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal bruto =</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Descuentos -</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.totalDescuento)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Recargos +</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal neto =</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Impuesto IVA (19%) +</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.totalIva)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal más impuestos =</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>ReteRenta -</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total deducciones =</Text>
            <Text style={styles.totalValue}>{}</Text>
          </View>
          
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.totalLabel}>Total a pagar =</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.totalVenta)}</Text>
          </View>
        </View>

        {/* Observaciones */}
        <View style={styles.observaciones}>
          <Text style={styles.label}>Observaciones</Text>
          <Text>{}</Text>
        </View>

        {/* Autorización */}
        <View style={styles.autorizacion}>
          <Text><Text style={styles.label}>Número de autorización:</Text> {data.numeroResolucion}</Text>
          <Text><Text style={styles.label}>Rango Autorizado desde:</Text>{data.numeroInicialResolucion}<Text style={styles.label}>hasta:</Text>{data.numeroFinalResolucion}</Text>
          <Text><Text style={styles.label}>Expedida:</Text> {data.fechaAutorizacionResolucion} <Text style={styles.label}>Vigencia:</Text> {data.fechaInicialResolucion} <Text style={styles.label}>Vencimiento:</Text> {data.fechaFinalResolucion}</Text>
        </View>

        {/* Firma Digital */}
        <View style={styles.firma}>
          <Text style={styles.label}>Firma Digital:</Text>
          <Text>{data.firmaDigital}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>{data.fechaHoraAutorizacion}</Text>
        </View>
      </Page>
    </Document>
  );
};




export default FacturaElectronica;