window.addEventListener('DOMContentLoaded', (event) => {
  var editor = ace.edit("source");
  editor.setTheme("ace/theme/monokai");
  editor.session.setMode("ace/mode/javascript");
});
