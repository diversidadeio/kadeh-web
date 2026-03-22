# Configuração de Envio de Emails - Kadeh Ads

## Visão Geral

O sistema de Kadeh Ads foi configurado para enviar emails de confirmação de pagamento automaticamente para:
- **Cliente**: Confirmação de pagamento e ativação da campanha
- **Administrador** (adm@kadeh.io): Notificação de nova campanha paga

## Status Atual

O serviço está funcionando em **modo de teste** usando o Ethereal Email (serviço de teste gratuito). Os emails são criados e registrados no console, mas não são entregues a endereços reais.

## Como Configurar para Produção

Para ativar o envio real de emails, você precisa configurar as credenciais SMTP. Existem várias opções:

### Opção 1: Gmail (Recomendado para Pequenos Volumes)

1. **Criar uma Conta Google** (se não tiver)
2. **Ativar 2FA** na sua conta Google
3. **Gerar Senha de App**:
   - Acesse: https://myaccount.google.com/apppasswords
   - Selecione "Mail" e "Windows Computer" (ou seu dispositivo)
   - Copie a senha gerada

4. **Configurar as Variáveis de Ambiente**:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=seu-email@gmail.com
   SMTP_PASS=sua-senha-de-app
   SMTP_FROM=seu-email@gmail.com
   SMTP_SECURE=false
   ```

### Opção 2: SendGrid (Recomendado para Produção)

1. **Criar Conta em SendGrid**: https://sendgrid.com
2. **Gerar API Key**:
   - Acesse Settings → API Keys
   - Crie uma nova API Key

3. **Configurar as Variáveis de Ambiente**:
   ```
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASS=sua-api-key-do-sendgrid
   SMTP_FROM=seu-email@seu-dominio.com
   SMTP_SECURE=false
   ```

### Opção 3: AWS SES (Recomendado para Alto Volume)

1. **Criar Conta AWS** (se não tiver)
2. **Configurar SES**:
   - Acesse AWS SES Console
   - Verifique seu domínio ou email
   - Gere credenciais SMTP

3. **Configurar as Variáveis de Ambiente**:
   ```
   SMTP_HOST=email-smtp.us-east-1.amazonaws.com (ou sua região)
   SMTP_PORT=587
   SMTP_USER=sua-chave-de-acesso-SMTP
   SMTP_PASS=sua-senha-SMTP
   SMTP_FROM=seu-email@seu-dominio.com
   SMTP_SECURE=false
   ```

### Opção 4: Outro Provedor SMTP

Qualquer provedor SMTP funciona. Você precisará de:
- Host SMTP
- Porta (geralmente 587 para TLS ou 465 para SSL)
- Usuário/Email
- Senha/Token
- Email de origem

## Configurando as Variáveis de Ambiente

### Via Painel de Administração (Recomendado)

1. Acesse o painel de gerenciamento do projeto
2. Vá para Settings → Secrets
3. Adicione as seguintes variáveis:
   - `SMTP_HOST`
   - `SMTP_PORT`
   - `SMTP_USER`
   - `SMTP_PASS`
   - `SMTP_FROM`
   - `SMTP_SECURE`

### Via Arquivo .env (Desenvolvimento Local)

Crie um arquivo `.env` na raiz do projeto:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-senha-de-app
SMTP_FROM=seu-email@gmail.com
SMTP_SECURE=false
```

## Testando a Configuração

### Em Modo de Teste (Ethereal)

O sistema registra os links dos emails de teste no console. Procure por mensagens como:

```
[Email] Confirmação enviada para cliente: cliente@empresa.com
[Email] Notificação enviada para administrador
```

Os links dos emails de teste aparecem no console e podem ser abertos em um navegador.

### Em Produção

Após configurar as credenciais SMTP:

1. Acesse a página de Kadeh Ads
2. Complete um pagamento de teste
3. Verifique se os emails foram recebidos nos endereços configurados

## Fluxo de Envio de Emails

Quando um pagamento é confirmado no Stripe:

1. **Webhook do Stripe** é acionado com evento `checkout.session.completed`
2. **Status da campanha** é atualizado para "active" no banco de dados
3. **Email para o cliente** é enviado com detalhes da campanha
4. **Email para o administrador** é enviado com notificação de nova campanha
5. **Notificação interna** é registrada no sistema

## Troubleshooting

### "SMTP credentials not configured"

Isso é normal em modo de teste. O sistema está usando Ethereal Email para teste. Configure as credenciais SMTP para enviar emails reais.

### Emails não são recebidos

1. Verifique se as credenciais SMTP estão corretas
2. Verifique os logs do servidor para mensagens de erro
3. Verifique a pasta de spam do email de destino
4. Certifique-se de que o firewall permite conexões SMTP na porta configurada

### Erro de autenticação

1. Verifique se o usuário e senha estão corretos
2. Para Gmail, certifique-se de usar a senha de app (não a senha da conta)
3. Verifique se 2FA está ativado (para Gmail)

## Variáveis de Ambiente Disponíveis

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `SMTP_HOST` | Host do servidor SMTP | `smtp.gmail.com` |
| `SMTP_PORT` | Porta SMTP | `587` |
| `SMTP_USER` | Usuário para autenticação | `seu-email@gmail.com` |
| `SMTP_PASS` | Senha para autenticação | `sua-senha-de-app` |
| `SMTP_FROM` | Email de origem | `noreply@kadeh.io` |
| `SMTP_SECURE` | Usar SSL/TLS | `false` (587) ou `true` (465) |

## Segurança

- **Nunca** compartilhe suas credenciais SMTP
- **Sempre** use variáveis de ambiente para armazenar credenciais
- **Não** commit `.env` no repositório (já está em `.gitignore`)
- Use senhas de app em vez de senhas de conta quando possível

## Suporte

Para mais informações sobre configuração de SMTP, consulte:
- [Documentação do Nodemailer](https://nodemailer.com/)
- [Guia de SMTP do Gmail](https://support.google.com/mail/answer/7126229)
- [Documentação do SendGrid](https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api)
