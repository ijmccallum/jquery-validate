(function($) {
    'use strict';
    // Regex validation rules
    var validate = {
        required: /./,
        name: /^[A-Za-z ,'-]{1,25}$/,
        email: /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/,
        zipcode: /^\d{5}(?:[-\s]\d{4})?$/,
        postalcode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
        telephone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
        password: /^[a-z0-9_-]{6,18}$/,
        url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
        date: /^([1-9]|0[1-9]|[12][0-9]|3[01])\D([1-9]|0[1-9]|1[012])\D(19[0-9][0-9]|20[0-9][0-9])$/, // dd mm yyyy, d/m/yyyy, etc.
        year: /^(19|20)[\d]{2,2}$/,
        number: /^[0-9]{1,45}$/,
        alphabet: /^[A-z]+$/,
        alphanumeric: /^[a-zA-Z0-9]*$/,
        ipaddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
        hexvalue: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
    };

    // Error messages after validation rules
    var errorMessage = {
        required: 'This field is required',
        name: 'A valid name is required',
        email: 'A valid email address is required',
        zipcode: 'A valid zip code is required',
        postalcode: 'A valid postal code is required',
        telephone: 'A valid telephone number is required',
        password: 'A valid password is required',
        url: 'A valid URL is required',
        date: 'A valid date is required',
        year: 'A valid year is required',
        number: 'Numbers only',
        alphabet: 'Alphabet characters only',
        alphanumeric: 'Alphanumeric characters only',
        ipaddress: 'A valid IP address is required',
        hexvalue: 'A valid HEX value is required'
    };

    var valid = new Array();
    var validationRules;

    // find all form elements on page
    $('input, select, textarea').each(function () {
        var attr = $(this).attr('data-validate');
        var fieldId = $(this).attr('id');

        if (typeof attr !== 'undefined' && attr !== false) {

            validationRules = $(this).data('validate').split(',');

            // wrap inputs and label in div field item
            $(this).prev('label').andSelf().wrapAll('<div class="field-item"/>');

            // check data attribute for validation rules
            for (var i = 0; i < validationRules.length; i++){
                // add error messages to markup
                var type = validationRules[i];
                type = type.replace(' ', '');

                var ariaError = fieldId + '-'+ type +'-error';
                //add aria described by
                $('#' + fieldId).attr('aria-describedby', ariaError);

                // add error message to field
                $('#' + fieldId).parent('.field-item').append('<span class="error-message ' + type +'" id="'+ ariaError +'" role="alert">'+ errorMessage[type] +'</span>');
            }
            
        }
    });

    // Validate form fields function
    function validation(value, id){

        // hide any errors already showing
        $('#' + id).parent('.field-item').find('.error-message').hide();
        $('#' + id).removeClass('error-border');

        // get validation rules from data attribute
        var attr = $('#' + id).attr('data-validate');
        if (typeof attr !== 'undefined' && attr !== false) {
            validationRules = $('#' + id).data('validate').split(',');

            // check data attribute for validation rules
            for (var i = 0; i < validationRules.length; i++){
                var type = validationRules[i];
                type = type.replace(' ', '');
                if(value === '' && type === 'required'){
                    // show required erorr
                    $('#' + id).parent('.field-item').find('.error-message.required').fadeIn();
                    $('#' + id).addClass('error-border');
                    valid.push('false');
                }else if(!validate[type].test($('#' + id).val()) && value != ''){
                    $('#' + id).parent('.field-item').find('.error-message.' + type).fadeIn();
                    $('#' + id).addClass('error-border');
                    valid.push('false');
                }else{
                    valid.push('true');
                }
            }
            
        }
    }

    // on blur validate fields
    $('input, select, textarea').on('blur', function(){

        // field value
        var value = $(this).val();
        var fieldId = $(this).attr('id');

        // pass value and field id to validation function
        validation(value, fieldId);

    });

    $('form').submit(function( event ) {
        //clear valid array
        valid = new Array();

        // prevent default form submit
        event.preventDefault();

        $('input, select, textarea').each(function () {
            var attr = $(this).attr('data-validate');
            var fieldId = $(this).attr('id');
            var value = $(this).val();

            if (typeof attr !== 'undefined' && attr !== false) {
                // pass field values and field ids to validation function
                validation(value, fieldId);
            }
        });
        if ($.inArray('false', valid) !== -1){
            // prevent default form submit
            event.preventDefault();
        }else{
            // unbind prevent default and submit form
            $(this).unbind('submit').submit();
        }
    });
    
}(jQuery));