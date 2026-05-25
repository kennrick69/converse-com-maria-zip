// ========================================
// 💎 TELA PREMIUM - CONVERSE COM MARIA
// Uma experiência de conversão irresistível
// ========================================

const TelaPremium = {
    // Planos disponíveis
    planos: {
        mensal: {
            id: 'mensal',
            nome: 'Mensal',
            preco: 19.90,
            precoOriginal: 29.90,
            periodo: '/mês',
            economia: null,
            destaque: false,
            beneficios: 'Cancele quando quiser',
            medalha: false
        },
        anual: {
            id: 'anual',
            nome: 'Anual',
            preco: 9.99,
            precoOriginal: 19.90,
            periodo: '/mês',
            precoTotal: 119.90,
            economia: 'Economia de R$119',
            destaque: true,
            beneficios: '12 meses pelo preço de 6',
            medalha: true
        }
    },

    // Benefícios Premium
    beneficios: [
        {
            icone: '💬',
            titulo: 'Conversas Ilimitadas',
            descricao: 'Converse com Maria sem limites, a qualquer hora',
            gratis: '5 por dia',
            premium: 'Ilimitado'
        },
        {
            icone: '🔊',
            titulo: 'Áudio em Todas as Respostas',
            descricao: 'Ouça a voz suave de Maria em cada mensagem',
            gratis: 'Limitado',
            premium: 'Sempre'
        },
        {
            icone: '📿',
            titulo: 'Terço Guiado Completo',
            descricao: 'Maria reza o terço junto com você',
            gratis: '1 mistério',
            premium: 'Todos os 4'
        },
        {
            icone: '🕯️',
            titulo: 'Velas Especiais',
            descricao: 'Acenda velas exclusivas por suas intenções',
            gratis: 'Simples',
            premium: '7 tipos'
        },
        {
            icone: '📅',
            titulo: 'Novenas Guiadas',
            descricao: '9 dias de oração para graças especiais',
            gratis: '—',
            premium: 'Acesso total'
        },
        {
            icone: '🎵',
            titulo: 'Meditações Exclusivas',
            descricao: 'Áudios para dormir em paz',
            gratis: '—',
            premium: 'Acesso total'
        },
        {
            icone: '🚫',
            titulo: 'Sem Anúncios',
            descricao: 'Experiência pura de oração',
            gratis: 'Com anúncios',
            premium: 'Zero anúncios'
        },
        {
            icone: '⭐',
            titulo: 'Suporte Prioritário',
            descricao: 'Atendimento especial para você',
            gratis: '—',
            premium: '24h'
        }
    ],

    // Depoimentos Premium
    depoimentos: [
        {
            nome: 'Maria Fernanda',
            cidade: 'São Paulo, SP',
            foto: '👩🏻',
            texto: 'O Premium mudou minha vida de oração. Agora consigo rezar o terço todos os dias com Maria me guiando. Sinto uma paz que não tinha antes.',
            estrelas: 5
        },
        {
            nome: 'João Carlos',
            cidade: 'Belo Horizonte, MG',
            foto: '👨🏽',
            texto: 'Valia cada centavo. As meditações para dormir são maravilhosas e as velas especiais me ajudam a focar nas minhas intenções.',
            estrelas: 5
        },
        {
            nome: 'Ana Beatriz',
            cidade: 'Curitiba, PR',
            foto: '👩🏼',
            texto: 'Estava passando por um momento muito difícil. As conversas ilimitadas com Maria me trouxeram conforto quando mais precisei.',
            estrelas: 5
        }
    ],

    // Depoimentos específicos sobre a MEDALHA
    depoimentosMedalha: [
        {
            nome: 'Dona Aparecida',
            cidade: 'Aparecida, SP',
            foto: '👵🏻',
            texto: 'Quando a medalha chegou, coloquei na porta de casa. No mesmo dia, meu filho que estava afastado há 3 anos me ligou pedindo perdão. Nossa Senhora é poderosa!',
            estrelas: 5,
            tempo: '2 semanas atrás'
        },
        {
            nome: 'Roberto e Família',
            cidade: 'Goiânia, GO',
            foto: '👨‍👩‍👧‍👦',
            texto: 'Nossa casa vivia em brigas constantes. Depois que colocamos a medalha na sala, a paz voltou ao nosso lar. Meus filhos pararam de brigar e meu casamento melhorou muito.',
            estrelas: 5,
            tempo: '1 mês atrás'
        },
        {
            nome: 'Tereza Cristina',
            cidade: 'Recife, PE',
            foto: '👩🏽',
            texto: 'A medalha veio numa embalagem linda, com uma oração. Chorei quando recebi. Coloquei no quarto do meu pai que estava doente, e ele teve uma melhora que os médicos não explicam.',
            estrelas: 5,
            tempo: '3 semanas atrás'
        },
        {
            nome: 'Família Santos',
            cidade: 'Porto Alegre, RS',
            foto: '👨🏻',
            texto: 'Estávamos com dívidas enormes e muita angústia. Após pendurar a medalha benta, em 2 meses minha esposa conseguiu um emprego e começamos a nos reerguer. Fé em Maria!',
            estrelas: 5,
            tempo: '1 mês atrás'
        },
        {
            nome: 'Irmã Lúcia',
            cidade: 'Salvador, BA',
            foto: '👩🏾',
            texto: 'Sou catequista e indico o app para todos. A medalha que recebi está no nosso grupo de oração. Várias pessoas relataram graças alcançadas depois que começamos a rezar com ela presente.',
            estrelas: 5,
            tempo: '2 meses atrás'
        },
        {
            nome: 'José Carlos',
            cidade: 'Manaus, AM',
            foto: '👴🏽',
            texto: 'Minha neta de 4 anos tinha pesadelos toda noite. Colocamos a medalha de Nossa Senhora no quarto dela. Desde então, dorme em paz a noite toda. Milagre da Mãezinha!',
            estrelas: 5,
            tempo: '3 semanas atrás'
        }
    ],

    // Estado
    planoSelecionado: 'anual',

    // Abrir tela premium
    abrir(motivo = null) {
        const modal = document.createElement('div');
        modal.id = 'tela-premium';
        modal.className = 'fixed inset-0 z-[100] overflow-y-auto';
        
        modal.innerHTML = `
            <div class="min-h-screen premium-bg">
                <!-- Partículas douradas -->
                <div class="particles-gold" id="particles-gold"></div>
                
                <!-- Header com botão fechar -->
                <div class="sticky top-0 z-10 flex justify-between items-center p-4 bg-gradient-to-b from-black/80 to-transparent">
                    <button onclick="TelaPremium.fechar()" class="p-2 bg-white/10 backdrop-blur rounded-full hover:bg-white/20 transition-all">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                    <div class="flex items-center gap-2">
                        <span class="text-yellow-400 text-sm font-semibold">🎁 Oferta Especial</span>
                    </div>
                    <div class="w-10"></div>
                </div>
                
                <!-- Conteúdo Principal -->
                <div class="px-4 pb-8 -mt-4">
                    
                    <!-- Hero Section -->
                    <div class="text-center mb-8">
                        <div class="relative inline-block mb-4">
                            <div class="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-2xl crown-glow">
                                <span class="text-5xl">👑</span>
                            </div>
                            <div class="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-bounce">
                                -50%
                            </div>
                        </div>
                        <h1 class="text-3xl font-bold text-white mb-2">Maria <span class="text-yellow-400">Premium</span></h1>
                        <p class="text-white/70">Aprofunde sua vida espiritual com Maria</p>
                        
                        ${motivo ? `
                            <div class="mt-4 bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-3">
                                <p class="text-yellow-300 text-sm">${motivo}</p>
                            </div>
                        ` : ''}
                    </div>
                    
                    <!-- DESTAQUE: Medalha de Presente -->
                    <div class="mb-8 relative">
                        <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 blur-xl"></div>
                        <div class="relative bg-gradient-to-br from-yellow-900/40 via-amber-900/30 to-yellow-900/40 rounded-3xl p-5 border-2 border-yellow-500/50 overflow-hidden">
                            <!-- Brilhos decorativos -->
                            <div class="absolute top-2 right-4 text-2xl animate-pulse">✨</div>
                            <div class="absolute bottom-2 left-4 text-xl animate-pulse">✨</div>
                            
                            <div class="flex items-center gap-4">
                                <div class="flex-shrink-0">
                                    <div class="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 flex items-center justify-center shadow-xl medalha-shine">
                                        <span class="text-4xl">🏅</span>
                                    </div>
                                </div>
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">BRINDE EXCLUSIVO</span>
                                    </div>
                                    <h3 class="text-white font-bold text-lg">Medalha de Nossa Senhora</h3>
                                    <p class="text-white/70 text-sm">Receba em casa uma linda medalha benta para abençoar seu lar</p>
                                    <p class="text-yellow-400 text-xs mt-1 font-semibold">🎁 Grátis no plano Anual!</p>
                                </div>
                            </div>
                            
                            <!-- Detalhes da medalha -->
                            <div class="mt-4 pt-4 border-t border-yellow-500/20 grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <span class="text-xl">🙏</span>
                                    <p class="text-white/60 text-[10px]">Benta por sacerdote</p>
                                </div>
                                <div>
                                    <span class="text-xl">📦</span>
                                    <p class="text-white/60 text-[10px]">Frete grátis</p>
                                </div>
                                <div>
                                    <span class="text-xl">💝</span>
                                    <p class="text-white/60 text-[10px]">Embalagem especial</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Seleção de Planos -->
                    <div class="mb-8">
                        <div class="flex gap-3 mb-4">
                            ${Object.entries(this.planos).map(([key, plano]) => this.renderizarPlano(key, plano)).join('')}
                        </div>
                        
                        <!-- Garantia -->
                        <div class="flex items-center justify-center gap-2 text-white/60 text-sm">
                            <span>🔒</span>
                            <span>7 dias de garantia • Cancele quando quiser</span>
                        </div>
                    </div>
                    
                    <!-- Comparativo Grátis vs Premium -->
                    <div class="mb-8">
                        <h2 class="text-white font-bold text-lg mb-4 text-center">Compare os planos</h2>
                        <div class="bg-white/5 backdrop-blur rounded-2xl overflow-hidden border border-white/10">
                            <!-- Header da tabela -->
                            <div class="grid grid-cols-3 bg-white/5 p-3 border-b border-white/10">
                                <div class="text-white/60 text-sm">Recurso</div>
                                <div class="text-white/60 text-sm text-center">Grátis</div>
                                <div class="text-yellow-400 text-sm text-center font-semibold">Premium</div>
                            </div>
                            <!-- Linhas -->
                            ${this.beneficios.map(b => `
                                <div class="grid grid-cols-3 p-3 border-b border-white/5 items-center">
                                    <div class="flex items-center gap-2">
                                        <span class="text-lg">${b.icone}</span>
                                        <span class="text-white text-sm">${b.titulo}</span>
                                    </div>
                                    <div class="text-white/40 text-sm text-center">${b.gratis}</div>
                                    <div class="text-yellow-400 text-sm text-center font-semibold">${b.premium}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Depoimentos -->
                    <div class="mb-8">
                        <h2 class="text-white font-bold text-lg mb-4 text-center">Quem já é Premium ama 💛</h2>
                        <div class="space-y-3">
                            ${this.depoimentos.map(d => `
                                <div class="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur rounded-2xl p-4 border border-white/10">
                                    <div class="flex items-center gap-3 mb-3">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-2xl">
                                            ${d.foto}
                                        </div>
                                        <div>
                                            <p class="text-white font-semibold">${d.nome}</p>
                                            <p class="text-white/50 text-xs">${d.cidade}</p>
                                        </div>
                                        <div class="ml-auto flex">
                                            ${Array(d.estrelas).fill('⭐').join('')}
                                        </div>
                                    </div>
                                    <p class="text-white/80 text-sm italic">"${d.texto}"</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Depoimentos sobre a MEDALHA -->
                    <div class="mb-8">
                        <div class="text-center mb-4">
                            <span class="text-3xl">🏅</span>
                            <h2 class="text-white font-bold text-lg mt-2">Lares Transformados pela Medalha</h2>
                            <p class="text-white/60 text-sm">Veja o que aconteceu com quem recebeu</p>
                        </div>
                        
                        <div class="space-y-3">
                            ${this.depoimentosMedalha.map(d => `
                                <div class="bg-gradient-to-br from-yellow-900/20 to-amber-900/10 backdrop-blur rounded-2xl p-4 border border-yellow-500/20">
                                    <div class="flex items-start gap-3">
                                        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center text-2xl flex-shrink-0">
                                            ${d.foto}
                                        </div>
                                        <div class="flex-1">
                                            <div class="flex items-center justify-between mb-1">
                                                <p class="text-white font-semibold text-sm">${d.nome}</p>
                                                <div class="flex text-xs">
                                                    ${Array(d.estrelas).fill('⭐').join('')}
                                                </div>
                                            </div>
                                            <p class="text-white/50 text-xs mb-2">${d.cidade} • ${d.tempo}</p>
                                            <p class="text-white/80 text-sm italic leading-relaxed">"${d.texto}"</p>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="mt-4 text-center">
                            <p class="text-yellow-400/80 text-xs">
                                ✨ Mais de 2.000 medalhas já abençoaram lares brasileiros
                            </p>
                        </div>
                    </div>
                    
                    <!-- FAQ Rápido -->
                    <div class="mb-8">
                        <h2 class="text-white font-bold text-lg mb-4 text-center">Dúvidas frequentes</h2>
                        <div class="space-y-3">
                            <div class="bg-white/5 rounded-xl p-4">
                                <p class="text-white font-semibold text-sm mb-1">Posso cancelar a qualquer momento?</p>
                                <p class="text-white/60 text-sm">Sim! Você pode cancelar quando quiser, sem taxas ou burocracia.</p>
                            </div>
                            <div class="bg-white/5 rounded-xl p-4">
                                <p class="text-white font-semibold text-sm mb-1">E se eu não gostar?</p>
                                <p class="text-white/60 text-sm">Você tem 7 dias para testar. Se não gostar, devolvemos 100% do valor.</p>
                            </div>
                            <div class="bg-white/5 rounded-xl p-4">
                                <p class="text-white font-semibold text-sm mb-1">Como funciona o pagamento?</p>
                                <p class="text-white/60 text-sm">Aceitamos cartão de crédito, PIX e boleto. Tudo seguro e criptografado.</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Missão -->
                    <div class="mb-8 text-center">
                        <div class="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-6 border border-blue-500/20">
                            <span class="text-4xl mb-3 block">💙</span>
                            <p class="text-white/80 text-sm leading-relaxed">
                                Sua assinatura nos ajuda a levar a devoção mariana para mais pessoas. 
                                Parte do valor é destinado a projetos de evangelização e caridade.
                            </p>
                        </div>
                    </div>
                    
                </div>
                
                <!-- Botão Fixo de Assinar -->
                <div class="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
                    <button onclick="TelaPremium.assinar()" class="w-full py-4 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-2xl shadow-2xl hover:from-yellow-400 hover:to-yellow-300 transition-all transform hover:scale-[1.02] assinar-btn">
                        <span class="flex items-center justify-center gap-2">
                            <span>👑</span>
                            <span>Começar Agora</span>
                            <span class="text-sm font-normal opacity-80" id="preco-btn">• R$9,99/mês</span>
                        </span>
                    </button>
                    <p class="text-center text-white/40 text-xs mt-2">
                        Renovação automática • Cancele quando quiser
                    </p>
                </div>
                
            </div>
            
            <style>
                .premium-bg {
                    background: linear-gradient(180deg, 
                        #0a0612 0%, 
                        #1a0a2e 20%, 
                        #2d1b4e 40%, 
                        #1a1a3e 60%,
                        #0a0612 100%
                    );
                    min-height: 100vh;
                    padding-bottom: 100px;
                }
                
                .crown-glow {
                    animation: crown-pulse 2s ease-in-out infinite;
                }
                
                @keyframes crown-pulse {
                    0%, 100% { 
                        box-shadow: 0 0 30px rgba(251, 191, 36, 0.4),
                                    0 0 60px rgba(251, 191, 36, 0.2),
                                    0 0 90px rgba(251, 191, 36, 0.1);
                    }
                    50% { 
                        box-shadow: 0 0 40px rgba(251, 191, 36, 0.6),
                                    0 0 80px rgba(251, 191, 36, 0.3),
                                    0 0 120px rgba(251, 191, 36, 0.15);
                    }
                }
                
                .particles-gold {
                    position: fixed;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                }
                
                .particle-gold {
                    position: absolute;
                    width: 6px;
                    height: 6px;
                    background: radial-gradient(circle, rgba(251,191,36,0.8) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: float-gold 10s ease-in infinite;
                }
                
                @keyframes float-gold {
                    0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                    10% { opacity: 1; }
                    90% { opacity: 1; }
                    100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
                }
                
                .assinar-btn {
                    background-size: 200% 100%;
                    animation: shimmer-gold 3s linear infinite;
                }
                
                @keyframes shimmer-gold {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
                
                .medalha-shine {
                    animation: medalha-brilho 3s ease-in-out infinite;
                }
                
                @keyframes medalha-brilho {
                    0%, 100% { 
                        box-shadow: 0 0 20px rgba(251, 191, 36, 0.5),
                                    0 0 40px rgba(251, 191, 36, 0.3),
                                    inset 0 0 20px rgba(255, 255, 255, 0.2);
                        transform: scale(1);
                    }
                    50% { 
                        box-shadow: 0 0 30px rgba(251, 191, 36, 0.7),
                                    0 0 60px rgba(251, 191, 36, 0.4),
                                    inset 0 0 30px rgba(255, 255, 255, 0.3);
                        transform: scale(1.05);
                    }
                }
                
                .plano-card {
                    transition: all 0.3s ease;
                }
                
                .plano-card.selecionado {
                    transform: scale(1.02);
                    border-color: rgba(251, 191, 36, 0.5);
                    box-shadow: 0 0 30px rgba(251, 191, 36, 0.2);
                }
                
                .plano-card:not(.selecionado) {
                    opacity: 0.7;
                }
                
                .plano-card:not(.selecionado):hover {
                    opacity: 1;
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        this.criarParticulasDouradas();
        this.atualizarPlanoSelecionado();
    },

    // Renderizar card de plano
    renderizarPlano(key, plano) {
        const selecionado = this.planoSelecionado === key;
        
        return `
            <div onclick="TelaPremium.selecionarPlano('${key}')" 
                 class="plano-card flex-1 p-4 rounded-2xl cursor-pointer border-2 ${selecionado ? 'selecionado bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border-yellow-500/50' : 'bg-white/5 border-white/10 hover:border-white/30'}"
                 id="plano-${key}">
                
                ${plano.destaque ? `
                    <div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full inline-block mb-2">
                        ⭐ MAIS POPULAR
                    </div>
                ` : '<div class="h-6 mb-2"></div>'}
                
                <p class="text-white font-bold text-lg">${plano.nome}</p>
                
                <div class="flex items-baseline gap-1 mt-2">
                    <span class="text-3xl font-bold ${selecionado ? 'text-yellow-400' : 'text-white'}">R$${plano.preco.toFixed(2).replace('.', ',')}</span>
                    <span class="text-white/60 text-sm">${plano.periodo}</span>
                </div>
                
                ${plano.precoOriginal ? `
                    <p class="text-white/40 text-sm line-through">R$${plano.precoOriginal.toFixed(2).replace('.', ',')}</p>
                ` : ''}
                
                ${plano.economia ? `
                    <p class="text-green-400 text-sm font-semibold mt-1">${plano.economia}</p>
                ` : '<p class="text-white/40 text-sm mt-1">' + plano.beneficios + '</p>'}
                
                ${plano.precoTotal ? `
                    <p class="text-white/50 text-xs mt-2">Total: R$${plano.precoTotal.toFixed(2).replace('.', ',')}/ano</p>
                ` : ''}
                
                ${plano.medalha ? `
                    <div class="mt-3 pt-3 border-t border-yellow-500/30 flex items-center justify-center gap-2">
                        <span class="text-lg">🏅</span>
                        <span class="text-yellow-400 text-xs font-semibold">+ Medalha Grátis!</span>
                    </div>
                ` : ''}
                
                <!-- Indicador de seleção -->
                <div class="mt-3 flex justify-center">
                    <div class="w-5 h-5 rounded-full border-2 ${selecionado ? 'border-yellow-400 bg-yellow-400' : 'border-white/30'} flex items-center justify-center">
                        ${selecionado ? '<svg class="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>' : ''}
                    </div>
                </div>
            </div>
        `;
    },

    // Criar partículas douradas
    criarParticulasDouradas() {
        const container = document.getElementById('particles-gold');
        if (!container) return;
        
        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-gold';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (8 + Math.random() * 6) + 's';
            particle.style.width = (4 + Math.random() * 4) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
    },

    // Selecionar plano
    selecionarPlano(planoId) {
        this.planoSelecionado = planoId;
        this.atualizarPlanoSelecionado();
    },

    // Atualizar visual do plano selecionado
    atualizarPlanoSelecionado() {
        const plano = this.planos[this.planoSelecionado];
        
        // Atualizar cards
        Object.keys(this.planos).forEach(key => {
            const card = document.getElementById(`plano-${key}`);
            if (card) {
                if (key === this.planoSelecionado) {
                    card.classList.add('selecionado', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20', 'border-yellow-500/50');
                    card.classList.remove('bg-white/5', 'border-white/10');
                } else {
                    card.classList.remove('selecionado', 'bg-gradient-to-br', 'from-yellow-500/20', 'to-orange-500/20', 'border-yellow-500/50');
                    card.classList.add('bg-white/5', 'border-white/10');
                }
            }
        });
        
        // Atualizar botão
        const precoBtn = document.getElementById('preco-btn');
        if (precoBtn) {
            precoBtn.textContent = `• R$${plano.preco.toFixed(2).replace('.', ',')}${plano.periodo}`;
        }
    },

    // Iniciar assinatura
    assinar() {
        const plano = this.planos[this.planoSelecionado];
        
        // Se é plano anual, pedir endereço para enviar medalha
        if (plano.medalha) {
            this.mostrarFormularioEndereco(plano);
        } else {
            this.mostrarTelaCheckout(plano);
        }
    },

    // Mostrar formulário de endereço para medalha
    mostrarFormularioEndereco(plano) {
        const form = document.createElement('div');
        form.id = 'form-endereco';
        form.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4';
        form.style.background = 'rgba(0,0,0,0.95)';
        
        form.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 animate-scale-in">
                <div class="text-center mb-6">
                    <div class="w-20 h-20 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg medalha-shine">
                        <span class="text-4xl">🏅</span>
                    </div>
                    <h2 class="text-white text-xl font-bold">Receba sua Medalha!</h2>
                    <p class="text-white/60 text-sm mt-1">Informe o endereço para enviarmos sua medalha benta</p>
                </div>
                
                <!-- Formulário -->
                <div class="space-y-4 mb-6">
                    <div>
                        <label class="text-white/70 text-sm mb-1 block">Nome completo *</label>
                        <input type="text" id="endereco-nome" placeholder="Seu nome" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                    </div>
                    
                    <div>
                        <label class="text-white/70 text-sm mb-1 block">CEP *</label>
                        <input type="text" id="endereco-cep" placeholder="00000-000" maxlength="9" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                    </div>
                    
                    <div>
                        <label class="text-white/70 text-sm mb-1 block">Endereço *</label>
                        <input type="text" id="endereco-rua" placeholder="Rua, Avenida..." class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="text-white/70 text-sm mb-1 block">Número *</label>
                            <input type="text" id="endereco-numero" placeholder="123" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                        </div>
                        <div>
                            <label class="text-white/70 text-sm mb-1 block">Complemento</label>
                            <input type="text" id="endereco-complemento" placeholder="Apto, Bloco..." class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                        </div>
                    </div>
                    
                    <div>
                        <label class="text-white/70 text-sm mb-1 block">Bairro *</label>
                        <input type="text" id="endereco-bairro" placeholder="Seu bairro" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                    </div>
                    
                    <div class="grid grid-cols-3 gap-3">
                        <div class="col-span-2">
                            <label class="text-white/70 text-sm mb-1 block">Cidade *</label>
                            <input type="text" id="endereco-cidade" placeholder="Sua cidade" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500">
                        </div>
                        <div>
                            <label class="text-white/70 text-sm mb-1 block">UF *</label>
                            <input type="text" id="endereco-uf" placeholder="SP" maxlength="2" class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-yellow-500 uppercase">
                        </div>
                    </div>
                </div>
                
                <!-- Info -->
                <div class="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 mb-6">
                    <p class="text-yellow-300 text-xs flex items-center gap-2">
                        <span>📦</span>
                        <span>Frete grátis! Entrega em até 15 dias úteis.</span>
                    </p>
                </div>
                
                <!-- Botões -->
                <div class="flex gap-3">
                    <button onclick="document.getElementById('form-endereco').remove()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                        Voltar
                    </button>
                    <button onclick="TelaPremium.validarEndereco()" class="flex-1 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black rounded-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all">
                        Continuar
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(form);
    },

    // Validar endereço
    validarEndereco() {
        const campos = ['nome', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
        const obrigatorios = ['nome', 'cep', 'rua', 'numero', 'bairro', 'cidade', 'uf'];
        
        let valido = true;
        const endereco = {};
        
        for (const campo of campos) {
            const input = document.getElementById('endereco-' + campo);
            const valor = input?.value?.trim() || '';
            endereco[campo] = valor;
            
            if (obrigatorios.includes(campo) && !valor) {
                input.classList.add('border-red-500');
                valido = false;
            } else {
                input?.classList.remove('border-red-500');
            }
        }
        
        if (!valido) {
            if (window.showToast) showToast('❌ Preencha todos os campos obrigatórios');
            return;
        }
        
        // Salvar endereço
        this.enderecoMedalha = endereco;
        
        // Fechar form e abrir checkout
        document.getElementById('form-endereco').remove();
        this.mostrarTelaCheckout(this.planos[this.planoSelecionado]);
    },

    // Mostrar tela de checkout
    mostrarTelaCheckout(plano) {
        const checkout = document.createElement('div');
        checkout.id = 'checkout-premium';
        checkout.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4';
        checkout.style.background = 'rgba(0,0,0,0.95)';
        
        checkout.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl w-full max-w-md p-6 animate-scale-in">
                <div class="text-center mb-6">
                    <div class="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <span class="text-3xl">💳</span>
                    </div>
                    <h2 class="text-white text-xl font-bold">Finalizar Assinatura</h2>
                    <p class="text-white/60 text-sm mt-1">Plano ${plano.nome} • R$${plano.preco.toFixed(2).replace('.', ',')}${plano.periodo}</p>
                </div>
                
                <!-- Métodos de pagamento -->
                <div class="space-y-3 mb-6">
                    <button onclick="TelaPremium.processarPagamento('cartao')" class="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <span class="text-2xl">💳</span>
                        <div class="text-left">
                            <p class="text-white font-semibold">Cartão de Crédito</p>
                            <p class="text-white/50 text-xs">Visa, Mastercard, Elo...</p>
                        </div>
                        <svg class="w-5 h-5 text-white/40 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    
                    <button onclick="TelaPremium.processarPagamento('pix')" class="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <span class="text-2xl">🔑</span>
                        <div class="text-left">
                            <p class="text-white font-semibold">PIX</p>
                            <p class="text-white/50 text-xs">Aprovação instantânea</p>
                        </div>
                        <svg class="w-5 h-5 text-white/40 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    
                    <button onclick="TelaPremium.processarPagamento('boleto')" class="w-full flex items-center gap-4 p-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all">
                        <span class="text-2xl">📄</span>
                        <div class="text-left">
                            <p class="text-white font-semibold">Boleto</p>
                            <p class="text-white/50 text-xs">Aprovação em 1-3 dias úteis</p>
                        </div>
                        <svg class="w-5 h-5 text-white/40 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                </div>
                
                <!-- Segurança -->
                <div class="flex items-center justify-center gap-2 text-white/40 text-xs mb-6">
                    <span>🔒</span>
                    <span>Pagamento 100% seguro e criptografado</span>
                </div>
                
                <button onclick="document.getElementById('checkout-premium').remove()" class="w-full py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all">
                    Voltar
                </button>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.3s ease-out; }
            </style>
        `;
        
        document.body.appendChild(checkout);
    },

    // Processar pagamento com gateway real
    processarPagamento(metodo) {
        const checkout = document.getElementById('checkout-premium');
        if (checkout) checkout.remove();
        
        const plano = this.planoSelecionado; // 'mensal' ou 'anual'
        
        // Verificar se PagamentoService está disponível
        if (typeof PagamentoService === 'undefined') {
            console.error('PagamentoService não carregado');
            this.processarPagamentoSimulado(metodo);
            return;
        }
        
        switch (metodo) {
            case 'cartao':
                // Stripe para cartões
                PagamentoService.pagarComStripe(plano);
                break;
                
            case 'pix':
                // Mercado Pago para PIX
                PagamentoService.pagarComPix(plano);
                break;
                
            case 'boleto':
                // TODO: Implementar boleto via Mercado Pago
                if (window.showToast) {
                    showToast('Boleto em breve! Use PIX por enquanto 🙏');
                }
                break;
                
            default:
                console.warn('Método de pagamento desconhecido:', metodo);
        }
    },
    
    // Fallback: Pagamento simulado (para testes)
    processarPagamentoSimulado(metodo) {
        const loading = document.createElement('div');
        loading.id = 'loading-pagamento';
        loading.className = 'fixed inset-0 z-[110] flex items-center justify-center';
        loading.style.background = 'rgba(0,0,0,0.95)';
        loading.innerHTML = `
            <div class="text-center">
                <div class="w-20 h-20 mx-auto mb-4 relative">
                    <div class="absolute inset-0 border-4 border-yellow-500/30 rounded-full"></div>
                    <div class="absolute inset-0 border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                    <div class="absolute inset-0 flex items-center justify-center">
                        <span class="text-3xl">🙏</span>
                    </div>
                </div>
                <p class="text-white font-semibold">Processando pagamento...</p>
                <p class="text-white/60 text-sm mt-1">[MODO SIMULADO]</p>
            </div>
        `;
        document.body.appendChild(loading);
        
        setTimeout(() => {
            loading.remove();
            this.mostrarSucesso();
        }, 2500);
    },

    // Mostrar sucesso
    mostrarSucesso() {
        const plano = this.planos[this.planoSelecionado];
        const temMedalha = plano.medalha && this.enderecoMedalha;
        
        const sucesso = document.createElement('div');
        sucesso.id = 'sucesso-premium';
        sucesso.className = 'fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-y-auto';
        sucesso.style.background = 'linear-gradient(180deg, #0a0612 0%, #1a0a2e 100%)';
        
        sucesso.innerHTML = `
            <div class="text-center animate-scale-in py-8">
                <!-- Confetes -->
                <div class="confetes-container" id="confetes"></div>
                
                <div class="relative mb-6">
                    <div class="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl crown-glow">
                        <span class="text-7xl">👑</span>
                    </div>
                    <div class="absolute -bottom-2 left-1/2 -translate-x-1/2">
                        <span class="text-4xl">✨</span>
                    </div>
                </div>
                
                <h1 class="text-3xl font-bold text-white mb-2">Bem-vindo ao Premium!</h1>
                <p class="text-yellow-400 font-semibold mb-4">Sua assinatura está ativa</p>
                <p class="text-white/70 text-sm mb-6 max-w-xs mx-auto">
                    Maria está muito feliz em ter você mais perto! Aproveite todos os benefícios exclusivos.
                </p>
                
                ${temMedalha ? `
                    <div class="bg-gradient-to-br from-yellow-900/40 to-amber-900/30 rounded-2xl p-5 mb-6 mx-4 border border-yellow-500/30 text-left">
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                                <span class="text-2xl">🏅</span>
                            </div>
                            <div>
                                <p class="text-white font-bold">Sua medalha está a caminho!</p>
                                <p class="text-yellow-400/80 text-xs">Prazo: até 15 dias úteis</p>
                            </div>
                        </div>
                        <div class="bg-black/20 rounded-xl p-3 text-sm">
                            <p class="text-white/60 text-xs mb-1">Endereço de entrega:</p>
                            <p class="text-white/90">${this.enderecoMedalha.nome}</p>
                            <p class="text-white/70 text-xs">
                                ${this.enderecoMedalha.rua}, ${this.enderecoMedalha.numero}
                                ${this.enderecoMedalha.complemento ? ' - ' + this.enderecoMedalha.complemento : ''}
                            </p>
                            <p class="text-white/70 text-xs">
                                ${this.enderecoMedalha.bairro} - ${this.enderecoMedalha.cidade}/${this.enderecoMedalha.uf}
                            </p>
                            <p class="text-white/70 text-xs">CEP: ${this.enderecoMedalha.cep}</p>
                        </div>
                        <p class="text-yellow-300/70 text-xs mt-3 text-center">
                            🙏 Medalha benta por sacerdote • Abençoe seu lar!
                        </p>
                    </div>
                ` : ''}
                
                <button onclick="TelaPremium.concluirAssinatura()" class="px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-2xl shadow-lg hover:from-yellow-400 hover:to-orange-400 transition-all">
                    Começar a Usar 🙏
                </button>
            </div>
        `;
        
        document.body.appendChild(sucesso);
        this.criarConfetes();
        
        // Salvar status premium
        localStorage.setItem('mariaPremium', JSON.stringify({
            ativo: true,
            dataInicio: Date.now(),
            plano: this.planoSelecionado,
            enderecoMedalha: this.enderecoMedalha || null
        }));
    },

    // Criar confetes
    criarConfetes() {
        const container = document.getElementById('confetes');
        if (!container) return;
        
        const cores = ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB', '#98FB98'];
        
        for (let i = 0; i < 50; i++) {
            const confete = document.createElement('div');
            confete.style.cssText = `
                position: fixed;
                width: ${5 + Math.random() * 10}px;
                height: ${5 + Math.random() * 10}px;
                background: ${cores[Math.floor(Math.random() * cores.length)]};
                left: ${Math.random() * 100}%;
                top: -20px;
                opacity: ${0.7 + Math.random() * 0.3};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                animation: confete-fall ${2 + Math.random() * 3}s linear forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(confete);
        }
        
        // Adicionar animação
        if (!document.getElementById('confete-style')) {
            const style = document.createElement('style');
            style.id = 'confete-style';
            style.textContent = `
                @keyframes confete-fall {
                    0% { transform: translateY(0) rotate(0deg); }
                    100% { transform: translateY(100vh) rotate(720deg); }
                }
            `;
            document.head.appendChild(style);
        }
    },

    // Concluir assinatura
    concluirAssinatura() {
        document.getElementById('sucesso-premium')?.remove();
        this.fechar();
        if (window.showToast) showToast('👑 Bem-vindo ao Maria Premium!');
    },

    // Verificar se é premium
    isPremium() {
        const premium = localStorage.getItem('mariaPremium');
        if (!premium) return false;
        
        const dados = JSON.parse(premium);
        return dados.ativo === true;
    },

    // Fechar tela premium
    fechar() {
        const modal = document.getElementById('tela-premium');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    }
};

window.TelaPremium = TelaPremium;
