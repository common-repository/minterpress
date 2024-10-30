/**
 * Find all elements with `data-minterpress-module` attribute
 * and load their corresponding JS Module
 */
const els = Array.from(document.querySelectorAll("[data-minterpress-module]"));
const modules = {};

els.forEach((el) => {
  el.dataset.minterpressModule.split(" ").forEach((moduleName) => {
    import(`./modules/${moduleName}`).then((Module) => {
      modules[moduleName] = new Module.default(el);
    });
  });
});
