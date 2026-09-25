const { app, BrowserWindow } = require("electron");
const path = require("node:path");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 760,
        minWidth: 700,
        minHeight: 600,
        icon: path.join(__dirname, "images", "smiley.png"),
        backgroundColor: "#000000",
        autoHideMenuBar: true,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
            devTools: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "index.html"));

    // Handle DevTools shortcuts inside the focused window. This is more
    // reliable than a global shortcut, which can be claimed by Windows or
    // require the Fn key on some keyboards.
    mainWindow.webContents.on("before-input-event", (event, input) => {
        const isF12 = input.key === "F12";
        const isWindowsOrLinuxShortcut =
            input.control && input.shift && input.key.toLowerCase() === "i";
        const isMacShortcut =
            input.meta && input.alt && input.key.toLowerCase() === "i";

        if (input.type === "keyDown" && (isF12 || isWindowsOrLinuxShortcut || isMacShortcut)) {
            event.preventDefault();
            mainWindow.webContents.toggleDevTools();
        }
    });

    mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
    mainWindow.webContents.on("will-navigate", (event) => event.preventDefault());

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
