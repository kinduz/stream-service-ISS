export const parseBoolean = (value: string | boolean): boolean => {
    if (typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        const stringValue = value.trim().toLowerCase();

        if (stringValue === 'true') {
            return true;
        }

        if (stringValue === 'false') {
            return false;
        }
    }

    throw new Error(`Не удалось преобразовать значение ${value} в логическое значение`)
}