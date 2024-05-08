import React from 'react';

function ConvertToNumber(formattedAmount) {
    var withoutCommas = formattedAmount.replace(/,/g, '');
    return (
        parseFloat(withoutCommas)
    );
}

export default ConvertToNumber;