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

function saveLastTicketTime (techinfo){
  return techinfo.timesincelast
};

function getLastTicketTime (techinfo){
  return techinfo.timesincelastTicket
}

Template.techWorking.events({
  'click .plus-one': function plusOne() {
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        timesincelastTicket: saveLastTicketTime(this),
        timesincelast: new Date()
      },
      $inc: {
        totaltickets: 1,
        weight: 1
      }
    });
  },
  'click .minus-one': function minusOne() {
    if (this.totaltickets == 0) {
      return {}
    };
    _Techs.update({
      _id: this._id
    }, {
      $set: {
        timesincelast: getLastTicketTime(this)
      },
      $inc: {
        totaltickets: -1,
        weight: -1
      }
    });
  }
});

function OOTQ(techthis) {
  _Techs.update({
    _id: techthis._id
  }, {
    $inc: {
      weight: 1000
    }
  })
};

function OOTO(slectedstatus, techthis) {
  if (slectedstatus == "Working") {
    Meteor.call('removeLunch', techthis);
  } else if (slectedstatus == "Lunch") {
    _Techs.update({_id: techthis._id}, {$set: {timesincelast: new Date()}});
    Meteor.call('updateLunch', techthis);
  }
};

  Template.options.helpers({
    statuses: function() {
      return _Statuses.find();
    }
  });

  Template.options.events({
    'click li': function(evt, template) {
      // var slectedstatus = _Statuses.findOne({statusName: this.status});
      var techthis = _Techs.findOne({
        _id: this._id
      });
      var status = $(evt.target).text();
      var parent = Template.parentData(0);
      Meteor.call('updateStatus', parent._id, status);
      OOTO(status, parent);
    }
  });
