Meteor.publish('techs', function() {
  return Techs.find();
});

Meteor.publish('statuses', function () {
  return Statuses.find();
});
