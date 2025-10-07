require('dotenv').config()

const express = require('express')
      app = express()
      passport = require('passport')
      session = require('express-session')
      GitHubStrategy = require('passport-github').Strategy

app.use( express.static( 'public' ) )
app.use( express.static( 'views'  ) )
app.use( express.json() )

app.use(session({
    secret: '0hRU9tuVmf0h7cFkKTFE6z9dKvV6Nu',
    resave: false,
    saveUninitialized: false
}))

app.use( passport.initialize() )
app.use( passport.session() )

passport.serializeUser((user, done) => {
    done(null, user)
})

passport.deserializeUser((obj, done) => {
    done(null, obj)
})

passport.use(new GitHubStrategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "https://a3-kayliequach.vercel.app/auth/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        const user = {
            id: profile.id,
            username: profile.username || profile.displayName || profile._json?.login,
            avatar: profile.photos?.[0]?.value,
        }
        console.log("GitHub profile:", user)
        cb(null, user)
    }
));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const path = require("node:path");
const uri = `mongodb+srv://${process.env.USERNM}:${process.env.PASS}@${process.env.HOST}/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let collection = null

async function run() {
  try {
    await client.connect(
        err => {
          console.log("err :", err);
          client.close();
        }
    );
    collection = client.db("loanData").collection("assignmentThree");
    // Send a ping to confirm a successful connection
    await client.db("loanData").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/login.html"))
})

app.get("/home", (req, res) => {
    if (!req.user) return res.redirect('/')
    res.sendFile(path.join(__dirname, "public/homepage.html"))
})

app.get('/auth/github', passport.authenticate('github'))

app.get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect('/home');
    })

app.get("/results", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const docs = await collection.find({ githubId: req.user.id }).toArray();
    res.json(docs);
})

app.post("/add", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const dataWithUser = {
        ...req.body,
        githubId: req.user.id,
        githubUsername: req.user.username,
    };

    const result = await collection.insertOne( dataWithUser )
    res.json( result )
})

app.post("/delete", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const idx = req.body.index
    const docs = await collection.find({ githubId: req.user.id }).toArray()

    if (idx >= 0 && idx < docs.length) {
        const idToDelete = docs[idx]._id
        await collection.deleteOne({ _id: idToDelete, githubId: req.user.id })
    }

    const updated = await collection.find({ githubId: req.user.id }).toArray()
    res.json(updated)
})

app.put("/update/:index", async (req, res) => {
    if (!req.user) return res.status(401).json({ error: "Not logged in" });

    const idx = parseInt(req.params.index, 10)
    const docs = await collection.find({ githubId: req.user.id }).toArray()

    if (isNaN(idx) || idx < 0 || idx >= docs.length) {
        return res.status(404).json({ error: "Invalid index" })
    }

    const idToUpdate = docs[idx]._id

    const result = await collection.updateOne(
        { _id: new ObjectId( idToUpdate ), githubId: req.user.id },
        { $set: req.body },
    )

    res.json( result )
})

app.use((req, res) => {
  res.status(404).send("404 Error: File Not Found")
})

app.listen(process.env.PORT || 3000)