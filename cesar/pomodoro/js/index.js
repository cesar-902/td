let isRunning = false;
let focusTime = 25 * 60; // Tempo de foco em segundos
let breakTime = 15 * 60; // Tempo de intervalo em segundos
let timerInterval;

// Função para formatar o tempo (minutos:segundos)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Atualiza o tempo no display
function updateTimerDisplay() {
    document.getElementById('focus-timer').textContent = formatTime(focusTime);
    document.getElementById('break-timer').textContent = formatTime(breakTime);
}

// Inicia ou pausa o temporizador
function toggleTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        document.getElementById('playPauseButton').textContent = '▶️ Iniciar';
    } else {
        timerInterval = setInterval(() => {
            if (focusTime > 0) {
                focusTime--;
            } else if (breakTime > 0) {
                breakTime--;
            } else {
                resetTimer();
            }
            updateTimerDisplay();
        }, 1000);
        document.getElementById('playPauseButton').textContent = '⏸️ Pausar';
    }
    isRunning = !isRunning;
}

// Reseta o temporizador para os valores iniciais
function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    focusTime = 25 * 60;
    breakTime = 15 * 60;
    updateTimerDisplay();
    document.getElementById('playPauseButton').textContent = '▶️ Iniciar';
}

// Atualiza a exibição inicial dos timers
updateTimerDisplay();
