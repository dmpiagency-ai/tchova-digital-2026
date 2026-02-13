import { useState, useEffect } from 'react';
import { Send, MapPin, Phone, Mail, Instagram, Facebook, CheckCircle, AlertCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { handleWhatsAppClick } from '@/lib/whatsapp';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useMozambiqueMobile, useTouchFriendly } from '@/hooks/useMozambiqueMobile';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [touched, setTouched] = useState<{[key: string]: boolean}>({});
  const [isValid, setIsValid] = useState(false);
  const { toast } = useToast();
  const { trackFormInteraction, trackButtonClick, trackWhatsAppClick } = useAnalytics();
  const { shouldUseLargeButtons } = useTouchFriendly();

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      trackFormInteraction('contact_form', 'error');
      return;
    }

    setIsSubmitting(true);
    trackFormInteraction('contact_form', 'submit');

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pelo contacto. Responderemos em breve!",
      });

      setFormData({ name: '', email: '', message: '' });
      setErrors({});
      setTouched({});
      setIsValid(false);
    } catch (error) {
      trackFormInteraction('contact_form', 'error');
      toast({
        title: "Erro ao enviar",
        description: "Tente novamente ou entre em contacto pelo WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real-time validation
  useEffect(() => {
    const newErrors: {[key: string]: string} = {};

    if (touched.name && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    } else if (touched.name && formData.name.trim().length < 2) {
      newErrors.name = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (touched.email && !formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    if (touched.message && !formData.message.trim()) {
      newErrors.message = 'Mensagem é obrigatória';
    } else if (touched.message && formData.message.trim().length < 10) {
      newErrors.message = 'Mensagem deve ter pelo menos 10 caracteres';
    }

    setErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0 && Boolean(formData.name.trim()) && Boolean(formData.email.trim()) && Boolean(formData.message.trim()));
  }, [formData, touched]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Mark field as touched
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }

    // Track form interaction
    trackFormInteraction('contact_form', 'start', name);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
  };

  const socialLinks = [
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/tchovadigital',
      color: 'hover:text-pink-500'
    },
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/tchovadigital',
      color: 'hover:text-blue-500'
    }
  ];

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Localização',
      info: 'Centro Urbano'
    },
    {
      icon: Phone,
      title: 'Telefone',
      info: '+258 123 456 789'
    },
    {
      icon: Mail,
      title: 'E-mail',
      info: 'hello@tchovadigital.com'
    }
  ];

  return (
    <section id="contact" className="py-20 lg:py-32 relative overflow-hidden">
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto animate-fade-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
            <span className="gradient-text">Vamos conversar?</span>
          </h2>

          <Button
            className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-2xl text-lg hover-lift transition-all duration-300"
            onClick={() => handleWhatsAppClick('contact', 'general')}
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            WhatsApp
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Contact;