Router.configure({
  layoutTemplate: 'layout'
});

Router.map(function () {
  this.route('techsWorking', {
    path: '/'
  });

  this.route('employees', {
    path: '/employees'
  });
  this.route('todos', {
    path: '/todos'
  });


  this.route('variables', {
    path: '/variables'
  });

});
