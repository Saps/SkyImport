export const formModel = {
    producerName: {
        name: 'name',
        label: 'Название производителя*',
        requiredErrorMsg: 'Введите название производителя',
    },
    inn: {
        name: 'inn',
        label: 'ИНН*',
        requiredErrorMsg: 'Введите ИНН',
        invalidErrorMsg: 'Неправильный ИНН (пример: 4816523659687452)',
    },
    region: {
        name: 'region',
        label: 'Address Line 1*',
        requiredErrorMsg: 'Address Line 1 is required',
    },
    commodityGroup: {
        name: 'commodityGroup',
        label: 'Товарная группа*',
        requiredErrorMsg: 'Введите товарную группу',
    },
    site: {
        name: 'site',
        label: 'Ссылка на сайт',
    },
    nameOnCard: {
        name: 'nameOnCard',
        label: 'Name on card*',
        requiredErrorMsg: 'Name on card is required',
    },
    cardNumber: {
        name: 'cardNumber',
        label: 'Card number*',
        requiredErrorMsg: 'Card number is required',
        invalidErrorMsg: 'Card number is not valid (e.g. 4111111111111)',
    },
    cvv: {
        name: 'cvv',
        label: 'CVV*',
        requiredErrorMsg: 'CVV is required',
        invalidErrorMsg: 'CVV is invalid (e.g. 357)',
    }
};
