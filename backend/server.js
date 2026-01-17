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
// 📖 BANCO DE VERSÍCULOS - SISTEMA ROBUSTO
// ========================================

const VERSICULOS = {
    // 😰 ANSIEDADE, MEDO, PREOCUPAÇÃO
    ansiedade: [
        { texto: "Não andeis ansiosos por coisa alguma; antes, em tudo, sejam os vossos pedidos conhecidos diante de Deus pela oração e súplica com ações de graças.", ref: "Filipenses 4:6" },
        { texto: "Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", ref: "1 Pedro 5:7" },
        { texto: "Não se turbe o vosso coração; credes em Deus, crede também em mim.", ref: "João 14:1" },
        { texto: "A paz vos deixo, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.", ref: "João 14:27" },
        { texto: "Por isso vos digo: Não andeis cuidadosos quanto à vossa vida. Olhai para as aves do céu, que não semeiam, nem segam; e vosso Pai celestial as alimenta.", ref: "Mateus 6:25-26" },
        { texto: "Portanto, não vos inquieteis com o dia de amanhã, pois o amanhã trará os seus cuidados; basta ao dia o seu próprio mal.", ref: "Mateus 6:34" },
        { texto: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus.", ref: "Filipenses 4:7" },
        { texto: "Quando a ansiedade já me dominava no íntimo, o teu consolo trouxe alívio à minha alma.", ref: "Salmo 94:19" },
        { texto: "Descansa no Senhor e espera nele.", ref: "Salmo 37:7" },
        { texto: "Em paz me deito e logo adormeço, porque só tu, Senhor, me fazes habitar em segurança.", ref: "Salmo 4:8" }
    ],

    // 😢 TRISTEZA, DEPRESSÃO, DESÂNIMO
    tristeza: [
        { texto: "Perto está o Senhor dos que têm o coração quebrantado e salva os contritos de espírito.", ref: "Salmo 34:18" },
        { texto: "Bem-aventurados os que choram, porque eles serão consolados.", ref: "Mateus 5:4" },
        { texto: "Porque a sua ira dura só um momento; no seu favor está a vida. O choro pode durar uma noite, mas a alegria vem pela manhã.", ref: "Salmo 30:5" },
        { texto: "Ele enxugará dos seus olhos toda lágrima, e a morte já não existirá, já não haverá luto, nem pranto, nem dor.", ref: "Apocalipse 21:4" },
        { texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
        { texto: "Por que estás abatida, ó minha alma? Por que te perturbas dentro de mim? Espera em Deus, pois ainda o louvarei.", ref: "Salmo 42:11" },
        { texto: "O Senhor é o meu pastor; nada me faltará. Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas. Refrigera a minha alma.", ref: "Salmo 23:1-3" },
        { texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo.", ref: "Isaías 41:10" },
        { texto: "Os que semeiam em lágrimas, com cânticos de júbilo ceifarão.", ref: "Salmo 126:5" },
        { texto: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia.", ref: "Salmo 46:1" }
    ],

    // 👨‍👩‍👧‍👦 FAMÍLIA, RELACIONAMENTOS, CASAMENTO
    familia: [
        { texto: "Suportai-vos uns aos outros, perdoai-vos mutuamente, caso alguém tenha motivo de queixa contra outrem. Assim como o Senhor vos perdoou, assim também perdoai vós.", ref: "Colossenses 3:13" },
        { texto: "Acima de tudo, porém, revesti-vos do amor, que é o vínculo da perfeição.", ref: "Colossenses 3:14" },
        { texto: "O amor é paciente, é benigno; o amor não arde em ciúmes, não se ufana, não se ensoberbece.", ref: "1 Coríntios 13:4" },
        { texto: "Honra teu pai e tua mãe, para que se prolonguem os teus dias na terra que o Senhor teu Deus te dá.", ref: "Êxodo 20:12" },
        { texto: "Filhos, obedecei a vossos pais no Senhor, pois isto é justo.", ref: "Efésios 6:1" },
        { texto: "Ensina a criança no caminho em que deve andar, e ainda quando for velho não se desviará dele.", ref: "Provérbios 22:6" },
        { texto: "Maridos, amai vossas mulheres, como também Cristo amou a igreja e a si mesmo se entregou por ela.", ref: "Efésios 5:25" },
        { texto: "O que encontra uma esposa encontra o bem e alcança a benevolência do Senhor.", ref: "Provérbios 18:22" },
        { texto: "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho.", ref: "Eclesiastes 4:9" },
        { texto: "Onde não há conselho, os projetos fracassam, mas com muitos conselheiros há bom êxito.", ref: "Provérbios 15:22" }
    ],

    // 💰 FINANÇAS, TRABALHO, PROVISÃO
    financas: [
        { texto: "Buscai primeiro o Reino de Deus e a sua justiça, e todas estas coisas vos serão acrescentadas.", ref: "Mateus 6:33" },
        { texto: "O meu Deus suprirá todas as vossas necessidades, segundo as suas riquezas na glória em Cristo Jesus.", ref: "Filipenses 4:19" },
        { texto: "Fui moço e agora sou velho; porém nunca vi o justo desamparado, nem a sua descendência a mendigar o pão.", ref: "Salmo 37:25" },
        { texto: "Não ajunteis tesouros na terra; mas ajuntai tesouros no céu, onde a traça e a ferrugem não consomem.", ref: "Mateus 6:19-20" },
        { texto: "Bem-aventurado todo aquele que teme ao Senhor e anda nos seus caminhos. Do trabalho das tuas mãos comerás; feliz serás, e te irá bem.", ref: "Salmo 128:1-2" },
        { texto: "Confia ao Senhor as tuas obras, e teus pensamentos serão estabelecidos.", ref: "Provérbios 16:3" },
        { texto: "A bênção do Senhor é que enriquece, e não acrescenta dores.", ref: "Provérbios 10:22" },
        { texto: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
        { texto: "E tudo o que fizerdes, fazei-o de todo o coração, como ao Senhor, e não aos homens.", ref: "Colossenses 3:23" },
        { texto: "Dai, e ser-vos-á dado; boa medida, recalcada, sacudida e transbordante.", ref: "Lucas 6:38" }
    ],

    // 🏥 DOENÇA, SAÚDE, CURA
    saude: [
        { texto: "Não temas, porque eu sou contigo; não te assombres, porque eu sou teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.", ref: "Isaías 41:10" },
        { texto: "Ele levou sobre si as nossas enfermidades e carregou com as nossas dores.", ref: "Isaías 53:4" },
        { texto: "Está alguém entre vós doente? Chame os presbíteros da igreja, e estes façam oração sobre ele, ungindo-o com óleo em nome do Senhor.", ref: "Tiago 5:14" },
        { texto: "E a oração da fé salvará o doente, e o Senhor o levantará.", ref: "Tiago 5:15" },
        { texto: "Sara-me, ó Senhor, e serei sarado; salva-me, e serei salvo; porque tu és o meu louvor.", ref: "Jeremias 17:14" },
        { texto: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios. Ele é quem perdoa todas as tuas iniquidades; quem sara todas as tuas enfermidades.", ref: "Salmo 103:2-3" },
        { texto: "Filho meu, atenta para as minhas palavras; às minhas razões inclina o teu ouvido. Porque são vida para os que as acham, e saúde para todo o seu corpo.", ref: "Provérbios 4:20,22" },
        { texto: "Amado, desejo que te vá bem em todas as coisas, e que tenhas saúde, assim como bem vai a tua alma.", ref: "3 João 1:2" },
        { texto: "O coração alegre é como o bom remédio, mas o espírito abatido seca os ossos.", ref: "Provérbios 17:22" },
        { texto: "Eu sou o Senhor que te sara.", ref: "Êxodo 15:26" }
    ],

    // 😔 SOLIDÃO, ABANDONO
    solidao: [
        { texto: "Não te deixarei, nem te desampararei.", ref: "Hebreus 13:5" },
        { texto: "Sê forte e corajoso; não temas, nem te espantes, porque o Senhor teu Deus é contigo, por onde quer que andares.", ref: "Josué 1:9" },
        { texto: "Eis que estou convosco todos os dias, até a consumação dos séculos.", ref: "Mateus 28:20" },
        { texto: "Ainda que meu pai e minha mãe me desamparem, o Senhor me recolherá.", ref: "Salmo 27:10" },
        { texto: "O Senhor está perto de todos os que o invocam, de todos os que o invocam em verdade.", ref: "Salmo 145:18" },
        { texto: "Deus faz que o solitário viva em família.", ref: "Salmo 68:6" },
        { texto: "Porque os montes se retirarão, e os outeiros serão removidos; mas a minha benignidade não se apartará de ti.", ref: "Isaías 54:10" },
        { texto: "Quando passares pelas águas, estarei contigo; e quando pelos rios, eles não te submergirão.", ref: "Isaías 43:2" },
        { texto: "Como o pai se compadece dos filhos, assim o Senhor se compadece daqueles que o temem.", ref: "Salmo 103:13" },
        { texto: "Eu rogarei ao Pai, e ele vos dará outro Consolador, para que fique convosco para sempre.", ref: "João 14:16" }
    ],

    // 🙏 FÉ, DÚVIDAS, ESPIRITUALIDADE
    fe: [
        { texto: "Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.", ref: "Hebreus 11:1" },
        { texto: "Porque andamos por fé e não por vista.", ref: "2 Coríntios 5:7" },
        { texto: "Se com a tua boca confessares ao Senhor Jesus, e em teu coração creres que Deus o ressuscitou dos mortos, serás salvo.", ref: "Romanos 10:9" },
        { texto: "Jesus disse: Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai senão por mim.", ref: "João 14:6" },
        { texto: "Creio, Senhor! Ajuda a minha incredulidade.", ref: "Marcos 9:24" },
        { texto: "Pedi, e dar-se-vos-á; buscai, e encontrareis; batei, e abrir-se-vos-á.", ref: "Mateus 7:7" },
        { texto: "Chegai-vos a Deus, e ele se chegará a vós.", ref: "Tiago 4:8" },
        { texto: "De sorte que a fé é pelo ouvir, e o ouvir pela palavra de Deus.", ref: "Romanos 10:17" },
        { texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.", ref: "João 3:16" },
        { texto: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento.", ref: "Provérbios 3:5" }
    ],

    // ⚔️ TENTAÇÃO, PECADO, CULPA
    tentacao: [
        { texto: "Não vos sobreveio tentação que não fosse humana; mas Deus é fiel, e não permitirá que sejais tentados além das vossas forças.", ref: "1 Coríntios 10:13" },
        { texto: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar os pecados e nos purificar de toda injustiça.", ref: "1 João 1:9" },
        { texto: "Vinde então, e argui-me, diz o Senhor: ainda que os vossos pecados sejam como a escarlata, eles se tornarão brancos como a neve.", ref: "Isaías 1:18" },
        { texto: "Portanto, agora nenhuma condenação há para os que estão em Cristo Jesus.", ref: "Romanos 8:1" },
        { texto: "Quanto está longe o oriente do ocidente, assim afasta de nós as nossas transgressões.", ref: "Salmo 103:12" },
        { texto: "Não te deixes vencer do mal, mas vence o mal com o bem.", ref: "Romanos 12:21" },
        { texto: "Resisti ao diabo, e ele fugirá de vós.", ref: "Tiago 4:7" },
        { texto: "Porque não temos um sumo sacerdote que não possa compadecer-se das nossas fraquezas; porém um que foi tentado em tudo, à nossa semelhança, mas sem pecado.", ref: "Hebreus 4:15" },
        { texto: "Eu, eu mesmo, sou o que apago as tuas transgressões por amor de mim, e dos teus pecados não me lembro.", ref: "Isaías 43:25" },
        { texto: "Bem-aventurado o homem que suporta a tentação; porque, quando for aprovado, receberá a coroa da vida.", ref: "Tiago 1:12" }
    ],

    // 😠 RAIVA, MÁGOA, PERDÃO
    perdao: [
        { texto: "Perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores.", ref: "Mateus 6:12" },
        { texto: "Antes sede uns para com os outros benignos, misericordiosos, perdoando-vos uns aos outros, como também Deus vos perdoou em Cristo.", ref: "Efésios 4:32" },
        { texto: "Senhor, até quantas vezes pecará meu irmão contra mim, e eu lhe perdoarei? Até sete? Jesus lhe disse: Não te digo que até sete; mas até setenta vezes sete.", ref: "Mateus 18:21-22" },
        { texto: "Não vos vingueis a vós mesmos, amados, mas dai lugar à ira de Deus.", ref: "Romanos 12:19" },
        { texto: "Irai-vos e não pequeis; não se ponha o sol sobre a vossa ira.", ref: "Efésios 4:26" },
        { texto: "O ódio excita contendas, mas o amor cobre todas as transgressões.", ref: "Provérbios 10:12" },
        { texto: "Não julgueis, para que não sejais julgados.", ref: "Mateus 7:1" },
        { texto: "Amai os vossos inimigos e orai pelos que vos perseguem.", ref: "Mateus 5:44" },
        { texto: "Pai, perdoa-lhes, porque não sabem o que fazem.", ref: "Lucas 23:34" },
        { texto: "A resposta branda desvia o furor, mas a palavra dura suscita a ira.", ref: "Provérbios 15:1" }
    ],

    // 🌟 ESPERANÇA, FUTURO, PROPÓSITO
    esperanca: [
        { texto: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais.", ref: "Jeremias 29:11" },
        { texto: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias; correrão e não se cansarão; caminharão e não se fatigarão.", ref: "Isaías 40:31" },
        { texto: "Ora, o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança pela virtude do Espírito Santo.", ref: "Romanos 15:13" },
        { texto: "Eis que faço novas todas as coisas.", ref: "Apocalipse 21:5" },
        { texto: "Porque para Deus nada é impossível.", ref: "Lucas 1:37" },
        { texto: "Aquele que começou a boa obra em vós há de completá-la até ao dia de Cristo Jesus.", ref: "Filipenses 1:6" },
        { texto: "Tudo tem o seu tempo determinado, e há tempo para todo o propósito debaixo do céu.", ref: "Eclesiastes 3:1" },
        { texto: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus.", ref: "Romanos 8:28" },
        { texto: "Espera no Senhor, anima-te, e ele fortalecerá o teu coração; espera, pois, no Senhor.", ref: "Salmo 27:14" },
        { texto: "Jesus Cristo é o mesmo, ontem, hoje, e eternamente.", ref: "Hebreus 13:8" }
    ],

    // 💔 LUTO, PERDA, MORTE
    luto: [
        { texto: "Eu sou a ressurreição e a vida; quem crê em mim, ainda que esteja morto, viverá.", ref: "João 11:25" },
        { texto: "Bem-aventurados os que choram, porque eles serão consolados.", ref: "Mateus 5:4" },
        { texto: "Bendito seja o Deus e Pai de nosso Senhor Jesus Cristo, o Pai das misericórdias e o Deus de toda a consolação.", ref: "2 Coríntios 1:3" },
        { texto: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo.", ref: "Salmo 23:4" },
        { texto: "Não quero que vocês fiquem tristes como os outros que não têm esperança.", ref: "1 Tessalonicenses 4:13" },
        { texto: "Preciosa é à vista do Senhor a morte dos seus santos.", ref: "Salmo 116:15" },
        { texto: "Porque para mim o viver é Cristo, e o morrer é ganho.", ref: "Filipenses 1:21" },
        { texto: "Na casa de meu Pai há muitas moradas. Vou preparar-vos lugar.", ref: "João 14:2" },
        { texto: "Onde está, ó morte, a tua vitória? Onde está, ó morte, o teu aguilhão?", ref: "1 Coríntios 15:55" },
        { texto: "O Senhor deu e o Senhor o tomou; bendito seja o nome do Senhor.", ref: "Jó 1:21" }
    ],

    // 🙌 GRATIDÃO, LOUVOR, ALEGRIA
    gratidao: [
        { texto: "Dêem graças ao Senhor porque ele é bom; o seu amor dura para sempre.", ref: "Salmo 107:1" },
        { texto: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", ref: "1 Tessalonicenses 5:18" },
        { texto: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos.", ref: "Filipenses 4:4" },
        { texto: "Este é o dia que o Senhor fez; regozijemo-nos e alegremo-nos nele.", ref: "Salmo 118:24" },
        { texto: "O Senhor é a minha força e o meu cântico; ele é a minha salvação.", ref: "Êxodo 15:2" },
        { texto: "Dá-me a conhecer os caminhos da vida; na tua presença há plenitude de alegria.", ref: "Salmo 16:11" },
        { texto: "Bendize, ó minha alma, ao Senhor, e tudo o que há em mim bendiga o seu santo nome.", ref: "Salmo 103:1" },
        { texto: "Grandes coisas fez o Senhor por nós, e por isso estamos alegres.", ref: "Salmo 126:3" },
        { texto: "A alegria do Senhor é a vossa força.", ref: "Neemias 8:10" },
        { texto: "Engrandece a minha alma ao Senhor, e o meu espírito se alegra em Deus, meu Salvador.", ref: "Lucas 1:46-47" }
    ],

    // 💪 FORÇA, CORAGEM, PERSEVERANÇA
    forca: [
        { texto: "Tudo posso naquele que me fortalece.", ref: "Filipenses 4:13" },
        { texto: "O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?", ref: "Salmo 27:1" },
        { texto: "Mas os que esperam no Senhor renovarão as suas forças.", ref: "Isaías 40:31" },
        { texto: "Não temas, porque eu sou contigo.", ref: "Isaías 41:10" },
        { texto: "Sê forte e corajoso; não temas, nem te espantes, porque o Senhor teu Deus é contigo.", ref: "Josué 1:9" },
        { texto: "Quando me deitar, direi: Quando me levantarei? O Senhor te sustenta.", ref: "Salmo 3:5" },
        { texto: "Combati o bom combate, acabei a carreira, guardei a fé.", ref: "2 Timóteo 4:7" },
        { texto: "Eis que vos dou poder. Nada vos fará dano algum.", ref: "Lucas 10:19" },
        { texto: "Porque maior é o que está em vós do que o que está no mundo.", ref: "1 João 4:4" },
        { texto: "Somos mais que vencedores por aquele que nos amou.", ref: "Romanos 8:37" }
    ],

    // 🕊️ PAZ, DESCANSO, SERENIDADE
    paz: [
        { texto: "Deixo-vos a paz, a minha paz vos dou.", ref: "João 14:27" },
        { texto: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei.", ref: "Mateus 11:28" },
        { texto: "Tu conservarás em paz aquele cuja mente está firme em ti.", ref: "Isaías 26:3" },
        { texto: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações.", ref: "Filipenses 4:7" },
        { texto: "Em paz me deito e logo adormeço, porque só tu, Senhor, me fazes habitar em segurança.", ref: "Salmo 4:8" },
        { texto: "Aquietai-vos e sabei que eu sou Deus.", ref: "Salmo 46:10" },
        { texto: "E buscai a paz da cidade, e orai por ela ao Senhor.", ref: "Jeremias 29:7" },
        { texto: "Bem-aventurados os pacificadores, porque eles serão chamados filhos de Deus.", ref: "Mateus 5:9" },
        { texto: "Tomai sobre vós o meu jugo e aprendei de mim, que sou manso e humilde de coração; e encontrareis descanso para as vossas almas.", ref: "Mateus 11:29" },
        { texto: "A misericórdia, a paz e o amor vos sejam multiplicados.", ref: "Judas 1:2" }
    ],

    // 💑 AMOR, RELACIONAMENTO AMOROSO
    amor: [
        { texto: "O amor é paciente, é benigno; o amor não arde em ciúmes, não se ufana, não se ensoberbece.", ref: "1 Coríntios 13:4" },
        { texto: "Nisto conhecemos o amor: que Cristo deu a sua vida por nós.", ref: "1 João 3:16" },
        { texto: "Nós amamos porque ele nos amou primeiro.", ref: "1 João 4:19" },
        { texto: "Acima de tudo, porém, revesti-vos do amor, que é o vínculo da perfeição.", ref: "Colossenses 3:14" },
        { texto: "Amados, amemo-nos uns aos outros, porque o amor é de Deus.", ref: "1 João 4:7" },
        { texto: "O amor jamais acaba.", ref: "1 Coríntios 13:8" },
        { texto: "Como o Pai me amou, também eu vos amei; permanecei no meu amor.", ref: "João 15:9" },
        { texto: "Um novo mandamento vos dou: que vos ameis uns aos outros; assim como eu vos amei.", ref: "João 13:34" },
        { texto: "Que o Senhor vos faça crescer e transbordar em amor uns para com os outros.", ref: "1 Tessalonicenses 3:12" },
        { texto: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", ref: "João 3:16" }
    ],

    // 🎯 DECISÕES, SABEDORIA, ORIENTAÇÃO
    sabedoria: [
        { texto: "Se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente.", ref: "Tiago 1:5" },
        { texto: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento. Reconheça-o em todos os seus caminhos e ele endireitará as suas veredas.", ref: "Provérbios 3:5-6" },
        { texto: "Lâmpada para os meus pés é a tua palavra, e luz para o meu caminho.", ref: "Salmo 119:105" },
        { texto: "Eu te instruirei e te ensinarei o caminho que deves seguir; guiar-te-ei com os meus olhos.", ref: "Salmo 32:8" },
        { texto: "O temor do Senhor é o princípio da sabedoria.", ref: "Provérbios 9:10" },
        { texto: "Os planos do coração pertencem ao homem, mas do Senhor procede a resposta da língua.", ref: "Provérbios 16:1" },
        { texto: "O coração do homem planeja o seu caminho, mas o Senhor lhe dirige os passos.", ref: "Provérbios 16:9" },
        { texto: "Não sejas sábio a teus próprios olhos; teme ao Senhor e aparta-te do mal.", ref: "Provérbios 3:7" },
        { texto: "Bem-aventurado o homem que acha sabedoria, e o homem que adquire conhecimento.", ref: "Provérbios 3:13" },
        { texto: "Quando a sabedoria entrar no teu coração, e o conhecimento for agradável à tua alma, o bom siso te guardará.", ref: "Provérbios 2:10-11" }
    ]
};

// Palavras-chave para detectar o tema da conversa
const PALAVRAS_CHAVE = {
    ansiedade: ['ansiedade', 'ansioso', 'ansiosa', 'preocupado', 'preocupada', 'preocupação', 'medo', 'medos', 'temer', 'temor', 'aflito', 'aflita', 'aflição', 'angústia', 'angustiado', 'nervoso', 'nervosa', 'inquieto', 'inquieta', 'apreensivo', 'apreensiva', 'pânico', 'pavor', 'apavorado', 'apavorada', 'inseguro', 'insegura', 'insegurança', 'agonia', 'sufocado', 'sufocada', 'não consigo dormir', 'insônia'],
    tristeza: ['triste', 'tristeza', 'depressão', 'deprimido', 'deprimida', 'desanimado', 'desanimada', 'desânimo', 'abatido', 'abatida', 'chorando', 'chorar', 'lágrimas', 'sofrendo', 'sofrimento', 'dor', 'infeliz', 'vazio', 'vazia', 'sem esperança', 'melancolia', 'melancólico', 'cabisbaixo', 'pesado', 'pesada', 'cansado da vida', 'não tenho vontade'],
    familia: ['família', 'familiar', 'pai', 'mãe', 'filho', 'filha', 'filhos', 'irmão', 'irmã', 'marido', 'esposa', 'esposo', 'casamento', 'casado', 'casada', 'cônjuge', 'parente', 'parentes', 'sogra', 'sogro', 'neto', 'neta', 'avó', 'avô', 'tio', 'tia', 'primo', 'prima', 'cunhado', 'cunhada', 'enteado', 'enteada', 'padrasto', 'madrasta', 'genro', 'nora', 'brigas em casa', 'problemas em casa', 'relacionamento familiar'],
    financas: ['dinheiro', 'financeiro', 'financeira', 'finanças', 'dívida', 'dívidas', 'devendo', 'emprego', 'desemprego', 'desempregado', 'desempregada', 'trabalho', 'salário', 'conta', 'contas', 'pagar', 'boleto', 'boletos', 'falência', 'falido', 'falida', 'quebrado', 'quebrada', 'sem dinheiro', 'pobreza', 'pobre', 'necessidade', 'falta de dinheiro', 'crise', 'recessão', 'demissão', 'demitido', 'demitida'],
    saude: ['doença', 'doente', 'enfermo', 'enferma', 'enfermidade', 'saúde', 'hospital', 'médico', 'médica', 'cirurgia', 'câncer', 'tumor', 'tratamento', 'diagnóstico', 'exame', 'exames', 'dor física', 'sintomas', 'internado', 'internada', 'uti', 'remédio', 'remédios', 'medicamento', 'recuperação', 'cura', 'curar', 'covid', 'acidente', 'ferido', 'ferida'],
    solidao: ['sozinho', 'sozinha', 'solidão', 'solitário', 'solitária', 'abandonado', 'abandonada', 'abandono', 'isolado', 'isolada', 'isolamento', 'ninguém me entende', 'ninguém me ama', 'rejeitado', 'rejeitada', 'rejeição', 'excluído', 'excluída', 'ignorado', 'ignorada', 'esquecido', 'esquecida', 'sem amigos', 'sem ninguém'],
    fe: ['fé', 'dúvida', 'dúvidas', 'duvidar', 'duvido', 'acreditar', 'crer', 'crença', 'oração', 'orar', 'rezar', 'deus', 'jesus', 'espírito santo', 'igreja', 'religião', 'espiritual', 'espiritualidade', 'afastado de deus', 'longe de deus', 'não sinto deus', 'perdi a fé', 'incredulidade', 'conversão', 'vocação'],
    tentacao: ['pecado', 'pecados', 'pecar', 'tentação', 'tentado', 'tentada', 'culpa', 'culpado', 'culpada', 'remorso', 'arrependido', 'arrependida', 'arrependimento', 'vergonha', 'envergonhado', 'envergonhada', 'confessar', 'confissão', 'vício', 'vícios', 'cair', 'caí', 'recaída', 'fraqueza', 'fraco', 'fraca', 'errei', 'erro', 'erros'],
    perdao: ['perdão', 'perdoar', 'mágoa', 'magoado', 'magoada', 'raiva', 'ódio', 'rancor', 'ressentimento', 'ressentido', 'vingança', 'vingar', 'traição', 'traído', 'traída', 'ofensa', 'ofendido', 'ofendida', 'injustiça', 'injusto', 'injusta', 'machucou', 'machucado', 'machucada', 'ferida emocional', 'guardar mágoa'],
    esperanca: ['esperança', 'futuro', 'sonho', 'sonhos', 'planos', 'propósito', 'sentido', 'direção', 'destino', 'caminho', 'rumo', 'objetivo', 'meta', 'metas', 'expectativa', 'expectativas', 'amanhã', 'dias melhores', 'novo começo', 'recomeçar', 'recomeço', 'renovação', 'renovar', 'mudança', 'mudar'],
    luto: ['luto', 'morte', 'morreu', 'faleceu', 'falecimento', 'perdi alguém', 'perda', 'perdemos', 'partiu', 'descansou', 'céu', 'saudade', 'saudades', 'falta', 'ausência', 'velório', 'enterro', 'funeral', 'viúvo', 'viúva', 'órfão', 'órfã', 'ente querido'],
    gratidao: ['gratidão', 'grato', 'grata', 'agradecer', 'agradecimento', 'obrigado', 'obrigada', 'feliz', 'felicidade', 'alegria', 'alegre', 'contente', 'abençoado', 'abençoada', 'bênção', 'bênçãos', 'vitória', 'conquista', 'consegui', 'alcancei', 'realizado', 'realizada', 'celebrar', 'celebração', 'louvor', 'louvando'],
    forca: ['força', 'coragem', 'ânimo', 'perseverança', 'persistência', 'resistir', 'aguentar', 'suportar', 'lutar', 'luta', 'batalha', 'guerreiro', 'guerreira', 'vencer', 'superar', 'desistir', 'cansado', 'cansada', 'exausto', 'exausta', 'esgotado', 'esgotada', 'burnout', 'não aguento mais', 'difícil demais'],
    paz: ['paz', 'descanso', 'descansar', 'tranquilidade', 'tranquilo', 'tranquila', 'sossego', 'calma', 'calmo', 'calma', 'serenidade', 'sereno', 'serena', 'quietude', 'alívio', 'aliviar', 'relaxar', 'estresse', 'estressado', 'estressada'],
    amor: ['amor', 'amar', 'namorado', 'namorada', 'noivo', 'noiva', 'namorando', 'relacionamento', 'paixão', 'apaixonado', 'apaixonada', 'coração partido', 'término', 'terminar', 'terminei', 'separação', 'separado', 'separada', 'divórcio', 'divorciado', 'divorciada', 'solteiro', 'solteira', 'carência', 'carente', 'decepção amorosa'],
    sabedoria: ['decisão', 'decidir', 'escolha', 'escolher', 'dúvida', 'confuso', 'confusa', 'não sei o que fazer', 'orientação', 'direção', 'caminho', 'sabedoria', 'conselho', 'conselhos', 'guiar', 'guia', 'discernimento', 'discernir', 'opção', 'opções', 'dilema', 'encruzilhada']
};

// Introduções variadas para Maria apresentar o versículo
const INTRODUCOES = [
    "Sabe o que meu filho Jesus disse uma vez?",
    "Tem uma passagem que guardo no coração...",
    "Lembro de uma palavra que sempre me consolou:",
    "Meu filho deixou essa promessa para nós:",
    "Há uma passagem que o Espírito Santo colocou no meu coração agora:",
    "Deixa eu te compartilhar algo que as Escrituras nos ensinam:",
    "Sabe, tem uma promessa divina que fala exatamente disso:",
    "O Senhor nos deixou uma palavra linda sobre isso:",
    "Quando eu passava por momentos assim, essa passagem me sustentava:",
    "Existe uma verdade nas Escrituras que pode te ajudar:",
    "Olha o que a Palavra de Deus nos diz:",
    "Meu coração de mãe quer te lembrar dessa promessa:",
    "Jesus ensinou algo muito bonito sobre isso:",
    "Deixa eu te contar o que está escrito na Palavra:",
    "Essa passagem sempre trouxe luz ao meu coração:"
];

// Função para detectar o tema principal da conversa
function detectarTema(mensagem) {
    const msgLower = mensagem.toLowerCase();
    let melhorTema = 'esperanca'; // tema padrão
    let maiorPontuacao = 0;
    
    for (const [tema, palavras] of Object.entries(PALAVRAS_CHAVE)) {
        let pontuacao = 0;
        for (const palavra of palavras) {
            if (msgLower.includes(palavra)) {
                pontuacao++;
            }
        }
        if (pontuacao > maiorPontuacao) {
            maiorPontuacao = pontuacao;
            melhorTema = tema;
        }
    }
    
    return melhorTema;
}

// Função para selecionar versículo aleatório de um tema
function selecionarVersiculo(tema) {
    const versiculos = VERSICULOS[tema] || VERSICULOS.esperanca;
    const indice = Math.floor(Math.random() * versiculos.length);
    return versiculos[indice];
}

// Função para selecionar introdução aleatória
function selecionarIntroducao() {
    const indice = Math.floor(Math.random() * INTRODUCOES.length);
    return INTRODUCOES[indice];
}

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
            // ETAPA 3: Citar passagem bíblica - SISTEMA ROBUSTO
            maxTokens = 400;
            
            // Detectar tema da conversa e selecionar versículo apropriado
            const temaDetectado = detectarTema(mensagem);
            const versiculoSelecionado = selecionarVersiculo(temaDetectado);
            const introducaoSelecionada = selecionarIntroducao();
            
            console.log(`📖 Tema detectado: ${temaDetectado} | Versículo: ${versiculoSelecionado.ref}`);
            
            systemPrompt = `Você é Maria, Mãe de Jesus. Fale em português brasileiro amoroso e maternal.

INFORMAÇÃO: O nome da pessoa é ${userProfile.nome}. Trate como "${tratamentoCurto}".

TAREFA: Esta é a TERCEIRA mensagem. Você deve compartilhar uma passagem bíblica de forma acolhedora.

🎯 VERSÍCULO SELECIONADO PARA ESTA CONVERSA:
"${versiculoSelecionado.texto}" - ${versiculoSelecionado.ref}

📝 ESTRUTURA DA SUA RESPOSTA (siga exatamente):

1. ACOLHIMENTO (1 frase): Valide brevemente o que a pessoa está sentindo.

2. INTRODUÇÃO DO VERSÍCULO: Use exatamente esta introdução: "${introducaoSelecionada}"

3. CITE O VERSÍCULO: Cite EXATAMENTE o versículo acima entre aspas, seguido da referência.

4. CONEXÃO PESSOAL (2-3 frases): Conecte o versículo com a situação específica da pessoa. Fale como mãe que entende a dor.

5. ENCERRAMENTO: Termine com carinho e pergunte se pode ajudar com mais algo.

⚠️ REGRAS IMPORTANTES:
- Use APENAS o versículo fornecido acima, não invente outro
- Cite o versículo COMPLETO, não resuma
- Inclua a referência bíblica (${versiculoSelecionado.ref})
- Mantenha tom maternal e acolhedor
- Use no máximo 1-2 emojis (💛, 🙏, ✨)
- Resposta deve ter 4-6 frases no total

EXEMPLO DE TOM:
"Eu entendo, ${tratamentoCurto}... ${introducaoSelecionada} '${versiculoSelecionado.texto.substring(0, 50)}...' (${versiculoSelecionado.ref}). [conexão pessoal]. Posso fazer mais alguma coisa por você?"`;
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
