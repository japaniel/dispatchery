//tech working
Template.techsWorking.helpers({
  techsWorking: function() {
    return _Techs.find({
      queue: true
    }, {
      sort: {
        status: -1,
        timesincelast: 1
      }
    });
  }
});

// function sorting (){
//   _Techs.find({}).forEach(status);
//   function status(info){
//     if(info.status === "OOTO")
//   }
// }

var d = new Date();
var hours = d.getHours().toString().length == 1 ? '0' + d.getHours() : d.getHours();
var min = d.getMinutes().toString().length == 1 ? '0' + d.getMinutes() : d.getMinutes();
var newTime = hours + ':' + min;

Template.techsWorking.rendered = function() {};

Meteor.startup(function() {});

//techWorking
Template.techWorking.helpers({
  color: function() {
    if (Session.get('statuses_loaded')) {
      return _Statuses.findOne({
        statusName: this.status
      }).color;
    }
  }
});

Template.techWorking.events({
  'click .plus-one': function plusOne() {
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        timesincelast: new Date()
      },
      $inc: {
        totaltickets: 1
      }
    });
  }
});

Template.options.helpers({
  statuses: function() {
    return _Statuses.find();
  }

});

Template.options.events({
  'click li': function(evt, template) {
    var status = $(evt.target).text();
    var parent = Template.parentData(0);
    console.log("fun");
    Meteor.call('updateStatus', parent._id, status);
  }
});
