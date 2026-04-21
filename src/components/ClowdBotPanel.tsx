import React from 'react';

const ClowdBotPanel: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-2xl font-bold text-foreground">ClowdBot Panel</h1>
        <p className="text-muted-foreground">
          Painel de gestão do ClowdBot em desenvolvimento.
        </p>
        <div className="bg-muted/30 rounded-2xl p-6 border border-border/20">
          <p className="text-sm text-muted-foreground">
            Esta funcionalidade estará disponível em breve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClowdBotPanel;
