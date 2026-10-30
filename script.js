// ======================================
// DASHBOARD DE VENDAS - TECH STORE
// ======================================

// Elementos do HTML
const formulario = document.getElementById("formProduto");

const campoNome = document.getElementById("nomeProduto");
const campoPreco = document.getElementById("precoProduto");
const campoQuantidade = document.getElementById("quantidadeProduto");

const tabela = document.getElementById("tabelaProdutos");
const tabelaVazia = document.getElementById("tabelaVazia");
const mensagem = document.getElementById("mensagem");

const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelar = document.getElementById("botaoCancelar");

const faturamento = document.getElementById("faturamento");
const totalProdutos = document.getElementById("totalProdutos");
const totalUnidades = document.getElementById("totalUnidades");

// ======================================
// CARREGAR PRODUTOS SALVOS
// ======================================

let produtos = [];

try {
    const dados = localStorage.getItem("techStoreProdutos");

    if (dados) {
        const dadosConvertidos = JSON.parse(dados);

        if (Array.isArray(dadosConvertidos)) {
            produtos = dadosConvertidos;
        }
    }
} catch (erro) {
    console.error("Erro ao carregar produtos:", erro);
}

let produtoEditando = null;

// ======================================
// FORMATAR VALORES EM REAIS
// ======================================

function moeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

// ======================================
// SALVAR PRODUTOS
// ======================================

function salvarDados() {
    localStorage.setItem(
        "techStoreProdutos",
        JSON.stringify(produtos)
    );
}

// ======================================
// MOSTRAR MENSAGENS
// ======================================

function mostrarMensagem(texto) {
    mensagem.textContent = texto;
}

// ======================================
// ATUALIZAR INDICADORES
// ======================================

function atualizarIndicadores() {

    let valorTotal = 0;
    let unidades = 0;

    produtos.forEach(function(produto) {
        valorTotal += produto.preco * produto.quantidade;
        unidades += produto.quantidade;
    });

    faturamento.textContent = moeda(valorTotal);
    totalProdutos.textContent = produtos.length;
    totalUnidades.textContent = unidades;
}

// ======================================
// MOSTRAR PRODUTOS NA TABELA
// ======================================

function mostrarProdutos() {

    tabela.innerHTML = "";

    produtos.forEach(function(produto, indice) {

        const linha = document.createElement("tr");

        const nome = document.createElement("td");
        nome.textContent = produto.nome;

        const preco = document.createElement("td");
        preco.textContent = moeda(produto.preco);

        const quantidade = document.createElement("td");
        quantidade.textContent = produto.quantidade;

        const total = document.createElement("td");
        total.textContent = moeda(
            produto.preco * produto.quantidade
        );

        const acoes = document.createElement("td");

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.type = "button";
        botaoEditar.className = "botao-editar";

        botaoEditar.addEventListener("click", function() {
            editarProduto(indice);
        });

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.type = "button";
        botaoExcluir.className = "botao-excluir";

        botaoExcluir.addEventListener("click", function() {
            excluirProduto(indice);
        });

        const grupoBotoes = document.createElement("div");
        grupoBotoes.className = "acoes";

        grupoBotoes.appendChild(botaoEditar);
        grupoBotoes.appendChild(botaoExcluir);

        acoes.appendChild(grupoBotoes);

        linha.appendChild(nome);
        linha.appendChild(preco);
        linha.appendChild(quantidade);
        linha.appendChild(total);
        linha.appendChild(acoes);

        tabela.appendChild(linha);
    });

    tabelaVazia.hidden = produtos.length !== 0;

    atualizarIndicadores();
}

// ======================================
// CADASTRAR OU ATUALIZAR PRODUTO
// ======================================

formulario.addEventListener("submit", function(evento) {

    evento.preventDefault();

    const nome = campoNome.value.trim();
    const preco = Number(campoPreco.value);
    const quantidade = Number(campoQuantidade.value);

    if (nome === "") {
        mostrarMensagem("Digite o nome do produto.");
        return;
    }

    if (!Number.isFinite(preco) || preco <= 0) {
        mostrarMensagem("Digite um preço válido.");
        return;
    }

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        mostrarMensagem("Digite uma quantidade válida.");
        return;
    }

    const novoProduto = {
        nome: nome,
        preco: preco,
        quantidade: quantidade
    };

    if (produtoEditando === null) {

        produtos.push(novoProduto);

        mostrarMensagem("Produto cadastrado com sucesso!");

    } else {

        produtos[produtoEditando] = novoProduto;

        mostrarMensagem("Produto atualizado com sucesso!");
    }

    salvarDados();
    mostrarProdutos();
    limparFormulario();

});

// ======================================
// EDITAR PRODUTO
// ======================================

function editarProduto(indice) {

    const produto = produtos[indice];

    campoNome.value = produto.nome;
    campoPreco.value = produto.preco;
    campoQuantidade.value = produto.quantidade;

    produtoEditando = indice;

    botaoSalvar.textContent = "Salvar alterações";
    botaoCancelar.hidden = false;

    mostrarMensagem("Altere os dados e clique em salvar.");

    campoNome.focus();
}

// ======================================
// EXCLUIR PRODUTO
// ======================================

function excluirProduto(indice) {

    const confirmar = confirm(
        "Deseja realmente excluir este produto?"
    );

    if (!confirmar) {
        return;
    }

    produtos.splice(indice, 1);

    if (produtoEditando === indice) {
        limparFormulario();
    } else if (
        produtoEditando !== null &&
        produtoEditando > indice
    ) {
        produtoEditando--;
    }

    salvarDados();
    mostrarProdutos();

    mostrarMensagem("Produto excluído com sucesso!");
}

// ======================================
// LIMPAR FORMULÁRIO
// ======================================

function limparFormulario() {

    formulario.reset();

    produtoEditando = null;

    botaoSalvar.textContent = "Adicionar produto";

    botaoCancelar.hidden = true;
}

// ======================================
// CANCELAR EDIÇÃO
// ======================================

botaoCancelar.addEventListener("click", function() {

    limparFormulario();

    mostrarMensagem("Edição cancelada.");

});

// ======================================
// INICIAR SISTEMA
// ======================================

mostrarProdutos();

console.log("Dashboard Tech Store iniciado com sucesso!");