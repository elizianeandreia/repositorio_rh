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
