document.getElementById("faturamentoForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const loja = document.getElementById("loja").value;
    const data = document.getElementById("data").value;
    const valor = document.getElementById("valor").value;

    const response = await fetch("http://localhost:3000/faturamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loja, data, valor })
    });

    if (response.ok) {
        alert("Faturamento registrado com sucesso!");
        carregarFaturamento();
    } else {
        alert("Erro ao registrar faturamento.");
    }
});

// Função para listar faturamentos
async function carregarFaturamento() {
    const response = await fetch("http://localhost:3000/faturamento");
    const dados = await response.json();

    const tabela = document.getElementById("tabelaFaturamento");
    tabela.innerHTML = "<tr><th>Loja</th><th>Data</th><th>Valor</th></tr>";

    dados.forEach(faturamento => {
        const linha = tabela.insertRow();
        linha.insertCell().innerText = faturamento.loja;
        linha.insertCell().innerText = faturamento.data;
        linha.insertCell().innerText = faturamento.valor;
    });
}

// Carregar os faturamentos ao abrir a página
carregarFaturamento();