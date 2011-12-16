// This holds shared elements used by more than one view. especially interesting 
// if you use includes in the serverside templates (eg. in add and edit forms).

(function(myApp) {

    var mod = extend(myApp, 'myApp.views.shared.helpers.formHelpers')    
      , formHelpers = {};
      
    formHelpers.Select = {
        
        // addes the elements of the array to the passed in select
        fill: function(ele, arr) {   
            for(i=0, len=arr.length; i<len; i++) {
                ele.append(
                    $('<option></option>').val(arr[i]).html(arr[i])
                );
            }        
        },
        
        selectValue: function(ele, val) {
            var selector = "option[value='" + val + "']";
            ele.find(selector).attr('selected', true);
        }
    }
    
    formHelpers.Input = {
        
        validateNotEmpty: function(ele) {
            if (ele.val() === '') {
                ele.addClass('error');
            } else {
                ele.removeClass('error');
            }
        }
    }

    // finally extend the namespace with the helper
    $.extend(mod, formHelpers);
    
})(myApp);