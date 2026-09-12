import { getSystemSetting, memoryStore, recordAuditLog, query } from '@/lib/db';
import { INITIAL_PRODUCTS } from '@/data/products';
import { detectIntent, BotIntent } from './intents';
import { BOT_TEXTS } from './faq';
import { MYSTIC_TOPICS, searchMysticKnowledge } from './mago_knowledge';

export interface BotProcessInput {
  phone: string;
  message: string;
  customerName?: string;
  provider?: string;
}

export interface BotProcessResponse {
  reply: string | null;
  mode: 'BOT' | 'HUMAN';
  silenced: boolean;
  intent: BotIntent;
  ticketCreated?: boolean;
}

export class GuardiaoEngine {
  /**
   * Processa uma mensagem recebida determinística, sem IA paga
   */
  public static async processMessage(input: BotProcessInput): Promise<BotProcessResponse> {
    const isBotGloballyEnabled = await getSystemSetting<boolean>('BOT_ENABLED', true);

    // 1. Verificação do Botão de Emergência Global do Bot
    if (!isBotGloballyEnabled) {
      return {
        reply: null,
        mode: 'HUMAN',
        silenced: true,
        intent: 'DESCONHECIDO',
      };
    }

    const cleanPhone = input.phone.replace(/\D/g, '');

    // 2. Recupera ou cria a conversa
    let conv = memoryStore.conversations.get(cleanPhone);
    if (!conv) {
      conv = {
        id: `conv-${cleanPhone}`,
        phone: cleanPhone,
        customerName: input.customerName || 'Buscador(a)',
        mode: 'BOT' as 'BOT' | 'HUMAN',
        isSilenced: false,
        lastMessageAt: new Date().toISOString(),
      };
      memoryStore.conversations.set(cleanPhone, conv);
    }

    // 3. REGRA DE OURO DO ATENDIMENTO HUMANO:
    // Se o atendimento está em modo humano ou silenciado, o bot NUNCA responde.
    if (conv.mode === 'HUMAN' || conv.isSilenced) {
      // Registra mensagem do cliente no histórico sem emitir resposta automática do robô
      memoryStore.messages.push({
        conversationId: conv.id,
        direction: 'INBOUND',
        senderType: 'CUSTOMER',
        content: input.message,
        createdAt: new Date().toISOString(),
      });

      return {
        reply: null,
        mode: 'HUMAN',
        silenced: true,
        intent: 'DESCONHECIDO',
      };
    }

    // 4. Detecção de Intenção por Regras e Palavras-chave
    const { intent, extractedValue } = detectIntent(input.message);

    // Registra mensagem de entrada
    memoryStore.messages.push({
      conversationId: conv.id,
      direction: 'INBOUND',
      senderType: 'CUSTOMER',
      content: input.message,
      intentDetected: intent,
      createdAt: new Date().toISOString(),
    });

    let reply = '';
    let ticketCreated = false;

    switch (intent) {
      case 'SAUDACAO':
        reply = BOT_TEXTS.GREETING;
        break;

      case 'MENU':
        reply = BOT_TEXTS.MENU;
        break;

      case 'BUSCA_PRODUTO': {
        if (typeof extractedValue === 'string') {
          const kw = extractedValue.toLowerCase();
          const matched = INITIAL_PRODUCTS.filter(
            (p) =>
              p.name.toLowerCase().includes(kw) ||
              p.categorySlug.toLowerCase().includes(kw) ||
              p.intentions.some((it) => it.toLowerCase().includes(kw))
          ).slice(0, 3);

          if (matched.length > 0) {
            reply = `✨ *Encontrei estes itens mágicos para "${extractedValue}":*\n\n` +
              matched
                .map(
                  (p, i) =>
                    `${i + 1}️⃣ *${p.name}*\n` +
                    `💰 R$ ${p.price.toFixed(2)} (ou R$ ${(p.price * 0.95).toFixed(2)} no PIX)\n` +
                    `🔮 _${p.subtitle}_\n` +
                    `🔗 https://obazardobruxo.com.br/produto/${p.slug}\n`
                )
                .join('\n') +
              `\nDigite o número de outro item ou *menu* para voltar.`;
          } else {
            reply = `🔮 Não encontrei nenhum produto específico com o termo "${extractedValue}".\n\nNossos bruxos recomendam:\n` +
              `• *Drusa de Ametista Natural* (R$ 89,90)\n` +
              `• *Incenso de Sálvia Branca & Lavanda* (R$ 32,90)\n` +
              `• *Caldeirão de Ferro Fundido 500ml* (R$ 129,90)\n\n` +
              `Para ver a loja completa: https://obazardobruxo.com.br\nDigite *menu* para mais opções.`;
          }
        } else {
          reply = `✨ *Destaques do Catálogo de O Bazar do Bruxo:*\n\n` +
            `1️⃣ *Drusa de Ametista Natural* - R$ 89,90\n` +
            `2️⃣ *Quartzo Rosa em Rocha Bruta* - R$ 49,90\n` +
            `3️⃣ *Incenso Sálvia Branca & Lavanda* - R$ 32,90\n` +
            `4️⃣ *Caldeirão Ferro Fundido 500ml* - R$ 129,90\n` +
            `5️⃣ *Kit Altar Sagrado Completo* - R$ 168,00\n\n` +
            `Para explorar tudo: https://obazardobruxo.com.br\nDigite o nome de uma pedra ou erva para buscar!`;
        }
        break;
      }

      case 'RECOMENDACAO_ORCAMENTO': {
        const budget = Number(extractedValue) || 100;
        const affordable = INITIAL_PRODUCTS.filter((p) => p.price <= budget).slice(0, 3);

        if (affordable.length > 0) {
          reply = `🎯 *Sugestões mágicas até R$ ${budget.toFixed(2)}:*\n\n` +
            affordable
              .map(
                (p) =>
                  `✨ *${p.name}* - R$ ${p.price.toFixed(2)}\n` +
                  `_${p.subtitle}_\n` +
                  `🔗 https://obazardobruxo.com.br/produto/${p.slug}\n`
              )
              .join('\n') +
            `\nGostaria de mais opções? Digite outro valor ou *menu*.`;
        } else {
          reply = `Nossas opções mais acessíveis começam a partir de R$ 32,90 (Incenso de Sálvia & Lavanda) e R$ 38,00 (Selenita Branca).\n\nDeseja ver esses produtos? Digite *1*.`;
        }
        break;
      }

      case 'RASTREAMENTO_PEDIDO': {
        if (typeof extractedValue === 'string' && extractedValue.startsWith('OBZ-')) {
          reply = `📦 *Informações do Pedido ${extractedValue}:*\n\n` +
            `Status: *EM PREPARAÇÃO NO ALTAR*\n` +
            `Transportadora: *Correios (Sedex Sagrado)*\n` +
            `Código de Rastreio: *BR889214712BR*\n` +
            `Previsão de Entrega: *3 a 5 dias úteis*\n\n` +
            `Acompanhe a linha do tempo completa em sua conta:\nhttps://obazardobruxo.com.br/minha-conta/pedidos\n\n` +
            `Dúvidas adicionais? Digite *3* para falar com um atendente humano.`;
        } else {
          reply = `📦 *Rastreamento de Pedido:*\n\n` +
            `Por gentileza, informe o *Código do seu Pedido* (exemplo: *OBZ-8899*) ou o *CPF do titular da compra* para que eu possa localizar o status em nossos registros.`;
        }
        break;
      }

      case 'FORMAS_PAGAMENTO':
        reply = BOT_TEXTS.PAYMENT_INFO;
        break;

      case 'PRAZOS_FRETE':
        reply = BOT_TEXTS.SHIPPING_INFO;
        break;

      case 'POLITICA_TROCAS':
        reply = BOT_TEXTS.RETURNS_INFO;
        break;

      case 'FALAR_HUMANO': {
        conv.mode = 'HUMAN';
        conv.isSilenced = true;
        reply = BOT_TEXTS.HUMAN_HANDOFF_SUCCESS;
        ticketCreated = true;

        await this.createSupportTicket({
          phone: cleanPhone,
          reason: 'CLIENT_REQUESTED_HUMAN',
          priority: 'MEDIUM',
          lastUserMessage: input.message,
        });
        break;
      }

      case 'PROBLEMA_FINANCEIRO': {
        conv.mode = 'HUMAN';
        conv.isSilenced = true;
        reply = BOT_TEXTS.FINANCIAL_ISSUE;
        ticketCreated = true;

        await this.createSupportTicket({
          phone: cleanPhone,
          reason: 'FINANCIAL_ISSUE',
          priority: 'URGENT',
          lastUserMessage: input.message,
        });
        break;
      }

      case 'PRODUTO_DANIFICADO': {
        conv.mode = 'HUMAN';
        conv.isSilenced = true;
        reply = BOT_TEXTS.DAMAGED_ITEM;
        ticketCreated = true;

        await this.createSupportTicket({
          phone: cleanPhone,
          reason: 'DAMAGED_OR_WRONG_ITEM',
          priority: 'HIGH',
          lastUserMessage: input.message,
        });
        break;
      }

      case 'RECUPERACAO_CARRINHO':
        reply = BOT_TEXTS.CART_RECOVERY;
        break;

      case 'CONSELHO_MISTICO': {
        const topicId = String(extractedValue || '');
        const topic =
          MYSTIC_TOPICS.find((t) => t.id === topicId) ||
          searchMysticKnowledge(input.message)?.topic;

        if (topic) {
          reply = topic.response;
          if (topic.suggestedItems && topic.suggestedItems.length > 0) {
            reply +=
              `\n\n✨ *Instrumentos Sagrados Recomendados de O Bazar do Bruxo:*\n` +
              topic.suggestedItems
                .map((it) => `• *${it.name}* (R$ ${it.price.toFixed(2)})\n  🔗 https://obazardobruxo.com.br/produto/${it.slug}`)
                .join('\n') +
              `\n\nDeseja saber mais sobre este rito ou conhecer outros amuletos? Pergunte ao Guardião ou digite *menu*!`;
          }
        } else {
          reply = BOT_TEXTS.UNKNOWN;
        }
        break;
      }

      default: {
        // Tenta encontrar conselho místico por aproximação antes de cair na dúvida genérica
        const fallbackMystic = searchMysticKnowledge(input.message);
        if (fallbackMystic) {
          reply = fallbackMystic.topic.response;
          if (fallbackMystic.topic.suggestedItems) {
            reply +=
              `\n\n✨ *Instrumentos Sagrados Recomendados no Bazar:*\n` +
              fallbackMystic.topic.suggestedItems
                .map((it) => `• *${it.name}* (R$ ${it.price.toFixed(2)})\n  🔗 https://obazardobruxo.com.br/produto/${it.slug}`)
                .join('\n');
          }
        } else {
          reply = BOT_TEXTS.UNKNOWN;
        }
        break;
      }
    }

    // Registra mensagem de saída do bot
    memoryStore.messages.push({
      conversationId: conv.id,
      direction: 'OUTBOUND',
      senderType: 'BOT',
      content: reply,
      createdAt: new Date().toISOString(),
    });

    return {
      reply,
      mode: conv.mode,
      silenced: conv.isSilenced,
      intent,
      ticketCreated,
    };
  }

  /**
   * Transfere conversa de volta para o BOT (acionado pelo atendente humano no painel admin)
   */
  public static async resumeBotConversation(phone: string): Promise<boolean> {
    const cleanPhone = phone.replace(/\D/g, '');
    const conv = memoryStore.conversations.get(cleanPhone);
    if (conv) {
      conv.mode = 'BOT';
      conv.isSilenced = false;
      await recordAuditLog({
        eventType: 'BOT_RESUMED_BY_ADMIN',
        targetEntity: 'conversation',
        targetId: conv.id,
        newValue: { phone: cleanPhone, mode: 'BOT' },
      });
      return true;
    }
    return false;
  }

  private static async createSupportTicket(data: {
    phone: string;
    reason: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
    lastUserMessage: string;
  }) {
    const ticket = {
      id: `ticket-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      phone: data.phone,
      reason: data.reason,
      priority: data.priority,
      status: 'OPEN',
      notes: data.lastUserMessage,
      createdAt: new Date().toISOString(),
    };

    memoryStore.tickets.unshift(ticket);

    await recordAuditLog({
      eventType: 'HUMAN_TICKET_CREATED',
      targetEntity: 'ticket',
      targetId: ticket.id,
      newValue: { phone: data.phone, reason: data.reason, priority: data.priority },
    });

    try {
      await query(
        `INSERT INTO human_tickets (reason, priority, status, resolution_notes)
         VALUES ($1, $2, 'OPEN', $3)`,
        [data.reason, data.priority, data.lastUserMessage]
      );
    } catch {
      // Memory store already set
    }
  }
}
