//tech working
Template.techsWorking.helpers({
  techsWorking: function() {
    return _Techs.find({
      queue: true
    }, {
      sort: {
        weight: 1
      }
    });
  }
});

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
        totaltickets: 1,
        weight: 1
      }
    });
    console.log(this.weight);
  }
});

function OOTQ(techthis){
    _Techs.update({_id: techthis._id}, {$inc: {weight: 1000}})
  };

  function OOTO(slectedstatus, techthis) {
    if(slectedstatus) == "OOTO"){
    OOTQ(this);
  }
  else if (_Statuses.findOne({
      statusName: this.status
    }) == "Lunch") {
    OOTQ(this);
  }
};

Template.options.helpers({
  statuses: function() {
    return _Statuses.find();
  }
});

Template.options.events({
  'click li': function(evt, template) {
    var slectedstatus = _Statuses.findOne({statusName: this.status});
    var techthis = _Techs.findOne({this});
    var status = $(evt.target).text();
    var parent = Template.parentData(0);
    Meteor.call('updateStatus', parent._id, status);
    OOTO(slectedstatus, techthis);
  }
});
