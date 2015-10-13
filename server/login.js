Meteor.methods({
  makeUser: function makeUser(email, password, role){
    Accounts.createUser({
        email: email,
        password: password,
        profile: {
          Role: role,
          Email: email
        }
    });
  },
  allUsers: function allUsers() {
    var ausers = Meteor.users;
  Meteor.publish("userList", function() {
   return ausers.find({}, {sort: {Role: 1}});
 })
 }
});
