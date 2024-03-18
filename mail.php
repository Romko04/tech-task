<?php
// Перевірка наявності POST-даних
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Отримання даних форми
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Визначення отримувача
    $to = htmlspecialchars($data['Gmail']); // Екранування адреси електронної пошти
    
    // Підготовка електронного листа
    $subject = 'Нова заявка від ' . htmlspecialchars($data['Name']); // Екранування заголовка листа
    $message = 'Ім\'я: ' . htmlspecialchars($data['Name']) . "\r\n"; // Екранування тексту листа
    
    // Додавання інших даних
    $message .= 'Gmail: ' . htmlspecialchars($data['Gmail']) . "\r\n";
    $message .= 'Телефон: ' . htmlspecialchars($data['Phone']) . "\r\n";
    $message .= 'Пароль: ' . htmlspecialchars(trim($data['Password'])) . "\r\n";
    $message .= 'Місце: ' . htmlspecialchars($data['Checkbox']) . "\r\n";

    $headers = 'From: tech-task@example.com' . "\r\n" .
        'Reply-To: '. htmlspecialchars($data['Gmail']) . "\r\n" . // Екранування адреси відповіді
        'X-Mailer: PHP/' . phpversion();
    
    $mailSent = mail($to, $subject, $message, $headers);
    
    // Відповідь JSON щодо успішності відправки
    if ($mailSent) {
        echo json_encode(array('success' => true));
    } else {
        echo json_encode(array('success' => false));
    }
}
?>
