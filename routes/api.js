var Express = require("express"),
  router = Express.Router(),
  projectsRoutes = require("./projects");

router.use("/projects", projectsRoutes);

module.exports = router;
