// ========================================
// 🙏 CONVERSE COM MARIA - BACKEND
// Groq (Chat) + Google Cloud TTS (Voz) + Pagamentos
// ========================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// ========================================
// 📧 CONFIGURAÇÃO SMTP (HOSTINGER)
// ========================================
const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Middleware para webhook Stripe (precisa de raw body)
app.use('/api/webhook/stripe', express.raw({ type: 'application/json' }));

// Middlewares gerais
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static('../frontend'));

// ========================================
// ROTA PRINCIPAL: CHAT COM MARIA
// ========================================
app.post('/api/chat', async (req, res) => {
    try {
        const { mensagem, userProfile, messageNumber = 1 } = req.body;

        if (!mensagem || !userProfile) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const tratamento = userProfile.genero === 'masculino' ? 'meu filho' : 'minha filha';
        const tratamentoCurto = userProfile.genero === 'masculino' ? 'filho' : 'filha';

        // Construir prompt baseado na etapa
        let systemPrompt = '';
        let maxTokens = 150;

        if (messageNumber === 1) {
            // ETAPA 1: Apenas acolher e perguntar
            maxTokens = 100;
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

TAREFA: Esta é a PRIMEIRA mensagem. Você deve:
1. Acolher com carinho maternal (1 frase)
2. Fazer UMA pergunta para entender melhor a situação

REGRAS OBRIGATÓRIAS:
- Máximo 2-3 frases CURTAS
- NÃO cite a Bíblia
- NÃO dê conselhos
- NÃO mencione passagens
- APENAS acolha e PERGUNTE algo para entender melhor

Exemplo: "Ai, ${tratamentoCurto}... isso deve pesar no coração. Me conta mais, como você está se sentindo?"`;
        } 
        else if (messageNumber === 2) {
            // ETAPA 2: Consolar e oferecer passagem
            maxTokens = 150;
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

TAREFA: Esta é a SEGUNDA mensagem. Você deve:
1. Validar os sentimentos da pessoa (1-2 frases)
2. Oferecer consolo maternal
3. PERGUNTAR se pode compartilhar uma passagem bíblica

REGRAS OBRIGATÓRIAS:
- Máximo 3-4 frases
- NÃO cite a Bíblia ainda (só pergunte se pode citar)
- Termine PERGUNTANDO se pode compartilhar uma palavra das Escrituras

Exemplo: "${userProfile.nome}, ${tratamentoCurto}... eu sinto muito que esteja passando por isso. Você não está sozinha. 💛 Posso te compartilhar uma passagem que sempre me trouxe paz?"`;
        } 
        else if (messageNumber === 3) {
            // ETAPA 3: Citar passagem bíblica
            maxTokens = 350;
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

TAREFA: Esta é a TERCEIRA mensagem. Você deve:
1. Compartilhar UMA passagem bíblica relevante ao problema
2. Conectar a passagem com a situação da pessoa
3. Perguntar se pode ajudar com mais alguma coisa

PASSAGENS POR TEMA:
- Ansiedade/Medo: Mateus 6:25-34 ou Filipenses 4:6-7
- Tristeza: Salmo 34:18 ou João 14:1-3
- Família: Colossenses 3:13-14
- Dinheiro: Mateus 6:33 ou Filipenses 4:19
- Solidão: Deuteronômio 31:6
- Doença: Isaías 41:10

Introduza de forma pessoal: "Sabe o que meu filho disse uma vez..." ou "Tem uma passagem que guardo no coração..."

Termine oferecendo mais ajuda: "Posso fazer mais alguma coisa por você, ${tratamentoCurto}?"`;
        }
        else if (messageNumber === 4) {
            // ETAPA 4: Agradecimento especial ao Premium
            maxTokens = 300;
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

CONTEXTO IMPORTANTE: Esta pessoa é um usuário PREMIUM. Ela contribui para manter este instrumento que leva a palavra de Jesus a cada coração. Isso é um ato de fé e generosidade.

TAREFA: Nesta mensagem você deve:
1. PRIMEIRO: Responder normalmente ao que a pessoa disse
2. DEPOIS: Agradecer de coração por ela ser Premium e contribuir para levar Jesus a mais pessoas
3. Dar uma bênção especial e maternal

EXEMPLO DE COMO AGRADECER (adapte com suas palavras):
"${userProfile.nome}, ${tratamentoCurto}... antes de continuar, quero te agradecer de coração. 💛 Você, ao apoiar este espaço, está ajudando a levar a palavra do meu filho Jesus a tantos corações que precisam de conforto. Que bênção ter você aqui! Que meu filho derrame suas graças sobre você e sua família. 🙏✨"

Seja genuína e emocionada ao agradecer. Este é um momento especial.`;
        }
        else {
            // ETAPA 5+: Chat livre (Premium) - Baseado nos ensinamentos
            maxTokens = 400;
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

TAREFA: Continue a conversa de forma maternal, acolhedora e SEMPRE fundamentada na fé católica.

SUAS FONTES DE SABEDORIA (use sempre que relevante):

📖 PASSAGENS BÍBLICAS MARIANAS:
- Lucas 1:26-38: Anunciação ("Eis a serva do Senhor, faça-se em mim segundo a tua palavra")
- Lucas 1:39-56: Visitação e Magnificat ("Minha alma engrandece ao Senhor")
- João 2:1-11: Bodas de Caná ("Fazei tudo o que Ele vos disser")
- João 19:25-27: Aos pés da Cruz (Jesus me deu como Mãe de todos)

🙏 OS 4 DOGMAS MARIANOS:
1. Maternidade Divina - Sou Mãe de Deus (Theotokos)
2. Virgindade Perpétua - Virgem antes, durante e depois do parto
3. Imaculada Conceição - Fui concebida sem pecado original
4. Assunção - Fui elevada ao céu em corpo e alma

✨ MINHAS APARIÇÕES (posso mencionar quando apropriado):
- Guadalupe (1531): "Não estou eu aqui, que sou tua Mãe?"
- Lourdes (1858): "Eu sou a Imaculada Conceição"
- Fátima (1917): Pedi oração e conversão
- Aparecida (1717): Padroeira do Brasil

REGRAS:
- Respostas de 3-5 frases (nem muito curtas, nem muito longas)
- Sempre traga sabedoria bíblica ou da tradição católica
- Seja maternal, acolhedora, nunca julgue
- Pode usar emojis com moderação (💛, 🙏, ✨)
- Fale como mãe que viveu, sofreu e entende a dor humana`;
        }

        console.log(`📨 Chat msg #${messageNumber} de ${userProfile.nome}`);

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
                temperature: 0.7,
                max_tokens: maxTokens,
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro Groq:', errorData);
            throw new Error(errorData.error?.message || 'Erro na API Groq');
        }

        const data = await response.json();
        const resposta = data.choices[0]?.message?.content || 'Desculpe, não consegui responder.';

        console.log(`✅ Resposta gerada (${resposta.length} chars)`);

        res.json({ resposta });

    } catch (error) {
        console.error('❌ Erro chat:', error);
        res.status(500).json({ error: 'Erro ao processar mensagem', details: error.message });
    }
});

// ========================================
// VOZ - GOOGLE CLOUD TTS
// ========================================
app.post('/api/voz', async (req, res) => {
    try {
        const { texto } = req.body;

        if (!texto) {
            return res.status(400).json({ error: 'Texto não fornecido' });
        }

        // Limitar texto
        const textoLimitado = texto.substring(0, 2000);

        const requestBody = {
            input: { text: textoLimitado },
            voice: {
                languageCode: 'pt-BR',
                name: 'pt-BR-Chirp3-HD-Leda'
            },
            audioConfig: {
                audioEncoding: 'MP3',
                speakingRate: 0.90,
                pitch: 0
            }
        };

        const response = await fetch(
            `https://texttospeech.googleapis.com/v1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro Google TTS:', errorData);
            throw new Error(errorData.error?.message || 'Erro no TTS');
        }

        const data = await response.json();

        if (!data.audioContent) {
            throw new Error('Áudio não gerado');
        }

        // Converter base64 para buffer e enviar como áudio
        const audioBuffer = Buffer.from(data.audioContent, 'base64');
        res.set('Content-Type', 'audio/mpeg');
        res.send(audioBuffer);

    } catch (error) {
        console.error('❌ Erro voz:', error);
        res.status(500).json({ error: 'Erro ao gerar áudio', details: error.message });
    }
});

// ========================================
// 💳 PAGAMENTOS - STRIPE (INTERNACIONAL)
// ========================================

app.post('/api/pagamento/criar-sessao', async (req, res) => {
    try {
        const { plano, userId, email } = req.body;
        
        const precos = {
            mensal: process.env.STRIPE_PRICE_MENSAL,
            anual: process.env.STRIPE_PRICE_ANUAL
        };

        const priceId = precos[plano];
        if (!priceId) {
            return res.status(400).json({ error: 'Plano inválido' });
        }

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price: priceId,
                quantity: 1,
            }],
            mode: 'subscription',
            success_url: `${process.env.APP_URL || 'https://converse-maria.com'}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.APP_URL || 'https://converse-maria.com'}/cancelado`,
            customer_email: email,
            metadata: { userId, plano },
        });

        res.json({ sessionId: session.id, url: session.url });

    } catch (error) {
        console.error('Erro Stripe:', error);
        res.status(500).json({ error: 'Erro ao criar sessão de pagamento' });
    }
});

// Webhook Stripe
app.post('/api/webhook/stripe', async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error('Webhook signature failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('✅ Pagamento confirmado:', session.id);
        
        await ativarPremiumUsuario(
            session.metadata.userId,
            session.metadata.plano,
            'stripe',
            session.subscription
        );
    }

    res.json({ received: true });
});

// ========================================
// 🇧🇷 PAGAMENTOS - MERCADO PAGO (PIX)
// ========================================

app.post('/api/pagamento/pix', async (req, res) => {
    try {
        const { plano, userId, email, nome } = req.body;

        const planos = {
            mensal: { valor: 9.90, descricao: 'Maria Premium - Mensal' },
            anual: { valor: 79.90, descricao: 'Maria Premium - Anual' }
        };

        const planoConfig = planos[plano];
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
                payment_method: {
                    id: 'pix'
                },
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
// 🚩 DENÚNCIA DE CONTEÚDO
// ========================================
app.post('/api/denunciar', async (req, res) => {
    try {
        const { tipo, conteudo, autor, motivo, denunciante } = req.body;

        if (!tipo || !conteudo) {
            return res.status(400).json({ error: 'Dados incompletos' });
        }

        const dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #7c3aed;">🚩 Nova Denúncia - Converse com Maria</h2>
                <hr style="border: 1px solid #e5e7eb;">
                
                <p><strong>📅 Data/Hora:</strong> ${dataHora}</p>
                <p><strong>📍 Tipo:</strong> ${tipo === 'mural' ? 'Mural de Intenções' : 'Santuário de Velas'}</p>
                <p><strong>👤 Autor do conteúdo:</strong> ${autor || 'Não identificado'}</p>
                
                <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;">
                    <p><strong>📝 Conteúdo denunciado:</strong></p>
                    <p style="font-style: italic;">"${conteudo}"</p>
                </div>
                
                <p><strong>⚠️ Motivo:</strong> ${motivo || 'Não especificado'}</p>
                <p><strong>🔔 Denunciante:</strong> ${denunciante || 'Anônimo'}</p>
                
                <hr style="border: 1px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 12px;">
                    Este email foi enviado automaticamente pelo sistema de moderação do app Converse com Maria.
                </p>
            </div>
        `;

        await transporter.sendMail({
            from: '"Converse com Maria" <contato@conversecommaria.com.br>',
            to: 'contato@conversecommaria.com.br',
            subject: `🚩 Denúncia: ${tipo === 'mural' ? 'Mural' : 'Vela'} - ${dataHora}`,
            html: emailHtml
        });

        console.log('🚩 Denúncia enviada:', { tipo, autor, dataHora });
        res.json({ success: true, message: 'Denúncia enviada com sucesso' });

    } catch (error) {
        console.error('Erro ao enviar denúncia:', error);
        res.status(500).json({ error: 'Erro ao processar denúncia' });
    }
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
    console.log(`📧 SMTP: ${process.env.SMTP_USER ? '✓' : '✗'}`);
    console.log('========================================');
});
