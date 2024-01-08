import { app, BrowserWindow, Tray, Menu, globalShortcut } from "electron";
import path from "path";
import { is } from "@electron-toolkit/utils";
//import ffi from 'ffi-napi';
import { Library } from "ffi-napi";
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  console.log(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  console.log(__dirname);
  if (is.dev) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }

  mainWindow.webContents.openDevTools();
};



app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/*app.on("ready", createWindow);
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});*/

let tray: Tray = null;
app.whenReady().then(() => {
  const iconPath: string = path.join(__dirname,`application-icon.png`);
  tray = new Tray(iconPath);
  const contextMenu = Menu.buildFromTemplate([
    { label: "Item1", type: "radio" },
    { label: "Item2", type: "radio" },
    { type: "separator" },
    { label: "Other" },
  ]);
  tray.setToolTip("This is my application.");
  
  const user32 = new Library('user32.dll', {
   /* 'FindWindowW': ['int', ['string', 'string']],
    'GetForegroundWindow': ['long', []],
    'ShowWindow': ['int', ['int', 'int']]*/
  });

  /*globalShortcut.register("CommandOrControl+Q", () => { console.log("CommandOrControl+Q is pressed");
  const forecusedWindow = user32.GetForegroundWindow();
  console.log("CommandOrControl+Q is pressed");
  console.log("Focused Application:", forecusedWindow);
});*/

  tray.setContextMenu(contextMenu);
});
