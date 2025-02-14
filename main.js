import { app, BrowserWindow, screen, Menu } from "electron";
import path from "node:path";
import { fileURLToPath } from "url";
import process from "node:process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

const createMainWindow = () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.min(width, 1200),
        height: Math.min(height, 800),
        resizable: true,
        icon: path.join(__dirname, "public", "Billbizz-Logo_White.png"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
        }
    });

    Menu.setApplicationMenu(null); // Removes File, View, and Help menu

    mainWindow.loadURL("https://sit.billbizz.cloud/");

    mainWindow.on("resize", () => {
        const [newWidth, newHeight] = mainWindow.getSize();
        console.log(`Window resized to: ${newWidth}x${newHeight}`);
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
