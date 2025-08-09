import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Registrar fuente monospace para mejor alineación
Font.register({
  family: 'Courier',
  src: 'https://fonts.gstatic.com/s/courierprime/v9/u-450q2lgwslOqpF_6gQ8kELWwZjb-KI.ttf'
});

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 5,
    fontFamily: 'Courier',
    fontSize: 9,
  },
  container: {
    maxWidth: '100%',
    margin: '0 auto',
  },
  header: {
    marginBottom: 5,
  },
  headerLine: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  label: {
    width: 50,
    fontWeight: 'bold',
  },
  value: {
    flex: 1,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderBottomStyle: 'dashed',
    marginVertical: 5,
  },
  itemsHeader: {
    flexDirection: 'row',
    marginBottom: 2,
    fontWeight: 'bold',
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  itemNumber: {
    width: 10,
    textAlign: 'left',
  },
  itemQuantity: {
    width: 10,
    textAlign: 'center',
  },
  itemDescription: {
    flex: 1,
    paddingLeft: 5,
  },
  itemPrice: {
    width: 40,
    textAlign: 'right',
  },
  totalsSection: {
    marginTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  totalLabel: {
    flex: 1,
  },
  totalValue: {
    width: 50,
    textAlign: 'right',
  },
  finalTotal: {
    fontWeight: 'bold',
    fontSize: 9,
  },
  taxInfo: {
    marginTop: 10,
    paddingTop: 5,
    borderTopWidth: 1,
    borderTopColor: '#000',
    borderTopStyle: 'dashed',
  },
  taxHeader: {
    textAlign: 'center',
    marginBottom: 3,
    fontWeight: 'bold',
  },
  taxRow: {
    flexDirection: 'row',
    marginBottom: 1,
  },
  footer: {
    textAlign: 'center',
    marginTop: 15,
    fontWeight: 'bold',
  },
  additionalInfo: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 7,
  },
  qrCode: {
    textAlign: 'center',
    marginVertical: 10,
  },
  qrPlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#000',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrText: {
    color: '#fff',
    fontSize: 6,
  },
  companyInfo: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 7,
    lineHeight: 1.2,
  },
  italicText: {
    fontStyle: 'italic',
  },
  disclaimer: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 7,
    fontWeight: 'bold',
  }
});

type FacturaElectronicaTiraProps = {
  facturaData?: any; // Replace 'any' with a more specific type if available
};

const FacturaReportTira: React.FC<FacturaElectronicaTiraProps> = ({ facturaData }) => {
  // Datos por defecto basados en la imagen
  const defaultData = {
    tpv: 'TPV117R01',
    cajero: 'BELTRAN RODRIGUEZ FRANCI SIRL',
    fecha: '2025/7/11',
    hora: '21:35:58',
    facturaElectronica: '117F-89439',
    vendedor: 'CORTES BERNAL CRISTIAN CAMILO',
    clienteCredito: '',
    clientePos: 'CONSUMIDOR FINAL',
    ccNit: '222222222222',
    numeroMesa: 'M06',
    items: [
      { id: 1, cantidad: 1, descripcion: 'Tornillo XXX', precio: 0 },
      { id: 2, cantidad: 1, descripcion: 'Tuerca YYYY', precio: 48148 },
      { id: 3, cantidad: 1, descripcion: 'Martillo', precio: 36852 },
      { id: 4, cantidad: 1, descripcion: 'Destornillador', precio: 35926 }
    ],
    subtotal: 160370,
    descuento: 0,
    impuesto: 12630,
    subtotalConImpuesto: 173200,
    valorPropina: 16037,
    totalConServicio: 189237,
    impuestoConsumo: {
      vlrBase: 160370,
      vlrImpuesto: 12630,
      porcentaje: '8%'
    }
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
      <Page size={[226.77, 800]} style={styles.page}> {/* 80mm de ancho */}
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLine}>
              <Text style={styles.label}>FEV</Text>
              <Text style={styles.value}>: {data.numeroVenta}</Text>
            </View>
            <View style={styles.headerLine}>
              <Text style={styles.label}>Cajero</Text>
              <Text style={styles.value}>: { }</Text>
            </View>
            <View style={styles.headerLine}>
              <Text style={styles.label}>Fecha</Text>
              <Text style={styles.value}>: {data.fechaVenta} Hora: { }</Text>
            </View>
            <Text style={{ marginTop: 3, fontWeight: 'bold' }}>
              FACTURA ELECTRONICA DE VENTA:
            </Text>
            <Text>{data.numeroVenta}</Text>
            <View style={styles.headerLine}>
              <Text style={styles.label}>Vendedor</Text>
              <Text style={styles.value}>: { }</Text>
            </View>
            <Text>Cliente Credito:</Text>
            <Text>Cliente Pos:{data.clienteRazonSocial}</Text>
            <Text>CC o Nit:{data.clienteNumeroIdentificacion}</Text>
          </View>

          {/* Items Header */}
          <View style={styles.separator} />
          <View style={styles.itemsHeader}>
            <Text style={styles.itemNumber}>CANT</Text>
            <Text style={[styles.itemDescription, { paddingLeft: 1 }]}>DESCRIPCION</Text>
            <Text style={styles.itemPrice}>NETO</Text>
          </View>
          <View style={styles.separator} />

          {/* Items */}
          {data.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              {/* <Text style={styles.itemNumber}>{item.id}</Text> */}
              <Text style={styles.itemQuantity}>{item.cantidadVenta.toFixed(2)}</Text>
              <Text style={styles.itemDescription}>{item.nombreProducto}</Text>
              <Text style={styles.itemPrice}>{formatCurrency(item.precioUnitarioVenta)}</Text>
            </View>
          ))}

          <View style={styles.separator} />

          {/* Total Items */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>TOTAL ITEMS........</Text>
            <Text style={styles.totalValue}>{data.items.length}</Text>
          </View>

          <View style={styles.separator} />

          {/* Totals Section */}
          <View style={styles.totalsSection}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL</Text>
              <Text style={styles.totalValue}>{formatCurrency(facturaData.subtotal)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>DESCUENTO</Text>
              <Text style={styles.totalValue}>{formatCurrency(data.totalDescuento)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>IMPUESTO</Text>
              <Text style={styles.totalValue}>{formatCurrency(data.totalIva)}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>SUBTOTAL CON IMPUESTO</Text>
              <Text style={styles.totalValue}>{formatCurrency(data.totalVenta)}</Text>
            </View>
            {/* <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>VALOR PROPINA</Text>
              <Text style={styles.totalValue}>{formatCurrency(facturaData.valorPropina)}</Text>
            </View> */}
            <View style={[styles.totalRow, styles.finalTotal]}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>{formatCurrency(data.totalVenta)}</Text>
            </View>
          </View>

          {/* Tax Information */}
          <View style={styles.taxInfo}>
            <Text style={styles.taxHeader}>[ INFORMACION TRIBUTARIA ]</Text>
            <View style={styles.taxRow}>
              <Text style={styles.totalLabel}>Descripcion</Text>
              <Text style={{ width: 40, textAlign: 'right' }}>Vlr_Base</Text>
              <Text style={{ width: 40, textAlign: 'right' }}>Vlr_Impto</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.taxRow}>
              <Text style={styles.totalLabel}>IMPUESTO AL CONS { }</Text>
              <Text style={{ width: 40, textAlign: 'right' }}>{ }</Text>
              <Text style={{ width: 40, textAlign: 'right' }}>{formatCurrency(data.totalIva)}</Text>
            </View>
            <View style={styles.separator} />
          </View>

          {/* Footer */}
          <Text style={styles.footer}>GRACIAS POR SU VISITA</Text>
          {/* Additional Messages */}
          {/* <View style={styles.additionalInfo}>
            {facturaData.mensajeAdicional.map((mensaje, index) => (
              <Text key={index} style={{ marginBottom: 1 }}>{mensaje}</Text>
            ))}
          </View> */}

          {/* QR Code Section */}
          <View style={styles.qrCode}>
            {/* {facturaData.qrMessage.map((mensaje, index) => (
              <Text key={index} style={{ marginBottom: 2 }}>{mensaje}</Text>
            ))} */}

            {/* QR Code Placeholder - En un caso real aquí iría la imagen del QR */}
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR</Text>
              <Text style={styles.qrText}>CODE</Text>
            </View>
          </View>

          {/* Company Information */}
          <View style={styles.companyInfo}>
            <Text>
              <Text style={styles.italicText}>Elaborado. </Text>
              {}
            </Text>

            <Text style={{ marginTop: 8 }}>ASTIL</Text>
            <Text>FABRICANTE DEL SOFTWARE</Text>
            <Text style={{ fontWeight: 'bold', marginTop: 2 }}>
              IT QUALIS
            </Text>
            <Text style={{ fontWeight: 'bold' }}>
              NIT: {}
            </Text>
            <Text style={[styles.italicText, { marginTop: 5 }]}>
              Proveedor Tecnologico: {}
            </Text>
          </View>

          {/* Disclaimer */}
          {/* <View style={styles.disclaimer}>
            {facturaData.disclaimer.map((texto, index) => (
              <Text key={index}>{texto}</Text>
            ))}
          </View> */}
        </View>
      </Page>
    </Document>
  );
};

export default FacturaReportTira;