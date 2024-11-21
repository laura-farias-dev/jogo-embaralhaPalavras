const words = ["SAPO", "RATO", "GATO", "VACA", "COELHO", "BOI"];
let selectedWord = words[Math.floor(Math.random() * words.length)];
let shuffledWord = shuffleWord(selectedWord);
let score = 0;

function shuffleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function createWord() {
    const wordContainer = document.getElementById("wordContainer");
    wordContainer.innerHTML = "";  // Limpa o conteúdo anterior
    
    shuffledWord.split('').forEach((letter, index) => {
        const span = document.createElement("span");
        span.classList.add("letter");
        span.setAttribute("draggable", "true");
        span.setAttribute("data-index", index);
        span.addEventListener("dragstart", dragStart);
        span.addEventListener("dragover", dragOver);
        span.addEventListener("drop", drop);

        const letterPosition = letter.toLowerCase().charCodeAt(0) - 97 + 1; // A=1, B=2, ..., Z=26
        const img = document.createElement("img");
        img.src = `/images/${letterPosition}.png`;  // Caminho da imagem para cada letra
        img.alt = letter;  // Definindo o alt como a letra

        span.appendChild(img);  // Adiciona a imagem no elemento <span>
        wordContainer.appendChild(span);  // Adiciona o <span> no container
    });
    
    adjustWordSize();  // Ajusta o tamanho das letras
}

function adjustWordSize() {
    const wordContainer = document.getElementById("wordContainer");
    const wordWidth = wordContainer.offsetWidth;  // Largura disponível para as letras
    const totalLettersWidth = Array.from(wordContainer.children).reduce((acc, letterSpan) => {
        return acc + letterSpan.offsetWidth;  // Soma as larguras das letras
    }, 0);
    
    if (totalLettersWidth > wordWidth) {
        const scaleFactor = wordWidth / totalLettersWidth;  // Calcula o fator de escala
        Array.from(wordContainer.children).forEach(letterSpan => {
            letterSpan.style.transform = `scale(${scaleFactor})`;  // Aplica o fator de escala
        });
    } else {
        Array.from(wordContainer.children).forEach(letterSpan => {
            letterSpan.style.transform = `scale(1)`;  // Restaura o tamanho normal se couber
        });
    }
}


let draggedLetter = null;

function dragStart(e) {
    draggedLetter = e.target;
    e.dataTransfer.setData("text/plain", e.target.getAttribute("data-index"));
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    e.target.classList.remove("drag-over");
    
    if (draggedLetter !== e.target) {
        const draggedIndex = draggedLetter.getAttribute("data-index");
        const droppedIndex = e.target.getAttribute("data-index");

        const draggedImg = draggedLetter.querySelector("img");
        const droppedImg = e.target.querySelector("img");

        const tempSrc = draggedImg.src;
        const tempAlt = draggedImg.alt;

        draggedImg.src = droppedImg.src;
        draggedImg.alt = droppedImg.alt;

        droppedImg.src = tempSrc;
        droppedImg.alt = tempAlt;

        draggedLetter.setAttribute("data-index", droppedIndex);
        e.target.setAttribute("data-index", draggedIndex);
    }
}

document.getElementById("checkButton").addEventListener("click", function() {
    const currentWord = Array.from(document.querySelectorAll(".letter"))
        .map(letter => letter.querySelector("img").alt)  // Pegando o alt da imagem
        .join('');
    const message = document.getElementById("message");
    const scoreElement = document.getElementById("score");

    if (currentWord === selectedWord) {
        message.textContent = "Parabéns! Você acertou!";
        message.style.color = "#2ecc71";
        score += 10;  // Adiciona 10 pontos ao acerto
        scoreElement.textContent = `Pontuação: ${score}`;
        shakeLetters();
        setTimeout(generateNewWord, 1000);  // Gera uma nova palavra após 1 segundo
    } else {
        message.textContent = "Tente novamente!";
        message.style.color = "#e74c3c";
        scoreElement.textContent = `Pontuação: ${score}`;  // Não altera a pontuação
        fallLetters();
    }
});

function shakeLetters() {
    const letters = document.querySelectorAll(".letter");
    letters.forEach(letter => {
        letter.classList.add("shake");
    });

    setTimeout(() => {
        letters.forEach(letter => {
            letter.classList.remove("shake");
        });
    }, 1500);  // Duração do tremor
}

function fallLetters() {
    const letters = document.querySelectorAll(".letter");
    letters.forEach(letter => {
        letter.classList.add("fall");
    });

    setTimeout(() => {
        letters.forEach(letter => {
            letter.classList.remove("fall");
        });
    }, 2000);  // Duração da animação de queda (em espiral)
}

function generateNewWord() {
    selectedWord = words[Math.floor(Math.random() * words.length)];  // Escolhe uma nova palavra aleatória
    shuffledWord = shuffleWord(selectedWord);  // Embaralha a nova palavra
    createWord();  // Atualiza o jogo com a nova palavra embaralhada
}

createWord();
