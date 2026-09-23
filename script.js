const eventGrid = document.getElementById("event-grid");
const brandName = document.getElementById("brand-name");
const brandTagline = document.getElementById("brand-tagline");
const companyLogo = document.getElementById("company-logo");
const featuredEventTitle = document.getElementById("featured-event-title");
const featuredEventMeta = document.getElementById("featured-event-meta");

const formatDate = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));

const formatTime = (value) =>
  new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(`2026-01-01T${value}:00`));

function applyBranding(branding) {
  document.title = branding.companyName || "Event Redirects";
  brandName.textContent = branding.companyName || "Event Redirects";
  brandTagline.textContent = branding.tagline || "Community & Innovation";
  companyLogo.src = branding.logo || "assets/logo.svg";
  companyLogo.alt = branding.logoAlt || `${branding.companyName} logo`;

  document.documentElement.style.setProperty("--primary", branding.primaryColor || "#0f172a");
  document.documentElement.style.setProperty("--primary-soft", branding.primarySoftColor || "#1d4ed8");
  document.documentElement.style.setProperty("--accent", branding.accentColor || "#22c55e");
  document.documentElement.style.setProperty("--bg", branding.backgroundColor || "#f4f7fb");
  document.documentElement.style.setProperty("--surface", branding.surfaceColor || "#ffffff");
  document.documentElement.style.setProperty("--heading-font", branding.headingFont || '"Poppins", "Segoe UI", sans-serif');
  document.documentElement.style.setProperty("--body-font", branding.bodyFont || '"Inter", "Segoe UI", sans-serif');
}

function getSortedEvents(events) {
  return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
}

function renderFeaturedEvent(event) {
  if (!event) return;

  featuredEventTitle.textContent = event.title;
  featuredEventMeta.innerHTML = `
    <li><strong>Datum:</strong> ${formatDate(event.date)} • ${formatTime(event.time)}</li>
    <li><strong>Locatie:</strong> ${event.location}</li>
    <li><strong>Informatie:</strong> ${event.website.replace(/^https?:\/\//, "")}</li>
  `;
}

function renderEvents(events) {
  eventGrid.innerHTML = events
    .map(
      (event) => `
        <article class="event-card">
          <img class="event-banner" src="${event.image}" alt="${event.title} banner" />
          <div class="event-content">
            <span class="event-tag">${event.category}</span>
            <h3>${event.title}</h3>
            <ul class="meta-list">
              <li class="meta-item"><strong>Datum:</strong> ${formatDate(event.date)} • ${formatTime(event.time)}</li>
              <li class="meta-item"><strong>Locatie:</strong> ${event.location}</li>
            </ul>
            <div class="event-actions">
              <a class="secondary-button" href="${event.website}" target="_blank" rel="noreferrer">Informatie</a>
            </div>
          </div>
        </article>
      `
    )
    .join("");
}

async function loadSiteData() {
  try {
    const [brandingResponse, eventsResponse] = await Promise.all([
      fetch("data/branding.json"),
      fetch("data/events.json")
    ]);

    if (!brandingResponse.ok || !eventsResponse.ok) {
      throw new Error("Failed to load site data");
    }

    const branding = await brandingResponse.json();
    const { events } = await eventsResponse.json();
    const sortedEvents = getSortedEvents(events);

    applyBranding(branding);
    renderEvents(sortedEvents);

    if (sortedEvents.length > 0) {
      renderFeaturedEvent(sortedEvents[0]);
    }
  } catch (error) {
    console.error("Could not load JSON data:", error);
    eventGrid.innerHTML = `
      <div class="event-card">
        <div class="event-content">
          <h3>Content unavailable</h3>
          <p>Please check the JSON files and try again.</p>
        </div>
      </div>
    `;
  }
}

loadSiteData();
