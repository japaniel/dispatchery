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
        Accounts.createUser({
          email: email,
          password: password,
          profile: {
            Role: role
            // Email: email
          }
      });
      }
});

Template.Login.helpers({
  acheck: function acheck() {
    if (Meteor.user().profile.Role == "Admin") {
      return true
    }else {
      return false
    }
  }
});

Accounts.onLogin(function(){
  Router.go('techsWorking')
})
