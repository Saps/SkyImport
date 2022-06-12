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
        invalidErrorMsg: 'Неправильный ИНН (10–12 цифровых символов)',
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
    },
    fileInfo: {
        name: 'fileInfo',
        label: 'Данные в формате CSV, XSL или XLSX*',
        requiredErrorMsg: 'Загрузите файл в формате CSV, XSL или XLSX',
    }
};
