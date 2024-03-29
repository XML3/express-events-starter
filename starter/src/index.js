import express from "express";
import categoriesRouter from "../routes/categories.js";
import eventsRouter from "../routes/events.js";
import usersRouter from "../routes/users.js";
import loginRouter from "../routes/login.js";
import errorHandler from "../src/middleware/errorHandler.js";
import log from "../src/middleware/logMiddleware.js";
import contactRouter from "../routes/contact.js";
import articlesRouter from "../routes/articles.js";
import imgAnimationRouter from "../routes/imgAnimation.js";
import * as Sentry from "@sentry/node";
import "dotenv/config";

const app = express();

//Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Sentry.Integrations.Express({ app }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0,
});

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

//Global middleware
app.use(express.json());
app.use(log);

//Routes
app.use("/categories", categoriesRouter);
app.use("/events", eventsRouter);
app.use("/users", usersRouter);
app.use("/contact", contactRouter);
app.use("/articles", articlesRouter);
app.use("/imgAnimation", imgAnimationRouter);
//Login
app.use("/login", loginRouter);

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
