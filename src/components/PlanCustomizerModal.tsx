import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Calculator,
  Check,
  X,
  Plus,
  Minus,
  MessageCircle,
  ShoppingCart,
  Info,
  Zap,
  Star,
  Package
} from 'lucide-react';

interface Service {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  description: string;
  features: string[];
}

interface Plan {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  includedServices: string[];
  maxAdditionalServices: number;
}

interface Customization {
  basePlan: string;
  selectedServices: string[];
  quantities: Record<string, number>;
  customizations: Record<string, unknown>;
  totalPrice: number;
  timestamp: string;
}

interface PlanCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  basePlan: Plan | null;
  availableServices: Service[];
  onSendProposal: (customization: Customization) => void;
}

const PlanCustomizerModal: React.FC<PlanCustomizerModalProps> = ({
  isOpen,
  onClose,
  basePlan,
  availableServices,
  onSendProposal
}) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customizations, setCustomizations] = useState<Record<string, unknown>>({});

  // Reset state when modal opens with new plan
  useEffect(() => {
    if (isOpen && basePlan) {
      setSelectedServices(basePlan.includedServices);
      setQuantities({});
      setCustomizations({});
    }
  }, [isOpen, basePlan]);

  if (!isOpen || !basePlan) return null;

  // Filter services not already included in base plan
  const additionalServices = availableServices.filter(
    service => !basePlan.includedServices.includes(service.id)
  );

  // Calculate total price
  const calculateTotal = () => {
    let total = basePlan.basePrice;

    selectedServices.forEach(serviceId => {
      const service = availableServices.find(s => s.id === serviceId);
      if (service) {
        const quantity = quantities[serviceId] || 1;
        total += service.basePrice * quantity;
      }
    });

    return total;
  };

  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      if (selectedServices.length >= basePlan.maxAdditionalServices) {
        alert(`Máximo de ${basePlan.maxAdditionalServices} serviços adicionais permitido`);
        return;
      }
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
      const newQuantities = { ...quantities };
      delete newQuantities[serviceId];
      setQuantities(newQuantities);
    }
  };

  const handleQuantityChange = (serviceId: string, quantity: number) => {
    if (quantity < 1) return;
    setQuantities({ ...quantities, [serviceId]: quantity });
  };

  const handleSendProposal = () => {
    const customization = {
      basePlan: basePlan.id,
      selectedServices,
      quantities,
      customizations,
      totalPrice: calculateTotal(),
      timestamp: new Date().toISOString()
    };

    onSendProposal(customization);
    onClose();
  };

  const totalPrice = calculateTotal();
  const additionalServicesCount = selectedServices.filter(id => !basePlan.includedServices.includes(id)).length;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white dark:bg-card rounded-2xl max-w-sm w-full max-h-[85vh] overflow-hidden shadow-2xl border border-white/20 relative flex flex-col" style={{aspectRatio: '9/16'}}>
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/10 rounded-lg flex items-center justify-center">
              <Zap className="w-3 h-3 text-primary" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-foreground">
                Negociar Plano
              </h2>
              <p className="text-xs text-gray-500 dark:text-muted-foreground">
                Personaliza o teu {basePlan.name}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 h-6 w-6 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>

        {/* Content - Phone-Style Layout */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {/* Base Plan Info - Compact */}
              <Card className="border-primary/20">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="w-4 h-4 text-primary" />
                    <h4 className="font-semibold text-sm">{basePlan.name}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{basePlan.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      {basePlan.basePrice.toLocaleString()} MZN
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {basePlan.includedServices.length} incluídos
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Services - Compact */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Serviços Extras
                  <Badge variant="outline" className="text-xs">
                    {additionalServicesCount}/{basePlan.maxAdditionalServices}
                  </Badge>
                </h3>

                <div className="space-y-3">
                  {additionalServices.map((service) => {
                    const isSelected = selectedServices.includes(service.id);
                    const quantity = quantities[service.id] || 1;

                    return (
                      <Card key={service.id} className={`transition-all ${isSelected ? 'border-primary bg-primary/5' : ''}`}>
                        <CardContent className="p-3">
                          <div className="flex items-start gap-3">
                            <Checkbox
                              id={service.id}
                              checked={isSelected}
                              onCheckedChange={(checked) => handleServiceToggle(service.id, checked as boolean)}
                              className="mt-0.5"
                            />

                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <Label htmlFor={service.id} className="font-medium cursor-pointer text-sm">
                                  {service.name}
                                </Label>
                                <div className="text-right">
                                  <div className="font-bold text-primary text-sm">
                                    {service.basePrice.toLocaleString()} MZN
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {service.category}
                                  </Badge>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground mb-2">
                                {service.description}
                              </p>

                              {isSelected && (
                                <div className="flex items-center gap-2 mt-2">
                                  <Label className="text-xs">Qtd:</Label>
                                  <div className="flex items-center gap-1">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleQuantityChange(service.id, quantity - 1)}
                                      disabled={quantity <= 1}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Minus className="w-2 h-2" />
                                    </Button>
                                    <span className="w-6 text-center font-semibold text-xs">{quantity}</span>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleQuantityChange(service.id, quantity + 1)}
                                      className="h-6 w-6 p-0"
                                    >
                                      <Plus className="w-2 h-2" />
                                    </Button>
                                  </div>
                                  <div className="ml-auto font-semibold text-primary text-xs">
                                    {(service.basePrice * quantity).toLocaleString()} MZN
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Price Summary - Phone Style */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-3">
            <div className="space-y-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Calculator className="w-4 h-4" />
                Resumo do Orçamento
              </h3>

              <Card className="border-primary/20">
                <CardContent className="p-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Plano Base:</span>
                    <span className="font-semibold">{basePlan.basePrice.toLocaleString()} MZN</span>
                  </div>

                  {selectedServices
                    .filter(id => !basePlan.includedServices.includes(id))
                    .map(serviceId => {
                      const service = availableServices.find(s => s.id === serviceId);
                      if (!service) return null;

                      const quantity = quantities[serviceId] || 1;
                      return (
                        <div key={serviceId} className="flex justify-between text-xs">
                          <span>{service.name} {quantity > 1 ? `x${quantity}` : ''}:</span>
                          <span>{(service.basePrice * quantity).toLocaleString()} MZN</span>
                        </div>
                      );
                    })}

                  <Separator />

                  <div className="flex justify-between text-base font-bold">
                    <span>Total:</span>
                    <span className="text-primary">{totalPrice.toLocaleString()} MZN</span>
                  </div>
                </CardContent>
              </Card>

              <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800">
                <Info className="h-3 w-3" />
                <AlertDescription className="text-xs">
                  Podemos negociar condições especiais e ajustar conforme suas necessidades.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Button
                  onClick={handleSendProposal}
                  className="w-full text-sm h-9"
                >
                  <MessageCircle className="w-3 h-3 mr-2" />
                  Negociar no WhatsApp
                </Button>

                <Button
                  variant="outline"
                  onClick={onClose}
                  className="w-full text-sm h-9"
                >
                  Continuar Editando
                </Button>
              </div>

              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>💡 Descontos para combinações especiais</p>
                <p>📞 Condições personalizadas disponíveis</p>
              </div>
        </div>
      </div>
    </div>
  );
};

export default PlanCustomizerModal;