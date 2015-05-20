var Pg = require("pg"),
  Q = require("q"),
  Config = require("./config");

function executeQuery(sql, sqlArgs, cb){
  if(typeof sqlArgs === "function") {
    cb = sqlArgs;
  }

  var deferred = Q.defer();

  Pg.connect(Config.dbConnectionString, function(err, client, done){
    if(err){
      return deferred.reject(err);
    }

    client.query(sql, sqlArgs, function(err, results){
      if(err){
        deferred.reject(err);

        done();
      }
      else{
        cb(results, done, deferred);
      }
    });
  });

  return deferred.promise;
}

var Db = {
  getProjects: function(){
    var sql = "select id, name, description from projects;";

    return executeQuery(sql, function(results, done, deferred){
      deferred.resolve(results.rows);

      done();
    });
  },
  saveProject: function(project){
    var sql = "insert into projects(name, description) values($1, $2) returning id;";

    var sqlArgs = [project.name, project.description];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve(results.rows[0].id);

      done();
    });
  },
  authenticate: function(credentials){
    var sql = "select username from users where username = $1 and password = $2;";

    var sqlArgs = [credentials.username, credentials.password];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve(results.rows[0]);

      done();
    });
  },
  register: function(credentials){
    var sql = "insert into users(username, password) values($1, $2);";

    var sqlArgs = [credentials.username, credentials.password];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve();

      done();
    });
  }
};

module.exports = Db;
