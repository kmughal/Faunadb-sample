const Express = require("express");
const bodyParser = require("body-parser");
const faunaDb = require("faunadb");

require("dotenv").config();

const app = Express();
const client = new faunaDb.Client({ secret: process.env.FAUNDA_DB_SCRETE });

const {
  Get,
  Match,
  Index,
  Create,
  Select,
  Collection,
  Call,
  Function: fn,
  Paginate
} = faunaDb.query;

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  if (req.method == "PUT") return res.status(200);
  next();
});

app.get("/get", async (req, res) => {
  const result = await client.query(
    Get(Match(Index("userbyemail"), "test@gmail.com"))
  );

  res.send(result);
});

app.get("/getReference", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.send(404);

  const result = await client.query(Get(Match(Index("userbyemail"), email)));
  res.send(result);
});

app.post("/add", async (req, res) => {
  const { email, text } = req.body;

  if (!email || !text) {
    return res.send(400);
  }
  const data = {
    user: Call(fn("getuserbyemail"), email),
    todo: [text],
  };
  await client.query(Create(Collection("todos"), { data }));
  res.send("new document created for " + email).status(200);
});

app.get("/alltodos", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.send(404);

  const result = await client.query(
    Paginate(
      Match(
        Index("todosbyuser"),
        Select("ref", Get(Match(Index("userbyemail"), email)))
      )
    )
  );
  res.send(result);
});

app.listen(3000, () => console.log("server started:"));
