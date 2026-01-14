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

    // Orações do terço
    oracoes: {
        sinalCruz: {
            titulo: "Sinal da Cruz",
            texto: "Em nome do Pai, do Filho e do Espírito Santo. Amém.",
            instrucao: "Faça o sinal da cruz com devoção"
        },
        creio: {
            titulo: "Credo Apostólico", 
            texto: `Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra.
E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria.
Padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos, ressuscitou ao terceiro dia.
Subiu aos céus, está sentado à direita de Deus Pai Todo-Poderoso, de onde há de vir a julgar os vivos e os mortos.
Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`,
            instrucao: "Reze o Credo segurando o crucifixo"
        },
        paiNosso: {
            titulo: "Pai Nosso",
            texto: `Pai nosso que estais nos céus, santificado seja o vosso nome.
Venha a nós o vosso reino, seja feita a vossa vontade, assim na terra como no céu.
O pão nosso de cada dia nos dai hoje.
Perdoai-nos as nossas ofensas, assim como nós perdoamos a quem nos tem ofendido.
E não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`,
            instrucao: "Na conta grande, reze o Pai Nosso"
        },
        aveMaria: {
            titulo: "Ave Maria",
            texto: `Ave Maria, cheia de graça, o Senhor é convosco.
Bendita sois vós entre as mulheres, e bendito é o fruto do vosso ventre, Jesus.
Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`,
            instrucao: "Nas contas pequenas, reze a Ave Maria"
        },
        gloria: {
            titulo: "Glória ao Pai",
            texto: "Glória ao Pai, ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.",
            instrucao: "Ao final de cada dezena"
        },
        fatima: {
            titulo: "Oração de Fátima",
            texto: "Ó meu Jesus, perdoai-nos, livrai-nos do fogo do inferno. Levai as almas todas para o céu, principalmente as que mais precisarem da vossa misericórdia.",
            instrucao: "Oração pedida por Nossa Senhora em Fátima"
        },
        salveRainha: {
            titulo: "Salve Rainha",
            texto: `Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve!
A vós bradamos, os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas.
Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei.
E depois deste desterro, mostrai-nos Jesus, bendito fruto do vosso ventre.
Ó clemente, ó piedosa, ó doce sempre Virgem Maria.
Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`,
            instrucao: "Oração final do Terço"
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
    
    async gerarAudio(texto, botaoId) {
        if (this.estado.carregandoAudio) return;
        
        // Parar áudio atual se existir
        this.pararAudio();
        
        const botao = document.getElementById(botaoId);
        if (!botao) return;
        
        // Mostrar loading
        this.estado.carregandoAudio = true;
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '<span class="animate-pulse">⏳</span> Carregando...';
        botao.disabled = true;
        
        try {
            const response = await fetch(`${this.API_URL}/api/audio`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ texto })
            });
            
            if (!response.ok) throw new Error('Erro ao gerar áudio');
            
            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            
            this.estado.audioAtivo = new Audio(audioUrl);
            this.estado.audioAtivo.play();
            
            // Atualizar botão para "pausar"
            botao.innerHTML = '⏸️ Pausar';
            botao.disabled = false;
            botao.onclick = () => this.pausarAudio(botaoId, textoOriginal);
            
            // Quando terminar
            this.estado.audioAtivo.onended = () => {
                botao.innerHTML = textoOriginal;
                botao.onclick = () => this.gerarAudio(texto, botaoId);
                this.estado.audioAtivo = null;
            };
            
        } catch (error) {
            console.error('Erro ao gerar áudio:', error);
            botao.innerHTML = '❌ Erro';
            setTimeout(() => {
                botao.innerHTML = textoOriginal;
                botao.disabled = false;
            }, 2000);
        } finally {
            this.estado.carregandoAudio = false;
        }
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
        
        const modal = document.createElement('div');
        modal.id = 'modal-terco';
        modal.className = 'fixed inset-0 z-50 flex flex-col';
        modal.style.background = 'linear-gradient(135deg, #1a0a20 0%, #2d1810 50%, #1a0a0a 100%)';
        
        modal.innerHTML = `
            <div class="flex-1 overflow-y-auto pb-32">
                <!-- Header -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-black/90 to-transparent p-4 pb-8">
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
            
            <!-- Barra de progresso e navegação -->
            <div class="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur p-4 border-t border-white/10">
                <!-- Progresso visual -->
                <div class="flex justify-center items-center gap-1 mb-4">
                    ${this.renderizarProgressoRosario()}
                </div>
                
                <!-- Botões -->
                <div class="flex gap-3">
                    <button onclick="TercoGuiado.anterior()" class="flex-1 py-3 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 transition-all ${this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0 ? 'opacity-30 pointer-events-none' : ''}">
                        ← Anterior
                    </button>
                    <button onclick="TercoGuiado.proximo()" class="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all">
                        ${this.estado.misterioAtual === 6 ? '✓ Concluir' : 'Próximo →'}
                    </button>
                </div>
            </div>
        `;
        
        const existente = document.getElementById('modal-terco');
        if (existente) existente.remove();
        
        document.body.appendChild(modal);
    },

    // Renderizar etapa atual
    renderizarEtapaAtual() {
        const misterios = this.misterios[this.estado.tipoMisterio];
        
        // Início: Sinal da Cruz e Creio
        if (this.estado.misterioAtual === 0 && this.estado.dezenaAtual === 0) {
            return `
                <div class="text-center mb-6">
                    <div class="text-5xl mb-3">✝️</div>
                    <h2 class="text-xl font-bold text-white">Início do Terço</h2>
                </div>
                ${this.renderizarOracaoComAudio('sinalCruz', 'audio-sinal')}
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
        const textoLimpo = oracao.texto.replace(/\n/g, ' ');
        
        return `
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4 hover:bg-white/10 transition-all">
                <div class="flex items-center justify-between mb-3">
                    <div class="flex items-center gap-3">
                        <span class="text-2xl">🙏</span>
                        <h3 class="text-yellow-400 font-bold">${oracao.titulo}</h3>
                    </div>
                    <button 
                        id="${audioId}"
                        onclick="TercoGuiado.gerarAudio(\`${textoLimpo}\`, '${audioId}')"
                        class="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-full text-white text-sm font-semibold transition-all shadow-lg"
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
                        onclick="TercoGuiado.gerarAudio(\`${this.oracoes.aveMaria.texto.replace(/\n/g, ' ')}\`, 'audio-ave-${numero}')"
                        class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-white font-semibold transition-all mb-4"
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

    // Marcar Ave Maria rezada
    marcarAve(index) {
        this.estado.aveAtual = index + 1;
        this.renderizar();
    },

    // Renderizar progresso
    renderizarProgressoRosario() {
        let html = '<div class="flex items-center gap-1">';
        html += `<span class="text-lg ${this.estado.misterioAtual > 0 ? 'opacity-100' : 'opacity-30'}">✝️</span>`;
        
        for (let i = 1; i <= 5; i++) {
            const completo = this.estado.misterioAtual > i;
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
            if (window.showToast) showToast('📿 Terço concluído! Nossa Senhora te abençoe!');
            return;
        }
        this.renderizar();
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
