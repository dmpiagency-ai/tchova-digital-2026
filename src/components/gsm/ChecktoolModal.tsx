import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, Search, Smartphone, Barcode, Copy, ExternalLink } from 'lucide-react';
import { GSMTool, ChecktoolRequest } from '@/types/gsm';

interface ChecktoolModalProps {
  tool: GSMTool | null;
  isOpen: boolean;
  onClose: () => void;
  onCheckComplete?: (request: ChecktoolRequest) => void;
  isLoading?: boolean;
  checkResult?: any;
  error?: string | null;
}

const ChecktoolModal: React.FC<ChecktoolModalProps> = ({
  tool,
  isOpen,
  onClose,
  onCheckComplete,
  isLoading = false,
  checkResult,
  error
}) => {
  const [imei, setImei] = useState('');
  const [serial, setSerial] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateImei = (value: string): boolean => {
    // Basic IMEI validation - 15 digits
    const imeiRegex = /^\d{15}$/;
    return imeiRegex.test(value);
  };

  const handleCheck = () => {
    if (!tool) return;

    // Validate inputs
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

    // Create checktool request
    const request: ChecktoolRequest = {
      id: `check_${Date.now()}`,
      userId: 'current_user_id',
      toolId: tool.id,
      inputData: {
        ...(tool.requires_imei ? { imei } : {}),
        ...(tool.requires_serial ? { serial } : {})
      },
      result: {
        status: 'pending',
        details: {}
      },
      cost: 0,
      createdAt: new Date()
    };

    onCheckComplete?.(request);
  };

  const handleClose = () => {
    setImei('');
    setSerial('');
    setValidationError(null);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!tool) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] rounded-[48px] p-0 bg-background/80 backdrop-blur-3xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-brand-green/5" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        
        <DialogHeader className="text-center pt-8 px-8 relative">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-gradient-to-r from-primary to-brand-green flex items-center justify-center mb-4 shadow-lg shadow-primary/30 animate-pulse">
            <Search className="w-10 h-10 text-white" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">
            Verificar Status
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ferramenta: <span className="text-primary font-semibold">{tool.name}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-6 px-8 relative">
          {/* Input Fields */}
          {tool.requires_imei && (
            <div className="space-y-3">
              <Label htmlFor="imei" className="flex items-center gap-2 text-foreground font-semibold">
                <Smartphone className="w-4 h-4 text-primary" />
                Número IMEI
              </Label>
              <Input
                id="imei"
                type="text"
                placeholder="Ex: 123456789012345"
                value={imei}
                onChange={(e) => {
                  setImei(e.target.value.replace(/\D/g, '').slice(0, 15));
                  setValidationError(null);
                }}
                disabled={isLoading}
                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-mono backdrop-blur-xl"
                maxLength={15}
              />
              <p className="text-xs text-muted-foreground">
                O IMEI possui 15 dígitos. Digite *#06# no dispositivo para encontrar.
              </p>
            </div>
          )}

          {tool.requires_serial && (
            <div className="space-y-3">
              <Label htmlFor="serial" className="flex items-center gap-2 text-foreground font-semibold">
                <Barcode className="w-4 h-4 text-primary" />
                Número de Série
              </Label>
              <Input
                id="serial"
                type="text"
                placeholder="Ex: SN123456789"
                value={serial}
                onChange={(e) => {
                  setSerial(e.target.value);
                  setValidationError(null);
                }}
                disabled={isLoading}
                className="h-14 rounded-2xl bg-white/5 border-white/10 focus:border-primary/50 text-lg font-mono backdrop-blur-xl"
              />
              <p className="text-xs text-muted-foreground">
                O número de série está localizado na parte trasera do dispositivo ou na caixa.
              </p>
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
            <div className="flex flex-col items-center justify-center gap-4 p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-xl">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-foreground font-semibold text-lg">Verificando status...</span>
              <span className="text-xs text-muted-foreground">Aguarde enquanto processamos sua solicitação</span>
            </div>
          )}

          {/* Check Result */}
          {checkResult && !isLoading && (
            <div className={`p-6 rounded-2xl ${
              checkResult.status === 'success' || checkResult.success 
                ? 'bg-green-500/10 border border-green-500/20' 
                : 'bg-yellow-500/10 border border-yellow-500/20'
            } backdrop-blur-xl`}>
              <div className="flex items-start gap-4">
                {checkResult.status === 'success' || checkResult.success ? (
                  <CheckCircle className="w-10 h-10 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="w-10 h-10 text-yellow-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-foreground">
                    {checkResult.status === 'success' || checkResult.success ? 'Dispositivo Encontrado' : 'Verificação Pendente'}
                  </h4>
                  
                  {checkResult.data && (
                    <div className="mt-3 space-y-2">
                      {checkResult.data.device && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Modelo: </span>
                          <span className="text-foreground font-medium">{checkResult.data.device}</span>
                        </div>
                      )}
                      {checkResult.data.brand && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Marca: </span>
                          <span className="text-foreground font-medium">{checkResult.data.brand}</span>
                        </div>
                      )}
                      {checkResult.data.status && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Status: </span>
                          <Badge variant="outline" className={`
                            ${checkResult.data.status === 'CLEAN' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}
                            ${checkResult.data.status === 'LOST' ? 'bg-red-500/20 text-red-400 border-red-500/30' : ''}
                            ${checkResult.data.status === 'CHECK' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : ''}
                          `}>
                            {checkResult.data.status}
                          </Badge>
                        </div>
                      )}
                      {checkResult.data.network && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">Rede: </span>
                          <span className="text-foreground font-medium">{checkResult.data.network}</span>
                        </div>
                      )}
                      {checkResult.data.country && (
                        <div className="text-sm">
                          <span className="text-muted-foreground">País: </span>
                          <span className="text-foreground font-medium">{checkResult.data.country}</span>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {checkResult.message && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {checkResult.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <XCircle className="w-5 h-5" />
                Erro na Verificação
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
            Fechar
          </Button>
          <Button 
            onClick={handleCheck} 
            disabled={isLoading || (tool.requires_imei && !imei) || (tool.requires_serial && !serial)}
            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-brand-green hover:from-primary/90 hover:to-brand-green/90 font-semibold shadow-lg shadow-primary/25 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                <Search className="w-4 h-4 mr-2" />
                Verificar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChecktoolModal;
