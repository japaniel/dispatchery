Meteor.methods({
  updateStatus: function(tech, status) {
    _Statuses.update(tech._id, {
      "status": status
    });
  },
  addTask: function(text) {
    // Make sure the user is logged in before inserting a task
    _Tasks.insert({
      text: text,
      createdAt: new Date()
    });
  },
  deleteTask: function(taskId) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can delete it
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.remove(taskId);
  },
  setChecked: function(taskId, setChecked) {
    var task = _Tasks.findOne(taskId);
    if (task.private && task.owner !== Meteor.userId()) {
      // If the task is private, make sure only the owner can check it off
      throw new Meteor.Error("not-authorized");
    }

    _Tasks.update(taskId, {
      $set: {
        checked: setChecked
      }
    });
  },
  setPrivate: function(taskId, setToPrivate) {
    var task = _Tasks.findOne(taskId);

    // Make sure only the task owner can make a task private
    if (task.owner !== Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }
    _Tasks.update(taskId, {
      $set: {
        private: setToPrivate
      }
    });
  },
  removeChat: function(id) {
    _Chat.remove({
      owner: id
    });
  },
  updateStatus: function(id, status) {
    _Techs.update({
      _id: id
    }, {
      $set: {
        status: status
      }
    });
  }
});

Meteor.startup(function() {
//   var httpProxy = require('http-proxy');
//   httpProxy.createServer({
//   ssl: {
//     key: fs.readFileSync('serverkey.pem', 'utf8'),
//     cert: fs.readFileSync('servercrt.pem', 'utf8')
//   },
//   target: 'https://localhost:443',
//   secure: true // Depends on your needs, could be false.
// }).listen(3000);


    // SSLProxy({
    //    port: 443, //or 443 (normal port/requires sudo)
    //    ssl : {
    //         key: Assets.getText("serverkey.pem"),
    //         cert: Assets.getText("servercrt.pem")
    //
    //         //Optional CA
    //        //Assets.getText("ca.pem")
    //    }
    // });
});
