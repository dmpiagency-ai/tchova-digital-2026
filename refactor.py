import os

path = r'c:\Users\WALMAK\Downloads\tchova-digital-main v2\src\pages\ServiceDetails.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import
import_str = "import { InteractiveServiceCard } from '@/components/InteractiveServiceCard';\n"
if 'InteractiveServiceCard' not in content:
    content = content.replace("from '@/constants/servicesData';", "from '@/constants/servicesData';\n" + import_str)

# Add heroData logic before return
hook_anchor = "  const isMarketing = service?.category === 'Marketing Digital';"
hero_logic = """
  const serviceKey = isDesignGrafico ? 'design' : 
                     isWebsites ? 'websites' : 
                     isMarketing ? 'marketing' : 
                     isAudiovisual ? 'audiovisual' : 
                     isImportacao ? 'importacao' : null;
  
  const heroData = serviceKey ? servicesData[serviceKey as keyof typeof servicesData] : null;
"""
if "const serviceKey" not in content:
    content = content.replace(hook_anchor, hook_anchor + hero_logic)

start_marker = "{/* GSM Service - New Modern Liquid Glass Design */}\n        {isGSM ? ("
end_marker = "      </main>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print('Failed to find start or end marker')
    exit(1)

new_block = """{/* GSM Service - New Modern Liquid Glass Design */}
        {isGSM ? (
          <GSMServicePage />
        ) : heroData ? (
          // Dynamic Hero - Data Driven 3D
          <div className="tech-card overflow-hidden mb-8 sm:mb-12 lg:mb-20 rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] shadow-xl border border-primary/20 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-green/20 via-brand-dark/10 to-brand-yellow/20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-30"></div>
            </div>
            
            <div className="relative p-4 sm:p-6 lg:p-8">
              {/* Common Title Header */}
              <div className="bg-brand-dark/95 backdrop-blur-lg rounded-[2rem] p-7 border-2 border-white/30 animate-fade-in shadow-2xl mb-8">
                <h1 className="text-[1.75rem] md:text-3xl font-extrabold text-white mb-3 leading-tight text-center">
                  <span className="bg-gradient-to-r from-brand-green via-brand-bright to-brand-yellow bg-clip-text text-transparent drop-shadow-lg">
                    {heroData.title}
                  </span>
                </h1>
                <p className="text-base md:text-lg text-white/95 leading-relaxed font-medium text-center max-w-2xl mx-auto">
                  {heroData.heroDescription}
                </p>
              </div>

              {/* 3D Interactive Grid using Framer Motion Component */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {(heroData as any).heroCards.map((card: any, i: number) => (
                  <InteractiveServiceCard
                    key={i}
                    title={card.title}
                    subtitle={card.subtitle}
                    icon={card.icon}
                    gradient={card.gradient}
                    borderColor={card.borderColor}
                    delay={parseFloat(card.animationDelay) || 0}
                    featured={card.spans === 2}
                  />
                ))}
              </div>
              
              <Button
                onClick={() => {
                  const targetId = isAudiovisual ? 'pacotes-audiovisual' : (isImportacao ? 'como-funciona-importacao' : 'o-que-criamos');
                  document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full mt-8 rounded-[1.75rem] py-8 px-10 font-extrabold transition-all duration-150 ease-out bg-gradient-to-r from-primary to-primary-darker hover:from-[primary-dark] hover:to-primary-darker text-white shadow-2xl hover:shadow-primary/40 active:scale-[0.92] active:shadow-lg text-xl relative overflow-hidden group animate-fade-in touch-manipulation will-change-transform">
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                <Eye className="w-7 h-7 mr-3 relative z-10 group-hover:scale-110 transition-transform duration-150" />
                <span className="relative z-10 tracking-tight">Ver Detalhes</span>
              </Button>
            </div>
          </div>
        ) : (
           <div className="text-center py-20">
             <h2 className="text-2xl font-bold">Serviço em Atualização</h2>
           </div>
        )}

        {/* Dynamic Includes & Process Section */}
        {heroData && (
          <>
            {/* O Que Inclui / Criamos */}
            {(heroData as any).includes && (heroData as any).includes.length > 0 && (
              <div id="o-que-criamos" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                  <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">O que Incluí / Criamos</span>
                </h2>
                
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                  {(heroData as any).includes.map((item: any, index: number) => (
                    <div
                      key={index}
                      className={`group bg-gradient-to-br ${item.color} backdrop-blur-lg rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] p-4 sm:p-5 lg:p-6 border hover:scale-[1.02] transition-all duration-500`}
                    >
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 text-white`}>
                          {item.icon}
                        </div>
                        <h3 className="font-bold text-xs sm:text-sm lg:text-base leading-tight text-foreground">{item.name}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audiovisual Packages */}
            {isAudiovisual && (
              <div id="pacotes-audiovisual" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-primary/20 shadow-2xl scroll-mt-20 sm:scroll-mt-24">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                  <Package className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-primary mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                  <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">Pacotes</span>
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {audiovisualPackages.map((pkg: any, index: number) => (
                    <div
                      key={index}
                      className={`group relative bg-gradient-to-br from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] p-5 sm:p-6 border ${pkg.popular ? 'border-primary/50 ring-2 ring-primary/30' : 'border-primary/20'} hover:border-primary/40 transition-all duration-500 hover:scale-[1.02]`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <span className="bg-gradient-to-r from-primary to-brand-green text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            POPULAR
                          </span>
                        </div>
                      )}
                      
                      <div className="text-center mb-4">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-brand-green rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300 text-white">
                          {pkg.icon}
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-foreground mb-1">{pkg.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent">
                            {pkg.price.toLocaleString('pt-MZ')}
                          </span>
                          <span className="text-sm text-muted-foreground">MZN</span>
                        </div>
                      </div>
                      
                      <ul className="space-y-2 mb-4">
                        {pkg.features.map((feature: string, fIndex: number) => (
                          <li key={fIndex} className="flex items-center text-xs sm:text-sm text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      
                      <Button
                        onClick={() => handleRequestQuote(pkg.name, pkg.price)}
                        className={`w-full rounded-xl py-2 px-4 font-bold transition-all duration-400 h-10 sm:h-12 text-sm ${pkg.popular ? 'bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-lg hover:shadow-xl' : 'bg-white/10 hover:bg-white/20 text-foreground border border-primary/30'}`}
                      >
                        Solicitar
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Processo */}
            {(heroData as any).process && (heroData as any).process.length > 0 && (
               <div id="como-funciona-importacao" className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-brand-yellow/20 shadow-2xl">
                 <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 flex items-center">
                   <ClipboardList className="text-2xl xs:text-3xl sm:text-4xl lg:text-6xl text-brand-yellow mr-2 sm:mr-3 lg:mr-4 flex-shrink-0" />
                   <span className="bg-gradient-to-r from-brand-yellow to-accent-light bg-clip-text text-transparent font-black">Processo</span>
                 </h2>
                 
                 <div className="space-y-3 sm:space-y-4">
                   {(heroData as any).process.map((item: any, index: number) => (
                     <div
                       key={index}
                       className="group flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 lg:p-6 rounded-[16px] sm:rounded-[20px] lg:rounded-[24px] bg-gradient-to-r from-primary/10 via-brand-green/5 to-transparent backdrop-blur-lg border border-primary/20 hover:border-primary/40 transition-all duration-500"
                     >
                       <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-primary to-primary-darker text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base lg:text-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                         {item.step}
                       </div>
                       <div className="flex-1 min-w-0 pt-1">
                         <h3 className="font-bold text-sm sm:text-base lg:text-lg mb-1 text-primary dark:text-primary">{item.title}</h3>
                         <p className="text-muted-foreground text-xs sm:text-sm lg:text-base leading-relaxed">{item.description}</p>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
            )}

            {/* Universal Payment Section */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] p-4 xs:p-6 sm:p-8 lg:p-12 mb-8 sm:mb-12 lg:mb-16 backdrop-blur-xl bg-white/5 dark:bg-black/5 border border-white/10 shadow-2xl">
              <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8 text-center">
                <span className="bg-gradient-to-r from-primary to-brand-green bg-clip-text text-transparent font-black">
                  💳 Pagamento
                </span>
              </h2>
              
              <div className="bg-gradient-to-r from-brand-yellow/10 via-primary/5 to-transparent backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-brand-yellow/30 mb-4 sm:mb-6 lg:mb-8 text-center">
                <p className="text-muted-foreground text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                  <strong>Fluxo de pagamento:</strong>
                </p>
                <div className="flex justify-center gap-4 sm:gap-6 lg:gap-8">
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-brand-yellow/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-brand-yellow">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">Para iniciar</p>
                  </div>
                  <div className="text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-lg sm:text-xl lg:text-2xl font-bold text-primary">50%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">{isMarketing ? 'Mensal' : 'Na entrega'}</p>
                  </div>
                </div>
              </div>

              <h3 className="text-sm sm:text-base lg:text-lg font-bold text-center mb-3 sm:mb-4 text-muted-foreground">Métodos de Pagamento:</h3>
              <div className="flex flex-wrap justify-center gap-2 sm:gap-3 lg:gap-4 mb-6 sm:mb-8">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Carteira Local</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">Cartão</span>
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 rounded-full text-xs sm:text-sm font-medium">PayPal</span>
              </div>
              
              {!isPaymentAuthorized ? (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-amber-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <LockKeyhole className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-amber-600 dark:text-amber-400 text-center">Pagamento autorizado após atendimento</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm lg:text-base mb-4 sm:mb-6">
                      Para iniciar o projeto ou liberar o pagamento de uma parcela, fale com a nossa equipa.
                    </p>
                    <Button
                      onClick={handleContact}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Falar com a Tchova</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-gradient-to-r from-green-500/20 via-emerald-500/10 to-green-500/20 backdrop-blur-lg rounded-[20px] sm:rounded-[24px] lg:rounded-[32px] p-4 sm:p-6 lg:p-8 border border-green-300/30">
                    <div className="flex items-center justify-center space-x-2 mb-3 sm:mb-4">
                      <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
                      <span className="text-sm sm:text-base lg:text-lg font-bold text-green-600 dark:text-green-400">Pagamento Autorizado</span>
                    </div>
                    <p className="text-muted-foreground text-xs sm:text-sm mb-4 sm:mb-6">
                      Acesso seguro ao portal de pagamento liberado.
                    </p>
                    <Button
                      onClick={handlePayment}
                      className="rounded-[20px] sm:rounded-[24px] py-2 px-6 sm:px-8 font-bold transition-all duration-400 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-xl hover:shadow-2xl transform hover:scale-[1.01] h-12 sm:h-14 text-sm sm:text-base lg:text-lg relative overflow-hidden group w-full sm:w-auto"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <span className="relative z-10">Efetuar Pagamento</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Universal CTA */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-brand-green/5 to-brand-yellow/5 border border-primary/20 shadow-2xl">
              <div className="bg-gradient-to-r from-primary/15 to-brand-green/15 p-4 xs:p-6 sm:p-8 lg:p-12 border-b border-white/20">
                <h2 className="text-lg xs:text-xl sm:text-2xl lg:text-4xl font-black text-foreground text-center mb-2 sm:mb-4 lg:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para dar o próximo passo?' : 'Seu projeto está a caminho!'}
                </h2>
                {!isPaymentAuthorized && (
                  <p className="text-muted-foreground text-center text-xs sm:text-sm lg:text-base leading-relaxed max-w-2xl mx-auto">
                    Fale com a Tchova para discutir o seu projeto e receber um fluxo personalizado.
                  </p>
                )}
              </div>
              <div className="p-4 xs:p-6 sm:p-8 lg:p-12 space-y-4 sm:space-y-6 lg:space-y-8 text-center flex justify-center">
                 <Button
                    onClick={handleContact}
                    className="rounded-[20px] sm:rounded-[24px] py-2 px-4 sm:px-6 font-bold transition-all duration-400 h-12 sm:h-14 lg:h-20 bg-gradient-to-r from-primary via-brand-green to-brand-yellow hover:from-primary-darker hover:to-brand-yellow text-white shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] text-sm sm:text-base lg:text-xl relative overflow-hidden group border-2 border-white/20"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                    <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 mr-2 sm:mr-3 relative z-10" />
                    <span className="relative z-10">Agendar Reunião ou Falar no WhatsApp</span>
                 </Button>
              </div>
            </div>
          </>
        )}\n"""

content = content[:start_idx] + new_block + content[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print('Rewrite complete.')
