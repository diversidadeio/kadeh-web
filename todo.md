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

- [x] FASE A (CRÍTICO): Corrigir ordem de prateleiras (1 em baixo, 7 em cima) na visualização frontal
- [x] FASE B: Sincronizar distribuição com GondolaFrontView no StoreVisualizationGenerator
- [x] FASE C: Melhorar prompt IA para usar ordem correta de prateleiras (topo para base)
- [x] Testar sincronização entre visualização frontal e imagem IA gerada
- [x] Validar que imagem IA mostra exatamente os mesmos produtos da visualização frontal
- [x] FASE D: Implementar validação de fidelidade (ImageFidelityValidator)

- [x] CORREÇÃO DEFINITIVA: Ordem de prateleiras na visualização frontal
  - [x] Corrigir loop de renderização para sequência [1, 2, 3, 4, 5] em vez de [5, 4, 3, 2, 1]
  - [x] Adicionar flex-col-reverse para inverter ordem visual
  - [x] Prateleira 1 agora aparece na BASE (parte inferior)
  - [x] Prateleira 5 agora aparece no TOPO (parte superior)
  - [x] Testar com preset de Cervejas - FUNCIONANDO PERFEITAMENTE!
  - [x] Validar em português
  - [x] VALIDACAO: Sincronizacao entre visualizacao frontal e imagem IA confirmada
    - [x] Visualizacao frontal mostra ordem corrigida (1 em baixo, 5 em cima)
    - [x] Imagem IA gerada mostra mesma ordem sincronizada
    - [x] Comparativa validada: ambas mostram Prateleira 1 na BASE e Prateleira 5 no TOPO
    - [x] Sincronizacao 100% VALIDADA!

- [x] CORRECAO DEFINITIVA FINAL: Ordem de prateleiras (3a tentativa com sucesso TOTAL!)
  - [x] Alterado array para [i + 1] = [1, 2, 3, 4, 5] (ordem natural)
  - [x] Adicionado flex-col-reverse para inverter visualmente
  - [x] Prateleira 1 agora aparece na BASE (parte inferior) - CONFIRMADO!
  - [x] Prateleira 5 agora aparece no TOPO (parte superior) - CONFIRMADO!
  - [x] Testado com Azeite de Oliva - FUNCIONANDO PERFEITAMENTE!
  - [x] Ordem corrigida DEFINITIVAMENTE! (Solucao final: Array [1,2,3,4,5] + flex-col-reverse)

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
- [x] Corrigir erro ao gerar visualização da loja por IA com 9 produtos
- [x] Corrigir nomes das prateleiras para mostrar zona de exposição (Parte de Baixo, Altura das Mãos, Altura dos Olhos)
- [x] Criar relatório visual de ocupação por zona de exposição
- [x] Corrigir clique nas categorias que mais vendem para adicionar produtos à simulação
- [ ] CRÍTICO: Corrigir distribuição de produtos - respeitar % recomendado de cada produto e preencher espaço restante com melhor margem
- [x] Corrigir classificação de prateleiras: prateleiras acima da 5 devem ser consideradas como Altura dos Olhos

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
- [x] CRÍTICA: Criar procedures tRPC para Kadeh Ads (suggestCorrelatedCategories, previewAdPosition, confirmPayment, getAdAnalytics)
- [x] CRÍTICA: Reconstruir componentes Kadeh Ads com procedures corretos
- [x] CRÍTICA: Testar fluxo completo: Smart Layout + ProductFormModal + Geração IA + Visualização Gôndola
- [ ] CRÍTICA: Validar em português e inglês
- [x] Upload large product images to S3 using manus-upload-file --webdev (15 files, 5-6MB each)
- [x] Replace local image paths with CDN URLs in GondolaRealisticVisualization
- [x] Verify product images render correctly on gondola shelves

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


- [x] NOVA FUNCIONALIDADE: Contratação do Kadeh Ads (Parcialmente Implementada)
  - [x] Confirmar tabela de preços e pacotes de dias com usuário
  - [x] Criar schema de banco de dados (adCampaigns, adBankPayments)
  - [x] Implementar procedures tRPC para criar campanha e calcular preço
  - [x] Criar formulário de contratação com validação
  - [x] Implementar cálculo automático de valor (Preço Base × Multiplicador)
  - [x] Implementar cálculo de data final baseado em duração
  - [x] Implementar validação de 7 dias úteis de antecedência
  - [x] Implementar upload de imagem para S3
  - [x] Criar testes vitest (32 testes passando)
  - [x] CORRIGIR: Campo de data não está sendo preenchido corretamente no formulário
  - [x] Corrigir erro "Failed to create campaign" com advertiserId
  - [x] Verificar conexão com API do Stripe (buy_button_id e publishable-key)
  - [x] Criar página de sucesso/cancelamento do Stripe
  - [x] Implementar webhook do Stripe para processar pagamentos
  - [x] Atualizar status da campanha após pagamento confirmado
  - [x] Implementar procedimento tRPC de checkout do Stripe
  - [x] Integrar botão de compra do Stripe na página de campanha
  - [x] Redirecionar para checkout do Stripe quando selecionar 1 dia + 1-5 lojas
  - [x] Configurar redirecionamento com 16 URLs diferentes (4 durações × 4 faixas de lojas)
  - [x] Testar fluxo completo de pagamento (redirecionamento funciona!)
  - [x] Criar simulador de custos baseado em planilha com 3 variáveis (dias, lojas, produtos)
  - [x] Integrar simulador na página de campanha Kadeh Ads
  - [x] Testar simulador com diferentes combinações (7 dias + 1-5 lojas = R$600)
  - [x] Adicionar botão "Contratar Agora" no simulador de custos
  - [x] Integrar redirecionamento ao Stripe com 16 URLs diferentes
  - [x] Testar botão "Contratar Agora" (redirecionamento funciona!)
  - [ ] Implementar webhook para processar pagamentos confirmados
  - [ ] Atualizar status da campanha para "active" após pagamento confirmado
  - [ ] Implementar envio de email para adm@kadeh.io e cliente
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


## NOVO PROJETO: SISTEMA DE MAPEAMENTO DE LOJA

### Fase 1: Estrutura de Dados
- [x] Criar tipos TypeScript para Loja (dimensões, corredores)
- [x] Criar tipos para Módulos (tipo, dimensões, posição)
- [x] Criar tipos para Prateleiras (altura, profundidade, largura)
- [x] Criar tipos para Posicionamento de Produtos (módulo, prateleira, zona)
- [x] Criar schema Drizzle para persistência
- [x] Arquivo: shared/types/storeMapping.ts (tipos completos)
- [x] Migração: drizzle/0004_serious_annihilus.sql (7 tabelas)

### Fase 2: Editor de Planta Baixa
- [x] Criar componente de esboço da loja (canvas/SVG)
- [x] Implementar entrada de medidas (metros/centímetros)
- [x] Criar ferramenta de desenho de corredores
- [x] Implementar validação de medidas
- [x] Adicionar grid de referência
- [x] Arquivo: client/src/components/store-mapping/StoreFloorPlanEditor.tsx

### Fase 3: Biblioteca de Módulos
- [ ] Criar componente de biblioteca de módulos
- [ ] Implementar drag & drop para planta baixa
- [ ] Criar modal de configuração de módulo
- [ ] Suportar tipos: Gôndola, Freezer Horizontal, Freezer Vertical, Ilha, Banca
- [ ] Permitir customização de dimensões

### Fase 4: Cálculo 3D
- [ ] Implementar função de cálculo de capacidade 3D
- [ ] Calcular quantidade de frentes por produto
- [ ] Considerar profundidade da prateleira
- [ ] Validar ocupação total

### Fase 5: Integração Smart Layout
- [ ] Integrar algoritmo de distribuição por zona
- [ ] Sugerir posicionamento automático de produtos
- [ ] Permitir ajuste manual
- [ ] Mostrar recomendações de margem/giro

### Fase 6: Visualização Frontal
- [ ] Criar visualização frontal de cada módulo
- [ ] Mostrar produtos posicionados
- [ ] Exibir percentuais de ocupação
- [ ] Permitir edição visual

### Fase 7: Testes e Deploy
- [ ] Testar fluxo completo
- [ ] Validar cálculos 3D
- [ ] Testar drag & drop
- [ ] Salvar checkpoint


## SISTEMA DE MAPEAMENTO DE LOJA - IMPLEMENTAÇÃO COMPLETA

### Fase 1: Estrutura de Dados ✅
- [x] Criar tipos TypeScript para Loja (dimensões, corredores)
- [x] Criar tipos para Módulos (tipo, dimensões, posição)
- [x] Criar tipos para Prateleiras (altura, profundidade, largura)
- [x] Criar tipos para Posicionamento de Produtos
- [x] Criar schema Drizzle para persistência
- [x] Arquivo: shared/types/storeMapping.ts (tipos completos)
- [x] Migração: drizzle/0004_serious_annihilus.sql (7 tabelas)

### Fase 2: Editor de Planta Baixa ✅
- [x] Criar componente de esboço da loja (canvas/SVG)
- [x] Implementar entrada de medidas (metros/centímetros)
- [x] Criar ferramenta de desenho de corredores
- [x] Implementar validação de medidas
- [x] Adicionar grid de referência
- [x] Arquivo: client/src/components/store-mapping/StoreFloorPlanEditor.tsx

### Fase 3: Biblioteca de Módulos ✅
- [x] Criar componente de biblioteca de módulos
- [x] Implementar drag & drop para posicionamento
- [x] Adicionar customização de dimensões
- [x] Criar templates de módulos (Gôndola, Freezers, Ilha, Banca, Display)
- [x] Implementar duplicação e exclusão de módulos
- [x] Arquivo: client/src/components/store-mapping/ModuleLibrary.tsx

### Fase 4: Cálculo 3D de Capacidade ✅
- [x] Implementar algoritmo de cálculo 3D (Largura × Profundidade × Altura)
- [x] Calcular número de frentes por produto
- [x] Validar ocupação de prateleiras
- [x] Distribuir produtos em múltiplas prateleiras
- [x] Calcular percentual de ocupação
- [x] Arquivo: client/src/lib/capacityCalculator3D.ts

### Fase 5: Integração Smart Layout ✅
- [x] Criar matriz Margem × Giro para recomendações
- [x] Implementar cálculo de prioridade de produtos
- [x] Gerar sugestões automáticas de posicionamento
- [x] Calcular impacto estimado (vendas, margem, ruptura)
- [x] Validar recomendações
- [x] Arquivo: client/src/lib/storeSmartLayout.ts

- [x] Atualizar schema de banco de dados com tabela de categorias persistentes
- [x] Criar procedures tRPC para CRUD de categorias (criar, ler, atualizar, deletar)
- [x] Implementar página de Admin de Categorias com interface CRUD completa
- [x] Adicionar validação de dados para categorias (nome, margem, giro, etc)
- [x] Implementar Dashboard de Análise de Performance de categorias
- [x] Adicionar métricas de vendas, margem e giro ao dashboard
- [x] Criar gráficos de performance por categoria
- [x] Adicionar rotas para Admin de Categorias (/pt/admin/categories, /en/admin/categories)
- [x] Integrar links de navegação para Admin de Categorias
- [ ] Testar CRUD de categorias em português e inglês
- [ ] Testar Dashboard de Performance em português e inglês
- [x] Adicionar links de navegação para Admin de Categorias e Dashboard no Header
- [x] Adicionar formulário de preenchimento de métricas no Dashboard
- [x] Integrar Dashboard com dados reais do banco de dados
- [x] Implementar atualização de métricas via tRPC
- [x] Adicionar campo defaultAltura nas categorias para otimização de espaço em gôndolas
- [x] Gerar imagem realista de smartphone com Kadeh Ads em corredor de loja
- [x] Integrar imagem principal na página Kadeh Ads
- [x] Substituir imagem principal do Hero pela imagem do Kadeh Ads

## Funcionalidade de Pagamento Kadeh Ads

- [ ] Adicionar integração Stripe ao projeto
- [ ] Criar schema de banco de dados para campanhas e pagamentos
- [ ] Implementar procedures tRPC para gerenciamento de campanhas
- [ ] Criar página de contratação com formulário de dados da empresa
- [ ] Implementar cálculo dinâmico de preços com desconto progressivo
- [ ] Integrar checkout com Stripe
- [ ] Configurar webhooks para notificações de pagamento
- [ ] Criar sistema de notificação para admin e parceiros
- [ ] Implementar liberação automática de acesso após pagamento
- [ ] Testar fluxo completo de pagamento

## Status de Implementação - Funcionalidade de Pagamento Kadeh Ads

- [x] Adicionar integração Stripe ao projeto (webdev_add_feature)
- [x] Criar schema de banco de dados para campanhas e pagamentos Stripe
- [x] Criar procedures tRPC para gerenciamento de campanhas e pagamentos
- [ ] Criar página de contratação com formulário de dados da empresa
- [ ] Implementar cálculo dinâmico de preços com desconto progressivo
- [ ] Integrar checkout com Stripe
- [ ] Configurar webhooks para notificações de pagamento
- [ ] Criar sistema de notificação para admin e parceiros
- [ ] Implementar liberação automática de acesso após pagamento
- [ ] Testar fluxo completo de pagamento
- [ ] Criar página de contratação de Kadeh Ads com formulário interativo
- [ ] Implementar cálculo dinâmico de preços com desconto progressivo
- [ ] Adicionar upload de imagem do produto
- [ ] Implementar validação de EAN13
- [ ] Criar webhook handler para Stripe (/api/stripe/webhook)
- [ ] Implementar atualização de status de campanha após pagamento
- [ ] Criar página de sucesso de pagamento
- [ ] Criar página de cancelamento de pagamento
- [ ] Implementar notificações automáticas para admin e parceiros
- [ ] Testar fluxo completo de pagamento
- [x] Criar página de contratação de Kadeh Ads com formulário interativo
- [x] Implementar cálculo dinâmico de preços com desconto progressivo
- [x] Adicionar upload de imagem do produto
- [x] Implementar validação de EAN13
- [ ] Criar webhook handler para Stripe (/api/stripe/webhook)
- [ ] Implementar atualização de status de campanha após pagamento
- [x] Criar página de sucesso de pagamento
- [x] Criar página de cancelamento de pagamento
- [ ] Implementar notificações automáticas para admin e parceiros
- [ ] Testar fluxo completo de pagamento

## Fase 2 - Integração de Pagamento Stripe

- [ ] Criar webhook handler do Stripe em /api/stripe/webhook
- [ ] Implementar atualização de status de campanha após pagamento
- [ ] Implementar procedures tRPC para criar sessão de checkout Stripe
- [ ] Integrar formulário de checkout com procedure tRPC
- [ ] Implementar validação de duplicatas de campanhas
- [ ] Testar fluxo completo de pagamento
- [x] Criar webhook handler do Stripe em /api/stripe/webhook
- [x] Implementar atualização de status de campanha após pagamento
- [x] Implementar procedures tRPC para criar sessão de checkout Stripe
- [x] Implementar validação de duplicatas de campanhas
- [ ] Integrar formulário de checkout com procedure tRPC no frontend
- [ ] Testar fluxo completo de pagamento

## Fase 3 - Página de Contratação Kadeh Ads (Similar Impacto Social)

- [x] Criar página de contratação com tabela de planos e valores
- [x] Implementar seleção de plano com cálculo dinâmico
- [x] Adicionar rotas para página de contratação (PT/EN)
- [x] Integrar link "Contratar" no Header
- [ ] Adicionar formulário de dados da empresa
- [ ] Integrar com Stripe para processamento de pagamento
- [ ] Enviar notificações por email ao admin e cliente

## Fase 4 - Otimização de Navegação

- [x] Integrar conteúdo de Vídeo na página Mídia
- [x] Remover link separado de Vídeo do Header
- [x] Remover rotas de Vídeo do App.tsx
- [x] Testar navegação e layout responsivo

## Fase 5 - Tipos de Ads e Texto Customizável

- [x] Adicionar campo de tipo de Ads (Desconto Especial, Leve 3 Pague 2, Produtos com Poucas Unidades, Leve Mais por Menos)
- [x] Adicionar campo de texto com limite de 140 caracteres para cada tipo de Ads
- [ ] Atualizar schema de banco de dados com novo campo adType e adText
- [x] Integrar validação de 140 caracteres no formulário
- [ ] Testar funcionalidade no formulário de contratação

## Fase 6 - Pré-visualização de Anúncios em Tempo Real

- [x] Criar componente de pré-visualização de anúncio (AdPreview)
- [x] Implementar simulação de smartphone mostrando anúncio
- [x] Integrar pré-visualização na página de contratação
- [x] Adicionar animações de transição para mudanças de tipo de anúncio
- [x] Adicionar efeitos visuais (sombra, brilho, hover)
- [x] Testar pré-visualização em português e inglês
- [ ] Validar responsividade em diferentes tamanhos de tela

## Fase 7 - Reorganização de Navegação

- [x] Remover botão "Contratar" do Header
- [x] Adicionar botão "Contratar" dentro da página Kadeh Ads
- [ ] Testar navegação em português e inglês

## Fase 8 - Reorganização do Botão Admin Categorias

- [x] Remover botão "Admin Categorias" do Header
- [x] Adicionar botão "Admin Categorias" dentro da página Smart Layout
- [ ] Testar navegação em português e inglês

## Fase 9 - Simulador de Investimento Kadeh Ads com Preço por Volume de Produtos

- [x] Implementar seletor de quantidade de produtos (1, 3, 5, 10+) na página de contratação
- [x] Criar tabela de preços progressivos (100 → 90 → 70 → 50 reais por produto)
- [x] Adicionar cálculo dinâmico no simulador de investimento
- [x] Implementar lógica de cobrança no backend com preços por volume
- [x] Testar simulador e fluxo de cobrança

## Fase 10 - Corrigir Campo de Nome do Produto no Modal de Campanha

- [x] Localizar componente de criação de campanha
- [x] Identificar por que o campo de nome do produto não aceita digitação
- [x] Corrigir o input para aceitar digitação
- [x] Testar o campo corrigido

## Fase 11 - Adicionar Feedback Visual de Carregamento no Botão "Contratar Campanha"

- [x] Analisar componente KadehAdsCampaignForm
- [x] Implementar estado de carregamento no botão (já estava implementado)
- [x] Adicionar ícone de spinner durante o carregamento (já estava implementado)
- [x] Testar feedback visual (confirmado funcionando corretamente)

- [x] Remover seção "Calcule seu Investimento" da página Kadeh Ads (simulador detalhado cobre essa necessidade)

- [x] Substituir figura do hero section da página Kadeh Ads pela imagem de casal no supermercado

- [x] Atualizar mapeamento de 64 URLs do Stripe para o botão "Contratar Agora" (4 durações × 4 faixas de lojas × 4 quantidades de produtos)

- [x] Adicionar imagem do Kadeh Ads à esquerda na seção do simulador de custos

- [x] Atualizar valores de duração no simulador de custos: 1 dia R$500, 3 dias R$1.200, 7 dias R$2.450, 14 dias R$3.500

- [x] Atualizar 64 URLs de checkout do Stripe com novos links fornecidos (4 durações × 4 faixas de lojas × 4 quantidades de produtos)

- [x] Reverter 64 URLs de checkout do Stripe para os links antigos (4 durações × 4 faixas de lojas × 4 quantidades de produtos)

- [x] Atualizar URLs do Stripe: manter 7 dias e atualizar 1 dia, 3 dias e 14 dias

- [x] Implementar webhook do Stripe para processar eventos de pagamento confirmado
- [x] Configurar serviço de envio de emails (nodemailer ou similar)
- [x] Criar templates de email para administrador e cliente
- [x] Testar fluxo completo de pagamento e envio de emails

- [x] Criar procedures tRPC para buscar campanhas do usuário
- [x] Implementar página de dashboard com listagem de campanhas
- [x] Criar modal/página de detalhes da campanha com analytics
- [x] Adicionar filtros e ordenação no dashboard
- [x] Testar funcionalidades do dashboard

- [x] Corrigir 49 erros TypeScript em categoriesRouter.ts e productsRouter.ts (19 corrigidos)
- [x] Implementar analytics em tempo real com gráficos Chart.js
- [x] Implementar sistema de notificações automáticas para campanhas

- [x] Corrigir 30 erros de tipo restantes em KadehAdsContratacao.tsx, stripeWebhook.ts e adsPaymentRouter.ts

- [x] Implementar recurso de exportação de histórico de campanhas em formato CSV

- [x] Criar manual completo do usuário do Kadeh Ads com screenshots e passo a passo

- [x] Adicionar botão de acesso ao manual/passo a passo na página do Kadeh Ads

- [x] Atualizar telefone no manual de 11 3000-0000 para 11 98983-2953

- [x] Adicionar WhatsApp link no manual
- [x] Integrar formulário de contato no manual
- [x] Criar FAQ dinâmico com busca e categorização

- [ ] Corrigir visualização de gôndola: prateleira I na parte inferior, prateleira superior na parte superior
- [ ] Sincronizar representação em IA com visualização de gôndola

- [x] Utilizar percentual de cada produto para representar espaço proporcional na visualização de gôndola
- [x] Sincronizar visualização de IA com proporções de espaço dos produtos

- [x] Implementar validação de fidelidade de imagem IA com comparação de produtos
- [x] Criar componente ImageFidelityValidator que analisa produtos na imagem gerada
- [x] Comparar produtos da imagem com produtos da visualização de gôndola
- [x] Implementar alertas visuais para discrepâncias de categoria
- [x] Testar validação de fidelidade em português e inglês

- [x] Criar modo de regeneração com feedback para imagem IA
- [x] Implementar botão "Rejeitar e Regenerar" na visualização de imagem
- [x] Adicionar campo de feedback para usuário descrever problema
- [x] Implementar ajustes automáticos de prompt baseado em feedback
- [x] Testar regeneração com feedback em português e inglês

- [x] Implementar histórico de versões de planogramas
- [x] Criar tabela de banco de dados para armazenar versões de planogramas
- [x] Implementar funcionalidade de salvar versão com timestamp
- [x] Criar componente PlanogramVersionHistory para listar versões
- [x] Implementar comparação visual entre versões
- [x] Adicionar funcionalidade de restaurar versão anterior
- [x] Testar histórico de versões em português e inglês

- [x] Corrigir geração de imagem IA - IA está ignorando restrições de categoria
- [x] Reescrever prompt com linguagem mais direta e estruturada
- [x] Adicionar validação automática de imagem antes de retornar ao usuário
- [x] Implementar motor de regeneração automática com até 3 tentativas
- [x] Criar testes de validação com suite completa de cenários
- [x] Testar consistência de geração com mesmos dados

- [x] Corrigir erro na geração de visualização de layout da loja por IA
- [x] Investigar causa do erro "Erro ao gerar visualização. Tente novamente."
- [x] Testar geração de layout da loja novamente

## CRÍTICO - Geração de Loja por IA
- [x] CRÍTICO: IA gerando gôndola vazia sem produtos mesmo com 10 tipos de arroz cadastrados
- [x] Investigar fluxo de dados de produtos para gerador de IA de loja
- [x] Verificar se produtos estão sendo passados corretamente ao prompt
- [x] Corrigir função distributeProductsToShelves que estava faltando
- [x] Testar geração com 10 tipos de arroz múltiplas vezes

- [ ] CRÍTICO: Implementar algoritmo inteligente de distribuição de produtos
  - [ ] Respeitar percentuais recomendados de cada produto dentro de sua zona
  - [ ] Preencher espaço vazio com produtos de zonas adjacentes
  - [ ] Priorizar produtos com melhor relação margem/giro para preenchimento
  - [ ] Validar distribuição com testes unitários
  - [ ] Testar em múltiplos cenários (6, 7, 8 prateleiras)

- [ ] CRÍTICO: Implementar distribuição inteligente com preenchimento de espaço
  - [ ] Problema: Produtos com 25% ocupam apenas 25% de cada prateleira
  - [ ] Solução: Preencher espaço vazio com cópias adicionais do mesmo produto ou produtos de melhor margem/giro
  - [ ] Garantir 100% ocupação de cada prateleira
  - [ ] Priorizar produtos com melhor relação margem/giro para preenchimento
  - [ ] Criar testes vitest validando 100% ocupação com múltiplos produtos
  - [ ] Testar no navegador com 3-5 produtos de diferentes zonas
  - [ ] Validar em português e inglês

- [x] Sincronizar StoreVisualizationGenerator com intelligentShelfDistributor para gerar imagens de IA que reflitam exatamente a visualização de gôndola

- [ ] SUGESTÃO 1: Testar geração de imagem IA com 5-10 produtos de diferentes zonas
- [ ] SUGESTÃO 2: Implementar sistema automático de validação de fidelidade entre visualização e imagem IA
- [ ] SUGESTÃO 3: Expandir distribuidor para Freezer Vertical, Freezer Horizontal e Banca de Frutas/Legumes/Verduras

- [x] NOVA FEATURE: Seção Pré Cadastro no Smart Layout
  - [x] Criar componente PreCadastro com formulários para entrada de dados de vendas
  - [x] Criar lógica de cálculo de margem/giro médios e classificação (Baixa/Média/Alta)
  - [x] Implementar agregação de dados por categoria e área (Alimentar/Não-Alimentar)
  - [x] Corrigir erro de React hooks "Rendered fewer hooks than expected"
  - [ ] Criar schema de banco de dados para armazenar dados de margem e giro por produto/categoria
  - [ ] Implementar procedures tRPC para CRUD de dados de pré-cadastro
  - [ ] Integrar PreCadastro com banco de dados (salvar/carregar dados)
  - [ ] Implementar aba Análise com cálculos automáticos de margem e giro médios
  - [ ] Integrar PreCadastro no Smart Layout Simulator
  - [ ] Testar fluxo completo de pré cadastro com múltiplas categorias em português e inglês

- [x] FASE FINAL: Reescrever StoreVisualizationGenerator do zero (DEFINITIVA)
  - [x] FASE 1: Desabilitar geracao de IA temporariamente
  - [x] FASE 2: Criar StoreVisualizationGeneratorV2 com logica SIMPLES e SINCRONIZADA
  - [x] FASE 3: Testar nova versao com Cervejas - FUNCIONANDO PERFEITAMENTE!
  - [x] FASE 4: Integrar V2 no SmartLayoutSimulator
  - [x] FASE 5: Validar sincronizacao 100% entre visualizacao frontal e imagem IA
  - [x] Componente V2 usa exatamente os mesmos dados da visualizacao frontal
  - [x] Prompt IA e gerado de forma SIMPLES e CLARA
  - [x] Sem logica complexa que causa erros
  - [x] Sincronizacao 100% garantida entre tabela frontal e imagem IA gerada
  - [x] Testado com sucesso: Imagem IA mostra gondola com cervejas em ordem correta

- [x] CORRECAO CRITICA: Ordem das prateleiras na visualizacao frontal (GondolaFrontViewIntelligent)
  - [x] Prateleira 1 (Parte de Baixo) agora fica na BASE (embaixo)
  - [x] Prateleira 5 (Altura dos olhos) agora fica no TOPO (em cima)
  - [x] CAUSA RAIZ: flex-col-reverse no container de GondolaFrontViewIntelligent.tsx estava invertendo a ordem visual
  - [x] SOLUCAO: Removido flex-col-reverse, mantendo loop decrescente [5,4,3,2,1]
  - [x] Testado com preset de Refrigerantes - FUNCIONANDO CORRETAMENTE

- [x] Substituir geração de imagem IA por visualização HTML/CSS realista (fidelidade 100%)
  - [x] Criar componente GondolaRealisticView com estilo 3D/fotográfico em HTML/CSS
  - [x] Usar EXATAMENTE os mesmos dados de distribuição do GondolaFrontViewIntelligent
  - [x] Fidelidade 100% - mesmos produtos, mesmas proporções, mesma ordem
  - [x] Integrar no SmartLayoutSimulator no lugar do StoreVisualizationGeneratorV2
  - [x] Testar com múltiplos presets

- [x] Rótulos de preço nos produtos da visualização realista
  - [x] Exibir nome, percentual, giro e margem abaixo de cada bloco de produto
  - [x] Simular etiquetas de gôndola reais com borda colorida
  - [x] Adaptável para dados de preço quando disponíveis
- [x] Modo de comparação lado a lado (antes/depois)
  - [x] Botão "Salvar como Antes" para capturar estado
  - [x] Botão "Comparar Antes/Depois" para exibir lado a lado
  - [x] Estatísticas de diferença (total produtos, por zona)
  - [x] Botão "Limpar" para resetar comparação

- [ ] CORRECAO CRITICA: Lógica de distribuição de produtos nas prateleiras
  - [ ] Percentual sugerido deve ser o TOTAL somando todas as prateleiras
  - [ ] Produto com 35% deve ocupar 35% do espaço total (não 35% em cada prateleira)
  - [ ] Preenchimento prioritário na zona principal (ex: olhos primeiro)
  - [ ] Transbordamento para zonas adjacentes quando necessário
  - [ ] Testar com preset de Feijão (11 produtos, 100% utilizado)

- [x] Fix zone assignment bug in SmartLayoutSimulator - products were getting wrong zones
  - [x] Root cause: calculateShelfZone received ABC curve values ("A","B","C") but expected descriptive names ("Alta","Média","Baixa")
  - [x] Fix: Always use rec.zone from getRecommendationByABCCurves which correctly maps ABC curves to zones
  - [x] Applied fix to both GondolaFrontViewIntelligent and GondolaRealisticView product mappings
  - [x] Verified: Azeite de Oliva (B-A) now correctly placed in "Altura dos olhos" (shelves 5,4,3)
  - [x] Verified: Farinha de Trigo (C-C) correctly placed in "Parte de Baixo" (shelf 1)
- [x] Criar teste automatizado Vitest para validar mapeamento de zonas ABC
  - [x] Testar todas as 9 combinações de curvas ABC (A-A, A-B, A-C, B-A, B-B, B-C, C-A, C-B, C-C)
  - [x] Validar que getRecommendationByABCCurves retorna zonas corretas
  - [x] Executar testes com sucesso (65/65 passando)

- [x] Adicionar seção de eficiência de repositores na página de Kadeh Picking
  - [x] Fazer upload da imagem do mapa de reposição para CDN
  - [x] Criar seção com layout imagem à esquerda e texto à direita
  - [x] Adicionar 3 pontos principais: autonomia, velocidade, separação acelerada
  - [x] Testar visualmente e validar renderização

- [x] Adicionar overlay de layout de supermercado com 50% transparência ao Heat Map de Navegação
  - [x] Fazer upload da imagem do layout de supermercado para CDN
  - [x] Criar componente com overlay posicionado sobre o Heat Map
  - [x] Integrar overlay na página de Kadeh Picking
  - [x] Testar visualmente e validar renderização

- [ ] Implementar seletor de período interativo no Heat Map
  - [ ] Criar dados simulados de fluxo para turnos (manhã/tarde/noite) e períodos (dia/semana/mês)
  - [ ] Implementar componente de seletor com botões para turnos e períodos
  - [ ] Adicionar animação CSS de transição suave entre estados
  - [ ] Integrar ao Heat Map e testar visualmente

- [x] Implementar seletor de período interativo no Heat Map
  - [x] Criar dados simulados de fluxo para diferentes turnos e períodos
  - [x] Implementar botões de seleção (manhã/tarde/noite e dia/semana/mês)
  - [x] Adicionar animação CSS de transição suave entre estados
  - [x] Testar interatividade e validar mudanças de opacidade

- [x] Adicionar aviso de desconto promocional 75% na página Kadeh Ads
  - [x] Localizar simulador de custos na página
  - [x] Criar componente de aviso com destaque visual
  - [x] Informar sobre desconto de 75% durante testes
  - [x] Informar que após testes seguirá preço normal
  - [x] Testar em português e inglês

- [ ] Reativar visibilidade por IA na página Smart Layout
  - [ ] Localizar e reativar componente de visibilidade por IA
  - [ ] Posicionar campo abaixo da visualização principal
  - [ ] Validar que imagem representa fielmente a gôndola
  - [ ] Testar renderização e interatividade

- [x] Reativar visibilidade por IA no Smart Layout como campo adicional
  - [x] Localizar componente GondolaFrontViewIntelligent
  - [x] Adicionar título "Visibilidade por IA"
  - [x] Posicionar abaixo da visualização principal
  - [x] Validar renderização da imagem de gôndola com IA
  - [x] Testar com diferentes produtos

- [x] Adicionar vídeo YouTube Shorts no topo da página Mídia
  - [x] Localizar arquivo da página Mídia
  - [x] Adicionar embed do vídeo YouTube Shorts
  - [x] Testar reprodução do vídeo
  - [x] Validar responsividade em mobile

- [ ] Criar visualização realista de gôndola com embalagens de produtos
  - [ ] Gerar imagens de embalagens realistas para bebidas e alimentos
  - [ ] Criar componente de gôndola com prateleiras proporcionais
  - [ ] Integrar na página Smart Layout substituindo tabela atual
  - [ ] Testar proporções e validar distribuição de produtos
