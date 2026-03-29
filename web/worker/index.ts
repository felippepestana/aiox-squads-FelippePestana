import { httpServerHandler } from "cloudflare:node";
import "../server/index.js";

export default httpServerHandler({ port: 8787 });
