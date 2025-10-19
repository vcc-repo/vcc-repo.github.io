// Fetch and display repositories
async function loadRepositories() {
  const tableBody = document.getElementById("reposTableBody");

  try {
    const response = await fetch("repos.json");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const repos = await response.json();

    // Clear loading message
    tableBody.innerHTML = "";

    // Check if repos array is empty
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

    // Create table rows for each repository
    repos.forEach((repo) => {
      const row = document.createElement("tr");

      // Id column
      const idCell = document.createElement("td");
      idCell.textContent = repo.id || "-";
      row.appendChild(idCell);

      // Name column
      const nameCell = document.createElement("td");
      nameCell.textContent = repo.name || "-";
      row.appendChild(nameCell);

      // Packages column (empty for now)
      const packagesCell = document.createElement("td");
      packagesCell.textContent = "";
      row.appendChild(packagesCell);

      // Install column
      const installCell = document.createElement("td");
      const installLink = document.createElement("a");
      installLink.href = `vcc://vpm/addRepo?url=${encodeURIComponent(
        repo.url
      )}`;
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

// Load repositories when the page loads
document.addEventListener("DOMContentLoaded", loadRepositories);
