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
  },
  updateTechs: function(name, startT, endT, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, shift, managerT) {
    _Techs.insert({
      name: name,
      StartTime: startT,
      WorkQueueEnter: 0,
      EndTime: endT,
      WorkQueueExit: 0,
      Monday: Monday,
      Tuesday: Tuesday,
      Wednesday: Wednesday,
      Thursday: Thursday,
      Friday: Friday,
      Saturday: Saturday,
      Sunday: Sunday,
      queue: false,
      prequeue: false,
      status: "Working",
      weight: TimeSync.serverTime(),
      Shift: shift,
      lunch: false,
      meeting: false,
      training: false,
      timesincelastTicket: 0,
      preQueueEnterTime: "00:00",
      preQueueExit: "00:00",
      manager: managerT
    });
});

Meteor.startup(function() {
});
