# Google Messages for Linux (Polished True Black OLED Theme & Desktop App)

A polished, clean, and modern desktop experience for Google Messages on Linux (Ubuntu / GNOME / Wayland). Combines **True Black OLED AMOLED** surfaces, **iMessage / Telegram-inspired minimalism**, and native desktop integration.

---

## ✨ Features

* **True Black OLED AMOLED (`#000000`):** Pitch black surfaces for the chat view, sidebar, and headers.
* **iMessage Vibrant Blue Bubbles (`#0a84ff`):** High-contrast electric blue outgoing bubbles with crisp white typography.
* **Minimalist Clean Header:** Strips out the redundant "Google Messages" logo and text from the top bar next to the `≡` menu, leaving a clean, distraction-free interface.
* **Locked Window Title (`Messages`):** Replaces Google's default `"Google Messages for web: Conversations"` or long URLs with a clean, locked native title.
* **Slim Native Scrollbars:** Auto-fading, slim scrollbars that don't crowd the conversation list.
* **Two Usage Options:**
  1. **Chrome PWA Extension:** Themes your existing Google Chrome PWA window.
  2. **Standalone Electron Desktop App:** A dedicated, native Linux application window with zero browser chrome and system integration.

---

## 📁 Repository Structure

```text
├── extension/          # Unpacked Chrome extension to polish the Chrome PWA
│   ├── manifest.json
│   ├── theme.css
│   └── content.js
├── desktop/            # Standalone Electron desktop client
│   ├── main.js
│   ├── preload.js
│   ├── package.json
│   ├── theme.css
│   ├── start.sh
│   └── messages.desktop
└── README.md
```

---

## 🚀 Installation & Usage

### Option 1: Chrome PWA Extension

If you already use Google Messages as a Chrome PWA (`google-chrome --app=https://messages.google.com/web`):

1. Open Google Chrome and go to `chrome://extensions`.
2. Toggle on **Developer mode** in the top-right corner.
3. Click **Load unpacked** (top-left).
4. Select the `extension/` folder from this repo.
5. Open or refresh your Google Messages PWA window (`Ctrl + R`).

### Option 2: Standalone Electron Desktop App

To run as an independent native Linux desktop application:

1. **Install dependencies:**
   ```bash
   cd desktop
   npm install
   ```

2. **Launch the app:**
   ```bash
   ./start.sh
   # or
   npm start
   ```

3. **Install the desktop shortcut:**
   ```bash
   cp desktop/messages.desktop ~/.local/share/applications/
   update-desktop-database ~/.local/share/applications/
   ```

---

## 📄 License

MIT
