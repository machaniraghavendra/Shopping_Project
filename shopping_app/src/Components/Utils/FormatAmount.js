import React from 'react';

function FormatAmount(amount) {
    return (
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
    );
}

export default FormatAmount;