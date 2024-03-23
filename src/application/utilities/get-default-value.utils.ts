export const getDefaultValue = <T>(newValue?: T, defaultValue?: T) => {
    if (typeof newValue === 'boolean') {
        return newValue;
    }

    return newValue ? newValue : defaultValue;
};
