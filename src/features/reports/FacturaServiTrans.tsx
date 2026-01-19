import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Estilos
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Helvetica',
    fontSize: 7,
    padding: 30,
    lineHeight: 1.2,
  },
  // Header mejorado
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  headerLeft: {
    width: '25%',
  },
  headerCenter: {
    width: '50%',
    textAlign: 'center',
  },
  headerRight: {
    width: '25%',
    alignItems: 'flex-end',
  },
  logoPlaceholder: {
    width: 120,
    height: 50,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1pt solid #ccc',
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e63946',
  },
  qrPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    border: '1pt solid #ccc',
  },
  qrText: {
    fontSize: 8,
    textAlign: 'center',
  },
  companyName: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  companyNIT: {
    fontSize: 7,
    marginBottom: 2,
    textAlign: 'center',
  },
  companyAddress: {
    fontSize: 6.5,
    marginBottom: 1,
    textAlign: 'center',
  },
  companyCity: {
    fontSize: 6.5,
    marginBottom: 1,
    textAlign: 'center',
  },
  companyContact: {
    fontSize: 6.5,
    marginBottom: 1,
    textAlign: 'center',
  },
  // Título de factura
  facturaTitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  // Información legal
  legalInfo: {
    fontSize: 5.5,
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  // CUFE box centrado
  cufeContainer: {
    textAlign: 'center',
    marginBottom: 10,
  },
  cufeText: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  cufeValue: {
    fontSize: 6,
    fontFamily: 'Courier',
  },
  // Divider
  divider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    marginVertical: 8,
  },
  // Info tables
  infoTablesContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoTableLeft: {
    width: '48%',
    marginRight: '2%',
  },
  infoTableRight: {
    width: '50%',
  },
  tableRow: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#000',
    minHeight: 18,
  },
  tableCell: {
    padding: 3,
    fontSize: 7,
  },
  tableCellLabel: {
    width: '40%',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
  },
  tableCellValue: {
    width: '60%',
    padding: 3,
    fontSize: 7,
  },
  // Table de productos
  table: {
    marginTop: 8,
    marginBottom: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#d9d9d9',
    borderWidth: 0.5,
    borderColor: '#000',
    paddingVertical: 3,
    paddingHorizontal: 1,
  },
  productTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: '#000',
    paddingVertical: 2,
    paddingHorizontal: 1,
    minHeight: 20,
  },
  // Table columns
  col1: { width: '3%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col2: { width: '7%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col3: { width: '42%', fontSize: 5.5, textAlign: 'left', paddingLeft: 2 },
  col4: { width: '6%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col5: { width: '5%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col6: { width: '11%', fontSize: 5.5, textAlign: 'right', paddingRight: 2 },
  col7: { width: '6%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col8: { width: '6%', fontSize: 5.5, textAlign: 'center', paddingHorizontal: 1 },
  col9: { width: '14%', fontSize: 5.5, textAlign: 'right', paddingRight: 2 },
  
  // Sección de totales mejorada
  totalsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // Columna izquierda - Valor en letras
  totalsLeft: {
    width: '60%',
    paddingRight: 10,
  },
  valorEnLetras: {
    borderWidth: 0.5,
    borderColor: '#000',
    padding: 5,
    minHeight: 60,
  },
  valorEnLetrasLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  valorEnLetrasText: {
    fontSize: 6.5,
    lineHeight: 1.4,
  },
  // Columna derecha - Tabla de totales
  totalsRight: {
    width: '40%',
  },
  totalsTable: {
    borderWidth: 0.5,
    borderColor: '#000',
  },
  totalRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    minHeight: 16,
  },
  totalRowLast: {
    flexDirection: 'row',
    minHeight: 16,
  },
  totalLabelCell: {
    width: '60%',
    padding: 3,
    fontSize: 7,
    borderRightWidth: 0.5,
    borderRightColor: '#000',
  },
  totalValueCell: {
    width: '40%',
    padding: 3,
    fontSize: 7,
    textAlign: 'right',
  },
  totalLabelCellBold: {
    width: '60%',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
  },
  totalValueCellBold: {
    width: '40%',
    padding: 3,
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  subtotalRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    minHeight: 16,
    backgroundColor: '#f0f0f0',
  },
  anticiposRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    minHeight: 16,
    backgroundColor: '#f0f0f0',
  },
  totalAPagarRow: {
    flexDirection: 'row',
    minHeight: 18,
    backgroundColor: '#f0f0f0',
  },
  
  // Observaciones
  observacionesContainer: {
    marginTop: 15,
    borderWidth: 0.5,
    borderColor: '#000',
  },
  observacionesHeader: {
    backgroundColor: '#f0f0f0',
    padding: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
  },
  observacionesHeaderText: {
    fontSize: 7,
    fontWeight: 'bold',
  },
  observacionesContent: {
    padding: 6,
    minHeight: 80,
  },
  observacionesText: {
    fontSize: 5.5,
    lineHeight: 1.5,
    marginBottom: 4,
  },
  observacionesTextBold: {
    fontSize: 5.5,
    lineHeight: 1.5,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  condicionesText: {
    fontSize: 5.5,
    lineHeight: 1.5,
    marginTop: 6,
  },

  // Firmas
  firmasContainer: {
    marginTop: 10,
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#000',
  },
  firmaColumn: {
    width: '33.33%',
    borderRightWidth: 0.5,
    borderRightColor: '#000',
    padding: 8,
    minHeight: 80,
  },
  firmaColumnLast: {
    width: '33.34%',
    padding: 8,
    minHeight: 80,
  },
  firmaTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
  },
  firmaSubtitle: {
    fontSize: 6.5,
    textAlign: 'center',
    marginTop: 5,
  },
  firmaText: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
  },
  
  // Footer
  footer: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 5.5,
    color: '#666',
  },
  footerLine: {
    marginBottom: 1,
  },
});

type FacturaElectronicaProps = {
  facturaData?: any; // Replace 'any' with a more specific type if available
};

const FacturaServiTransReport: React.FC<FacturaElectronicaProps> = ({ facturaData }) => {
  
  const data = facturaData;
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo, info y QR */}
        <View style={styles.headerContainer}>
          {/* Logo placeholder */}
          <View style={styles.headerLeft}>
            <View style={styles.logoPlaceholder}>
              <Text style={styles.logoText}>Servitrans</Text>
            </View>
          </View>

          {/* Información de la empresa */}
          <View style={styles.headerCenter}>
            <Text style={styles.companyName}>
              SERVICIOS CENTRALIZADOS DE COLOMBIA SERVITRANS SAS
            </Text>
            <Text style={styles.companyNIT}>{data.facturadorTipoId} : {data.facturadorNumeroIdentificacion}</Text>
            <Text style={styles.companyAddress}>
              PRINCIPAL: CR 45 # 106-25 Loc. 201
            </Text>
            <Text style={styles.companyCity}>BOGOTÁ, D.C. - Colombia</Text>
            <Text style={styles.companyContact}>Teléfono: +57 1 7449564</Text>
            <Text style={styles.companyContact}>
              E-mail: facturacion@servitrans.co
            </Text>
          </View>

          {/* QR placeholder */}
          <View style={styles.headerRight}>
            <View style={styles.qrPlaceholder}>
              <Text style={styles.qrText}>QR{'\n'}Code</Text>
            </View>
          </View>
        </View>

        {/* Información legal */}
        <View>
          <Text style={styles.legalInfo}>
            Resolución DIAN facturación electrónica No. 18764075582210 de
            23-07-2024a 23-01-2026 del FECO 2.249 al FECO 60.270
          </Text>
          <Text style={styles.legalInfo}>
            TIPO DE CONTRIBUYENTE PERSONA JURÍDICA. RÉGIMEN COMÚN RESPONSABLE
            DEL IMPUESTO SOBRE LAS VENTAS IVA. NO SOMOS GRANDES CONTRIBUYENTES
            NI AUTORETENEDORES DEL IMPUESTO SOBRE LA RENTA ACTIVIDAD ECONÓMICA
            6399 TARIFA 9.66*1000 ACTIVIDAD ECONÓMICA 4930 TARIFA 11.04*1000
          </Text>
          <Text style={styles.legalInfo}>
            ACTIVIDAD ECONÓMICA 7730 TARIFA 9.66*10000. ESTA FACTURA DE VENTA
            APLICA A LAS NORMAS RELATIVAS A LA LETRA DE CAMBIO (ART.5, LEY 1231
            DE 2008) CON ESTA EL COMPRADOR DECLARA HABER RECIBIDO REAL Y
            MATERIALMENTE LA MERCANCÍA Y / O SERVICIOS DESCRITO EN ESTE TITULO
            - VALOR 29-F3:62:14-91:4E:8F:5A
          </Text>
        </View>

        {/* Título */}
        <View style={styles.facturaTitle}>
          <Text style={styles.headerTitle}>
            Representación gráfica de la factura electrónica
          </Text>
        </View>

        {/* CUFE */}
        <View style={styles.cufeContainer}>
          <Text style={styles.cufeText}>
            CUFE: d443133ec34979d9254bee5c3f9c89e592963240baa651a23cfa6ecc11b1b50ebfa7b193516c296394542ec809
          </Text>
        </View>

        {/* Tablas de información */}
        <View style={styles.infoTablesContainer}>
          <View style={styles.infoTableLeft}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Cliente:</Text>
              <Text style={styles.tableCellValue}>JHON ALEXANDER RUIZ</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>CC:</Text>
              <Text style={styles.tableCellValue}>80148172</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Dirección:</Text>
              <Text style={styles.tableCellValue}>CALLE 1 # 81 C -23</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Teléfonos:</Text>
              <Text style={styles.tableCellValue}>+57 311 2699862</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Ciudad:</Text>
              <Text style={styles.tableCellValue}>BOGOTÁ, D.C.</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Correo electrónico:</Text>
              <Text style={styles.tableCellValue}>viejojohn349@hotmail.com</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Placa:</Text>
              <Text style={styles.tableCellValue}></Text>
            </View>
          </View>

          <View style={styles.infoTableRight}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Factura Electrónica de Venta No.</Text>
              <Text style={styles.tableCellValue}>FECO02977</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Tipo de operación:</Text>
              <Text style={styles.tableCellValue}>Estándar</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Vendedor</Text>
              <Text style={styles.tableCellValue}>Administrador</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Fecha de Facturación:</Text>
              <Text style={styles.tableCellValue}>15-10-2025 19:13:01</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Fecha de Validación:</Text>
              <Text style={styles.tableCellValue}>15-10-2025 19:13:25</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Fecha de Entrega:</Text>
              <Text style={styles.tableCellValue}>15-10-2025 21:53:45</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Fecha de Vencimiento:</Text>
              <Text style={styles.tableCellValue}>14-11-2025</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Medio de Pago:</Text>
              <Text style={styles.tableCellValue}>Instrumento no definido</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableCellLabel}>Plazo de Pago:</Text>
              <Text style={styles.tableCellValue}>30 Días Netos</Text>
            </View>
            <View style={styles.tableRow}>
              <View style={{ flexDirection: 'row', width: '100%' }}>
                <View style={{ width: '33.33%', borderRightWidth: 0.5, borderRightColor: '#000' }}>
                  <Text style={styles.tableCellLabel}>Forma de Pago:</Text>
                  <Text style={styles.tableCell}>Crédito</Text>
                </View>
                <View style={{ width: '33.33%', borderRightWidth: 0.5, borderRightColor: '#000' }}>
                  <Text style={styles.tableCellLabel}>Moneda:</Text>
                  <Text style={styles.tableCell}>COP</Text>
                </View>
                <View style={{ width: '33.34%' }}>
                  <Text style={styles.tableCell}></Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Tabla de Items */}
        <View>
          <View style={styles.table}>
            {/* Header de tabla */}
            <View style={styles.tableHeader}>
              <Text style={styles.col1}>Item</Text>
              <Text style={styles.col2}>Código</Text>
              <Text style={styles.col3}>Descripción</Text>
              <Text style={styles.col4}>Cant.</Text>
              <Text style={styles.col5}>U.M.</Text>
              <Text style={styles.col6}>Valor Unit.</Text>
              <Text style={styles.col7}>Dcto</Text>
              <Text style={styles.col8}>IVA</Text>
              <Text style={styles.col9}>Valor Total</Text>
            </View>

            {/* Item 1 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>1</Text>
              <Text style={styles.col2}>ME6</Text>
              <Text style={styles.col3}>
                MANEJO ENVIO CORPORATIVO SERVICIO TRASPASO PLACAS EOP471 Y
                EOP472 CORRESPONDIENTES AL TRANSITO DE NEIVA COSTO AL 50%
              </Text>
              <Text style={styles.col4}>2.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(190000.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>19%</Text>
              <Text style={styles.col9}>$ {formatCurrency(380000.0)}</Text>
            </View>

            {/* Item 2 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>2</Text>
              <Text style={styles.col2}>ME6</Text>
              <Text style={styles.col3}>
                MANEJO ENVIO CORPORATIVO SERVICIO TRASPASO PLACA HFQ056
                CORRESPONDIENTE AL TRANSITO DE COTA COSTO AL 50%
              </Text>
              <Text style={styles.col4}>1.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(107831.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>19%</Text>
              <Text style={styles.col9}>$ {formatCurrency(107831.0)}</Text>
            </View>

            {/* Item 3 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>3</Text>
              <Text style={styles.col2}>ME6</Text>
              <Text style={styles.col3}>
                MANEJO ENVIO CORPORATIVO SERVICIO TRASPASO PLACA DSP885
                CORRESPONDIENTE AL TRANSITO DE YOPAL COSTO AL 50%
              </Text>
              <Text style={styles.col4}>1.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(166163.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>19%</Text>
              <Text style={styles.col9}>$ {formatCurrency(166163.0)}</Text>
            </View>

            {/* Item 4 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>4</Text>
              <Text style={styles.col2}>RECORP</Text>
              <Text style={styles.col3}>
                REEMBOLSO DE LOS TRAMITES REALIZADOS - ABSTENERSE DE PRACTICAR
                RETENCIONES POR ESTE CONCEPTO CORRESPONDIENTE A LAS PLACAS
                EOP471 Y EOP472 AL 50%
              </Text>
              <Text style={styles.col4}>2.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(126663.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>0%</Text>
              <Text style={styles.col9}>$ {formatCurrency(253326.0)}</Text>
            </View>

            {/* Item 5 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>5</Text>
              <Text style={styles.col2}>RECORP</Text>
              <Text style={styles.col3}>
                REEMBOLSO DE LOS TRAMITES REALIZADOS - ABSTENERSE DE PRACTICAR
                RETENCIONES POR ESTE CONCEPTO CORRESPONDIENTE A LA PLACA HFQ056
                AL 50%
              </Text>
              <Text style={styles.col4}>1.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(81900.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>0%</Text>
              <Text style={styles.col9}>$ {formatCurrency(81900.0)}</Text>
            </View>

            {/* Item 6 */}
            <View style={styles.productTableRow}>
              <Text style={styles.col1}>6</Text>
              <Text style={styles.col2}>RECORP</Text>
              <Text style={styles.col3}>
                REEMBOLSO DE LOS TRAMITES REALIZADOS - ABSTENERSE DE PRACTICAR
                RETENCIONES POR ESTE CONCEPTO CORRESPONDIENTE A LA PLACA DSP885
                AL 50% y 100% CORRESPONDIENTE AL TRASLADO DE CUENTA ($30.820)
              </Text>
              <Text style={styles.col4}>1.0</Text>
              <Text style={styles.col5}>C62</Text>
              <Text style={styles.col6}>$ {formatCurrency(110270.0)}</Text>
              <Text style={styles.col7}>0%</Text>
              <Text style={styles.col8}>0%</Text>
              <Text style={styles.col9}>$ {formatCurrency(110270.0)}</Text>
            </View>
          </View>
        </View>

        {/* Sección de totales mejorada con dos columnas */}
        <View style={styles.totalsContainer}>
          {/* Columna izquierda - Valor en letras */}
          <View style={styles.totalsLeft}>
            <View style={styles.valorEnLetras}>
              <Text style={styles.valorEnLetrasLabel}>Valor en letras:</Text>
              <Text style={styles.valorEnLetrasText}>
                UN MILLON DOSCIENTOS VEINTITRES MIL SETECIENTOS CUARENTA Y OCHO PESOS CON OCHENTA Y SEIS CENTAVOS ( MCTE )
              </Text>
            </View>
          </View>

          {/* Columna derecha - Tabla de totales */}
          <View style={styles.totalsRight}>
            <View style={styles.totalsTable}>
              {/* Total sin impuestos */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelCell}>Total sin impuestos</Text>
                <Text style={styles.totalValueCell}>$ {formatCurrency(1099490.00)}</Text>
              </View>

              {/* Descuentos Pie de Factura */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelCell}>Descuentos Pie de Factura</Text>
                <Text style={styles.totalValueCell}>$ {formatCurrency(0.00)}</Text>
              </View>

              {/* Descuento - Retegarantia */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelCell}>Descuento - Retegarantia</Text>
                <Text style={styles.totalValueCell}>$ {formatCurrency(0.00)}</Text>
              </View>

              {/* Fletes */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelCell}>Fletes</Text>
                <Text style={styles.totalValueCell}>$ {formatCurrency(0.00)}</Text>
              </View>

              {/* IVA Ventas 19% */}
              <View style={styles.totalRow}>
                <Text style={styles.totalLabelCell}>IVA Ventas 19%</Text>
                <Text style={styles.totalValueCell}>$ {formatCurrency(124258.86)}</Text>
              </View>

              {/* Subtotal */}
              <View style={styles.subtotalRow}>
                <Text style={styles.totalLabelCellBold}>Subtotal</Text>
                <Text style={styles.totalValueCellBold}>$ {formatCurrency(1223748.86)}</Text>
              </View>

              {/* Anticipos */}
              <View style={styles.anticiposRow}>
                <Text style={styles.totalLabelCellBold}>Anticipos</Text>
                <Text style={styles.totalValueCellBold}>$ {formatCurrency(0.00)}</Text>
              </View>

              {/* Total a pagar */}
              <View style={styles.totalAPagarRow}>
                <Text style={styles.totalLabelCellBold}>Total a pagar</Text>
                <Text style={styles.totalValueCellBold}>$ {formatCurrency(1223748.86)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Observaciones */}
        <View style={styles.observacionesContainer}>
          <View style={styles.observacionesHeader}>
            <Text style={styles.observacionesHeaderText}>
              Observaciones: FAVOR CONSIGNAR EN LA CUENTA CORRIENTE No. 009373713 DE BANCO DE BOGOTA QUE ENCUENTRA BAJO NUESTRO NOMBRE
            </Text>
          </View>
          <View style={styles.observacionesContent}>
            <Text style={styles.observacionesText}>
              Factura electrónica 1. Esta factura de venta obra como título valor, cumple con todos los requisitos y presta mérito ejecutivo de acuerdo al artículo 1 de la ley 1231 de julio 17 de 2008, que modifica el artículo 772 del código de comercio.
            </Text>
            <Text style={styles.observacionesText}>
              2. La mora en el pago causa intereses según la tasa de interés máxima legal permitida. 3. No somos responsables del contenido del empaque o de lo que usted ha comprado o contratado después de entregado; si desea devolver esta autorizada
            </Text>
            <Text style={styles.observacionesText}>
              expresamente por el comprador para terminar, continuar la deuda y obligar al comprador a su cancelación. 4. El comprador o su autorizado dar firma en señal de aceptación y de haber recibido real y materialmente la mercancía de que trata y
            </Text>
            <Text style={styles.observacionesText}>
              aceptan el valor estipulado en la misma, reconociendo de manera expresa que reconocimiento de firma y el reconocimiento de deuda a que se refiere el artículo 621 del código general del proceso.
            </Text>
            
            <Text style={styles.condicionesText}>
              <Text style={styles.observacionesTextBold}>Condiciones Generales: 1.</Text> El valor del manejo y envío es válido hasta por 60 días a partir de la fecha de este documento, pasado este tiempo sera necesario nuevamente el pago 2. Esta factura de venta debe ser cancelada a favor de
            </Text>
            <Text style={styles.observacionesText}>
              SERVICIOS CENTRALIZADOS DE COLOMBIA SERVITRANS S.A.S 3. La presente factura de venta es un título valor de acuerdo a la ley 1231 del 17/07/2008 4. La firma de esta factura es declaración de que los trabajos indicados fueron
            </Text>
            <Text style={styles.observacionesText}>
              recibidos a entera satisfacción obligándose a su pago en la forma aquí pactada y en caso de mora el pago de interés máximo legal.
            </Text>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.firmasContainer}>
          {/* Columna 1 */}
          <View style={styles.firmaColumn}>
            <Text style={styles.firmaTitle}>
              SERVICIOS CENTRALIZADOS DE COLOMBIA{'\n'}SERVITRANS SAS
            </Text>
            <Text style={styles.firmaSubtitle}>Firma Autorizada</Text>
          </View>

          {/* Columna 2 */}
          <View style={styles.firmaColumn}>
            <Text style={styles.firmaTitle}>RECIBÍ CONFORME:</Text>
            <Text style={styles.firmaText}>
              Con la aceptación de esta factura se dan{'\n'}
              por aprobadas las condiciones de garantía{'\n'}
              mencionadas.
            </Text>
            <Text style={styles.firmaSubtitle} style={{ marginTop: 10 }}>
              Firma y Sello del Cliente
            </Text>
          </View>

          {/* Columna 3 */}
          <View style={styles.firmaColumnLast}>
            <Text style={styles.firmaSubtitle}>FECHA DE RECIBIDA</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLine}>
            Documento generado electrónicamente
          </Text>
          <Text style={styles.footerLine}>
            Para verificar la autenticidad de este documento, ingrese a la
            plataforma DIAN
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default FacturaServiTransReport;