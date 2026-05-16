// host.jsx - Premiere Pro ExtendScript bridge

function importFileToProject(filePath) {
  try {
    var importArr = [filePath];
    var suppressUI = true;
    app.project.importFiles(importArr, suppressUI, app.project.rootItem, false);
    return "OK";
  } catch (e) {
    return "ERROR: " + e.message;
  }
}

function getProjectPath() {
  try {
    return app.project.path;
  } catch (e) {
    return "";
  }
}
