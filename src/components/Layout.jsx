import React, { useState, useEffect } from 'react';
import { 
  Box, 
  CreditCard, 
  History, 
  Video, 
  Settings, 
  User, 
  Search, 
  Filter, 
  Plus,
  Cpu,
  Wrench,
  Smartphone,
  Shield,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import BoxCard from './BoxCard';
import { gsmService } from '@/api/gsm';

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProcessor, setFilterProcessor] = useState('all');
  const [filterService, setFilterService] = useState('all');
  const [filterBrand, setFilterBrand] = useState('all');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [credits, setCredits] = useState(0);
  const [activeNav, setActiveNav] = useState('boxes');

  const processorOptions = ['all', 'MTK', 'Qualcomm', 'SPD', 'Exynos'];
  const serviceOptions = ['all', 'FRP Bypass', 'IMEI Repair', 'Flash', 'Unlocking'];
  const brandOptions = ['all', 'Samsung', 'Xiaomi', 'Apple', 'Motorola', 'Universal'];

  const mockBoxes = [
    { id: '1', name: 'Z3X Samsung Pro', toolName: 'Z3X Box', processor: 'Exynos', service: 'FRP Bypass', brand: 'Samsung', status: 'active', averageLatency: 45, model: 'Galaxy S24' },
    { id: '2', name: 'Octopus Samsung', toolName: 'Octopus', processor: 'Qualcomm', service: 'Unlocking', brand: 'Samsung', status: 'expired', averageLatency: 62, currentUser: 'tech***@email.com', releaseTime: 334, model: 'Galaxy A54' },
    { id: '3', name: 'Miracle Box MTK', toolName: 'Miracle Box', processor: 'MTK', service: 'IMEI Repair', brand: 'Universal', status: 'active', averageLatency: 38 },
    { id: '4', name: 'Infinity Box', toolName: 'Infinity Box', processor: 'MTK', service: 'Flash', brand: 'Universal', status: 'soon', averageLatency: 0 },
    { id: '5', name: 'UFi Box', toolName: 'UFi', processor: 'SPD', service: 'FRP Bypass', brand: 'Universal', status: 'active', averageLatency: 55, model: 'Various' },
    { id: '6', name: 'Z3X Qualcomm', toolName: 'Z3X Box', processor: 'Qualcomm', service: 'IMEI Repair', brand: 'Xiaomi', status: 'active', averageLatency: 42, model: 'Redmi Note 13' },
    { id: '7', name: 'RF Eazy', toolName: 'RF Eazy', processor: 'Qualcomm', service: 'Unlocking', brand: 'Motorola', status: 'expired', averageLatency: 78, currentUser: '助手***@gmail.com', releaseTime: 512, model: 'Moto G84' },
    { id: '8', name: 'Chimera Tool', toolName: 'Chimera', processor: 'Qualcomm', service: 'FRP Bypass', brand: 'Apple', status: 'active', averageLatency: 35, model: 'iPhone 15' },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      const userId = 'demo-user';
      const balanceResponse = await gsmService.getUserBalance(userId);
      if (balanceResponse.success && balanceResponse.data) {
        setCredits(balanceResponse.data.balance);
      }
    };
    loadUserData();
  }, []);

  const filteredBoxes = mockBoxes.filter(box => {
    const matchesSearch = searchQuery === '' || 
      box.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.toolName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      box.model?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProcessor = filterProcessor === 'all' || box.processor === filterProcessor;
    const matchesService = filterService === 'all' || box.service === filterService;
    const matchesBrand = filterBrand === 'all' || box.brand === filterBrand;
    
    return matchesSearch && matchesProcessor && matchesService && matchesBrand;
  });

  const handleBuyCredits = async () => {
    const userId = 'demo-user';
    const response = await gsmService.addCredits(userId, 500, 'Compra de créditos');
    if (response.success && response.data) {
      setCredits(response.data.newBalance);
    }
  };

  const handleRent = async (boxName) => {
    const userId = 'demo-user';
    console.log(`Alugando ${boxName} para ${userId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <aside className="hidden lg:block w-80 bg-gray-50 border-r border-gray-200 fixed left-0 top-0 h-full overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Tchova GSM</h1>
              <p className="text-xs text-gray-500">Digital Box Rental</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-500">Saldo Disponível</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {credits.toLocaleString()}
            </div>
            <div className="text-sm text-green-600 mb-4">créditos</div>
            <Button 
              className="w-full bg-green-600 hover:bg-green-500 text-white rounded-xl"
              onClick={handleBuyCredits}
            >
              <Plus className="w-4 h-4 mr-2" />
              Comprar Créditos
            </Button>
          </div>

          <nav className="space-y-2">
            <Button 
              variant="ghost" 
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all ${
                activeNav === 'boxes' ? 'bg-white text-green-600 border border-gray-200' : 'text-gray-500 hover:bg-white hover:text-green-600'
              }`}
              onClick={() => setActiveNav('boxes')}
            >
              <Box className="w-5 h-5 mr-3" />
              <span className="font-medium">Boxes</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all ${
                activeNav === 'history' ? 'bg-white text-green-600 border border-gray-200' : 'text-gray-500 hover:bg-white hover:text-green-600'
              }`}
              onClick={() => setActiveNav('history')}
            >
              <History className="w-5 h-5 mr-3" />
              <span className="font-medium">Histórico</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all ${
                activeNav === 'videos' ? 'bg-white text-green-600 border border-gray-200' : 'text-gray-500 hover:bg-white hover:text-green-600'
              }`}
              onClick={() => setActiveNav('videos')}
            >
              <Video className="w-5 h-5 mr-3" />
              <span className="font-medium">Vídeo-Aulas</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all ${
                activeNav === 'settings' ? 'bg-white text-green-600 border border-gray-200' : 'text-gray-500 hover:bg-white hover:text-green-600'
              }`}
              onClick={() => setActiveNav('settings')}
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Configurações</span>
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start px-4 py-3 rounded-xl transition-all ${
                activeNav === 'security' ? 'bg-white text-green-600 border border-gray-200' : 'text-gray-500 hover:bg-white hover:text-green-600'
              }`}
              onClick={() => setActiveNav('security')}
            >
              <Shield className="w-5 h-5 mr-3" />
              <span className="font-medium">Segurança</span>
            </Button>
          </nav>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">Técnico</p>
              <p className="text-xs text-gray-500 truncate">Online</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="lg:ml-80 p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Boxes Disponíveis</h2>
              <p className="text-sm text-gray-500">Gerencie suas sessões de reparação GSM</p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Buscar por modelo ou erro..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-green-500 focus:ring-green-500"
                />
              </div>
              
              <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter className="w-4 h-4 mr-2" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="space-y-6">
                    <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
                    <div className="space-y-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Processador: {filterProcessor === 'all' ? 'Todos' : filterProcessor}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          {processorOptions.map(opt => (
                            <DropdownMenuItem key={opt} onClick={() => setFilterProcessor(opt)}>
                              {opt === 'all' ? 'Todos' : opt}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Serviço: {filterService === 'all' ? 'Todos' : filterService}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          {serviceOptions.map(opt => (
                            <DropdownMenuItem key={opt} onClick={() => setFilterService(opt)}>
                              {opt === 'all' ? 'Todos' : opt}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full justify-between">
                            Marca: {filterBrand === 'all' ? 'Todas' : filterBrand}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56">
                          {brandOptions.map(opt => (
                            <DropdownMenuItem key={opt} onClick={() => setFilterBrand(opt)}>
                              {opt === 'all' ? 'Todas' : opt}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden lg:flex gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      {filterProcessor === 'all' ? 'Processador' : filterProcessor}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {processorOptions.map(opt => (
                      <DropdownMenuItem key={opt} onClick={() => setFilterProcessor(opt)}>
                        {opt === 'all' ? 'Todos' : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Wrench className="w-4 h-4" />
                      {filterService === 'all' ? 'Serviço' : filterService}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {serviceOptions.map(opt => (
                      <DropdownMenuItem key={opt} onClick={() => setFilterService(opt)}>
                        {opt === 'all' ? 'Todos' : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4" />
                      {filterBrand === 'all' ? 'Marca' : filterBrand}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    {brandOptions.map(opt => (
                      <DropdownMenuItem key={opt} onClick={() => setFilterBrand(opt)}>
                        {opt === 'all' ? 'Todas' : opt}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          {activeNav === 'boxes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredBoxes.map((box) => (
                <BoxCard 
                  key={box.id} 
                  logo="https://via.placeholder.com/100" 
                  name={box.name} 
                  price="150" 
                  status={box.status} 
                  onRent={() => handleRent(box.name)} 
                />
              ))}
            </div>
          )}

          {activeNav === 'history' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Histórico de Alugueres</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Box className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Z3X Samsung Pro</p>
                      <p className="text-sm text-gray-500">Há 2 dias</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Concluído</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Box className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Miracle Box MTK</p>
                      <p className="text-sm text-gray-500">Há 1 semana</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Concluído</Badge>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'videos' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Vídeo-Aulas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">FRP Bypass Samsung</p>
                      <p className="text-sm text-gray-500">12 min • 1.2k visualizações</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Gratuito</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">IMEI Repair MTK</p>
                      <p className="text-sm text-gray-500">8 min • 850 visualizações</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-200">Gratuito</Badge>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'settings' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Configurações</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Perfil</p>
                      <p className="text-sm text-gray-500">Editar informações pessoais</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Editar</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Pagamento</p>
                      <p className="text-sm text-gray-500">Configurar métodos de pagamento</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Configurar</Button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'security' && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Segurança</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Autenticação 2FA</p>
                      <p className="text-sm text-gray-500">Habilitar verificação em duas etapas</p>
                    </div>
                  </div>
                  <Badge className="bg-red-100 text-red-700 border-red-200">Desativado</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Settings className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Logs de Acesso</p>
                      <p className="text-sm text-gray-500">Verificar atividade de login</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Ver</Button>
                </div>
              </div>
            </div>
          )}

          {activeNav === 'boxes' && filteredBoxes.length === 0 && (
            <div className="text-center py-16">
              <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum resultado encontrado</h3>
              <p className="text-gray-500">Tente ajustar os filtros ou a busca</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
