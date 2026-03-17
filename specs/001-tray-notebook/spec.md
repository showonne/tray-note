# Feature Specification: Tray Notebook

**Feature Branch**: `001-tray-notebook`  
**Created**: 2025-03-17  
**Status**: Draft  
**Input**: User description: "Lightweight tray notebook app, tray icon toggles window, input todo or notes, data stored locally"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Show or hide the note window via tray (Priority: P1)

A user wants to keep a small notebook available without cluttering the desktop or taskbar. When they are not using it, the application hides and only a tray (menu bar) icon is visible. When they need to capture or review notes, they click the tray icon to show the note window; clicking again or clicking away hides it.

**Why this priority**: The core value is "out of the way until needed." Without tray-based show/hide, the product is just a normal window and does not meet the lightweight, low-friction use case.

**Independent Test**: Can be fully tested by launching the app, verifying only the tray icon is visible when the window is hidden, then clicking the tray icon to show the window and again to hide it. Delivers the promise of a minimal presence when not in use.

**Acceptance Scenarios**:

1. **Given** the application is running and the note window is hidden, **When** the user clicks the tray icon, **Then** the note window becomes visible.
2. **Given** the note window is visible, **When** the user clicks the tray icon again (or the window loses focus, depending on product behavior), **Then** the note window is hidden and only the tray icon remains.
3. **Given** the application is running, **When** the user has not opened the window, **Then** no main window is visible in the taskbar or desktop; only the tray icon indicates the app is running.

---

### User Story 2 - Add and view notes or todo items (Priority: P2)

A user wants to quickly capture short notes or todo items (e.g., reminders, snippets, links). They open the note window, type a new item, and confirm (e.g., press Enter) to add it to the list. The list is visible in the window, newest-first or in a defined order, and persists so it is still there next time they open the window.

**Why this priority**: This is the primary content interaction. Without add and view, the tray behavior has nothing to show or persist.

**Independent Test**: Can be fully tested by opening the window, adding several items via keyboard, closing or hiding the window, reopening, and verifying the same items are still present in the same order.

**Acceptance Scenarios**:

1. **Given** the note window is open, **When** the user types text into the input and confirms (e.g., Enter), **Then** the text is added as a new item in the list and the input is cleared.
2. **Given** one or more items exist in the list, **When** the user opens the note window, **Then** all previously added items are visible in the list.
3. **Given** the user has added items, **When** they close and later reopen the application (or the note window), **Then** the list content is restored from local storage.

---

### User Story 3 - Copy item to clipboard and remove items (Priority: P3)

A user wants to reuse a note elsewhere (e.g., paste into an email or document) or remove items they no longer need. They can copy a single item to the system clipboard with one action and delete an item from the list with another action.

**Why this priority**: Improves utility and hygiene of the list; not required for the minimal "capture and persist" MVP but expected in a notebook-style tool.

**Independent Test**: Can be fully tested by adding an item, using the copy action, pasting in another application to verify clipboard content, then using the delete action and verifying the item is removed and the list persists without it.

**Acceptance Scenarios**:

1. **Given** the list contains at least one item, **When** the user triggers the copy action for that item, **Then** the item's text is placed on the system clipboard and the user receives clear feedback (e.g., a brief message).
2. **Given** the list contains at least one item, **When** the user triggers the delete action for that item, **Then** the item is removed from the list and the updated list is persisted locally.
3. **Given** the user has just copied an item, **When** the product is configured to hide the window after copy, **Then** the note window hides shortly after the copy feedback so the user can paste elsewhere without closing the window manually.

---

### User Story 4 - Reorder items by drag-and-drop (Priority: P4)

A user wants to change the order of items (e.g., move a todo to the top). They can drag an item to a new position in the list; the new order is saved and restored when they next open the window.

**Why this priority**: Enhances control over list order; optional for the smallest MVP but common in list-based tools.

**Independent Test**: Can be fully tested by adding several items, dragging one to a new position, then hiding and reopening the window and verifying the order is preserved.

**Acceptance Scenarios**:

1. **Given** the list has two or more items, **When** the user drags one item to another position, **Then** the list reorders and the new order is persisted.
2. **Given** the user has reordered items, **When** they reopen the note window, **Then** items appear in the last saved order.

---

### Edge Cases

- What happens when the list is empty? The window still shows the input and an empty list; the user can add the first item.
- What happens when the user enters only whitespace? The product does not add an empty or whitespace-only item (input is trimmed or validated).
- What happens when the user adds a very long single item? The item is stored and displayed; long lines may be truncated or wrapped in the UI with a way to view or copy full content.
- What happens when the number of items is very large (e.g., hundreds)? The list remains usable (e.g., scrollable); performance stays acceptable for normal use (no strict limit specified; implementation may define a reasonable cap).
- How does the product behave when the system tray is not available (e.g., some Linux setups)? The product may show a minimal window or document the limitation; exact behavior can be implementation-defined.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST provide a tray (menu bar) icon when the application is running and the main note window is not required to be visible.
- **FR-002**: The system MUST allow the user to show the note window by interacting with the tray icon (e.g., click).
- **FR-003**: The system MUST allow the user to hide the note window (e.g., by clicking the tray icon again or when the window loses focus), so that only the tray icon remains visible.
- **FR-004**: The system MUST provide an input control and a way to confirm (e.g., key press) to add a new note or todo item to the list.
- **FR-005**: The system MUST display the list of items in the note window in a defined order (e.g., newest first or user-defined order).
- **FR-006**: The system MUST persist all list items on the user's device so that they are restored when the user reopens the note window or restarts the application.
- **FR-007**: The system MUST allow the user to copy the text of a single list item to the system clipboard and MUST give clear feedback when the copy succeeds.
- **FR-008**: The system MUST allow the user to remove a single list item from the list; the updated list MUST be persisted.
- **FR-009**: The system MUST allow the user to reorder list items by drag-and-drop; the new order MUST be persisted.
- **FR-010**: The system MUST NOT add an item when the user confirms with empty or whitespace-only input (input MUST be trimmed or validated).

### Key Entities

- **Note item**: A single entry in the notebook. It has text content and a position (order) in the list. It can be added, displayed, copied, deleted, and reordered. Stored locally on the device.
- **List**: The ordered collection of note items. It is persisted on the device and restored when the user opens the window or restarts the app.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A user can add a new item and see it in the list within 2 seconds of confirming input.
- **SC-002**: After adding or reordering items and closing the window, 100% of items and their order are restored when the user opens the window again.
- **SC-003**: A user can show the note window from the tray and hide it again with at most two actions (e.g., two clicks) without using the keyboard.
- **SC-004**: A user can copy any list item to the clipboard and paste it into another application with the correct content.
- **SC-005**: When the window is hidden, no main application window is visible in the taskbar or dock (only the tray icon is present).

## Assumptions

- Single user on a single device; no multi-user or sync requirements.
- Data is stored only on the device; no cloud or server component.
- The application runs on operating systems that support a system tray or menu bar icon (e.g., Windows, macOS, common Linux desktop environments).
- "Tray" means the system tray (Windows) or menu bar (macOS) area where small icons are shown for background applications.
- Copy and delete actions are applied to one item at a time; no bulk operations are required for this feature.
