Statuses = new Mongo.Collection('statuses');

Meteor.methods({
  updateStatus: function(tech, status) {
    Statuses.update(tech._id, {"status": status});
  }
});
