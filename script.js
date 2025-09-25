function activateTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => tab.classList.remove("active"));
  document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
  document.getElementById("tab-" + tabId).classList.add("active");
  document.getElementById("content-" + tabId).classList.add("active");
}

function closeTab(tabId) {
  document.getElementById("tab-" + tabId).remove();
  document.getElementById("content-" + tabId).remove();
  const remainingTabs = document.querySelectorAll(".tab");
  if (remainingTabs.length > 0) {
    const firstTabId = remainingTabs[0].id.replace("tab-", "");
    activateTab(firstTabId);
  }
}

async function loadPolicy(file, title) {
  const tabId = file.replace(/[^a-z0-9]/gi, "_");
  if (document.getElementById("tab-" + tabId)) {
    activateTab(tabId);
    return;
  }
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("Arquivo não encontrado");
    const text = await response.text();
    const tab = document.createElement("div");
    tab.className = "tab";
    tab.id = "tab-" + tabId;
    tab.innerHTML = title + '<span class="close-btn" onclick="event.stopPropagation(); closeTab(\'' + tabId + '\')">×</span>';
    tab.onclick = () => activateTab(tabId);
    document.getElementById("tabs").appendChild(tab);
    const content = document.createElement("div");
    content.className = "tab-content";
    content.id = "content-" + tabId;
    content.innerHTML = marked.parse(text);
    document.getElementById("tab-contents").appendChild(content);
    activateTab(tabId);
  } catch (error) {
    alert("Erro ao carregar: " + error.message);
  }
}

async function loadPolicy(file) {
  const markdownViewer = document.getElementById('markdown-viewer');
  const checklistViewer = document.getElementById('checklist-viewer');

  checklistViewer.style.display = "none";
  markdownViewer.style.display = "block";

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error('Arquivo não encontrado');
    const text = await response.text();

  
    if (file.includes("checklist-onboarding.md")) {
      markdownViewer.style.display = "none";
      checklistViewer.style.display = "block";
      checklistViewer.innerHTML = `
        <h3>Checklist de Integração</h3>
        <ul class="checklist">
          <li><input type="checkbox"> Assinatura do contrato / entrega de documentos</li>
          <li><input type="checkbox"> Criação de e-mail corporativo</li>
          <li><input type="checkbox"> Acesso aos sistemas internos</li>
          <li><input type="checkbox"> Entrega de equipamentos</li>
          <li><input type="checkbox"> Apresentação da empresa e da equipe</li>
          <li><input type="checkbox"> Treinamento inicial</li>
          <li><input type="checkbox"> Definição de metas dos primeiros 30 dias</li>
        </ul>
      `;
    } else {
      markdownViewer.innerHTML = marked.parse(text);
    }
  } catch (error) {
    markdownViewer.innerHTML = `<p style="color:red;">Erro ao carregar o arquivo: ${error.message}</p>`;
  }
}
