<?php
/**
 * API para enviar dados do brinde (medalha) por email
 * Converse com Maria
 * 
 * Colocar em: public_html/api/enviar-brinde.php
 */

// Headers CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Apenas POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['erro' => 'Método não permitido']);
    exit();
}

// Receber dados JSON
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

if (!$dados) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados inválidos']);
    exit();
}

// Validar dados
if ($dados['tipo'] !== 'brinde_medalha' || !isset($dados['endereco'])) {
    http_response_code(400);
    echo json_encode(['erro' => 'Dados incompletos']);
    exit();
}

// Extrair informações
$endereco = $dados['endereco'];
$plano = $dados['plano'] ?? 'anual';
$emailUsuario = $dados['email_usuario'] ?? 'não informado';
$dataHora = $dados['data'] ?? date('d/m/Y H:i:s');

// Montar email
$para = 'contato@conversecommaria.com.br';
$assunto = '🏅 Nova Medalha para Enviar - Converse com Maria';

$mensagem = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #8B5CF6, #6366F1); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .info-box { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; border-left: 4px solid #8B5CF6; }
        .label { font-weight: bold; color: #666; font-size: 12px; text-transform: uppercase; }
        .value { font-size: 16px; color: #333; margin-top: 5px; }
        .footer { text-align: center; padding: 15px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>🏅 Nova Medalha para Enviar!</h1>
            <p>Um usuário Premium assinou o plano anual</p>
        </div>
        
        <div class='content'>
            <h2>📦 Dados para Envio:</h2>
            
            <div class='info-box'>
                <div class='label'>Nome Completo</div>
                <div class='value'>{$endereco['nome']}</div>
            </div>
            
            <div class='info-box'>
                <div class='label'>Endereço</div>
                <div class='value'>
                    {$endereco['rua']}, {$endereco['numero']}" . 
                    (!empty($endereco['complemento']) ? " - {$endereco['complemento']}" : "") . "
                    <br>{$endereco['bairro']}
                    <br>{$endereco['cidade']} / {$endereco['uf']}
                    <br>CEP: {$endereco['cep']}
                </div>
            </div>
            
            <div class='info-box'>
                <div class='label'>Email do Usuário</div>
                <div class='value'>{$emailUsuario}</div>
            </div>
            
            <div class='info-box'>
                <div class='label'>Plano Contratado</div>
                <div class='value'>" . ucfirst($plano) . "</div>
            </div>
            
            <div class='info-box'>
                <div class='label'>Data/Hora da Assinatura</div>
                <div class='value'>{$dataHora}</div>
            </div>
        </div>
        
        <div class='footer'>
            <p>Este email foi enviado automaticamente pelo app Converse com Maria</p>
            <p>🙏 Maria, rogai por nós!</p>
        </div>
    </div>
</body>
</html>
";

// Headers do email
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Converse com Maria <noreply@conversecommaria.com.br>\r\n";
$headers .= "Reply-To: contato@conversecommaria.com.br\r\n";

// Enviar email
$enviado = mail($para, $assunto, $mensagem, $headers);

if ($enviado) {
    // Log do envio
    $log = date('Y-m-d H:i:s') . " - Brinde enviado para: {$endereco['nome']} - {$endereco['cidade']}/{$endereco['uf']}\n";
    file_put_contents(__DIR__ . '/logs/brindes.log', $log, FILE_APPEND);
    
    http_response_code(200);
    echo json_encode([
        'sucesso' => true,
        'mensagem' => 'Dados do brinde enviados com sucesso!'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'sucesso' => false,
        'erro' => 'Erro ao enviar email'
    ]);
}
