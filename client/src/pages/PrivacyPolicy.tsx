import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Shield, Mail, MapPin, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    id: "quem-somos",
    title: "1. Quem Somos",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>O Aplicativo Kadeh é disponibilizado por:</p>
        <div className="bg-gray-50 rounded-xl p-5 space-y-1 text-sm">
          <p><strong>Razão social:</strong> Kadeh Inovações Inteligentes LTDA</p>
          <p><strong>CNPJ/MF:</strong> 59.572.934/0001-40</p>
          <p><strong>Endereço:</strong> Rua José Jannarelli, nº 75, Conjunto 213, Vila Progredior, São Paulo/SP, CEP 05615-000</p>
          <p><strong>E-mail de privacidade:</strong> <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a></p>
          <p><strong>E-mail do encarregado:</strong> <a href="mailto:dpo@kadeh.io" className="text-blue-600 hover:underline">dpo@kadeh.io</a></p>
          <p><strong>Encarregado (DPO):</strong> George Miguel Pereira Arruda da Costa</p>
        </div>
        <p>Para determinadas atividades, a Kadeh atua como <strong>controladora</strong> de dados pessoais. Em funcionalidades disponibilizadas para shoppings, hospitais, centros empresariais, eventos ou outros ambientes parceiros, a Kadeh também poderá atuar como <strong>operadora</strong> de dados pessoais, realizando o tratamento de acordo com as instruções do gestor do respectivo local.</p>
      </div>
    ),
  },
  {
    id: "aplicacao",
    title: "2. Aplicação desta Política",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Esta Política se aplica às pessoas que utilizam ou interagem com o Aplicativo, incluindo:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Visitantes de shoppings, hospitais, centros comerciais, eventos, empresas e demais ambientes atendidos;</li>
          <li>Usuários cadastrados ou não cadastrados;</li>
          <li>Colaboradores autorizados de ambientes parceiros;</li>
          <li>Pessoas que entram em contato com o suporte da Kadeh; e</li>
          <li>Representantes de parceiros que utilizem funcionalidades do Aplicativo.</li>
        </ul>
        <p>As funcionalidades disponíveis e os dados tratados podem variar de acordo com o local, o sistema operacional, a versão instalada, as configurações do dispositivo e as permissões concedidas pelo usuário.</p>
      </div>
    ),
  },
  {
    id: "resumo",
    title: "3. Resumo das Nossas Práticas",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Em linguagem simples:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>O Aplicativo utiliza dados de localização para orientar o usuário em ambientes internos quando essa funcionalidade estiver ativada;</li>
          <li>O usuário pode gerenciar permissões como localização, câmera, Bluetooth e notificações nas configurações do dispositivo;</li>
          <li>A localização em segundo plano somente será utilizada quando necessária para uma funcionalidade específica, após aviso destacado e autorização do usuário;</li>
          <li><strong>A Kadeh não vende dados pessoais;</strong></li>
          <li>Dados compartilhados com gestores dos locais são, por padrão, agregados ou anonimizados;</li>
          <li>A Kadeh não utiliza localização para publicidade comportamental;</li>
          <li>O usuário pode solicitar acesso, correção ou exclusão dos seus dados;</li>
          <li>Caso o Aplicativo permita a criação de conta, haverá um mecanismo para solicitar sua exclusão; e</li>
          <li>Dúvidas ou solicitações podem ser enviadas para <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a>.</li>
        </ul>
      </div>
    ),
  },
  {
    id: "dados",
    title: "4. Dados Pessoais Tratados",
    content: (
      <div className="space-y-5 text-gray-700">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.1. Dados fornecidos pelo usuário</h4>
          <p className="mb-2">Quando houver cadastro ou criação de conta, poderão ser tratados: nome, endereço de e-mail, número de telefone, foto de perfil (quando adicionada voluntariamente), idioma preferido, credenciais de autenticação, preferências de navegação, locais e rotas marcados como favoritos e preferências de acessibilidade.</p>
          <p>As senhas não serão armazenadas em formato legível.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.2. Dados de atendimento e comunicação</h4>
          <p>Quando o usuário entrar em contato com a Kadeh, poderão ser tratados: nome, informações de contato, conteúdo da solicitação, mensagens enviadas, avaliações e feedbacks, arquivos ou imagens anexados e histórico do atendimento.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.3. Dados de uso e informações técnicas</h4>
          <p>Durante a utilização do Aplicativo, poderão ser coletados automaticamente: telas acessadas, botões utilizados, data e horário de acesso, duração da sessão, rotas iniciadas ou concluídas, eventos de erro, modelo e fabricante do dispositivo, sistema operacional, versão do Aplicativo, endereço IP e identificador da instalação.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.4. Dados de localização</h4>
          <p className="mb-2">Com a autorização correspondente, o Aplicativo poderá tratar localização aproximada ou precisa para: identificar o ponto de partida, posicionar o usuário em mapas internos, traçar e atualizar rotas, informar a chegada ao destino, orientar por voz ou alertas e apresentar pontos de interesse próximos.</p>
          <p className="font-medium text-orange-700">A localização em segundo plano não será utilizada para publicidade, prospecção comercial ou criação de perfis publicitários.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.5. Câmera e QR Codes</h4>
          <p>O Aplicativo poderá solicitar acesso à câmera para: ler QR Codes, identificar placas ou etiquetas de localização, registrar check-in em pontos compatíveis e permitir o envio voluntário de imagens ao suporte. A câmera será acionada somente quando o usuário iniciar uma funcionalidade que dependa dela.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.6. Bluetooth, Wi-Fi e dispositivos próximos</h4>
          <p>Quando necessário e autorizado, o Aplicativo poderá acessar sinais de Bluetooth, Wi-Fi ou dispositivos próximos para melhorar a precisão do posicionamento em ambientes internos. A Kadeh não utiliza essas permissões para acessar o conteúdo das comunicações do usuário.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.7. Notificações</h4>
          <p>Com a permissão do usuário, o Aplicativo poderá enviar notificações sobre: início, continuidade ou conclusão de rotas, alterações de caminho, chegada ao destino, avisos operacionais, atualizações de segurança e comunicações promocionais (quando houver consentimento específico).</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">4.8. Dados pessoais sensíveis</h4>
          <p>Preferências de acessibilidade podem, em determinadas situações, revelar informações relacionadas à saúde ou à condição de deficiência do usuário. Quando uma informação puder ser considerada dado pessoal sensível, a Kadeh adotará salvaguardas adicionais e utilizará uma base legal prevista no artigo 11 da LGPD.</p>
        </div>
      </div>
    ),
  },
  {
    id: "finalidades",
    title: "5. Finalidades e Bases Legais",
    content: (
      <div className="space-y-4 text-gray-700">
        {[
          { title: "5.1. Disponibilizar o Aplicativo e suas funcionalidades", desc: "Inclui cadastro, autenticação, manutenção da sessão, armazenamento de preferências, apresentação de mapas, orientação e navegação.", base: "Execução de contrato e, quando necessário, consentimento." },
          { title: "5.2. Processar localização durante a navegação", desc: "Inclui identificação de posição, cálculo de rotas, atualização do trajeto e identificação da chegada ao destino.", base: "Execução do serviço solicitado e, em funcionalidades opcionais, consentimento específico." },
          { title: "5.3. Disponibilizar recursos de acessibilidade", desc: "Inclui apresentação de caminhos acessíveis e adaptação das rotas às preferências informadas.", base: "Execução do serviço solicitado e, quando forem tratados dados sensíveis, hipóteses do art. 11 da LGPD." },
          { title: "5.4. Prestar atendimento e suporte", desc: "Inclui responder dúvidas, investigar falhas, tratar reclamações e manter histórico de atendimento.", base: "Execução do serviço, legítimo interesse, exercício regular de direitos e cumprimento de obrigação legal." },
          { title: "5.5. Proteger o Aplicativo e prevenir fraudes", desc: "Inclui autenticação, controle de acessos, investigação de atividades suspeitas e proteção da infraestrutura.", base: "Legítimo interesse, cumprimento de obrigação legal e exercício regular de direitos." },
          { title: "5.6. Aprimorar o serviço", desc: "Inclui análise de desempenho, identificação de erros, avaliação de funcionalidades e melhoria de mapas.", base: "Legítimo interesse e consentimento, quando exigido. Sempre que possível, utilizando dados agregados ou anonimizados." },
          { title: "5.7. Gerar estatísticas para ambientes parceiros", desc: "Inclui indicadores de utilização, rotas mais consultadas, fluxo de navegação e mapas de calor.", base: "Legítimo interesse ou execução de contrato. Relatórios fornecidos, por padrão, de forma agregada ou anonimizada." },
          { title: "5.8. Enviar comunicações operacionais", desc: "Inclui alertas de rota, avisos de segurança, alterações relevantes e informações essenciais sobre o serviço.", base: "Execução do serviço solicitado e legítimo interesse." },
          { title: "5.9. Enviar comunicações promocionais", desc: "Inclui novidades, campanhas e ofertas da Kadeh ou de parceiros.", base: "Consentimento. O usuário poderá cancelar essas comunicações a qualquer momento." },
          { title: "5.10. Cumprir obrigações legais", desc: "Inclui atendimento a ordens judiciais, requisições de autoridades competentes e obrigações legais ou regulatórias.", base: "Cumprimento de obrigação legal ou regulatória e exercício regular de direitos." },
        ].map((item, i) => (
          <div key={i} className="border-l-4 border-blue-200 pl-4">
            <h4 className="font-semibold text-gray-900 mb-1">{item.title}</h4>
            <p className="text-sm mb-1">{item.desc}</p>
            <p className="text-sm text-blue-700"><strong>Base legal:</strong> {item.base}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "permissoes",
    title: "6. Permissões e Controles do Usuário",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Dependendo das funcionalidades utilizadas, o Aplicativo poderá solicitar permissões para: localização aproximada, localização precisa, localização em segundo plano, câmera, Bluetooth ou dispositivos próximos, Wi-Fi, notificações e acesso a fotos ou arquivos (quando o usuário escolher enviar um anexo).</p>
        <p>As permissões são solicitadas de forma contextual, próximas ao momento em que a funcionalidade for utilizada.</p>
        <p>O usuário pode negar ou revogar uma permissão nas configurações do dispositivo. A revogação não afeta os tratamentos realizados de forma legítima anteriormente, mas poderá impedir ou limitar o funcionamento de determinadas funcionalidades.</p>
      </div>
    ),
  },
  {
    id: "compartilhamento",
    title: "7. Compartilhamento de Dados",
    content: (
      <div className="space-y-4 text-gray-700">
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-semibold text-green-800">✅ A Kadeh não vende dados pessoais.</p>
        </div>
        <p>Os dados poderão ser compartilhados somente quando necessário, com as seguintes categorias de destinatários:</p>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">7.1. Prestadores de serviços</h4>
          <p>Fornecedores que apoiam a operação do Aplicativo: provedores de infraestrutura e nuvem, serviços de hospedagem, autenticação, notificações, analytics, atendimento, mapas e geolocalização.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">7.2. Gestores dos ambientes parceiros</h4>
          <p>A Kadeh poderá compartilhar estatísticas e relatórios com o gestor do local. Por padrão, o compartilhamento será realizado com dados agregados ou anonimizados.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">7.3. Autoridades públicas</h4>
          <p>Dados poderão ser fornecidos a autoridades quando houver obrigação legal, ordem válida ou necessidade de exercício regular de direitos.</p>
        </div>
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">7.4. Operações societárias</h4>
          <p>Em caso de fusão, aquisição ou reorganização, os dados poderão ser compartilhados com as partes envolvidas, respeitados os princípios da LGPD.</p>
        </div>
      </div>
    ),
  },
  {
    id: "retencao",
    title: "10. Retenção e Eliminação",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Os dados serão mantidos somente pelo tempo necessário para cumprir as finalidades informadas, atender obrigações legais, resolver disputas e exercer direitos.</p>
        <p>A exclusão em sistemas de produção poderá não ser refletida imediatamente em cópias de segurança. Nesses casos, os dados permanecerão protegidos e serão eliminados conforme o ciclo seguro de substituição dos backups.</p>
      </div>
    ),
  },
  {
    id: "exclusao-conta",
    title: "11. Exclusão da Conta",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Caso o Aplicativo permita a criação de conta, o usuário poderá solicitar sua exclusão por meio de:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>No Aplicativo;</li>
          <li>Página externa (<a href="https://www.kadeh.io" className="text-blue-600 hover:underline">www.kadeh.io</a>); ou</li>
          <li>E-mail: <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a>.</li>
        </ul>
        <p>A exclusão da conta não será tratada como mera suspensão ou desativação. Após a confirmação da solicitação, serão eliminados os dados associados à conta que não precisem ser conservados por obrigação legal, segurança, prevenção de fraude ou exercício regular de direitos.</p>
      </div>
    ),
  },
  {
    id: "seguranca",
    title: "12. Segurança da Informação",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>A Kadeh adota medidas técnicas, administrativas e organizacionais compatíveis com a natureza dos dados, incluindo: criptografia das comunicações, proteção dos dados armazenados, controle de acesso baseado no princípio do menor privilégio, registro e monitoramento de acessos, gestão de vulnerabilidades, testes de segurança, cópias de segurança, pseudonimização, minimização de dados e procedimentos de resposta a incidentes.</p>
        <p>Caso ocorra incidente que possa acarretar risco ou dano relevante aos titulares, a Kadeh adotará as providências exigidas pela legislação, incluindo, quando necessário, a comunicação à ANPD e aos titulares afetados.</p>
      </div>
    ),
  },
  {
    id: "direitos",
    title: "13. Direitos dos Titulares",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Nos termos da LGPD, o titular poderá solicitar:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>Confirmação da existência de tratamento;</li>
          <li>Acesso aos dados;</li>
          <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
          <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
          <li>Portabilidade, observada a regulamentação;</li>
          <li>Eliminação dos dados tratados com base no consentimento;</li>
          <li>Informação sobre as entidades com as quais houve compartilhamento;</li>
          <li>Revogação do consentimento;</li>
          <li>Revisão de decisões tomadas unicamente com base em tratamento automatizado; e</li>
          <li>Peticionamento perante a ANPD e os órgãos de defesa do consumidor.</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
          <p className="text-sm"><strong>Canais de contato:</strong></p>
          <p className="text-sm">E-mail: <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a></p>
          <p className="text-sm">Encarregado (DPO): <a href="mailto:dpo@kadeh.io" className="text-blue-600 hover:underline">dpo@kadeh.io</a></p>
        </div>
      </div>
    ),
  },
  {
    id: "criancas",
    title: "15. Crianças e Adolescentes",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>O Aplicativo não é desenvolvido como serviço exclusivamente direcionado a crianças. Contudo, por funcionar em shoppings, hospitais, eventos e outros espaços de circulação pública, poderá ser acessado por crianças ou adolescentes.</p>
        <p>O tratamento de dados pessoais de crianças e adolescentes será realizado em seu melhor interesse, com proteção reforçada e observância da LGPD, do ECA e do Estatuto Digital da Criança e do Adolescente.</p>
        <p>A Kadeh não utilizará dados de crianças ou adolescentes para publicidade comportamental, criação de perfis comerciais ou práticas discriminatórias.</p>
        <p>Caso um pai ou responsável acredite que uma criança forneceu dados pessoais de maneira indevida, poderá solicitar análise e exclusão por meio do e-mail <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a>.</p>
      </div>
    ),
  },
  {
    id: "alteracoes",
    title: "19. Alterações desta Política",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Esta Política poderá ser atualizada para refletir novas funcionalidades, mudanças nas práticas de tratamento, alterações em fornecedores ou SDKs, atualizações de segurança, mudanças legislativas ou regulatórias e orientações das lojas de aplicativos.</p>
        <p>A data da versão mais recente será indicada no início do documento. Alterações relevantes serão comunicadas de forma destacada no Aplicativo ou por outro meio apropriado antes de entrarem em vigor.</p>
      </div>
    ),
  },
  {
    id: "contato",
    title: "22. Contato",
    content: (
      <div className="space-y-3 text-gray-700">
        <p>Dúvidas, solicitações, reclamações ou pedidos relacionados à privacidade e à proteção de dados pessoais poderão ser encaminhados pelos seguintes canais:</p>
        <div className="bg-gray-50 rounded-xl p-5 space-y-1 text-sm">
          <p><strong>Kadeh Inovações Inteligentes LTDA</strong></p>
          <p><strong>CNPJ/MF:</strong> 59.572.934/0001-40</p>
          <p><strong>Endereço:</strong> Rua José Jannarelli, nº 75, Conjunto 213, Vila Progredior, São Paulo/SP, CEP 05615-000</p>
          <p><strong>E-mail de privacidade:</strong> <a href="mailto:privacidade@kadeh.io" className="text-blue-600 hover:underline">privacidade@kadeh.io</a></p>
          <p><strong>E-mail do encarregado:</strong> <a href="mailto:dpo@kadeh.io" className="text-blue-600 hover:underline">dpo@kadeh.io</a></p>
          <p><strong>Encarregado (DPO):</strong> George Miguel Pereira Arruda da Costa</p>
        </div>
      </div>
    ),
  },
];

export default function PrivacyPolicy() {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1a3a5c] to-[#0d2d4a] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacidade e Proteção de Dados
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Política de Privacidade
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Aplicativo Kadeh — Versão 2.0
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-sm text-blue-200">
            <span>📅 Última atualização: 06 de agosto de 2026</span>
            <span>🇧🇷 Conformidade com a LGPD (Lei nº 13.709/2018)</span>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-4 py-10">
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 text-gray-700 leading-relaxed">
          <p className="mb-3">
            Esta Política de Privacidade explica como os dados pessoais são tratados durante o acesso e a utilização do aplicativo móvel Kadeh, incluindo suas funcionalidades de localização, orientação e navegação em ambientes fechados.
          </p>
          <p>
            A Kadeh está comprometida com a privacidade, com a segurança das informações e com o tratamento transparente e responsável de dados pessoais, em conformidade com a <strong>Lei nº 13.709/2018 — LGPD</strong> e com as demais normas aplicáveis.
          </p>
        </div>
      </section>

      {/* Sections accordion */}
      <section className="max-w-4xl mx-auto px-4 pb-16 space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-2xl overflow-hidden">
            <button
              className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
              onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
            >
              <span className="text-base">{section.title}</span>
              {openSection === section.id
                ? <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                : <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
              }
            </button>
            {openSection === section.id && (
              <div className="px-6 pb-6 border-t border-gray-100 pt-4 text-sm leading-relaxed">
                {section.content}
              </div>
            )}
          </div>
        ))}
      </section>

      {/* Contact CTA */}
      <section className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dúvidas sobre privacidade?</h2>
          <p className="text-gray-600 mb-6">Entre em contato com nosso Encarregado de Dados (DPO):</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:privacidade@kadeh.io"
              className="flex items-center gap-2 bg-[#1a3a5c] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0d2d4a] transition-colors"
            >
              <Mail className="w-4 h-4" />
              privacidade@kadeh.io
            </a>
            <a
              href="mailto:dpo@kadeh.io"
              className="flex items-center gap-2 border-2 border-[#1a3a5c] text-[#1a3a5c] px-6 py-3 rounded-xl font-medium hover:bg-blue-50 transition-colors"
            >
              <Shield className="w-4 h-4" />
              dpo@kadeh.io (DPO)
            </a>
          </div>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            Rua José Jannarelli, nº 75, Conj. 213, Vila Progredior, São Paulo/SP — CEP 05615-000
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
