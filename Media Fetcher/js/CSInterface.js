/**
 * CSInterface.js — minimal subset for this extension.
 * Full version: https://github.com/Adobe-CEP/CEP-Resources
 */
(function () {
  "use strict";

  function CSInterface() {}

  CSInterface.prototype.evalScript = function (script, callback) {
    if (!window.__adobe_cep__) {
      console.warn("CSInterface: not running inside CEP host.");
      if (callback) callback("EvalScript Error");
      return;
    }
    window.__adobe_cep__.evalScript(script, function (result) {
      if (callback) callback(result);
    });
  };

  CSInterface.prototype.getSystemPath = function (pathType) {
    if (!window.__adobe_cep__) return "";
    return window.__adobe_cep__.getSystemPath(pathType);
  };

  window.CSInterface = CSInterface;
})();
