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
        
        const modal = document.createElement('div');
        modal.id = 'galeria-conquistas';
        modal.className = 'fixed inset-0 z-[60] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #1a0a2e 0%, #2d1b4e 50%, #1a0a2e 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#1a0a2e] via-[#1a0a2e] to-transparent p-4 pb-8">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="document.getElementById('galeria-conquistas').remove(); document.body.style.overflow='';" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <h1 class="text-white text-xl font-bold">🏅 Conquistas</h1>
                        <div class="w-10"></div>
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
                </div>
                
                <div class="px-4 space-y-6">
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
    }
};

// Verificar conquistas periodicamente
document.addEventListener('DOMContentLoaded', () => {
    // Verificar após 2 segundos do carregamento
    setTimeout(() => SistemaConquistas.verificarEMostrar(), 2000);
});

window.SistemaConquistas = SistemaConquistas;
