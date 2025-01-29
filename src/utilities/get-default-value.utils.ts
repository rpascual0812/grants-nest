export const getDefaultValue = <T>(newValue?: T, defaultValue?: T) => {
    if (typeof newValue === 'boolean') {
        return newValue;
    }

    if (typeof newValue === 'number' && newValue === 0) {
        return newValue;
    }

    return newValue === undefined || newValue === null ? defaultValue : newValue;
};
