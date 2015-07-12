
Session.setDefault('showChatModal', false);

//tech working
Template.techsWorking.helpers({
  techsWorking: function () {
    return _Queue.find({}, {sort : {timesincelast : 1}});
  },
  showChatModal : function() {
    return Session.get('showChatModal');
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
        if(Session.get('chat_loaded')){
            var temp = _Chat.findOne({owner : this._id}, {sort : {time : -1}});
            if(temp)
            {
                return temp.message;
            }

        }
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
    },
    'click .lastChatLine' : function(){

        Session.set('chatEmployId', this._id);
        Session.set('showChatModal', true);
    }


});

Template.techWorking.rendered = function(){
    jscolor.install();

};



//chat
Template.chat.helpers({
      chatMessage : function(){
        return _Chat.find
        ({
            owner : Session.get('chatEmployId')
        });
      }
});

Template.chat.events({
  'click .close' : function(){
    Session.set('showChatModal', false);
  },'click .save' : function(event, template) {

    addMessage(Session.get('chatEmployId'), template.find('input').value);
    template.find('input').Text = String.empty;
    $(".panel-body").animate({ scrollTop: $(".panel-body")[0].scrollHeight}, 0);
  }

});

Template.chat.rendered = function(){
    $(".panel-body").animate({ scrollTop: $(".panel-body")[0].scrollHeight}, 0);
}

var addMessage = function(id, message) {
  _Chat.insert({
        owner : id,
        message : message,
        time : new Date()
  })
};

//options

Template.options.helpers({
    statuses : function(){

        return _Statuses.find();
    }
});



Template.options.events ({
    'click li' : function(evt,template){
        var status = $(evt.target).text();
        var parent = Template.parentData(0);
        if(statuses === "Remove From Work")
        {
          _Queue.remove (this._id);
        }else
        {
            Meteor.call('updateStatus', parent._id, status);
        }
    }
});

var removeWorking = function(id){
    _Queue.remove( {_id : id})
    Meteor.call('updateWorking', id);
};
