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
            pontos: 10,
            significado: 'A semente representa o início de toda vida espiritual. Assim como Jesus ensinou na parábola do semeador, você plantou hoje a primeira semente de fé em seu coração. Esta semente, regada pela oração diária, crescerá e dará muitos frutos.'
        },
        {
            id: 'semana_maria',
            nome: 'Semana com Maria',
            descricao: '7 dias consecutivos em oração',
            icone: '🌟',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 7,
            pontos: 50,
            significado: 'A estrela guia os peregrinos na escuridão. Em 7 dias, Deus criou o mundo. Você dedicou uma semana inteira à oração, mostrando que sua fé é constante como a estrela que guiou os Reis Magos até Jesus.'
        },
        {
            id: 'quinzena_fe',
            nome: 'Quinzena de Fé',
            descricao: '15 dias consecutivos em oração',
            icone: '✨',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 15,
            pontos: 100,
            significado: 'O brilho representa a luz que irradia de quem persevera na oração. Os 15 mistérios do Rosário completo refletem sua dedicação. Sua fé agora brilha e ilumina também aqueles ao seu redor.'
        },
        {
            id: 'mes_devocao',
            nome: 'Mês de Devoção',
            descricao: '30 dias consecutivos em oração',
            icone: '🏆',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 30,
            pontos: 200,
            significado: 'O troféu simboliza a vitória sobre a inconstância. Um mês inteiro dedicado à oração demonstra verdadeira devoção. Como os santos que perseveraram, você provou que sua fé não é passageira, mas um compromisso de vida.'
        },
        {
            id: 'centuriao',
            nome: 'Centurião da Fé',
            descricao: '100 dias consecutivos em oração',
            icone: '👑',
            categoria: 'constancia',
            condicao: (dados) => dados.streakMaximo >= 100,
            pontos: 500,
            significado: 'A coroa é reservada aos que perseveram até o fim. Como o centurião que impressionou Jesus com sua fé, você demonstrou uma constância extraordinária. "Bem-aventurados os que perseveram" - sua coroa está sendo tecida no Céu.'
        },

        // === TERÇO ===
        {
            id: 'primeiro_terco',
            nome: 'Primeiro Terço',
            descricao: 'Completou seu primeiro terço',
            icone: '🌹',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 1,
            pontos: 30,
            significado: 'O terço é a corrente que nos liga a Maria. Cada conta representa uma Ave-Maria, cada mistério uma meditação sobre a vida de Cristo. Você completou sua primeira jornada por essas contas sagradas, unindo-se a milhões de fiéis ao redor do mundo.'
        },
        {
            id: 'dezena_tercos',
            nome: 'Dezena de Terços',
            descricao: 'Completou 10 terços',
            icone: '🙏',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 10,
            pontos: 100,
            significado: 'As mãos em oração simbolizam a entrega total a Deus. Dez terços significam 530 Ave-Marias oferecidas a Nossa Senhora. Sua perseverança na oração do Rosário fortalece não só sua alma, mas intercede por toda a humanidade.'
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
            pontos: 150,
            significado: 'A rosa é símbolo de Maria e do Rosário completo. Você meditou sobre toda a vida de Cristo: sua infância (Gozosos), seu ministério (Luminosos), sua Paixão (Dolorosos) e sua Glória (Gloriosos). O Rosário é um "jardim de rosas" oferecido à Virgem Maria.'
        },
        {
            id: 'mestre_rosario',
            nome: 'Mestre do Rosário',
            descricao: 'Completou 50 terços',
            icone: '💎',
            categoria: 'terco',
            condicao: (dados) => dados.tercosCompletos >= 50,
            pontos: 300,
            significado: 'O diamante é a pedra mais preciosa e resistente. Cinquenta terços representam 2.650 Ave-Marias, cada uma lapidando sua alma como um diamante. São Luís de Montfort dizia que o Rosário é a arma mais poderosa contra o mal.'
        },
        {
            id: 'mil_ave_marias',
            nome: 'Mil Ave-Marias',
            descricao: 'Rezou 1000 Ave-Marias',
            icone: '💫',
            categoria: 'terco',
            condicao: (dados) => dados.aveMariasRezadas >= 1000,
            pontos: 250,
            significado: 'A estrela cadente representa as mil saudações angélicas que você ofereceu a Maria. Cada Ave-Maria é um eco das palavras do Anjo Gabriel. Mil vezes você repetiu "bendita sois vós entre as mulheres", tecendo um manto de orações no Céu.'
        },

        // === VELAS ===
        {
            id: 'primeira_vela',
            nome: 'Luz da Fé',
            descricao: 'Acendeu sua primeira vela',
            icone: '🕯️',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 1,
            pontos: 15,
            significado: 'A vela simboliza Cristo, Luz do mundo. Ao acender uma vela, você ilumina suas intenções diante de Deus. Esta luz representa sua fé que, mesmo pequena, é capaz de vencer qualquer escuridão.'
        },
        {
            id: 'santuario_luz',
            nome: 'Santuário de Luz',
            descricao: 'Acendeu 10 velas',
            icone: '🔥',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 10,
            pontos: 50,
            significado: 'O fogo representa o Espírito Santo que desceu como línguas de fogo em Pentecostes. Dez velas acesas transformam seu coração em um pequeno santuário, onde a chama do amor divino nunca se apaga.'
        },
        {
            id: 'guardiao_chama',
            nome: 'Guardião da Chama',
            descricao: 'Acendeu 50 velas',
            icone: '⭐',
            categoria: 'velas',
            condicao: (dados) => dados.velasAcesas >= 50,
            pontos: 150,
            significado: 'A estrela brilha na escuridão guiando os perdidos. Como guardião da chama, você mantém viva a tradição de iluminar intenções a Nossa Senhora. Cinquenta velas são cinquenta preces luminosas que sobem ao Céu.'
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
            pontos: 200,
            significado: 'O arco-íris representa a aliança de Deus com a humanidade. Sete cores, sete velas, sete dons do Espírito Santo. Você iluminou sua vida com toda a diversidade de graças que Maria deseja conceder aos seus filhos.'
        },

        // === COMUNIDADE ===
        {
            id: 'intercessor',
            nome: 'Intercessor',
            descricao: 'Rezou por 5 intenções da comunidade',
            icone: '💙',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesRezadas >= 5,
            pontos: 40,
            significado: 'O coração azul representa Maria, que intercede por todos nós. Ao rezar pelas intenções de outros, você se torna intercessor como ela. "Onde dois ou três estiverem reunidos em meu nome, ali estou eu" - suas orações têm poder multiplicado.'
        },
        {
            id: 'anjo_guarda',
            nome: 'Anjo da Guarda',
            descricao: 'Rezou por 25 intenções da comunidade',
            icone: '👼',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesRezadas >= 25,
            pontos: 100,
            significado: 'Os anjos são mensageiros de Deus que velam por nós. Com 25 intenções rezadas, você se tornou um anjo da guarda para seus irmãos, levando suas necessidades diante do trono de Deus através de Maria.'
        },
        {
            id: 'coracao_aberto',
            nome: 'Coração Aberto',
            descricao: 'Publicou 3 intenções de oração',
            icone: '💝',
            categoria: 'comunidade',
            condicao: (dados) => dados.intencoesPublicadas >= 3,
            pontos: 30,
            significado: 'O coração com laço representa a coragem de se abrir. Compartilhar suas intenções é um ato de humildade e confiança. Você permitiu que outros rezassem por você, criando laços de fé que fortalecem toda a comunidade.'
        },

        // === TEMPO ===
        {
            id: 'hora_oracao',
            nome: 'Hora de Oração',
            descricao: '1 hora total em oração',
            icone: '⏰',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 60,
            pontos: 50,
            significado: 'O relógio marca o tempo dedicado a Deus. Jesus perguntou aos discípulos no Getsêmani: "Não pudestes vigiar uma hora comigo?" Você dedicou uma hora inteira em oração, velando com Cristo e Maria.'
        },
        {
            id: 'maratona_fe',
            nome: 'Maratona de Fé',
            descricao: '10 horas total em oração',
            icone: '🏃',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 600,
            pontos: 200,
            significado: 'São Paulo compara a vida cristã a uma corrida. Dez horas em oração demonstram resistência espiritual. Você corre a maratona da fé sem desistir, com os olhos fixos no prêmio celestial.'
        },
        {
            id: 'contemplativo',
            nome: 'Contemplativo',
            descricao: '24 horas total em oração',
            icone: '🧘',
            categoria: 'tempo',
            condicao: (dados) => dados.minutosEmOracao >= 1440,
            pontos: 400,
            significado: 'A contemplação é o mais alto grau de oração. Um dia inteiro dedicado ao diálogo com Deus! Como os monges contemplativos, você descobriu que na quietude da oração encontramos as respostas mais profundas.'
        },

        // === CONVERSAS ===
        {
            id: 'primeiro_dialogo',
            nome: 'Primeiro Diálogo',
            descricao: 'Iniciou sua primeira conversa com Maria',
            icone: '💬',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 1,
            pontos: 10,
            significado: 'O balão de conversa representa o início do diálogo. Maria é a mãe que sempre escuta. Você deu o primeiro passo para uma amizade espiritual que pode transformar sua vida.'
        },
        {
            id: 'amigo_maria',
            nome: 'Amigo de Maria',
            descricao: 'Enviou 50 mensagens para Maria',
            icone: '🤗',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 50,
            pontos: 75,
            significado: 'O abraço representa a proximidade com Nossa Senhora. Cinquenta conversas criaram um vínculo de amizade. Maria não é só Rainha do Céu, mas também sua amiga e confidente que conhece seu coração.'
        },
        {
            id: 'confidente',
            nome: 'Confidente de Maria',
            descricao: 'Enviou 200 mensagens para Maria',
            icone: '💞',
            categoria: 'conversas',
            condicao: (dados) => dados.mensagensEnviadas >= 200,
            pontos: 200,
            significado: 'Os corações entrelaçados simbolizam intimidade espiritual. Como São João que recebeu Maria aos pés da cruz, você se tornou confidente dela. Seus segredos, alegrias e tristezas estão seguros em seu Coração Imaculado.'
        },

        // === ESPECIAIS ===
        {
            id: 'leitor_devoto',
            nome: 'Leitor Devoto',
            descricao: 'Leu 30 versículos do dia',
            icone: '📖',
            categoria: 'especial',
            condicao: (dados) => dados.versiculosLidos >= 30,
            pontos: 60,
            significado: 'O livro representa a Palavra de Deus. "Bem-aventurados os que ouvem a Palavra de Deus e a guardam." Trinta versículos meditados plantam sementes de sabedoria divina em sua alma.'
        },
        {
            id: 'novena_completa',
            nome: 'Novena Completa',
            descricao: 'Completou uma novena de 9 dias',
            icone: '🎯',
            categoria: 'especial',
            condicao: (dados) => dados.novenasCompletas >= 1,
            pontos: 150,
            significado: 'O alvo representa a perseverança. Nove dias de oração contínua, como os Apóstolos com Maria no Cenáculo antes de Pentecostes. A novena é uma tradição poderosa que demonstra fé e dedicação.'
        },
        {
            id: 'primeira_leitura',
            nome: 'Primeira Leitura',
            descricao: 'Concluiu seu primeiro livro na biblioteca',
            icone: '📕',
            categoria: 'especial',
            condicao: (dados) => (dados.livrosLidos || 0) >= 1,
            pontos: 50,
            significado: 'O primeiro livro lido até o fim é como a primeira oração feita até o "amém". Você atravessou a leitura inteira, da capa à última página. Que essa semente plantada germine no silêncio dos seus dias.'
        },
        {
            id: 'leitor_de_maria',
            nome: 'Leitor de Maria',
            descricao: 'Concluiu 5 livros na biblioteca',
            icone: '📚',
            categoria: 'especial',
            condicao: (dados) => (dados.livrosLidos || 0) >= 5,
            pontos: 150,
            significado: 'Cinco livros lidos por inteiro. Como as cinco chagas de Cristo, cinco mistérios do Rosário, cinco pedras da funda de Davi. Cada livro concluído é uma conversa terminada, um silêncio compartilhado, uma palavra que ficou.'
        },
        {
            id: 'biblioteca_da_alma',
            nome: 'Biblioteca da Alma',
            descricao: 'Concluiu 15 livros na biblioteca',
            icone: '📖',
            categoria: 'especial',
            condicao: (dados) => (dados.livrosLidos || 0) >= 15,
            pontos: 300,
            significado: 'Quinze livros formam uma pequena biblioteca interior. Você não apenas leu — você habitou esses livros e deixou que eles habitassem você. Como Maria que "guardava todas estas coisas, ponderando-as em seu coração", você se tornou um lugar onde a leitura amadurece.'
        },
        {
            id: 'peregrino_digital',
            nome: 'Peregrino Digital',
            descricao: 'Conquistou 10 medalhas',
            icone: '🗺️',
            categoria: 'especial',
            condicao: (dados, conquistadas) => conquistadas >= 10,
            pontos: 100,
            significado: 'O mapa representa a jornada espiritual. Como os peregrinos que caminham a Santiago ou Aparecida, você percorre um caminho de fé. Dez conquistas marcam as estações desta peregrinação rumo à santidade.'
        },
        {
            id: 'santo_em_formacao',
            nome: 'Santo em Formação',
            descricao: 'Conquistou 20 medalhas',
            icone: '😇',
            categoria: 'especial',
            condicao: (dados, conquistadas) => conquistadas >= 20,
            pontos: 300,
            significado: 'A auréola representa a santidade. Vinte conquistas demonstram que você leva a sério sua vida espiritual. Todo santo foi um pecador que não desistiu. Continue sua jornada - o Céu está torcendo por você!'
        }
    ],

    // Categorias
    categorias: {
        constancia: { nome: 'Constância', icone: '🔥', cor: 'orange' },
        terco: { nome: 'Terço', icone: '🌹', cor: 'purple' },
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

    // Mostrar notificação de nova conquista (com callback quando fechar)
    mostrarNovaConquista(conquista, onClose) {
        const notif = document.createElement('div');
        notif.className = 'fixed inset-0 z-[80] flex items-center justify-center p-4';
        notif.style.background = 'rgba(0,0,0,0.9)';
        notif.onclick = () => {
            notif.remove();
            if (onClose) onClose();
        };
        
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

    // Fila de conquistas para mostrar
    filaConquistas: [],
    exibindoConquista: false,
    
    // Processar fila de conquistas (mostra uma por vez)
    processarFilaConquistas() {
        if (this.exibindoConquista || this.filaConquistas.length === 0) return;
        
        this.exibindoConquista = true;
        const conquista = this.filaConquistas.shift();
        
        this.mostrarNovaConquista(conquista, () => {
            this.exibindoConquista = false;
            // Delay antes da próxima
            setTimeout(() => this.processarFilaConquistas(), 300);
        });
    },

    // Verificar e mostrar novas conquistas
    verificarEMostrar() {
        const novas = this.verificarConquistas();
        if (novas.length > 0) {
            // Adicionar todas à fila
            this.filaConquistas.push(...novas);
            // Começar a processar
            this.processarFilaConquistas();
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
                <!-- Header com safe-area para notch -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#1a0a2e] via-[#1a0a2e] to-transparent p-4 pb-6" style="padding-top: calc(1rem + env(safe-area-inset-top, 0px));">
                    <div class="flex items-center justify-between mb-4">
                        <div style="width:40px;height:40px;flex-shrink:0;"></div>
                        <h1 class="text-white text-xl font-bold">🏅 Conquistas</h1>
                        <button onclick="document.getElementById('galeria-conquistas').remove(); document.body.style.overflow='';" class="btn-modal-x" aria-label="Fechar">
                            <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
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
                            
                            <!-- Streak (JOs 2026-06-02: trocou 🔥 por ovelha do Bom Pastor) -->
                            <div class="inline-flex items-center gap-2 bg-orange-500/20 px-3 py-1.5 rounded-full mb-4">
                                <img src="icones/emoji-sheep.png" alt="" style="width:22px;height:22px;display:inline-block;vertical-align:middle;">
                                <span class="text-orange-300 text-sm font-semibold">${dados.streakAtual || 0} ${(dados.streakAtual || 0) === 1 ? 'dia' : 'dias'} em oração</span>
                            </div>
                            
                            <!-- Texto e site -->
                            <p class="text-white/60 text-xs mb-1">Baixe o app e comece sua jornada</p>
                            <p class="text-purple-300 text-sm font-semibold mb-4">▶ Disponível na Google Play</p>
                            
                            <!-- Botão -->
                            <div class="flex justify-center">
                                <button onclick="SistemaConquistas.compartilhar()" class="py-2.5 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white text-sm font-semibold transition-all flex items-center justify-center gap-2">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/></svg>
                                    Compartilhar
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Resumo -->
                    <div class="bg-gradient-to-br from-yellow-600/20 to-orange-600/20  rounded-2xl p-4 border border-yellow-500/30">
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
                                        // Todas as conquistas são clicáveis para ver o significado
                                        return `
                                            <div class="relative cursor-pointer ${obtida ? '' : 'opacity-40'}" onclick="SistemaConquistas.mostrarSignificado('${c.id}')">
                                                <div class="bg-white/5 rounded-xl p-3 border ${obtida ? 'border-yellow-500/50' : 'border-white/10'} text-center hover:bg-white/10 transition-all">
                                                    <div class="w-12 h-12 mx-auto mb-2 rounded-full ${obtida ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-white/10'} flex items-center justify-center">
                                                        <span class="text-2xl ${obtida ? '' : 'grayscale'}">${c.icone}</span>
                                                    </div>
                                                    <p class="text-white text-xs font-semibold truncate">${c.nome}</p>
                                                    <p class="text-yellow-400/70 text-[10px]">+${c.pontos} pts</p>
                                                </div>
                                                ${!obtida ? '<div class="absolute inset-0 flex items-center justify-center pointer-events-none"><span class="text-2xl">🔒</span></div>' : ''}
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

    // Mostrar modal com significado da conquista
    mostrarSignificado(conquistaId) {
        const conquista = this.conquistas.find(c => c.id === conquistaId);
        if (!conquista) return;
        
        const conquistadas = this.carregarConquistadas();
        const obtida = conquistadas.includes(conquistaId);
        
        // Remover modal anterior se existir
        const existente = document.getElementById('modal-significado');
        if (existente) existente.remove();
        
        const modal = document.createElement('div');
        modal.id = 'modal-significado';
        modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        modal.style.background = 'rgba(0,0,0,0.85)';
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        
        modal.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-purple-500/30 animate-scale-in">
                <div class="text-center mb-4">
                    <div class="w-20 h-20 mx-auto mb-3 rounded-full ${obtida ? 'bg-gradient-to-br from-yellow-400 to-orange-500' : 'bg-white/10'} flex items-center justify-center shadow-lg">
                        <span class="text-4xl ${obtida ? '' : 'grayscale'}">${conquista.icone}</span>
                    </div>
                    <h3 class="text-xl font-bold ${obtida ? 'text-yellow-400' : 'text-white/60'}">${conquista.nome}</h3>
                    <p class="text-white/70 text-sm">${conquista.descricao}</p>
                    <div class="flex items-center justify-center gap-2 mt-2">
                        <span class="text-yellow-400 text-sm font-semibold">+${conquista.pontos} pontos</span>
                        ${obtida ? '<span class="bg-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">✓ Conquistada</span>' : '<span class="bg-white/10 text-white/50 text-xs px-2 py-0.5 rounded-full">🔒 Bloqueada</span>'}
                    </div>
                </div>
                
                <div class="bg-black/30 rounded-xl p-4 mb-4">
                    <p class="text-white/60 text-xs uppercase tracking-wide mb-2">✨ Significado Espiritual</p>
                    <p class="text-white/90 text-sm leading-relaxed">${conquista.significado || 'Continue sua jornada de fé para descobrir o significado desta conquista.'}</p>
                </div>
                
                <button onclick="document.getElementById('modal-significado').remove()" class="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all">
                    Fechar
                </button>
            </div>
            
            <style>
                @keyframes scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.2s ease-out; }
            </style>
        `;
        
        document.body.appendChild(modal);
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
        
        // Título (sem emoji para compatibilidade)
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 32px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏅 Minhas Conquistas', 300, 60);
        
        // Medalha decorativa
        ctx.font = 'bold 48px Arial';
        ctx.fillText('★', 300, 130);
        
        // Desenhar círculos das medalhas
        const medalhaY = 220;
        const medalhaSize = 70;
        const numMedalhas = Math.max(ultimasConquistas.length, 1);
        const startX = numMedalhas === 1 ? 300 : 
                       numMedalhas === 2 ? 230 : 160;
        
        for (let i = 0; i < Math.max(ultimasConquistas.length, 1); i++) {
            const x = startX + (i * 140);
            
            // Círculo dourado
            const gradMedalha = ctx.createRadialGradient(x, medalhaY, 0, x, medalhaY, medalhaSize/2);
            gradMedalha.addColorStop(0, '#FFD700');
            gradMedalha.addColorStop(1, '#FF8C00');
            ctx.fillStyle = gradMedalha;
            ctx.beginPath();
            ctx.arc(x, medalhaY, medalhaSize/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Número ou estrela dentro
            ctx.fillStyle = '#1a0a2e';
            ctx.font = 'bold 28px Arial';
            ctx.fillText(ultimasConquistas[i] ? '★' : '?', x, medalhaY + 10);
        }
        
        // Stats
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(`${conquistadas.length} conquistas`, 300, 340);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '26px Arial';
        ctx.fillText(`${totalPontos} pontos de fé`, 300, 385);
        
        // Streak
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(`🔥 ${dados.streakAtual || 0} ${(dados.streakAtual || 0) === 1 ? 'dia' : 'dias'} em oração`, 300, 470);
        
        // Linha decorativa
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(100, 530);
        ctx.lineTo(500, 530);
        ctx.stroke();
        
        // Texto convite
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '22px Arial';
        ctx.fillText('Baixe o app e comece sua jornada', 300, 590);
        
        // Logo/Site
        ctx.fillStyle = '#9333EA';
        ctx.font = 'bold 28px Arial';
        ctx.fillText('✝️ Converse com Maria', 300, 670);
        
        ctx.fillStyle = '#C084FC';
        ctx.font = '24px Arial';
        ctx.fillText('▶ Disponível na Google Play', 300, 715);
        
        // Cruz decorativa
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 36px Arial';
        ctx.fillText('✝', 300, 770);
        
        // Converter para blob usando toDataURL (mais compatível)
        return new Promise((resolve, reject) => {
            try {
                const dataURL = canvas.toDataURL('image/png');
                // Converter data URL para blob
                const byteString = atob(dataURL.split(',')[1]);
                const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];
                const ab = new ArrayBuffer(byteString.length);
                const ia = new Uint8Array(ab);
                for (let i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }
                const blob = new Blob([ab], { type: mimeString });
                resolve(blob);
            } catch (error) {
                console.error('Erro ao gerar imagem:', error);
                reject(error);
            }
        });
    },

    // Gerar canvas da imagem
    async gerarCanvas() {
        const conquistadas = this.carregarConquistadas();
        const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
        const totalPontos = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .reduce((sum, c) => sum + c.pontos, 0);
        
        const ultimasConquistas = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .slice(-3);
        
        // Criar canvas com proporções maiores para qualidade
        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = 1920;
        const ctx = canvas.getContext('2d');
        
        // ========== FUNDO GRADIENTE ROXO ==========
        const gradient = ctx.createLinearGradient(0, 0, 0, 1920);
        gradient.addColorStop(0, '#1a0a2e');
        gradient.addColorStop(0.3, '#2d1b4e');
        gradient.addColorStop(0.7, '#2d1b4e');
        gradient.addColorStop(1, '#1a0a2e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1080, 1920);
        
        // ========== CARD PRINCIPAL ==========
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
        ctx.shadowBlur = 40;
        this.roundRect(ctx, 60, 120, 960, 1680, 50);
        ctx.fill();
        ctx.shadowBlur = 0;
        
        // Borda dourada
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.3)';
        ctx.lineWidth = 3;
        this.roundRect(ctx, 60, 120, 960, 1680, 50);
        ctx.stroke();
        
        // ========== TÍTULO ==========
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 64px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('🏅 Minhas Conquistas', 540, 220);
        
        // ========== MEDALHAS ==========
        const medalhaY = 420;
        const medalhaSize = 140;
        const numMedalhas = Math.max(ultimasConquistas.length, 1);
        const startX = numMedalhas === 1 ? 540 : 
                       numMedalhas === 2 ? 390 : 240;
        
        for (let i = 0; i < Math.max(ultimasConquistas.length, 1); i++) {
            const x = startX + (i * 300);
            
            // Círculo dourado com gradiente
            const gradMedalha = ctx.createRadialGradient(x, medalhaY, 0, x, medalhaY, medalhaSize/2);
            gradMedalha.addColorStop(0, '#FFD700');
            gradMedalha.addColorStop(0.7, '#FF8C00');
            gradMedalha.addColorStop(1, '#B8860B');
            ctx.fillStyle = gradMedalha;
            ctx.beginPath();
            ctx.arc(x, medalhaY, medalhaSize/2, 0, Math.PI * 2);
            ctx.fill();
            
            // Borda da medalha
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 4;
            ctx.stroke();
            
            // Ícone dentro da medalha
            ctx.fillStyle = '#1a0a2e';
            ctx.font = '60px Arial';
            const icone = ultimasConquistas[i] ? ultimasConquistas[i].icone : '🏅';
            ctx.fillText(icone, x, medalhaY + 20);
        }
        
        // ========== STATS ==========
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 72px Arial';
        ctx.fillText(`${conquistadas.length} conquistas`, 540, 620);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '48px Arial';
        ctx.fillText(`${totalPontos} pontos de fé`, 540, 700);
        
        // ========== BARRA DE STREAK ==========
        // Fundo da barra
        ctx.fillStyle = 'rgba(249, 115, 22, 0.3)';
        this.roundRect(ctx, 200, 780, 680, 100, 50);
        ctx.fill();
        
        ctx.fillStyle = '#FF6B35';
        ctx.font = 'bold 48px Arial';
        ctx.fillText(`🔥 ${dados.streakAtual || 0} ${(dados.streakAtual || 0) === 1 ? 'dia' : 'dias'} em oração`, 540, 850);
        
        // ========== BARRA DE PROGRESSO ==========
        const progresso = (conquistadas.length / this.conquistas.length) * 100;
        
        // Fundo da barra
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        this.roundRect(ctx, 150, 950, 780, 30, 15);
        ctx.fill();
        
        // Progresso
        const gradProgresso = ctx.createLinearGradient(150, 0, 930, 0);
        gradProgresso.addColorStop(0, '#FFD700');
        gradProgresso.addColorStop(1, '#FF8C00');
        ctx.fillStyle = gradProgresso;
        this.roundRect(ctx, 150, 950, 780 * (progresso / 100), 30, 15);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '28px Arial';
        ctx.fillText(`${Math.round(progresso)}% completo`, 540, 1030);
        
        // ========== LINHA DECORATIVA ==========
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(200, 1120);
        ctx.lineTo(880, 1120);
        ctx.stroke();
        
        // ========== CONVITE ==========
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '40px Arial';
        ctx.fillText('Baixe o app e comece sua jornada!', 540, 1220);
        
        // ========== LOGO ==========
        ctx.font = '80px Arial';
        ctx.fillText('🙏', 540, 1360);
        
        ctx.fillStyle = '#9333EA';
        ctx.font = 'bold 52px Arial';
        ctx.fillText('Converse com Maria', 540, 1460);
        
        // ========== SITE ==========
        ctx.fillStyle = '#C084FC';
        ctx.font = '40px Arial';
        ctx.fillText('▶ Disponível na Google Play', 540, 1540);
        
        // ========== CRUZ DECORATIVA ==========
        ctx.fillStyle = '#FFD700';
        ctx.font = '60px Arial';
        ctx.fillText('✝️', 540, 1650);
        
        return canvas;
    },
    
    // Função auxiliar para desenhar retângulo arredondado
    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    // Baixar imagem
    async baixarImagem() {
        try {
            showToast('Gerando imagem...');
            const canvas = await this.gerarCanvasHTML();
            const dataURL = canvas.toDataURL('image/png');
            
            // Usar CompartilharService se disponível
            if (window.CompartilharService) {
                CompartilharService.baixarImagem(dataURL, 'minhas-conquistas-maria.png');
            } else {
                const a = document.createElement('a');
                a.href = dataURL;
                a.download = 'minhas-conquistas-maria.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }
            
            showToast('Imagem salva!');
        } catch (error) {
            console.error('Erro ao baixar:', error);
            showToast('Erro ao gerar imagem');
        }
    },

    // Gerar canvas via HTML (idêntico ao card)
    async gerarCanvasHTML() {
        const conquistadas = this.carregarConquistadas();
        const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
        const totalPontos = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .reduce((sum, c) => sum + c.pontos, 0);
        
        const ultimasConquistas = this.conquistas
            .filter(c => conquistadas.includes(c.id))
            .slice(-3);
        
        const progresso = Math.round((conquistadas.length / this.conquistas.length) * 100);
        
        // Criar elemento HTML que replica o card
        const container = document.createElement('div');
        container.id = 'conquistas-para-compartilhar';
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: 0;
            width: 400px;
            background: linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
            border-radius: 24px;
            padding: 32px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;
        
        // Gerar medalhas HTML
        const medalhasHTML = ultimasConquistas.length > 0 
            ? ultimasConquistas.map(c => `
                <div style="width: 64px; height: 64px; background: linear-gradient(135deg, #facc15, #f97316); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
                    <span style="font-size: 28px;">${c.icone}</span>
                </div>
            `).join('')
            : '<div style="width: 64px; height: 64px; background: rgba(255,255,255,0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center;"><span style="font-size: 28px;">🏅</span></div>';
        
        container.innerHTML = `
            <div style="text-align: center;">
                <!-- Título -->
                <h1 style="color: #fbbf24; font-size: 28px; font-weight: bold; margin: 0 0 20px 0;">🏅 Minhas Conquistas</h1>
                
                <!-- Medalhas -->
                <div style="display: flex; justify-content: center; gap: 12px; margin-bottom: 20px;">
                    ${medalhasHTML}
                </div>
                
                <!-- Stats -->
                <p style="color: #fbbf24; font-weight: bold; font-size: 24px; margin: 0 0 4px 0;">${conquistadas.length} conquistas</p>
                <p style="color: rgba(255,255,255,0.7); font-size: 16px; margin: 0 0 12px 0;">${totalPontos} pontos de fé</p>
                
                <!-- Streak -->
                <div style="background: rgba(249, 115, 22, 0.25); border-radius: 50px; padding: 8px 20px; margin-bottom: 20px; display: inline-block; text-align: center;">
                    <span style="font-size: 18px; display: block; line-height: 1.2;">🔥</span>
                    <span style="color: #fdba74; font-size: 16px; font-weight: 600; display: block;">${dados.streakAtual || 0} ${(dados.streakAtual || 0) === 1 ? 'dia' : 'dias'} em oração</span>
                </div>
                
                <!-- Barra de progresso -->
                <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; margin-bottom: 8px; overflow: hidden;">
                    <div style="width: ${progresso}%; height: 100%; background: linear-gradient(to right, #facc15, #f97316); border-radius: 4px;"></div>
                </div>
                <p style="color: rgba(255,255,255,0.5); font-size: 12px; margin: 0 0 20px 0;">${progresso}% completo</p>
                
                <!-- Divider -->
                <div style="width: 60%; height: 1px; background: rgba(255,255,255,0.2); margin: 0 auto 20px;"></div>
                
                <!-- Call to action -->
                <p style="color: rgba(255,255,255,0.6); font-size: 14px; margin: 0 0 8px 0;">Baixe o app e comece sua jornada!</p>
                
                <!-- Logo -->
                <img src="icones/maos-rezando.png" alt="" style="width:44px;height:44px;margin:0 auto 8px;display:block;">
                <p style="color: #a78bfa; font-weight: bold; font-size: 18px; margin: 0 0 4px 0;">Converse com Maria</p>
                <p style="color: #c4b5fd; font-size: 14px; margin: 0;">▶ Disponível na Google Play</p>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Aguardar renderização
        await new Promise(r => setTimeout(r, 100));
        
        // Capturar com html2canvas
        const canvas = await html2canvas(container, {
            scale: 3,
            backgroundColor: null,
            useCORS: true,
            logging: false
        });
        
        // Remover elemento
        document.body.removeChild(container);
        
        return canvas;
    },

    // Compartilhar
    async compartilhar() {
        // Mostrar loading
        if (window.LoadingCompartilhar) {
            LoadingCompartilhar.mostrar('Preparando conquistas...');
        }
        
        try {
            const conquistadas = this.carregarConquistadas();
            const dados = window.EstatisticasOracao ? EstatisticasOracao.carregar() : {};
            const totalPontos = this.conquistas
                .filter(c => conquistadas.includes(c.id))
                .reduce((sum, c) => sum + c.pontos, 0);
            
            const texto = `🏅 Minhas conquistas no Converse com Maria!

✨ ${conquistadas.length} conquistas
⭐ ${totalPontos} pontos de fé
🔥 ${dados.streakAtual || 0} ${(dados.streakAtual || 0) === 1 ? 'dia' : 'dias'} em oração

Baixe o app e comece sua jornada!
🙏 https://play.google.com/store/apps/details?id=com.conversemaria.app`;
            
            // Gerar canvas via HTML
            const canvas = await this.gerarCanvasHTML();
            
            // Usar CompartilharService
            if (window.CompartilharService) {
                await CompartilharService.compartilharComImagem(
                    canvas,
                    'Minhas Conquistas - Converse com Maria',
                    texto
                );
            } else {
                // Fallback
                const dataURL = canvas.toDataURL('image/png');
                const blob = await fetch(dataURL).then(r => r.blob());
                const file = new File([blob], 'minhas-conquistas-maria.png', { type: 'image/png' });
                
                if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({
                        title: 'Minhas Conquistas - Converse com Maria',
                        text: texto,
                        files: [file]
                    });
                } else if (navigator.share) {
                    await navigator.share({
                        title: 'Minhas Conquistas - Converse com Maria',
                        text: texto,
                        url: 'https://play.google.com/store/apps/details?id=com.conversemaria.app'
                    });
                } else {
                    await navigator.clipboard.writeText(texto);
                    showToast('Texto copiado!');
                }
            }
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Erro ao compartilhar:', error);
                showToast('Erro ao compartilhar');
            }
        } finally {
            // Esconder loading sempre
            if (window.LoadingCompartilhar) {
                LoadingCompartilhar.esconder();
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
