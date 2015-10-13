var _users = Meteor.users;

Template.Login.events({
    "click .loginbutton":  function(event, template){
        event.preventDefault();
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.loginWithPassword(email, password);
      },
      "click .createUser": function(event, template){
        var role = document.getElementsByName("role")[0].value;
        var email = $('[name=email]').val();
        var password = $('[name=password]').val();
        Meteor.call('makeUser', email, password, role)
        document.getElementById("email").value = "";
        document.getElementById("pass").value = "";
      }
});

Template.Login.helpers({
moveLoggedIn: function moveLoggedIn(){
  if (Meteor.user()._id == null) {
    Router.go('/')
  }else {
  Router.go('techsWorking')
}}
});

Template.users.helpers({
  users: function users(){
    return _users.find({},
    {sort: {
      profile.Role: 1
    }})
  }
})
