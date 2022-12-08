/*! Planetary.js v1.1.3
 *  Copyright (c) 2013 Michelle Tilley
 *
 *  Released under the MIT license
 *  Date: 2018-10-30T18:49:58.667Z
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['d3', 'topojson'], (d3, topojson) => (root.planetaryjs = factory(d3, topojson, root)));
  } else if (typeof exports === 'object') {
    module.exports = factory(require('d3'), require('topojson'));
  } else {
    root.planetaryjs = factory(root.d3, root.topojson, root);
  }
}(this, (d3, topojson, window) => {
  let originalPlanetaryjs = null;
  if (window) originalPlanetaryjs = window.planetaryjs;
  const plugins = [];

  const doDrawLoop = function(planet, canvas, hooks) {
    d3.timer(() => {
      if (planet.stopped) {
        return true;
      }

      planet.context.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < hooks.onDraw.length; i++) {
        hooks.onDraw[i]();
      }
    });
  };

  const initPlugins = function(planet, localPlugins) {
    // Add the global plugins to the beginning of the local ones
    for (var i = plugins.length - 1; i >= 0; i--) {
      localPlugins.unshift(plugins[i]);
    }

    // Load the default plugins if none have been loaded so far
    if (localPlugins.length === 0) {
      if (planetaryjs.plugins.earth) { planet.loadPlugin(planetaryjs.plugins.earth()); }
      if (planetaryjs.plugins.pings) { planet.loadPlugin(planetaryjs.plugins.pings()); }
    }

    for (i = 0; i < localPlugins.length; i++) {
      localPlugins[i](planet);
    }
  };

  const runOnInitHooks = function(planet, canvas, hooks) {
    // onInit hooks can be asynchronous if they take a parameter;
    // iterate through them one at a time
    if (hooks.onInit.length) {
      let completed = 0;
      const doNext = function(callback) {
        const next = hooks.onInit[completed];
        if (next.length) {
          next(() => {
            completed++;
            callback();
          });
        } else {
          next();
          completed++;
          setTimeout(callback, 0);
        }
      };
      var check = function() {
        if (completed >= hooks.onInit.length) doDrawLoop(planet, canvas, hooks);
        else doNext(check);
      };
      doNext(check);
    } else {
      doDrawLoop(planet, canvas, hooks);
    }
  };

  const startDraw = function(planet, canvas, localPlugins, hooks) {
    planet.canvas = canvas;
    planet.context = canvas.getContext('2d');

    if (planet.stopped !== true) {
      initPlugins(planet, localPlugins);
    }

    planet.stopped = false;
    runOnInitHooks(planet, canvas, hooks);
  };

  var planetaryjs = {
    plugins: {},

    noConflict: function() {
      window.planetaryjs = originalPlanetaryjs;
      return planetaryjs;
    },

    loadPlugin: function(plugin) {
      plugins.push(plugin);
    },

    planet: function() {
      const localPlugins = [];
      const hooks = {
        onInit: [],
        onDraw: [],
        onStop: []
      };

      var planet = {
        plugins: {},

        draw: function(canvas) {
          startDraw(planet, canvas, localPlugins, hooks);
        },

        onInit: function(fn) {
          hooks.onInit.push(fn);
        },

        onDraw: function(fn) {
          hooks.onDraw.push(fn);
        },

        onStop: function(fn) {
          hooks.onStop.push(fn);
        },

        loadPlugin: function(plugin) {
          localPlugins.push(plugin);
        },

        stop: function() {
          planet.stopped = true;
          for (let i = 0; i < hooks.onStop.length; i++) {
            hooks.onStop[i](planet);
          }
        },

        withSavedContext: function(fn) {
          if (!this.context) {
            throw new Error('No canvas to fetch context for');
          }

          this.context.save();
          fn(this.context);
          this.context.restore();
        }
      };

      planet.projection = d3.geo.orthographic()
        .clipAngle(90);
      planet.path = d3.geo.path().projection(planet.projection);

      return planet;
    }
  };

  planetaryjs.plugins.topojson = function(config) {
    return function(planet) {
      planet.plugins.topojson = {};

      planet.onInit((done) => {
        if (config.world) {
          planet.plugins.topojson.world = config.world;
          setTimeout(done, 0);
        } else {
          const file = config.file || 'world-110m.json';
          d3.json(file, (err, world) => {
            if (err) {
              throw new Error(`Could not load JSON ${file}`);
            }
            planet.plugins.topojson.world = world;
            done();
          });
        }
      });
    };
  };

  planetaryjs.plugins.oceans = function(config) {
    return function(planet) {
      planet.onDraw(() => {
        planet.withSavedContext((context) => {
          context.beginPath();
          planet.path.context(context)({type: 'Sphere'});

          context.fillStyle = config.fill || 'black';
          context.fill();
        });
      });
    };
  };

  planetaryjs.plugins.land = function(config) {
    return function(planet) {
      let land = null;

      planet.onInit(() => {
        const {world} = planet.plugins.topojson;
        land = topojson.feature(world, world.objects.land);
      });

      planet.onDraw(() => {
        planet.withSavedContext((context) => {
          context.beginPath();
          planet.path.context(context)(land);

          if (config.fill !== false) {
            context.fillStyle = config.fill || 'white';
            context.fill();
          }

          if (config.stroke) {
            if (config.lineWidth) context.lineWidth = config.lineWidth;
            context.strokeStyle = config.stroke;
            context.stroke();
          }
        });
      });
    };
  };

  planetaryjs.plugins.borders = function(config) {
    return function(planet) {
      let borders = null;
      const borderFns = {
        internal: function(a, b) {
          return a.id !== b.id;
        },
        external: function(a, b) {
          return a.id === b.id;
        },
        both: function(a, b) {
          return true;
        }
      };

      planet.onInit(() => {
        const {world} = planet.plugins.topojson;
        const {countries} = world.objects;
        const type = config.type || 'internal';
        borders = topojson.mesh(world, countries, borderFns[type]);
      });

      planet.onDraw(() => {
        planet.withSavedContext((context) => {
          context.beginPath();
          planet.path.context(context)(borders);
          context.strokeStyle = config.stroke || 'gray';
          if (config.lineWidth) context.lineWidth = config.lineWidth;
          context.stroke();
        });
      });
    };
  };

  planetaryjs.plugins.earth = function(config) {
    config = config || {};
    const topojsonOptions = config.topojson || {};
    const oceanOptions = config.oceans || {};
    const landOptions = config.land || {};
    const bordersOptions = config.borders || {};

    return function(planet) {
      planetaryjs.plugins.topojson(topojsonOptions)(planet);
      planetaryjs.plugins.oceans(oceanOptions)(planet);
      planetaryjs.plugins.land(landOptions)(planet);
      planetaryjs.plugins.borders(bordersOptions)(planet);
    };
  };

  planetaryjs.plugins.pings = function(config) {
    let pings = [];
    config = config || {};

    const addPing = function(lng, lat, options) {
      options = options || {};
      options.color = options.color || config.color || 'white';
      options.angle = options.angle || config.angle || 5;
      options.ttl = options.ttl || config.ttl || 2000;
      const ping = { time: new Date(), options: options };
      if (config.latitudeFirst) {
        ping.lat = lng;
        ping.lng = lat;
      } else {
        ping.lng = lng;
        ping.lat = lat;
      }
      pings.push(ping);
    };

    const drawPings = function(planet, context, now) {
      const newPings = [];
      for (let i = 0; i < pings.length; i++) {
        const ping = pings[i];
        const alive = now - ping.time;
        if (alive < ping.options.ttl) {
          newPings.push(ping);
          drawPing(planet, context, now, alive, ping);
        }
      }
      pings = newPings;
    };

    var drawPing = function(planet, context, now, alive, ping) {
      const alpha = 1 - (alive / ping.options.ttl);
      let color = d3.rgb(ping.options.color);
      color = `rgba(${color.r},${color.g},${color.b},${alpha})`;
      context.strokeStyle = color;
      const circle = d3.geo.circle().origin([ping.lng, ping.lat])
        .angle(alive / ping.options.ttl * ping.options.angle)();
      context.beginPath();
      planet.path.context(context)(circle);
      context.stroke();
    };

    return function (planet) {
      planet.plugins.pings = {
        add: addPing
      };

      planet.onDraw(() => {
        const now = new Date();
        planet.withSavedContext((context) => {
          drawPings(planet, context, now);
        });
      });
    };
  };

  planetaryjs.plugins.zoom = function (options) {
    options = options || {};
    const noop = function() {};
    const onZoomStart = options.onZoomStart || noop;
    const onZoomEnd = options.onZoomEnd || noop;
    const onZoom = options.onZoom || noop;
    const afterZoom = options.afterZoom || noop;
    const startScale = options.initialScale;
    const scaleExtent = options.scaleExtent || [50, 2000];

    return function(planet) {
      planet.onInit(() => {
        const zoom = d3.behavior.zoom()
          .scaleExtent(scaleExtent);

        if (startScale !== null && startScale !== undefined) {
          zoom.scale(startScale);
        } else {
          zoom.scale(planet.projection.scale());
        }

        zoom
          .on('zoomstart', onZoomStart.bind(planet))
          .on('zoomend', onZoomEnd.bind(planet))
          .on('zoom', () => {
            onZoom.call(planet);
            planet.projection.scale(d3.event.scale);
            afterZoom.call(planet);
          });
        d3.select(planet.canvas).call(zoom);
      });
    };
  };

  planetaryjs.plugins.drag = function(options) {
    options = options || {};
    const noop = function() {};
    const onDragStart = options.onDragStart || noop;
    const onDragEnd = options.onDragEnd || noop;
    const onDrag = options.onDrag || noop;
    const afterDrag = options.afterDrag || noop;

    return function(planet) {
      planet.onInit(() => {
        const drag = d3.behavior.drag()
          .on('dragstart', onDragStart.bind(planet))
          .on('dragend', onDragEnd.bind(planet))
          .on('drag', () => {
            onDrag.call(planet);
            const {dx} = d3.event;
            const {dy} = d3.event;
            const rotation = planet.projection.rotate();
            const radius = planet.projection.scale();
            const scale = d3.scale.linear()
              .domain([-1 * radius, radius])
              .range([-90, 90]);
            const degX = scale(dx);
            const degY = scale(dy);
            rotation[0] += degX;
            rotation[1] -= degY;
            if (rotation[1] > 90) rotation[1] = 90;
            if (rotation[1] < -90) rotation[1] = -90;
            if (rotation[0] >= 180) rotation[0] -= 360;
            planet.projection.rotate(rotation);
            afterDrag.call(planet);
          });
        d3.select(planet.canvas).call(drag);
      });
    };
  };

  return planetaryjs;
}));
