import { BoxTool } from '../types/gsm.types';
import { LayoutDashboard, Layers, Clock, QrCode, Wallet, UserCheck } from 'lucide-react';

// Ferramentas reais GSM (2025/2026)
export const mockBoxTools: BoxTool[] = [
  { 
    id: '1', 
    name: 'UnlockTool', 
    nickname: 'Canivete Suíço',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750319/unlock_tool_2_uyqzof.png',
    description: 'Versatilidade total e rapidez - FRP, Mi Cloud, Apple, Bootloader',
    price: 100,
    status: 'available',
    category: 'chimera',
    features: ['FRP Bypass', 'Mi Cloud / Relock Fix', 'Apple Module', 'Bootloader Unlock'],
    models: 'Xiaomi, Samsung, Oppo, Vivo, Huawei, Vsmart',
    chips: 'MTK, Qualcomm, Unisoc',
    rating: 4.8,
    rentals: 245
  },
  { 
    id: '2', 
    name: 'Chimera Tool', 
    nickname: 'Especialista Samsung',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750320/chimera_tool_img_ti5l2p.png',
    description: 'Reparação avançada e funções de rede - IMEI, Certificate, Firmware',
    price: 220,
    status: 'available',
    category: 'chimera',
    features: ['Repair IMEI', 'Patch Certificate', 'Read Codes', 'Firmware Flash'],
    models: 'Samsung, Huawei, BlackBerry',
    chips: 'Exynos, Qualcomm, Kirin',
    rating: 4.9,
    rentals: 189
  },
  { 
    id: '3', 
    name: 'DFT Pro', 
    nickname: 'Solução Low-End',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750321/dft_pro_wxuuev.png',
    description: 'Excelente para modelos de entrada - Unisoc, Xiaomi Dual Sim',
    price: 80,
    status: 'available',
    category: 'server',
    features: ['Unisoc/SPD Support', 'Xiaomi Dual Sim Repair', 'Auth Bypass'],
    models: 'Xiaomi, Vivo, Oppo, Realme, Infinix',
    chips: 'Unisoc, MediaTek',
    rating: 4.5,
    rentals: 312
  },
  { 
    id: '4', 
    name: 'TFM Tool Pro', 
    nickname: 'Rainha do Servidor',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/tfm_swio6w.png',
    description: 'Estabilidade em processos com créditos - SLA/DA Auth',
    price: 80,
    status: 'in_use',
    category: 'server',
    features: ['SLA/DA Auth', 'Server FRP', 'Factory Reset'],
    models: 'Tecno, Infinix, Itel, Samsung',
    chips: 'MTK',
    rating: 4.7,
    rentals: 156
  },
  { 
    id: '5', 
    name: 'EFT Pro', 
    nickname: 'Mestra das Customizações',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/eft_pro_uegdv8.png',
    description: 'Focada em firmwares modificados e Root - Multi-Brand',
    price: 80,
    status: 'available',
    category: 'remote',
    features: ['Root Multi-Brand', 'Make Kernel', 'FTP Support'],
    models: 'Samsung, Huawei, Motorola',
    chips: 'Qualcomm',
    rating: 4.6,
    rentals: 98
  },
  { 
    id: '6', 
    name: 'CRD Credits', 
    nickname: 'Créditos GSM',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/crd_credits_yj6g2k.png',
    description: 'Créditos pré-pagos para unlock e reparação GSM',
    price: 75,
    status: 'available',
    category: 'credit',
    features: ['Crédito Pré-pago', 'Recarga Instantânea', 'Sem Expiração'],
    rating: 4.5,
    rentals: 520
  },
  { 
    id: '7', 
    name: 'TSM Server Credits', 
    nickname: 'Créditos Servidor',
    image: 'https://res.cloudinary.com/dwlfwnbt0/image/upload/v1773750323/tsm_server_kj3h8l.png',
    description: 'Créditos para servidores remotos TSM - Alta Performance',
    price: 100,
    status: 'available',
    category: 'credit',
    features: ['Servidor Dedicado', 'Baixa Latência', 'Uso Ilimitado'],
    rating: 4.8,
    rentals: 380
  },
];

// Menu items for navigation
export const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', description: 'Visão Geral' },
  { id: 'tools', icon: Layers, label: 'Ferramentas', description: 'Alugar Tools' },
  { id: 'rentals', icon: Clock, label: 'Aluguéis', description: 'Histórico' },
  { id: 'imei', icon: QrCode, label: 'Verificar IMEI', description: 'Check IMEI' },
  { id: 'wallet', icon: Wallet, label: 'Saldo', description: 'Créditos GSM' },
  { id: 'profile', icon: UserCheck, label: 'Perfil', description: 'Minha Conta' },
];
