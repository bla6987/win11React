import { desktopApps } from "../utils";

const defState = {
  apps: desktopApps,
  hide: false,
  size: 1,
  sort: "none",
  abOpen: false,
};

const deskReducer = (state = defState, action) => {
  switch (action.type) {
    case "FILERESTORE":
      if (!action.shortcut || state.apps.some(app => app.name === action.shortcut.name)) return state;
      return { ...state, apps: [...state.apps, action.shortcut] };
    case "FILERECYCLE":
      if (!action.shortcut) return state;
      return { ...state, apps: state.apps.filter(app => app.name !== action.shortcut.name) };
    case "DESKRECYCLE":
      if (action.payload.name === "Recycle Bin") return state;
      return { ...state, apps: state.apps.filter(app => app.name !== action.payload.name) };
    case "DESKREM":
      var arr = state.apps.filter((x) => x.name != action.payload);

      localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
      return { ...state, apps: arr };
    case "DESKADD":
      var arr = [...state.apps];
      arr.push(action.payload);

      localStorage.setItem("desktop", JSON.stringify(arr.map((x) => x.name)));
      return { ...state, apps: arr };
    case "DESKHIDE":
      return {
        ...state,
        hide: true,
      };
    case "DESKSHOW":
      return {
        ...state,
        hide: false,
      };
    case "DESKTOGG":
      return {
        ...state,
        hide: !state.hide,
      };
    case "DESKSIZE":
      return {
        ...state,
        size: action.payload,
      };
    case "DESKSORT":
      return {
        ...state,
        sort: action.payload || "none",
      };
    case "DESKABOUT":
      return {
        ...state,
        abOpen: action.payload,
      };
    default:
      return state;
  }
};

export default deskReducer;
