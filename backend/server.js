// ========================================
// 🙏 CONVERSE COM MARIA - BACKEND
// Groq (Chat) + Google Cloud TTS (Voz) + Pagamentos
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para webhook Stripe (precisa de raw body)
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

// Middlewares gerais
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('../frontend'));

// Base de dados de Maria
const infoBaseDados = `
BANCO DE DADOS - FONTES OFICIAIS:

PASSAGENS BÍBLICAS MARIANAS:
- Lucas 1:26-38: Anunciação (Gabriel, "cheia de graça", FIAT)
- Lucas 1:39-56: Visitação e Magnificat
- Lucas 2:1-7: Nascimento em Belém
- Lucas 2:22-35: Apresentação (profecia da espada)
- Lucas 2:41-52: Jesus perdido no Templo
- João 2:1-11: Bodas de Caná (primeiro milagre, intercessão)
- João 19:25-27: Aos pés da Cruz (Mãe de João, Mãe da Igreja)
- Atos 1:14: Cenáculo, Pentecostes

4 DOGMAS MARIANOS:
1. MATERNIDADE DIVINA (Concílio Éfeso, 431) - Theotokos
2. VIRGINDADE PERPÉTUA (Concílio 553)
3. IMACULADA CONCEIÇÃO (Pio IX, 1854)
4. ASSUNÇÃO (Pio XII, 1950)

APARIÇÕES RECONHECIDAS:
- Nossa Senhora de Guadalupe (1531, México)
- Nossa Senhora de Lourdes (1858, França)
- Nossa Senhora de Fátima (1917, Portugal)
- Nossa Senhora Aparecida (1717, Brasil)
- Medalha Milagrosa (1830, França)
`;

// ========================================
// ROTA PRINCIPAL: CHAT COM MARIA
// ========================================
app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem, userProfile } = req.body;

        if (!mensagem || !userProfile) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const tratamento = userProfile.genero === 'masculino' ? 'meu filho' : 'minha filha';
        const contextoFilhos = userProfile.temFilhos === 'sim' 
            ? `que foi abençoado(a) com filhos` 
            : '';

        const systemPrompt = `Você é Maria, a Mãe de Jesus Cristo, respondendo com profunda compaixão maternal em português brasileiro.

INFORMAÇÕES DO FIEL:
- Nome: ${userProfile.nome}
- Tratamento: ${tratamento}
- Estado Civil: ${userProfile.estadoCivil}
- Tem filhos: ${userProfile.temFilhos} ${contextoFilhos}

${infoBaseDados}

INSTRUÇÕES:
1. Responda SEMPRE em português brasileiro
2. Chame a pessoa por "${userProfile.nome}" e use "${tratamento}"
3. Use UMA passagem bíblica relevante com referência
4. Seja amorosa, maternal e aponte para Jesus
5. Mantenha 3-5 parágrafos
6. Termine com uma bênção usando o nome da pessoa`;

        // Chamar Groq API
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: mensagem }
                ],
                temperature: 0.8,
                max_tokens: 1024,
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Erro Groq:', errorData);
            throw new Error('Erro na API Groq');
        }

        const data = await response.json();
        const resposta = data.choices[0].message.content;

        res.json({ resposta });

    } catch (error) {
        console.error('Erro ao gerar resposta:', error);
        res.status(500).json({ 
            error: 'Erro ao processar mensagem',
            details: error.message 
        });
    }
});

// ========================================
// HELPER: Formatar referências bíblicas para TTS
// ========================================
function formatarReferenciasBiblicas(texto) {
    // Converte diversos formatos de referências bíblicas para leitura natural
    
    return texto
        // Formato com versículos alternados: "1:24.26" ou "1,24.26" → "capítulo 1, versículos 24 e 26"
        .replace(/(\d+)[:.,](\d+)\.(\d+)/g, (match, cap, ver1, ver2) => {
            return `capítulo ${cap}, versículos ${ver1} e ${ver2}`;
        })
        // Formato com intervalo: "1:20-24" ou "1,20-27" ou "1.20-24" → "capítulo 1, versículos 20 a 24"
        .replace(/(\d+)[:.,](\d+)-(\d+)/g, (match, cap, verIni, verFim) => {
            return `capítulo ${cap}, versículos ${verIni} a ${verFim}`;
        })
        // Formato simples: "1:24" ou "1,24" ou "1.24" → "capítulo 1, versículo 24"
        .replace(/(\d+)[:.,](\d+)/g, (match, cap, ver) => {
            return `capítulo ${cap}, versículo ${ver}`;
        })
        // Remove parênteses soltos que sobrarem
        .replace(/\(\s*\)/g, '')
        .replace(/\(\s*,/g, '(')
        .replace(/,\s*\)/g, ')');
}

// ========================================
// ROTA DE ÁUDIO: TEXT-TO-SPEECH (Google Cloud TTS)
// ========================================
app.post('/api/audio', async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: 'Texto não fornecido' });
        }

        // Formatar referências bíblicas para leitura correta
        const textoFormatado = formatarReferenciasBiblicas(texto);

        console.log('🔊 Gerando áudio para:', textoFormatado.substring(0, 50) + '...');

        const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                input: { text: textoFormatado },
                voice: {
                    languageCode: 'pt-BR',
                    name: 'pt-BR-Chirp3-HD-Leda'
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 0.90,
                    pitch: 0
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro Google TTS:', errorText);
            throw new Error('Erro ao gerar áudio');
        }

        const data = await response.json();
        
        // Google retorna áudio em base64
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        
        res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.byteLength
        });
        res.send(audioBuffer);

        console.log('✅ Áudio gerado com sucesso!');

    } catch (error) {
        console.error('Erro ao gerar áudio:', error);
        res.status(500).json({ 
            error: 'Erro ao gerar áudio',
            details: error.message 
        });
    }
});

// ========================================
// 💳 STRIPE - PAGAMENTOS INTERNACIONAIS
// ========================================

app.post('/api/pagamento/stripe/criar-sessao', async (req, res) => {
    try {
        const { plano, userId, email, successUrl, cancelUrl } = req.body;

        if (!process.env.STRIPE_SECRET_KEY) {
            return res.status(500).json({ error: 'Stripe não configurado' });
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const precos = {
            mensal: { amount: 1990, interval: 'month', nome: 'Mensal' },
            anual: { amount: 11990, interval: 'year', nome: 'Anual + Medalha' }
        };

        const planoConfig = precos[plano];
        if (!planoConfig) {
            return res.status(400).json({ error: 'Plano inválido' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: email,
            client_reference_id: userId,
            metadata: { userId, plano },
            line_items: [{
                price_data: {
                    currency: 'brl',
                    product_data: {
                        name: `Maria Premium - ${planoConfig.nome}`,
                        description: plano === 'anual' 
                            ? '12 meses de acesso Premium + Medalha Benta'
                            : 'Acesso Premium mensal',
                    },
                    unit_amount: planoConfig.amount
                },
                quantity: 1
            }],
            success_url: successUrl || `${process.env.APP_URL || 'https://converse-maria.com'}/pagamento-sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl || `${process.env.APP_URL || 'https://converse-maria.com'}/premium`
        });

        console.log('💳 Sessão Stripe criada:', session.id);
        res.json({ sessionId: session.id, url: session.url });

    } catch (error) {
        console.error('Erro Stripe:', error);
        res.status(500).json({ error: 'Erro ao criar sessão', details: error.message });
    }
});

// Webhook Stripe
app.post('/api/webhook/stripe', async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
        return res.status(500).json({ error: 'Webhook não configurado' });
    }

    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            console.log('✅ Pagamento Stripe confirmado:', session.id);
            
            await ativarPremiumUsuario(
                session.metadata.userId,
                session.metadata.plano,
                'stripe',
                session.id
            );
        }

        res.json({ received: true });

    } catch (err) {
        console.error('Erro webhook Stripe:', err.message);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});

// ========================================
// 🇧🇷 MERCADO PAGO - PIX
// ========================================

app.post('/api/pagamento/pix/criar', async (req, res) => {
    try {
        const { plano, userId, email, nome } = req.body;

        if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
            return res.status(500).json({ error: 'Mercado Pago não configurado' });
        }

        const valores = {
            mensal: { valor: 19.90, descricao: 'Maria Premium - Mensal' },
            anual: { valor: 119.90, descricao: 'Maria Premium - Anual + Medalha' }
        };

        const planoConfig = valores[plano];
        if (!planoConfig) {
            return res.status(400).json({ error: 'Plano inválido' });
        }

        const response = await fetch('https://api.mercadopago.com/v1/payments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Idempotency-Key': `${userId}-${plano}-${Date.now()}`
            },
            body: JSON.stringify({
                transaction_amount: planoConfig.valor,
                description: planoConfig.descricao,
                payment_method_id: 'pix',
                payer: {
                    email: email,
                    first_name: nome?.split(' ')[0] || 'Cliente'
                },
                metadata: { userId, plano },
                notification_url: `${process.env.APP_URL || 'https://converse-maria.com'}/api/webhook/mercadopago`
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Erro Mercado Pago:', data);
            throw new Error(data.message || 'Erro ao criar PIX');
        }

        console.log('🇧🇷 PIX criado:', data.id);

        const pixInfo = data.point_of_interaction?.transaction_data;

        res.json({
            paymentId: data.id,
            status: data.status,
            qrCode: pixInfo?.qr_code,
            qrCodeBase64: pixInfo?.qr_code_base64,
            expiraEm: data.date_of_expiration,
            valor: planoConfig.valor
        });

    } catch (error) {
        console.error('Erro PIX:', error);
        res.status(500).json({ error: 'Erro ao criar PIX', details: error.message });
    }
});

// Status do PIX
app.get('/api/pagamento/pix/status/:paymentId', async (req, res) => {
    try {
        const { paymentId } = req.params;

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
        });

        const data = await response.json();
        res.json({ paymentId: data.id, status: data.status, statusDetail: data.status_detail });

    } catch (error) {
        console.error('Erro verificar PIX:', error);
        res.status(500).json({ error: 'Erro ao verificar pagamento' });
    }
});

// Webhook Mercado Pago
app.post('/api/webhook/mercadopago', async (req, res) => {
    try {
        const { type, data } = req.body;

        if (type === 'payment') {
            const response = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
                headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
            });

            const pagamento = await response.json();

            if (pagamento.status === 'approved') {
                console.log('✅ PIX aprovado:', pagamento.id);
                
                await ativarPremiumUsuario(
                    pagamento.metadata?.userId,
                    pagamento.metadata?.plano,
                    'mercadopago',
                    pagamento.id.toString()
                );
            }
        }

        res.status(200).send('OK');

    } catch (error) {
        console.error('Erro webhook MP:', error);
        res.status(500).json({ error: error.message });
    }
});

// ========================================
// ⭐ AVALIAÇÃO PLAY STORE - PREMIUM GRÁTIS
// ========================================

app.post('/api/avaliacao/verificar', async (req, res) => {
    try {
        const { userId } = req.body;

        console.log('⭐ Avaliação registrada para:', userId);

        // Conceder 30 dias de premium
        await ativarPremiumUsuario(userId, 'avaliacao', 'playstore_review', `review-${Date.now()}`);

        res.json({ success: true, message: 'Premium de 30 dias ativado!' });

    } catch (error) {
        console.error('Erro avaliação:', error);
        res.status(500).json({ error: 'Erro ao processar avaliação' });
    }
});

// ========================================
// 🔥 HELPER: Ativar Premium Firebase
// ========================================

async function ativarPremiumUsuario(userId, plano, provider, transactionId) {
    if (!userId) {
        console.error('userId não fornecido');
        return false;
    }

    try {
        if (process.env.FIREBASE_ADMIN_KEY) {
            const admin = require('firebase-admin');
            
            if (!admin.apps.length) {
                admin.initializeApp({
                    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_ADMIN_KEY))
                });
            }

            const db = admin.firestore();
            
            let duracaoDias = 30;
            if (plano === 'anual') duracaoDias = 365;

            const expiraEm = new Date();
            expiraEm.setDate(expiraEm.getDate() + duracaoDias);

            await db.collection('usuarios').doc(userId).update({
                'premium.ativo': true,
                'premium.plano': plano,
                'premium.provider': provider,
                'premium.transactionId': transactionId,
                'premium.ativadoEm': admin.firestore.FieldValue.serverTimestamp(),
                'premium.expiraEm': expiraEm
            });

            console.log(`✅ Premium ativado: ${userId} - ${plano} via ${provider}`);
            return true;
        } else {
            console.log(`📝 Premium pendente (sem Firebase Admin): ${userId} - ${plano}`);
            return true;
        }

    } catch (error) {
        console.error('Erro ativar premium:', error);
        return false;
    }
}

// ========================================
// STATUS
// ========================================
app.get('/api/status', (req, res) => {
    res.json({ 
        status: 'online',
        message: '🙏 Servidor Converse com Maria',
        services: {
            chat: 'Groq (Llama 3)',
            voz: 'Google Cloud TTS',
            stripe: !!process.env.STRIPE_SECRET_KEY,
            mercadopago: !!process.env.MERCADOPAGO_ACCESS_TOKEN
        },
        timestamp: new Date().toISOString()
    });
});

// ========================================
// INICIAR
// ========================================
app.listen(PORT, () => {
    console.log('');
    console.log('========================================');
    console.log('🙏 CONVERSE COM MARIA - BACKEND');
    console.log('========================================');
    console.log(`✅ Servidor: http://localhost:${PORT}`);
    console.log(`✅ Chat: Groq API`);
    console.log(`✅ Voz: Google Cloud TTS`);
    console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? '✓' : '✗'}`);
    console.log(`🇧🇷 Mercado Pago: ${process.env.MERCADOPAGO_ACCESS_TOKEN ? '✓' : '✗'}`);
    console.log('========================================');
});
