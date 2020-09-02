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
  let prices = {};
  try {
    const data = await rp(url);
    const $ = cheerio.load(data);
    const tabla = $(".as-white-tabla > div.box-prices");

    tabla.each(function (i, elem) {
      let monitor = $(elem).find('.col-12.col-lg-5').text().replace(/[&\/\\#,+()$~%.'":*?<>{} ]/g,'');
      let price = $(elem).find('.col-6.col-lg-4').text();

      prices = {
        ...prices,
        [monitor]: price
      };

    });

    ctx.body = ctx.body = {
      usd: prices
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
