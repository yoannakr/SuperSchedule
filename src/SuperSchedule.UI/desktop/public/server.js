const path = require("path");

function startServer() {
  const nodeConsole = require("console");
  const myConsole = new nodeConsole.Console(process.stdout, process.stderr);
  myConsole.log("Server connecting......");

  // Change working directory
  //process.chdir("../../");

  let backend;
  backend = path.join(
    __dirname,
    "../build/api/net6.0/publish/SuperSchedule.Startup.exe"
  );

  var execfile = require("child_process").execFile;
  execfile(
    backend,
    {
      windowsHide: true,
    },
    (err, stdout, stderr) => {
      if (err) {
        myConsole.log(err);
      }
      if (stdout) {
        myConsole.log(stdout);
      }
      if (stderr) {
        myConsole.log(stderr);
      }
    }
  );

  myConsole.log("Server connected!");
}

module.exports = startServer;
