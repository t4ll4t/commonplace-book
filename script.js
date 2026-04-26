const fragments = [
  {
    theme: "Markets",
    title: "Margin",
    text: "The point of a margin of safety is not to make boldness feel mathematical. It is to leave room for the part of the world that refuses your spreadsheet.",
    source: "after Buffett, Munger, and bad assumptions"
  },
  {
    theme: "Markets",
    title: "Precious Metal",
    text: "Gold does not generate cash flow, which is precisely why it tells a different truth: confidence, currency discipline, and fear all leave fingerprints on it.",
    source: "Dubai desk note"
  },
  {
    theme: "Markets",
    title: "Cycles",
    text: "Howard Marks is most useful when the room is either euphoric or offended. The question is rarely what happens next; it is what has already been priced as inevitable.",
    source: "cycle journal"
  },
  {
    theme: "Markets",
    title: "Geography",
    text: "Geopolitics is supply chain psychology under pressure. Maps matter because ships, pipelines, chokepoints, and incentives do not care about slogans.",
    source: "Zeihan, Pozsar, Allison notes"
  },
  {
    theme: "Books",
    title: "After Dazai",
    text: "No Longer Human feels less like a confession than a room where every social mask has been removed and the air has not improved.",
    source: "finished recently"
  },
  {
    theme: "Books",
    title: "Meursault",
    text: "The Stranger is terrifying because the surface is so calm. Indifference becomes more scandalous than cruelty when society needs a rehearsed emotion.",
    source: "Camus margin"
  },
  {
    theme: "Books",
    title: "Dorian",
    text: "Dorian Gray is not a warning against beauty. It is a warning against outsourcing conscience to an object and calling the result taste.",
    source: "Wilde margin"
  },
  {
    theme: "Books",
    title: "Next Shelf",
    text: "The queue has a useful severity: The Secret History for cultivated rot, Crime and Punishment for moral fever, Siddhartha for the cost of borrowed wisdom.",
    source: "reading list"
  },
  {
    theme: "Spirit",
    title: "Practice",
    text: "Pre-initiation is not a waiting room. It is where the appetite for certainty is watched, disciplined, and gradually made less theatrical.",
    source: "Sant Mat notebook"
  },
  {
    theme: "Spirit",
    title: "Attention",
    text: "Krishnamurti is difficult because he leaves no decorative shelter. The observer is not granted a throne outside the observed.",
    source: "morning reading"
  },
  {
    theme: "Spirit",
    title: "Stoic Use",
    text: "The Stoics are not there to make ambition colder. They are there to separate effort from possession, action from applause, and loss from panic.",
    source: "Epictetus shelf"
  },
  {
    theme: "Spirit",
    title: "Sufi Weather",
    text: "A good Sufi line does not explain longing. It places longing in the hand like a coal and asks whether you still want to speak.",
    source: "poetry note"
  },
  {
    theme: "Scent",
    title: "Resin",
    text: "The best heavy fragrance should not shout wealth. It should feel like polished wood, old prayer beads, ambered air, and a door closing softly.",
    source: "Jubilation XXV / Halfeti Cedar"
  },
  {
    theme: "Scent",
    title: "Oud",
    text: "Oud works when it carries shadow and discipline together. Too clean and it becomes furniture polish; too loud and it loses the room.",
    source: "fragrance cabinet"
  },
  {
    theme: "Machines",
    title: "GT3 Touring",
    text: "The appeal is not speed alone. It is the moral clarity of a naturally aspirated engine, a manual rhythm, and a body that avoids costume.",
    source: "Porsche note"
  },
  {
    theme: "Machines",
    title: "Warm Hardware",
    text: "Chrome announces itself. Brass earns its presence slowly. The same rule applies to eyewear, watches, door handles, and most opinions.",
    source: "aesthetic rule"
  }
];

const grid = document.querySelector("#fragmentGrid");
const chips = document.querySelectorAll(".filter-chip");
const search = document.querySelector("#fragmentSearch");
const emptyState = document.querySelector("#emptyState");
const randomButton = document.querySelector("#randomButton");
const randomPanel = document.querySelector("#randomPanel");
const randomText = document.querySelector("#randomText");
const randomMeta = document.querySelector("#randomMeta");
const themeToggle = document.querySelector(".theme-toggle");

let activeFilter = "all";

function matchesFragment(fragment, query) {
  const haystack = `${fragment.theme} ${fragment.title} ${fragment.text} ${fragment.source}`.toLowerCase();
  return haystack.includes(query.trim().toLowerCase());
}

function renderFragments() {
  const query = search.value;
  const visible = fragments.filter((fragment) => {
    const passesTheme = activeFilter === "all" || fragment.theme === activeFilter;
    return passesTheme && matchesFragment(fragment, query);
  });

  grid.innerHTML = visible.map((fragment, index) => `
    <article class="fragment-card" style="animation-delay: ${Math.min(index * 35, 280)}ms">
      <p class="fragment-theme">${fragment.theme}</p>
      <h3>${fragment.title}</h3>
      <p>${fragment.text}</p>
      <span class="fragment-source">${fragment.source}</span>
    </article>
  `).join("");

  emptyState.hidden = visible.length > 0;
}

chips.forEach((chip) => {
  chip.addEventListener("click", () => {
    chips.forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    renderFragments();
  });
});

search.addEventListener("input", renderFragments);

randomButton.addEventListener("click", () => {
  const pool = fragments.filter((fragment) => activeFilter === "all" || fragment.theme === activeFilter);
  const fragment = pool[Math.floor(Math.random() * pool.length)];
  randomText.textContent = fragment.text;
  randomMeta.textContent = `${fragment.theme} / ${fragment.title} / ${fragment.source}`;
  randomPanel.hidden = false;
});

themeToggle.addEventListener("click", () => {
  const isDark = document.body.classList.toggle("dark");
  themeToggle.setAttribute("aria-pressed", String(isDark));
  localStorage.setItem("commonplace-theme", isDark ? "dark" : "light");
});

if (localStorage.getItem("commonplace-theme") === "dark") {
  document.body.classList.add("dark");
  themeToggle.setAttribute("aria-pressed", "true");
}

renderFragments();
