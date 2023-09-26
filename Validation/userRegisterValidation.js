const Validator = require('validator');
const isEmpty = require('is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Converts empty fields to String in order to validate them
    data.image = !isEmpty(data.image) ? data.image : '';
    data.first_name = !isEmpty(data.first_name) ? data.first_name : '';
    data.last_name = !isEmpty(data.last_name) ? data.last_name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.phone_no = !isEmpty(data.phone_no) ? data.phone_no : '';
    data.country = !isEmpty(data.country) ? data.country : '';
    data.role = !isEmpty(data.role) ? data.role : '';
    data.date_of_birth = !isEmpty(data.date_of_birth) ? data.date_of_birth : '';
    data.address = !isEmpty(data.address) ? data.address : '';
    data.language = !isEmpty(data.language) ? data.language : '';

    if (Validator.isEmpty(data.image)) {
        errors.image = 'Image field is required';
    }

    if (Validator.isEmpty(data.first_name)) {
        errors.first_name = 'First name field is required';
    }

    if (Validator.isEmpty(data.last_name)) {
        errors.last_name = 'Last name field is required';
    }

    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    } else if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    } else if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
        errors.password = 'Password must be between 6 and 30 characters';
    }

    if (Validator.isEmpty(data.phone_no)) {
        errors.phone_no = 'Phone number field is required';
    }

    if (Validator.isEmpty(data.country)) {
        errors.country = 'Country field is required';
    }

    if (Validator.isEmpty(data.role)) {
        errors.role = 'Role field is required';
    }

    if (Validator.isEmpty(data.date_of_birth)) {
        errors.date_of_birth = 'Date of birth field is required';
    }

    if (Validator.isEmpty(data.address)) {
        errors.address = 'Address field is required';
    }

    if (Validator.isEmpty(data.language)) {
        errors.language = 'Language field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors),
    };
};
