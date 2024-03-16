export const getDefaultValue = <T>(newValue?: T, defaultValue?: T) => {
    return newValue ? newValue : defaultValue;
};
