const fs = require("fs");
const path = require("path");

const dist = path.resolve(__dirname, "..", "dist");
const srcPages = path.resolve(dist, "src/pages");
const targetPages = path.resolve(dist, "pages");

if (fs.existsSync(srcPages)) {
	fs.mkdirSync(targetPages, { recursive: true });
	fs.readdirSync(srcPages).forEach((file) => {
		fs.renameSync(
			path.resolve(srcPages, file),
			path.resolve(targetPages, file),
		);
	});
	fs.rmSync(srcPages, { recursive: true });
}

console.log("Post-build cleanup complete: HTML moved to dist/pages/");
