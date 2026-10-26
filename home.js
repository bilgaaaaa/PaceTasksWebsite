// The landing page's moving parts: the live demo in the hero phone, the tilting
// phone fan, the pinned phone that follows the features, Brain Dump typing itself,
// a working "Fit my time" and the Pace heatmap. All of it rests when motion is reduced.
(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wideScreen = window.matchMedia("(min-width: 900px)");
  const finePointer = window.matchMedia("(pointer: fine)");

  // Runs `start` once, the first time `element` comes into view.
  function whenVisible(element, start, threshold = 0.35) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        start();
      },
      { threshold }
    );
    observer.observe(element);
  }

  // Wide screens run the demo inside the hero phone; phones open it full screen instead.
  function setupDemoLaunch() {
    const launch = document.querySelector("[data-demo-launch]");
    const phone = document.querySelector("[data-demo-phone]");
    if (!launch || !phone) return;

    launch.addEventListener("click", (event) => {
      if (!wideScreen.matches || phone.dataset.live) return;
      event.preventDefault();

      const frame = document.createElement("iframe");
      frame.src = launch.getAttribute("href");
      frame.title = "PaceTasks demo";
      phone.querySelector(".phone-screen").replaceChildren(frame);
      phone.dataset.live = "true";
      document.querySelector("[data-tilt]")?.classList.add("is-live");

      // Once the demo runs here, the same button opens it full screen.
      launch.textContent = "Open the demo full screen";
      frame.focus();
      console.info("[home] demo started in the hero phone");
    });
  }

  // The phone fan leans gently toward the pointer, and stands still while the demo runs.
  function setupHeroTilt() {
    const card = document.querySelector(".hero-card");
    const fan = document.querySelector("[data-tilt]");
    if (!card || !fan || reduceMotion.matches || !finePointer.matches) return;
    let frameRequested = false;
    let pointer = { x: 0, y: 0 };

    const apply = () => {
      frameRequested = false;
      if (fan.classList.contains("is-live")) return;
      fan.style.setProperty("--tilt-x", `${(pointer.x * 7).toFixed(2)}deg`);
      fan.style.setProperty("--tilt-y", `${(pointer.y * -5).toFixed(2)}deg`);
    };

    card.addEventListener("pointermove", (event) => {
      const box = card.getBoundingClientRect();
      pointer = { x: (event.clientX - box.left) / box.width - 0.5, y: (event.clientY - box.top) / box.height - 0.5 };
      if (frameRequested) return;
      frameRequested = true;
      window.requestAnimationFrame(apply);
    });
    card.addEventListener("pointerleave", () => {
      pointer = { x: 0, y: 0 };
      window.requestAnimationFrame(apply);
    });
  }

  // On wide screens one phone stays pinned and shows the screen of the feature being read.
  function setupStory() {
    const steps = [...document.querySelectorAll("[data-step]")];
    const stage = document.querySelector("[data-story-stage]");
    if (!steps.length || !stage) return;
    const screens = [...stage.querySelectorAll("[data-screen]")];
    const dots = [...stage.querySelectorAll("[data-dot]")];

    const show = (key) => {
      screens.forEach((screen) => screen.classList.toggle("is-active", screen.dataset.screen === key));
      dots.forEach((dot) => dot.classList.toggle("is-active", dot.dataset.dot === key));
    };

    const observer = new IntersectionObserver(
      (entries) => entries.filter((entry) => entry.isIntersecting).forEach((entry) => show(entry.target.dataset.step)),
      { rootMargin: "-45% 0px -45% 0px" }
    );
    steps.forEach((step) => observer.observe(step));
    show(steps[0].dataset.step);
  }

  // Brain Dump types the three-language sentence, presses "Sort it out" and deals out the tasks.
  function setupBrainDump() {
    const dump = document.querySelector("[data-dump]");
    if (!dump || reduceMotion.matches) return;
    const text = dump.querySelector("[data-dump-text]");
    const sentence = text.textContent.trim();
    text.textContent = "";
    dump.classList.add("is-waiting");

    whenVisible(dump, () => {
      text.classList.add("is-typing");
      let typed = 0;
      const typeNext = () => {
        typed += 1;
        text.textContent = sentence.slice(0, typed);
        if (typed < sentence.length) {
          window.setTimeout(typeNext, sentence[typed - 1] === "," ? 220 : 38);
          return;
        }
        text.classList.remove("is-typing");
        dump.classList.add("is-pressed");
        window.setTimeout(() => dump.classList.remove("is-pressed", "is-waiting"), 450);
      };
      typeNext();
    });
  }

  // A small copy of the app's "Fit my time": tasks that suit your energy, most important
  // first, filling the minutes back to back (the app's rule lives in @domain/doNow).
  const SAMPLE_TASKS = [
    { title: "Send the tax documents", minutes: 20, energy: "medium", priority: "high", overdue: true },
    { title: "Pay the phone bill", minutes: 3, energy: "low", priority: "high" },
    { title: "Call the dentist", minutes: 5, energy: "low", priority: "medium" },
    { title: "Reply to Marco", minutes: 10, energy: "low", priority: "medium" },
    { title: "Go for a run", minutes: 30, energy: "high", priority: "medium" },
    { title: "Clean the bathroom", minutes: 45, energy: "high", priority: "medium" },
    { title: "Plan the weekend trip", minutes: 30, energy: "medium", priority: "low", flexible: true },
    { title: "Water the plants", minutes: 5, energy: "low", priority: "low" },
  ];
  const ENERGY_LEVELS = ["low", "medium", "high"];
  const PRIORITY_ORDER = ["high", "medium", "low"];
  const QUICK_WIN_MINUTES = 5;

  function planFor(availableMinutes, energy) {
    const energyRank = (level) => ENERGY_LEVELS.indexOf(level);
    const sortKeys = (task) => [
      task.overdue ? 0 : 1,
      PRIORITY_ORDER.indexOf(task.priority),
      task.flexible ? 1 : 0,
      Math.abs(energyRank(energy) - energyRank(task.energy)),
      -task.minutes,
    ];
    const ranked = SAMPLE_TASKS.filter(
      (task) => task.minutes <= availableMinutes && energyRank(task.energy) <= energyRank(energy)
    ).sort((a, b) => {
      const [keysA, keysB] = [sortKeys(a), sortKeys(b)];
      const index = keysA.findIndex((key, i) => key !== keysB[i]);
      return index === -1 ? 0 : keysA[index] - keysB[index];
    });

    const plan = [];
    let used = 0;
    ranked.forEach((task) => {
      if (used + task.minutes > availableMinutes) return;
      plan.push(task);
      used += task.minutes;
    });
    return { plan, used };
  }

  function minutesLabel(minutes) {
    return minutes === 60 ? "1 hour" : `${minutes} min`;
  }

  function setupFitMyTime() {
    const fit = document.querySelector("[data-fit]");
    if (!fit) return;
    const slider = fit.querySelector("#fitMinutes");
    const output = fit.querySelector("[data-fit-output]");
    const energyButtons = [...fit.querySelectorAll("[data-energy]")];
    const list = fit.querySelector("[data-fit-plan]");
    const total = fit.querySelector("[data-fit-total]");
    let energy = "medium";

    const render = () => {
      const minutes = Number(slider.value);
      const { plan, used } = planFor(minutes, energy);
      output.textContent = minutesLabel(minutes);
      energyButtons.forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.energy === energy)));

      list.replaceChildren(
        ...plan.map((task, index) => {
          const item = document.createElement("li");
          item.style.setProperty("--i", index);
          const title = document.createElement("span");
          title.textContent = task.title;
          const pill = document.createElement("span");
          pill.className = task.minutes <= QUICK_WIN_MINUTES ? "pill pill-quick" : "pill";
          pill.textContent = `${task.minutes} min`;
          item.append(title, pill);
          return item;
        })
      );
      total.textContent = plan.length
        ? `${plan.length} ${plan.length === 1 ? "task" : "tasks"}, ${used} of ${minutes} minutes`
        : `Nothing fits in ${minutesLabel(minutes)} at this energy. Try a little more time.`;
    };

    slider.addEventListener("input", render);
    energyButtons.forEach((button) =>
      button.addEventListener("click", () => {
        energy = button.dataset.energy;
        render();
      })
    );
    render();
  }

  // Pace: thirteen weeks of finished tasks fill in day by day, and the numbers count up.
  function setupPace() {
    const heatmap = document.querySelector("[data-heatmap]");
    if (!heatmap) return;
    const weeks = 13;
    let seed = 7;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };

    // A believable history: quiet at first, then most days count.
    const cells = [];
    for (let week = 0; week < weeks; week += 1) {
      for (let day = 0; day < 7; day += 1) {
        const busy = random() < 0.25 + week * 0.05;
        const level = busy ? 1 + Math.floor(random() * 4) : 0;
        const cell = document.createElement("span");
        cell.className = `heat heat-${level}`;
        cell.style.setProperty("--i", week * 7 + day);
        cells.push(cell);
      }
    }
    heatmap.replaceChildren(...cells);

    // The page holds the final numbers for readers without scripts; animated ones start from zero.
    const counters = [...document.querySelectorAll("[data-count-to]")];
    if (!reduceMotion.matches) counters.forEach((counter) => (counter.textContent = "0"));
    const finish = () => {
      heatmap.classList.add("is-filled");
      counters.forEach((counter) => {
        const target = Number(counter.dataset.countTo);
        if (reduceMotion.matches) {
          counter.textContent = String(target);
          return;
        }
        const startedAt = performance.now();
        const tick = (now) => {
          const progress = Math.min(1, (now - startedAt) / 1200);
          counter.textContent = String(Math.round(target * (1 - (1 - progress) ** 3)));
          if (progress < 1) window.requestAnimationFrame(tick);
        };
        window.requestAnimationFrame(tick);
      });
    };

    if (reduceMotion.matches) finish();
    else whenVisible(heatmap, finish);
  }

  setupDemoLaunch();
  setupHeroTilt();
  setupStory();
  setupBrainDump();
  setupFitMyTime();
  setupPace();
})();
