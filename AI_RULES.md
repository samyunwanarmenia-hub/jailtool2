# AI_RULES.md

## 🚀 Tech Stack Description

This project is a modern, responsive web application built with the following technologies:

*   **React 18:** A declarative, component-based JavaScript library for building user interfaces.
*   **Vite:** A fast and opinionated build tool that provides a lightning-fast development experience.
*   **JavaScript (ESNext):** The primary language for writing application code.
*   **Custom CSS with CSS Variables:** Used for styling components, providing a dark theme and responsive design.
*   **JSZip:** A client-side library for creating, reading, and editing `.zip` files, used for generating the IPA download.
*   **Netlify:** The platform used for continuous deployment and hosting, including serverless functions.

## 📚 Library Usage Rules

To maintain consistency, readability, and best practices, please adhere to the following guidelines when developing:

*   **UI Components:**
    *   Create new, small, and focused components in `src/components/` for reusable UI elements.
*   **Styling:**
    *   Always use the custom CSS classes defined in `src/styles.css` and leverage the CSS variables for consistent theming.
    *   Ensure designs are responsive across various screen sizes.
*   **Routing:**
    *   For simple page navigation (like `privacy.html` and `terms.html`), direct `<a>` tags are acceptable. For more complex in-app navigation, consider adding a routing library if needed in the future.
*   **Icons:**
    *   Currently, icons are implemented using emojis or simple text characters. If a dedicated icon library is needed in the future, it should be chosen and integrated consistently.
*   **Client-side File Generation:**
    *   For generating `.zip` archives (like the IPA file), use the **JSZip** library.
*   **Environment Variables:**
    *   Access environment variables using `import.meta.env` (Vite's native way).
    *   Ensure all environment variables are prefixed with `VITE_`.
    *   The `src/utils/env-loader.js` utility helps make these variables accessible globally for non-module scripts if needed.
*   **Notifications:**
    *   For simple, temporary on-screen messages, use the `src/components/Toast.jsx` component via `window.showToast()`.
*   **Telegram Notifications:**
    *   Use the `src/utils/telegram-notify.js` module for sending visitor notifications to Telegram.
    *   For production deployments on Netlify, ensure the `TELEGRAM_BOT_TOKEN` is configured as an environment variable in the Netlify dashboard, and use the Netlify Function for proxying requests to avoid CORS issues.
*   **State Management:**
    *   For local component state, prefer React's built-in `useState` and `useReducer` hooks.
    *   For global state, consider using React Context API if the application grows and requires shared state across many components, but always aim for simplicity.
*   **File Structure:**
    *   Place main application pages in `src/pages/` (if they were React components, currently `App.jsx` is the main entry).
    *   Place reusable UI components in `src/components/`.
    *   Place general utility functions in `src/utils/`.
    *   Place custom React hooks in `src/hooks/`.
    *   Directory names must be all lower-case.
*   **Code Quality:**
    *   Write clean, readable, and maintainable code.
    *   Follow existing coding styles and conventions.
    *   Ensure all new components and features are fully functional and complete, without placeholders or TODO comments for core functionality.