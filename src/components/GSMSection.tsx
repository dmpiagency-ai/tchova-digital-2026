import { Box, Target, Phone, ClipboardList, DollarSign, Shield, LockKeyhole, ClipboardCheck, MessageCircle } from 'lucide-react';

const GSMSection = () => {
  const tools = [
    'F64 Box', 'Chimera Tool', 'UnlockTool', 'TCM Tool', 
    'EFT Pro', 'Z3X', 'Hydra Tool', 'Octoplus', 
    'Sigma', 'MRT', 'UMT'
  ];

  const services = [
    { name: 'FRP Reset', icon: '🔓' },
    { name: 'IMEI Repair', icon: '🧾' },
    { name: 'Flashing & Firmware', icon: '🔄' },
    { name: 'Repair Baseband', icon: '🛠️' },
    { name: 'Network Unlock', icon: '📡' },
    { name: 'Software Services', icon: '🧠' },
    { name: 'Test Mode / ENG Rom', icon: '🧪' }
  ];

  const brands = [
    'Samsung', 'Xiaomi', 'Huawei', 'Tecno', 'Infinix', 
    'iPhone', 'Realme', 'Oppo', 'Vivo', 'Nokia', 'Motorola'
  ];

  const steps = [
    { step: 1, title: 'Solicitação', description: 'Cliente solicita acesso ao serviço GSM' },
    { step: 2, title: 'Análise', description: 'Técnico analisa a necessidade específica' },
    { step: 3, title: 'Definição', description: 'Define a ferramenta / box mais adequada' },
    { step: 4, title: 'Confirmação', description: 'Confirma valor e condições' },
    { step: 5, title: 'Pagamento', description: 'Pagamento efetuado via métodos disponíveis' },
    { step: 6, title: 'Ativação', description: 'Ativação manual do acesso pelo técnico' },
    { step: 7, title: 'Redirecionamento', description: 'Redirecionamento seguro para a plataforma 4YOU TECH' }
  ];

  const paymentMethods = ['Carteira Local', 'Cartão de Crédito', 'PayPal'];

  return (
    <>
      {/* Ferramentas Disponíveis */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
          <Box className="text-4xl lg:text-6xl text-blue-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent font-black">
            Ferramentas Disponíveis
          </span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {tools.map((tool, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-blue-500/10 via-blue-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-blue-200/30 hover:border-blue-300/50 transition-all duration-500 hover:scale-[1.02] text-center"
            >
              <div className="text-2xl mb-3">🔧</div>
              <h3 className="font-bold text-base lg:text-lg text-blue-600 dark:text-blue-400">{tool}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Serviços Técnicos Suportados */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
          <Target className="text-4xl lg:text-6xl text-green-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-black">
            Serviços Técnicos Suportados
          </span>
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-green-200/30 hover:border-green-300/50 transition-all duration-500 hover:scale-[1.02] text-center"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="font-bold text-base lg:text-lg text-green-600 dark:text-green-400">{service.name}</h3>
            </div>
          ))}
        </div>
        
        <p className="text-center text-muted-foreground text-sm lg:text-base mt-8">
          Serviços variam conforme marca e modelo.
        </p>
      </div>

      {/* Marcas Suportadas */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
          <Phone className="text-4xl lg:text-6xl text-purple-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent font-black">
            Marcas Suportadas
          </span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-4 lg:gap-6">
          {brands.map((brand, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-purple-500/10 via-purple-400/5 to-transparent backdrop-blur-lg rounded-[24px] px-6 py-4 border border-purple-200/30 hover:border-purple-300/50 transition-all duration-500 hover:scale-[1.02]"
            >
              <h3 className="font-bold text-base lg:text-lg text-purple-600 dark:text-purple-400">{brand}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Como Funciona o Acesso */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-8 lg:mb-12 flex items-center">
          <ClipboardList className="text-4xl lg:text-6xl text-orange-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent font-black">
            Como Funciona o Acesso
          </span>
        </h2>
        
        <div className="space-y-4 lg:space-y-6">
          {steps.map((item, index) => (
            <div 
              key={index}
              className="group flex items-start space-x-4 p-6 lg:p-8 rounded-[32px] bg-gradient-to-r from-orange-500/10 via-orange-400/5 to-transparent backdrop-blur-lg border border-orange-200/20 hover:border-orange-300/40 transition-all duration-500 hover:scale-[1.01]"
            >
              <div className="w-14 h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold text-xl lg:text-2xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                {item.step}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg lg:text-xl mb-2 text-orange-600 dark:text-orange-400">{item.title}</h3>
                <p className="text-muted-foreground text-sm lg:text-base leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagamento */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8 flex items-center">
          <DollarSign className="text-4xl lg:text-6xl text-green-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-green-500 to-green-600 bg-clip-text text-transparent font-black">
            Pagamento
          </span>
        </h2>
        
        <div className="bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-transparent backdrop-blur-lg rounded-[32px] p-6 lg:p-8 border border-amber-200/30 mb-6 lg:mb-8">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-center">
            O pagamento ativa ferramentas específicas conforme o serviço solicitado.<br />
            O acesso não é automático e não é vitalício.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {paymentMethods.map((method, index) => (
            <div 
              key={index}
              className="group bg-gradient-to-br from-green-500/10 via-green-400/5 to-transparent backdrop-blur-lg rounded-[24px] p-6 border border-green-200/30 hover:border-green-300/50 transition-all duration-500 hover:scale-[1.02] text-center"
            >
              <div className="text-2xl mb-3">💳</div>
              <h3 className="font-bold text-base lg:text-lg text-green-600 dark:text-green-400">{method}</h3>
            </div>
          ))}
        </div>
        
        <p className="text-center text-muted-foreground text-sm lg:text-base mt-8">
          Método de pagamento definido após aprovação técnica.
        </p>
      </div>

      {/* Segurança & Uso */}
      <div className="liquid-card rounded-[48px] p-8 lg:p-12 mb-12 lg:mb-16 backdrop-blur-xl dark:bg-black/5 bg-slate-50/80 border dark:border-white/10 border-slate-200 shadow-2xl">
        <h2 className="text-xl lg:text-3xl font-bold text-foreground mb-6 lg:mb-8 flex items-center">
          <Shield className="text-4xl lg:text-6xl text-red-500 mr-3 lg:mr-4" />
          <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent font-black">
            Segurança & Uso
          </span>
        </h2>
        
        <div className="bg-gradient-to-r from-red-500/10 via-red-400/5 to-transparent backdrop-blur-lg rounded-[32px] p-6 lg:p-8 border border-red-200/30">
          <p className="text-base lg:text-lg text-muted-foreground leading-relaxed text-center">
            O acesso é temporário, monitorado e pessoal.<br />
            Qualquer uso indevido pode resultar em bloqueio imediato.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="liquid-card rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-[#22C55E]/5 via-emerald-500/5 to-green-500/5 border border-[#22C55E]/20 shadow-2xl">
        <div className="bg-gradient-to-r from-[#22C55E]/15 to-emerald-600/15 p-8 lg:p-12 border-b border-white/20">
          <h2 className="text-2xl lg:text-4xl font-black text-center mb-4 lg:mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-muted-foreground text-center text-base lg:text-lg leading-relaxed max-w-2xl mx-auto">
            O utilizador entende quais ferramentas existem, o que poderá fazer com elas, como ativar, quando pagar e quando terá acesso real.
          </p>
        </div>

        <div className="p-8 lg:p-12 space-y-6 lg:space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <button
              className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 h-16 lg:h-20 bg-gradient-to-r from-[#22C55E] via-emerald-500 to-green-500 hover:from-[#16A34A] hover:to-emerald-600 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-lg lg:text-xl relative overflow-hidden group border-2 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <ClipboardCheck className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4 relative z-10" />
              <span className="relative z-10">Solicitar Ativação GSM</span>
            </button>
            <button
              className="rounded-[24px] py-2 px-6 font-bold transition-all duration-400 h-16 lg:h-20 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-lg lg:text-xl relative overflow-hidden group border-2 border-white/20"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              <MessageCircle className="w-6 h-6 lg:w-8 lg:h-8 mr-3 lg:mr-4 relative z-10" />
              <span className="relative z-10">Falar com Técnico</span>
            </button>
          </div>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <span className="text-muted-foreground text-base lg:text-lg font-medium">
                Método de pagamento definido após aprovação técnica.
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <LockKeyhole className="w-5 h-5 text-green-500" />
              <span className="text-muted-foreground text-sm lg:text-base">
                Sem compromisso. Pagamento apenas após aprovação.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GSMSection;
