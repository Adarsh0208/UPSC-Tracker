UPSC 2027 Tracker (offline PWA), version 13

FILES (upload ALL of these to the root of your GitHub repository):
  index.html, app.css, app.js, sw.js, manifest.json, icon-192.png, icon-512.png
  (start-windows.bat and this README are optional)

DEPLOY ON GITHUB PAGES
  1. Repository > Add file > Upload files > drag in the files above (the files, not the folder) > Commit changes.
  2. Wait for the green tick under Actions, then open https://<username>.github.io/<repository>/ with internet on.
  3. If an installed copy still looks old, close it completely and reopen it once.

INSTALL
  Android: Chrome > menu > Install app.  Windows: Chrome or Edge > install icon in the address bar.

DATA
  Everything is stored in this browser on this device. Settings > Backup (JSON) regularly; Restore on a new device.
  Each profile has its own data. Share progress with a partner using snapshot files (Dashboard > Shared progress).

TESTS (optional, developers): dev-tests/phase0.py .. phase8.py use Python + Playwright against a local web server.
