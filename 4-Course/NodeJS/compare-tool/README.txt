Requirements: node.js installed

Prepare:
1. Download additional modules via NPM. Console command from project root: npm install
2. Specify path to image directory in /config/config.json "folder" attribute like "D:\\autotests\\projects\\project-screenshots"
2. Start nodejs server with command: node app.js
3. Configure your tests to place images into [images-folder]/currentLine/[project-name]/[environment]
4. Place your base line images into [images-folder]/baseLine/[project-name]/[environment]
5. Tool is reachable by path http://localhost:3000/
