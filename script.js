const operationDisplay = document.getElementById("operation");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll("button");
const historyList = document.getElementById("history-list");
const toggleHistoryBtn = document.getElementById("toggle-history");
const historyBox = document.getElementById("history");

toggleHistoryBtn.addEventListener("click", () => {
    historyBox.classList.toggle("hidden");
});

let currentOperation = "";

// CLICK CON EL MOUSE
buttons.forEach(button => {
    button.addEventListener("click", () => {
        if (button.id === "toggle-history") return;

        // Si el botón tiene data-val (operadores), usamos eso. Si no, su textContent.
        const value = button.dataset.val || button.textContent;
        handleInput(value);
    });
});

// TECLADO FÍSICO Y NUMÉRICO
document.addEventListener("keydown", (event) => {
    const key = event.key;

    if (!isNaN(key)) {
        handleInput(key);
    }
    else if (["+", "-", "*", "/", "."].includes(key)) {
        handleInput(key);
    }
    else if (key === "Enter") {
        event.preventDefault();
        handleInput("=");
    }
    else if (key === "Backspace") {
        handleInput("DEL");
    }
    else if (key === "Escape") {
        handleInput("C");
    }
});

// FUNCIÓN CENTRAL
function handleInput(value) {
    // LIMPIAR TODO
    if (value === "C") {
        currentOperation = "";
        operationDisplay.textContent = "";
        resultDisplay.textContent = "0";
        return;
    }

    // BORRAR ÚLTIMO
    if (value === "DEL") {
        currentOperation = currentOperation.slice(0, -1);
        operationDisplay.textContent = currentOperation;
        if (currentOperation === "") resultDisplay.textContent = "0";
        return;
    }

    // CALCULAR
    if (value === "=") {
        if (!currentOperation) return;
        try {
            // Reemplazamos los símbolos visuales si fuera necesario (aunque aquí usamos los mismos)
            const result = eval(currentOperation);

            // mostrar resultado
            resultDisplay.textContent = result;

            // guardar en historial
            const li = document.createElement("li");
            li.textContent = `${currentOperation} = ${result}`;
            li.dataset.operation = currentOperation;

            // CLICK PARA REUTILIZAR
            li.addEventListener("click", () => {
                currentOperation = li.dataset.operation;
                operationDisplay.textContent = currentOperation;
                resultDisplay.textContent = result; // Mantenemos el resultado visual
                historyBox.classList.add("hidden");
            });

            historyList.prepend(li);

        } catch {
            resultDisplay.textContent = "Error";
        }
        return;
    }

    // EVITAR MÚLTIPLES OPERADORES SEGUIDOS (Básico)
    const lastChar = currentOperation.slice(-1);
    if (["+", "-", "*", "/"].includes(value) && ["+", "-", "*", "/"].includes(lastChar)) {
        currentOperation = currentOperation.slice(0, -1) + value;
    } else {
        currentOperation += value;
    }

    operationDisplay.textContent = currentOperation;
}
