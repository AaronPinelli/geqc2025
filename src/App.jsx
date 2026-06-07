import React, { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  ShoppingCart, 
  TrendingUp, 
  Calendar,
  X,
  History,
  MapPin,
  ChevronLeft,
  ClipboardList,
  LayoutGrid,
  Pizza,
  Sandwich,
  Coffee,
  UtensilsCrossed,
  Soup,
  Flame,
  CircleDashed,
  Keyboard,
  Printer,
  Bike, 
  Database,
  Eraser,
  CreditCard,
  Banknote,
  DollarSign,
  FilePenLine,
  Wallet, 
  ArrowDownCircle, 
  PieChart,
  Search,
  StickyNote,
  ClipboardCheck,
  AlertCircle
} from 'lucide-react';

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInAnonymously 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  serverTimestamp,
  writeBatch, 
  getDocs,
  setDoc
} from 'firebase/firestore';

// --- CONFIGURACIÓN DE FIREBASE ---
const firebaseConfig = {
  apiKey: "AIzaSyC6wXVbFaW1ojhvaRe28-3CqMb8z-dHsV0",
  authDomain: "geqc-01.firebaseapp.com",
  projectId: "geqc-01",
  storageBucket: "geqc-01.firebasestorage.app",
  messagingSenderId: "550440221424",
  appId: "1:550440221424:web:2cf933738ef482c3452035",
  measurementId: "G-7X2NTRE23H"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = 'geqc-01-produccion';

// --- CATEGORÍAS BASE ---
const CATEGORIAS = [
  'Envío', 'Hamburguesas', 'Pizzas', 'Al plato', 'Pastas', 'Fritas y más', 'Sandwiches', 'Bebidas', 'Otros'
];

// --- ICONOS SEGUROS ---
const CATEGORY_ICONS = {
  'Envío': Bike, 
  'Hamburguesas': Sandwich, 
  'Pizzas': Pizza, 
  'Al plato': Utensils, 
  'Pastas': Soup, 
  'Fritas y más': Flame, 
  'Sandwiches': Sandwich, 
  'Bebidas': Coffee, 
  'Otros': CircleDashed
};

// --- FECHA DE CORTE (14 de Diciembre) ---
const CUTOFF_DATE = new Date(2025, 11, 14); 

// --- DATOS INICIALES ---
const INITIAL_MENU = [
  { name: 'Envío a Domicilio', price: 0, category: 'Envío', description: 'Costo variable' },
  { name: 'Clásica Simple', price: 7500, category: 'Hamburguesas', description: 'Pan, Carne, Cheddar' },
  { name: 'Clásica Doble', price: 8900, category: 'Hamburguesas', description: 'Pan, Carne, Cheddar' },
  { name: 'Clásica Completa Simple', price: 9000, category: 'Hamburguesas', description: 'Pan, Carne, Cheddar, Lechuga, Tomate, Huevo' },
  { name: 'Clásica Completa Doble', price: 10000, category: 'Hamburguesas', description: 'Doble carne, completa' },
  { name: 'Americana Simple', price: 9000, category: 'Hamburguesas', description: 'Pan, Carne, Cheddar, Cebolla Caram., Panceta, Salsa' },
  { name: 'Americana Doble', price: 10000, category: 'Hamburguesas', description: 'Doble carne, americana' },
  { name: 'Argenta Simple', price: 8900, category: 'Hamburguesas', description: 'Pan, Carne, Muzza, Jamón, Ketchup especial' },
  { name: 'Argenta Doble', price: 9900, category: 'Hamburguesas', description: 'Doble carne, argenta' },
  { name: 'Azul Simple', price: 9000, category: 'Hamburguesas', description: 'Pan, Carne, Cebolla Caram., Queso Azul' },
  { name: 'Azul Doble', price: 10000, category: 'Hamburguesas', description: 'Doble carne, azul' },
  { name: 'Pollo Crispy', price: 9000, category: 'Hamburguesas', description: 'Medallón crispy, tomate, lechuga, salsa queso' },
  { name: 'Hamburguesa de Pollo', price: 9000, category: 'Hamburguesas', description: 'Doble medallón pollo, verdeo, huevo frito' },
  { name: 'Estuche de Fritas (Extra)', price: 3000, category: 'Hamburguesas', description: 'Porción extra' },
  { name: 'Extra Cheddar', price: 1200, category: 'Hamburguesas', description: 'Adicional' },
  { name: 'Extra Bacon', price: 1500, category: 'Hamburguesas', description: 'Adicional' },
  { name: 'Huevo Extra', price: 300, category: 'Hamburguesas', description: 'Adicional' },
  { name: 'Medallón c/Cheddar Extra', price: 1900, category: 'Hamburguesas', description: 'Adicional carne' },
  { name: 'Huevo a la Plancha Extra', price: 300, category: 'Hamburguesas', description: 'Adicional' },
  { name: 'Verdura Extra', price: 500, category: 'Hamburguesas', description: 'Adicional' },
  { name: 'Muzza', price: 9500, category: 'Pizzas', description: 'Salsa tomate, muzzarella' },
  { name: 'Guovo', price: 9800, category: 'Pizzas', description: 'Salsa tomate, muzza, huevo' },
  { name: 'Fugazza Argentina', price: 10000, category: 'Pizzas', description: 'Cebolla, muzza' },
  { name: 'Capresse', price: 11000, category: 'Pizzas', description: 'Muzza, albahaca, tomate' },
  { name: 'Pallerosa', price: 14500, category: 'Pizzas', description: 'Muzza, fritas, huevos a la plancha' },
  { name: 'Especial J y M', price: 15000, category: 'Pizzas', description: 'Jamón y morrón' },
  { name: 'Calabreza', price: 15500, category: 'Pizzas', description: 'Muzza, longaniza' },
  { name: 'Fugazza Azul', price: 15500, category: 'Pizzas', description: 'Cebolla, muzza, queso azul' },
  { name: 'Napolitana', price: 16000, category: 'Pizzas', description: 'Muzza, jamón, tomate, ajo' },
  { name: '4 Quesos', price: 16500, category: 'Pizzas', description: 'Muzza, provolone, cheddar, azul' },
  { name: 'Anchoas', price: 16500, category: 'Pizzas', description: 'Salsa tomate, muzza, anchoas' },
  { name: 'Mila A la Pizza', price: 8900, category: 'Sandwiches', description: 'Con fritas. Salsa tomate, muzza, huevo' },
  { name: 'Mila Super Completo', price: 9500, category: 'Sandwiches', description: 'Con fritas. Lechuga, tomate, jamón, queso, huevo' },
  { name: 'Lomo Quincho', price: 8900, category: 'Sandwiches', description: 'Con fritas. Cebolla caram., crema queso' },
  { name: 'Lomo Super Completo', price: 9500, category: 'Sandwiches', description: 'Con fritas. Lechuga, tomate, jamón, queso, huevo' },
  { name: 'Pollo Especiado', price: 8900, category: 'Sandwiches', description: 'Con fritas. Berenjena escabeche, huevo duro' },
  { name: 'Pollo Completo', price: 9000, category: 'Sandwiches', description: 'Con fritas. Lechuga, tomate, huevo plancha' },
  { name: 'Tortilla de Papa Grande', price: 6000, category: 'Al plato', description: 'Clásica' },
  { name: 'Tortilla de Papa Chica', price: 5500, category: 'Al plato', description: 'Clásica' },
  { name: 'Tortilla Rellena Grande', price: 7500, category: 'Al plato', description: 'Rellena J y Q' },
  { name: 'Tortilla Rellena Chica', price: 7000, category: 'Al plato', description: 'Rellena J y Q' },
  { name: 'Omelette c/ensalada', price: 6500, category: 'Al plato', description: 'Con guarnición' },
  { name: 'Wok de Pollo', price: 7200, category: 'Al plato', description: 'Vegetales salteados y pollo' },
  { name: 'Wok de Lomo', price: 7200, category: 'Al plato', description: 'Vegetales salteados y carne' },
  { name: 'Chuleta Cerdo + Guarnición', price: 7500, category: 'Al plato', description: 'Con papas o ensalada' },
  { name: 'Pechuga a la Plancha + Guarn', price: 7500, category: 'Al plato', description: 'Con papas o ensalada' },
  { name: 'Pechuga Crispy + Guarnición', price: 7500, category: 'Al plato', description: 'Con papas o ensalada' },
  { name: 'Mila con Guarnición', price: 7200, category: 'Al plato', description: 'Carne o Pollo' },
  { name: 'Mila a la Pizza c/Guarnición', price: 7900, category: 'Al plato', description: 'Carne o Pollo' },
  { name: 'Mila Napo con Guarnición', price: 8400, category: 'Al plato', description: 'Carne o Pollo' },
  { name: 'Mila Fugazza Azul c/fritas caballo', price: 8900, category: 'Al plato', description: 'Especial' },
  { name: 'Mila Cheddar a caballo c/fritas', price: 8900, category: 'Al plato', description: 'Especial' },
  { name: 'Mix Verduras y Pollo', price: 6500, category: 'Al plato', description: 'Ensalada' },
  { name: 'Mix Verduras, J, Q y Huevo', price: 6500, category: 'Al plato', description: 'Ensalada' },
  { name: 'Arroz, Mix Verduras y Pollo', price: 6800, category: 'Al plato', description: 'Ensalada tibia' },
  { name: 'Huevo Extra c/u', price: 300, category: 'Al plato', description: 'Adicional' },
  { name: 'Fideos Bolognesa', price: 6700, category: 'Pastas', description: 'Salsa roja con carne' },
  { name: 'Fideos Crema Champiñones', price: 7500, category: 'Pastas', description: 'Salsa blanca' },
  { name: 'Fideos Crema Azul', price: 7700, category: 'Pastas', description: 'Salsa roquefort' },
  { name: 'Sorrentinos J&Q Bolognesa', price: 7700, category: 'Pastas', description: 'Rellenos Jamón y Queso' },
  { name: 'Sorrentinos J&Q Champiñones', price: 8500, category: 'Pastas', description: 'Rellenos Jamón y Queso' },
  { name: 'Sorrentinos J&Q Crema Azul', price: 8700, category: 'Pastas', description: 'Rellenos Jamón y Queso' },
  { name: 'Sorrentinos Verdura Bolognesa', price: 7700, category: 'Pastas', description: 'Rellenos Verdura' },
  { name: 'Sorrentinos Verdura Champiñones', price: 8500, category: 'Pastas', description: 'Rellenos Verdura' },
  { name: 'Sorrentinos Verdura Crema Azul', price: 8700, category: 'Pastas', description: 'Rellenos Verdura' },
  { name: 'Fritas Bandeja Grande', price: 5500, category: 'Fritas y más', description: 'Porción para compartir' },
  { name: 'Salchipapas', price: 6500, category: 'Fritas y más', description: 'Fritas con salchicha' },
  { name: 'Fritas c/Cheddar y Verdeo', price: 6900, category: 'Fritas y más', description: 'Especiales' },
  { name: 'Papas Quincho', price: 7800, category: 'Fritas y más', description: 'Cheddar, carne, criolla' },
  { name: 'Papas Titi', price: 7800, category: 'Fritas y más', description: 'Trocitos mila, alioli' },
  { name: 'Fritas con Nuggets Pollo', price: 7300, category: 'Fritas y más', description: 'Combo picada' },
  { name: 'Extra Bacon (Fritas)', price: 1200, category: 'Fritas y más', description: 'Adicional' },
  { name: 'Extra Cheddar (Fritas)', price: 1200, category: 'Fritas y más', description: 'Adicional' },
  { name: 'Agua Chica', price: 1500, category: 'Bebidas', description: '500cc' },
  { name: 'Agua 2L', price: 2300, category: 'Bebidas', description: 'Familiar' },
  { name: 'Agua Saborizada 1.5L', price: 2700, category: 'Bebidas', description: 'Levité/Aquarius' },
  { name: 'Manaos 2L', price: 2900, category: 'Bebidas', description: 'Familiar' },
  { name: 'Cerveza Lata 473', price: 3000, category: 'Bebidas', description: 'Brahma/Quilmes/etc' },
  { name: 'Cerveza Premium 473', price: 3700, category: 'Bebidas', description: 'Stella/Corona' },
  { name: 'Coca/Sprite 1.5L', price: 4500, category: 'Bebidas', description: 'Familiar' }
];

// --- COMPONENTES AUXILIARES ---

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-[#034aaa]/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm print:hidden">
      <div className="bg-[#fdfbf7] rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] w-full max-w-md overflow-hidden transform transition-all border-4 border-black/20 max-h-[90dvh] overflow-y-auto">
        <div className="flex justify-between items-center p-5 border-b-2 border-black/10 bg-white sticky top-0 z-10">
          <h3 className="font-black text-xl text-[#034aaa] uppercase tracking-widest">{title}</h3>
          <button onClick={onClose} className="p-2 bg-red-50 hover:bg-red-500 hover:text-white rounded-full text-red-500 transition-colors"><X size={24} strokeWidth={3} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

// Botón Modernizado Marfil con Borde Inferior de Color Único
const BigButton = ({ icon: Icon, label, onClick, borderColor }) => (
  <button onClick={onClick} className={`bg-[#fdfbf7] text-[#034aaa] p-4 sm:p-6 rounded-[2.5rem] shadow-[0_15px_35px_rgba(0,0,0,0.3)] transform transition-all hover:-translate-y-2 hover:shadow-[0_20px_45px_rgba(0,0,0,0.5)] active:translate-y-1 flex flex-col items-center justify-center aspect-square w-full h-full min-h-[140px] md:min-h-[160px] border-b-[10px] ${borderColor} group relative overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="p-4 sm:p-5 rounded-full mb-3 sm:mb-4 bg-white shadow-inner group-hover:scale-110 transition-transform duration-300 border border-slate-200">
       <Icon size={40} strokeWidth={2} className="text-[#034aaa] sm:w-12 sm:h-12 w-10 h-10" />
    </div>
    <span className="text-lg md:text-2xl font-black tracking-widest uppercase z-10 text-center leading-tight">{label}</span>
  </button>
);

const PrintableTicket = ({ cart, total, customerName, customerAddress, date }) => {
  const formatPriceTicket = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  const dateStr = date ? `${date.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit'})} ${date.toLocaleTimeString('es-AR', {hour: '2-digit', minute:'2-digit', hour12: false})}` : '';

  return (
    <div id="printable-area" className="hidden print:block bg-white text-black p-4 w-full max-w-[80mm] mx-auto font-mono text-sm leading-tight">
      <div className="text-center mb-4 border-b border-black pb-2 border-dashed">
        <h1 className="text-xl font-black uppercase">EL QUINCHO</h1>
        <p className="text-xs">Comprobante de Pedido</p>
        <p className="text-xs mt-1">{dateStr}</p>
      </div>
      <div className="mb-4 text-xs">
        <p><span className="font-bold">Cliente:</span> {customerName || 'Mostrador'}</p>
        {customerAddress && <p><span className="font-bold">Dir:</span> {customerAddress}</p>}
      </div>
      <div className="border-b border-black border-dashed mb-2"></div>
      <div className="flex flex-col gap-2 mb-4">
        {cart.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex justify-between items-start">
            <div className="flex flex-col gap-1 w-[70%]">
              <div className="flex gap-2">
                 <span className="font-bold">{item.qty}x</span>
                 <span>{item.name} {item.isManual ? '(M)' : ''}</span>
              </div>
              {item.note && (
                 <span className="text-[10px] italic ml-6 uppercase">** {item.note} **</span>
              )}
            </div>
            <span className="font-bold whitespace-nowrap">
              {formatPriceTicket(item.price * item.qty)}
            </span>
          </div>
        ))}
      </div>
      <div className="border-t border-black border-dashed pt-2 mb-4">
        <div className="flex justify-between items-center text-lg font-black">
          <span>TOTAL</span>
          <span>{formatPriceTicket(total)}</span>
        </div>
      </div>
      <div className="text-center text-xs mt-6">
        <p>¡Gracias por su compra!</p>
        <p className="mt-1">@el_quincho.cocina</p>
      </div>
    </div>
  );
};

// --- APP PRINCIPAL ---

export default function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('home');
  const [selectedCategoryView, setSelectedCategoryView] = useState(null); 

  // Datos
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  
  // ESTADOS PRESUPUESTO
  const [wallet, setWallet] = useState({ cash: 0, transfer: 0 });
  const [expenses, setExpenses] = useState([]);
  const [isWalletEditModalOpen, setIsWalletEditModalOpen] = useState(false);
  const [walletEditValues, setWalletEditValues] = useState({ cash: '', transfer: '' });
  
  // ESTADOS GASTOS
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseSource, setExpenseSource] = useState('cash'); 

  // ESTADO PEDIDO
  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [printData, setPrintData] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); 

  // ESTADO UI
  const [selectedPosCategory, setSelectedPosCategory] = useState(CATEGORIAS[0]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isManualItemModalOpen, setIsManualItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null); 
  
  // ESTADO NUEVA CATEGORÍA
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  // ESTADO NOTAS EN ITEMS
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [currentNoteItem, setCurrentNoteItem] = useState(null); 
  const [noteText, setNoteText] = useState('');

  // ESTADO CUENTA FINAL
  const [isArqueoModalOpen, setIsArqueoModalOpen] = useState(false);
  const [arqueoValues, setArqueoValues] = useState({ cash: '', transfer: '' });
  const [arqueoResult, setArqueoResult] = useState(null);

  // ESTADOS PAGO
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash'); 
  const [cashAmountInput, setCashAmountInput] = useState('');

  // ESTADO EDICIÓN HISTORIAL
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [orderBeingEdited, setOrderBeingEdited] = useState(null);
  const [manualEditItemName, setManualEditItemName] = useState('');
  const [manualEditItemPrice, setManualEditItemPrice] = useState('');

  // Inputs
  const [newItemName, setNewItemName] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(CATEGORIAS[0]);
  const [manualItemName, setManualItemName] = useState('');
  const [manualItemPrice, setManualItemPrice] = useState('');
  const [loading, setLoading] = useState(true);

  // --- Auth & Data ---
  useEffect(() => {
    const initAuth = async () => { try { await signInAnonymously(auth); } catch (e) { console.error(e); } };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    const menuRef = collection(db, 'artifacts', appId, 'menu');
    const unsubMenu = onSnapshot(menuRef, (s) => {
      const items = s.docs.map(d => ({ id: d.id, ...d.data() }));
      items.sort((a, b) => a.name.localeCompare(b.name));
      setMenuItems(items);
      setLoading(false);
    }, (e) => { console.error(e); setLoading(false); });

    const ordersRef = collection(db, 'artifacts', appId, 'orders');
    const unsubOrders = onSnapshot(ordersRef, (s) => {
      const ordersData = s.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() || new Date() }));
      ordersData.sort((a, b) => b.createdAt - a.createdAt); 
      setOrders(ordersData);
    });

    const expensesRef = collection(db, 'artifacts', appId, 'expenses');
    const unsubExpenses = onSnapshot(expensesRef, (s) => {
      const expData = s.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate() || new Date() }));
      expData.sort((a, b) => b.createdAt - a.createdAt);
      setExpenses(expData);
    });

    const walletRef = doc(db, 'artifacts', appId, 'system', 'wallets');
    const unsubWallet = onSnapshot(walletRef, (docSnap) => {
      if (docSnap.exists()) setWallet(docSnap.data());
      else setDoc(walletRef, { cash: 0, transfer: 0 });
    });

    return () => { unsubMenu(); unsubOrders(); unsubExpenses(); unsubWallet(); };
  }, [user]);

  // --- Categorías Dinámicas ---
  const dynamicCategories = useMemo(() => {
    const cats = new Set(CATEGORIAS);
    menuItems.forEach(item => {
      if (item.category) cats.add(item.category);
    });
    return Array.from(cats);
  }, [menuItems]);

  // --- Helpers ---
  const formatCurrency = (val) => new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(val);
  const formatDate = (date) => date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const getItemsByCategory = (cat) => menuItems.filter(i => (i.category || 'Otros') === cat);

  const getOrderPaymentStatus = (order) => {
    if (order.createdAt && order.createdAt < CUTOFF_DATE) return 'unspecified';
    if (order.paymentType === 'unspecified') return 'unspecified';
    return order.paymentType || 'unspecified';
  };

  const liveWallet = useMemo(() => {
    let cash = wallet.cash || 0;
    let transfer = wallet.transfer || 0;

    orders.forEach(order => {
      const status = getOrderPaymentStatus(order);
      if (status !== 'unspecified') {
        if (status === 'mixed') {
          cash += (order.cashAmount || 0);
          transfer += (order.transferAmount || 0);
        } else if (status === 'transfer') {
          transfer += order.total;
        } else {
          cash += order.total;
        }
      }
    });

    expenses.forEach(exp => {
      if (exp.source === 'cash') cash -= exp.amount;
      else transfer -= exp.amount;
    });

    return { cash, transfer };
  }, [orders, expenses, wallet]);

  const handleUpdateWalletManually = async () => {
    const targetCash = parseFloat(walletEditValues.cash);
    const targetTransfer = parseFloat(walletEditValues.transfer);
    if(isNaN(targetCash) || isNaN(targetTransfer)) return;

    let currentFlowCash = 0;
    let currentFlowTransfer = 0;

    orders.forEach(order => {
      const status = getOrderPaymentStatus(order);
      if (status !== 'unspecified') {
        if (status === 'mixed') {
          currentFlowCash += (order.cashAmount || 0);
          currentFlowTransfer += (order.transferAmount || 0);
        } else if (status === 'transfer') {
          currentFlowTransfer += order.total;
        } else {
          currentFlowCash += order.total;
        }
      }
    });

    expenses.forEach(exp => {
      if (exp.source === 'cash') currentFlowCash -= exp.amount;
      else currentFlowTransfer -= exp.amount;
    });

    const newBaseCash = targetCash - currentFlowCash;
    const newBaseTransfer = targetTransfer - currentFlowTransfer;

    await setDoc(doc(db, 'artifacts', appId, 'system', 'wallets'), { cash: newBaseCash, transfer: newBaseTransfer });
    setIsWalletEditModalOpen(false);
  };

  const handleCleanupDuplicates = async () => {
    if(!window.confirm("¿Buscar y eliminar items repetidos automáticamente?")) return;
    try {
      const menuRef = collection(db, 'artifacts', appId, 'menu');
      const snapshot = await getDocs(menuRef);
      if (snapshot.empty) return;
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      const uniqueNames = new Set();
      const duplicatesToDelete = [];
      items.forEach(item => {
        const normalizedName = item.name.toLowerCase().trim();
        if (uniqueNames.has(normalizedName)) { duplicatesToDelete.push(item.id); } 
        else { uniqueNames.add(normalizedName); }
      });
      if (duplicatesToDelete.length > 0) {
        if(!window.confirm(`Se encontraron ${duplicatesToDelete.length} duplicados. ¿Eliminarlos?`)) return;
        const batch = writeBatch(db);
        duplicatesToDelete.forEach(id => {
          const docRef = doc(db, 'artifacts', appId, 'menu', id);
          batch.delete(docRef);
        });
        await batch.commit();
        alert("Duplicados eliminados.");
      } else {
        alert("Todo limpio.");
      }
    } catch (e) { console.error("Error limpiando:", e); }
  };

  const uploadInitialMenu = async () => {
    if(!window.confirm("¿Cargar carta completa? Esto actualizará precios.")) return;
    try {
      const batch = writeBatch(db);
      INITIAL_MENU.forEach(item => {
        const itemId = item.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const docRef = doc(db, 'artifacts', appId, 'menu', itemId);
        batch.set(docRef, { ...item, active: true });
      });
      await batch.commit();
      alert("Carta actualizada.");
    } catch (e) { console.error(e); }
  };

  const handlePurgeOldOrders = async () => {
    if(!window.confirm("⚠️ ATENCIÓN: ¿Quieres borrar todos los pedidos de MESES ANTERIORES? \n\nEsto limpiará el historial viejo. Tu saldo actual en caja NO se verá afectado.")) return;
    try {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      
      const ordersToPurge = orders.filter(o => {
        const d = o.createdAt;
        if (!d) return true; 
        return !(d.getMonth() === currentMonth && d.getFullYear() === currentYear);
      });

      if (ordersToPurge.length === 0) { alert("No hay pedidos de meses anteriores."); return; }
      if(!window.confirm(`Se van a eliminar ${ordersToPurge.length} pedidos antiguos permanentemente. ¿Continuar?`)) return;

      let cashToKeep = 0; let transferToKeep = 0;
      
      ordersToPurge.forEach(order => {
        const status = getOrderPaymentStatus(order);
        if (status === 'mixed') { cashToKeep += (order.cashAmount || 0); transferToKeep += (order.transferAmount || 0); } 
        else if (status === 'transfer') { transferToKeep += order.total; } 
        else if (status === 'cash') { cashToKeep += order.total; }
      });

      const currentWalletCash = wallet.cash || 0;
      const currentWalletTransfer = wallet.transfer || 0;
      await setDoc(doc(db, 'artifacts', appId, 'system', 'wallets'), { cash: currentWalletCash + cashToKeep, transfer: currentWalletTransfer + transferToKeep });

      let batch = writeBatch(db);
      let count = 0;
      for (let i = 0; i < ordersToPurge.length; i++) {
        batch.delete(doc(db, 'artifacts', appId, 'orders', ordersToPurge[i].id));
        count++;
        if (count === 490) { await batch.commit(); batch = writeBatch(db); count = 0; }
      }
      if (count > 0) await batch.commit();
      
      alert(`✅ Se limpiaron ${ordersToPurge.length} pedidos.`);
    } catch (error) { console.error("Error purgando:", error); alert("Error"); }
  };

  const openNoteModal = (item) => {
    setCurrentNoteItem(item);
    setNoteText(item.note || '');
    setIsNoteModalOpen(true);
  };

  const saveNote = () => {
    setCart(prev => prev.map(i => {
      if (i.id === currentNoteItem.id && i.isManual === currentNoteItem.isManual) {
        return { ...i, note: noteText };
      }
      return i;
    }));
    setIsNoteModalOpen(false);
  };

  const calculateArqueo = () => {
    const realCash = parseFloat(arqueoValues.cash) || 0;
    const realTransfer = parseFloat(arqueoValues.transfer) || 0;
    const diffCash = realCash - liveWallet.cash;
    const diffTransfer = realTransfer - liveWallet.transfer;
    setArqueoResult({ diffCash, diffTransfer, realCash, realTransfer });
  };

  const handleAddExpense = async () => {
    const amount = parseFloat(expenseAmount);
    if(!expenseDesc || isNaN(amount) || amount <= 0) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'expenses'), {
        description: expenseDesc, amount: amount, source: expenseSource, createdAt: serverTimestamp()
      });
      setIsExpenseModalOpen(false); setExpenseDesc(''); setExpenseAmount('');
    } catch(e) { console.error(e); alert("Error al guardar gasto"); }
  };

  const handleDeleteExpense = async (expense) => {
    if(!window.confirm("¿Borrar este gasto?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'expenses', expense.id));
    } catch(e) { console.error(e); }
  };

  const handlePrint = (dataToPrint = null) => {
    if (dataToPrint) { setPrintData(dataToPrint); } 
    else { setPrintData({ cart, total: cartTotal, customerName, customerAddress, date: new Date() }); }
    setTimeout(() => { window.print(); }, 100);
  };

  const handleSaveItem = async () => {
    if (!newItemName || !newItemPrice) return;
    const price = parseFloat(newItemPrice);
    if (isNaN(price)) return;
    try {
      let docId = editingItem ? editingItem.id : newItemName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const data = { name: newItemName, price, description: newItemDesc, category: newItemCategory, active: true };
      const batch = writeBatch(db);
      batch.set(doc(db, 'artifacts', appId, 'menu', docId), data);
      await batch.commit();
      setIsEditModalOpen(false); resetForm();
    } catch (e) { console.error(e); }
  };

  const handleDeleteOrder = async (order) => {
    if(!window.confirm("¿Seguro que quieres eliminar este pedido?")) return;
    try {
      await deleteDoc(doc(db, 'artifacts', appId, 'orders', order.id));
    } catch (e) { console.error("Error borrando pedido", e); }
  };

  const openPaymentModal = (order) => {
    setSelectedOrderForPayment(order);
    setPaymentMethod(order.paymentType === 'unspecified' ? 'cash' : order.paymentType);
    setCashAmountInput(order.cashAmount ? order.cashAmount.toString() : '');
    setIsPaymentModalOpen(true);
  };

  const savePaymentDetails = async () => {
    if (!selectedOrderForPayment) return;
    let updateData = { paymentType: paymentMethod };
    let newCash = 0; let newTransfer = 0;
    
    if (paymentMethod === 'mixed') {
      const cash = parseFloat(cashAmountInput);
      if (isNaN(cash) || cash < 0 || cash > selectedOrderForPayment.total) { alert("Monto inválido."); return; }
      newCash = cash;
      newTransfer = selectedOrderForPayment.total - cash;
    } else if (paymentMethod === 'transfer') {
      newTransfer = selectedOrderForPayment.total;
    } else {
      newCash = selectedOrderForPayment.total;
    }

    updateData.cashAmount = newCash;
    updateData.transferAmount = newTransfer;

    try {
      await updateDoc(doc(db, 'artifacts', appId, 'orders', selectedOrderForPayment.id), updateData);
      setIsPaymentModalOpen(false);
    } catch (e) { console.error(e); alert("Error"); }
  };

  const openEditOrderModal = (order) => {
    setOrderBeingEdited({ ...order, items: [...order.items] });
    setManualEditItemName(''); setManualEditItemPrice(''); setIsEditOrderModalOpen(true);
  };

  const updateEditedOrderQty = (itemId, delta) => {
    if (!orderBeingEdited) return;
    const updatedItems = orderBeingEdited.items.map(item => {
      if (item.id === itemId) return { ...item, qty: Math.max(1, item.qty + delta) };
      return item;
    });
    setOrderBeingEdited({ ...orderBeingEdited, items: updatedItems });
  };

  const removeEditedOrderItem = (itemId) => {
    if (!orderBeingEdited) return;
    const updatedItems = orderBeingEdited.items.filter(item => item.id !== itemId);
    setOrderBeingEdited({ ...orderBeingEdited, items: updatedItems });
  };

  const addManualItemToEditedOrder = () => {
    const price = parseFloat(manualEditItemPrice);
    if (!orderBeingEdited || !manualEditItemName || isNaN(price)) return;
    const newItem = { id: `edit-manual-${Date.now()}`, name: manualEditItemName, price: price, qty: 1, isManual: true };
    setOrderBeingEdited({ ...orderBeingEdited, items: [...orderBeingEdited.items, newItem] });
    setManualEditItemName(''); setManualEditItemPrice('');
  };

  const saveEditedOrder = async () => {
    if (!orderBeingEdited) return;
    if (orderBeingEdited.items.length === 0) {
      if(window.confirm("Pedido vacío. ¿Eliminar?")) { await handleDeleteOrder(orderBeingEdited); setIsEditOrderModalOpen(false); }
      return;
    }
    const newTotal = orderBeingEdited.items.reduce((acc, i) => acc + (i.price * i.qty), 0);
    const updateData = { items: orderBeingEdited.items, total: newTotal };
    if (newTotal !== orderBeingEdited.total) {
       updateData.paymentType = 'unspecified';
       updateData.cashAmount = 0;
       updateData.transferAmount = 0;
       alert("Nota: Al cambiar el total, el pago se debe volver a especificar.");
    }
    try {
      await updateDoc(doc(db, 'artifacts', appId, 'orders', orderBeingEdited.id), updateData);
      setIsEditOrderModalOpen(false);
    } catch (e) { console.error(e); alert("Error."); }
  };

  const resetForm = () => { 
    setNewItemName(''); 
    setNewItemPrice(''); 
    setNewItemDesc(''); 
    setNewItemCategory(dynamicCategories[0] || CATEGORIAS[0]); 
    setIsCustomCategory(false); 
    setEditingItem(null); 
  };

  const handleDeleteItem = async (id) => { if (window.confirm("¿Eliminar?")) await deleteDoc(doc(db, 'artifacts', appId, 'menu', id)); };
  
  const addToCart = (item) => setCart(p => {
    const ex = p.find(i => i.id === item.id);
    return ex ? p.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...p, { ...item, qty: 1 }];
  });
  
  const addManualItemToCart = () => {
    const p = parseFloat(manualItemPrice);
    if (!manualItemName || isNaN(p)) return;
    setCart(prev => [...prev, { id: `manual-${Date.now()}`, name: manualItemName, price: p, qty: 1, isManual: true }]);
    setManualItemName(''); setManualItemPrice(''); setIsManualItemModalOpen(false);
  };

  const removeFromCart = (id) => setCart(p => p.filter(i => i.id !== id));
  const updateCartQty = (id, d) => setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i));
  const cartTotal = useMemo(() => cart.reduce((acc, i) => acc + (i.price * i.qty), 0), [cart]);

  const handleCheckout = async () => {
    if (cart.length === 0 || !customerName.trim()) { alert("Falta Nombre del Cliente."); return; }
    try {
      await addDoc(collection(db, 'artifacts', appId, 'orders'), { 
        items: cart, total: cartTotal, customerName, customerAddress, createdAt: serverTimestamp(),
        paymentType: 'unspecified', cashAmount: 0, transferAmount: 0
      });
      if(window.confirm("¿Imprimir Ticket?")) handlePrint();
      setCart([]); setCustomerName(''); setCustomerAddress('');
    } catch (e) { console.error(e); alert("Error."); }
  };

  const financeStats = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDay = today.getDate();
    let todayTotal = 0; let monthTotal = 0; let todayCash = 0; let todayTransfer = 0;
    const historyMap = {};

    orders.forEach(order => {
      const d = order.createdAt; if (!d) return;
      const isToday = d.getDate() === currentDay && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) monthTotal += order.total;
      
      const status = getOrderPaymentStatus(order);

      if (isToday) {
        todayTotal += order.total;
        if (status !== 'unspecified') {
           if (status === 'mixed') { todayCash += (order.cashAmount || 0); todayTransfer += (order.transferAmount || 0); } 
           else if (status === 'transfer') { todayTransfer += order.total; } 
           else { todayCash += order.total; }
        }
      }
      const dateKey = formatDate(d);
      if (!historyMap[dateKey]) historyMap[dateKey] = 0;
      historyMap[dateKey] += order.total;
    });
    const dailyHistory = Object.entries(historyMap).map(([date, total]) => ({ date, total })).sort((a, b) => { const [d1, m1, y1] = a.date.split('/'); const [d2, m2, y2] = b.date.split('/'); return new Date(y2, m2-1, d2) - new Date(y1, m1-1, d1); });
    return { todayTotal, monthTotal, dailyHistory, todayCash, todayTransfer };
  }, [orders]);

  const displayedItems = useMemo(() => {
    if (searchQuery.trim()) return menuItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return menuItems.filter(i => (i.category || 'Otros') === selectedPosCategory);
  }, [menuItems, selectedPosCategory, searchQuery]);

  if (loading) return <div className="min-h-[100dvh] flex items-center justify-center font-black text-2xl tracking-widest text-white bg-[#034aaa]">CARGANDO...</div>;

  const Header = ({ title, showBack = true }) => (
    <div className="bg-[#034aaa] text-white p-4 sm:p-6 sticky top-0 z-20 flex items-center gap-3 sm:gap-4 print:hidden shadow-md">
      {showBack && <button onClick={() => { 
        if (currentView === 'menu-category') setCurrentView('menu-hub');
        else if (currentView === 'budget') setCurrentView('home'); 
        else if (['new-order', 'order-history'].includes(currentView)) setCurrentView('orders-hub');
        else setCurrentView('home');
      }} className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"><ChevronLeft size={28} strokeWidth={2.5}/></button>}
      <h1 className="text-xl sm:text-2xl font-black tracking-widest uppercase drop-shadow-md">{title}</h1>
    </div>
  );

  return (
    <div className="min-h-[100dvh] bg-[#034aaa] font-sans text-black flex flex-col">
      
      {printData && <PrintableTicket cart={printData.cart} total={printData.total} customerName={printData.customerName} customerAddress={printData.customerAddress} date={printData.date} />}
      
      <div className="print:hidden flex-1 flex flex-col relative">
        
        {/* PANTALLA DE INICIO (HOME) */}
        {currentView === 'home' && (
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#034aaa]">
             <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-[#fdfbf7] mb-8 sm:mb-12 tracking-[0.15em] uppercase text-center drop-shadow-2xl">El Quincho Cocina</h1>
             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 w-full max-w-5xl">
                <BigButton icon={ClipboardList} label="Pedidos" borderColor="border-emerald-500" onClick={() => setCurrentView('orders-hub')} />
                <BigButton icon={Utensils} label="Menú" borderColor="border-amber-500" onClick={() => setCurrentView('menu-hub')} />
                <BigButton icon={TrendingUp} label="Finanzas" borderColor="border-sky-500" onClick={() => setCurrentView('finance')} />
                <BigButton icon={PieChart} label="Caja" borderColor="border-violet-500" onClick={() => setCurrentView('budget')} />
             </div>
          </div>
        )}

        {/* VISTA PRESUPUESTO / CAJA */}
        {currentView === 'budget' && (
          <div className="flex-1 flex flex-col bg-[#034aaa]">
            <Header title="Caja Fuerte" />
            <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-[2rem] shadow-xl border-b-8 border-slate-300 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5"><Wallet size={80}/></div>
                  <p className="text-xs sm:text-sm font-black text-black uppercase tracking-widest mb-1">Total Acumulado</p>
                  <p className="text-3xl sm:text-4xl font-black text-[#034aaa] truncate">{formatCurrency(liveWallet.cash + liveWallet.transfer)}</p>
                </div>
                <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-[2rem] shadow-xl border-b-8 border-green-500 relative group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => { setWalletEditValues({cash: liveWallet.cash, transfer: liveWallet.transfer}); setIsWalletEditModalOpen(true); }}>
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden"><p className="text-xs sm:text-sm font-black text-green-600 uppercase tracking-widest flex items-center gap-1.5"><Banknote size={18}/> Efectivo</p><p className="text-2xl sm:text-3xl font-black text-[#034aaa] mt-1 truncate">{formatCurrency(liveWallet.cash)}</p></div><Edit2 size={20} className="text-black/50 group-hover:text-green-500 transition-colors flex-shrink-0"/>
                  </div>
                </div>
                <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-[2rem] shadow-xl border-b-8 border-purple-500 relative group cursor-pointer hover:-translate-y-1 transition-all" onClick={() => { setWalletEditValues({cash: liveWallet.cash, transfer: liveWallet.transfer}); setIsWalletEditModalOpen(true); }}>
                  <div className="flex justify-between items-start">
                    <div className="overflow-hidden"><p className="text-xs sm:text-sm font-black text-purple-600 uppercase tracking-widest flex items-center gap-1.5"><CreditCard size={18}/> Mercado Pago</p><p className="text-2xl sm:text-3xl font-black text-[#034aaa] mt-1 truncate">{formatCurrency(liveWallet.transfer)}</p></div><Edit2 size={20} className="text-black/50 group-hover:text-purple-500 transition-colors flex-shrink-0"/>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                 <button onClick={() => { setArqueoResult(null); setArqueoValues({cash: '', transfer: ''}); setIsArqueoModalOpen(true); }} className="w-full bg-black hover:bg-slate-800 text-white font-black tracking-widest uppercase py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"><ClipboardCheck size={24} /> Verificar Arqueo</button>
                 <button onClick={() => setIsExpenseModalOpen(true)} className="w-full bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase py-4 sm:py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all text-sm sm:text-base"><ArrowDownCircle size={24} /> Registrar Gasto</button>
              </div>

              <div className="bg-[#fdfbf7] rounded-[2rem] shadow-xl border-b-8 border-black/20 overflow-hidden mt-6 sm:mt-8">
                <div className="p-4 sm:p-6 border-b border-black/10"><h3 className="text-lg sm:text-xl font-black text-[#034aaa] flex items-center gap-2 uppercase tracking-widest"><History size={24} className="text-black" /> Gastos Recientes</h3></div>
                <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto">
                  {expenses.length === 0 ? <div className="p-8 sm:p-10 text-center text-black font-bold tracking-widest uppercase text-xs sm:text-sm">No hay gastos registrados</div> : (
                    <div className="divide-y divide-black/5">
                      {expenses.map(exp => (
                        <div key={exp.id} className="p-4 sm:p-6 flex justify-between items-center hover:bg-slate-50 transition-colors">
                          <div><p className="font-black text-[#034aaa] text-base sm:text-lg uppercase">{exp.description}</p><p className="text-xs sm:text-sm text-black font-bold mt-1 tracking-wider">{exp.createdAt ? formatDate(exp.createdAt) : ''} • {exp.source === 'cash' ? 'Caja Efectivo' : 'Mercado Pago'}</p></div>
                          <div className="flex items-center gap-2 sm:gap-4"><span className="font-black text-red-600 text-lg sm:text-xl">- {formatCurrency(exp.amount)}</span><button onClick={() => handleDeleteExpense(exp)} className="bg-red-100 p-2 sm:p-3 rounded-xl text-red-600 hover:bg-red-600 hover:text-white transition-colors shadow-sm"><Trash2 size={20}/></button></div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS HUB */}
        {currentView === 'orders-hub' && (
          <div className="flex-1 flex flex-col bg-[#034aaa]">
            <Header title="Gestión de Pedidos" />
            <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 p-4 sm:p-6">
              <div className="w-full max-w-sm h-64 sm:h-72"><BigButton icon={Plus} label="Nuevo Pedido" borderColor="border-emerald-500" onClick={() => setCurrentView('new-order')} /></div>
              <div className="w-full max-w-sm h-64 sm:h-72"><BigButton icon={History} label="Historial" borderColor="border-amber-500" onClick={() => setCurrentView('order-history')} /></div>
            </div>
          </div>
        )}

        {/* NEW ORDER / POS */}
        {currentView === 'new-order' && (
          <div className="flex flex-col h-[100dvh] overflow-hidden bg-[#034aaa]">
            <Header title="Comanda Nueva" />
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden p-1 sm:p-2 gap-1 sm:gap-2">
              
              {/* IZQUIERDA: MENÚ Y BÚSQUEDA */}
              <div className="w-full md:w-[60%] h-[50%] md:h-full flex flex-col gap-1 sm:gap-2 overflow-hidden flex-shrink-0 md:flex-shrink-1">
                <div className="bg-[#fdfbf7] p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-lg border-b-4 border-black/20">
                   <div className="relative">
                     <Search className="absolute left-3 top-3 text-black/50" size={18} />
                     <input type="text" placeholder="BUSCAR PLATO..." className="w-full pl-10 p-2 sm:p-3 bg-white border-2 border-black/20 rounded-xl sm:rounded-2xl focus:border-[#034aaa] outline-none text-black font-black uppercase tracking-widest placeholder:text-black/40 text-base sm:text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                   </div>
                </div>
                
                <div className="bg-[#fdfbf7] p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-lg shrink-0 overflow-x-auto scrollbar-hide border-b-4 border-black/20">
                  <div className="flex gap-2 sm:gap-3">
                    {dynamicCategories.map(cat => { 
                      const IconComp = CATEGORY_ICONS[cat] || LayoutGrid; 
                      const isSelected = selectedPosCategory === cat && !searchQuery;
                      return (
                        <button key={cat} onClick={() => { setSelectedPosCategory(cat); setSearchQuery(''); }} className={`w-20 h-20 sm:w-24 sm:h-24 shrink-0 flex flex-col items-center justify-center rounded-xl sm:rounded-2xl transition-all border-2 ${isSelected ? 'bg-[#034aaa] text-[#fdfbf7] border-[#034aaa] shadow-md scale-105' : 'bg-white text-black border-black/20 hover:bg-slate-100'}`}>
                          <IconComp size={24} className={`mb-1 sm:mb-2 ${isSelected ? 'text-white' : 'text-green-600'}`} />
                          <span className="text-[9px] sm:text-[10px] font-black text-center leading-tight px-1 uppercase tracking-widest">{cat}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pb-4 sm:pb-20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 pr-1">
                    {displayedItems.map(item => (
                      <button key={item.id} onClick={() => addToCart(item)} className="bg-[#fdfbf7] p-4 sm:p-5 rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-xl transition-all text-left flex flex-col h-28 sm:h-32 justify-between group border-b-4 border-black/20 hover:-translate-y-1 active:scale-95">
                        <span className="font-black text-[#034aaa] text-sm md:text-base line-clamp-2 leading-snug uppercase tracking-wide">{item.name}</span>
                        <div className="flex justify-between items-end w-full">
                           <span className="text-lg sm:text-xl font-black text-black">{formatCurrency(item.price)}</span>
                           <div className="bg-[#034aaa] text-white rounded-xl p-2 shadow-md group-hover:bg-[#023882] transition-colors"><Plus size={16} strokeWidth={3}/></div>
                        </div>
                      </button>
                    ))}
                    {displayedItems.length === 0 && <div className="col-span-full py-10 text-center font-black text-white/50 uppercase tracking-widest text-lg sm:text-xl">Sin resultados</div>}
                  </div>
                </div>
              </div>

              {/* DERECHA: CARRITO Y CHECKOUT */}
              <div className="w-full md:w-[40%] h-[50%] md:h-full bg-[#fdfbf7] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border-b-4 sm:border-b-8 border-slate-300 flex-shrink-0 md:flex-shrink-1">
                <div className="p-3 sm:p-5 bg-[#034aaa] text-white flex justify-between items-center shadow-md shrink-0">
                  <h3 className="font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3 text-sm sm:text-lg"><ShoppingCart size={20} className="text-white"/> Pedido</h3>
                  <div className="flex items-center gap-1 sm:gap-2">
                     <button onClick={() => handlePrint()} disabled={cart.length === 0} className="bg-white/10 hover:bg-white/20 text-white p-2 sm:p-2.5 rounded-lg sm:rounded-xl transition-colors" title="Imprimir Comanda"><Printer size={18} /></button>
                     <button onClick={() => setIsManualItemModalOpen(true)} className="bg-black hover:bg-slate-800 text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl flex items-center gap-1 sm:gap-2 transition-colors shadow-sm"><Keyboard size={14} /> Extra</button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-2 sm:space-y-3 bg-slate-50">
                  {cart.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-black/40"><ShoppingCart size={40} sm:size={60} className="mb-2 sm:mb-4 opacity-30"/><p className="text-sm sm:text-lg font-black uppercase tracking-widest opacity-50">Carrito Vacío</p></div> : (
                    cart.map(item => (
                      <div key={item.id} className={`flex flex-col sm:flex-row sm:justify-between sm:items-center bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 shadow-sm gap-2 sm:gap-3 ${item.isManual ? 'border-[#034aaa]/30 bg-blue-50/50' : 'border-black/10'}`}>
                        <div className="flex-1 pr-1 sm:pr-2">
                          <div className="font-black text-xs sm:text-sm text-[#034aaa] flex items-center gap-1 sm:gap-2 uppercase tracking-wide leading-tight">{item.name} {item.isManual && <span className="text-[9px] bg-black text-white px-1.5 sm:px-2 py-0.5 rounded-md tracking-widest">Manual</span>}</div>
                          <div className="text-xs sm:text-sm text-black font-black mt-1">{formatCurrency(item.price)}</div>
                          {item.note && <div className="text-[10px] sm:text-xs text-orange-600 font-bold italic mt-1 bg-orange-50 p-1 sm:p-1.5 rounded-md inline-block">* {item.note}</div>}
                        </div>
                        <div className="flex items-center gap-1 sm:gap-2 bg-slate-50 p-1 sm:p-1.5 rounded-lg sm:rounded-xl border border-slate-200">
                           <button onClick={() => openNoteModal(item)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black hover:text-orange-600 hover:bg-white rounded-md sm:rounded-lg transition-all" title="Añadir Nota"><StickyNote size={16} /></button>
                           <div className="w-px h-5 sm:h-6 bg-slate-300"></div>
                           <button onClick={() => updateCartQty(item.id, -1)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black font-black text-lg sm:text-xl hover:bg-white rounded-md sm:rounded-lg transition-all">-</button>
                           <span className="font-black text-sm sm:text-lg w-5 sm:w-6 text-center text-black">{item.qty}</span>
                           <button onClick={() => updateCartQty(item.id, 1)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-black font-black text-lg sm:text-xl hover:bg-white rounded-md sm:rounded-lg transition-all">+</button>
                           <div className="w-px h-5 sm:h-6 bg-slate-300"></div>
                           <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md sm:rounded-lg transition-all"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-3 sm:p-6 bg-white border-t-4 border-slate-100 shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] z-10">
                   <div className="flex flex-col gap-2 sm:gap-3 mb-3 sm:mb-5">
                     <div className="relative">
                       <div className="absolute left-3 top-3 text-black/40"><Utensils size={16}/></div>
                       <input type="text" placeholder="NOMBRE DEL CLIENTE *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-10 p-2.5 sm:p-3.5 bg-slate-50 border-2 border-black/20 rounded-xl focus:border-[#034aaa] outline-none text-base sm:text-sm font-black text-[#034aaa] uppercase tracking-widest placeholder:text-black/40" />
                     </div>
                     <div className="relative hidden sm:block">
                        <div className="absolute left-3 top-3 text-black/40"><MapPin size={16}/></div>
                        <input type="text" placeholder="DIRECCIÓN (OPCIONAL)" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} className="w-full pl-10 p-2.5 sm:p-3.5 bg-slate-50 border-2 border-black/20 rounded-xl focus:border-[#034aaa] outline-none text-base sm:text-sm font-bold text-[#034aaa] uppercase tracking-widest placeholder:text-black/40" />
                     </div>
                   </div>
                   <div className="flex justify-between items-end mb-3 sm:mb-5 bg-slate-100 p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 border-black/10">
                      <span className="text-[#034aaa] font-black uppercase tracking-widest text-[10px] sm:text-xs">Total A Cobrar</span>
                      <span className="text-2xl sm:text-4xl font-black text-[#034aaa] tracking-tighter">{formatCurrency(cartTotal)}</span>
                   </div>
                   <button onClick={handleCheckout} className="w-full bg-[#034aaa] hover:bg-[#022c66] text-white font-black uppercase tracking-widest py-3 sm:py-5 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-lg shadow-[#034aaa]/30 transition-all active:translate-y-1 text-sm sm:text-base"><Save size={20} className="sm:w-6 sm:h-6" /> Confirmar & Guardar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'finance' && (
          <div className="min-h-[100dvh] bg-[#034aaa] flex flex-col">
            <Header title="Reporte Financiero" />
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-6 sm:space-y-8 mt-2 sm:mt-4 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-[2rem] shadow-xl border-b-8 border-sky-500">
                  <span className="text-black text-xs sm:text-sm font-black uppercase block mb-2 tracking-widest">Ingresos del Día</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#034aaa] tracking-tighter">{formatCurrency(financeStats.todayTotal)}</span>
                </div>
                <div className="bg-[#fdfbf7] p-6 sm:p-8 rounded-[2rem] shadow-xl border-b-8 border-amber-500">
                  <span className="text-black text-xs sm:text-sm font-black uppercase block mb-2 tracking-widest">Ingresos del Mes</span>
                  <span className="text-4xl sm:text-5xl font-black text-[#034aaa] tracking-tighter">{formatCurrency(financeStats.monthTotal)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-3xl shadow-lg border-b-4 border-green-500 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                   <div className="bg-green-100 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 text-green-600"><Banknote size={28}/></div>
                   <span className="text-green-700 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1">Efectivo Hoy</span>
                   <span className="text-2xl sm:text-3xl font-black text-[#034aaa]">{formatCurrency(financeStats.todayCash)}</span>
                </div>
                <div className="bg-[#fdfbf7] p-5 sm:p-6 rounded-3xl shadow-lg border-b-4 border-purple-500 flex flex-col items-center text-center hover:-translate-y-1 transition-transform">
                   <div className="bg-purple-100 p-3 sm:p-4 rounded-full mb-2 sm:mb-3 text-purple-600"><CreditCard size={28}/></div>
                   <span className="text-purple-700 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-1">Transf. Hoy</span>
                   <span className="text-2xl sm:text-3xl font-black text-[#034aaa]">{formatCurrency(financeStats.todayTransfer)}</span>
                </div>
              </div>
              
              <div className="mt-6 sm:mt-8">
                <h3 className="text-lg sm:text-xl font-black text-white mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 uppercase tracking-widest drop-shadow-md"><Calendar size={20} className="text-white" /> Historial Diario</h3>
                <div className="bg-[#fdfbf7] rounded-[1.5rem] sm:rounded-[2rem] shadow-2xl border-b-8 border-slate-300 overflow-hidden">
                    <table className="w-full text-left">
                      <thead className="bg-slate-200 border-b-2 border-black/10"><tr><th className="p-4 sm:p-6 text-xs sm:text-sm font-black text-[#034aaa] uppercase tracking-widest">Fecha</th><th className="p-4 sm:p-6 text-xs sm:text-sm font-black text-[#034aaa] uppercase text-right tracking-widest">Total Ingresado</th></tr></thead>
                      <tbody className="divide-y divide-black/5">
                         {financeStats.dailyHistory.length === 0 ? <tr><td colSpan="2" className="p-8 sm:p-10 text-center text-black font-bold tracking-widest uppercase text-xs sm:text-sm">No hay registros aún.</td></tr> : null}
                         {financeStats.dailyHistory.map((row, idx) => (<tr key={idx} className="hover:bg-slate-50 transition-colors"><td className="p-4 sm:p-6 font-black text-[#034aaa] text-base sm:text-lg">{row.date}</td><td className="p-4 sm:p-6 font-black text-emerald-600 text-right text-lg sm:text-xl">{formatCurrency(row.total)}</td></tr>))}
                      </tbody>
                    </table>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {currentView === 'order-history' && (
          <div className="min-h-[100dvh] bg-[#034aaa] flex flex-col">
            <Header title="Historial de Pedidos" />
            <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-4 mt-2 w-full">
               <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6 sm:mb-8 bg-[#fdfbf7] p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border-b-4 sm:border-b-8 border-slate-300">
                 <h2 className="text-[#034aaa] font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3 text-base sm:text-lg"><History size={20} className="text-black"/> Todos los Pedidos</h2>
                 <button onClick={handlePurgeOldOrders} className="bg-red-100 text-red-600 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm w-full sm:w-auto">
                   <Trash2 size={16}/> Limpiar Meses Pasados
                 </button>
               </div>
               
               {orders.length === 0 && <div className="text-center py-20 sm:py-24 text-white/50 font-black uppercase tracking-widest text-xl sm:text-2xl drop-shadow-md">El historial está vacío</div>}

               {orders.map(order => {
                 let paymentIcon;
                 const status = getOrderPaymentStatus(order);

                 if (status === 'transfer') paymentIcon = <CreditCard size={14} className="text-purple-600"/>;
                 else if (status === 'mixed') paymentIcon = <div className="flex"><Banknote size={12} className="text-amber-600"/><CreditCard size={12} className="text-purple-600 -ml-1"/></div>;
                 else if (status === 'cash') paymentIcon = <Banknote size={14} className="text-green-600"/>;
                 else paymentIcon = <AlertCircle size={14} className="text-slate-500"/>; 

                 let cardStyle = "bg-[#fdfbf7] border-slate-300"; // Default
                 let statusBadge = "bg-slate-200 text-slate-700";

                 if (status === 'transfer') { cardStyle = "bg-purple-50 border-purple-300"; statusBadge = "bg-purple-200 text-purple-900"; }
                 else if (status === 'mixed') { cardStyle = "bg-amber-50 border-amber-300"; statusBadge = "bg-amber-200 text-amber-900"; }
                 else if (status === 'cash') { cardStyle = "bg-green-50 border-green-300"; statusBadge = "bg-green-200 text-green-900"; }

                 return (
                 <div key={order.id} className={`${cardStyle} p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border-b-4 sm:border-b-8 shadow-xl flex flex-col lg:flex-row justify-between lg:items-center gap-4 sm:gap-6 hover:-translate-y-1 transition-transform`}>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <span className="font-black text-[#034aaa] text-xl sm:text-2xl tracking-tighter uppercase">{order.customerName}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] sm:text-xs bg-white text-black px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl font-black uppercase tracking-widest shadow-sm border border-black/10">{order.createdAt ? formatDate(order.createdAt) : ''}</span>
                          <div className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-xs font-black shadow-sm ${statusBadge}`}>
                            {paymentIcon}
                            <span className="uppercase tracking-widest">
                              {status === 'transfer' ? 'Transf.' : status === 'mixed' ? 'Mixto' : status === 'cash' ? 'Efect.' : 'Falta Cobrar'}
                            </span>
                          </div>
                        </div>
                      </div>
                      {order.customerAddress && <div className="text-xs sm:text-sm text-[#034aaa] font-bold flex items-center gap-1 sm:gap-2 mb-2 bg-white/50 inline-flex px-2 sm:px-3 py-1 rounded-md sm:rounded-lg"><MapPin size={14} className="text-black"/> {order.customerAddress}</div>}
                      <div className="text-xs sm:text-sm text-black font-bold leading-relaxed bg-white/60 p-2 sm:p-3 rounded-lg sm:rounded-xl border border-black/5 mt-2">{order.items.map(i => `${i.qty}x ${i.name}`).join(', ')}</div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 bg-white/80 p-2 sm:p-3 rounded-2xl sm:rounded-3xl shadow-inner border border-black/10 w-full sm:w-auto">
                       <span className="font-black text-[#034aaa] text-2xl sm:text-3xl px-2 sm:px-4 tracking-tighter w-full sm:w-auto text-center sm:text-left">{formatCurrency(order.total)}</span>
                       <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                         <button onClick={() => openEditOrderModal(order)} className="flex-1 min-w-[50px] sm:min-w-0 sm:flex-none bg-white text-[#034aaa] p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-[#034aaa] hover:text-white transition-colors border-2 border-black/10 shadow-md flex justify-center items-center" title="Editar Pedido"><FilePenLine size={20} className="sm:w-6 sm:h-6"/></button>
                         <button onClick={() => openPaymentModal(order)} className="flex-1 min-w-[50px] sm:min-w-0 sm:flex-none bg-white text-emerald-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-emerald-600 hover:text-white transition-colors border-2 border-emerald-200 shadow-md flex justify-center items-center" title="Gestionar Pago"><DollarSign size={20} className="sm:w-6 sm:h-6"/></button>
                         <button onClick={() => handlePrint({ cart: order.items, total: order.total, customerName: order.customerName, customerAddress: order.customerAddress, date: order.createdAt })} className="flex-1 min-w-[50px] sm:min-w-0 sm:flex-none bg-white text-sky-600 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-sky-600 hover:text-white transition-colors border-2 border-sky-200 shadow-md flex justify-center items-center" title="Imprimir Copia"><Printer size={20} className="sm:w-6 sm:h-6"/></button>
                         <button onClick={() => handleDeleteOrder(order)} className="flex-1 min-w-[50px] sm:min-w-0 sm:flex-none bg-white text-red-500 p-3 sm:p-4 rounded-xl sm:rounded-2xl hover:bg-red-500 hover:text-white transition-colors border-2 border-red-200 shadow-md flex justify-center items-center" title="Eliminar Pedido"><Trash2 size={20} className="sm:w-6 sm:h-6"/></button>
                       </div>
                    </div>
                 </div>
               )})}
            </div>
          </div>
        )}

        {currentView === 'menu-hub' && (
          <div className="min-h-[100dvh] bg-[#034aaa] flex flex-col pb-24">
            <Header title="Menú Principal" />
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 p-4 sm:p-6 pb-2">
              <button onClick={uploadInitialMenu} className="w-full sm:w-auto bg-[#fdfbf7] text-[#034aaa] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:-translate-y-1 transition-all text-[10px] sm:text-xs font-black tracking-widest uppercase border-b-4 border-black/20"><Database size={18} className="text-[#034aaa] sm:w-5 sm:h-5" /> Base de Datos</button>
              <button onClick={handleCleanupDuplicates} className="w-full sm:w-auto bg-red-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl flex items-center justify-center gap-2 sm:gap-3 shadow-xl hover:-translate-y-1 hover:bg-red-700 transition-all text-[10px] sm:text-xs font-black tracking-widest uppercase border-b-4 border-red-800"><Eraser size={18} className="sm:w-5 sm:h-5" /> Purgar Repetidos</button>
            </div>
            
            <div className="p-4 sm:p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto w-full">
              {dynamicCategories.map(cat => {
                const IconComp = CATEGORY_ICONS[cat] || LayoutGrid;
                return (
                  <button key={cat} onClick={() => { setSelectedCategoryView(cat); setCurrentView('menu-category'); }} className="bg-[#fdfbf7] aspect-square rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border-b-4 sm:border-b-8 border-black/20 hover:shadow-2xl hover:border-[#f59e0b] hover:-translate-y-1 sm:hover:-translate-y-2 transition-all flex flex-col items-center justify-center p-3 sm:p-4 group relative overflow-hidden">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center text-green-600 mb-2 sm:mb-4 group-hover:scale-110 transition-transform shadow-inner border border-black/10"><IconComp size={32} className="sm:w-9 sm:h-9" strokeWidth={2} /></div>
                    <span className="font-black text-[#034aaa] text-center uppercase tracking-widest text-xs sm:text-sm md:text-base z-10 leading-tight">{cat}</span>
                    <span className="text-[10px] sm:text-xs text-black font-bold mt-1.5 sm:mt-2 uppercase tracking-widest bg-slate-200 px-2 sm:px-3 py-1 rounded-md sm:rounded-lg">{getItemsByCategory(cat).length} items</span>
                  </button>
                );
              })}
              
              <button onClick={() => { resetForm(); setIsCustomCategory(true); setIsEditModalOpen(true); }} className="bg-black aspect-square rounded-[1.5rem] sm:rounded-[2rem] border-2 sm:border-4 border-dashed border-white/20 hover:bg-white hover:border-white text-white hover:text-black transition-all flex flex-col items-center justify-center p-3 sm:p-4 group shadow-lg">
                 <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 group-hover:bg-slate-200 rounded-full flex items-center justify-center mb-2 sm:mb-4 transition-colors"><Plus size={32} className="sm:w-10 sm:h-10" strokeWidth={2.5} /></div>
                 <span className="font-black text-center uppercase tracking-widest text-[10px] sm:text-sm">Nueva Sección</span>
              </button>
            </div>
            <button onClick={() => { resetForm(); setIsEditModalOpen(true); }} className="fixed bottom-6 sm:bottom-8 right-6 sm:right-8 bg-[#f59e0b] text-white p-5 sm:p-6 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:scale-110 active:scale-95 transition-transform z-30 border-2 sm:border-4 border-white"><Plus size={28} className="sm:w-9 sm:h-9" strokeWidth={3} /></button>
          </div>
        )}

        {currentView === 'menu-category' && (
          <div className="min-h-[100dvh] bg-[#034aaa] flex flex-col">
            <Header title={`Menú / ${selectedCategoryView}`} />
            <div className="p-4 sm:p-6 max-w-5xl mx-auto space-y-4 sm:space-y-6 w-full">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 sm:gap-4 mb-2 sm:mb-4 bg-[#fdfbf7] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-xl border-b-4 sm:border-b-8 border-slate-300">
                <span className="text-[#034aaa] text-sm sm:text-lg font-black uppercase tracking-widest flex items-center gap-2 sm:gap-3"><LayoutGrid size={20} className="text-black sm:w-6 sm:h-6"/> {selectedCategoryView}</span>
                <button onClick={() => { resetForm(); setNewItemCategory(selectedCategoryView); setIsEditModalOpen(true); }} className="w-full sm:w-auto bg-[#034aaa] hover:bg-[#022c66] text-[#fdfbf7] px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-transform hover:-translate-y-1 active:translate-y-0"><Plus size={18}/> Añadir Plato Aquí</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {getItemsByCategory(selectedCategoryView).length === 0 && <div className="col-span-full py-10 text-center font-black text-white/50 uppercase tracking-widest text-xl sm:text-2xl">Categoría Vacía</div>}
                {getItemsByCategory(selectedCategoryView).map(item => (
                    <div key={item.id} className="bg-[#fdfbf7] p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] shadow-lg border-b-4 sm:border-b-8 border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center group hover:-translate-y-1 hover:border-[#f59e0b] transition-all gap-3 sm:gap-4">
                      <div className="flex-1 w-full sm:w-auto">
                        <h3 className="font-black text-[#034aaa] text-lg sm:text-xl uppercase tracking-wide leading-tight mb-1 sm:mb-2">{item.name}</h3>
                        {item.description && <p className="text-xs sm:text-sm text-black/70 font-bold mb-2 sm:mb-3 leading-relaxed">{item.description}</p>}
                        <span className="text-[#034aaa] font-black text-xl sm:text-2xl bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border border-slate-200 shadow-sm inline-block">{formatCurrency(item.price)}</span>
                      </div>
                      <div className="flex w-full sm:w-auto gap-2 sm:gap-3 opacity-100 md:opacity-50 group-hover:opacity-100 transition-opacity bg-white p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-inner border border-slate-100">
                        <button onClick={() => { setEditingItem(item); setNewItemName(item.name); setNewItemPrice(item.price.toString()); setNewItemDesc(item.description || ''); setNewItemCategory(item.category || CATEGORIAS[0]); setIsEditModalOpen(true); }} className="flex-1 sm:flex-none p-3 sm:p-4 bg-sky-50 text-sky-600 rounded-lg sm:rounded-xl hover:bg-sky-500 hover:text-white transition-colors shadow-sm flex justify-center"><Edit2 size={18} className="sm:w-5 sm:h-5"/></button>
                        <button onClick={() => handleDeleteItem(item.id)} className="flex-1 sm:flex-none p-3 sm:p-4 bg-red-50 text-red-600 rounded-lg sm:rounded-xl hover:bg-red-600 hover:text-white transition-colors shadow-sm flex justify-center"><Trash2 size={18} className="sm:w-5 sm:h-5"/></button>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MODAL EDITAR PLATO */}
        <Modal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); resetForm(); }} title={editingItem ? "MODIFICAR PLATO" : "CREAR NUEVO PLATO"}>
          <div className="space-y-4 sm:space-y-5">
            <div><label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">Nombre del Plato</label><input type="text" className="w-full p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] transition-colors font-black text-base sm:text-lg text-[#034aaa] uppercase" placeholder="Ej. Pizza Napolitana" value={newItemName} onChange={e => setNewItemName(e.target.value)} /></div>
            <div><label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">Descripción (Opcional)</label><input type="text" className="w-full p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] transition-colors font-bold text-base sm:text-base text-black" placeholder="Ingredientes, tamaño..." value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} /></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div><label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">Precio</label><div className="relative"><span className="absolute left-3 sm:left-4 top-3.5 sm:top-4 font-black text-black/40 text-base sm:text-lg">$</span><input type="number" className="w-full pl-8 sm:pl-9 p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] transition-colors font-black text-lg sm:text-xl text-[#034aaa]" placeholder="0" value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} /></div></div>
              
              <div>
                <label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">Sección</label>
                {isCustomCategory ? (
                  <div className="flex gap-2">
                    <input type="text" className="w-full p-3 sm:p-4 bg-black border-2 border-black rounded-xl sm:rounded-2xl outline-none focus:ring-4 focus:ring-slate-500/30 transition-all font-black text-white uppercase placeholder:text-white/50 text-base sm:text-sm" placeholder="NUEVA..." value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} autoFocus />
                    <button onClick={() => { setIsCustomCategory(false); setNewItemCategory(dynamicCategories[0]); }} className="p-3 sm:p-4 bg-red-100 text-red-600 rounded-xl sm:rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-colors shadow-sm"><X size={20} strokeWidth={3}/></button>
                  </div>
                ) : (
                  <select className="w-full p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] transition-colors font-black text-base sm:text-sm text-[#034aaa] uppercase tracking-wide cursor-pointer appearance-none" value={newItemCategory} onChange={e => {
                    if (e.target.value === 'NEW') {
                      setIsCustomCategory(true);
                      setNewItemCategory('');
                    } else {
                      setNewItemCategory(e.target.value);
                    }
                  }}>
                    {dynamicCategories.map(c => <option key={c} value={c}>{c}</option>)}
                    <option value="NEW" className="font-black bg-black text-white">➕ CREAR NUEVA...</option>
                  </select>
                )}
              </div>
            </div>
            <button onClick={handleSaveItem} className="w-full bg-[#034aaa] text-white font-black uppercase tracking-widest py-4 sm:py-5 rounded-xl sm:rounded-2xl mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#022c66] transition-all shadow-xl active:scale-95 text-base sm:text-lg"><Save size={20} className="sm:w-6 sm:h-6"/> GUARDAR</button>
          </div>
        </Modal>

        {/* MODAL ITEM MANUAL */}
        <Modal isOpen={isManualItemModalOpen} onClose={() => setIsManualItemModalOpen(false)} title="AÑADIR ITEM EXTRA">
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-sky-50 text-sky-900 p-4 sm:p-5 rounded-xl sm:rounded-2xl text-[10px] sm:text-xs font-bold border-2 border-sky-200 flex items-start gap-2 sm:gap-3 leading-relaxed"><AlertCircle size={18} className="shrink-0 text-sky-600 mt-0.5 sm:w-5 sm:h-5"/> Usa esto para cobrar algo que no está en tu menú. Solo aparecerá en este pedido.</div>
            <div><label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">¿Qué estás cobrando?</label><input type="text" className="w-full p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] font-black text-base sm:text-lg text-[#034aaa] uppercase" placeholder="Ej. Flete, Promo 2x1..." value={manualItemName} onChange={e => setManualItemName(e.target.value)} /></div>
            <div><label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest">Precio a sumar</label><div className="relative"><span className="absolute left-3 sm:left-4 top-3.5 sm:top-4 font-black text-black/40 text-lg sm:text-xl">$</span><input type="number" className="w-full pl-8 sm:pl-10 p-3 sm:p-4 bg-white border-2 border-black/30 rounded-xl sm:rounded-2xl outline-none focus:border-[#034aaa] font-black text-2xl sm:text-3xl text-[#034aaa]" placeholder="0" value={manualItemPrice} onChange={e => setManualItemPrice(e.target.value)} /></div></div>
            <button onClick={addManualItemToCart} className="w-full bg-emerald-600 text-white font-black uppercase tracking-widest py-4 sm:py-5 rounded-xl sm:rounded-2xl mt-2 sm:mt-4 flex justify-center gap-2 sm:gap-3 hover:bg-emerald-700 transition-all shadow-xl active:scale-95 text-base sm:text-lg"><Plus size={20} className="sm:w-6 sm:h-6" strokeWidth={3}/> AÑADIR A LA CUENTA</button>
          </div>
        </Modal>

        {/* MODAL DE PAGOS */}
        <Modal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} title="GESTIONAR PAGO">
          <div className="space-y-4 sm:space-y-6">
            {selectedOrderForPayment && (
              <div className="p-4 sm:p-6 bg-slate-100 rounded-2xl sm:rounded-3xl border-2 border-black/10 shadow-inner text-center">
                <p className="text-[10px] sm:text-xs font-black text-black uppercase tracking-widest mb-1">{selectedOrderForPayment.customerName}</p>
                <p className="text-3xl sm:text-5xl font-black text-[#034aaa] tracking-tighter">{formatCurrency(selectedOrderForPayment.total)}</p>
              </div>
            )}
            <div>
              <label className="block text-[10px] sm:text-xs font-black text-black mb-2 sm:mb-3 uppercase tracking-widest text-center">Selecciona cómo te pagaron</label>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button onClick={() => setPaymentMethod('cash')} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all ${paymentMethod === 'cash' ? 'bg-green-50 border-green-500 text-green-700 shadow-lg scale-105' : 'bg-white border-black/10 text-slate-500 hover:bg-slate-50'}`}><Banknote size={24} className="sm:w-7 sm:h-7" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1">Efectivo</span></button>
                <button onClick={() => setPaymentMethod('transfer')} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all ${paymentMethod === 'transfer' ? 'bg-purple-50 border-purple-500 text-purple-700 shadow-lg scale-105' : 'bg-white border-black/10 text-slate-500 hover:bg-slate-50'}`}><CreditCard size={24} className="sm:w-7 sm:h-7" /><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1">Transf.</span></button>
                <button onClick={() => setPaymentMethod('mixed')} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 flex flex-col items-center justify-center gap-1 sm:gap-2 transition-all ${paymentMethod === 'mixed' ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg scale-105' : 'bg-white border-black/10 text-slate-500 hover:bg-slate-50'}`}><div className="flex"><Banknote size={14} className="sm:w-5 sm:h-5"/><CreditCard size={14} className="sm:w-5 sm:h-5 -ml-1 sm:-ml-2"/></div><span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest mt-1">Mixto</span></button>
              </div>
            </div>
            {paymentMethod === 'mixed' && selectedOrderForPayment && (
              <div className="bg-amber-50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-amber-200 animate-in fade-in zoom-in-95">
                <label className="block text-[10px] sm:text-xs font-black text-amber-900 mb-2 sm:mb-3 uppercase tracking-widest text-center">¿Cuánto entregó en Efectivo?</label>
                <div className="relative max-w-[200px] sm:max-w-xs mx-auto">
                  <span className="absolute left-3 sm:left-4 top-3.5 sm:top-4 font-black text-amber-500 text-xl sm:text-2xl">$</span>
                  <input type="number" className="w-full pl-8 sm:pl-10 p-3 sm:p-4 bg-white border-2 border-amber-400 rounded-xl sm:rounded-2xl focus:border-amber-600 outline-none font-black text-xl sm:text-3xl text-amber-900 text-center" placeholder="0" value={cashAmountInput} onChange={(e) => setCashAmountInput(e.target.value)} />
                </div>
                <div className="mt-3 sm:mt-4 text-center text-xs sm:text-sm font-bold text-amber-800 bg-amber-200/50 py-2 sm:py-3 rounded-lg sm:rounded-xl border border-amber-300">Resto por Transferencia: <span className="font-black text-amber-900 text-sm sm:text-lg ml-1 sm:ml-2">{formatCurrency(selectedOrderForPayment.total - (parseFloat(cashAmountInput) || 0))}</span></div>
              </div>
            )}
            <button onClick={savePaymentDetails} className="w-full bg-[#034aaa] text-white font-black uppercase tracking-widest py-4 sm:py-5 rounded-xl sm:rounded-2xl mt-2 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 hover:bg-[#022c66] transition-all shadow-xl active:scale-95 text-base sm:text-lg"><Save size={20} className="sm:w-6 sm:h-6"/> CONFIRMAR PAGO</button>
          </div>
        </Modal>
        
        {/* MODAL NUEVA NOTA */}
        <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title="ACLARACIÓN PARA COCINA">
          <div className="space-y-4 sm:space-y-5">
            <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 border-black/10 shadow-sm text-center">
              <p className="font-black text-[#034aaa] uppercase tracking-widest text-base sm:text-lg">{currentNoteItem?.name}</p>
            </div>
            <div>
              <label className="block text-[10px] sm:text-xs font-black text-black mb-1 sm:mb-2 uppercase tracking-widest text-center">Escribe la instrucción</label>
              <input 
                type="text" 
                autoFocus
                className="w-full p-4 sm:p-5 bg-white border-2 sm:border-4 border-orange-200 rounded-xl sm:rounded-2xl outline-none focus:border-orange-500 transition-all font-black text-orange-600 text-center text-base sm:text-lg placeholder:text-orange-300 placeholder:font-bold" 
                placeholder="Ej. SIN CEBOLLA" 
                value={noteText} 
                onChange={(e) => setNoteText(e.target.value)} 
              />
            </div>
            <button onClick={saveNote} className="w-full bg-orange-500 text-white font-black uppercase tracking-widest py-4 sm:py-5 rounded-xl sm:rounded-2xl mt-2 hover:bg-orange-600 transition-all shadow-xl text-base sm:text-lg">GUARDAR NOTA</button>
          </div>
        </Modal>

      </div>
    </div>
  );
}