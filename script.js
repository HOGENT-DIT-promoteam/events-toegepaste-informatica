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

function getEventEndDate(event) {
  return event.endDate || event.date;
}

function formatEventDate(event) {
  const start = new Date(`${event.date}T00:00:00`);
  const end = event.endDate ? new Date(`${event.endDate}T00:00:00`) : null;

  if (!end || start.getTime() === end.getTime()) {
    return `${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short"
    }).format(start)} • ${formatTime(event.time)}`;
  }

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${new Intl.DateTimeFormat("en-GB", {
      day: "numeric"
    }).format(start)}–${new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short"
    }).format(end)} • ${formatTime(event.time)}`;
  }

  return `${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short"
  }).format(start)}–${new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(end)} • ${formatTime(event.time)}`;
}

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

function isPastEvent(event) {
  const eventDate = new Date(`${getEventEndDate(event)}T23:59:59`);
  const today = new Date();
  return eventDate < today;
}

function getNextUpcomingEvent(events) {
  return events.find((event) => !isPastEvent(event)) || events[events.length - 1];
}

function renderFeaturedEvent(event) {
  if (!event) return;

  featuredEventTitle.textContent = event.title;
  featuredEventMeta.innerHTML = `
    <li><strong>Datum:</strong> ${formatEventDate(event)}</li>
    <li><strong>Locatie:</strong> ${event.location}</li>
  `;
}

function renderEvents(events) {
  eventGrid.innerHTML = events
    .map((event) => {
      const isPast = isPastEvent(event);
      const hasWebsite = Boolean(event.website && event.website.trim());
      const actionButton = hasWebsite
        ? `<a class="secondary-button" href="${event.website}" target="_blank" rel="noreferrer">Informatie</a>`
        : '<span class="secondary-button muted-button">Meer info volgt</span>';

      return `
        <article class="event-card ${isPast ? "past" : ""}">
          <img class="event-banner" src="${event.image}" alt="${event.title} banner" />
          <div class="event-content">
            <div class="event-meta-row">
              <span class="event-tag">${event.category}</span>
              ${isPast ? '<span class="event-status">Afgelopen</span>' : ""}
            </div>
            <h3>${event.title}</h3>
            <ul class="meta-list">
              <li class="meta-item"><strong>Datum:</strong> ${formatEventDate(event)}</li>
              <li class="meta-item"><strong>Locatie:</strong> ${event.location}</li>
            </ul>
            <div class="event-actions">
              ${actionButton}
            </div>
          </div>
        </article>
      `;
    })
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
    const nextUpcomingEvent = getNextUpcomingEvent(sortedEvents);

    applyBranding(branding);
    renderEvents(sortedEvents);

    if (nextUpcomingEvent) {
      renderFeaturedEvent(nextUpcomingEvent);
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
