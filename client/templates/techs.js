Meteor.subscribe("techs");

Template.techs.helpers({
  techs: function () {
    return Techs.find();
  }
});

Template.techs.events({
});
