Meteor.subscribe('working', function(){
   Session.set('working_loaded', true);
});
Meteor.subscribe('techs', function(){
   Session.set('techs_loaded', true);
});
Meteor.subscribe('chat', function(){
   Session.set('chat_loaded', true);
});
Meteor.subscribe('tasks', function(){
   Session.set('tasks_loaded', true);
});
Meteor.subscribe('statuses', function(){
   Session.set('statuses_loaded', true);
});