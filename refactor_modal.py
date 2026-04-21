import os
import re

path = r'c:\Users\WALMAK\Downloads\tchova-digital-main v2\src\pages\ServiceDetails.tsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add import for the new Modal
import_modal = "import { InteractiveContactModal } from '@/components/InteractiveContactModal';\n"
if "InteractiveContactModal" not in content:
    content = content.replace("import { InteractiveServiceCard } from '@/components/InteractiveServiceCard';", "import { InteractiveServiceCard } from '@/components/InteractiveServiceCard';\n" + import_modal)

# Add state for Modal near pendingCheckoutUrl
state_decl = "  const [isContactModalOpen, setContactModalOpen] = useState(false);\n"
if "isContactModalOpen" not in content:
    content = content.replace("const [pendingCheckoutUrl", state_decl + "  const [pendingCheckoutUrl")

# Now replace the Universal Payment Section AND Universal CTA
# We will use regex or find to locate the start and end.
start_marker = "{/* Universal Payment Section */}"
end_marker = "</main>"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker, start_idx)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers!")
    exit(1)

new_cta_block = """{/* Dynamic CTA Block */}
            <div className="liquid-card rounded-[24px] sm:rounded-[32px] lg:rounded-[48px] overflow-hidden backdrop-blur-xl bg-gradient-to-br from-primary/5 via-brand-green/5 to-brand-yellow/5 border border-primary/20 shadow-2xl mt-8 sm:mt-12 lg:mt-16">
              <div className="bg-gradient-to-r from-primary/15 to-brand-green/15 p-6 sm:p-10 lg:p-16 border-b border-white/20 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
                
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-foreground mb-4 sm:mb-6">
                  {!isPaymentAuthorized ? 'Pronto para Transformar o seu Negócio?' : 'Seu projeto está a caminho!'}
                </h2>
                
                {!isPaymentAuthorized ? (
                  <p className="text-muted-foreground text-sm sm:text-base lg:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
                    Junte-se a dezenas de marcas de sucesso em Moçambique. Dê o primeiro passo com um clique.
                  </p>
                ) : (
                  <p className="text-muted-foreground text-sm sm:text-base lg:text-xl leading-relaxed max-w-2xl mx-auto font-medium mb-8">
                    Acesso seguro ao portal de pagamento liberado. Conclua a operação de forma segura.
                  </p>
                )}
                
                <div className="mt-8 sm:mt-10 lg:mt-12 flex justify-center">
                  {!isPaymentAuthorized ? (
                    <Button
                      onClick={() => setContactModalOpen(true)}
                      className="rounded-[2rem] py-4 px-8 sm:px-12 font-extrabold transition-all duration-300 h-14 sm:h-16 lg:h-20 bg-gradient-to-r from-[#25D366] to-[#1DA851] hover:from-[#1DA851] hover:to-[#158C40] text-white shadow-2xl hover:shadow-[0_20px_40px_-15px_rgba(37,211,102,0.5)] transform hover:scale-[1.03] active:scale-[0.98] text-base sm:text-lg lg:text-2xl relative overflow-hidden group border-2 border-white/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <Rocket className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-3 lg:mr-4 relative z-10 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                      <span className="relative z-10 tracking-tight">Começar Agora</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePayment}
                      className="rounded-[2rem] py-4 px-8 sm:px-12 font-extrabold transition-all duration-300 h-14 sm:h-16 lg:h-20 bg-gradient-to-r from-primary to-brand-green hover:from-primary-darker hover:to-brand-green text-white shadow-2xl hover:shadow-primary/40 transform hover:scale-[1.03] active:scale-[0.98] text-base sm:text-lg lg:text-2xl relative overflow-hidden group border-2 border-white/20"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
                      <ShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 mr-3 lg:mr-4 relative z-10" />
                      <span className="relative z-10 tracking-tight">Efetuar Pagamento</span>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      """

content = content[:start_idx] + new_cta_block + content[end_idx:]

# Inject Modal Component before last closing div
modal_component = """
      <InteractiveContactModal 
        isOpen={isContactModalOpen} 
        onClose={() => setContactModalOpen(false)} 
        serviceName={heroData ? heroData.title : 'o serviço'}
      />
"""

if "<InteractiveContactModal" not in content:
    content = content.replace("</main>", "</main>\n" + modal_component)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Replaced Payment and Duplicate CTA with New Converstion Block")
