import { Award, Users, Lightbulb, Heart, Star, Shield, CheckCircle, MessageCircle } from 'lucide-react';
import avatarFuturistic from '@/assets/avatar-futuristic.webp';
import { handleWhatsAppClick } from '@/lib/whatsapp';

const About = () => {
  const achievements = [
    {
      icon: Lightbulb,
      title: 'Inovação com IA',
      description: 'Utilizamos Inteligência Artificial avançada para criar soluções personalizadas e automatizar processos criativos.',
      badge: '🤖 Inovador'
    },
    {
      icon: Shield,
      title: 'Certificado ISO 27001',
      description: 'Segurança da informação certificada internacionalmente. Seus dados e projetos estão protegidos.',
      badge: '🔒 Seguro'
    },
    {
      icon: Users,
      title: 'Plataforma Única',
      description: 'Elimine a gestão de múltiplos fornecedores. Design, desenvolvimento e marketing em um só lugar.',
      badge: '🎯 Completo'
    },
    {
      icon: Star,
      title: 'Revisões Incluídas',
      description: 'Múltiplas rodadas de revisões em todos os projetos até sua completa satisfação.',
      badge: '✨ Perfeito'
    },
    {
      icon: CheckCircle,
      title: 'Suporte Pós-Entrega',
      description: 'Acompanhamento completo após entrega com suporte técnico e orientações de uso.',
      badge: '🛠️ Apoiado'
    },
    {
      icon: Heart,
      title: 'Suporte Total 360º',
      description: 'Suporte estratégico em marketing e operacional especializado para máxima performance.',
      badge: '💙 Dedicado'
    }
  ];

  return (
    <section id="about" className="py-20 lg:py-32 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side */}
          <div className="order-2 lg:order-1 animate-fade-up">
            <div className="relative max-w-md mx-auto lg:max-w-none">
              <div className="neo rounded-3xl p-8">
                <img
                  src={avatarFuturistic}
                  alt="Avatar Futurístico - TchovaDigital"
                  className="w-full h-80 object-cover rounded-2xl"
                />
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2 rounded-xl">
                <div className="text-sm font-semibold gradient-text">3+ Anos</div>
                <div className="text-xs text-muted-foreground">Experiência</div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 rounded-xl">
                <div className="text-sm font-semibold gradient-text">100+</div>
                <div className="text-xs text-muted-foreground">Projetos</div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2 animate-fade-up">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8">
              <span className="gradient-text">Por que escolher a TchovaDigital?</span>
            </h2>

            {/* Simplified achievement cards - focus on essentials */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {achievements.slice(0, 6).map((achievement, index) => (
                <div
                  key={index}
                  className="neo p-4 text-center hover-lift group animate-fade-up relative"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-10 h-10 mx-auto mb-3 neo-inset rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <achievement.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                    {achievement.title}
                  </h3>
                </div>
              ))}
            </div>

            {/* Single focused CTA */}
            <div className="mt-8">
              <button
                className="w-full bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover-lift"
                onClick={() => handleWhatsAppClick('contact', 'consultation')}
              >
                <MessageCircle className="w-5 h-5 inline mr-2" />
                Falar Conosco
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;