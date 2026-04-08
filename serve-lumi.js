import { serve } from "bun";
import { join } from "path";
import { readFile, stat } from "fs/promises";

const port = parseInt(process.env.PORT || "3000");

const server = serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);
    let filePath = url.pathname === "/" ? "/lumi-icon-generator.html" : url.pathname;
    filePath = join(process.cwd(), filePath);

    try {
      const file = await readFile(filePath);
      const ext = filePath.split(".").pop();
      const mimeTypes = {
        html: "text/html",
        js: "application/javascript",
        css: "text/css",
        json: "application/json",
        png: "image/png",
        jpg: "image/jpeg",
        gif: "image/gif"
      };

      return new Response(file, {
        headers: { "Content-Type": mimeTypes[ext] || "application/octet-stream" }
      });
    } catch (e) {
      return new Response("Not found", { status: 404 });
    }
  }
});

console.log(`Server running at http://localhost:${port}`);
