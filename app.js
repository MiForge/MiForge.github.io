(function () {
  const ORG = window.location.hostname.split(".")[0];
  const list = document.getElementById("projects");

  document.getElementById("discussions-link").href = `https://github.com/orgs/${ORG}/discussions`;

  function render(repos) {
    list.innerHTML = "";
    repos.forEach((r) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener";

      const top = document.createElement("div");
      top.className = "repo-top";

      const name = document.createElement("span");
      name.className = "repo-name";
      name.textContent = r.name;

      const stars = document.createElement("span");
      stars.className = "repo-stars";
      stars.textContent = r.stars;

      top.append(name, stars);
      a.append(top);

      if (r.description) {
        const desc = document.createElement("div");
        desc.className = "repo-desc";
        desc.textContent = r.description;
        a.append(desc);
      }

      li.append(a);
      list.append(li);
    });
  }

  function renderError() {
    list.innerHTML = "";
    const li = document.createElement("li");
    li.className = "loading";
    li.textContent = "couldn't load projects — try again later";
    list.append(li);
  }

  fetch(`https://api.github.com/orgs/${ORG}/repos?per_page=100`)
    .then((res) => {
      if (!res.ok) throw new Error("api error");
      return res.json();
    })
    .then((data) => {
      const repos = data
        .filter((r) => r.description && r.description.trim() !== "" && r.name.toLowerCase() !== window.location.hostname.toLowerCase())
        .map((r) => ({
          name: r.name,
          stars: r.stargazers_count,
          url: r.html_url,
          description: r.description
        }))
        .sort((a, b) => b.stars - a.stars);

      render(repos);
    })
    .catch(renderError);
})();
