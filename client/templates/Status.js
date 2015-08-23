
Template.statusTable.helpers({
    status: function () {
        return _Statuses.find({});
}
});

Template.statusTable.events({
    "click #addStatusId": function (event, template) {
        event.preventDefault();
        var name = template.find('.inputName').value;
        var color = template.find('.inputColor').value;
        addStatus(name, color)
    },
    "click .xmarks": function () {
      _Statuses.remove(this._id);
    }
});


var addStatus = function(name, color){
    _Statuses.insert({statusName : name, color : color});
};

Template.Status.rendered = function()
{
    $('.demo1').colorpicker();
    $('.demo2').colorpicker();
}
