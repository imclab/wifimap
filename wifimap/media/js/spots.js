var SpotManager = { 
    init: function () {
        this.listSpots();
        $('#add-spot').unbind('click').click(function(){
            SpotManager.showForm();
            return false;
        });
    },
    bindFormSubmit: function() {
        $('#submit-spot').unbind('click').click(function() {
            SpotManager.submitForm();
            return false;
        });
    },
    showForm: function () {
        $.ajax({
            url: '/spots/add/',
            method: 'GET',
            dataType: 'html',
            success: function(response){
                $('#content').html(response);
            }
        });
    },
    submitForm: function () {
        $('#add-spot-form').ajaxSubmit({
            success: function(response) { SpotManager.formSubmitted(response) }
        });
    },
    formSubmitted: function(response) {
        $('#content').html(response);
    },
    listSpots: function() {
        $.ajax({
            url: '/spots/search/',
            method: 'GET',
            dataType: 'json',
            success: function(data){
                this.center_point = data.center_point;
                $('#content').html(data.template);
            }
        });   
    }
    
};