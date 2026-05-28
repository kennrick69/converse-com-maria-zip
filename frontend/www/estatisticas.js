// ========================================
// 📊 ESTATÍSTICAS DE ORAÇÃO
// Acompanhe sua jornada espiritual
// ========================================

const EstatisticasOracao = {
    // Chave do localStorage
    storageKey: 'mariaEstatisticas',

    // Dados padrão
    dadosPadrao: {
        // Contadores totais
        tercosCompletos: 0,
        tercosIniciados: 0,
        aveMariasRezadas: 0,
        paiNossosRezados: 0,
        velasAcesas: 0,
        intencoesPublicadas: 0,
        intencoesRezadas: 0,
        novenasCompletas: 0,
        novenasIniciadas: 0,
        mensagensEnviadas: 0,
        versiculosLidos: 0,
        
        // Tempo
        minutosEmOracao: 0,
        
        // Streaks
        streakAtual: 0,
        streakMaximo: 0,
        
        // Histórico diário (últimos 30 dias)
        historicoDiario: {},
        
        // Primeira vez
        primeiroAcesso: null,
        
        // Mistérios rezados
        misteriosRezados: {
            gozosos: 0,
            dolorosos: 0,
            gloriosos: 0,
            luminosos: 0
        },
        
        // Tipos de velas
        velasPorTipo: {
            simples: 0,
            nossa_senhora: 0,
            sagrado_coracao: 0,
            anjo_guarda: 0,
            sete_dias: 0,
            votiva: 0,
            pascal: 0
        }
    },

    // Carregar estatísticas
    carregar() {
        const salvo = localStorage.getItem(this.storageKey);
        let dados;
        if (salvo) {
            dados = JSON.parse(salvo);
            // Mesclar com dados padrão para garantir novos campos
            dados = { ...this.dadosPadrao, ...dados };
        } else {
            dados = { ...this.dadosPadrao, primeiroAcesso: Date.now() };
        }
        
        // Sincronizar streak com mariaStreak (fonte principal)
        const streakData = localStorage.getItem('mariaStreak');
        if (streakData) {
            const { count } = JSON.parse(streakData);
            if (count && count > 0) {
                dados.streakAtual = count;
                if (count > dados.streakMaximo) {
                    dados.streakMaximo = count;
                }
            }
        }
        
        return dados;
    },

    // Salvar estatísticas
    salvar(dados) {
        localStorage.setItem(this.storageKey, JSON.stringify(dados));
    },

    // Registrar atividade do dia
    registrarAtividadeHoje(tipo, quantidade = 1) {
        const dados = this.carregar();
        const hoje = new Date().toISOString().split('T')[0];
        
        if (!dados.historicoDiario[hoje]) {
            dados.historicoDiario[hoje] = {
                tercos: 0,
                velas: 0,
                oracoes: 0,
                minutos: 0
            };
        }
        
        if (tipo === 'terco') dados.historicoDiario[hoje].tercos += quantidade;
        if (tipo === 'vela') dados.historicoDiario[hoje].velas += quantidade;
        if (tipo === 'oracao') dados.historicoDiario[hoje].oracoes += quantidade;
        if (tipo === 'minutos') dados.historicoDiario[hoje].minutos += quantidade;
        
        // Limpar histórico antigo (manter apenas 30 dias)
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - 30);
        const limitStr = dataLimite.toISOString().split('T')[0];
        
        Object.keys(dados.historicoDiario).forEach(data => {
            if (data < limitStr) delete dados.historicoDiario[data];
        });
        
        this.salvar(dados);
    },

    // Registrar terço completo
    registrarTerco(misterio) {
        const dados = this.carregar();
        dados.tercosCompletos++;
        dados.aveMariasRezadas += 53; // 5 dezenas + 3 iniciais
        dados.paiNossosRezados += 6;
        dados.minutosEmOracao += 20; // ~20 min por terço
        
        if (misterio && dados.misteriosRezados[misterio] !== undefined) {
            dados.misteriosRezados[misterio]++;
        }
        
        this.salvar(dados);
        this.registrarAtividadeHoje('terco');
        this.registrarAtividadeHoje('minutos', 20);
    },

    // Registrar terço iniciado (mas não completo)
    registrarTercoIniciado() {
        const dados = this.carregar();
        dados.tercosIniciados++;
        this.salvar(dados);
    },

    // Registrar vela acesa
    registrarVela(tipo) {
        const dados = this.carregar();
        dados.velasAcesas++;
        
        if (tipo && dados.velasPorTipo[tipo] !== undefined) {
            dados.velasPorTipo[tipo]++;
        }
        
        this.salvar(dados);
        this.registrarAtividadeHoje('vela');
    },

    // Registrar intenção publicada
    registrarIntencao() {
        const dados = this.carregar();
        dados.intencoesPublicadas++;
        this.salvar(dados);
    },

    // Registrar oração por intenção
    registrarOracaoPorIntencao() {
        const dados = this.carregar();
        dados.intencoesRezadas++;
        this.salvar(dados);
        this.registrarAtividadeHoje('oracao');
    },

    // Registrar mensagem enviada
    registrarMensagem() {
        const dados = this.carregar();
        dados.mensagensEnviadas++;
        dados.minutosEmOracao += 2; // ~2 min por conversa
        this.salvar(dados);
        this.registrarAtividadeHoje('minutos', 2);
    },

    // Registrar versículo lido
    registrarVersiculo() {
        const dados = this.carregar();
        dados.versiculosLidos++;
        this.salvar(dados);
    },

    // Atualizar streak
    atualizarStreak(streakAtual) {
        const dados = this.carregar();
        dados.streakAtual = streakAtual;
        if (streakAtual > dados.streakMaximo) {
            dados.streakMaximo = streakAtual;
        }
        this.salvar(dados);
    },

    // Registrar novena
    registrarNovena(completa = false) {
        const dados = this.carregar();
        if (completa) {
            dados.novenasCompletas++;
        } else {
            dados.novenasIniciadas++;
        }
        this.salvar(dados);
    },

    // Calcular nível espiritual
    calcularNivel(dados) {
        const pontos = 
            dados.tercosCompletos * 50 +
            dados.velasAcesas * 10 +
            dados.intencoesRezadas * 5 +
            dados.novenasCompletas * 100 +
            dados.streakMaximo * 20 +
            Math.floor(dados.minutosEmOracao / 10) * 5;
        
        const niveis = [
            { nome: 'Semente de Fé', min: 0, icone: '🌱' },
            { nome: 'Peregrino', min: 100, icone: '🚶' },
            { nome: 'Devoto', min: 300, icone: '🙏' },
            { nome: 'Fiel Orante', min: 600, icone: '📿' },
            { nome: 'Servo de Maria', min: 1000, icone: '💙' },
            { nome: 'Filho(a) de Maria', min: 2000, icone: '👑' },
            { nome: 'Apóstolo Mariano', min: 4000, icone: '⭐' },
            { nome: 'Santo em Formação', min: 8000, icone: '😇' }
        ];
        
        let nivelAtual = niveis[0];
        let proximoNivel = niveis[1];
        
        for (let i = niveis.length - 1; i >= 0; i--) {
            if (pontos >= niveis[i].min) {
                nivelAtual = niveis[i];
                proximoNivel = niveis[i + 1] || null;
                break;
            }
        }
        
        const progresso = proximoNivel 
            ? ((pontos - nivelAtual.min) / (proximoNivel.min - nivelAtual.min)) * 100
            : 100;
        
        return { pontos, nivelAtual, proximoNivel, progresso: Math.min(progresso, 100) };
    },

    // Obter dados da semana
    obterDadosSemana() {
        const dados = this.carregar();
        const semana = [];
        const diasNomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        for (let i = 6; i >= 0; i--) {
            const data = new Date();
            data.setDate(data.getDate() - i);
            const dataStr = data.toISOString().split('T')[0];
            const dadosDia = dados.historicoDiario[dataStr] || { tercos: 0, velas: 0, oracoes: 0, minutos: 0 };
            
            semana.push({
                dia: diasNomes[data.getDay()],
                data: dataStr,
                ...dadosDia,
                total: dadosDia.tercos * 3 + dadosDia.velas + dadosDia.oracoes
            });
        }
        
        return semana;
    },

    // Calcular dias desde primeiro acesso
    calcularDiasJornada(dados) {
        if (!dados.primeiroAcesso) return 0;
        const diff = Date.now() - dados.primeiroAcesso;
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    },

    // Formatar tempo
    formatarTempo(minutos) {
        if (minutos < 60) return `${minutos} min`;
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas < 24) return `${horas}h ${mins}min`;
        const dias = Math.floor(horas / 24);
        return `${dias}d ${horas % 24}h`;
    },

    // Abrir tela de estatísticas
    abrir() {
        const dados = this.carregar();
        const nivel = this.calcularNivel(dados);
        const semana = this.obterDadosSemana();
        const diasJornada = this.calcularDiasJornada(dados);
        const maxSemana = Math.max(...semana.map(d => d.total), 1);
        
        const modal = document.createElement('div');
        modal.id = 'tela-estatisticas';
        modal.className = 'fixed inset-0 z-[60] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #0f0c29 0%, #302b63 50%, #24243e 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header com safe-area para notch -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#0f0c29] via-[#0f0c29] to-transparent p-4 pb-8" style="padding-top: calc(1rem + env(safe-area-inset-top, 0px));">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="EstatisticasOracao.fechar()" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <h1 class="text-white text-xl font-bold">📊 Minha Jornada</h1>
                        <div class="w-10"></div>
                    </div>
                    
                    <!-- Card de Nível -->
                    <div class="bg-gradient-to-br from-purple-600/30 to-indigo-600/30  rounded-2xl p-5 border border-purple-500/30">
                        <div class="flex items-center gap-4 mb-4">
                            <div class="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-3xl shadow-lg nivel-glow">
                                ${nivel.nivelAtual.icone}
                            </div>
                            <div class="flex-1">
                                <p class="text-white/60 text-xs">Seu nível espiritual</p>
                                <h2 class="text-white text-xl font-bold">${nivel.nivelAtual.nome}</h2>
                                <p class="text-yellow-400 text-sm">${nivel.pontos.toLocaleString()} pontos</p>
                            </div>
                        </div>
                        
                        ${nivel.proximoNivel ? `
                            <div class="space-y-2">
                                <div class="flex justify-between text-xs">
                                    <span class="text-white/60">Próximo: ${nivel.proximoNivel.nome} ${nivel.proximoNivel.icone}</span>
                                    <span class="text-white/60">${Math.round(nivel.progresso)}%</span>
                                </div>
                                <div class="h-2 bg-white/10 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-1000" style="width: ${nivel.progresso}%"></div>
                                </div>
                            </div>
                        ` : `
                            <p class="text-yellow-400 text-sm text-center">🌟 Nível máximo alcançado!</p>
                        `}
                    </div>
                </div>
                
                <div class="px-4 space-y-6">
                    
                    <!-- Resumo Geral -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>✨</span> Resumo da Jornada
                        </h3>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="bg-white/5  rounded-xl p-4 border border-white/10">
                                <p class="text-3xl mb-1">🔥</p>
                                <p class="text-2xl font-bold text-white">${dados.streakAtual}</p>
                                <p class="text-white/50 text-xs">Dias seguidos</p>
                                <p class="text-yellow-400 text-xs mt-1">Recorde: ${dados.streakMaximo}</p>
                            </div>
                            <div class="bg-white/5  rounded-xl p-4 border border-white/10">
                                <p class="text-3xl mb-1">⏱️</p>
                                <p class="text-2xl font-bold text-white">${this.formatarTempo(dados.minutosEmOracao)}</p>
                                <p class="text-white/50 text-xs">Em oração</p>
                                <p class="text-blue-400 text-xs mt-1">${diasJornada} dias de jornada</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ação Rápida: Compartilhar -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>⚡</span> Compartilhe sua Jornada
                        </h3>
                        <button onclick="EstatisticasOracao.abrirModalCompartilhar()" class="w-full bg-gradient-to-br from-purple-600/40 to-pink-600/40  rounded-xl p-5 border border-purple-500/30 hover:from-purple-600/60 hover:to-pink-600/60 transition-all flex items-center justify-center gap-4">
                            <div class="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                            </div>
                            <div class="text-left">
                                <span class="text-white font-bold text-lg block">Compartilhar</span>
                                <span class="text-white/50 text-sm">Mostre sua jornada espiritual</span>
                            </div>
                        </button>
                    </div>
                    
                    <!-- Estatísticas do Terço -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>📿</span> Terço e Orações
                        </h3>
                        <div class="bg-white/5  rounded-xl p-4 border border-white/10 space-y-4">
                            <div class="grid grid-cols-3 gap-3 text-center">
                                <div>
                                    <p class="text-2xl font-bold text-white">${dados.tercosCompletos}</p>
                                    <p class="text-white/50 text-xs">Terços completos</p>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-white">${dados.aveMariasRezadas}</p>
                                    <p class="text-white/50 text-xs">Ave-Marias</p>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-white">${dados.paiNossosRezados}</p>
                                    <p class="text-white/50 text-xs">Pai-Nossos</p>
                                </div>
                            </div>
                            
                            <!-- Mistérios -->
                            <div class="pt-3 border-t border-white/10">
                                <p class="text-white/60 text-xs mb-2">Mistérios rezados:</p>
                                <div class="grid grid-cols-4 gap-2">
                                    <div class="text-center p-2 bg-yellow-500/10 rounded-lg">
                                        <p class="text-lg">😊</p>
                                        <p class="text-white font-bold">${dados.misteriosRezados.gozosos}</p>
                                        <p class="text-white/50 text-[10px]">Gozosos</p>
                                    </div>
                                    <div class="text-center p-2 bg-red-500/10 rounded-lg">
                                        <p class="text-lg">💔</p>
                                        <p class="text-white font-bold">${dados.misteriosRezados.dolorosos}</p>
                                        <p class="text-white/50 text-[10px]">Dolorosos</p>
                                    </div>
                                    <div class="text-center p-2 bg-purple-500/10 rounded-lg">
                                        <p class="text-lg">👑</p>
                                        <p class="text-white font-bold">${dados.misteriosRezados.gloriosos}</p>
                                        <p class="text-white/50 text-[10px]">Gloriosos</p>
                                    </div>
                                    <div class="text-center p-2 bg-blue-500/10 rounded-lg">
                                        <p class="text-lg">✨</p>
                                        <p class="text-white font-bold">${dados.misteriosRezados.luminosos}</p>
                                        <p class="text-white/50 text-[10px]">Luminosos</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Velas e Intenções -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>🕯️</span> Velas e Intenções
                        </h3>
                        <div class="bg-white/5  rounded-xl p-4 border border-white/10">
                            <div class="grid grid-cols-3 gap-3 text-center mb-4">
                                <div>
                                    <p class="text-2xl font-bold text-orange-400">${dados.velasAcesas}</p>
                                    <p class="text-white/50 text-xs">Velas acesas</p>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-blue-400">${dados.intencoesPublicadas}</p>
                                    <p class="text-white/50 text-xs">Intenções</p>
                                </div>
                                <div>
                                    <p class="text-2xl font-bold text-pink-400">${dados.intencoesRezadas}</p>
                                    <p class="text-white/50 text-xs">Rezei por outros</p>
                                </div>
                            </div>
                            
                            <!-- Tipos de velas mais acesas -->
                            <div class="pt-3 border-t border-white/10">
                                <p class="text-white/60 text-xs mb-2">Velas por tipo:</p>
                                <div class="flex flex-wrap gap-2">
                                    ${Object.entries(dados.velasPorTipo).filter(([k,v]) => v > 0).map(([tipo, qtd]) => `
                                        <span class="px-2 py-1 bg-orange-500/20 text-orange-300 rounded-full text-xs">
                                            ${this.getNomeVela(tipo)}: ${qtd}
                                        </span>
                                    `).join('') || '<span class="text-white/40 text-xs">Nenhuma vela acesa ainda</span>'}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Novenas -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>📅</span> Novenas e Devoções
                        </h3>
                        <div class="bg-white/5  rounded-xl p-4 border border-white/10">
                            <div class="grid grid-cols-2 gap-4 text-center">
                                <div>
                                    <p class="text-3xl font-bold text-green-400">${dados.novenasCompletas}</p>
                                    <p class="text-white/50 text-sm">Novenas completas</p>
                                </div>
                                <div>
                                    <p class="text-3xl font-bold text-white">${dados.versiculosLidos}</p>
                                    <p class="text-white/50 text-sm">Versículos lidos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Conversas -->
                    <div>
                        <h3 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>💬</span> Conversas com Maria
                        </h3>
                        <div class="bg-white/5  rounded-xl p-4 border border-white/10">
                            <div class="flex items-center justify-center gap-8">
                                <div class="text-center">
                                    <p class="text-4xl font-bold text-purple-400">${dados.mensagensEnviadas}</p>
                                    <p class="text-white/50 text-sm">Mensagens enviadas</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Compartilhar -->
                    <div class="pt-4">
                        <button onclick="EstatisticasOracao.compartilhar()" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-2xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2">
                            <span>📤</span>
                            <span>Compartilhar Minha Jornada</span>
                        </button>
                    </div>
                    
                </div>
            </div>
            
            <style>
                .nivel-glow {
                    animation: nivel-pulse 2s ease-in-out infinite;
                }
                
                @keyframes nivel-pulse {
                    0%, 100% { box-shadow: 0 0 20px rgba(251, 191, 36, 0.4); }
                    50% { box-shadow: 0 0 40px rgba(251, 191, 36, 0.6); }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },

    // Nome amigável das velas
    getNomeVela(tipo) {
        const nomes = {
            simples: '🕯️ Simples',
            nossa_senhora: '👑 N. Senhora',
            sagrado_coracao: '❤️ Sagrado Coração',
            anjo_guarda: '👼 Anjo da Guarda',
            sete_dias: '7️⃣ Sete Dias',
            votiva: '🙏 Votiva',
            pascal: '✝️ Pascal'
        };
        return nomes[tipo] || tipo;
    },

    // Compartilhar estatísticas
    compartilhar() {
        this.abrirModalCompartilhar();
    },

    // Abrir modal de compartilhamento
    abrirModalCompartilhar() {
        const dados = this.carregar();
        const nivel = this.calcularNivel(dados);
        
        const modal = document.createElement('div');
        modal.id = 'modal-compartilhar';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.95)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-gray-900 to-purple-900/50 rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6">
                <div class="text-center mb-4">
                    <h2 class="text-white text-xl font-bold">📤 Compartilhar Jornada</h2>
                    <p class="text-white/60 text-sm">Escolha como compartilhar sua conquista</p>
                </div>
                
                <!-- Preview da imagem -->
                <div class="mb-4 rounded-2xl overflow-hidden shadow-2xl" id="preview-container">
                    <canvas id="canvas-compartilhar" width="1080" height="1920" class="w-full h-auto"></canvas>
                </div>
                
                <!-- Formato fixo Stories -->
                <div class="mb-4">
                    <p class="text-white/60 text-xs mb-2">📱 Formato: Stories (9:16)</p>
                </div>
                
                <!-- Botões de ação -->
                <div class="space-y-3">
                    <button onclick="EstatisticasOracao.compartilharDireto()" class="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all flex items-center justify-center gap-2">
                        <span>📤</span>
                        <span>Compartilhar</span>
                    </button>
                </div>
                
                <button onclick="document.getElementById('modal-compartilhar').remove()" class="w-full mt-4 py-3 bg-white/5 text-white/60 rounded-xl hover:bg-white/10 transition-all">
                    Fechar
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.formatoAtual = 'stories';
        this.gerarImagem();
    },

    // Formato atual
    formatoAtual: 'stories',

    // Mudar formato
    mudarFormato(formato) {
        this.formatoAtual = formato;
        
        // Atualizar botões
        const btnStories = document.getElementById('btn-stories');
        const btnFeed = document.getElementById('btn-feed');
        
        if (formato === 'stories') {
            btnStories.className = 'flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl';
            btnFeed.className = 'flex-1 py-2 px-3 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20';
        } else {
            btnFeed.className = 'flex-1 py-2 px-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-xl';
            btnStories.className = 'flex-1 py-2 px-3 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20';
        }
        
        this.gerarImagem();
    },

    // Gerar imagem no canvas
    gerarImagem() {
        const canvas = document.getElementById('canvas-compartilhar');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const dados = this.carregar();
        const nivel = this.calcularNivel(dados);
        
        // Definir dimensões baseado no formato
        if (this.formatoAtual === 'stories') {
            canvas.width = 1080;
            canvas.height = 1920;
        } else {
            canvas.width = 1080;
            canvas.height = 1080;
        }
        
        const w = canvas.width;
        const h = canvas.height;
        
        // Fundo gradiente
        const gradient = ctx.createLinearGradient(0, 0, w, h);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.5, '#2d1b4e');
        gradient.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        
        // Decorações (estrelas)
        ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * w;
            const y = Math.random() * h;
            const r = Math.random() * 3 + 1;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Círculo dourado de luz no topo
        const glowGradient = ctx.createRadialGradient(w/2, h * 0.15, 0, w/2, h * 0.15, w * 0.4);
        glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.3)');
        glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = glowGradient;
        ctx.fillRect(0, 0, w, h);
        
        // Posições baseadas no formato
        const isStories = this.formatoAtual === 'stories';
        const startY = isStories ? h * 0.08 : h * 0.05;
        const spacing = isStories ? 1 : 0.7;
        
        // Título "MINHA JORNADA"
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${w * 0.06}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText('✨ MINHA JORNADA ✨', w/2, startY + h * 0.05);
        
        // Subtítulo
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = `${w * 0.035}px Arial`;
        ctx.fillText('de Oração com Maria', w/2, startY + h * 0.09);
        
        // Nível - Círculo grande
        const nivelY = startY + h * 0.18 * spacing;
        
        // Círculo de fundo do nível
        ctx.beginPath();
        ctx.arc(w/2, nivelY, w * 0.12, 0, Math.PI * 2);
        const nivelGrad = ctx.createLinearGradient(w/2 - 100, nivelY - 100, w/2 + 100, nivelY + 100);
        nivelGrad.addColorStop(0, '#FFD700');
        nivelGrad.addColorStop(1, '#FFA500');
        ctx.fillStyle = nivelGrad;
        ctx.fill();
        
        // Emoji do nível
        ctx.font = `${w * 0.1}px Arial`;
        ctx.fillText(nivel.nivelAtual.icone, w/2, nivelY + w * 0.035);
        
        // Nome do nível
        ctx.fillStyle = '#FFFFFF';
        ctx.font = `bold ${w * 0.045}px Arial`;
        ctx.fillText(nivel.nivelAtual.nome, w/2, nivelY + w * 0.18);
        
        // Pontos
        ctx.fillStyle = '#FFD700';
        ctx.font = `${w * 0.03}px Arial`;
        ctx.fillText(`${nivel.pontos.toLocaleString()} pontos`, w/2, nivelY + w * 0.23);
        
        // Cards de estatísticas
        const cardsY = nivelY + h * 0.2 * spacing;
        const cardW = w * 0.4;
        const cardH = isStories ? h * 0.08 : h * 0.12;
        const cardGap = w * 0.05;
        
        // Função para desenhar card
        const desenharCard = (x, y, emoji, valor, label, cor) => {
            // Fundo do card
            ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
            this.roundRect(ctx, x, y, cardW, cardH, 20);
            ctx.fill();
            
            // Emoji
            ctx.font = `${w * 0.06}px Arial`;
            ctx.fillText(emoji, x + cardW * 0.2, y + cardH * 0.55);
            
            // Valor
            ctx.fillStyle = cor;
            ctx.font = `bold ${w * 0.055}px Arial`;
            ctx.textAlign = 'left';
            ctx.fillText(valor.toString(), x + cardW * 0.4, y + cardH * 0.45);
            
            // Label
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.font = `${w * 0.025}px Arial`;
            ctx.fillText(label, x + cardW * 0.4, y + cardH * 0.7);
            
            ctx.textAlign = 'center';
        };
        
        // Card 1: Streak
        desenharCard(w/2 - cardW - cardGap/2, cardsY, '🔥', dados.streakAtual, 'dias seguidos', '#FF6B6B');
        
        // Card 2: Tempo
        desenharCard(w/2 + cardGap/2, cardsY, '⏱️', this.formatarTempo(dados.minutosEmOracao), 'em oração', '#4ECDC4');
        
        // Card 3: Terços
        const cardsY2 = cardsY + cardH + h * 0.02;
        desenharCard(w/2 - cardW - cardGap/2, cardsY2, '📿', dados.tercosCompletos, 'terços completos', '#A78BFA');
        
        // Card 4: Velas
        desenharCard(w/2 + cardGap/2, cardsY2, '🕯️', dados.velasAcesas, 'velas acesas', '#FBBF24');
        
        // Card 5 e 6 (apenas no Stories)
        if (isStories) {
            const cardsY3 = cardsY2 + cardH + h * 0.02;
            desenharCard(w/2 - cardW - cardGap/2, cardsY3, '🙏', dados.aveMariasRezadas, 'Ave-Marias', '#F472B6');
            desenharCard(w/2 + cardGap/2, cardsY3, '💙', dados.intencoesRezadas, 'Rezei por outros', '#60A5FA');
        }
        
        // Linha decorativa
        const lineY = isStories ? cardsY + cardH * 3 + h * 0.08 : cardsY2 + cardH + h * 0.06;
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(w * 0.2, lineY);
        ctx.lineTo(w * 0.8, lineY);
        ctx.stroke();
        
        // Nome do app
        const appY = lineY + h * 0.05;
        ctx.fillStyle = '#FFD700';
        ctx.font = `bold ${w * 0.05}px Georgia`;
        ctx.fillText('Converse com Maria', w/2, appY);
        
        // Subtítulo do app
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = `${w * 0.028}px Arial`;
        ctx.fillText('Mãe de Jesus Cristo • Rainha dos Céus', w/2, appY + h * 0.035);
        
        // Call to action
        const ctaY = appY + h * 0.08;
        ctx.fillStyle = 'rgba(255, 215, 0, 0.2)';
        this.roundRect(ctx, w * 0.15, ctaY - h * 0.02, w * 0.7, h * 0.05, 30);
        ctx.fill();
        
        ctx.fillStyle = '#FFD700';
        ctx.font = `${w * 0.028}px Arial`;
        ctx.fillText('📲 Baixe o app e comece sua jornada!', w/2, ctaY + h * 0.015);
        
        // Data
        const hoje = new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.font = `${w * 0.022}px Arial`;
        ctx.fillText(hoje, w/2, h - h * 0.03);
    },

    // Helper: Retângulo arredondado
    roundRect(ctx, x, y, w, h, r) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + w - r, y);
        ctx.quadraticCurveTo(x + w, y, x + w, y + r);
        ctx.lineTo(x + w, y + h - r);
        ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        ctx.lineTo(x + r, y + h);
        ctx.quadraticCurveTo(x, y + h, x, y + h - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    },

    // Baixar imagem
    baixarImagem() {
        const canvas = document.getElementById('canvas-compartilhar');
        if (!canvas) return;
        
        const link = document.createElement('a');
        link.download = `minha-jornada-maria-${this.formatoAtual}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        if (window.showToast) showToast('📥 Imagem baixada!');
    },

    // Compartilhar direto (com imagem se suportado)
    async compartilharDireto() {
        // Mostrar loading
        if (window.LoadingCompartilhar) {
            LoadingCompartilhar.mostrar('Preparando estatísticas...');
        }
        
        const canvas = document.getElementById('canvas-compartilhar');
        if (!canvas) {
            if (window.LoadingCompartilhar) LoadingCompartilhar.esconder();
            return;
        }
        
        const dados = this.carregar();
        const nivel = this.calcularNivel(dados);
        
        const texto = `🙏 Minha Jornada de Oração com Maria

${nivel.nivelAtual.icone} Nível: ${nivel.nivelAtual.nome}
🔥 ${dados.streakAtual} dias seguidos
📿 ${dados.tercosCompletos} terços completos
🕯️ ${dados.velasAcesas} velas acesas

Baixe o app "Converse com Maria"! 💙
www.conversecommaria.com.br`;

        try {
            // Usar CompartilharService se disponível
            if (window.CompartilharService) {
                await CompartilharService.compartilharComImagem(
                    canvas,
                    'Minha Jornada de Oração',
                    texto
                );
            } else {
                // Fallback
                const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
                const file = new File([blob], 'minha-jornada-maria.png', { type: 'image/png' });
                
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Minha Jornada de Oração',
                        text: texto,
                        files: [file]
                    });
                } else if (navigator.share) {
                    await navigator.share({
                        title: 'Minha Jornada de Oração',
                        text: texto
                    });
                } else {
                    this.baixarImagem();
                }
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                this.baixarImagem();
            }
        } finally {
            // Esconder loading sempre
            if (window.LoadingCompartilhar) {
                LoadingCompartilhar.esconder();
            }
        }
    },

    // Compartilhar apenas texto
    compartilharTexto() {
        const dados = this.carregar();
        const nivel = this.calcularNivel(dados);
        
        const texto = `🙏 Minha Jornada de Oração com Maria

📊 Nível: ${nivel.nivelAtual.icone} ${nivel.nivelAtual.nome}
🔥 ${dados.streakAtual} dias seguidos de oração
📿 ${dados.tercosCompletos} terços completos
🕯️ ${dados.velasAcesas} velas acesas
⏱️ ${this.formatarTempo(dados.minutosEmOracao)} em oração

Baixe o app "Converse com Maria" e comece sua jornada espiritual! 💙
www.conversecommaria.com.br`;

        // Usar CompartilharService se disponível
        if (window.CompartilharService) {
            CompartilharService.compartilharTexto('Minha Jornada de Oração', texto);
        } else {
            navigator.clipboard.writeText(texto).then(() => {
                if (window.showToast) showToast('📋 Texto copiado!');
            });
        }
    },

    // Fechar
    fechar() {
        const modal = document.getElementById('tela-estatisticas');
        if (modal) modal.remove();
        document.body.style.overflow = '';
    }
};

window.EstatisticasOracao = EstatisticasOracao;
