import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

export default function handlebarsPlugin(options = {}) {
  const root = process.cwd();

  const pagesDir = path.resolve(root, options.pagesDir || "src/views/pages");
  const layoutsDir = path.resolve(root, options.layoutsDir || "src/views/layouts");
  const partialsDir = path.resolve(root, options.partialsDir || "src/views/partials");
  const demosDir = path.resolve(root, options.demosDir || "public/demos");

  function getPages() {
    if (!fs.existsSync(pagesDir)) return [];
    const pages = [];
    function scan(dir, prefix) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          scan(full, prefix + entry.name + "/");
        } else if (entry.name.endsWith(".hbs")) {
          pages.push(prefix + path.parse(entry.name).name);
        }
      }
    }
    scan(pagesDir, "");
    return pages;
  }

  // Register custom helpers
  Handlebars.registerHelper("eq", function (a, b) {
    return a === b;
  });

  function registerPartials() {
    if (fs.existsSync(layoutsDir)) {
      fs.readdirSync(layoutsDir)
        .filter((f) => f.endsWith(".hbs"))
        .forEach((file) => {
          const name = path.parse(file).name;
          const content = fs.readFileSync(
            path.join(layoutsDir, file),
            "utf8",
          );
          Handlebars.registerPartial(name, content);
        });
    }
    if (fs.existsSync(partialsDir)) {
      fs.readdirSync(partialsDir)
        .filter((f) => f.endsWith(".hbs"))
        .forEach((file) => {
          const name = path.parse(file).name;
          const content = fs.readFileSync(
            path.join(partialsDir, file),
            "utf8",
          );
          Handlebars.registerPartial(name, content);
        });
    }
  }

  function compilePage(pageName) {
    const filePath = path.join(pagesDir, `${pageName}.hbs`);
    if (!fs.existsSync(filePath)) return null;
    const source = fs.readFileSync(filePath, "utf8");
    const template = Handlebars.compile(source);
    return template({});
  }

  function hasDemo(pageName) {
    return fs.existsSync(path.join(demosDir, `${pageName}.js`));
  }

  function buildHtmlDocument(pageName, htmlContent, isBuild) {
    const demo = hasDemo(pageName);

    // Compute relative path prefix based on page depth
    const depth = (pageName.match(/\//g) || []).length;
    const prefix = depth > 0 ? "../".repeat(depth) : "./";

    let scripts =
      `\n<script type="module" src="${prefix}src/js/app.js"></script>\n`;

    if (demo) {
      const demoName = path.basename(pageName);
      const scriptType = isBuild ? 'src' : 'type="module" src';
      scripts += `<script ${scriptType}="${prefix}demos/${demoName}.js"></script>\n`;
    }

    if (htmlContent.includes("</body>")) {
      return htmlContent.replace("</body>", scripts + "</body>");
    }
    return htmlContent + scripts;
  }

  registerPartials();

  return {
    name: "vite-plugin-handlebars",

    config(config, { command }) {
      if (command === "build") {
        const pages = getPages();
        const input = {};

        pages.forEach((name) => {
          const content = compilePage(name);
          if (content) {
            const html = buildHtmlDocument(name, content, true);
            const htmlPath = path.join(root, `${name}.html`);
            const htmlDir = path.dirname(htmlPath);
            if (!fs.existsSync(htmlDir)) {
              fs.mkdirSync(htmlDir, { recursive: true });
            }
            fs.writeFileSync(htmlPath, html, "utf8");
            input[name] = htmlPath;
          }
        });

        config.build = config.build || {};
        config.build.rollupOptions = config.build.rollupOptions || {};
        config.build.rollupOptions.input = {
          ...(config.build.rollupOptions.input || {}),
          ...input,
        };
      }
    },

    closeBundle() {
      const pages = getPages();
      pages.forEach((name) => {
        const htmlPath = path.join(root, `${name}.html`);
        if (fs.existsSync(htmlPath)) {
          fs.unlinkSync(htmlPath);
        }
      });
      // Clean up empty subdirectories left by page removal
      function cleanEmpty(dir) {
        if (!fs.existsSync(dir)) return;
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
          if (entry.isDirectory()) {
            cleanEmpty(path.join(dir, entry.name));
          }
        }
        if (fs.readdirSync(dir).length === 0) {
          fs.rmdirSync(dir);
        }
      }
      cleanEmpty(root);
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        let url = req.url || "";

        if (url.includes("?")) url = url.split("?")[0];

        const pageName =
          url.replace(/\.html$/, "").replace(/^\/|\/$/g, "") || "index";

        if (!getPages().includes(pageName)) {
          next();
          return;
        }

        try {
          const content = compilePage(pageName);
          if (!content) {
            next();
            return;
          }
          const html = buildHtmlDocument(pageName, content, false);
          res.setHeader("Content-Type", "text/html; charset=utf-8");
          res.end(html);
        } catch (err) {
          console.error(
            `[vite-handlebars] Error compiling ${pageName}:`,
            err,
          );
          next();
        }
      });
    },
  };
}
