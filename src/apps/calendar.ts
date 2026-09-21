import type { GameState } from "../game/gameState";

export type CalendarEvent = {
  id: number;
  day: number;
  date: string;
  time: string;
  title: string;
  location: string;
  description: string[];
};

export const calendarEvents: CalendarEvent[] = [
  {
    id: 1,
    day: 12,
    date: "October 12, 2026",
    time: "20:14",
    title: "Sort photos",
    location: "Home",
    description: ["Clean up the gallery.", "Keep the originals."],
  },
  {
    id: 2,
    day: 13,
    date: "October 13, 2026",
    time: "07:14",
    title: "Leave early",
    location: "Home",
    description: ["Don't forget the notebook."],
  },
  {
    id: 3,
    day: 13,
    date: "October 13, 2026",
    time: "18:30",
    title: "Call Daniel",
    location: "Home",
    description: ["Ask if he still has the old number."],
  },
  {
    id: 4,
    day: 14,
    date: "October 14, 2026",
    time: "17:30",
    title: "Walk",
    location: "Willow Street",
    description: ["Leave ten minutes early."],
  },
  {
    id: 5,
    day: 14,
    date: "October 14, 2026",
    time: "17:55",
    title: "Meeting",
    location: "Northbridge Café",
    description: ["Same place.", "Don't bring anyone."],
  },
  {
    id: 6,
    day: 14,
    date: "October 14, 2026",
    time: "18:20",
    title: "Leave",
    location: "Northbridge Café",
    description: ["If everything goes normally, leave through the back."],
  },
  {
    id: 7,
    day: 14,
    date: "October 14, 2026",
    time: "18:45",
    title: "Delete",
    location: "Home",
    description: ["Remove anything that connects the meeting to me."],
  },
  {
    id: 8,
    day: 15,
    date: "October 15, 2026",
    time: "09:10",
    title: "Check backup",
    location: "Home",
    description: ["Make sure the old file is gone."],
  },
];

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const fullWeekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function renderCalendarScreen(state: GameState, notice: string): string {
  if (state.calendarView === "success") return renderCalendarSuccess();
  if (state.calendarView === "event" && state.currentCalendarEvent)
    return renderEventDetail(state.currentCalendarEvent);
  if (state.calendarView === "day" && state.currentCalendarDay)
    return renderDayView(state.currentCalendarDay);
  return renderMonthView(state, notice);
}

function renderMonthView(state: GameState, notice: string): string {
  const resolved = state.completedApps.includes(8);
  return `<section class="calendar-app" data-calendar-view="month">
    <header class="calendar-toolbar"><button class="calendar-nav" data-action="home" aria-label="Back to home">‹</button><div><p class="eyebrow">Offline calendar</p><h1>Calendar</h1></div>${resolved ? '<span class="calendar-resolved">Resolved</span>' : '<span class="calendar-signal">●</span>'}</header>
    <div class="month-heading"><button class="month-arrow" aria-label="Previous month" disabled>‹</button><h2>October 2026</h2><button class="month-arrow" aria-label="Next month" disabled>›</button></div>
    <div class="weekday-row">${weekdays.map((weekday) => `<span>${weekday}</span>`).join("")}</div>
    <div class="month-grid">${renderCalendarDays(state.currentCalendarDay)}</div>
    <div class="calendar-legend"><span class="legend-dot"></span><span>Events on this device</span></div>
    <div class="calendar-puzzle-panel"><p class="calendar-prompt">What happened immediately after the meeting?</p><p class="calendar-instruction">Use the event times, not the order they appear on screen.</p><form data-action="solve-calendar" class="calendar-answer-form"><label for="calendar-answer">Event title</label><div class="answer-row"><input id="calendar-answer" name="answer" type="text" autocomplete="off" placeholder="Event title" aria-label="What happened immediately after the meeting" /><button class="submit-button" type="submit">Submit</button></div>${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}</form><button class="hint-button" data-action="calendar-hint">${state.calendarHintLevel > 0 ? "Hint shown" : "Show hint"}</button>${state.calendarHintLevel > 0 ? `<p class="calendar-hint">${state.calendarHintLevel > 1 ? "What is the first event after that time?" : "Start with the event you already know about."}</p>` : ""}</div>
  </section>`;
}

function renderCalendarDays(selectedDay: number | null): string {
  const days = [
    "",
    "",
    "",
    "",
    "1",
    "2",
    "3",
    ...Array.from({ length: 28 }, (_, index) => String(index + 4)),
  ];
  return days
    .map((day) => {
      if (!day) return '<span class="calendar-day empty"></span>';
      const dayNumber = Number(day);
      const eventCount = calendarEvents.filter(
        (event) => event.day === dayNumber,
      ).length;
      const important = dayNumber === 14;
      return `<button class="calendar-day ${eventCount ? "has-events" : ""} ${important ? "key-day" : ""} ${selectedDay === dayNumber ? "is-selected" : ""}" data-calendar-day="${dayNumber}"><span>${day}</span>${eventCount ? `<i>${eventCount}</i>` : ""}</button>`;
    })
    .join("");
}

function renderDayView(day: number): string {
  const events = calendarEvents.filter((event) => event.day === day);
  const weekday = fullWeekdays[new Date(2026, 9, day).getDay()];
  return `<section class="calendar-app day-view" data-calendar-view="day"><header class="calendar-sub-toolbar"><button class="calendar-nav" data-action="calendar-month" aria-label="Back to month">‹</button><div><p class="eyebrow">October 2026</p><h1>${weekday} ${day}</h1></div><span class="day-count">${events.length.toString().padStart(2, "0")}</span></header><div class="day-events"><p class="day-label">${events[0]?.date ?? `October ${day}, 2026`}</p>${events.length ? events.map(renderEventRow).join("") : '<p class="empty-day">No events recorded.</p>'}</div></section>`;
}

function renderEventRow(event: CalendarEvent): string {
  return `<button class="calendar-event-row" data-calendar-event="${event.id}"><span class="event-time">${event.time}</span><span class="event-line"></span><span class="event-copy"><strong>${event.title}</strong><small>${event.location}</small></span><span class="event-arrow">›</span></button>`;
}

function renderEventDetail(eventId: number): string {
  const event = calendarEvents.find((item) => item.id === eventId)!;
  return `<section class="calendar-app event-detail" data-calendar-view="event"><header class="calendar-sub-toolbar"><button class="calendar-nav" data-action="calendar-day" aria-label="Back to day">‹</button><span>Event details</span><span class="event-detail-time">${event.time}</span></header><article class="event-card"><span class="event-card-mark">●</span><p class="event-card-date">${event.date}</p><h1>${event.title}</h1><div class="event-fact"><small>Time</small><strong>${event.time}</strong></div><div class="event-fact"><small>Location</small><strong>${event.location}</strong></div><div class="event-description">${event.description.map((line) => `<p>${line}</p>`).join("")}</div></article></section>`;
}

function renderCalendarSuccess(): string {
  return `<section class="calendar-app calendar-success" data-calendar-view="success"><span class="success-mark">✓</span><p class="eyebrow">Calendar · recovered</p><h1>TIMELINE RECOVERED</h1><strong class="timeline-time">18:20</strong><div class="timeline-reveal"><p>The meeting ended at 18:20.<br />Whatever happened afterward was planned.</p><small>— A</small></div><div class="new-clue"><span>New clue</span><strong>18:20</strong></div><p class="next-event-note">The next event was not an accident.</p><button class="primary-button success-button" data-action="dismiss-calendar-success">Return to home</button></section>`;
}
