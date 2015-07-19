

//tech working
Template.techsWorking.helpers({
  techsWorking: function () {
    return _Queue.find({}, {sort : {timesincelast : 1}});
  }

});

Template.techsWorking.events({

});

Template.techsWorking.rendered = function(){


};

Meteor.startup(function () {

});


//techWorking
Template.techWorking.helpers({
    line : function()
    {
    },
    color : function(){
        if(Session.get('statuses_loaded')){
            return _Statuses.findOne({statusName : this.status}).color;
        }
}

});

Template.techWorking.events({
    'click .plus-one' : function plusOne () {
        _Queue.update(
            {_id : this._id},
            {
                $set : {timesincelast : new Date()},
                $inc : {totaltickets : 1}
            }
        );
    }
});

Template.techWorking.rendered = function(){
    jscolor.install();

};

Template.options.helpers({
    statuses : function(){

        return _Statuses.find();
    }
});



Template.options.events ({
    'click li' : function(evt,template){
        var status = $(evt.target).text();
        var parent = Template.parentData(0);
      Meteor.call('updateStatus', parent._id, status);
    }
});

var removeWorking = function(id){
    _Queue.remove( {_id : id})
    Meteor.call('updateWorking', id);
};
