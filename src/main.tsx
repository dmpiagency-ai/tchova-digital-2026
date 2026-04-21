import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

try {
  const container = document.getElementById("root");
  if (!container) {
    throw new Error("Elemento root não encontrado no DOM. Verifique o seu index.html.");
  }
  const root = createRoot(container);
  root.render(<App />);
} catch (error) {
  console.error("ERRO CRÍTICO NA INICIALIZAÇÃO:", error);
  // Emergency fallback UI if the whole app fails to mount
  document.body.innerHTML = `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; color: #ef4444;">
      <h1>Erro de Carregamento</h1>
      <p>Não foi possível iniciar a aplicação. Por favor, verifique a ligação ou contacte o suporte.</p>
      <button onclick="window.location.reload()" style="padding: 10px 20px; cursor: pointer;">Recarregar</button>
    </div>
  `;
}
