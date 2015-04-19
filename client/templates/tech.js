Template.tech.helpers({
});

Template.tech.events({
  'click .plus-one' : function plusOne () {
    return this.totalTickets += 1;
  }
});
