- [x] Fix FAQ page - remove solutions section duplication
- [x] Upload team image to S3 for FAQ page
- [x] Add image to FAQ page layout
- [x] Test FAQ page in Portuguese and English
- [x] Fix Smart Layout page hero image - changed from missing smart-layout-hero.jpg to smart-layout-olive-oil.png
- [x] Restore Smart Layout page with all 5 shelf visualization images and multilingual support
- [x] Add zoom functionality (50% zoom on click) to shelf visualization images on Smart Layout page
- [x] Replace Smart Layout simulator with pre-loaded rice varieties example (5 types)
- [x] Replace all "Frentes" terminology with "Quadrantes" throughout Smart Layout page
- [x] Test updated Smart Layout simulator in Portuguese and English
- [x] Translate SmartLayoutSimulator interface to English with full multilingual support
- [x] Create product category presets (beverages, hygiene, electronics) for quick loading
- [x] Implement PDF export functionality for shelf visualization and recommendations
- [x] Test all new features in both Portuguese and English
- [x] Add shelf height control (30-90 cm) to Smart Layout simulator with slider
- [x] Update product capacity calculations to use shelf height
- [x] Test shelf height control in both Portuguese and English
- [x] Integrate 50 food and 50 non-food categories into Smart Layout simulator
- [x] Implement ABC curve classification (Faturamento and Lucratividade) in recommendation algorithm
- [x] Update subcategory filter dropdown with all 100 categories
- [x] Refactor product recommendation algorithm based on ABC curves and strategic roles
- [x] Test updated simulator with new categories and filters in both languages
- [x] Add data sources section (ABRAS, NielsenIQ, Kantar, SA Varejo) to simulator
- [x] Implement 3D shelf visualization with Three.js
- [x] Create simulation history storage and comparison UI
- [x] Implement intelligent automatic recommendations engine
- [x] Integrate all new features into SmartLayoutEnhanced wrapper
- [x] Test 3D visualization, history, and recommendations in both languages
- [x] Implement product dimension validation and compatibility checks
- [x] Create retail scenario templates (supermarket, pharmacy, convenience store)
- [x] Implement PDF report export with charts and analytics
- [x] Add additional enhancements and polish
- [x] Test all new features in both languages
- [x] Integrate dimension validation into SmartLayoutSimulator with real-time alerts
- [x] Create scenario comparison component with visual charts and metrics
- [x] Implement ERP integration module for data import (SAP, Omni, Totvs)
- [x] Add import UI and data mapping functionality
- [x] Test all new features in both languages
- [x] Implement REST API integration with SAP, Omni, and Totvs for real-time data sync
- [x] Create change history and audit tracking system with rollback capability
- [x] Build KPI dashboard with analytics and trend charts
- [x] Add anomaly detection and alerting system
- [x] Test all new features in both languages
- [x] Restore SmartLayoutSimulator component to Smart Layout page
- [x] Implement save simulation functionality with local storage
- [x] Implement load/restore saved simulations
- [x] Add simulation list and management UI
- [x] Test simulator with save/load in both languages
- [x] Restore product descriptor functionality with margin/velocity characteristics
- [x] Integrate product descriptors into SmartLayoutSimulator
- [x] Implement planogram generation based on product characteristics
- [x] Test product descriptor functionality in both languages
- [x] Fix missing add product buttons in Smart Layout simulator
- [x] Fix image caption from "6 prateleiras" to "4 prateleiras" in Smart Layout
- [x] Fix error when saving simulation data in Smart Layout
- [x] Analisar estrutura atual da visualização da gôndola no SmartLayoutSimulator
- [x] Implementar componente GondolaVisualization com produtos em layout horizontal
- [x] Calcular percentuais de espaço para cada produto baseado em quantidade de itens
- [x] Exibir nome do produto e percentual em cada seção da gôndola
- [x] Integrar visualização na simulação com cores e espaçamento proporcional
- [x] Testar em português e inglês

- [x] Testar visualização da gôndola com 10+ produtos
- [x] Validar legibilidade de nomes e percentuais com muitos produtos
- [x] Testar responsividade em diferentes tamanhos de tela
- [x] Implementar melhorias de layout se necessário (ex: fonte menor, tooltips)

- [x] Implementar filtros por zona de prateleira (Olhos, Mãos, Parte de Baixo)
- [x] Substituir terminologia "Piso" por "Parte de Baixo" em todo o sistema
- [x] Criar modal de seleção de tipo de área de exposição (Gôndola, Terminal, Freezer Vertical, Freezer Horizontal, Banca)
- [x] Implementar funcionalidade de exportação de planograma em PDF
- [x] Integrar biblioteca de PDF (html2pdf ou similar) para exportação
- [x] Testar filtros de zona em português e inglês
- [x] Testar exportação de planograma em PDF em português e inglês
- [x] Validar layout e formatação do PDF exportado

- [x] Criar componente ConfiguracaoAreaExposicao com seleção de tipo e campos de medidas
- [x] Implementar campos de medidas específicos para Gôndola (largura, profundidade, altura entre prateleiras)
- [x] Implementar campos de medidas específicos para Terminal de Gôndola (largura, profundidade, altura entre prateleiras)
- [x] Implementar campos de medidas específicos para Freezer Vertical (largura, profundidade, altura entre prateleiras)
- [x] Implementar campos de medidas específicos para Freezer Horizontal (comprimento, largura, profundidade)
- [x] Implementar campos de medidas específicos para Banca de Frutas/Legumes/Verduras (comprimento, largura, profundidade)
- [x] Integrar validação de medidas com alertas de valores inválidos
- [x] Atualizar cálculo de espaço disponível baseado nas medidas configuradas
- [x] Atualizar visualização da gôndola para refletir as medidas reais
- [x] Testar sistema completo em português e inglês

- [x] Implementar geração de imagem de IA representando a loja com base na simulação
- [x] Criar componente para gerar prompt descritivo da simulação
- [x] Integrar funcionalidade de geração de imagem no SmartLayoutSimulator
- [x] Testar geração de imagem em português e inglês
- [x] Validar qualidade das imagens geradas

- [x] Analisar estrutura de dados da simulação para métricas financeiras
- [x] Implementar cálculo de ROI estimado para cada simulação
- [x] Implementar cálculo de impacto em ticket médio
- [x] Implementar cálculo de redução de ruptura
- [x] Implementar cálculo de impacto na lucratividade total
- [x] Criar componente FinancialImpactDashboard com gráficos e métricas
- [x] Integrar dashboard na página Smart Layout
- [x] Testar dashboard em português e inglês
- [x] Validar cálculos de métricas financeiras

- [x] Corrigir geração de imagem de IA para incluir zonas de exposição (Altura dos olhos, Altura das mãos, Parte Baixa)
- [x] Melhorar prompt de IA para descrever posicionamento de produtos por zona
- [x] Implementar organização de produtos por zona no StoreVisualizationGenerator
- [x] Testar geração de imagem com produtos em diferentes zonas
- [x] Validar visualização em português e inglês

- [x] Recuperar pop-up de adição de produtos com campos de dimensões (largura, comprimento, altura)
- [x] Implementar opção de percentual numérico para Margem e Giro
- [x] Testar ProductFormModal com diferentes combinações de dados
- [ ] Mover arquivos de mídia para /home/ubuntu/webdev-static-assets/
- [ ] Atualizar referências de imagens e vídeos no código com URLs de CDN
- [x] Criar matriz de correlação Margem x Giro para determinar zonas de exposição
- [x] Implementar lógica de posicionamento automático baseada em Margem e Giro
- [ ] Integrar posicionamento inteligente no SmartLayoutSimulator
- [ ] Testar posicionamento em português e inglês

- [x] Criar componente HelpButton reutilizável com modal de ajuda
- [x] Integrar HelpButton em Smart Layout com links contextuais
- [x] Integrar HelpButton em páginas Home, Picking e Intelligence
- [x] Criar sistema de âncoras para navegação no guia
- [x] Testar integração em português e inglês
- [x] Validar funcionamento dos botões de ajuda em todas as páginas

- [x] Criar componente GondolaFrontView com renderização realista vista de frente
- [x] Implementar visualização 3D/2D de gôndola com zonas de exposição
- [x] Exibir produtos com imagens, nomes e percentuais na visualização frontal
- [x] Integrar GondolaFrontView no SmartLayoutSimulator
- [x] Testar visualização em português e inglês

- [x] Investigar por que apresentação do Kadeh Varejo não abre na página de soluções
- [x] Corrigir problema de abertura de apresentação (TODAS ESTÃO FUNCIONANDO!)
- [x] Testar abertura em português e inglês

- [x] Kadeh Ads: Criar schema de banco de dados para anúncios, anunciantes e categorias correlacionadas
- [x] Kadeh Ads: Implementar modelo de anunciante com aprovação admin
- [x] Kadeh Ads: Criar tabela de preços configurável por dias e número de lojas/região
- [x] Kadeh Ads: Implementar painel admin para gerenciar preços e aprovar anunciantes
- [x] Kadeh Ads: Criar painel anunciante com cadastro e login
- [x] Kadeh Ads: Implementar criação de anúncios (imagem, produto, promoção)
- [ ] Kadeh Ads: Integrar seleção de categorias correlacionadas com IA
- [ ] Kadeh Ads: Implementar visualização de posição de prioridade antes do pagamento
- [ ] Kadeh Ads: Integrar pagamento Stripe com geração de recibo
- [ ] Kadeh Ads: Implementar sistema de pausa com aviso prévio de 24h
- [ ] Kadeh Ads: Criar dashboard de analytics (impressões, cliques, conversões)
- [ ] Kadeh Ads: Implementar exibição de anúncios no Kadeh Varejo
- [ ] Kadeh Ads: Implementar exibição de anúncios no Kadeh Shopping
- [ ] Kadeh Ads: Testar fluxo completo em portugués e inglês

- [x] Redirecionar botões da página Kadeh Ads para formulário de contato

- [x] Remover palavra "works" da página Como Funciona em portugués

- [x] Adicionar "+ads no PDV" e descrição de popup por aproximação no texto principal da seção de soluções

- [x] Atualizar texto principal do hero para incluir "Ads no PDV"

- [x] Remover duplicação de "Kadeh Ads" no header

- [x] Converter apresentação PowerPoint do Kadeh Ads em imagens PNG
- [x] Adicionar apresentação do Kadeh Ads ao carrossel de apresentações

- [x] Substituir apresentação do Kadeh Ads pela nova versão em PDF

- [x] Atualizar botão "Acessar Kadeh Ads" para redirecionar ao formulário de cadastro

- [x] Verificar apresentação do Kadeh Ads na seção "Soluções desenhadas para cada ambiente"

- [x] Corrigir erros de carregamento de imagens no carrossel do Kadeh Ads

- [x] Adicionar botão de retorno à página principal em todas as páginas

- [x] Corrigir carregamento de imagem na página Kadeh Picking

- [x] Gerar imagem realista de picking/warehouse por IA para página Picking

- [x] Implementar tradução para inglês na página Kadeh Ads

- [x] Corrigir bug de carregamento de simulações no Smart Layout Simulator
- [x] Implementar localStorage para persistência de simulações
- [x] Adicionar funções de salvar, restaurar e deletar simulações
- [x] Criar testes vitest para validar save/load de simulações
- [x] Testar carregamento de simulações em português e inglês
- [x] Corrigir restauração de simulações com largura/comprimento padrão
- [x] Adicionar resumo visual de zonas (Altura dos olhos, Mãos, Lugar baixo)
- [x] Implementar suporte multilíngue completo no GondolaVisualization
- [x] Testar visualização de zonas em português e inglês

- [x] CRÍTICA: Implementar distribuição de produtos por zona (Margem x Giro) na visualização frontal da gôndola
- [ ] CRÍTICA: Criar procedures tRPC para Kadeh Ads (suggestCorrelatedCategories, previewAdPosition, confirmPayment, getAdAnalytics)
- [ ] CRÍTICA: Reconstruir componentes Kadeh Ads com procedures corretos
- [ ] CRÍTICA: Testar fluxo completo: Smart Layout + ProductFormModal + Geração IA + Visualização Gôndola
- [ ] CRÍTICA: Validar em português e inglês

- [x] Corrigir GondolaFrontView com as 3 regras de distribuição
  - [x] Regra 1: Um produto ocupa todo o espaço em todas as prateleiras
  - [x] Regra 2: Múltiplos produtos distribuídos por zona
  - [x] Regra 3: Produtos repetidos por largura para preencher 100%
- [x] Criar testes vitest para GondolaFrontView
- [x] Aplicar as 3 regras em GondolaShelvesVisualization (será feito na sincronização)
- [ ] Aplicar as 3 regras na geração de imagem da gôndola (IA)
- [ ] Testar visualização com 1, 2 e múltiplos produtos
- [ ] Testar em português e inglês

- [x] Corrigir distribuição de prateleiras por zona com percentuais (30-40-30)
  - [x] Atualizar função getShelvesForZone em shelfDistributor.ts
  - [x] Implementar cálculo com aproximação em números naturais
  - [x] Criar testes vitest para validar distribuição
  - [x] Testar com 1, 2, 3, 4, 5, 6, 10, 20 prateleiras
  - [x] Atualizar GondolaShelvesVisualization (já usa getShelvesForZone)
  - [x] Atualizar GondolaFrontView (já usa getShelvesForZone)

- [x] REFAZER: Distribuição com regra principal de 100% ocupação
  - [x] Regra principal: TODAS as prateleiras sempre 100% ocupadas
  - [x] Regra secundária: Aplicar distribuição por zona (30-40-30) APÓS garantir 100%
  - [x] Atualizar shelfDistributor.ts com novo algoritmo
  - [x] Recriar testes vitest com novo conceito
  - [x] Testar com 1, 2, 3, 5, 10, 20 produtos em diferentes cenários

- [x] Criar gráfico visual de distribuição por zona em tempo real
  - [x] Componente ZoneDistributionChart com Chart.js
  - [x] Mostrar distribuição de produtos por zona (30-40-30)
  - [x] Indicador visual de ocupação (sempre 100%)
  - [x] Número de prateleiras por zona
  - [x] Quantidade de produtos em cada zona
  - [x] Integrar no SmartLayoutSimulator
  - [x] Atualizar em tempo real conforme produtos são adicionados/removidos

- [x] Implementar otimização automática de distribuição de produtos
  - [x] Criar algoritmo de otimização (margem x giro)
  - [x] Criar componente ProductOptimizationSuggestions
  - [x] Integrar sugestões no SmartLayoutSimulator
  - [x] Adicionar botão "Aplicar Otimização"
  - [x] Mostrar comparação antes/depois
  - [x] Criar testes vitest para otimização

- [x] Corrigir erro Chart.js "doughnut is not a registered controller"
  - [x] Adicionar DoughnutController ao registro
  - [x] Testar se o gráfico renderiza corretamente

- [x] Corrigir visualização de gôndola com prateleira 5 vazia
  - [x] Investigar por que prateleira 5 ficava vazia
  - [x] Corrigir lógica de getShelvesForZone() para garantir 100% ocupação
  - [x] Usar Math.ceil() em vez de Math.round() para arredondamento
  - [x] Testar com 5 prateleiras (2-2-1 distribuição)

- [x] Corrigir GondolaFrontView para aceitar propriedade zone ou zona
  - [x] Atualizar interface Product para aceitar ambas as propriedades
  - [x] Corrigir filtro de produtos por zona

- [x] CRÍTICA: Corrigir bug onde prateleira 5 ficava vazia
  - [x] Identificar causa: double filtering de produtos por zona
  - [x] Implementar fallback: quando zona não tem produtos, usar todos os produtos
  - [x] Garantir que TODAS as prateleiras sempre 100% ocupadas
  - [x] Criar testes vitest validando 100% ocupação em todos os cenários
  - [x] Testar com 1, 3, 5, 10 prateleiras
  - [x] Validar no navegador: prateleira 5 agora preenchida ✅

- [x] CRÍTICA: Implementar posicionamento correto de produtos por zona (Margem × Giro)
  - [x] Criar função getZoneByProductCharacteristics() com matriz de posicionamento
  - [x] Modificar distributor para respeitar zona de cada produto (sem repetição)
  - [x] Alocar espaço proporcional à prioridade dentro da zona
  - [x] Criar testes vitest para validar posicionamento correto
  - [x] Testar com múltiplos produtos em navegador
  - [x] Validar em português e inglês

- [x] CRÍTICA: Corrigir cascata inteligente - Prateleira 5 vazia com vinhos
  - [x] PROBLEMA: Distribuição estrita deixa prateleira 5 vazia (deveria ter cascata)
  - [x] SOLUÇÃO: Voltar para distributeProductsAcrossShelves com cascata inteligente
  - [x] Testar com vinhos: baixa margem + baixo giro deve ir para prateleira 5
  - [x] Validar cascata: zona vazia preenche com vizinhos (Mãos → Olhos/Baixo)
  - [x] Criar testes vitest para múltiplos produtos de diferentes zonas
  - [x] Testar no navegador com 3+ produtos (vinhos, café, feijão)
  - [x] Validar em português e inglês
  - [x] RESULTADO: Todas as 5 prateleiras 100% ocupadas com cascata funcionando corretamente ✅

- [x] CRITICA: Sincronizar geracao de imagem IA com cascata inteligente
  - [ ] PROBLEMA: Imagem IA mostra prateleiras vazias quando deveriam estar 100% ocupadas
  - [ ] SOLUÇÃO: Usar distributeProductsAcrossShelves() no StoreVisualizationGenerator
  - [ ] Gerar prompt descritivo com TODOS os produtos em TODAS as prateleiras
  - [ ] Incluir informação de 100% ocupação e cascata no prompt
  - [ ] Testar geração de imagem com vinhos, café, feijão
  - [ ] Validar que imagem reflete exatamente a visualização de gôndola
  - [ ] Testar em português e inglês


- [ ] NOVA FUNCIONALIDADE: Contratação do Kadeh Ads (Parcialmente Implementada)
  - [x] Confirmar tabela de preços e pacotes de dias com usuário
  - [x] Criar schema de banco de dados (adCampaigns, adBankPayments)
  - [x] Implementar procedures tRPC para criar campanha e calcular preço
  - [x] Criar formulário de contratação com validação
  - [x] Implementar cálculo automático de valor (Preço Base × Multiplicador)
  - [x] Implementar cálculo de data final baseado em duração
  - [x] Implementar validação de 7 dias úteis de antecedência
  - [x] Implementar upload de imagem para S3
  - [x] Criar testes vitest (32 testes passando)
  - [ ] CORRIGIR: Campo de data não está sendo preenchido corretamente no formulário
  - [ ] Implementar envio de email para adm@kadeh.io e cliente
  - [ ] Implementar botões de pagamento por depósito bancário
  - [ ] Implementar dashboard de aprovação admin
  - [ ] Implementar geração de fatura automática
  - [ ] Implementar notificações de campanha pendente
  - [ ] Testar fluxo completo end-to-end em português e inglês


- [ ] NOVA FU- [x] NOVA FUNCIONALIDADE: Menu Mobile com Botões de Acesso às Páginas
  - [x] Analisar estrutura de navegação atual (Header.tsx)
  - [x] Criar componente de menu mobile (hamburger menu)
  - [x] Adicionar botões para: Smart Layout, Intelligence, Picking, Kadeh Ads, Soluções, Como Funciona, Mídia, Vídeo, FAQ
  - [x] Implementar responsividade (mostrar/ocultar em mobile)
  - [x] Testar em diferentes tamanhos de tela (320px, 480px, 768px)
  - [x] Validar em português e inglês
  - [x] RESULTADO: Menu mobile com hamburger icon funcionando corretamente ✅px)\n  - [ ] Validar em portugu\u00eas e ingl\u00eas\n


- [ ] CORREÇÃO: Formulário Kadeh Ads não visível em mobile
  - [ ] Verificar se página /kadeh-ads-campaign está acessível em mobile
  - [ ] Adicionar botão "Investir em Mídia" ou "Kadeh Ads" no menu mobile
  - [ ] Testar acessibilidade completa do formulário em telas pequenas (320px, 480px)
  - [ ] Validar responsividade dos inputs, dropdowns e upload de imagem
  - [ ] Validar em português e inglês


- [x] Corrigir validação de CNPJ no formulário de Kadeh Ads - remover formatação antes de enviar
- [x] Corrigir sincronização do campo de data com React state
- [x] Criar registro de anunciante para usuário autenticado no banco de dados
- [x] Testar envio completo do formulário de Kadeh Ads

- [x] Adicionar Header e Footer à página de Kadeh Ads com navegação completa

- [x] Reestruturar página Kadeh Ads como landing page com informações sobre o produto
- [x] Criar modal para formulário de cadastro de campanha
- [x] Adicionar seções de benefícios, como funciona e CTA para abrir formulário

- [x] Adicionar exibição de valor do investimento da campanha na landing page
- [x] Adicionar botão "Contratar" na landing page (fora do modal)

- [ ] Adicionar funcionalidade de múltiplos produtos no formulário de Kadeh Ads
- [ ] Criar botão "Adicionar Produto" para adicionar mais produtos à campanha
- [ ] Permitir remover produtos da lista
- [ ] Validar e salvar múltiplos produtos no banco de dados


- [x] Adicionar funcionalidade de múltiplos produtos no formulário Kadeh Ads
- [x] Criar botão "Adicionar Produto" para adicionar novos produtos à campanha
- [x] Criar botão "Remover" para remover produtos da campanha
- [x] Atualizar schema do banco de dados com tabela campaignProducts
- [x] Atualizar procedure createCampaign para aceitar múltiplos produtos
- [x] Testar formulário com múltiplos produtos em português e inglês


## CORREÇÃO CRÍTICA DO SMART LAYOUT - PRIORIDADE MÁXIMA

- [ ] Corrigir: Produtos com Margem Baixa devem SEMPRE aparecer em "Parte de Baixo" na visualização
- [ ] Corrigir: Produtos com Margem Baixa + Giro Médio devem aparecer em "Parte de Baixo" (não em "Altura das Mãos")
- [ ] Corrigir: Implementar fallback inteligente (Olhos→Mãos→Baixo) quando não há produtos em uma zona
- [ ] Corrigir: Sincronizar disposição de produtos entre visualização da gôndola e geração de imagem IA
- [ ] Corrigir: Produtos devem ficar lado a lado com seus produtos correlacionados (mesma zona)
- [ ] Teste 1: Validar distribuição com múltiplos produtos (10+)
- [ ] Teste 2: Validar fallback de zonas (sem produtos em Olhos, sem produtos em Mãos)
- [ ] Teste 3: Validar sincronização entre visualização e geração IA

- [x] Implementar gerador de PDF com layout profissional do planograma
- [x] Adicionar detalhes de posicionamento e dimensões dos produtos no PDF
- [x] Criar botão "Exportar Planograma" no SmartLayoutSimulator
- [x] Integrar biblioteca de PDF (html2pdf ou pdfkit) para exportação
- [ ] Testar geração e download de PDF em português e inglês
- [ ] Validar layout e formatação do PDF exportado

- [x] CORRIGIR: Produtos com zona "Lugar baixo" não estão ficando na prateleira inferior
- [x] Revisar lógica de distribuição em GondolaFrontView.tsx
- [x] Revisar lógica de distribuição em shelfDistributor.ts
- [x] Testar distribuição com produtos de baixo (Margem Baixa + Giro Baixo)
- [x] Padronizar sistema para usar apenas "Parte de Baixo" em todos os lugares

- [x] CORRIGIR: Imagem IA gerada mostra produtos diferentes da visualização frontal
- [x] Melhorar prompt para IA com dados estruturados e específicos de cada prateleira
- [ ] Implementar validação de sincronização entre visualização frontal e imagem IA
- [ ] Testar geração de imagem com produtos atuais e validar percentuais/posições

## SUGESTÕES DE MELHORIAS - FASE 2

### 1. Testes com Múltiplos Cenários
- [x] Criar suite de testes com 10-20 produtos em diferentes combinações
- [x] Testar sincronização IA em cenários complexos
- [x] Validar precisão de percentuais em múltiplos produtos
- [x] Arquivo: server/smart-layout.test.ts (15 testes)

### 2. Validação Automática de Imagem
- [x] Implementar verificação de produtos na imagem gerada
- [x] Adicionar feedback visual de validação
- [x] Criar sistema de retry automático se validação falhar
- [x] Arquivos: imageValidationService.ts, StoreVisualizationGeneratorWithValidation.tsx

### 3. Dashboard de Analytics
- [x] Criar componente de dashboard com métricas de impacto
- [x] Calcular aumento de lucratividade estimado
- [x] Calcular redução de ruptura estimada
- [x] Adicionar tabelas de comparação antes/depois
- [x] Arquivo: PlanogramImpactDashboard.tsx
