import { Bin } from "../utils/bin.js";
import fdata from "./dir.json" with { type: "json" };

export const createFileState = () => {
  const data = new Bin();
  data.parse(fdata);
  const cdir = data.special["%user%"];
  return { data, cdir, hist: [cdir], hid: 0, view: 1, selected: null, status: "", cpath: data.getPath(cdir) };
};

const fileReducer = (state = createFileState(), action) => {
  if (action.type === "FILESELECT") return { ...state, selected: action.payload };
  if (action.type === "FILEVIEW") return { ...state, view: action.payload };
  if (["FILERECYCLE", "FILERESTORE", "FILEPURGE", "FILEEMPTYBIN", "DESKRECYCLE"].includes(action.type)) {
    const data = state.data.clone();
    const ids = action.type === "FILEEMPTYBIN" ? [...data.getId(data.special["%recyclebin%"]).data].map(item => item.id) : [action.payload];
    const method = { FILERECYCLE: "recycle", FILERESTORE: "restore", FILEPURGE: "purge", FILEEMPTYBIN: "purge", DESKRECYCLE: "recycleShortcut" }[action.type];
    let count = 0;
    ids.forEach(id => { if (data[method](id)) count++; });
    if (!count) return { ...state, status: "No items changed. System folders cannot be deleted." };
    const hist = state.hist.filter(id => data.getId(id) && (!data.isRecycled(id) || id === data.special["%recyclebin%"]));
    const cdir = hist.includes(state.cdir) ? state.cdir : data.special["%documents%"];
    if (!hist.includes(cdir)) hist.push(cdir);
    const status = { FILERECYCLE: "Item moved to Recycle Bin.", FILERESTORE: "Item restored.", FILEPURGE: "Item permanently deleted.", FILEEMPTYBIN: "Recycle Bin emptied.", DESKRECYCLE: "Shortcut moved to Recycle Bin." }[action.type];
    return { ...state, data, hist, hid: hist.lastIndexOf(cdir), cdir, cpath: data.getPath(cdir), selected: null, status };
  }
  let cdir = state.cdir, hist = [...state.hist], hid = state.hid;
  if (action.type === "RECYCLEBIN") cdir = state.data.special["%recyclebin%"];
  else if (action.type === "FILEDIR") cdir = state.data.special[action.payload] || action.payload;
  else if (action.type === "FILEPATH") cdir = state.data.parsePath(action.payload) || cdir;
  else if (action.type === "FILEBACK") cdir = state.data.getId(cdir).host?.id || cdir;
  else if (action.type === "FILEPREV") { hid = Math.max(0, hid - 1); cdir = hist[hid]; }
  else if (action.type === "FILENEXT") { hid = Math.min(hist.length - 1, hid + 1); cdir = hist[hid]; }
  else return state;
  const item = state.data.getId(cdir);
  if (!item || item.type !== "folder" || (state.data.isRecycled(cdir) && cdir !== state.data.special["%recyclebin%"])) return state;
  if (!["FILEPREV", "FILENEXT"].includes(action.type) && cdir !== hist[hid]) {
    hist = hist.slice(0, hid + 1); hist.push(cdir); hid = hist.length - 1;
  }
  return { ...state, cdir, hist, hid, selected: null, status: "", cpath: state.data.getPath(cdir) };
};

export default fileReducer;
