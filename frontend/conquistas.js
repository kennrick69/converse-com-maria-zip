// ========================================
// 🏅 SISTEMA DE CONQUISTAS E MEDALHAS
// Gamificação espiritual
// ========================================

const SistemaConquistas = {
    // Todas as conquistas disponíveis
    conquistas: [
        // === STREAK / CONSTÂNCIA ===
        {
            id: 'primeiro_dia',
            nome: 'Primeiro Passo',
            descricao: 'Iniciou sua jornada com Maria',
            icone: '🌱',
            categoria: 'constancia',
            condicao: (dados) => dados.streakAtual >= 1,
            pontos: 10
        },
        {
            id: 'semana_maria',
            nome: 'Semana com Maria',
            descricao: '7 dias consecutivos em oração',
            icone: '🌟',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 7,
            pontos: 50
        },
        {
            id: 'quinzena_fe',
            nome: 'Quinzena de Fé',
            descricao: '15 dias consecutivos em oração',
            icone: '✨',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 15,
            pontos: 100
        },
        {
            id: 'mes_devocao',
            nome: 'Mês de Devoção',
            descricao: '30 dias consecutivos em oração',
            icone: '🏆',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 30,
            pontos: 200
        },
        {
            id: 'centuriao',
            nome: 'Centurião da Fé',
            descricao: '100 dias consecutivos em oração',
            icone: '👑',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 100,
            pontos: 500
        },

        // === TERÇO ===
        {
            id: 'primeiro_terco',
            nome: 'Primeiro Terço',
            descricao: 'Completou seu primeiro terço',
            icone: '📿',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 1,
            pontos: 30
        },
        {
            id: 'dezena_tercos',
            nome: 'Dezena de Terços',
            descricao: 'Completou 10 terços',
            icone: '🙏',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 10,
            pontos: 100
        },
        {
            id: 'rosario_completo',
            nome: 'Rosário Completo',
            descricao: 'Rezou todos os 4 tipos de mistérios',
            icone: '🌹',
            categoria: 'terco',
            condicao: (dados) => {
                const m = dados.misteriosRezados;
                return m.gozosos > 0 && m.dolorosos > 0 && m.gloriosos > 0 && m.luminosos > 0;
            },
            pontos: 150
        },
        {
            id: 'mestre_rosario',
            nome: 'Mestre do Rosário',
            descricao: 'Completou 50 terços',
            icone: '💎',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 50,
            pontos: 300
        },
        {
            id: 'mil_ave_marias',
            nome: 'Mil Ave-Marias',
            descricao: 'Rezou 1000 Ave-Marias',
            icone: '💫',
            categoria: 'terco',
            condicao: (dados) => dados.aveMariasRezadas >= 1000,
            pontos: 250
        },

        // === VELAS ===
        {
            id: 'primeira_vela',
            nome: 'Luz da Fé',
            descricao: 'Acendeu sua primeira vela',
            icone: '🕯️',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 1,
            pontos: 15
        },
        {
            id: 'santuario_luz',
            nome: 'Santuário de Luz',
            descricao: 'Acendeu 10 velas',
            icone: '🔥',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 10,
            pontos: 50
        },
        {
            id: 'guardiao_chama',
            nome: 'Guardião da Chama',
            descricao: 'Acendeu 50 velas',
            icone: '⭐',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 50,
            pontos: 150
        },
        {
            id: 'colecao_velas',
            nome: 'Colecionador de Luz',
            descricao: 'Acendeu todos os 7 tipos de vela',
            icone: '🌈',
            categoria: 'velas',
            condicao: (dados) => {
                const tipos = Object.values(dados.velasPorTipo || {});
                return tipos.filter(v => v > 0).length >= 7;
            },
            pontos: 200
        },

        // === COMUNIDADE ===
        {
            id: 'intercessor',
            nome: 'Intercessor',
            descricao: 'Rezou por 5 intenções da comunidade',
            icone: '💙',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesRezadas >= 5,
            pontos: 40
        },
        {
            id: 'anjo_guarda',
            nome: 'Anjo da Guarda',
            descricao: 'Rezou por 25 intenções da comunidade',
            icone: '👼',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesRezadas >= 25,
            pontos: 100
        },
        {
            id: 'coracao_aberto',
            nome: 'Coração Aberto',
            descricao: 'Publicou 3 intenções de oração',
            icone: '💝',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesPublicadas >= 3,
            pontos: 30
        },

        // === TEMPO ===
        {
            id: 'hora_oracao',
            nome: 'Hora de Oração',
            descricao: '1 hora total em oração',
            icone: '⏰',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 60,
            pontos: 50
        },
        {
            id: 'maratona_fe',
            nome: 'Maratona de Fé',
            descricao: '10 horas total em oração',
            icone: '🏃',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 600,
            pontos: 200
        },
        {
            id: 'contemplativo',
            nome: 'Contemplativo',
            descricao: '24 horas total em oração',
            icone: '🧘',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 1440,
            pontos: 400
        },

        // === CONVERSAS ===
        {
            id: 'primeiro_dialogo',
            nome: 'Primeiro Diálogo',
            descricao: 'Iniciou sua primeira conversa com Maria',
            icone: '💬',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 1,
            pontos: 10
        },
        {
            id: 'amigo_maria',
            nome: 'Amigo de Maria',
            descricao: 'Enviou 50 mensagens para Maria',
            icone: '🤗',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 50,
            pontos: 75
        },
        {
            id: 'confidente',
            nome: 'Confidente de Maria',
            descricao: 'Enviou 200 mensagens para Maria',
            icone: '💞',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 200,
            pontos: 200
        },

        // === ESPECIAIS ===
        {
            id: 'leitor_devoto',
            nome: 'Leitor Devoto',
            descricao: 'Leu 30 versículos do dia',
            icone: '📖',
            categoria: 'especial',
            condicao: (dados) => dados.versiculosLidos >= 30,
            pontos: 60
        },
        {
            id: 'novena_completa',
            nome: 'Novena Completa',
            descricao: 'Completou uma novena de 9 dias',
            icone: '🎯',
            categoria: 'especial',
            condicao: (dados) => dados.novenasCompletas >= 1,
            pontos: 150
        },
        {
            id: 'peregrino_digital',
            nome: 'Peregrino Digital',
            descricao: 'Conquistou 10 medalhas',
            icone: '🗺️',
            categoria: 'especial',
            condicao: (dados, conquistadas) => conquistadas >= 10,
            pontos: 100
        },
        {
            id: 'santo_em_formacao',
            nome: 'Santo em Formação',
            descricao: 'Conquistou 20 medalhas',
            icone: '😇',
            categoria: 'especial',
            condicao: (dados, conquistadas) => conquistadas >= 20,
            pontos: 300
        }
    ],

    // Categorias
    categorias: {
        constancia: { nome: 'Constância', icone: '🔥', cor: 'orange' },
        terco: { nome: 'Terço', icone: '📿', cor: 'purple' },
        velas: { nome: 'Velas', icone: '🕯️', cor: 'yellow' },
        comunidade: { nome: 'Comunidade', icone: '💙', cor: 'blue' },
        tempo: { nome: 'Tempo', icone: '⏰', cor: 'green' },
        conversas: { nome: 'Conversas', icone: '💬', cor: 'pink' },
        especial: { nome: 'Especial', icone: '⭐', cor: 'gold' }
    },

    // Verificar conquistas
    verificarConquistas() {
        if (!window.EstatisticasOracao) return [];
        
        const dados = EstatisticasOracao.carregar();
        const conquistasSalvas = this.carregarConquistadas();
        const novas = [];
        
        // Contar conquistas já obtidas (para medalhas especiais)
        let totalConquistadas = conquistasSalvas.length;
        
        this.conquistas.forEach(conquista => {
            if (conquistasSalvas.includes(conquista.id)) return;
            
            if (conquista.condicao(dados, totalConquistadas)) {
                conquistasSalvas.push(conquista.id);
                novas.push(conquista);
                totalConquistadas++;
            }
        });
        
        if (novas.length > 0) {
            this.salvarConquistadas(conquistasSalvas);
        }
        
        return novas;
    },

    // Carregar conquistas já obtidas
    carregarConquistadas() {
        const salvo = localStorage.getItem('mariaConquistas');
        return salvo ? JSON.parse(salvo) : [];
    },

    // Salvar conquistas
    salvarConquistadas(lista) {
        localStorage.setItem('mariaConquistas', JSON.stringify(lista));
    },

    // Mostrar notificação de nova conquista
    mostrarNovaConquista(conquista) {
        const notif = document.createElement('div');
        notif.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4';
        notif.style.background = 'rgba(0,0,0,0.9)';
        notif.onclick = () => notif.remove();
        
        notif.innerHTML = `
            <div class="text-center animate-bounce-in">
                <!-- Raios de luz -->
                <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div class="w-64 h-64 bg-gradient-to-r from-yellow-500/20 via-transparent to-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
                </div>
                
                <!-- Medalha -->
                <div class="relative mb-6">
                    <div class="w-32 h-32 mx-auto bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl medalha-conquistada">
                        <span class="text-6xl">${conquista.icone}</span>
                    </div>
                    <div class="absolute -top-2 left-1/2 -translate-x-1/2">
                        <span class="text-4xl">🎉</span>
                    </div>
                </div>
                
                <p class="text-yellow-400 text-sm font-semibold mb-2 tracking-widest">NOVA CONQUISTA!</p>
                <h2 class="text-white text-2xl font-bold mb-2">${conquista.nome}</h2>
                <p class="text-white/70 mb-4">${conquista.descricao}</p>
                
                <div class="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500/20 rounded-full">
                    <span class="text-yellow-400 font-bold">+${conquista.pontos}</span>
                    <span class="text-yellow-400/70 text-sm">pontos</span>
                </div>
                
                <p class="text-white/40 text-xs mt-6">Toque para fechar</p>
            </div>
            
            <style>
                @keyframes bounce-in {
                    0% { transform: scale(0.3); opacity: 0; }
                    50% { transform: scale(1.05); }
                    70% { transform: scale(0.9); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in { animation: bounce-in 0.6s ease-out; }
                
                .medalha-conquistada {
                    animation: medalha-brilho 2s ease-in-out infinite;
                }
                
                @keyframes medalha-brilho {
                    0%, 100% { 
                        box-shadow: 0 0 30px rgba(251, 191, 36, 0.5),
                                    0 0 60px rgba(251, 191, 36, 0.3);
                    }
                    50% { 
                        box-shadow: 0 0 50px rgba(251, 191, 36, 0.7),
                                    0 0 100px rgba(251, 191, 36, 0.4);
                    }
                }
            </style>
        `;
        
        document.body.appendChild(notif);
        
        // Som de conquista (opcional)
        try {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1ubJeYnI19dXN0gYSFfnZ0d3+CgoF6d3Z5fX9/fXl3eHt+f39+e3l5e31/f398enp7fX5/f3x6ent9fn9/fXt6e31+f399e3p7fX5/f317ent9fn9/fXt6e31+f399e3p7fX5/f317');
            audio.volume = 0.3;
            audio.play().catch(() => {});
        } catch(e) {}
    },

    // Verificar e mostrar novas conquistas
    verificarEMostrar() {
        const novas = this.verificarConquistas();
        if (novas.length > 0) {
            // Mostrar uma por vez com delay
            novas.forEach((conquista, i) => {
                setTimeout(() => this.mostrarNovaConquista(conquista), i * 2000);
            });
        }
    },

    // Abrir galeria de conquistas
    abrirGaleria() {
        const conquistadas = this.carregarConquistadas();
        const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
        
        const totalPontos = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .reduce((sum, c) => sum + c.pontos, 0);
        
        // Pegar as 3 últimas conquistas para mostrar no card
        const ultimasConquistas = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .slice(-3);
        
        const modal = document.createElement('div');
        modal.id = 'galeria-conquistas';
        modal.className = 'fixed inset-0 z-[60] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#1a0a2e] via-[#1a0a2e] to-transparent p-4 pb-6">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="document.getElementById('galeria-conquistas').remove(); document.body.style.overflow='';" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <h1 class="text-white text-xl font-bold">🏅 Conquistas</h1>
                        <div class="w-10"></div>
                    </div>
                </div>
                
                <div class="px-4 space-y-6">
                    <!-- CARD DE COMPARTILHAMENTO (TOPO) -->
                    <div id="card-compartilhar" class="relative bg-gradient-to-br from-purple-900/80 via-indigo-900/80 to-purple-900/80 rounded-3xl p-5 border border-purple-500/30 overflow-hidden">
                        <!-- Efeito de brilho -->
                        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
                        
                        <!-- Conteúdo do card -->
                        <div class="relative text-center">
                            <!-- Medalhas conquistadas -->
                            <div class="flex justify-center gap-2 mb-3">
                                ${ultimasConquistas.length > 0 
                                    ? ultimasConquistas.map(c => `
                                        <div class="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                            <span class="text-2xl">${c.icone}</span>
                                        </div>
                                    `).join('')
                                    : '<div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center"><span class="text-2xl">🏅</span></div>'
                                }
                            </div>
                            
                            <!-- Stats -->
                            <p class="text-yellow-400 font-bold text-lg mb-1">${conquistadas.length} conquistas</p>
                            <p class="text-white/70 text-sm mb-1">${totalPontos} pontos de fé</p>
                            
                            <!-- Streak -->
                            <div class="inline-flex items-center gap-1 bg-orange-500/20 px-3 py-1 rounded-full mb-4">
                                <span class="text-orange-400">🔥</span>
                                <span class="text-orange-300 text-sm font-semibold">${dados.streakAtual || 0} dias em oração</span>
                            </div>
                            
                            <!-- Texto e site -->
                            <p class="text-white/60 text-xs mb-1">Baixe o app e comece sua jornada</p>
                            <p class="text-purple-300 text-sm font-semibold mb-4">www.conversecommaria.com.br</p>
                            
                            <!-- Botões -->
                            <div class="flex gap-3 justify-center">
                                <button onclick="SistemaConquistas.baixarImagem()" class="flex-1 max-w-[140px] py-2.5 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                    Baixar
                                </button>
                                <button onclick="SistemaConquistas.compartilhar()" class="flex-1 max-w-[140px] py-2.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                                    Compartilhar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Resumo -->
                    <div class="bg-gradient-to-br from-yellow-600/20 to-orange-600/20 backdrop-blur rounded-2xl p-4 border border-yellow-500/30">
                        <div class="flex items-center justify-around">
                            <div class="text-center">
                                <p class="text-3xl font-bold text-yellow-400">${conquistadas.length}</p>
                                <p class="text-white/60 text-xs">Conquistadas</p>
                            </div>
                            <div class="w-px h-10 bg-yellow-500/30"></div>
                            <div class="text-center">
                                <p class="text-3xl font-bold text-white">${this.conquistas.length}</p>
                                <p class="text-white/60 text-xs">Total</p>
                            </div>
                            <div class="w-px h-10 bg-yellow-500/30"></div>
                            <div class="text-center">
                                <p class="text-3xl font-bold text-green-400">${totalPontos}</p>
                                <p class="text-white/60 text-xs">Pontos</p>
                            </div>
                        </div>
                        
                        <!-- Barra de progresso -->
                        <div class="mt-4">
                            <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all" style="width: ${(conquistadas.length / this.conquistas.length) * 100}%"></div>
                            </div>
                            <p class="text-white/40 text-xs text-center mt-1">${Math.round((conquistadas.length / this.conquistas.length) * 100)}% completo</p>
                        </div>
                    </div>
                    
                    <!-- Lista de conquistas por categoria -->
                    ${Object.entries(this.categorias).map(([catKey, cat]) => {
                        const conquistasCategoria = this.conquistas.filter(c => c.categoria === catKey);
                        if (conquistasCategoria.length === 0) return '';
                        
                        return `
                            <div>
                                <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span>${cat.icone}</span>
                                    <span>${cat.nome}</span>
                                    <span class="text-white/40 text-sm">(${conquistasCategoria.filter(c => conquistadas.includes(c.id)).length}/${conquistasCategoria.length})</span>
                                </h3>
                                <div class="grid grid-cols-3 gap-3">
                                    ${conquistasCategoria.map(c => {
                                        const obtida = conquistadas.includes(c.id);
                                        const onclickAttr = obtida ? '' : `onclick="showToast('${c.descricao.replace(/'/g, "&#39;")}')"`;
                                        return `
                                            <div class="relative ${obtida ? '' : 'opacity-40 cursor-pointer'}" ${onclickAttr}>
                                                <div class="bg-white/5 backdrop-blur rounded-xl p-3 border ${obtida ? 'border-yellow-500/50' : 'border-white/10'} text-center">
                                                    <div class="w-12 h-12 mx-auto mb-2 rounded-full ${obtida ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-white/10'} flex items-center justify-center">
                                                        <span class="text-2xl ${obtida ? '' : 'grayscale'}">${c.icone}</span>
                                                    </div>
                                                    <p class="text-white text-xs font-semibold truncate">${c.nome}</p>
                                                    <p class="text-yellow-400/70 text-[10px]">+${c.pontos} pts</p>
                                                </div>
                                                ${!obtida ? '<div class="absolute inset-0 flex items-center justify-center"><span class="text-2xl">🔒</span></div>' : ''}
                                            </div>
                                        `;
                                    }).join('')}
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },

    // Gerar imagem para compartilhamento
    async gerarImagem() {
        const conquistadas = this.carregarConquistadas();
        const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
        const totalPontos = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .reduce((sum, c) => sum + c.pontos, 0);
        
        const ultimasConquistas = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .slice(-3);
        
        // Criar canvas
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');
        
        // Fundo gradiente
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.5, '#2d1b4e');
        gradient.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 600, 800);
        
        // Título
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏅 Minhas Conquistas', 300, 60);
        
        // Desenhar medalhas
        const medalhaY = 150;
        const medalhaSize = 80;
        const startX = ultimasConquistas.length === 1 ? 300 : 
                       ultimasConquistas.length === 2 ? 220 : 160;
        
        ultimasConquistas.forEach((c, i) => {
            const x = startX + (i * 140);
            
            // Círculo dourado
            const gradMedalha = ctx.createRadialGradient(x, medalhaY, 0, x, medalhaY, medalhaSize/2);
            gradMedalha.addColorStop(0, '#FFD700');
            gradMedalha.addColorStop(1, '#FF8C00');
            ctx.fillStyle = gradMedalha;
            ctx.beginPath();
            ctx.arc(x, medalhaY, medalhaSize/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Emoji
            ctx.font = '40px Arial';
            ctx.fillStyle = '#000';
            ctx.fillText(c.icone, x, medalhaY + 14);
        });
        
        // Se não tem conquistas, mostrar placeholder
        if (ultimasConquistas.length === 0) {
            const gradMedalha = ctx.createRadialGradient(300, medalhaY, 0, 300, medalhaY, medalhaSize/2);
            gradMedalha.addColorStop(0, '#666');
            gradMedalha.addColorStop(1, '#333');
            ctx.fillStyle = gradMedalha;
            ctx.beginPath();
            ctx.arc(300, medalhaY, medalhaSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = '40px Arial';
            ctx.fillText('🏅', 300, medalhaY + 14);
        }
        
        // Stats
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.fillText(`${conquistadas.length} conquistas`, 300, 280);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '24px Arial';
        ctx.fillText(`${totalPontos} pontos de fé`, 300, 320);
        
        // Streak
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 28px Arial';
        ctx.fillText(`🔥 ${dados.streakAtual || 0} dias em oração`, 300, 400);
        
        // Linha decorativa
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(100, 480);
        ctx.lineTo(500, 480);
        ctx.stroke();
        
        // Texto convite
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '20px Arial';
        ctx.fillText('Baixe o app e comece sua jornada', 300, 540);
        
        // Logo/Site
        ctx.fillStyle = '#9333EA';
        ctx.font = 'bold 26px Arial';
        ctx.fillText('✝️ Converse com Maria', 300, 620);
        
        ctx.fillStyle = '#C084FC';
        ctx.font = '22px Arial';
        ctx.fillText('www.conversecommaria.com.br', 300, 660);
        
        // Retornar como blob
        return new Promise(resolve => {
            canvas.toBlob(blob => resolve(blob), 'image/png');
        });
    },

    // Baixar imagem
    async baixarImagem() {
        try {
            showToast('Gerando imagem...');
            const blob = await this.gerarImagem();
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'minhas-conquistas-maria.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showToast('Imagem baixada! 🎉');
        } catch (error) {
            console.error('Erro ao baixar:', error);
            showToast('Erro ao gerar imagem');
        }
    },

    // Compartilhar
    async compartilhar() {
        try {
            showToast('Preparando...');
            const blob = await this.gerarImagem();
            const file = new File([blob], 'minhas-conquistas-maria.png', { type: 'image/png' });
            
            const conquistadas = this.carregarConquistadas();
            const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
            const totalPontos = this.conquistas
                .filter(c => conquistadas.includes(c.id))
                .reduce((sum, c) => sum + c.pontos, 0);
            
            const texto = `🏅 Minhas conquistas no Converse com Maria!\n\n` +
                         `✨ ${conquistadas.length} conquistas\n` +
                         `⭐ ${totalPontos} pontos de fé\n` +
                         `🔥 ${dados.streakAtual || 0} dias em oração\n\n` +
                         `Baixe o app e comece sua jornada!\n` +
                         `👉 www.conversecommaria.com.br`;
            
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: 'Minhas Conquistas - Converse com Maria',
                    text: texto,
                    files: [file]
                });
            } else if (navigator.share) {
                // Compartilhar só texto se não suportar arquivos
                await navigator.share({
                    title: 'Minhas Conquistas - Converse com Maria',
                    text: texto,
                    url: 'https://www.conversecommaria.com.br'
                });
            } else {
                // Fallback: copiar texto
                await navigator.clipboard.writeText(texto);
                showToast('Texto copiado! Cole nas redes sociais 📋');
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Erro ao compartilhar:', error);
                showToast('Erro ao compartilhar');
            }
        }
    }
};

// Verificar conquistas periodicamente
document.addEventListener('DOMContentLoaded', () => {
    // Verificar após 2 segundos do carregamento
    setTimeout(() => SistemaConquistas.verificarEMostrar(), 2000);
});

window.SistemaConquistas = SistemaConquistas;
