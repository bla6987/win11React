import { combineReducers, createStore } from "redux";

import wallReducer from "./wallpaper";
import taskReducer from "./taskbar";
import deskReducer from "./desktop";
import menuReducer from "./startmenu";
import paneReducer from "./sidepane";
import widReducer from "./widpane";
import appReducer from "./apps";
import menusReducer from "./menu";
import globalReducer from "./globals";
import settReducer from "./settings";
import fileReducer from "./files";

const combinedReducers = combineReducers({
  wallpaper: wallReducer,
  taskbar: taskReducer,
  desktop: deskReducer,
  startmenu: menuReducer,
  sidepane: paneReducer,
  widpane: widReducer,
  apps: appReducer,
  menus: menusReducer,
  globals: globalReducer,
  setting: settReducer,
  files: fileReducer,
});

const allReducers = (state, action) => {
  if (state && ["FILERESTORE", "FILERECYCLE"].includes(action.type)) {
    const item = state.files.data.getId(action.payload);
    const canRestore = action.type === "FILERESTORE" && item?.host?.id === state.files.data.special["%recyclebin%"];
    const canRecycle = action.type === "FILERECYCLE" && item && !state.files.data.isRecycled(item.id);
    if (item?.type === "shortcut" && (canRestore || canRecycle)) action = { ...action, shortcut: item.data };
  }
  return combinedReducers(state, action);
};

var store = createStore(allReducers);

export default store;
