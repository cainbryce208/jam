import { serve } from "bun";
import path from "node:path";
const serverPort = 3000 || Bun.env.port;

export function startServer(serverPort) {
  function getWebDir(dirName="",fileName="") {
    if(fileName == "") {
      return path.join(__dirname,dirName)
    } else {
      return path.join(__dirname,dirName,fileName)
    }
  };
  async function servePage(filePath = "") {
    const pageFile = Bun.file(getWebDir("./pages",filePath), {
      type: "text/html",
    });
    const fileExists = await pageFile.exists();
    if (!fileExists) {
      return servePage("404.html");
    } else {
      return new Response(pageFile, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    }
  }

 async function serveCss(filePath = "") {
    const cssPath = filePath.split("/").pop();
    const cssFile = Bun.file(getWebDir("./css",cssPath), {
      type: "text/css",
    });
    const fileExists = await cssFile.exists();
    if(!fileExists) {
      return Response.error(404);
    } else {
      return new Response(cssFile, {
        headers: {
          "Content-Type": "text/css"
        }
      })
    }
 }

  function handleUrl(requestUrl = "") {
    const url = new URL(requestUrl);
    const urlPath = url.pathname;
    const urlQueryString = new URLSearchParams(url.search);
    const urlQueryParams = Object.fromEntries(urlQueryString.entries());
    const urlPage = urlPath.substring(urlPath.indexOf("/") + 1);
    return {
      urlPath,
      urlQueryString,
      urlQueryParams,
      urlPage,
    };
  }

  return serve({
    fetch(request) {
      const urlProps = handleUrl(request.url);
      console.log(`Incoming Request for file: ${urlProps.urlPage}`);
      if(urlProps.urlPath == "/favicon.ico") {
        return new Response(Bun.file(getWebDir("icons","favicon.ico"),{ type: "image/x-icon" }),{
          headers: {
            "Content-Type": "image/x-icon"
          }
        });
      }
      if(urlProps.urlPath.endsWith(".css")) {
        console.log(urlProps.urlPage);
        return serveCss(urlProps.urlPage);
      }
      if (urlProps.urlPath == "/") {
        return Response.redirect("/home", 303);
      } else {
        return servePage(urlProps.urlPage + ".html");
      }
    },
    port: serverPort,
  });
}

console.info(`http server running locally at: http://127.0.0.1:${serverPort}`);
