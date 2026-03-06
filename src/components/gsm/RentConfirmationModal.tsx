import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Zap, Clock, DollarSign, Copy, Smartphone, Barcode, ExternalLink, Key, User } from 'lucide-react';
import { GSMTool, Currency } from '@/types/gsm';
import { formatCurrency } from '@/services/gsmRentalService';

interface RentConfirmationModalProps {
  tool: GSMTool | null;
  duration: number;
  currency: Currency;
  userLevel: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (imei?: string, serial?: string) => Promise<void>;
  isLoading?: boolean;
  rentalResult?: any;
  error?: string | null;
}

const RentConfirmationModal: React.FC<RentConfirmationModalProps> = ({
  tool,
  duration,
  currency,
  userLevel,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  rentalResult,
  error
}) => {
  const [imei, setImei] = useState('');
  const [serial, setSerial] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Calculate prices
  const hourlyPrice = tool ? (currency === 'USD' ? tool.pricing[userLevel as keyof typeof tool.pricing]?.usd || tool.pricing.cliente.usd : tool.pricing[userLevel as keyof typeof tool.pricing]?.mtn || tool.pricing.cliente.mtn) : 0;
  const totalPrice = hourlyPrice * duration;
  const discount = duration >= 8 ? 10 : duration >= 4 ? 5 : 0;
  const discountedPrice = totalPrice * (1 - discount / 100);

  const validateImei = (value: string): boolean => {
    const imeiRegex = /^\d{15}$/;
    return imeiRegex.test(value);
  };

  const handleConfirm = async () => {
    if (!tool) return;

    setValidationError(null);
    
    if (tool.requires_imei && !imei) {
      setValidationError('Por favor, insira o número IMEI');
      return;
    }
    
    if (tool.requires_imei && imei && !validateImei(imei)) {
      setValidationError('O IMEI deve conter 15 dígitos');
      return;
    }
    
    if (tool.requires_serial && !serial) {
      setValidationError('Por favor, insira o número de série');
      return;
    }

    await onConfirm(imei, serial);
  };

  const handleClose = () => {
    setImei('');
    setSerial('');
    setValidationError(null);
    setCopiedField(null);
    onClose();
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[550px] rounded-[48px] p-0 bg-background/80 backdrop-blur-3xl border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-green/5" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        {/* Success State - Show Credentials */}
        {rentalResult && rentalResult.success ? (
          <>
            <DialogHeader className="text-center pt-8 px-8 relative">
              <div className="mx-auto w-24 h-24 rounded-3xl bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center mb-4 shadow-lg shadow-green-500/30 animate-pulse">
                <CheckCircle className="w-12 h-12 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black text-foreground">
                Aluguel Confirmado!
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Suas credenciais foram geradas com sucesso
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6 px-8 relative">
              {/* Success Details */}
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-foreground">{tool.name}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>Duração: {duration} hora{duration > 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Credentials */}
              {rentalResult.data?.credentials && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" />
                    Suas Credenciais
                  </h4>
                  
                  <div className="space-y-3">
                    {Object.entries(rentalResult.data.credentials).map(([key, value]) => (
                      <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-muted-foreground uppercase">{key}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(String(value), key)}
                            className="h-6 px-2 text-xs"
                          >
                            {copiedField === key ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                        <code className="text-sm font-mono text-foreground break-all">{String(value)}</code>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Access Link */}
              {rentalResult.data?.accessUrl && (
                <div className="p-4 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ExternalLink className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-foreground">Acessar Ferramenta</span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => window.open(rentalResult.data.accessUrl, '_blank')}
                      className="rounded-full bg-primary hover:bg-primary/90"
                    >
                      Abrir
                    </Button>
                  </div>
                </div>
              )}

              {/* Expiry Info */}
              {rentalResult.data?.expiresAt && (
                <div className="text-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Expira em: {new Date(rentalResult.data.expiresAt).toLocaleString('pt-MZ')}
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-center mt-4 px-8 pb-8 relative">
              <Button 
                onClick={handleClose}
                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-brand-green hover:from-primary/90 hover:to-brand-green/90 font-semibold shadow-lg shadow-primary/25 transition-all duration-200"
              >
                Concluído
              </Button>
            </div>
          </>
        ) : (
          <>
            {/* Request State */}
            <DialogHeader className="text-center pt-8 px-8 relative">
              <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-brand-green flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
                <Zap className="w-10 h-10 text-white" />
              </div>
              <DialogTitle className="text-2xl font-black text-foreground">
                Confirmar Aluguel
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Ferramenta: <span className="text-primary font-semibold">{tool.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-6 px-8 relative">
              {/* Order Summary */}
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-3">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  Resumo do Pedido
                </h4>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Ferramenta</span>
                  <span className="text-foreground font-medium">{tool.name}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Duração</span>
                  <span className="text-foreground font-medium">{duration} hora{duration > 1 ? 's' : ''}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Preço/hora</span>
                  <span className="text-foreground">{formatCurrency(hourlyPrice, currency)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Desconto ({duration}h)</span>
                    <span>-{discount}%</span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-white/10 flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-2xl font-black text-primary">{formatCurrency(discountedPrice, currency)}</span>
                </div>
              </div>

              {/* Required Fields */}
              {(tool.requires_imei || tool.requires_serial) && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-foreground flex items-center gap-2">
                    <User className="w-4 h-4 text-primary" />
                    Informações do Dispositivo
                  </h4>
                  
                  {tool.requires_imei && (
                    <div className="space-y-2">
                      <Label htmlFor="imei" className="flex items-center gap-2 text-foreground">
                        <Smartphone className="w-4 h-4" />
                        IMEI do Dispositivo
                      </Label>
                      <Input
                        id="imei"
                        type="text"
                        placeholder="15 dígitos"
                        value={imei}
                        onChange={(e) => {
                          setImei(e.target.value.replace(/\D/g, '').slice(0, 15));
                          setValidationError(null);
                        }}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-white/5 border-white/10 font-mono"
                        maxLength={15}
                      />
                    </div>
                  )}

                  {tool.requires_serial && (
                    <div className="space-y-2">
                      <Label htmlFor="serial" className="flex items-center gap-2 text-foreground">
                        <Barcode className="w-4 h-4" />
                        Número de Série
                      </Label>
                      <Input
                        id="serial"
                        type="text"
                        placeholder="Número de série"
                        value={serial}
                        onChange={(e) => {
                          setSerial(e.target.value);
                          setValidationError(null);
                        }}
                        disabled={isLoading}
                        className="h-12 rounded-xl bg-white/5 border-white/10"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Validation Error */}
              {validationError && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <XCircle className="w-4 h-4" />
                    {validationError}
                  </div>
                </div>
              )}

              {/* Loading State */}
              {isLoading && (
                <div className="flex flex-col items-center justify-center gap-3 p-8 bg-white/5 rounded-2xl border border-white/10">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <span className="text-foreground font-medium">Processando pagamento...</span>
                  <span className="text-xs text-muted-foreground">Aguarde enquanto geramos suas credenciais</span>
                </div>
              )}

              {/* Error Message */}
              {error && !isLoading && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <div className="flex items-center gap-2 text-red-400 font-medium">
                    <XCircle className="w-5 h-5" />
                    Erro no Aluguel
                  </div>
                  <p className="text-sm text-red-400/80 mt-1">{error}</p>
                </div>
              )}
            </div>

            <div className="flex gap-3 justify-end mt-2 px-8 pb-8 relative">
              <Button 
                variant="outline" 
                onClick={handleClose} 
                disabled={isLoading}
                className="h-12 px-6 rounded-2xl border-white/20 hover:bg-white/10 backdrop-blur-xl transition-all duration-200"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={isLoading || (tool.requires_imei && !imei) || (tool.requires_serial && !serial)}
                className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-brand-green hover:from-primary/90 hover:to-brand-green/90 font-semibold shadow-lg shadow-primary/25 transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Confirmar Aluguel
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RentConfirmationModal;
