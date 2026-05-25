<?php
// Configurar timezone para horário de Brasília
date_default_timezone_set('America/Sao_Paulo');

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Receber dados
$data = json_decode(file_get_contents('php://input'), true);

$tipo = $data['tipo'] ?? '';
$conteudo = $data['conteudo'] ?? '';
$autor = $data['autor'] ?? 'Não identificado';
$motivo = $data['motivo'] ?? 'Não especificado';
$descricao = $data['descricao'] ?? '';
$denunciante = $data['denunciante'] ?? 'Anônimo';
$velaId = $data['velaId'] ?? '';
$intencaoId = $data['intencaoId'] ?? '';
$isFake = $data['isFake'] ?? false;
$dataHora = date('d/m/Y H:i:s');

// Validar
if (!$tipo || !$conteudo) {
    http_response_code(400);
    echo json_encode(['error' => 'Dados incompletos']);
    exit;
}

// Validar descrição obrigatória
if (strlen(trim($descricao)) < 10) {
    http_response_code(400);
    echo json_encode(['error' => 'Descrição obrigatória (mínimo 10 caracteres)']);
    exit;
}

// Configurar email
$to = 'contato@conversecommaria.com.br';
$tipoTexto = ($tipo === 'mural') ? 'Mural de Intenções' : 'Santuário de Velas';
$subject = "=?UTF-8?B?" . base64_encode("🚩 Denúncia: " . $tipoTexto . " - " . $dataHora) . "?=";

$idConteudo = $velaId ?: $intencaoId;
$fakeTexto = $isFake ? '<span style="color: #f59e0b; font-weight: bold;">[CONTEÚDO SIMULADO/FAKE]</span>' : '';

$message = "
<html>
<head>
<meta charset='UTF-8'>
</head>
<body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
<h2 style='color: #7c3aed;'>🚩 Nova Denúncia - Converse com Maria</h2>
<hr style='border: 1px solid #e5e7eb;'>

<p><strong>📅 Data/Hora:</strong> $dataHora</p>
<p><strong>📍 Tipo:</strong> $tipoTexto $fakeTexto</p>
<p><strong>👤 Autor do conteúdo:</strong> $autor</p>
" . ($idConteudo ? "<p><strong>🔑 ID:</strong> $idConteudo</p>" : "") . "

<div style='background: #fef3c7; padding: 15px; border-radius: 8px; margin: 15px 0;'>
<p><strong>📝 Conteúdo denunciado:</strong></p>
<p style='font-style: italic;'>\"$conteudo\"</p>
</div>

<p><strong>⚠️ Motivo:</strong> $motivo</p>

<div style='background: #fee2e2; padding: 15px; border-radius: 8px; margin: 15px 0;'>
<p><strong>📋 Descrição do denunciante:</strong></p>
<p>\"$descricao\"</p>
</div>

<p><strong>🔔 Denunciante:</strong> $denunciante</p>

<hr style='border: 1px solid #e5e7eb;'>
<p style='color: #6b7280; font-size: 12px;'>
Este email foi enviado automaticamente pelo sistema de moderação do app Converse com Maria.
</p>
</body>
</html>
";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/html; charset=UTF-8\r\n";
$headers .= "From: Converse com Maria <contato@conversecommaria.com.br>\r\n";
$headers .= "Reply-To: contato@conversecommaria.com.br\r\n";

// Enviar
if (mail($to, $subject, $message, $headers)) {
    echo json_encode(['success' => true, 'message' => 'Denúncia enviada com sucesso']);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao enviar email']);
}
?>
