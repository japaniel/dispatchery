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
  }
});
