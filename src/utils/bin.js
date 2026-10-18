export class Item {
  constructor({ type, name, info, data, host }) {
    this.type = type || "folder";
    this.name = name;
    this.info = info || {};
    this.info.icon = this.info.icon || this.type;
    this.data = data;
    this.host = host;
    this.id = this.gene();
  }

  gene() {
    return Math.random().toString(36).substring(2, 10).toLowerCase();
  }

  getId() {
    return this.id;
  }

  getData() {
    return this.data;
  }

  setData(data) {
    this.data = data;
  }
}

export class Bin {
  constructor() {
    this.tree = [];
    this.lookup = {};
    this.special = {};
  }

  setSpecial(spid, id) {
    this.special[spid] = id;
  }

  setId(id, item) {
    this.lookup[id] = item;
  }

  getId(id) {
    return this.lookup[id];
  }

  getPath(id) {
    var cpath = "";
    var curr = this.getId(id);

    while (curr) {
      cpath = curr.name + "\\" + cpath;
      curr = curr.host;
    }

    return cpath.split("\\").length > 2 ? cpath.replace(/\\$/, "") : cpath;
  }

  parsePath(cpath) {
    if (cpath.includes("%")) {
      return this.special[cpath.trim()];
    }

    cpath = cpath
      .split("\\")
      .filter((x) => x !== "")
      .map((x) => x.trim().toLowerCase());
    if (cpath.length === 0) return null;

    var pid = null,
      curr = null;
    for (var i = 0; i < this.tree.length; i++) {
      if (this.tree[i].name.toLowerCase() === cpath[0]) {
        curr = this.tree[i];
        break;
      }
    }

    if (curr) {
      var i = 1,
        l = cpath.length;
      while (curr.type === "folder" && i < l) {
        var res = true;
        for (var j = 0; j < curr.data.length; j++) {
          if (curr.data[j].name.toLowerCase() === cpath[i]) {
            i += 1;
            if (curr.data[j].type === "folder") {
              res = false;
              curr = curr.data[j];
            }

            break;
          }
        }

        if (res) break;
      }

      if (i === l) pid = curr.id;
    }

    return pid;
  }

  clone() {
    const next = new Bin();
    next.special = { ...this.special };
    const copy = (item, host = null) => {
      const node = Object.assign(Object.create(Item.prototype), item, {
        info: { ...item.info }, host,
        recycled: item.recycled && { ...item.recycled },
      });
      next.lookup[node.id] = node;
      node.data = item.type === "folder" ? item.data.map(child => copy(child, node)) : item.data;
      return node;
    };
    next.tree = this.tree.map(item => copy(item));
    return next;
  }

  isRecycled(id) {
    let item = this.getId(id);
    const bin = this.special["%recyclebin%"];
    while (item) {
      if (item.id === bin) return true;
      item = item.host;
    }
    return false;
  }

  recycle(id, deletedAt = new Date().toISOString()) {
    const item = this.getId(id);
    const bin = this.getId(this.special["%recyclebin%"]);
    if (!item || !item.host || item.info.spid || this.isRecycled(id)) return false;
    item.recycled = { parentId: item.host.id, location: this.getPath(item.host.id), deletedAt };
    item.host.data = item.host.data.filter(child => child.id !== id);
    item.host = bin;
    bin.data.push(item);
    return true;
  }

  recycleShortcut(app) {
    if (!app || app.name === "Recycle Bin") return false;
    const bin = this.getId(this.special["%recyclebin%"]);
    const desktop = this.getId(this.special["%desktop%"]);
    const item = new Item({ type: "shortcut", name: `${app.name}.lnk`, info: { icon: app.icon }, data: { ...app }, host: bin });
    item.recycled = { parentId: desktop.id, location: this.getPath(desktop.id), deletedAt: new Date().toISOString() };
    this.setId(item.id, item);
    bin.data.push(item);
    return true;
  }

  restore(id) {
    const bin = this.getId(this.special["%recyclebin%"]);
    const item = bin.data.find(child => child.id === id);
    if (!item) return false;
    let parent = this.getId(item.recycled.parentId);
    if (!parent || this.isRecycled(parent.id)) parent = this.getId(this.special["%documents%"]);
    const original = item.name;
    let counter = 1;
    while (parent.data.some(child => child.name.toLowerCase() === item.name.toLowerCase())) {
      const dot = original.lastIndexOf(".");
      const split = item.type === "file" && dot > 0 ? dot : original.length;
      item.name = `${original.slice(0, split)} (restored ${counter++})${original.slice(split)}`;
    }
    bin.data = bin.data.filter(child => child.id !== id);
    item.host = parent;
    delete item.recycled;
    parent.data.push(item);
    return true;
  }

  purge(id) {
    const bin = this.getId(this.special["%recyclebin%"]);
    const item = bin.data.find(child => child.id === id);
    if (!item) return false;
    const remove = node => {
      if (node.type === "folder") node.data.forEach(remove);
      delete this.lookup[node.id];
    };
    remove(item);
    bin.data = bin.data.filter(child => child.id !== id);
    return true;
  }

  parseFolder(data, name, host = null) {
    var item = new Item({
      type: data.type,
      name: data.name || name,
      info: data.info,
      host: host,
    });

    this.setId(item.id, item);

    if (data.info && data.info.spid) {
      this.setSpecial(data.info.spid, item.id);
    }

    if (item.type !== "folder") {
      item.setData(data.data);
    } else {
      var fdata = [];
      if (data.data) {
        for (const key of Object.keys(data.data)) {
          fdata.push(this.parseFolder(data.data[key], key, item));
        }
      }

      item.setData(fdata);
    }

    return item;
  }

  parse(data) {
    var drives = Object.keys(data);
    var tree = [];
    for (var i = 0; i < drives.length; i++) {
      tree.push(this.parseFolder(data[drives[i]]));
    }

    this.tree = tree;
  }
}
