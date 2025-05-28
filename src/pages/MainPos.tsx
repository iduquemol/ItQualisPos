import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, CreditCard, DollarSign, User, Settings, BarChart3, Zap, X, Plus, Minus, Check, Clock, Star, Scan, Package, AlertTriangle, Tag, Gift, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Html5QrcodeScanner } from 'html5-qrcode';
import Tesseract from 'tesseract.js';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sku: string;
  barcode: string;
  stock: number;
  minStock: number;
  brand: string;
  size?: string;
}

const RetailPOS = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPayment, setShowPayment] = useState(false);
  const [activePaymentMethod, setActivePaymentMethod] = useState('cash');
  const [customerDiscount, setCustomerDiscount] = useState('0');
  const [customerInfo, setCustomerInfo] = useState({ name: '', email: '', phone: '', loyalty: false });
  const [showCustomer, setShowCustomer] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [showScanner, setShowScanner] = useState(false)
  const [showOCR, setShowOCR] = useState(false)

  // Productos típicos de retail
  const products = [
    { id: 1, name: 'Smartphone Samsung Galaxy', price: 699.99, category: 'electronica', image: '📱', sku: 'SAMS-001', barcode: '1234567890123', stock: 15, minStock: 5, brand: 'Samsung' },
    { id: 2, name: 'Auriculares Bluetooth', price: 89.99, category: 'electronica', image: '🎧', sku: 'AURI-002', barcode: '2345678901234', stock: 32, minStock: 10, brand: 'Sony' },
    { id: 3, name: 'Camiseta Polo Azul', price: 29.99, category: 'ropa', image: '👕', sku: 'CAM-003', barcode: '3456789012345', stock: 45, minStock: 15, brand: 'Polo', size: 'M' },
    { id: 4, name: 'Jeans Clásico', price: 79.99, category: 'ropa', image: '👖', sku: 'JEAN-004', barcode: '4567890123456', stock: 28, minStock: 8, brand: 'Levi\'s', size: '32' },
    { id: 5, name: 'Perfume Elegance 100ml', price: 120.00, category: 'belleza', image: '🌸', sku: 'PERF-005', barcode: '5678901234567', stock: 18, minStock: 5, brand: 'Elegance' },
    { id: 6, name: 'Mochila Deportiva', price: 45.99, category: 'accesorios', image: '🎒', sku: 'MOCH-006', barcode: '6789012345678', stock: 22, minStock: 8, brand: 'Nike' },
    { id: 7, name: 'Reloj Digital', price: 159.99, category: 'accesorios', image: '⌚', sku: 'REL-007', barcode: '7890123456789', stock: 12, minStock: 3, brand: 'Casio' },
    { id: 8, name: 'Zapatillas Running', price: 149.99, category: 'calzado', image: '👟', sku: 'ZAP-008', barcode: '8901234567890', stock: 35, minStock: 12, brand: 'Adidas', size: '42' },
    { id: 9, name: 'Tablet 10 pulgadas', price: 329.99, category: 'electronica', image: '📱', sku: 'TAB-009', barcode: '9012345678901', stock: 8, minStock: 3, brand: 'Lenovo' },
    { id: 10, name: 'Crema Facial Premium', price: 65.00, category: 'belleza', image: '🧴', sku: 'CREM-010', barcode: '0123456789012', stock: 25, minStock: 10, brand: 'L\'Oreal' }
  ];

  const categories = [
    { id: 'all', name: 'Todo', icon: '🏪' },
    { id: 'electronica', name: 'Electrónica', icon: '📱' },
    { id: 'ropa', name: 'Ropa', icon: '👕' },
    { id: 'calzado', name: 'Calzado', icon: '👟' },
    { id: 'belleza', name: 'Belleza', icon: '💄' },
    { id: 'accesorios', name: 'Accesorios', icon: '🎒' }
  ];

  const paymentMethods = [
    { id: 'cash', name: 'Efectivo', icon: DollarSign, color: 'bg-green-500' },
    { id: 'card', name: 'Tarjeta', icon: CreditCard, color: 'bg-blue-500' },
    { id: 'digital', name: 'Digital', icon: Zap, color: 'bg-purple-500' }
  ];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode.includes(searchTerm);
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Buscar producto por código de barras
  const handleBarcodeSearch = (barcode) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    }
  };

  // Funciones del carrito
  const addToCart = (product : Product) => {
    if (product.stock <= 0) {
      return;
    }
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        return;
      }
      setCart(cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, change) => {
    const product = products.find(p => p.id === id);
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + change;
        if (newQuantity <= 0) return null;
        if (newQuantity > product.stock) {
          return item;
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  function BarcodeScanner({ onScan }: { onScan: (code: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    import("html5-qrcode").then(({ Html5QrcodeScanner }) => {
      const scanner = new Html5QrcodeScanner("reader", {
        fps: 10,
        qrbox: { width: 250, height: 100 },
        formatsToSupport: ["CODE_128", "EAN_13", "UPC_A"]
      }, false)

      scanner.render((decodedText: string) => {
        scanner.clear()
        onScan(decodedText)
      }, () => {})
    })
  }, [])

  return <div id="reader" className="w-full max-w-xs" ref={ref} />
}

function OCRScanner({ onDetect }: { onDetect: (text: string) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleOCR = async () => {
    if (!file) return
    setLoading(true)
    const result = await Tesseract.recognize(file, 'eng')
    setLoading(false)
    onDetect(result.data.text)
  }

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <Button onClick={handleOCR} disabled={loading}>
        {loading ? 'Escaneando...' : 'Escanear Producto por OCR'}
      </Button>
    </div>
  )
}

  // Cálculos
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discount = subtotal * (Number(customerDiscount) / 100);
  const tax = (subtotal - discount) * 0.16; // IVA 16%
  const loyaltyDiscount = customerInfo.loyalty ? subtotal * 0.05 : 0; // 5% descuento por lealtad
  const total = subtotal - discount - loyaltyDiscount + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pointsEarned = Math.floor(total / 10); // 1 punto por cada $10

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Panel Izquierdo - Productos */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b p-6 bg-card">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="bg-primary p-3 rounded-lg">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">It Qualis POS</h1>
                <p className="text-sm text-muted-foreground">Terminal #001 - Sucursal Centro</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowCustomer(!showCustomer)}
                className="flex items-center space-x-2"
              >
                <Users className="h-4 w-4" />
                <span>Cliente</span>
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Online
              </Badge>
            </div>
          </div>

          {/* Búsqueda y Código de Barras */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Button variant="secondary" onClick={() => setShowScanner(true)}>
                <Scan className="h-4 w-4 mr-2" /> Escanear Código
              </Button>
              <Button variant="secondary" onClick={() => setShowOCR(true)}>
                <Scan className="h-4 w-4 mr-2" /> OCR
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showScanner} onOpenChange={setShowScanner}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Escaneo por Cámara</DialogTitle>
            </DialogHeader>
            <BarcodeScanner
              onScan={(code) => {
                const product = mockProducts.find(p => p.barcode === code)
                if (product) {
                  addToCart(product)
                } else {
                  alert('Producto no encontrado: ' + code)
                }
                setShowScanner(false)
              }}
            />
          </DialogContent>
        </Dialog>

         <Dialog open={showOCR} onOpenChange={setShowOCR}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Escaneo por Imagen (OCR)</DialogTitle>
            </DialogHeader>
            <OCRScanner
              onDetect={(text) => {
                const found = mockProducts.find(p => text.toLowerCase().includes(p.name.toLowerCase()))
                if (found) {
                  addToCart(found)
                } else {
                  alert('Producto no reconocido por OCR')
                }
                setShowOCR(false)
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Panel de Cliente */}
        {showCustomer && (
          <div className="border-b p-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Input
                placeholder="Nombre del cliente"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
              />
              <Input
                type="email"
                placeholder="Email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
              />
              <Input
                type="tel"
                placeholder="Teléfono"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="loyalty"
                  checked={customerInfo.loyalty}
                  onCheckedChange={(checked) => setCustomerInfo({...customerInfo, loyalty: checked})}
                />
                <Label htmlFor="loyalty" className="text-sm font-medium">Cliente Lealtad</Label>
              </div>
            </div>
          </div>
        )}

        {/* Categorías */}
        <div className="border-b p-4 bg-card">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              {categories.map(category => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Grid de Productos */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <Card 
                key={product.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  product.stock <= product.minStock ? 'border-destructive/50' : ''
                }`}
                onClick={() => addToCart(product)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="secondary" className="text-xs">
                      {product.sku}
                    </Badge>
                    {product.stock <= product.minStock && (
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="text-center space-y-2">
                  <div className="text-4xl mb-2">{product.image}</div>
                  <CardTitle className="text-sm leading-tight line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <CardDescription className="text-xs">{product.brand}</CardDescription>
                  {product.size && (
                    <Badge variant="outline" className="text-xs">
                      Talla {product.size}
                    </Badge>
                  )}
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-2 pt-2">
                  <div className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                  <Badge 
                    variant={product.stock > product.minStock ? "secondary" : 
                            product.stock > 0 ? "outline" : "destructive"}
                    className="text-xs"
                  >
                    Stock: {product.stock}
                  </Badge>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Panel Derecho - Carrito */}
      <div className="w-96 border-l bg-card flex flex-col">
        {/* Header del Carrito */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ShoppingCart className="h-5 w-5" />
              <h2 className="font-bold text-lg">Venta Actual</h2>
            </div>
            <Badge className="bg-primary text-primary-foreground">
              {totalItems}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>Ticket #{Math.floor(Math.random() * 10000)}</span>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {customerInfo.name && (
            <Alert>
              <User className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{customerInfo.name}</span>
                {customerInfo.loyalty && (
                  <Badge variant="secondary" className="ml-2">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    VIP
                  </Badge>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Items del Carrito */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-muted-foreground font-medium">Carrito vacío</p>
              <p className="text-sm text-muted-foreground mt-1">Escanea o selecciona productos</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map(item => (
                <Card key={item.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <span className="text-2xl">{item.image}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-xs text-muted-foreground">${item.price.toFixed(2)}</span>
                          <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="h-8 w-8 p-0"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="font-medium min-w-[2rem] text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="h-8 w-8 p-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <span className="font-bold text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Panel de Totales y Pago */}
        {cart.length > 0 && (
          <div className="border-t p-6 space-y-4">
            {/* Descuentos */}
            <div className="space-y-2">
              <Label htmlFor="discount">Descuento</Label>
              <Select value={customerDiscount} onValueChange={setCustomerDiscount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Sin descuento</SelectItem>
                  <SelectItem value="5">5% - Promoción</SelectItem>
                  <SelectItem value="10">10% - Cliente Frecuente</SelectItem>
                  <SelectItem value="15">15% - Liquidación</SelectItem>
                  <SelectItem value="20">20% - Empleado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Resumen */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Descuento ({customerDiscount}%)</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              {loyaltyDiscount > 0 && (
                <div className="flex justify-between text-sm text-purple-600">
                  <span>Descuento VIP (5%)</span>
                  <span>-${loyaltyDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">IVA (16%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              {customerInfo.loyalty && (
                <div className="flex justify-between text-sm text-amber-600">
                  <span>Puntos a ganar</span>
                  <span>{pointsEarned} pts</span>
                </div>
              )}
            </div>

            {/* Métodos de Pago */}
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(method => {
                const IconComponent = method.icon;
                return (
                  <Button
                    key={method.id}
                    variant={activePaymentMethod === method.id ? "default" : "outline"}
                    onClick={() => setActivePaymentMethod(method.id)}
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <IconComponent className="h-5 w-5 mb-1" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                );
              })}
            </div>

            {/* Botón de Pago */}
            <Button
              onClick={() => setShowPayment(true)}
              className="w-full py-6 text-lg font-bold"
              size="lg"
            >
              <Check className="h-5 w-5 mr-2" />
              Procesar Venta
            </Button>
          </div>
        )}
      </div>

      {/* Modal de Pago */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl">¡Venta Completada!</DialogTitle>
            <DialogDescription>
              Transacción procesada exitosamente
            </DialogDescription>
          </DialogHeader>
          
          <Card className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Cobrado</span>
                <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Método</span>
                <span className="font-medium capitalize">{paymentMethods.find(m => m.id === activePaymentMethod)?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Artículos</span>
                <span className="font-medium">{totalItems}</span>
              </div>
              {customerInfo.loyalty && pointsEarned > 0 && (
                <div className="flex justify-between items-center text-amber-600">
                  <span>Puntos Ganados</span>
                  <span className="font-medium">{pointsEarned} pts</span>
                </div>
              )}
            </div>
          </Card>

          <DialogFooter className="flex space-x-2">
            <Button
              onClick={() => {
                setShowPayment(false);
                setCart([]);
                setCustomerDiscount('0');
                setCustomerInfo({ name: '', email: '', phone: '', loyalty: false });
                setShowCustomer(false);
                setLoyaltyPoints(prevPoints => prevPoints + pointsEarned);
              }}
              className="flex-1"
            >
              Nueva Venta
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPayment(false)}
            >
              Imprimir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RetailPOS;