document.addEventListener("DOMContentLoaded", function() {

window.enviarSinal = function() {
    const container = document.getElementById("sinaisContainer");
    const now = new Date();
    const hora = now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const div = document.createElement("div");
    div.textContent = hora + " ok";
    div.dataset.hora = hora;
    container.appendChild(div);
};

window.adicionarEncomenda = function(tipo) {
    const id = tipo === 'entrada' ? "encomendaEntradaContainer" : tipo === 'saida' ? "encomendaSaidaContainer" : `encomenda${tipo.charAt(0).toUpperCase() + tipo.slice(1)}Container`;
    const container = document.getElementById(id);
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<input type="text" placeholder="Casa" class="casa"><input type="text" placeholder="Nome do Morador" class="morador"><input type="time" class="hora"><button type="button" class="btn-remove" onclick="removerItem(this)">Remover</button>';
    container.appendChild(div);
};

window.adicionarEncomendaPortaria = function() {
    const container = document.getElementById("encomendaPortariaContainer");
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<input type="text" placeholder="Casa" class="casa"><input type="number" placeholder="Qtd" class="qtd" min="1"><select class="status"><option value="ok">ok</option><option value="verificando">verificando</option></select><button type="button" class="btn-remove" onclick="removerItem(this)">Remover</button>';
    container.appendChild(div);
};

window.adicionarChave = function() {
    const container = document.getElementById("chavesContainer");
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = '<input type="text" placeholder="Nome do Morador" class="chave-morador"><input type="text" placeholder="Casa" class="chave-casa"><input type="text" placeholder="Local" class="chave-local"><input type="time" class="chave-hora"><button type="button" class="btn-remove" onclick="removerItem(this)">Remover</button>';
    container.appendChild(div);
};

window.adicionarMorador = function() {
    const container = document.getElementById("moradoresContainer");
    const moradorDiv = document.createElement("div");
    moradorDiv.className = "morador-section";
    moradorDiv.innerHTML = '<div class="morador-header"><input type="text" placeholder="Nome do Morador" class="morador-nome"><input type="text" placeholder="Número da Casa" class="morador-casa"><input type="text" placeholder="Local (por morador)" class="morador-local"><button type="button" class="btn-remove" onclick="removerMorador(this)">Remover Morador</button></div><div class="convidados-lista"></div><button type="button" class="btn" onclick="adicionarConvidado(this)">Adicionar Convidado</button>';
    container.appendChild(moradorDiv);
};

window.adicionarConvidado = function(botao) {
    const moradorDiv = botao.closest(".morador-section");
    const lista = moradorDiv.querySelector(".convidados-lista");
    const index = lista.children.length + 1;
    const div = document.createElement("div");
    div.className = "convidado-item";
    div.innerHTML = `<span style="width:30px">${index}.</span><input type="text" placeholder="Nome do Convidado" class="convidado-nome"><button type="button" class="btn-remove" onclick="removerConvidado(this)">Remover</button>`;
    lista.appendChild(div);
};

window.removerConvidado = function(botao) {
    const lista = botao.closest(".convidados-lista");
    const convidDiv = botao.parentElement;
    convidDiv.remove();
    const items = lista.children;
    for (let i = 0; i < items.length; i++) {
        const span = items[i].querySelector("span");
        if (span) span.textContent = (i + 1) + ".";
    }
};

window.removerMorador = function(botao) {
    const moradorDiv = botao.closest(".morador-section");
    moradorDiv.remove();
};

window.removerItem = function(botao) {
    botao.parentElement.remove();
};

document.getElementById("relatorioForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const payload = {};
    payload.data = document.querySelector('input[name="data"]').value || "";
    payload.sinais = Array.from(document.getElementById("sinaisContainer").children).map(d => d.dataset.hora || d.textContent);
    payload.encomenda_entrada = Array.from(document.getElementById("encomendaEntradaContainer").children).map(div => {
        return { casa: div.querySelector(".casa")?.value || "", morador: div.querySelector(".morador")?.value || "", hora: div.querySelector(".hora")?.value || "" };
    });
    payload.encomenda_portaria = Array.from(document.getElementById("encomendaPortariaContainer").children).map(div => {
        return { casa: div.querySelector(".casa")?.value || "", qtd: div.querySelector(".qtd")?.value || "", status: div.querySelector(".status")?.value || "" };
    });
    payload.encomenda_saida = Array.from(document.getElementById("encomendaSaidaContainer").children).map(div => {
        return { casa: div.querySelector(".casa")?.value || "", morador: div.querySelector(".morador")?.value || "", hora: div.querySelector(".hora")?.value || "" };
    });
    payload.chaves = Array.from(document.getElementById("chavesContainer").children).map(div => {
        return { morador: div.querySelector(".chave-morador")?.value || "", casa: div.querySelector(".chave-casa")?.value || "", local: div.querySelector(".chave-local")?.value || "", hora: div.querySelector(".chave-hora")?.value || "" };
    });
    payload.convidados_por_morador = Array.from(document.getElementById("moradoresContainer").children).map(moradorDiv => {
        const nome = moradorDiv.querySelector(".morador-nome")?.value || "";
        const casa = moradorDiv.querySelector(".morador-casa")?.value || "";
        const local = moradorDiv.querySelector(".morador-local")?.value || "";
        const convidados = Array.from(moradorDiv.querySelectorAll(".convidado-item .convidado-nome")).map(i => i.value).filter(v => v && v.trim() !== "");
        return { morador: nome, casa: casa, local: local, convidados: convidados };
    });
    payload.observacoes = document.querySelector('textarea[name="observacoes"]')?.value || "";
    payload.whatsapp = document.querySelector('textarea[name="whatsapp"]')?.value || "";
    try {
        fetch('/api/relatorio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }).then(resp => {
            if (resp.ok) {
                document.getElementById("mensagem").innerText = "Relatório salvo com sucesso!";
                document.getElementById("relatorioForm").reset();
                document.getElementById("sinaisContainer").innerHTML = "";
                document.getElementById("encomendaEntradaContainer").innerHTML = "";
                document.getElementById("encomendaPortariaContainer").innerHTML = "";
                document.getElementById("encomendaSaidaContainer").innerHTML = "";
                document.getElementById("chavesContainer").innerHTML = "";
                document.getElementById("moradoresContainer").innerHTML = "";
            } else {
                document.getElementById("mensagem").innerText = "Erro ao salvar (resposta do servidor).";
            }
        }).catch(() => {
            document.getElementById("mensagem").innerText = "Relatório preparado (backend indisponível).";
            console.log("Payload:", payload);
        });
    } catch (err) {
        document.getElementById("mensagem").innerText = "Erro inesperado.";
        console.error(err);
    }
});

}); 
