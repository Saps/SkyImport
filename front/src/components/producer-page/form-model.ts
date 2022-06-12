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
        invalidErrorMsg: 'Неправильный ИНН (10 или 12 цифровых символов)',
    },
    region: {
        name: 'region',
        label: 'Регион*',
        requiredErrorMsg: 'Укажите регион',
    },
    commodityGroup: {
        name: 'commodityGroup',
        label: 'Товарная группа*',
        requiredErrorMsg: 'Введите товарную группу',
    },
    site: {
        name: 'site',
        label: 'Ссылка на сайт',
        requiredErrorMsg: 'Укажите ссылку на сайт',
        invalidErrorMsg: 'Неправильный сайт (пример: https://yandex.ru)',
    },
    email: {
        name: 'email',
        label: 'Электронная почта*',
        requiredErrorMsg: 'Укажите электронную почту',
        invalidErrorMsg: 'Неправильная электронная почта (пример: correct-email@mail.com)',
    },
    telephone: {
        name: 'telephone',
        label: 'Телефон',
        invalidErrorMsg: 'Неправильный телефон (примеры: (495)1234567, +7(926)123-45-67)',
    },
    fileInfo: {
        name: 'fileInfo',
        label: 'Данные в формате CSV, XSL или XLSX',
    }
};
