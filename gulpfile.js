var Gulp = require("gulp"),
  GulpReact = require("gulp-react"),
  GulpRename = require("gulp-rename"),
  GulpBrowserify = require("gulp-browserify"),
  GulpUglify = require("gulp-uglify"),
  GulpNotify = require("gulp-notify");


Gulp.task("jsx", function(cb){
  var stream = Gulp.src("./ui/**/*").
    pipe(GulpReact()).
    on("error", GulpNotify.onError(function(err){
      console.log(err);

      return "Reactification Failed!";
    })).
    pipe(GulpRename(function(path){
      path.extname = ".js";
    })).
    pipe(Gulp.dest("./ui-transformed"));

  stream.on("finish", function(){
    cb();
  });
});

Gulp.task("bundle", ["jsx"], function(){
  Gulp.src("./ui-transformed/index.js").
    pipe(GulpBrowserify()).
    pipe(GulpRename("bundle.js")).
    pipe(Gulp.dest("./public/js/")).
    pipe(GulpUglify()).
    on("error", function(err){
      console.log(err);
      this.end();
    }).
    pipe(GulpRename("bundle.min.js")).
    pipe(Gulp.dest("./public/js")).
    pipe(GulpNotify("Bundle Complete!"));
});

Gulp.task("watch", ["bundle"], function(){
  Gulp.watch("./ui/**/*", ["bundle"]);
});


Gulp.task("default", ["watch"]);
