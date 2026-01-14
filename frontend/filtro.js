// ========================================
// 🛡️ FILTRO DE PALAVRAS IMPRÓPRIAS
// Versão simplificada - só palavras completas
// ========================================

const FiltroPalavras = {
    // Lista de palavrões (só palavras completas serão detectadas)
    palavrasBloqueadas: [
        'porra', 'caralho', 'merda', 'bosta', 'foder', 'fodase', 'foda-se',
        'puta', 'putaria', 'vagabunda', 'vadia', 'piranha',
        'viado', 'bicha', 'sapatao',
        'buceta', 'boceta', 'xoxota', 'xereca',
        'rola', 'cacete', 'piroca',
        'cuzao', 'arrombado', 'arrombada',
        'desgracado', 'desgracada', 'maldito', 'maldita',
        'imbecil', 'idiota', 'retardado', 'retardada',
        'otario', 'babaca', 'trouxa',
        'corno', 'corna', 'chifrudo',
        'fdp', 'pqp', 'vsf', 'tnc', 'vtnc',
        'filhodaputa', 'filhadaputa'
    ],

    // Validar texto
    validar(texto) {
        if (!texto || texto.trim().length === 0) {
            return { valido: false, mensagem: 'Por favor, escreva algo.' };
        }
        
        if (texto.trim().length < 3) {
            return { valido: false, mensagem: 'Texto muito curto.' };
        }
        
        if (texto.length > 500) {
            return { valido: false, mensagem: 'Texto muito longo (máximo 500 caracteres).' };
        }
        
        // Converter para minúsculas e separar em palavras
        const palavrasTexto = texto.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .split(/[\s.,!?;:'"()\-]+/)
            .filter(p => p.length > 0);
        
        // Verificar cada palavra
        for (const palavra of palavrasTexto) {
            if (this.palavrasBloqueadas.includes(palavra)) {
                console.log('🛡️ Palavra imprópria detectada:', palavra);
                return { 
                    valido: false, 
                    mensagem: '🙏 Por favor, use palavras respeitosas neste espaço sagrado de oração.' 
                };
            }
        }
        
        return { valido: true };
    },

    // Validar nome
    validarNome(nome) {
        if (!nome || nome.trim().length === 0) {
            return { valido: true };
        }
        
        if (nome.length > 30) {
            return { valido: false, mensagem: 'Nome muito longo (máximo 30 caracteres).' };
        }
        
        return this.validar(nome);
    }
};

window.FiltroPalavras = FiltroPalavras;
