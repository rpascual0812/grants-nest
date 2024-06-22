export const getParsedPk = (pk?: any) => {
    return typeof pk === 'string' || !pk ? undefined : pk;
};
