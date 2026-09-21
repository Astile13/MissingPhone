import type { GameState } from "../game/gameState";

export type Conversation = {
  id: number;
  contact: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  messages: { sender: string; text: string; time: string; sent: boolean }[];
};

export const conversations: Conversation[] = [
  {
    id: 1,
    contact: "Maya",
    preview: "You remember 17, right?",
    timestamp: "Today",
    unread: true,
    messages: [
      {
        sender: "MAYA",
        text: "Are you still coming?",
        time: "10:08 AM",
        sent: false,
      },
      { sender: "A", text: "Not tonight.", time: "10:12 AM", sent: true },
      {
        sender: "MAYA",
        text: "You said that yesterday.",
        time: "10:13 AM",
        sent: false,
      },
      { sender: "A", text: "Things changed.", time: "10:16 AM", sent: true },
      {
        sender: "MAYA",
        text: "What time was it supposed to be?",
        time: "10:18 AM",
        sent: false,
      },
      { sender: "A", text: "17.", time: "10:19 AM", sent: true },
      {
        sender: "MAYA",
        text: "Just remember it.",
        time: "10:20 AM",
        sent: false,
      },
    ],
  },
  {
    id: 2,
    contact: "Daniel",
    preview: "Are you still using the old number?",
    timestamp: "Yesterday",
    unread: false,
    messages: [
      {
        sender: "DANIEL",
        text: "Are you still using the old number?",
        time: "Yesterday, 8:41 PM",
        sent: false,
      },
      { sender: "A", text: "No.", time: "8:44 PM", sent: true },
      { sender: "DANIEL", text: "Good.", time: "8:45 PM", sent: false },
      { sender: "A", text: "Why?", time: "8:47 PM", sent: true },
      {
        sender: "DANIEL",
        text: "Someone asked about it.",
        time: "8:52 PM",
        sent: false,
      },
      { sender: "A", text: "Who?", time: "8:53 PM", sent: true },
      { sender: "DANIEL", text: "I don't know.", time: "8:54 PM", sent: false },
    ],
  },
  {
    id: 3,
    contact: "Unknown",
    preview: "And the minutes?",
    timestamp: "Yesterday",
    unread: true,
    messages: [
      {
        sender: "UNKNOWN",
        text: "You remember the meeting?",
        time: "Yesterday, 11:03 PM",
        sent: false,
      },
      { sender: "A", text: "Yes.", time: "11:04 PM", sent: true },
      {
        sender: "UNKNOWN",
        text: "And the minutes?",
        time: "11:05 PM",
        sent: false,
      },
      { sender: "A", text: "55.", time: "11:06 PM", sent: true },
      {
        sender: "UNKNOWN",
        text: "Don't be late.",
        time: "11:07 PM",
        sent: false,
      },
      { sender: "A", text: "I won't.", time: "11:08 PM", sent: true },
    ],
  },
];

export function renderMessagesScreen(state: GameState, notice: string): string {
  if (state.messagesView === "success") return renderMessagesSuccess();
  if (state.messagesView === "conversation" && state.currentConversation) {
    return renderConversation(state.currentConversation);
  }
  return renderConversationList(state, notice);
}

function renderConversationList(state: GameState, notice: string): string {
  const resolved = state.completedApps.includes(4);
  return `<section class="messages-app" data-messages-view="list">
    <header class="messages-toolbar">
      <button class="messages-nav" data-action="home" aria-label="Back to home">‹</button>
      <div><p class="eyebrow">Private</p><h1>Messages</h1></div>
      ${resolved ? '<span class="messages-resolved">Resolved</span>' : '<span class="message-signal">●</span>'}
    </header>
    <div class="conversation-list">
      ${conversations
        .map(
          (
            conversation,
          ) => `<button class="conversation-row ${conversation.unread ? "is-unread" : ""}" data-conversation-id="${conversation.id}">
        <span class="contact-avatar">${conversation.contact.charAt(0)}</span>
        <span class="conversation-copy"><strong>${conversation.contact}</strong><small>${conversation.preview}</small></span>
        <span class="conversation-meta"><small>${conversation.timestamp}</small>${conversation.unread ? "<i></i>" : ""}</span>
      </button>`,
        )
        .join("")}
    </div>
    <div class="messages-puzzle-panel">
      <p class="messages-prompt">Two parts of the meeting time are hidden in different conversations.</p>
      <form data-action="solve-messages" class="messages-answer-form">
        <label for="messages-answer-hour">What time was the meeting?</label>
        <div class="time-answer-row"><input id="messages-answer-hour" name="hour" type="text" inputmode="numeric" maxlength="2" placeholder="__" aria-label="Meeting hour" /><span>:</span><input id="messages-answer-minute" name="minute" type="text" inputmode="numeric" maxlength="2" placeholder="__" aria-label="Meeting minute" /><button class="submit-button" type="submit">Submit</button></div>
        ${notice ? `<p class="notice puzzle-notice" role="alert">${notice}</p>` : ""}
      </form>
      <button class="hint-button" data-action="messages-hint">${state.messagesHintLevel > 0 ? "Hint shown" : "Show hint"}</button>
      ${state.messagesHintLevel > 0 ? `<p class="messages-hint">${state.messagesHintLevel > 1 ? "One conversation gives you one part of the time. Another gives you the other part." : "Not every conversation is part of the answer."}</p>` : ""}
    </div>
    <p class="messages-footer">${resolved ? "Investigation complete · " : ""}Encrypted · device only</p>
  </section>`;
}

function renderConversation(conversationId: number): string {
  const conversation = conversations.find(
    (item) => item.id === conversationId,
  )!;
  return `<section class="messages-app conversation-view" data-messages-view="conversation">
    <header class="conversation-toolbar">
      <button class="messages-nav" data-action="messages-list" aria-label="Back to messages">‹</button>
      <span class="contact-header"><span class="contact-avatar small">${conversation.contact.charAt(0)}</span><strong>${conversation.contact}</strong></span>
      <span class="conversation-status">offline</span>
    </header>
    <div class="message-thread" aria-label="Conversation with ${conversation.contact}">
      <p class="thread-date">${conversation.timestamp === "Today" ? "Today" : "Yesterday"}</p>
      ${conversation.messages.map((message) => `<div class="message-line ${message.sent ? "is-sent" : "is-received"}"><span class="message-sender">${message.sender}</span><p>${message.text}</p><time>${message.time}</time></div>`).join("")}
    </div>
  </section>`;
}

function renderMessagesSuccess(): string {
  return `<section class="messages-app messages-success" data-messages-view="success">
    <span class="success-mark">✓</span>
    <p class="eyebrow">Messages · recovered</p>
    <h1>MESSAGE RECOVERED</h1>
    <strong class="meeting-time">17:55</strong>
    <div class="same-place-note"><p>Same place.</p><small>— A</small></div>
    <div class="new-clue"><span>New clue</span><strong>17:55</strong></div>
    <button class="primary-button success-button" data-action="dismiss-messages-success">Return to home</button>
  </section>`;
}
