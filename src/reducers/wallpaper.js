var wps = localStorage.getItem("wps") || 0;
var locked = localStorage.getItem("locked");

const walls = [
  "default/img0.svg",
  "dark/img0.svg",
  "ThemeA/img0.svg",
  "ThemeA/img1.svg",
  "ThemeA/img2.svg",
  "ThemeA/img3.svg",
  "ThemeB/img0.svg",
  "ThemeB/img1.svg",
  "ThemeB/img2.svg",
  "ThemeB/img3.svg",
  "ThemeC/img0.svg",
  "ThemeC/img1.svg",
  "ThemeC/img2.svg",
  "ThemeC/img3.svg",
  "ThemeD/img0.svg",
  "ThemeD/img1.svg",
  "ThemeD/img2.svg",
  "ThemeD/img3.svg",
];

const themes = ["default", "dark", "ThemeA", "ThemeB", "ThemeD", "ThemeC"];

const defState = {
  themes: themes,
  wps: wps,
  src: walls[wps],
  locked: !(locked == "false"),
  booted: false || import.meta.env.MODE == "development",
  act: "",
  dir: 0,
};

const wallReducer = (state = defState, action) => {
  switch (action.type) {
    case "WALLUNLOCK":
      localStorage.setItem("locked", false);
      return {
        ...state,
        locked: false,
        dir: 0,
      };
    case "WALLNEXT":
      var twps = (state.wps + 1) % walls.length;
      localStorage.setItem("wps", twps);
      return {
        ...state,
        wps: twps,
        src: walls[twps],
      };
    case "WALLALOCK":
      return {
        ...state,
        locked: true,
        dir: -1,
      };
    case "WALLBOOTED":
      return {
        ...state,
        booted: true,
        dir: 0,
        act: "",
      };
    case "WALLRESTART":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "restart",
      };
    case "WALLSHUTDN":
      return {
        ...state,
        booted: false,
        dir: -1,
        locked: true,
        act: "shutdn",
      };
    case "WALLSET":
      var isIndex = !Number.isNaN(parseInt(action.payload)),
        wps = 0,
        src = "";

      if (isIndex) {
        wps = localStorage.getItem("wps");
        src = walls[wps] ? walls[wps] : walls[0];
      } else {
        const idx = walls.findIndex((item) => item === action.payload);
        localStorage.setItem("wps", idx);
        src = action.payload;
        wps = walls[idx];
      }

      return {
        ...state,
        wps: wps,
        src: src,
      };
    default:
      return state;
  }
};

export default wallReducer;
