// ========================================
// 📅 CALENDÁRIO LITÚRGICO MARIANO
// Festas, Novenas e Conteúdo Especial
// ========================================

const CalendarioMariano = {
    // Todas as festas marianas do ano
    festas: [
        // JANEIRO
        { dia: 1, mes: 1, nome: "Santa Maria, Mãe de Deus", tipo: "solenidade", cor: "branco", 
          descricao: "Celebramos Maria como Theotokos - aquela que gerou Deus em seu ventre.",
          oracao: "Ó Maria, Mãe de Deus, rogai por nós que recorremos a Vós!" },
        
        // FEVEREIRO  
        { dia: 2, mes: 2, nome: "Nossa Senhora das Candeias", tipo: "festa", cor: "branco",
          descricao: "Apresentação de Jesus no Templo. Maria oferece seu filho a Deus.",
          oracao: "Maria, luz do mundo, iluminai nosso caminho!" },
        { dia: 11, mes: 2, nome: "Nossa Senhora de Lourdes", tipo: "memoria", cor: "branco",
          descricao: "Aparição a Santa Bernadette em 1858. 'Eu sou a Imaculada Conceição.'",
          oracao: "Nossa Senhora de Lourdes, curai os enfermos!" },
        
        // MARÇO
        { dia: 25, mes: 3, nome: "Anunciação do Senhor", tipo: "solenidade", cor: "branco",
          descricao: "O Anjo Gabriel anuncia a Maria que ela será mãe do Salvador.",
          oracao: "Maria, ensina-nos a dizer SIM a Deus como Vós disseste!" },
        
        // ABRIL
        { dia: 26, mes: 4, nome: "Nossa Senhora do Bom Conselho", tipo: "memoria", cor: "branco",
          descricao: "Maria como conselheira sábia. Devoção muito antiga na Igreja.",
          oracao: "Nossa Senhora do Bom Conselho, guiai nossas decisões!" },
        
        // MAIO (Mês de Maria)
        { dia: 8, mes: 5, nome: "Nossa Senhora de Pompeia", tipo: "memoria", cor: "branco",
          descricao: "Padroeira do Santo Rosário. Súplica à Virgem de Pompeia.",
          oracao: "Virgem de Pompeia, dai-nos vitória pelo Rosário!" },
        { dia: 13, mes: 5, nome: "Nossa Senhora de Fátima", tipo: "memoria", cor: "branco",
          descricao: "Primeira aparição aos pastorinhos em 1917. Pedido de oração e conversão.",
          oracao: "Nossa Senhora de Fátima, convertei os pecadores!" },
        { dia: 24, mes: 5, nome: "Maria Auxiliadora", tipo: "memoria", cor: "branco",
          descricao: "Maria como socorro dos cristãos nas dificuldades.",
          oracao: "Maria Auxiliadora, socorrei-nos em nossas necessidades!" },
        { dia: 31, mes: 5, nome: "Visitação de Nossa Senhora", tipo: "festa", cor: "branco",
          descricao: "Maria visita Isabel. O Magnificat ecoa pela primeira vez.",
          oracao: "Maria, levai Jesus a todos os corações!" },
        
        // JUNHO
        { dia: 27, mes: 6, nome: "Nossa Senhora do Perpétuo Socorro", tipo: "memoria", cor: "branco",
          descricao: "Ícone bizantino venerado em Roma. Maria sempre pronta a ajudar.",
          oracao: "Mãe do Perpétuo Socorro, não nos abandoneis!" },
        
        // JULHO
        { dia: 2, mes: 7, nome: "Santa Isabel e São Joaquim", tipo: "memoria", cor: "branco",
          descricao: "Pais de Maria e avós de Jesus. Família sagrada.",
          oracao: "Santa Isabel e São Joaquim, protegei nossas famílias!" },
        { dia: 16, mes: 7, nome: "Nossa Senhora do Carmo", tipo: "memoria", cor: "branco",
          descricao: "Padroeira dos Carmelitas. Entregou o Escapulário a São Simão Stock.",
          oracao: "Nossa Senhora do Carmo, protegei-nos com vosso manto!" },
        { dia: 26, mes: 7, nome: "Sant'Ana e São Joaquim", tipo: "memoria", cor: "branco",
          descricao: "Avós de Jesus. Sant'Ana é padroeira das mães e avós.",
          oracao: "Sant'Ana e São Joaquim, abençoai nossos avós!" },
        
        // AGOSTO
        { dia: 5, mes: 8, nome: "Nossa Senhora das Neves", tipo: "memoria", cor: "branco",
          descricao: "Milagre da neve em Roma no verão, indicando onde construir a Basílica.",
          oracao: "Maria, purificai nossos corações como a neve!" },
        { dia: 15, mes: 8, nome: "Assunção de Nossa Senhora", tipo: "solenidade", cor: "branco",
          descricao: "Maria é elevada ao Céu em corpo e alma. Dogma proclamado em 1950.",
          oracao: "Maria Assunta, levai-nos convosco ao Céu!" },
        { dia: 22, mes: 8, nome: "Nossa Senhora Rainha", tipo: "memoria", cor: "branco",
          descricao: "Maria coroada Rainha do Céu e da Terra, ao lado de seu Filho.",
          oracao: "Rainha do Céu, reinai em nossos corações!" },
        
        // SETEMBRO
        { dia: 8, mes: 9, nome: "Natividade de Nossa Senhora", tipo: "festa", cor: "branco",
          descricao: "Nascimento de Maria, aurora da salvação. Filha de Ana e Joaquim.",
          oracao: "Maria, estrela da manhã, anunciai-nos um novo dia!" },
        { dia: 12, mes: 9, nome: "Santíssimo Nome de Maria", tipo: "memoria", cor: "branco",
          descricao: "Veneração do santo nome de Maria - doçura e esperança.",
          oracao: "Ao nome de Maria, todo joelho se dobre!" },
        { dia: 15, mes: 9, nome: "Nossa Senhora das Dores", tipo: "memoria", cor: "branco",
          descricao: "As sete dores de Maria. Sua espada de dor nos une a Cristo.",
          oracao: "Mãe Dolorosa, consolai os que sofrem!" },
        
        // OUTUBRO (Mês do Rosário)
        { dia: 7, mes: 10, nome: "Nossa Senhora do Rosário", tipo: "memoria", cor: "branco",
          descricao: "Vitória de Lepanto. O Rosário como arma espiritual.",
          oracao: "Nossa Senhora do Rosário, ensinai-nos a rezar!" },
        { dia: 11, mes: 10, nome: "Maternidade Divina de Maria", tipo: "memoria", cor: "branco",
          descricao: "Maria é verdadeiramente Mãe de Deus. Dogma do Concílio de Éfeso (431).",
          oracao: "Mãe de Deus, rogai por nós pecadores!" },
        { dia: 12, mes: 10, nome: "Nossa Senhora Aparecida", tipo: "solenidade", cor: "azul",
          descricao: "Padroeira do Brasil! Encontrada nas águas do Paraíba em 1717.",
          oracao: "Nossa Senhora Aparecida, rogai por nós, vossos filhos brasileiros!" },
        
        // NOVEMBRO
        { dia: 21, mes: 11, nome: "Apresentação de Nossa Senhora", tipo: "memoria", cor: "branco",
          descricao: "Maria é apresentada no Templo ainda criança, consagrada a Deus.",
          oracao: "Maria, consagrai-nos totalmente a Deus!" },
        { dia: 27, mes: 11, nome: "Nossa Senhora das Graças", tipo: "memoria", cor: "branco",
          descricao: "Aparição a Santa Catarina Labouré. A Medalha Milagrosa.",
          oracao: "Ó Maria concebida sem pecado, rogai por nós!" },
        
        // DEZEMBRO
        { dia: 8, mes: 12, nome: "Imaculada Conceição", tipo: "solenidade", cor: "branco",
          descricao: "Maria preservada do pecado original. Dogma de 1854.",
          oracao: "Maria Imaculada, purificai nossos corações!" },
        { dia: 12, mes: 12, nome: "Nossa Senhora de Guadalupe", tipo: "festa", cor: "branco",
          descricao: "Aparição a Juan Diego no México em 1531. Padroeira das Américas.",
          oracao: "Virgem de Guadalupe, protegei as Américas!" }
    ],

    // Novenas antes das grandes festas
    novenas: {
        // Chave: "mes-dia" da festa
        "10-12": { // Aparecida
            nome: "Novena a Nossa Senhora Aparecida",
            inicio: { dia: 3, mes: 10 },
            dias: [
                { titulo: "1º Dia - Fé", tema: "A fé dos pescadores que encontraram a imagem", oracao: "Maria, aumentai nossa fé!" },
                { titulo: "2º Dia - Esperança", tema: "A esperança do povo brasileiro em Maria", oracao: "Maria, sede nossa esperança!" },
                { titulo: "3º Dia - Caridade", tema: "O amor de Maria por seus filhos do Brasil", oracao: "Maria, ensinai-nos a amar!" },
                { titulo: "4º Dia - Humildade", tema: "A humildade de uma imagem pequena e escura", oracao: "Maria, dai-nos humildade!" },
                { titulo: "5º Dia - Confiança", tema: "Os milagres que brotam da confiança em Maria", oracao: "Maria, em Vós confiamos!" },
                { titulo: "6º Dia - Conversão", tema: "As conversões operadas por Nossa Senhora", oracao: "Maria, convertei os pecadores!" },
                { titulo: "7º Dia - Família", tema: "Maria, protetora das famílias brasileiras", oracao: "Maria, protegei nossas famílias!" },
                { titulo: "8º Dia - Paz", tema: "A paz que Maria traz aos corações aflitos", oracao: "Maria, dai-nos a paz!" },
                { titulo: "9º Dia - Consagração", tema: "Consagração total a Nossa Senhora Aparecida", oracao: "Maria, somos todos vossos!" }
            ]
        },
        "12-8": { // Imaculada
            nome: "Novena à Imaculada Conceição",
            inicio: { dia: 29, mes: 11 },
            dias: [
                { titulo: "1º Dia - Pureza", tema: "A pureza imaculada de Maria desde a concepção", oracao: "Maria Imaculada, purificai-nos!" },
                { titulo: "2º Dia - Graça", tema: "Maria, cheia de graça desde o primeiro instante", oracao: "Maria, alcançai-nos a graça!" },
                { titulo: "3º Dia - Vitória", tema: "Maria, vitoriosa sobre o pecado e Satanás", oracao: "Maria, dai-nos a vitória!" },
                { titulo: "4º Dia - Proteção", tema: "O manto imaculado que nos protege", oracao: "Maria, cobri-nos com vosso manto!" },
                { titulo: "5º Dia - Santidade", tema: "O chamado à santidade pelo exemplo de Maria", oracao: "Maria, fazei-nos santos!" },
                { titulo: "6º Dia - Perseverança", tema: "A fidelidade de Maria até o fim", oracao: "Maria, dai-nos perseverança!" },
                { titulo: "7º Dia - Intercessão", tema: "Maria, poderosa intercessora junto a Deus", oracao: "Maria, intercedei por nós!" },
                { titulo: "8º Dia - Louvor", tema: "O Magnificat - louvor eterno de Maria", oracao: "Maria, ensinai-nos a louvar!" },
                { titulo: "9º Dia - Entrega", tema: "Total consagração à Imaculada", oracao: "Maria Imaculada, somos vossos!" }
            ]
        },
        "8-15": { // Assunção
            nome: "Novena à Assunção de Nossa Senhora",
            inicio: { dia: 6, mes: 8 },
            dias: [
                { titulo: "1º Dia - Glorificação", tema: "Maria glorificada em corpo e alma", oracao: "Maria Assunta, glorificai a Deus em nós!" },
                { titulo: "2º Dia - Esperança", tema: "A Assunção como sinal de nossa esperança", oracao: "Maria, sede nossa esperança!" },
                { titulo: "3º Dia - Ressurreição", tema: "Antecipação da ressurreição dos corpos", oracao: "Maria, ressuscitai nossa fé!" },
                { titulo: "4º Dia - Céu", tema: "Maria nos mostra o caminho do Céu", oracao: "Maria, levai-nos ao Céu!" },
                { titulo: "5º Dia - Corpo", tema: "A dignidade do corpo humano", oracao: "Maria, santificai nossos corpos!" },
                { titulo: "6º Dia - Vida Eterna", tema: "A promessa da vida que não tem fim", oracao: "Maria, guiai-nos à vida eterna!" },
                { titulo: "7º Dia - Intercessão", tema: "Maria no Céu intercedendo por nós", oracao: "Maria, rogai por nós!" },
                { titulo: "8º Dia - Reino", tema: "Maria, Rainha do Reino dos Céus", oracao: "Maria Rainha, reinai sobre nós!" },
                { titulo: "9º Dia - Encontro", tema: "O dia em que encontraremos Maria no Céu", oracao: "Maria, esperai-nos no Céu!" }
            ]
        }
    },

    // Verificar se hoje é festa mariana
    getFestaHoje() {
        const hoje = new Date();
        return this.festas.find(f => f.dia === hoje.getDate() && f.mes === hoje.getMonth() + 1);
    },

    // Verificar próxima festa
    getProximaFesta() {
        const hoje = new Date();
        const hojeDia = hoje.getDate();
        const hojeMes = hoje.getMonth() + 1;
        
        // Ordenar festas do ano
        let festasOrdenadas = [...this.festas].sort((a, b) => {
            if (a.mes !== b.mes) return a.mes - b.mes;
            return a.dia - b.dia;
        });
        
        // Encontrar próxima festa
        let proxima = festasOrdenadas.find(f => {
            if (f.mes > hojeMes) return true;
            if (f.mes === hojeMes && f.dia > hojeDia) return true;
            return false;
        });
        
        // Se não encontrou, pega a primeira do próximo ano
        if (!proxima) proxima = festasOrdenadas[0];
        
        // Calcular dias restantes
        const dataFesta = new Date(hoje.getFullYear(), proxima.mes - 1, proxima.dia);
        if (dataFesta < hoje) dataFesta.setFullYear(dataFesta.getFullYear() + 1);
        const diasRestantes = Math.ceil((dataFesta - hoje) / (1000 * 60 * 60 * 24));
        
        return { ...proxima, diasRestantes, data: dataFesta };
    },

    // Verificar se estamos em período de novena
    getNovenaAtiva() {
        const hoje = new Date();
        const hojeDia = hoje.getDate();
        const hojeMes = hoje.getMonth() + 1;
        
        for (const [festaKey, novena] of Object.entries(this.novenas)) {
            const [mesFesta, diaFesta] = festaKey.split('-').map(Number);
            const inicio = novena.inicio;
            
            // Verificar se estamos dentro dos 9 dias
            for (let i = 0; i < 9; i++) {
                const dataDia = new Date(hoje.getFullYear(), inicio.mes - 1, inicio.dia + i);
                if (dataDia.getDate() === hojeDia && dataDia.getMonth() + 1 === hojeMes) {
                    return {
                        ...novena,
                        diaAtual: i + 1,
                        conteudo: novena.dias[i],
                        festa: this.festas.find(f => f.dia === diaFesta && f.mes === mesFesta)
                    };
                }
            }
        }
        return null;
    },

    // Obter festas do mês
    getFestasMes(mes) {
        return this.festas.filter(f => f.mes === mes);
    },

    // Gerar calendário do mês
    gerarCalendarioMes(mes, ano) {
        const primeiroDia = new Date(ano, mes - 1, 1);
        const ultimoDia = new Date(ano, mes, 0);
        const diasNoMes = ultimoDia.getDate();
        const diaSemanaInicio = primeiroDia.getDay();
        
        const festasDoMes = this.getFestasMes(mes);
        const hoje = new Date();
        
        let calendario = [];
        let semana = [];
        
        // Dias vazios no início
        for (let i = 0; i < diaSemanaInicio; i++) {
            semana.push(null);
        }
        
        // Dias do mês
        for (let dia = 1; dia <= diasNoMes; dia++) {
            const festa = festasDoMes.find(f => f.dia === dia);
            const ehHoje = dia === hoje.getDate() && mes === hoje.getMonth() + 1 && ano === hoje.getFullYear();
            
            semana.push({ dia, festa, ehHoje });
            
            if (semana.length === 7) {
                calendario.push(semana);
                semana = [];
            }
        }
        
        // Completar última semana
        while (semana.length > 0 && semana.length < 7) {
            semana.push(null);
        }
        if (semana.length > 0) calendario.push(semana);
        
        return calendario;
    }
};

window.CalendarioMariano = CalendarioMariano;
