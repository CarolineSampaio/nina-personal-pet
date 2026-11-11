"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* -------------------------------------------------------------------------- */
/*                                    Utils                                   */
/* -------------------------------------------------------------------------- */
var docReady = function docReady(fn) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", fn);
  } else {
    setTimeout(fn, 1);
  }
};

var resize = function resize(fn) {
  return window.addEventListener("resize", fn);
};

var camelize = function camelize(str) {
  var text = str.replace(/[-_\s.]+(.)?/g, function (_, c) {
    return c ? c.toUpperCase() : "";
  });
  return "".concat(text.substr(0, 1).toLowerCase()).concat(text.substr(1));
};

var getData = function getData(el, data) {
  try {
    return JSON.parse(el.dataset[camelize(data)]);
  } catch (e) {
    return el.dataset[camelize(data)];
  }
};

var hexToRgb = function hexToRgb(hexValue) {
  var hex;
  hexValue.indexOf("#") === 0 ? hex = hexValue.substring(1) : hex = hexValue;

  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  }));
  return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : null;
};

var colors = {
  primary: "#0091e9",
  secondary: "#002147",
  success: "#00d27a",
  info: "#27bcfd",
  warning: "#FFC928",
  danger: "#EE4D47",
  light: "#F9FAFD",
  dark: "#000"
};
var grays = {
  white: "#fff",
  100: "#f9fafd",
  200: "#edf2f9",
  300: "#d8e2ef",
  400: "#b6c1d2",
  500: "#9da9bb",
  600: "#748194",
  700: "#5e6e82",
  800: "#4d5969",
  900: "#344050",
  1000: "#232e3c",
  1100: "#0b1727",
  black: "#000"
};

var hasClass = function hasClass(el, className) {
  !el && false;
  return el.classList.value.includes(className);
};

var addClass = function addClass(el, className) {
  el.classList.add(className);
};

var getOffset = function getOffset(el) {
  var rect = el.getBoundingClientRect();
  var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

var breakpoints = {
  xs: 0,
  sm: 576,
  md: 768,
  lg: 992,
  xl: 1200,
  xxl: 1540
};

var getBreakpoint = function getBreakpoint(el) {
  var classes = el && el.classList.value;
  var breakpoint;

  if (classes) {
    breakpoint = breakpoints[classes.split(" ").filter(function (cls) {
      return cls.includes("navbar-expand-");
    }).pop().split("-").pop()];
  }

  return breakpoint;
};

var utils = {
  docReady: docReady,
  resize: resize,
  camelize: camelize,
  getData: getData,
  hasClass: hasClass,
  addClass: addClass,
  hexToRgb: hexToRgb,
  colors: colors,
  grays: grays,
  getOffset: getOffset,
  getBreakpoint: getBreakpoint
};
/* -------------------------------------------------------------------------- */
/*                                  Detector                                  */
/* -------------------------------------------------------------------------- */
var detectorInit = function detectorInit() {
  var _window = window,
      is = _window.is;
  var html = document.querySelector('html');
  is.opera() && addClass(html, 'opera');
  is.mobile() && addClass(html, 'mobile');
  is.firefox() && addClass(html, 'firefox');
  is.safari() && addClass(html, 'safari');
  is.ios() && addClass(html, 'ios');
  is.iphone() && addClass(html, 'iphone');
  is.ipad() && addClass(html, 'ipad');
  is.ie() && addClass(html, 'ie');
  is.edge() && addClass(html, 'edge');
  is.chrome() && addClass(html, 'chrome');
  is.mac() && addClass(html, 'osx');
  is.windows() && addClass(html, 'windows');
  navigator.userAgent.match('CriOS') && addClass(html, 'chrome');
};

/*-----------------------------------------------
|   Top navigation opacity on scroll
-----------------------------------------------*/
var navbarInit = function navbarInit() {
  var Selector = {
    NAVBAR: '[data-navbar-on-scroll]',
    NAVBAR_COLLAPSE: '.navbar-collapse',
    NAVBAR_TOGGLER: '.navbar-toggler'
  };
  var ClassNames = {
    COLLAPSED: 'collapsed'
  };
  var Events = {
    SCROLL: 'scroll',
    SHOW_BS_COLLAPSE: 'show.bs.collapse',
    HIDE_BS_COLLAPSE: 'hide.bs.collapse',
    HIDDEN_BS_COLLAPSE: 'hidden.bs.collapse'
  };
  var DataKey = {
    NAVBAR_ON_SCROLL: 'navbar-light-on-scroll'
  };
  var navbar = document.querySelector(Selector.NAVBAR);

  navbar.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav-link') && window.innerWidth < utils.getBreakpoint(navbar)) {
      navbar.querySelector(Selector.NAVBAR_TOGGLER).click();
    }
  });

  if (navbar) {
    var windowHeight = window.innerHeight;
    var html = document.documentElement;
    var navbarCollapse = navbar.querySelector(Selector.NAVBAR_COLLAPSE);

    var allColors = _objectSpread(_objectSpread({}, utils.colors), utils.grays);

    var name = utils.getData(navbar, DataKey.NAVBAR_ON_SCROLL);
    var colorName = Object.keys(allColors).includes(name) ? name : 'light';
    var color = allColors[colorName];
    var bgClassName = "bg-".concat(colorName);
    var paddingName = 'padding-transition';
    var colorRgb = utils.hexToRgb(color);

    var _window$getComputedSt = window.getComputedStyle(navbar),
        backgroundImage = _window$getComputedSt.backgroundImage;

    var transition = 'background-color,padding 0.35s ease';
    navbar.style.backgroundImage = 'none';

    window.addEventListener(Events.SCROLL, function () {
      var scrollTop = html.scrollTop;
      var alpha = scrollTop / windowHeight * 0.1;

      navbar.classList.add('backdrop');

      if (alpha === 0) {
        navbar.classList.remove('backdrop');
      }

      alpha >= 1 && (alpha = 1);
      navbar.style.backgroundColor = "rgba(".concat(colorRgb[0], ", ").concat(colorRgb[1], ", ").concat(colorRgb[2], ", ").concat(alpha, ")");
      navbar.style.backgroundImage = alpha > 0 || utils.hasClass(navbarCollapse, 'show') ? backgroundImage : 'none';
      alpha > 0 || utils.hasClass(navbarCollapse, 'show') ? navbar.classList.add(paddingName) : navbar.classList.remove(paddingName);
    });

    utils.resize(function () {
      var breakPoint = utils.getBreakpoint(navbar);

      if (window.innerWidth > breakPoint) {
        navbar.style.backgroundImage = html.scrollTop ? backgroundImage : 'none';
      } else if (!utils.hasClass(navbar.querySelector(Selector.NAVBAR_TOGGLER), ClassNames.COLLAPSED)) {
        navbar.style.backgroundImage = backgroundImage;
      }
    });
    navbarCollapse.addEventListener(Events.SHOW_BS_COLLAPSE, function () {
      navbar.classList.add(bgClassName);
      navbar.style.backgroundImage = backgroundImage;
      navbar.style.transition = transition;
    });
    navbarCollapse.addEventListener(Events.HIDE_BS_COLLAPSE, function () {
      navbar.classList.remove(bgClassName);
      !html.scrollTop && (navbar.style.backgroundImage = 'none');
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                                Scroll To Top                               */
/* -------------------------------------------------------------------------- */
var scrollToTop = function scrollToTop() {
  document.querySelectorAll('[data-anchor] > a, [data-scroll-to]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var _utils$getData;

      e.preventDefault();
      var el = e.target;
      var id = utils.getData(el, 'scroll-to') || el.getAttribute('href');
      window.scroll({
        top: (_utils$getData = utils.getData(el, 'offset-top')) !== null && _utils$getData !== void 0 ? _utils$getData : utils.getOffset(document.querySelector(id)).top - 100,
        left: 0,
        behavior: 'smooth'
      });
      window.location.hash = id;
    });
  });
};

/*-----------------------------------------------
|   Animated Counters
-----------------------------------------------*/
var counterInit = function counterInit() {
  var counters = document.querySelectorAll('.counter-number');
  if (!counters.length) return;

  var animateCounter = function animateCounter(counter) {
    var target = +counter.getAttribute('data-target');
    var duration = 3000;
    var stepTime = 20;
    var steps = duration / stepTime;
    var increment = target / steps;
    var current = 0;

    var timer = setInterval(function () {
      current += increment;
      if (current >= target) {
        counter.innerText = target.toLocaleString('pt-BR');
        clearInterval(timer);
      } else {
        counter.innerText = Math.floor(current).toLocaleString('pt-BR');
      }
    }, stepTime);
  };

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(function (counter) {
    observer.observe(counter);
  });
};

/* -------------------------------------------------------------------------- */
/*                                Coupon Copy                                 */
/* -------------------------------------------------------------------------- */
var couponInit = function couponInit() {
  var copyButtons = document.querySelectorAll('.btn-copy-coupon');
  if (!copyButtons.length) return;

  copyButtons.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var code = btn.getAttribute('data-coupon');
      if (!code) return;

      var updateButton = function () {
        var originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        btn.classList.add('copied');

        setTimeout(function () {
          btn.innerHTML = originalHtml;
          btn.classList.remove('copied');
        }, 2200);
      };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(code).then(updateButton).catch(function () {
          var tempInput = document.createElement('input');
          tempInput.value = code;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          updateButton();
        });
      } else {
        var tempInput = document.createElement('input');
        tempInput.value = code;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        updateButton();
      }
    });
  });
};

/* -------------------------------------------------------------------------- */
/*                   Veterinary Degree Dynamic Progress                       */
/* -------------------------------------------------------------------------- */
var vetProgressInit = function vetProgressInit() {
  var startDate = new Date(2024, 0, 1).getTime();
  var endDate = new Date(2028, 11, 15).getTime();
  var now = Date.now();

  var rawPct = ((now - startDate) / (endDate - startDate)) * 100;
  var clampedPct = Math.max(5, Math.min(100, Math.round(rawPct)));

  var sobreSection = document.getElementById('sobre');
  if (!sobreSection) return;

  var triggerAnimation = function () {
    document.querySelectorAll('[data-skill-bar]').forEach(function (bar) {
      var val = bar.getAttribute('data-skill-bar') || '100';
      bar.style.width = val + '%';
    });

    document.querySelectorAll('[data-vet-bar]').forEach(function (bar) {
      bar.style.width = clampedPct + '%';
    });

    document.querySelectorAll('[data-vet-pct]').forEach(function (el) {
      var current = 0;
      var stepTime = 22;
      var timer = setInterval(function () {
        current += 1;
        if (current >= clampedPct) {
          el.textContent = clampedPct;
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, stepTime);
    });
  };

  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          triggerAnimation();
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    obs.observe(sobreSection);
  } else {
    triggerAnimation();
  }
};

/* -------------------------------------------------------------------------- */
/*                               Parallax Scroll                              */
/* -------------------------------------------------------------------------- */
var parallaxInit = function parallaxInit() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  var indicaSection = document.getElementById('nina-indica');
  var puminhaBg = document.querySelector('.nina-indica-puminha-bg');
  if (!indicaSection || !puminhaBg) return;

  var ticking = false;

  var clamp = function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  };

  var updateParallax = function updateParallax() {
    var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    if (viewportWidth < 768) {
      ticking = false;
      return;
    }

    var viewportHeight = window.innerHeight || document.documentElement.clientHeight || 800;
    var rect = indicaSection.getBoundingClientRect();

    if (rect.bottom > -150 && rect.top < viewportHeight + 150) {
      var elementCenter = rect.top + rect.height / 2;
      var viewportCenter = viewportHeight / 2;
      var progress = clamp((viewportCenter - elementCenter) / (viewportHeight * 0.55), -1.2, 1.2);
      var puminhaY = clamp(progress * -75, -65, 60);
      puminhaBg.style.transform = 'translate3d(0, ' + puminhaY.toFixed(1) + 'px, 0)';
    }

    ticking = false;
  };

  var onScroll = function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateParallax();
};

docReady(navbarInit);
docReady(detectorInit);
docReady(scrollToTop);
docReady(counterInit);
docReady(couponInit);
docReady(vetProgressInit);
docReady(parallaxInit);
