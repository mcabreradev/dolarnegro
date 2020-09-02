const Koa = require("koa");
const Router = require("koa-router");
const logger = require("koa-logger");
const bodyParser = require("koa-bodyparser");
const cheerio = require("cheerio");
const rp = require("request-promise");

const PORT = process.env.PORT || 8000;

const app = new Koa();
const router = new Router();

const url = "https://monitordolarvenezuela.com/";

router.get("/", async (ctx) => {
  let prices = [];
  try {
    const data = await rp(url);
    const $ = cheerio.load(data);
    const tabla = $("as-white-tabla");
    tabla.find("div.box-prices").each(function (i, elem) {
      prices.push({
        tipo: $(elem).eq(0).text(),
        monto: $(elem).eq(1).text()
      });
    });

    // prices.push(tabla);
    ctx.body = ctx.body = {
      data: prices
    };
  } catch (error) {
    console.log(error);
  }
});

app
  .use(logger())
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(PORT, "0.0.0.0", () =>
    console.log(`listening on http://localhost:${PORT}...`)
  );
