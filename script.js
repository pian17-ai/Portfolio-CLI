/* =====================
   VIRTUAL FILE SYSTEM
===================== */
const fs = {
  "/": {
    skills: {
      "backend.txt": `
- Laravel REST API
- Authentication (Sanctum, Middleware, Policy)
- MVC Architecture
- CRUD & Validation
      `,
      "frontend.txt": `
- HTML
- Tailwind CSS
- JavaScript DOM
- React (Basic)
      `,
      "tools.txt": `
- Git & GitHub
- Linux (Mint, Arch, Ubuntu, Kali, EndeavourOS, PopOS, Ubuntu Server)
- Nginx
- Laragon
- VSCodium
      `
    },

    projects: {
      "lks.txt": `
LKS Web Technology Preparation
- Laravel API
- React Frontend
- JavaScript Game
      `,
      "portfolio.txt": `
Terminal Portfolio Website
Built with HTML, CSS, JS
      `
    },

    "about.txt": `
Hi, I'm Pian.
Web Developer & Linux Engineering.
    `,

    "contact.txt": `
GitHub : github.com/pian17-ai
Email  : alviancahyopambudi1@gmail.com
    `
  }
};

/* =====================
   STATE
===================== */
let currentPath = "/";
let currentDir = fs["/"];

let history = [];
let historyIndex = -1;

const commands = ["ls", "cd", "cat", "clear", "help", "neofetch"];

/* =====================
   ELEMENT
===================== */
const output = document.getElementById("output");
const input = document.getElementById("command");
const prompt = document.getElementById("prompt");

/* =====================
   HELPER
===================== */
function updatePrompt() {
  prompt.textContent = `pian@portfolio:${currentPath}$`;
}

function print(text = "") {
  output.innerHTML += `<pre>${text}</pre>`;
  window.scrollTo(0, document.body.scrollHeight);
}

function resolvePath(path) {
  if (path === "/") return fs["/"];
  let parts = path.split("/").filter(Boolean);
  let dir = fs["/"];
  for (let p of parts) {
    if (!dir[p]) return null;
    dir = dir[p];
  }
  return dir;
}

/* =====================
   COMMAND HANDLER
===================== */
function handleCommand(cmd) {
  const [command, ...args] = cmd.split(" ");

  switch (command) {
    case "help":
      print(`
Commands:
- ls
- cd
- cat
- clear
- neofetch
      `);
      break;

    case "ls":
      print(Object.keys(currentDir).join("  "));
      break;

    case "cd":
      changeDirectory(args[0]);
      break;

    case "cat":
      catFile(args[0]);
      break;

    case "clear":
      output.innerHTML = "";
      break;

    case "neofetch":
      print(`
           .             ​ pian@world
          .c.           ┌────────────────────────────────┐ 
         .ccc.           ​ OS : Arch Linux
        .lllll.          ​ Kernel : arch1-1
       ..;'olll.         ​ WM : Hyprland 
      .dolllcccl.        ​ Shell : fish
     .lcc'   'ccc.       ​ Uptime : 16 years
    .ccc'     'cc:.      ​ Wife : Nagisa Kubo
   .cccc'     'c:;..    └────────────────────────────────┘ 
  ."'             '".    I     U s e     A r c h    B t w  
      `);
      break;

    default:
      print("Command not found");
  }
}

/* =====================
   CD
===================== */
function changeDirectory(target) {
  if (!target) return;

  if (target === "..") {
    if (currentPath === "/") return;
    currentPath = currentPath.split("/").slice(0, -2).join("/") + "/";
  } else {
    const newPath =
      currentPath === "/"
        ? `/${target}/`
        : `${currentPath}${target}/`;

    const dir = resolvePath(newPath);
    if (!dir || typeof dir !== "object") {
      print("Directory not found");
      return;
    }
    currentPath = newPath;
  }

  currentDir = resolvePath(currentPath);
  updatePrompt();
}

/* =====================
   CAT
===================== */
function catFile(file) {
  if (!file) return;
  const content = currentDir[file];
  if (!content) {
    print("File not found");
    return;
  }
  print(content);
}

/* =====================
   AUTOCOMPLETE (TAB)
===================== */
function autocomplete() {
  const value = input.value;
  const parts = value.split(" ");

  // command autocomplete
  if (parts.length === 1) {
    const match = commands.filter(c => c.startsWith(parts[0]));
    if (match.length === 1) {
      input.value = match[0] + " ";
    }
  }

  // file / dir autocomplete
  if (parts.length === 2) {
    const options = Object.keys(currentDir);
    const match = options.filter(o => o.startsWith(parts[1]));
    if (match.length === 1) {
      input.value = parts[0] + " " + match[0];
    }
  }
}

/* =====================
   INPUT LISTENER
===================== */
updatePrompt();
print("Type 'help' or 'neofetch'");

input.addEventListener("keydown", e => {
  // ENTER
  if (e.key === "Enter") {
    const cmd = input.value.trim();
    if (!cmd) return;

    print(`${prompt.textContent} ${cmd}`);
    handleCommand(cmd);

    history.push(cmd);
    historyIndex = history.length;

    input.value = "";
  }

  // TAB
  if (e.key === "Tab") {
    e.preventDefault();
    autocomplete();
  }

  // HISTORY UP
  if (e.key === "ArrowUp") {
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  }

  // HISTORY DOWN
  if (e.key === "ArrowDown") {
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      input.value = "";
    }
  }
});


document.addEventListener("click", () => {
  input.focus();
});
