// ========================================
// 📿 TERÇO GUIADO - CONVERSE COM MARIA
// Maria conduzindo cada mistério com ÁUDIO
// ========================================

const TercoGuiado = {
    // Estado atual do terço
    estado: {
        ativo: false,
        misterioAtual: 0,
        dezenaAtual: 0,
        aveAtual: 0,
        tipoMisterio: null,
        audioAtivo: null,
        carregandoAudio: false
    },

    // API URL
    API_URL: 'https://converse-com-maria-production.up.railway.app',

    // Áudios MP3 pré-gravados das orações (vozes humanas)
    // Chave = chave em `oracoes`. Se não tiver match, cai pro "Áudio em breve".
    audios: {
        peloSinal:    'audio/terco/pelo-sinal.mp3',
        sinalCruz:    'audio/terco/sinal-da-cruz.mp3',
        oferecimento: 'audio/terco/oferecimento.mp3',
        creio:        'audio/terco/creio.mp3',
        paiNosso:     'audio/terco/pai-nosso.mp3',
        aveMaria:     'audio/terco/ave-maria.mp3',
        gloria:       'audio/terco/gloria.mp3',
        fatima:       'audio/terco/fatima.mp3',
        salveRainha:  'audio/terco/salve-rainha.mp3'
    },

    // Orações do terço
    oracoes: {
        peloSinal: {
            titulo: "Pelo Sinal da Santa Cruz",
            texto: "Pelo sinal da Santa Cruz, livrai-nos, Deus, Nosso Senhor, dos nossos inimigos.",
            instrucao: "Com a mão direita aberta, faça 3 pequenas cruzes: uma na testa, outra nos lábios e outra no peito"
        },
        sinalCruz: {
            titulo: "Sinal da Cruz",
            texto: "Em nome do Pai, do Filho e do Espírito Santo. Amém.",
            instrucao: "Com a mão direita, toque: testa (Pai), peito (Filho), ombro esquerdo e direito (Espírito Santo)"
        },
        oferecimento: {
            titulo: "Oferecimento do Terço",
            texto: "Divino Jesus, nós Vos oferecemos este terço que vamos rezar, meditando nos mistérios da Vossa Redenção. Concedei-nos, por intercessão da Virgem Maria, Mãe de Deus e nossa Mãe, as virtudes que nos são necessárias para bem rezá-lo e a graça de ganharmos as indulgências desta santa devoção.",
            instrucao: "Segure o terço com as duas mãos, em posição de oração"
        },
        creio: {
            titulo: "Credo Apostólico", 
            texto: `Creio em Deus Pai Todo-Poderoso, criador do céu e da terra, e em Jesus Cristo, Seu único Filho Nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado; desceu à mansão dos mortos, ressuscitou ao terceiro dia, subiu aos céus, está sentado à direita de Deus Pai Todo-Poderoso, donde há de vir a julgar os vivos e mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne e na vida eterna. Amém.`,
            instrucao: "📿 Segure o CRUCIFIXO do terço"
        },
        paiNosso: {
            titulo: "Pai Nosso",
            texto: `Pai nosso que estais nos céus, santificado seja o Vosso nome, venha a nós o Vosso Reino, seja feita a Vossa vontade, assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido. Não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`,
            instrucao: "📿 Na CONTA GRANDE (bolinha maior)"
        },
        aveMaria: {
            titulo: "Ave Maria",
            texto: `Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o Fruto do vosso ventre, Jesus. Santa Maria Mãe de Deus, rogai por nós, os pecadores, agora e na hora de nossa morte. Amém.`,
            instrucao: "📿 Nas CONTAS PEQUENAS (bolinhas menores) - são 10 por dezena"
        },
        gloria: {
            titulo: "Glória ao Pai",
            texto: "Glória ao Pai, ao Filho e ao Espírito Santo. Assim como era no princípio, agora e sempre, e por todos os séculos dos séculos. Amém.",
            instrucao: "📿 Ao FINAL de cada dezena (após as 10 Ave Marias)"
        },
        fatima: {
            titulo: "Oração de Fátima",
            texto: "Ó meu Jesus, perdoai-nos e livrai-nos do fogo do inferno; levai as almas todas para o Céu, e socorrei principalmente as que mais precisarem.",
            instrucao: "📿 Logo após o Glória ao Pai, antes de passar para o próximo mistério"
        },
        salveRainha: {
            titulo: "Salve Rainha",
            texto: `Salve Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degradados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia pois advogada nossa, esses vossos olhos misericordiosos a nós volvei. E depois deste desterro, mostrai-nos Jesus, bendito fruto de vosso ventre. Ó clemente! Ó piedosa! Ó doce sempre Virgem Maria! Rogai por nós Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`,
            instrucao: "📿 Oração FINAL do Terço - segure a medalha de Nossa Senhora"
        }
    },

    // Mistérios do Rosário
    misterios: {
        gozosos: {
            nome: "Mistérios Gozosos",
            dias: ["Segunda-feira", "Sábado"],
            cor: "#FFD700",
            lista: [
                {
                    titulo: "1º Mistério: A Anunciação",
                    fruto: "Humildade",
                    texto: "O Anjo Gabriel anuncia a Maria que ela será a Mãe do Salvador. Maria responde com fé: 'Eis aqui a serva do Senhor'.",
                    referencia: "Lucas 1, 26-38",
                    meditacao: "Contemplemos a humildade de Maria ao aceitar o plano de Deus. Peçamos a graça de dizer 'sim' às vontades do Senhor em nossa vida."
                },
                {
                    titulo: "2º Mistério: A Visitação",
                    fruto: "Caridade",
                    texto: "Maria visita sua prima Isabel. Ao ouvir a saudação de Maria, o menino salta de alegria no ventre de Isabel.",
                    referencia: "Lucas 1, 39-56",
                    meditacao: "Maria leva Jesus aos outros. Peçamos a graça de sermos missionários, levando Cristo a todos que encontramos."
                },
                {
                    titulo: "3º Mistério: O Nascimento de Jesus",
                    fruto: "Pobreza de espírito",
                    texto: "Jesus nasce em Belém, numa manjedoura. Os anjos anunciam aos pastores: 'Glória a Deus nas alturas!'",
                    referencia: "Lucas 2, 1-20",
                    meditacao: "Deus se fez pequeno por amor a nós. Peçamos a graça do desprendimento dos bens materiais."
                },
                {
                    titulo: "4º Mistério: A Apresentação no Templo",
                    fruto: "Obediência",
                    texto: "Maria e José apresentam Jesus no Templo. Simeão profetiza que uma espada traspassará o coração de Maria.",
                    referencia: "Lucas 2, 22-35",
                    meditacao: "Maria obedece à Lei mesmo sendo a Mãe de Deus. Peçamos a graça da obediência fiel."
                },
                {
                    titulo: "5º Mistério: Jesus Perdido e Encontrado no Templo",
                    fruto: "Busca de Deus",
                    texto: "Aos 12 anos, Jesus é encontrado no Templo, entre os doutores. 'Não sabíeis que devo estar na casa de meu Pai?'",
                    referencia: "Lucas 2, 41-52",
                    meditacao: "Maria buscou Jesus com angústia. Peçamos a graça de buscar sempre a Deus, especialmente quando O perdemos pelo pecado."
                }
            ]
        },
        luminosos: {
            nome: "Mistérios Luminosos",
            dias: ["Quinta-feira"],
            cor: "#87CEEB",
            lista: [
                {
                    titulo: "1º Mistério: O Batismo de Jesus",
                    fruto: "Fidelidade às promessas do Batismo",
                    texto: "Jesus é batizado por João no rio Jordão. O Espírito Santo desce como pomba e o Pai declara: 'Este é meu Filho amado'.",
                    referencia: "Mateus 3, 13-17",
                    meditacao: "Jesus se solidariza com os pecadores. Peçamos a graça de viver nosso batismo com fidelidade."
                },
                {
                    titulo: "2º Mistério: As Bodas de Caná",
                    fruto: "Confiança na intercessão de Maria",
                    texto: "Maria intercede junto a Jesus: 'Eles não têm mais vinho'. Jesus realiza seu primeiro milagre.",
                    referencia: "João 2, 1-12",
                    meditacao: "Maria está atenta às nossas necessidades. Peçamos a graça de confiar em sua poderosa intercessão."
                },
                {
                    titulo: "3º Mistério: O Anúncio do Reino",
                    fruto: "Conversão",
                    texto: "Jesus anuncia: 'Convertei-vos e crede no Evangelho'. O Reino de Deus está próximo!",
                    referencia: "Marcos 1, 14-15",
                    meditacao: "Jesus nos chama à conversão diária. Peçamos a graça de um coração sempre aberto à mudança."
                },
                {
                    titulo: "4º Mistério: A Transfiguração",
                    fruto: "Desejo do Céu",
                    texto: "No monte Tabor, Jesus se transfigura diante de Pedro, Tiago e João. Seu rosto brilha como o sol.",
                    referencia: "Mateus 17, 1-8",
                    meditacao: "Jesus revela sua glória divina. Peçamos a graça de desejar ardentemente a vida eterna."
                },
                {
                    titulo: "5º Mistério: A Instituição da Eucaristia",
                    fruto: "Amor à Eucaristia",
                    texto: "Na Última Ceia, Jesus institui a Eucaristia: 'Isto é o meu Corpo... Isto é o meu Sangue'.",
                    referencia: "Lucas 22, 14-20",
                    meditacao: "Jesus se dá inteiramente a nós. Peçamos a graça de amar e receber dignamente a Eucaristia."
                }
            ]
        },
        dolorosos: {
            nome: "Mistérios Dolorosos",
            dias: ["Terça-feira", "Sexta-feira"],
            cor: "#8B0000",
            lista: [
                {
                    titulo: "1º Mistério: A Agonia no Horto",
                    fruto: "Contrição",
                    texto: "Jesus sua sangue no Getsêmani. 'Pai, se possível, afasta de mim este cálice. Mas não seja como eu quero, e sim como Tu queres'.",
                    referencia: "Mateus 26, 36-46",
                    meditacao: "Jesus aceita o cálice do sofrimento por nós. Peçamos a graça do arrependimento sincero."
                },
                {
                    titulo: "2º Mistério: A Flagelação",
                    fruto: "Mortificação",
                    texto: "Jesus é cruelmente açoitado. Por suas chagas fomos curados.",
                    referencia: "João 19, 1",
                    meditacao: "Jesus sofreu em seu corpo por nossos pecados. Peçamos a graça de mortificar nossos sentidos."
                },
                {
                    titulo: "3º Mistério: A Coroação de Espinhos",
                    fruto: "Desprezo do mundo",
                    texto: "Os soldados coroam Jesus com espinhos e zombam: 'Salve, rei dos judeus!'",
                    referencia: "Mateus 27, 27-31",
                    meditacao: "Jesus é humilhado por nós. Peçamos a graça de não nos importar com o que o mundo pensa."
                },
                {
                    titulo: "4º Mistério: Jesus Carrega a Cruz",
                    fruto: "Paciência nas provações",
                    texto: "Jesus carrega a pesada cruz até o Calvário. No caminho, encontra sua Mãe dolorosa.",
                    referencia: "João 19, 17",
                    meditacao: "Jesus carregou a cruz por amor. Peçamos a graça de carregar nossas cruzes com paciência."
                },
                {
                    titulo: "5º Mistério: A Crucificação e Morte",
                    fruto: "Salvação das almas",
                    texto: "Jesus é crucificado. 'Pai, perdoa-lhes, pois não sabem o que fazem'. Entrega o espírito.",
                    referencia: "Lucas 23, 33-46",
                    meditacao: "Jesus morre para nos salvar. Peçamos a graça de salvar almas pela oração e sacrifício."
                }
            ]
        },
        gloriosos: {
            nome: "Mistérios Gloriosos",
            dias: ["Quarta-feira", "Domingo"],
            cor: "#FFD700",
            lista: [
                {
                    titulo: "1º Mistério: A Ressurreição",
                    fruto: "Fé",
                    texto: "Jesus ressuscita ao terceiro dia! 'Não está aqui, ressuscitou!' O túmulo está vazio.",
                    referencia: "Lucas 24, 1-12",
                    meditacao: "Cristo venceu a morte! Peçamos a graça de uma fé inabalável na ressurreição."
                },
                {
                    titulo: "2º Mistério: A Ascensão",
                    fruto: "Esperança",
                    texto: "Jesus sobe aos Céus diante dos apóstolos. 'Estarei convosco todos os dias até o fim dos tempos'.",
                    referencia: "Atos 1, 9-11",
                    meditacao: "Jesus prepara um lugar para nós no Céu. Peçamos a graça de viver na esperança do Céu."
                },
                {
                    titulo: "3º Mistério: A Descida do Espírito Santo",
                    fruto: "Dons do Espírito Santo",
                    texto: "No Cenáculo, o Espírito Santo desce sobre Maria e os apóstolos em forma de línguas de fogo.",
                    referencia: "Atos 2, 1-13",
                    meditacao: "O Espírito transforma os apóstolos. Peçamos a graça de sermos dóceis ao Espírito Santo."
                },
                {
                    titulo: "4º Mistério: A Assunção de Nossa Senhora",
                    fruto: "Graça de uma boa morte",
                    texto: "Maria é elevada ao Céu em corpo e alma. Os anjos a recebem com júbilo.",
                    referencia: "Tradição da Igreja",
                    meditacao: "Maria foi glorificada por sua fidelidade. Peçamos a graça de uma santa morte."
                },
                {
                    titulo: "5º Mistério: A Coroação de Nossa Senhora",
                    fruto: "Devoção a Maria",
                    texto: "Maria é coroada Rainha do Céu e da Terra por seu Filho Jesus.",
                    referencia: "Apocalipse 12, 1",
                    meditacao: "Maria intercede por nós junto ao Rei. Peçamos a graça de uma verdadeira devoção mariana."
                }
            ]
        }
    },

    // ========================================
    // 🔊 SISTEMA DE ÁUDIO
    // ========================================
    
    // Gera áudio via TTS do backend (mesma API do chat /api/voz).
    // Usado em meditações dos mistérios — textos únicos que não têm MP3 fixo.
    async gerarAudio(texto, botaoId) {
        if (!texto || !texto.trim()) {
            this.mostrarAvisoAudioEmBreve();
            return;
        }
        const botao = document.getElementById(botaoId);

        // Toggle pause/play se já tocando esse botão
        if (this.estado.audioAtivo && this.estado.audioBotaoAtual === botaoId) {
            if (this.estado.audioAtivo.paused) {
                this.estado.audioAtivo.play();
                this._setBotaoOuvir(botao, 'pausar');
            } else {
                this.estado.audioAtivo.pause();
                this._setBotaoOuvir(botao, 'continuar');
            }
            return;
        }

        // Para áudio anterior, se houver
        if (this.estado.audioAtivo) {
            this.estado.audioAtivo.pause();
            const btnAntigo = document.getElementById(this.estado.audioBotaoAtual);
            if (btnAntigo) this._setBotaoOuvir(btnAntigo, 'ouvir');
        }

        this._setBotaoOuvir(botao, 'carregando');

        try {
            const response = await fetch(`${this.API_URL}/api/voz`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto })
            });
            if (!response.ok) throw new Error('API voz retornou ' + response.status);

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const audio = new Audio(url);

            this.estado.audioAtivo = audio;
            this.estado.audioBotaoAtual = botaoId;

            audio.onplaying = () => this._setBotaoOuvir(botao, 'pausar');
            audio.onpause = () => {
                if (!audio.ended) this._setBotaoOuvir(botao, 'continuar');
            };
            audio.onended = () => {
                this._setBotaoOuvir(botao, 'ouvir');
                URL.revokeObjectURL(url);
                if (this.estado.audioAtivo === audio) {
                    this.estado.audioAtivo = null;
                    this.estado.audioBotaoAtual = null;
                }
            };
            audio.onerror = () => {
                console.error('Erro tocando áudio TTS terço');
                this._setBotaoOuvir(botao, 'ouvir');
                URL.revokeObjectURL(url);
                this.estado.audioAtivo = null;
                this.estado.audioBotaoAtual = null;
            };

            await audio.play();
        } catch (error) {
            console.error('Erro gerarAudio terço:', error);
            this._setBotaoOuvir(botao, 'ouvir');
            // Fallback discreto: aviso "em breve" se backend off
            this.mostrarAvisoAudioEmBreve();
        }
    },

    // Tocar oração pré-gravada (MP3 em audio/terco/)
    tocarOracao(chave, botaoId) {
        const audioPath = this.audios[chave];
        const botao = document.getElementById(botaoId);
        if (!audioPath) {
            this.mostrarAvisoAudioEmBreve();
            return;
        }

        // Se já tem áudio tocando e é o mesmo botão → toggle pause/play
        if (this.estado.audioAtivo && this.estado.audioBotaoAtual === botaoId) {
            if (this.estado.audioAtivo.paused) {
                this.estado.audioAtivo.play();
                this._setBotaoOuvir(botao, 'pausar');
            } else {
                this.estado.audioAtivo.pause();
                this._setBotaoOuvir(botao, 'continuar');
            }
            return;
        }

        // Outro áudio tocando? Parar e resetar botão anterior.
        if (this.estado.audioAtivo) {
            this.estado.audioAtivo.pause();
            const btnAntigo = document.getElementById(this.estado.audioBotaoAtual);
            if (btnAntigo) this._setBotaoOuvir(btnAntigo, 'ouvir');
        }

        // Criar novo áudio
        const audio = new Audio(audioPath);
        this.estado.audioAtivo = audio;
        this.estado.audioBotaoAtual = botaoId;

        this._setBotaoOuvir(botao, 'carregando');

        audio.onplaying = () => this._setBotaoOuvir(botao, 'pausar');
        audio.onpause = () => {
            // Só atualiza se NÃO chegou ao fim (onended trata o reset)
            if (!audio.ended) this._setBotaoOuvir(botao, 'continuar');
        };
        audio.onended = () => {
            this._setBotaoOuvir(botao, 'ouvir');
            if (this.estado.audioAtivo === audio) {
                this.estado.audioAtivo = null;
                this.estado.audioBotaoAtual = null;
            }
        };
        audio.onerror = (e) => {
            console.error('Erro ao carregar áudio do terço:', audioPath, e);
            this._setBotaoOuvir(botao, 'ouvir');
            this.mostrarAvisoAudioEmBreve();
            this.estado.audioAtivo = null;
            this.estado.audioBotaoAtual = null;
        };

        audio.play().catch(err => {
            console.error('Erro ao tocar:', err);
            this._setBotaoOuvir(botao, 'ouvir');
        });
    },

    // Helper: muda texto/ícone do botão "Ouvir Maria"
    _setBotaoOuvir(botao, estado) {
        if (!botao) return;
        const labels = {
            ouvir:      '<span>🔊</span><span>Ouvir Maria</span>',
            carregando: '<span>⏳</span><span>Carregando...</span>',
            pausar:     '<span>⏸️</span><span>Pausar</span>',
            continuar:  '<span>▶️</span><span>Continuar</span>'
        };
        botao.innerHTML = labels[estado] || labels.ouvir;
    },
    
    mostrarAvisoAudioEmBreve() {
        // Remover aviso anterior se existir
        const avisoExistente = document.getElementById('aviso-audio-terco');
        if (avisoExistente) avisoExistente.remove();
        
        const aviso = document.createElement('div');
        aviso.id = 'aviso-audio-terco';
        aviso.className = 'fixed inset-0 z-[70] flex items-center justify-center p-4';
        aviso.style.background = 'rgba(0,0,0,0.8)';
        aviso.onclick = (e) => { if (e.target === aviso) aviso.remove(); };
        
        aviso.innerHTML = `
            <div class="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center animate-pulse-once">
                <div class="text-6xl mb-4">🎙️</div>
                <h3 class="text-xl font-bold text-white mb-3">Áudio em breve!</h3>
                <p class="text-white/80 mb-4">
                    Estamos preparando orações gravadas por vozes humanas reais para uma experiência ainda mais acolhedora.
                </p>
                <p class="text-yellow-400 text-sm mb-6">
                    ✨ Por enquanto, reze acompanhando o texto na tela.
                </p>
                <button onclick="this.parentElement.parentElement.remove()" class="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl transition-all">
                    Entendi 🙏
                </button>
            </div>
        `;
        
        document.body.appendChild(aviso);
    },
    
    pausarAudio(botaoId, textoOriginal) {
        if (this.estado.audioAtivo) {
            this.estado.audioAtivo.pause();
            const botao = document.getElementById(botaoId);
            if (botao) {
                botao.innerHTML = '▶️ Continuar';
                botao.onclick = () => this.continuarAudio(botaoId, textoOriginal);
            }
        }
    },
    
    continuarAudio(botaoId, textoOriginal) {
        if (this.estado.audioAtivo) {
            this.estado.audioAtivo.play();
            const botao = document.getElementById(botaoId);
            if (botao) {
                botao.innerHTML = '⏸️ Pausar';
                botao.onclick = () => this.pausarAudio(botaoId, textoOriginal);
            }
        }
    },
    
    pararAudio() {
        if (this.estado.audioAtivo) {
            this.estado.audioAtivo.pause();
            this.estado.audioAtivo.currentTime = 0;
            this.estado.audioAtivo = null;
        }
    },

    // Obter mistério do dia
    getMisterioDoDia() {
        const dia = new Date().getDay();
        const diasSemana = {
            0: 'gloriosos', 1: 'gozosos', 2: 'dolorosos',
            3: 'gloriosos', 4: 'luminosos', 5: 'dolorosos', 6: 'gozosos'
        };
        return diasSemana[dia];
    },

    // Iniciar o terço
    iniciar(tipo = null) {
        this.estado.tipoMisterio = tipo || this.getMisterioDoDia();
        this.estado.ativo = true;
        this.estado.misterioAtual = 0;
        this.estado.dezenaAtual = 0;
        this.estado.aveAtual = 0;
        this.pararAudio();
        this.renderizar();
    },

    // Renderizar interface do terço
    renderizar() {
        const misterios = this.misterios[this.estado.tipoMisterio];
        
        // Se o modal já existe, apenas atualiza o conteúdo (sem piscar)
        const existente = document.getElementById('modal-terco');
        if (existente) {
            // Atualizar só as partes que mudam
            const conteudo = document.getElementById('terco-conteudo');
            if (conteudo) conteudo.innerHTML = this.renderizarEtapaAtual();
            
            const progresso = document.getElementById('terco-progresso');
            if (progresso) progresso.innerHTML = this.renderizarProgressoRosario();
            
            const btnAnterior = document.getElementById('terco-btn-anterior');
            if (btnAnterior) {
                if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0) {
                    btnAnterior.classList.add('opacity-30', 'pointer-events-none');
                } else {
                    btnAnterior.classList.remove('opacity-30', 'pointer-events-none');
                }
            }
            
            const btnProximo = document.getElementById('terco-btn-proximo');
            if (btnProximo) {
                btnProximo.textContent = this.estado.misterioAtual === 6 ? '✓ Concluir' : 'Próximo →';
            }
            
            // Scroll para o topo do conteúdo (exceto contagem de Ave Marias)
            const scrollContainer = document.getElementById('terco-scroll-container');
            if (scrollContainer) {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            return;
        }
        
        // Criar modal pela primeira vez
        const modal = document.createElement('div');
        modal.id = 'modal-terco';
        modal.className = 'fixed inset-0 z-50 flex flex-col';
        modal.style.background = 'linear-gradient(135deg, #1a0a20 0%, #2d1810 50%, #1a0a0a 100%)';
        
        modal.innerHTML = `
            <div id="terco-scroll-container" class="flex-1 overflow-y-auto pb-32">
                <!-- Header com safe-area para notch -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 pb-8" style="padding-top: calc(1rem + env(safe-area-inset-top, 0px));">
                    <div class="flex items-center justify-between">
                        <button onclick="TercoGuiado.fechar()" class="p-2 bg-white/10 rounded-full hover:bg-white/20">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <div class="text-center">
                            <h1 class="text-white font-bold">📿 Santo Terço</h1>
                            <p class="text-yellow-400 text-sm">${misterios.nome}</p>
                        </div>
                        <div class="w-10"></div>
                    </div>
                </div>
                
                <!-- Conteúdo principal -->
                <div class="px-4" id="terco-conteudo">
                    ${this.renderizarEtapaAtual()}
                </div>
            </div>
            
            <!-- Barra de progresso e navegação com safe-area -->
            <div class="fixed bottom-0 left-0 right-0 bg-black/95 p-4 border-t border-white/10" style="padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px));">
                <!-- Progresso visual -->
                <div class="flex justify-center items-center gap-1 mb-4" id="terco-progresso">
                    ${this.renderizarProgressoRosario()}
                </div>
                
                <!-- Botões -->
                <div class="flex gap-3">
                    <button id="terco-btn-anterior" onclick="TercoGuiado.anterior()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all ${this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0 ? 'opacity-30 pointer-events-none' : ''}">
                        ← Anterior
                    </button>
                    <button id="terco-btn-proximo" onclick="TercoGuiado.proximo()" class="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all">
                        ${this.estado.misterioAtual === 6 ? '✓ Concluir' : 'Próximo →'}
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Renderizar etapa atual
    renderizarEtapaAtual() {
        const misterios = this.misterios[this.estado.tipoMisterio];
        
        // Início: Pelo Sinal, Sinal da Cruz, Oferecimento e Creio
        if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0) {
            return `
                <div class="text-center mb-6">
                    <div class="text-5xl mb-3">✝️</div>
                    <h2 class="text-xl font-bold text-white">Início do Terço</h2>
                    <p class="text-white/60 text-sm mt-2">Segure o crucifixo do terço</p>
                </div>
                
                <!-- Imagem ilustrativa do terço -->
                <div class="bg-white/5 rounded-xl p-4 mb-4 text-center">
                    <p class="text-yellow-400 text-sm mb-2">📿 Estrutura do Terço</p>
                    <p class="text-white/70 text-xs">Crucifixo → 1 conta grande → 3 contas pequenas → 1 conta grande → 5 dezenas (10 contas cada)</p>
                </div>
                
                ${this.renderizarOracaoComAudio('peloSinal', 'audio-pelo-sinal')}
                ${this.renderizarOracaoComAudio('sinalCruz', 'audio-sinal')}
                ${this.renderizarOracaoComAudio('oferecimento', 'audio-oferecimento')}
                ${this.renderizarOracaoComAudio('creio', 'audio-creio')}
            `;
        }
        
        // Oferecimento (3 Ave Marias)
        if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 1) {
            return `
                <div class="text-center mb-6">
                    <div class="text-5xl mb-3">✨</div>
                    <h2 class="text-xl font-bold text-yellow-400">Oferecimento</h2>
                    <p class="text-white/70 mt-2 text-sm">Três Ave-Marias pelas virtudes teologais</p>
                </div>
                ${this.renderizarOracaoComAudio('paiNosso', 'audio-pai')}
                <div class="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-2xl p-5 mb-4 border border-blue-500/30">
                    <p class="text-blue-300 font-semibold mb-3 text-center">🙏 3 Ave-Marias</p>
                    <div class="space-y-2 text-sm text-white/80 mb-4">
                        <p>1ª - Pelo aumento da <strong class="text-yellow-400">Fé</strong></p>
                        <p>2ª - Pelo aumento da <strong class="text-green-400">Esperança</strong></p>
                        <p>3ª - Pelo aumento da <strong class="text-pink-400">Caridade</strong></p>
                    </div>
                </div>
                ${this.renderizarOracaoComAudio('aveMaria', 'audio-ave')}
                ${this.renderizarOracaoComAudio('gloria', 'audio-gloria')}
            `;
        }
        
        // Mistérios (1-5)
        if (this.estado.misterioAtual >= 1 && this.estado.misterioAtual <= 5) {
            const misterio = misterios.lista[this.estado.misterioAtual - 1];
            return this.renderizarMisterioComAudio(misterio, this.estado.misterioAtual);
        }
        
        // Final: Salve Rainha
        if (this.estado.misterioAtual === 6) {
            return `
                <div class="text-center mb-6">
                    <div class="text-6xl mb-4">👑</div>
                    <h2 class="text-2xl font-bold text-yellow-400">Oração Final</h2>
                </div>
                ${this.renderizarOracaoComAudio('salveRainha', 'audio-salve')}
                ${this.renderizarOracaoComAudio('sinalCruz', 'audio-sinal-final')}
                <div class="bg-gradient-to-r from-yellow-600/30 to-orange-600/30 rounded-2xl p-6 text-center mt-6 border border-yellow-500/30">
                    <div class="text-4xl mb-3">🎉</div>
                    <p class="text-yellow-400 font-bold text-xl mb-2">Terço Concluído!</p>
                    <p class="text-white/80">Que Nossa Senhora interceda por todas as suas intenções.</p>
                </div>
            `;
        }
        
        return '';
    },

    // Renderizar oração COM botão de áudio
    renderizarOracaoComAudio(chave, audioId) {
        const oracao = this.oracoes[chave];

        return `
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 hover:bg-white/10 transition-all">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🙏</span>
                        <h3 class="text-yellow-400 font-bold">${oracao.titulo}</h3>
                    </div>
                    <button
                        id="${audioId}"
                        onclick="TercoGuiado.tocarOracao('${chave}', '${audioId}')"
                        class="flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-full text-white text-xs font-semibold transition-all"
                    >
                        <span>🔊</span>
                        <span>Ouvir Maria</span>
                    </button>
                </div>
                <p class="text-white/50 text-xs mb-3 italic">${oracao.instrucao}</p>
                <p class="text-white leading-relaxed whitespace-pre-line">${oracao.texto}</p>
            </div>
        `;
    },

    // Renderizar mistério COM áudio
    renderizarMisterioComAudio(misterio, numero) {
        const misterios = this.misterios[this.estado.tipoMisterio];
        const meditacaoId = `audio-meditacao-${numero}`;
        
        return `
            <div class="text-center mb-6">
                <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-3" style="background: ${misterios.cor}22; border: 1px solid ${misterios.cor}44">
                    <span class="text-xl">📿</span>
                    <span class="font-bold text-white">${misterio.titulo}</span>
                </div>
                <p class="text-white/60 text-sm">Fruto: <span class="text-yellow-400 font-semibold">${misterio.fruto}</span></p>
            </div>
            
            <!-- Contemplação -->
            <div class="bg-gradient-to-br from-purple-900/40 to-pink-900/40 rounded-2xl p-5 mb-4 border border-purple-500/30">
                <h4 class="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                    <span>📖</span> Contemplação
                </h4>
                <p class="text-white leading-relaxed">${misterio.texto}</p>
                <p class="text-purple-300 text-sm mt-2 italic">${misterio.referencia}</p>
            </div>
            
            <!-- Meditação de Maria COM ÁUDIO -->
            <div class="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-2xl p-5 mb-4 border border-yellow-500/30">
                <div class="flex items-center justify-between mb-3">
                    <h4 class="text-yellow-400 font-semibold flex items-center gap-2">
                        <span>👑</span> Maria medita contigo
                    </h4>
                    <button 
                        id="${meditacaoId}"
                        onclick="TercoGuiado.gerarAudio(\`${misterio.meditacao}\`, '${meditacaoId}')"
                        class="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 rounded-full text-white text-xs font-semibold transition-all"
                    >
                        <span>🔊</span>
                        <span>Ouvir</span>
                    </button>
                </div>
                <p class="text-white/90 italic leading-relaxed">"${misterio.meditacao}"</p>
            </div>
            
            <!-- Dezena -->
            <div class="bg-white/5 rounded-2xl p-5 mb-4 border border-white/10">
                <h4 class="text-white font-semibold mb-4 text-center text-lg">${numero}ª Dezena</h4>
                
                ${this.renderizarOracaoComAudio('paiNosso', `audio-pai-${numero}`)}
                
                <div class="bg-white/5 rounded-xl p-4 mb-4">
                    <p class="text-center text-yellow-400 font-semibold mb-3">10 Ave-Marias</p>
                    <div class="flex flex-wrap justify-center gap-2 mb-4">
                        ${Array.from({length: 10}, (_, i) => `
                            <button onclick="TercoGuiado.marcarAve(${i})" class="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < this.estado.aveAtual ? 'bg-yellow-500 text-black scale-90' : 'bg-white/20 text-white hover:bg-white/30'}">${i + 1}</button>
                        `).join('')}
                    </div>
                    <button
                        id="audio-ave-${numero}"
                        onclick="TercoGuiado.tocarOracao('aveMaria', 'audio-ave-${numero}')"
                        class="w-full flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-white text-sm font-semibold transition-all mb-4"
                    >
                        <span>🔊</span>
                        <span>Ouvir Ave Maria</span>
                    </button>
                    <p class="text-white/70 text-sm text-center whitespace-pre-line">${this.oracoes.aveMaria.texto}</p>
                </div>
                
                ${this.renderizarOracaoComAudio('gloria', `audio-gloria-${numero}`)}
                ${this.renderizarOracaoComAudio('fatima', `audio-fatima-${numero}`)}
            </div>
        `;
    },

    // Marcar Ave Maria rezada (SEM resetar scroll)
    marcarAve(index) {
        this.estado.aveAtual = index + 1;
        
        // Atualizar apenas os botões das Ave Marias sem re-renderizar tudo
        const container = document.querySelector('#terco-conteudo .flex.flex-wrap.justify-center.gap-2');
        if (container) {
            const botoes = container.querySelectorAll('button');
            botoes.forEach((btn, i) => {
                if (i < this.estado.aveAtual) {
                    btn.className = 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-yellow-500 text-black scale-90';
                } else {
                    btn.className = 'w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all bg-white/20 text-white hover:bg-white/30';
                }
            });
        }
    },

    // Renderizar progresso
    renderizarProgressoRosario() {
        let html = '<div class="flex items-center gap-1">';
        
        // Cruz: destaca quando clicou pelo menos uma vez (dezenaAtual >= 1 ou misterioAtual > 0)
        const cruzAtiva = this.estado.dezenaAtual >= 1 || this.estado.misterioAtual > 0;
        html += `<span class="text-lg ${cruzAtiva ? 'opacity-100' : 'opacity-30'}">✝️</span>`;
        
        for (let i = 1; i <= 5; i++) {
            const completo = this.estado.misterioAtual > i || this.estado.misterioAtual === 6;
            const atual = this.estado.misterioAtual === i;
            html += `<div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                completo ? 'bg-yellow-500 text-black' : 
                atual ? 'bg-yellow-600 text-white ring-2 ring-yellow-400 ring-offset-2 ring-offset-black' : 
                'bg-white/20 text-white/50'
            }">${i}</div>`;
        }
        
        html += `<span class="text-lg ${this.estado.misterioAtual === 6 ? 'opacity-100' : 'opacity-30'}">👑</span>`;
        html += '</div>';
        return html;
    },

    // Navegação
    proximo() {
        this.pararAudio();
        this.estado.aveAtual = 0;
        
        if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0) {
            this.estado.dezenaAtual = 1;
        } else if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 1) {
            this.estado.misterioAtual = 1;
            this.estado.dezenaAtual = 0;
        } else if (this.estado.misterioAtual >= 1 && this.estado.misterioAtual <= 5) {
            this.estado.misterioAtual++;
        } else if (this.estado.misterioAtual === 6) {
            // Registrar terço completo nas estatísticas
            if (window.EstatisticasOracao) {
                EstatisticasOracao.registrarTerco(this.estado.tipoMisterio);
            }
            this.fechar();
            // Mostrar modal de doação após concluir
            this.mostrarModalDoacao();
            return;
        }
        this.renderizar();
    },

    // Modal de Doação após o Terço
    mostrarModalDoacao() {
        const chavePix = '00020126580014br.gov.bcb.pix0136d2a3b5eb-41a0-4204-9588-e938a23888c05204000053039865802BR5925JOSE RICARDO DOERNER NETO6014JARAGUA DO SUL62070503***6304D0E3';
        
        const modal = document.createElement('div');
        modal.id = 'modal-doacao-terco';
        modal.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.95); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
        
        modal.innerHTML = `
            <div style="
                background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                border-radius: 24px;
                max-width: 380px;
                width: 100%;
                padding: 24px;
                text-align: center;
                border: 1px solid rgba(255, 215, 0, 0.3);
                box-shadow: 0 0 40px rgba(255, 215, 0, 0.1);
                animation: slideUp 0.4s ease;
            ">
                <!-- Ícone de sucesso -->
                <div style="font-size: 60px; margin-bottom: 16px;">🙏</div>
                
                <!-- Título -->
                <h2 style="color: #FFD700; font-size: 22px; font-weight: bold; margin-bottom: 8px;">
                    Terço Concluído!
                </h2>
                
                <p style="color: rgba(255,255,255,0.8); font-size: 14px; margin-bottom: 20px; line-height: 1.5;">
                    Nossa Senhora te abençoe! 💙<br>
                    Obrigado por rezar conosco.
                </p>
                
                <!-- Divisor -->
                <div style="height: 1px; background: linear-gradient(90deg, transparent, rgba(255,215,0,0.3), transparent); margin: 20px 0;"></div>
                
                <!-- Mensagem de doação -->
                <p style="color: #FFD700; font-size: 15px; font-weight: 600; margin-bottom: 8px;">
                    💛 Ajude nosso aplicativo a continuar fazendo diferença na vida das pessoas!
                </p>
                
                <p style="color: rgba(255,255,255,0.7); font-size: 13px; margin-bottom: 16px;">
                    Contribua com qualquer valor - <strong style="color: #4ADE80;">Você faz a diferença!</strong>
                </p>
                
                <!-- QR Code -->
                <div style="background: white; border-radius: 16px; padding: 16px; margin-bottom: 16px; display: inline-block;">
                    <img src="img/qrcode_pix.jpg" alt="QR Code Pix" style="width: 180px; height: 180px; display: block;" onerror="this.style.display='none'; this.parentElement.innerHTML='<p style=\\'color:#666; font-size:12px;\\'>QR Code indisponível<br>Use a chave Pix abaixo</p>';">
                </div>
                
                <!-- Chave Pix -->
                <div style="background: rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; margin-bottom: 16px;">
                    <p style="color: rgba(255,255,255,0.6); font-size: 11px; margin-bottom: 6px;">Chave Pix (Copia e Cola):</p>
                    <p id="chave-pix-texto" style="color: #4ADE80; font-size: 10px; word-break: break-all; line-height: 1.4; margin-bottom: 8px;">${chavePix}</p>
                    <button onclick="TercoGuiado.copiarChavePix()" style="
                        width: 100%;
                        padding: 10px;
                        background: linear-gradient(135deg, #4ADE80, #22C55E);
                        border: none;
                        border-radius: 10px;
                        color: #000;
                        font-weight: bold;
                        font-size: 13px;
                        cursor: pointer;
                    ">
                        📋 Copiar Chave Pix
                    </button>
                </div>
                
                <!-- Botão fechar -->
                <button onclick="document.getElementById('modal-doacao-terco').remove()" style="
                    width: 100%;
                    padding: 14px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    cursor: pointer;
                ">
                    Fechar
                </button>
                
                <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin-top: 12px;">
                    Que Nossa Senhora interceda por você! 🙏
                </p>
            </div>
            
            <style>
                @keyframes slideUp {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(modal);
        
        // Fechar ao clicar fora
        modal.onclick = (e) => {
            if (e.target === modal) modal.remove();
        };
    },

    // Copiar chave Pix
    copiarChavePix() {
        const chavePix = '00020126580014br.gov.bcb.pix0136d2a3b5eb-41a0-4204-9588-e938a23888c05204000053039865802BR5925JOSE RICARDO DOERNER NETO6014JARAGUA DO SUL62070503***6304D0E3';
        
        navigator.clipboard.writeText(chavePix).then(() => {
            if (window.showToast) {
                showToast('✅ Chave Pix copiada!');
            } else {
                alert('Chave Pix copiada!');
            }
        }).catch(() => {
            // Fallback para dispositivos mais antigos
            const textarea = document.createElement('textarea');
            textarea.value = chavePix;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            if (window.showToast) {
                showToast('✅ Chave Pix copiada!');
            } else {
                alert('Chave Pix copiada!');
            }
        });
    },

    anterior() {
        this.pararAudio();
        this.estado.aveAtual = 0;
        
        if (this.estado.misterioAtual === 6) {
            this.estado.misterioAtual = 5;
        } else if (this.estado.misterioAtual >= 2) {
            this.estado.misterioAtual--;
        } else if (this.estado.misterioAtual === 1) {
            this.estado.misterioAtual = 0;
            this.estado.dezenaAtual = 1;
        } else if (this.estado.dezenaAtual === 1) {
            this.estado.dezenaAtual = 0;
        }
        this.renderizar();
    },

    fechar() {
        this.pararAudio();
        const modal = document.getElementById('modal-terco');
        if (modal) modal.remove();
        this.estado.ativo = false;
    }
};

window.TercoGuiado = TercoGuiado;
