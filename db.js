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
  getProject: function(id){
    var sql = 'select id, name, description, createdby as "createdBy", createdon as "createdOn" from projects where id = $1;';

    var sqlArgs = [id];

    return executeQuery(sql, sqlArgs, function(results, done, deferred){
      deferred.resolve(results.rows[0]);

      done();
    });
  },
  getProjects: function(){
    var sql = 'select id, name, description, createdby as "createdBy", createdon as "createdOn" from projects;';

    return executeQuery(sql, function(results, done, deferred){
      deferred.resolve(results.rows);

      done();
    });
  },
  saveProject: function(project){
    var sql = "insert into projects(name, description, createdby, createdon) values($1, $2, $3, now()) returning id;";

    var sqlArgs = [project.name, project.description, project.createdBy];

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
