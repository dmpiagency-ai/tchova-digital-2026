# Protocolos de Comunicação Inter-Agentes (Ecossistema Tchova Digital 360)

Para que o Agente TchovaDigital possa orquestrar eficientemente os sub-agentes, é fundamental estabelecer protocolos claros de comunicação e troca de informações. Estes protocolos garantem a "Hyper-Velocity" e a integração fluida das entregas.

## 📡 Princípios de Comunicação
1.  **Assíncrona e Orientada a Eventos**: A comunicação deve ser preferencialmente assíncrona, onde os sub-agentes notificam o Agente TchovaDigital sobre a conclusão de tarefas ou eventos importantes.
2.  **Contexto Enriquecido**: Cada mensagem ou delegação deve conter contexto suficiente para que o agente receptor possa agir de forma autônoma, sem a necessidade de consultas adicionais.
3.  **Padronização de Dados**: Utilizar formatos de dados padronizados (ex: JSON) para a troca de informações, garantindo interoperabilidade.
4.  **Feedback Contínuo**: Sub-agentes devem fornecer feedback regular sobre o progresso, status e quaisquer bloqueios encontrados.

## 📝 Formato de Delegação de Tarefas (Agente TchovaDigital -> Sub-Agente)

Quando o Agente TchovaDigital delega uma tarefa, a mensagem DEVE conter:
-   **`task_id`**: Identificador único da tarefa.
-   **`service_type`**: Tipo de serviço solicitado (ex: `branding`, `web_vuker`, `marketing_ads`).
-   **`project_brief`**: Resumo detalhado do projeto, incluindo objetivos, público-alvo e requisitos específicos.
-   **`due_date`**: Prazo para a conclusão da tarefa.
-   **`dependencies`**: Lista de pré-requisitos ou entregas de outros sub-agentes (ex: `branding_dna_visual_completed: true`).
-   **`references`**: Links ou caminhos para arquivos de referência relevantes (ex: `figma_url`, `copy_document_path`).
-   **`kpis`**: Métricas de sucesso esperadas para a tarefa (ex: `lighthouse_score_min: 90`).

## 📊 Formato de Reporte de Progresso (Sub-Agente -> Agente TchovaDigital)

Sub-agentes DEVE reportar o progresso utilizando:
-   **`task_id`**: Referência à tarefa delegada.
-   **`status`**: `in_progress`, `completed`, `blocked`, `requires_review`.
-   **`progress_percentage`**: Percentual de conclusão da tarefa.
-   **`output_artifacts`**: Caminhos para arquivos gerados ou URLs de preview (ex: `preview_url`, `logo_file_path`).
-   **`kpi_status`**: Status atual das métricas de sucesso (ex: `lighthouse_score: 92`).
-   **`issues`**: Descrição de quaisquer problemas ou bloqueios, com sugestões de resolução.

## 🚨 Gerenciamento de Exceções e Bloqueios

-   Se um sub-agente encontrar um bloqueio, DEVE notificar o Agente TchovaDigital imediatamente com o status `blocked` e uma descrição clara do problema.
-   O Agente TchovaDigital analisará o bloqueio e poderá:
    *   Fornecer recursos adicionais.
    *   Reatribuir a tarefa.
    *   Comunicar-se com o cliente para ajustar expectativas.
    *   Ativar outro sub-agente para resolver o problema.

## 🔄 Integração de Entregas

O Agente TchovaDigital é responsável por coletar as entregas de múltiplos sub-agentes e integrá-las na solução final. Isso pode envolver:
-   Combinar o DNA Visual do Agente de Branding com a Landing Page do Agente Web.
-   Configurar as campanhas do Agente de Marketing com os assets fornecidos pelo Agente de Mídia.

Esta estrutura garante que a equipe opere como uma unidade coesa, maximizando a eficiência e a qualidade das entregas.
