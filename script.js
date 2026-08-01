let allRepos = [];

async function loadRepositories() {
  const tableBody = document.getElementById("reposTableBody");
  const searchInput = document.getElementById("searchInput");

  try {
    const response = await fetch("repos.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    allRepos = await response.json();
    renderTable(allRepos);

    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
          renderTable(allRepos);
          return;
        }

        const filtered = allRepos.filter((repo) => {
          if (repo.id && repo.id.toLowerCase().includes(query)) return true;
          if (repo.name && repo.name.toLowerCase().includes(query)) return true;
          if (repo.url && repo.url.toLowerCase().includes(query)) return true;
          if (repo.packages && typeof repo.packages === "object") {
            for (const pkg of Object.values(repo.packages)) {
              if (pkg.name && pkg.name.toLowerCase().includes(query)) return true;
              if (pkg.displayName && pkg.displayName.toLowerCase().includes(query)) return true;
            }
          }
          return false;
        });

        renderTable(filtered);
      });
    }
  } catch (error) {
    console.error("Error loading repositories:", error);
    tableBody.innerHTML = "";
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "error";
    cell.textContent = `Error loading repositories: ${error.message}`;
    row.appendChild(cell);
    tableBody.appendChild(row);
  }
}

function renderTable(repos) {
  const tableBody = document.getElementById("reposTableBody");
  tableBody.innerHTML = "";

  if (!repos || repos.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "loading";
    cell.textContent = "No repositories found.";
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }

  repos.forEach((repo) => {
    const row = document.createElement("tr");

    // Id column
    const idCell = document.createElement("td");
    idCell.textContent = repo.id || "-";
    row.appendChild(idCell);

    // Name column
    const nameCell = document.createElement("td");
    nameCell.innerHTML = `${repo.name || "-"}${
      repo.nsfw ? ' <span class="nsfw-badge">NSFW</span>' : ""
    }`;
    row.appendChild(nameCell);

    // Packages column
    const packagesCell = document.createElement("td");
    if (repo.packages && typeof repo.packages === "object") {
      const pkgs = Object.values(repo.packages);
      if (pkgs.length > 0) {
        packagesCell.innerHTML = pkgs
          .slice(0, 5)
          .map(
            (p) => `<span class="pkg-pill">${p.displayName || p.name}</span>`
          )
          .join(" ") + (pkgs.length > 5 ? ` <small>(+${pkgs.length - 5} more)</small>` : "");
      } else {
        packagesCell.textContent = "-";
      }
    } else {
      packagesCell.textContent = "-";
    }
    row.appendChild(packagesCell);

    // Install column
    const installCell = document.createElement("td");
    const installLink = document.createElement("a");
    installLink.href = `vcc://vpm/addRepo?url=${encodeURIComponent(repo.url)}`;
    installLink.className = "install-link";
    installLink.textContent = "Install";
    installCell.appendChild(installLink);
    row.appendChild(installCell);

    // Url column
    const urlCell = document.createElement("td");
    const urlLink = document.createElement("a");
    urlLink.href = repo.url;
    urlLink.className = "url-link";
    urlLink.textContent = repo.url;
    urlLink.target = "_blank";
    urlLink.rel = "noopener noreferrer";
    urlCell.appendChild(urlLink);
    row.appendChild(urlCell);

    tableBody.appendChild(row);
  });
}

document.addEventListener("DOMContentLoaded", loadRepositories);
