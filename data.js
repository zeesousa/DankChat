var Waterline = require('waterline');
var sailsMemoryAdapter = require('sails-memory');
var postgresAdapter = require('sails-postgresql');
var waterline = new Waterline();
var exports = module.exports = {};

var DB_URL = process.env.DB_URL;
var config;

if (DB_URL) {
  console.log("DB URL detected, running using POSTGRESQL");
  config = {
    adapters: {
      'postgresql': postgresAdapter
    },
    defaults: {
      migrate: 'safe'
    },
    connections: {
      default: {
        adapter: 'postgresql',
        url: DB_URL,
        ssl: true
      }
    }
  };
} else {
  console.log("No DB URL env variable detected, running on memory");
  config = {
    adapters: {
      'memory': sailsMemoryAdapter
    },
    connections: {
      default: {
        adapter: 'memory'
      }
    }
  };
}

var userCollection = Waterline.Collection.extend({
  schema: 'true',
  identity: 'user_acc',
  connection: 'default',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    username: {
      type: 'string',
      unique: true,
      required: true
    },
    password: {
      type: 'string',
      required: true
    },

    messages: {
      collection: 'message',
      via: 'user_acc'
    }
  }
});

var messageCollection = Waterline.Collection.extend({
  schema: 'true',
  identity: 'message',
  connection: 'default',
  attributes: {
    id: {
      type: 'integer',
      autoIncrement: true,
      primaryKey: true,
      unique: true
    },
    message: 'string',
    // Add a reference to User
    user_acc: {
      model: 'user_acc'
    }
  }
});

waterline.loadCollection(userCollection);
waterline.loadCollection(messageCollection);


waterline.initialize(config, function(err, ontology) {
  if (err) {
    return console.error(err);
  }

  console.log("DB Connection INIT");

  var User = ontology.collections.user_acc;
  var Message = ontology.collections.message;

  exports.newUser = function(username, password, callback) {
    User.create({
      username: username,
      password: password
    }).then(function(user) {
      typeof callback === 'function' && callback(user);
    });
  };

  exports.getUser = function(username, callback) {
    User.findOne({
      username: username
    }).then(function(user) {
      typeof callback === 'function' && callback(user);
    });
  };

  exports.newMessage = function(username, message, callback) {
    User.findOne({
      username: username
    }).then(function(user) {
      return Message.create({
        message: message,
        user: user.id
      });
    }).then(function(message) {
      typeof callback === 'function' && callback(message);
    });
  }
});