// ========================================
// 📜 HISTÓRIAS DAS APARIÇÕES DE MARIA
// Conheça os lugares sagrados
// ========================================

const HistoriasAparicoes = {
    aparicoes: [
        {
            id: 'guadalupe',
            nome: 'Nossa Senhora de Guadalupe',
            local: 'Cidade do México, México',
            ano: 1531,
            vidente: 'São Juan Diego',
            imagem: '🇲🇽',
            cor: '#006847',
            resumo: 'Maria apareceu ao índio Juan Diego no monte Tepeyac, deixando sua imagem milagrosamente impressa em seu manto (tilma).',
            historia: `Em dezembro de 1531, a Virgem Maria apareceu quatro vezes ao índio asteca Juan Diego no monte Tepeyac, próximo à Cidade do México.

Maria se apresentou como a "Mãe do verdadeiro Deus" e pediu que uma igreja fosse construída naquele local. O bispo Juan de Zumárraga inicialmente não acreditou em Juan Diego.

Na última aparição, Maria pediu que Juan Diego colhesse rosas no topo do monte - algo impossível no inverno. Quando ele abriu seu manto (tilma) diante do bispo, as rosas caíram e a imagem de Maria estava milagrosamente impressa no tecido.

A tilma, feita de fibra de cacto que deveria durar apenas 20 anos, permanece intacta até hoje, após quase 500 anos. A imagem possui características inexplicáveis pela ciência, como pupilas que refletem a cena da aparição.

Nossa Senhora de Guadalupe é a padroeira das Américas e do México. Sua basílica recebe mais de 20 milhões de peregrinos por ano, sendo o santuário mariano mais visitado do mundo.`,
            oracaoEspecial: 'Virgem Santíssima de Guadalupe, Mãe das Américas, olhai por nós com vossos olhos misericordiosos. Assim como deixastes vossa imagem no manto de Juan Diego, imprimi em nossos corações o amor ao vosso Filho Jesus. Amém.',
            curiosidades: [
                'A tilma deveria ter se desintegrado em 20 anos, mas já dura quase 500',
                'Os olhos de Maria na imagem contêm reflexos microscópicos de 13 pessoas',
                'As estrelas no manto correspondem à constelação do dia da aparição',
                'A imagem não tem pinceladas - a origem é inexplicável'
            ],
            festa: '12 de dezembro'
        },
        {
            id: 'fatima',
            nome: 'Nossa Senhora de Fátima',
            local: 'Fátima, Portugal',
            ano: 1917,
            vidente: 'Lúcia, Francisco e Jacinta',
            imagem: '🇵🇹',
            cor: '#006600',
            resumo: 'Maria apareceu a três pastorinhos portugueses, revelando três segredos e pedindo oração e penitência pela paz mundial.',
            historia: `Entre maio e outubro de 1917, a Virgem Maria apareceu seis vezes a três crianças pastoras: Lúcia dos Santos (10 anos) e seus primos Francisco (9) e Jacinta Marto (7), na Cova da Iria, em Fátima, Portugal.

Maria se identificou como "Nossa Senhora do Rosário" e pediu a reza diária do terço pela paz no mundo e a conversão dos pecadores. Ela confiou três segredos às crianças:

1º Segredo: Uma visão do inferno
2º Segredo: A consagração da Rússia e a devoção ao Imaculado Coração
3º Segredo: Uma visão de perseguição à Igreja (revelado em 2000)

Na última aparição, em 13 de outubro de 1917, ocorreu o "Milagre do Sol", presenciado por cerca de 70.000 pessoas. O sol "dançou" no céu, girando e emitindo cores, antes de parecer cair sobre a multidão.

Francisco e Jacinta morreram jovens e foram canonizados em 2017. Irmã Lúcia viveu como carmelita até 2005. O Santuário de Fátima é um dos mais importantes centros de peregrinação do mundo.`,
            oracaoEspecial: 'Ó minha boa Mãe do Céu, vossa imagem venerada, lembra tantas aparições na terra portuguesa amada. Dai-nos fé para crer em vossas palavras. Dai-nos amor para converter os pecadores. Amém.',
            curiosidades: [
                '70.000 pessoas testemunharam o Milagre do Sol',
                'O 3º segredo foi revelado apenas em 2000 pelo Papa João Paulo II',
                'Francisco e Jacinta são os santos não-mártires mais jovens da Igreja',
                'A bala que atingiu João Paulo II está na coroa da imagem de Fátima'
            ],
            festa: '13 de maio'
        },
        {
            id: 'lourdes',
            nome: 'Nossa Senhora de Lourdes',
            local: 'Lourdes, França',
            ano: 1858,
            vidente: 'Santa Bernadette Soubirous',
            imagem: '🇫🇷',
            cor: '#0055A4',
            resumo: 'Maria apareceu 18 vezes a uma jovem pobre na gruta de Massabielle, revelando-se como a Imaculada Conceição.',
            historia: `Entre fevereiro e julho de 1858, a Virgem Maria apareceu 18 vezes a Bernadette Soubirous, uma menina pobre e doente de 14 anos, na gruta de Massabielle, em Lourdes, sul da França.

Na primeira aparição, Bernadette viu "uma Senhora vestida de branco, com um cinto azul e uma rosa amarela em cada pé". A Senhora não se identificou inicialmente, pedindo apenas que Bernadette voltasse durante 15 dias.

Na nona aparição, a Senhora pediu que Bernadette cavasse no chão da gruta. Uma fonte de água brotou e continua fluindo até hoje. Esta água é associada a milhares de curas milagrosas.

Na 16ª aparição, quando Bernadette perguntou quem ela era, a Senhora respondeu em dialeto local: "Que soy era Immaculada Councepciou" (Eu sou a Imaculada Conceição) - confirmando o dogma proclamado pelo Papa apenas 4 anos antes.

Bernadette tornou-se freira e foi canonizada em 1933. Seu corpo permanece incorrupto. Lourdes recebe cerca de 6 milhões de peregrinos por ano, e a Igreja reconheceu oficialmente 70 curas milagrosas.`,
            oracaoEspecial: 'Nossa Senhora de Lourdes, que aparecestes a Bernadette na gruta de Massabielle, rogai por todos os doentes e aflitos. Concedei-nos a graça da cura do corpo e da alma. Amém.',
            curiosidades: [
                'Mais de 7.000 curas foram relatadas, 70 reconhecidas oficialmente',
                'O corpo de Santa Bernadette permanece incorrupto desde 1879',
                'A água da fonte não tem propriedades medicinais detectáveis',
                'Bernadette não sabia o significado de "Imaculada Conceição" quando ouviu'
            ],
            festa: '11 de fevereiro'
        },
        {
            id: 'aparecida',
            nome: 'Nossa Senhora Aparecida',
            local: 'Aparecida, São Paulo, Brasil',
            ano: 1717,
            vidente: 'Pescadores Domingos, João e Felipe',
            imagem: '🇧🇷',
            cor: '#009739',
            resumo: 'Uma pequena imagem de Nossa Senhora da Conceição foi encontrada por pescadores no Rio Paraíba, tornando-se a Padroeira do Brasil.',
            historia: `Em outubro de 1717, três pescadores - Domingos Garcia, João Alves e Felipe Pedroso - foram convocados para pescar no Rio Paraíba do Sul para um banquete em honra do Conde de Assumar.

Após horas sem sucesso, João Alves lançou sua rede e trouxe o corpo de uma pequena imagem de terracota. Na tentativa seguinte, pescou a cabeça. Era uma imagem de Nossa Senhora da Conceição, escurecida pelo tempo nas águas.

Após reunir as partes, os pescadores lançaram novamente a rede e pescaram quantidade tão grande de peixes que tiveram que retornar, com medo de a canoa afundar.

A imagem ficou com a família de Felipe Pedroso por 15 anos, onde vizinhos começaram a se reunir para rezar. Milagres começaram a ser relatados: velas que se acendiam sozinhas, uma corrente de escravo que se partiu durante uma oração.

Em 1745, foi construída a primeira capela. Em 1929, Nossa Senhora Aparecida foi proclamada Rainha e Padroeira do Brasil. A atual Basílica, inaugurada em 1980, é o maior templo mariano do mundo e o segundo maior templo católico, recebendo 12 milhões de peregrinos por ano.`,
            oracaoEspecial: 'Ó incomparável Senhora da Conceição Aparecida, Mãe de Deus, Rainha dos Anjos, Advogada dos pecadores, refúgio e consolação dos aflitos, Virgem Santíssima, cheia de graça e misericórdia, abençoai o Brasil e todos os brasileiros. Amém.',
            curiosidades: [
                'A imagem tem apenas 36 cm de altura',
                'O manto azul foi presente da Princesa Isabel em 1888',
                'A Basílica comporta 45.000 pessoas sentadas',
                '12 de outubro é feriado nacional no Brasil'
            ],
            festa: '12 de outubro'
        },
        {
            id: 'medjugorje',
            nome: 'Nossa Senhora de Medjugorje',
            local: 'Medjugorje, Bósnia-Herzegovina',
            ano: 1981,
            vidente: 'Seis jovens videntes',
            imagem: '🇧🇦',
            cor: '#002395',
            resumo: 'Aparições que continuam até hoje, com mensagens de paz, conversão e oração, especialmente o rosário.',
            historia: `Em 24 de junho de 1981, seis jovens croatas - Ivanka, Mirjana, Vicka, Ivan, Marija e Jakov - afirmaram ver a Virgem Maria no monte Podbrdo, em Medjugorje, então parte da Iugoslávia.

Desde então, alguns videntes afirmam receber aparições diárias, enquanto outros recebem mensagens em datas específicas. Maria se apresenta como a "Rainha da Paz" (Kraljica Mira) e transmite mensagens focadas em cinco pontos:

1. Paz
2. Fé
3. Conversão
4. Oração (especialmente o Rosário)
5. Jejum

As aparições ainda não foram oficialmente reconhecidas pela Igreja, mas o Papa Francisco autorizou peregrinações oficiais em 2019. Milhões de peregrinos visitam Medjugorje anualmente, e incontáveis conversões e curas são relatadas.

Os videntes afirmam ter recebido 10 segredos sobre o futuro do mundo, que serão revelados quando Maria assim determinar. As aparições são consideradas as mais extensas e documentadas da história.`,
            oracaoEspecial: 'Rainha da Paz, que em Medjugorje nos chamais à conversão e à oração, ajudai-nos a viver vossas mensagens. Que a paz reine em nossos corações, em nossas famílias e no mundo inteiro. Amém.',
            curiosidades: [
                'Mais de 40 milhões de pessoas já visitaram Medjugorje',
                'Os videntes foram extensivamente estudados por cientistas',
                'As aparições continuam acontecendo há mais de 40 anos',
                'O Papa Francisco autorizou peregrinações oficiais em 2019'
            ],
            festa: '25 de junho'
        },
        {
            id: 'akita',
            nome: 'Nossa Senhora de Akita',
            local: 'Akita, Japão',
            ano: 1973,
            vidente: 'Irmã Agnes Sasagawa',
            imagem: '🇯🇵',
            cor: '#BC002D',
            resumo: 'Uma imagem de Maria chorou 101 vezes, com mensagens sobre oração e advertências para a humanidade.',
            historia: `Entre 1973 e 1981, a Irmã Agnes Sasagawa, uma freira surda do Instituto das Servas da Eucaristia em Akita, Japão, recebeu mensagens de uma imagem de Nossa Senhora que milagrosamente chorou, suou e sangrou.

A imagem de madeira chorou 101 vezes entre 1975 e 1981, fenômenos testemunhados por centenas de pessoas e documentados pela televisão japonesa.

Em 13 de outubro de 1973 (aniversário do Milagre do Sol de Fátima), Maria transmitiu uma mensagem solene: advertiu sobre um castigo maior que o dilúvio se a humanidade não se convertesse, pediu oração e penitência, e alertou sobre divisões dentro da Igreja.

As aparições foram aprovadas pelo bispo local em 1984 e confirmadas pelo Cardeal Ratzinger (futuro Papa Bento XVI), que as considerou uma continuação da mensagem de Fátima.

Irmã Agnes recuperou milagrosamente a audição após anos de surdez total.`,
            oracaoEspecial: 'Nossa Senhora de Akita, que chorastes por nossos pecados, tocai nossos corações endurecidos. Concedei-nos a graça da conversão e ajudai-nos a reparar as ofensas cometidas contra o Coração de Jesus e o vosso Imaculado Coração. Amém.',
            curiosidades: [
                'A imagem chorou exatamente 101 vezes',
                'As lágrimas foram analisadas e confirmadas como humanas',
                'Irmã Agnes era completamente surda e foi curada',
                'Aprovada oficialmente pela Igreja em 1984'
            ],
            festa: '15 de agosto'
        }
    ],

    // Abrir lista de aparições
    abrir() {
        const modal = document.createElement('div');
        modal.id = 'tela-aparicoes';
        modal.className = 'fixed inset-0 z-[60] overflow-y-auto';
        modal.style.background = 'linear-gradient(180deg, #0a0612 0%, #1a1025 50%, #0a0612 100%)';
        
        modal.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header -->
                <div class="sticky top-0 z-10 bg-gradient-to-b from-[#0a0612] via-[#0a0612] to-transparent p-4 pb-8">
                    <div class="flex items-center justify-between mb-4">
                        <button onclick="HistoriasAparicoes.fechar()" class="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all">
                            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                        <h1 class="text-white text-xl font-bold">📜 Aparições de Maria</h1>
                        <div class="w-10"></div>
                    </div>
                    
                    <p class="text-white/60 text-sm text-center">Conheça os lugares onde Maria apareceu</p>
                </div>
                
                <div class="px-4 space-y-4">
                    ${this.aparicoes.map(ap => `
                        <div onclick="HistoriasAparicoes.abrirDetalhes('${ap.id}')" class="bg-white/5 backdrop-blur rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                            <div class="h-2" style="background: ${ap.cor}"></div>
                            <div class="p-4">
                                <div class="flex items-start gap-4">
                                    <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-3xl flex-shrink-0">
                                        ${ap.imagem}
                                    </div>
                                    <div class="flex-1">
                                        <h3 class="text-white font-bold">${ap.nome}</h3>
                                        <p class="text-white/50 text-xs">${ap.local} • ${ap.ano}</p>
                                        <p class="text-white/70 text-sm mt-2 line-clamp-2">${ap.resumo}</p>
                                    </div>
                                    <svg class="w-5 h-5 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
    },

    // Abrir detalhes de uma aparição
    abrirDetalhes(id) {
        const ap = this.aparicoes.find(a => a.id === id);
        if (!ap) return;
        
        const detalhe = document.createElement('div');
        detalhe.id = 'detalhe-aparicao';
        detalhe.className = 'fixed inset-0 z-[65] overflow-y-auto';
        detalhe.style.background = 'linear-gradient(180deg, #0a0612 0%, #1a1025 100%)';
        
        detalhe.innerHTML = `
            <div class="min-h-screen pb-8">
                <!-- Header com cor da aparição -->
                <div class="relative">
                    <div class="h-40 bg-gradient-to-br" style="background: linear-gradient(135deg, ${ap.cor}dd, ${ap.cor}66)">
                        <div class="absolute inset-0 flex items-center justify-center text-8xl opacity-30">
                            ${ap.imagem}
                        </div>
                    </div>
                    <button onclick="document.getElementById('detalhe-aparicao').remove()" class="absolute top-4 left-4 p-2 bg-black/30 backdrop-blur rounded-full hover:bg-black/50 transition-all">
                        <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>
                    </button>
                </div>
                
                <div class="px-4 -mt-10 relative z-10">
                    <!-- Card principal -->
                    <div class="bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur rounded-2xl p-5 border border-white/10 mb-6">
                        <h1 class="text-white text-2xl font-bold mb-1">${ap.nome}</h1>
                        <p class="text-white/50 text-sm mb-4">${ap.local} • ${ap.ano}</p>
                        
                        <div class="flex items-center gap-4 text-sm">
                            <div class="flex items-center gap-1 text-white/70">
                                <span>👤</span>
                                <span>${ap.vidente}</span>
                            </div>
                            <div class="flex items-center gap-1 text-white/70">
                                <span>📅</span>
                                <span>${ap.festa}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- História -->
                    <div class="mb-6">
                        <h2 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>📖</span> A História
                        </h2>
                        <div class="bg-white/5 rounded-xl p-4 border border-white/10">
                            <p class="text-white/80 text-sm leading-relaxed whitespace-pre-line">${ap.historia}</p>
                        </div>
                    </div>
                    
                    <!-- Oração -->
                    <div class="mb-6">
                        <h2 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>🙏</span> Oração
                        </h2>
                        <div class="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 rounded-xl p-4 border border-yellow-500/20">
                            <p class="text-white/90 text-sm italic leading-relaxed">"${ap.oracaoEspecial}"</p>
                        </div>
                    </div>
                    
                    <!-- Curiosidades -->
                    <div class="mb-6">
                        <h2 class="text-white font-semibold mb-3 flex items-center gap-2">
                            <span>✨</span> Curiosidades
                        </h2>
                        <div class="space-y-2">
                            ${ap.curiosidades.map(c => `
                                <div class="bg-white/5 rounded-xl p-3 border border-white/10 flex items-start gap-3">
                                    <span class="text-yellow-400">•</span>
                                    <p class="text-white/70 text-sm">${c}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Botão rezar -->
                    <button onclick="HistoriasAparicoes.rezarPelaAparicao('${ap.id}')" class="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-500 hover:to-purple-500 transition-all flex items-center justify-center gap-2">
                        <span>🙏</span>
                        <span>Rezar por ${ap.nome.split(' de ')[1] || ap.nome}</span>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(detalhe);
    },

    // Rezar pela aparição
    rezarPelaAparicao(id) {
        const ap = this.aparicoes.find(a => a.id === id);
        if (!ap) return;
        
        document.getElementById('detalhe-aparicao')?.remove();
        this.fechar();
        
        // Enviar mensagem automática no chat
        const input = document.getElementById('input-mensagem');
        if (input) {
            input.value = `Maria, quero rezar pedindo a intercessão de ${ap.nome}. ${ap.oracaoEspecial}`;
            if (window.enviarMensagem) enviarMensagem();
        }
    },

    // Fechar
    fechar() {
        document.getElementById('tela-aparicoes')?.remove();
        document.body.style.overflow = '';
    }
};

window.HistoriasAparicoes = HistoriasAparicoes;
