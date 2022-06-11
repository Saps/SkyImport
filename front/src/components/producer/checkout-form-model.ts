export const checkoutFormModel = {
    firstName: {
        name: 'firstName',
        label: 'First name*',
        requiredErrorMsg: 'First name is required'
    },
    lastName: {
        name: 'lastName',
        label: 'Last name*',
        requiredErrorMsg: 'Last name is required'
    },
    address1: {
        name: 'address1',
        label: 'Address Line 1*',
        requiredErrorMsg: 'Address Line 1 is required'
    },
    zipcode: {
        name: 'zipcode',
        label: 'Zipcode*',
        requiredErrorMsg: 'Zipcode is required',
        invalidErrorMsg: 'Zipcode is not valid (e.g. 70000)'
    },
    useAddressForPaymentDetails: {
        name: 'useAddressForPaymentDetails',
        label: 'Use this address for payment details'
    },
    nameOnCard: {
        name: 'nameOnCard',
        label: 'Name on card*',
        requiredErrorMsg: 'Name on card is required'
    },
    cardNumber: {
        name: 'cardNumber',
        label: 'Card number*',
        requiredErrorMsg: 'Card number is required',
        invalidErrorMsg: 'Card number is not valid (e.g. 4111111111111)'
    },
    cvv: {
        name: 'cvv',
        label: 'CVV*',
        requiredErrorMsg: 'CVV is required',
        invalidErrorMsg: 'CVV is invalid (e.g. 357)'
    }
};
