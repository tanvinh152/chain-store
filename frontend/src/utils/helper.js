const formatCurrency = (number) => {
    return number.toLocaleString('vi-VI', { style: 'currency', currency: 'VND' });
};
export { formatCurrency };
