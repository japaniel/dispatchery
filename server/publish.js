Meteor.publish('techs', function() {
  return _Techs.find({});
});
Meteor.publish('statuses', function () {
  return _Statuses.find({});
});

Meteor.publish('working', function () {
  return _Queue.find({});
});

Meteor.publish('tasks', function () {
  return _Tasks.find({});
});

Meteor.publish('chat', function () {
  return _Chat.find({});
});
