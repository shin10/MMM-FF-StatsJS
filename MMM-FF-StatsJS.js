/* global Stats */
/* Magic Mirror
 * Module: MMM-FF-StatsJS
 *
 * By Michael Trenkler
 * MIT Licensed.
 */

Module.register("MMM-FF-StatsJS", {
  defaults: {
    screens: [0, 1, 2],
    screenIdx: 0,
    rotationInterval: 10000,
    animationSpeed: 0,
    static: true
  },

  start: function () {
    Log.log("Starting module: " + this.name);
    this.screenIdx = this.config.screenIdx;
    if (this.config.rotationInterval)
      setInterval(() => this.nextScreen(), this.config.rotationInterval);
  },

  getStyles: function () {
    return [this.file("./styles/MMM-FF-StatsJS.css")];
  },

  getScripts: function () {
    const scripts = [this.file("./node_modules/stats.js/build/stats.min.js")];
    window.requestAnimationFrame((ts) => this.statsjsLoop(ts));
    return scripts;
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    wrapper.classList.toggle("static", this.config.static);
    if (!this.statsjs) this.addStats();
    if (this.statsjs) {
      this.statsjs.showPanel(this.config.screens[0]);
      wrapper.appendChild(this.statsjs.dom);
    }
    return wrapper;
  },

  addStats: function () {
    if (window.Stats !== undefined) {
      this.statsjs = new Stats();
    } else {
      // try to use github as "cdn" if stats.js has not been installed via npm
      var script = document.createElement("script");
      script.onload = () => {
        this.statsjs = new Stats();
        document.body.appendChild(this.statsjs.dom);
      };
      script.src = "//mrdoob.github.io/stats.js/build/stats.min.js";
      document.head.appendChild(script);
    }
    window.requestAnimationFrame((ts) => this.statsjsLoop(ts));
  },

  nextScreen: function () {
    ++this.screenIdx;
    this.screenIdx %= this.config.screens.length;
    this.statsjs?.showPanel(this.config.screens[this.screenIdx]);
  },

  statsjsLoop: function () {
    this.statsjs?.update();
    window.requestAnimationFrame((ts) => this.statsjsLoop(ts));
  }
});
