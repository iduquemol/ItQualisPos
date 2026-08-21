import {
  // Alimentos y Bebidas
  Coffee,
  Utensils,
  Pizza,
  Sandwich,
  Beer,
  Wine,
  IceCream,
  Soup,

  // Comercio General y Modas
  ShoppingBag,
  Tag,
  Shirt,
  Footprints,
  Glasses,
  Gem,
  Gift,
  Store,

  // Tecnología y Electrónica
  Smartphone,
  Laptop,
  Headphones,
  Tv,
  Camera,
  Watch,

  // Supermercado y Tienda de Barrio
  Apple,
  Milk,
  Beef,
  Package,

  // Salud, Belleza y Servicios
  Pill,
  Scissors,
  Sparkles,
  Heart,
  Briefcase,
  Smile,

  // Hogar, Muebles y Herramientas
  Home,
  Wrench,
  Dumbbell,
  Armchair,
  Book,
  Music,

  // Transporte, Domicilios y Logística
  Truck,
  Bike,
  Car,
  Plane,
  Fuel,
  MapPin,
  Navigation,
  Compass,

  type LucideIcon
} from "lucide-react";

export interface ICategoryIcons {
  id: string;
  label: string;
  icon: LucideIcon;
}

export const CATEGORY_ICONS: ICategoryIcons[] = [
  // General & Tienda
  { id: "ShoppingBag", label: "Bolsa de compras", icon: ShoppingBag },
  { id: "Tag", label: "Etiqueta / Ofertas", icon: Tag },
  { id: "Store", label: "General / Tienda", icon: Store },
  { id: "Package", label: "Paquete / Producto", icon: Package },
  { id: "Gift", label: "Regalos / Promociones", icon: Gift },

  // Gastronomía
  { id: "Coffee", label: "Cafetería / Bebidas", icon: Coffee },
  { id: "Utensils", label: "Restaurante / Comida", icon: Utensils },
  { id: "Pizza", label: "Comida Rápida", icon: Pizza },
  { id: "Sandwich", label: "Snacks / Entradas", icon: Sandwich },
  { id: "Beer", label: "Licores / Bar", icon: Beer },
  { id: "Wine", label: "Vinos / Cocteles", icon: Wine },
  { id: "IceCream", label: "Postres / Heladería", icon: IceCream },
  { id: "Soup", label: "Sopas / Caldos", icon: Soup },

  // Supermercado / Víveres
  { id: "Apple", label: "Frutas y Verduras", icon: Apple },
  { id: "Milk", label: "Lácteos y Huevos", icon: Milk },
  { id: "Beef", label: "Carnicería y Embutidos", icon: Beef },

  // Moda & Personal
  { id: "Shirt", label: "Ropa / Moda", icon: Shirt },
  { id: "Footprints", label: "Calzado / Zapatos", icon: Footprints },
  { id: "Glasses", label: "Óptica / Accesorios", icon: Glasses },
  { id: "Gem", label: "Joyería / Lujo", icon: Gem },
  { id: "Watch", label: "Relojería", icon: Watch },

  // Tecnología
  { id: "Smartphone", label: "Celulares / Móviles", icon: Smartphone },
  { id: "Laptop", label: "Cómputo / Tecnología", icon: Laptop },
  { id: "Headphones", label: "Audífonos / Audio", icon: Headphones },
  { id: "Tv", label: "Electrodomésticos", icon: Tv },
  { id: "Camera", label: "Fotografía", icon: Camera },

  // Salud, Servicios & Otros
  { id: "Pill", label: "Farmacia / Salud", icon: Pill },
  { id: "Heart", label: "Cuidado Personal", icon: Heart },
  { id: "Scissors", label: "Belleza / Peluquería", icon: Scissors },
  { id: "Sparkles", label: "Cosméticos", icon: Sparkles },
  { id: "Briefcase", label: "Oficina / Servicios", icon: Briefcase },
  { id: "Book", label: "Librería / Papelería", icon: Book },
  { id: "Smile", label: "Juguetería / Niños", icon: Smile },

  // Hogar & Varios
  { id: "Home", label: "Hogar", icon: Home },
  { id: "Armchair", label: "Muebles / Decó", icon: Armchair },
  { id: "Wrench", label: "Ferretería / Mantenimiento", icon: Wrench },
  { id: "Dumbbell", label: "Deportes / Fitness", icon: Dumbbell },
  { id: "Music", label: "Música / Instrumentos", icon: Music },

  // Transporte & Domicilios
  { id: "Truck", label: "Transporte / Fletes", icon: Truck },
  { id: "Bike", label: "Domicilios / Mensajería", icon: Bike },
  { id: "Car", label: "Automotriz / Vehículos", icon: Car },
  { id: "Plane", label: "Importaciones / Envíos", icon: Plane },
  { id: "Fuel", label: "Combustibles", icon: Fuel },
  { id: "MapPin", label: "Ubicación / Zonas", icon: MapPin },
  { id: "Navigation", label: "Logística / Rutas", icon: Navigation },
  { id: "Compass", label: "Expedición", icon: Compass }
];

// Mapa para renderizado dinámico rápido usando el string guardado en BD
export const iconMap: Record<string, LucideIcon> = CATEGORY_ICONS.reduce((acc, item) => {
  acc[item.id] = item.icon;
  return acc;
}, {} as Record<string, LucideIcon>);