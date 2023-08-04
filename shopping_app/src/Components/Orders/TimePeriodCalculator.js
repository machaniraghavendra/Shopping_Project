export default function timePeriodCalculator(date) {
    if (date) {
        let returnStatement = "";
        let currentDate = new Date();
        let setGivenDate = new Date();
        let needTosetDate = date.substr(0, 1).includes("0") ? date.substr(1, 1) : date.substr(0, 2);
        let needTosetMonth = Number(date.substr(3, 2).trim()) - 1;
        let needTosetYear = date.substr(6).trim();
        setGivenDate.setDate(needTosetDate);
        setGivenDate.setMonth(needTosetMonth);
        setGivenDate.setFullYear(needTosetYear);

        if (currentDate.getFullYear() - setGivenDate.getFullYear() > 0) {
            returnStatement = currentDate.getFullYear() - setGivenDate.getFullYear() + " year(s) ago";
        } else {
            switch (currentDate.getMonth() - setGivenDate.getMonth()) {
                case 0:
                    if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 0) {
                        returnStatement = "Today"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 1) {
                        returnStatement = "Yesterday"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 2) {
                        returnStatement = "2 days ago"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 3) {
                        returnStatement = "3 days ago"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 4) {
                        returnStatement = "4 days ago"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 5) {
                        returnStatement = "5 days ago"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) === 6) {
                        returnStatement = "6 days ago"
                    } else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) > 6 && Math.abs(currentDate.getDate() - setGivenDate.getDate()) < 14) {
                        returnStatement = "1 week ago"
                    }
                    else if (Math.abs(currentDate.getDate() - setGivenDate.getDate()) < 21) {
                        returnStatement = "2 weeks ago"
                    } else {
                        returnStatement = "below one month"
                    }
                    break;
                case 1:
                    returnStatement = "1 month ago";
                    break;
                case 2:
                    returnStatement = "2 months ago";
                    break;
                case 3:
                    returnStatement = "3 months ago";
                    break;
                case 4:
                    returnStatement = "4 months ago";
                    break;
                case 4:
                    returnStatement = "4 months ago";
                    break;
                case 5:
                    returnStatement = "5 months ago";
                    break;
                case 6:
                    returnStatement = "6 months ago";
                    break;
                case 7:
                    returnStatement = "7 months ago";
                    break;
                case 8:
                    returnStatement = "8 months ago";
                    break;
                case 9:
                    returnStatement = "9 months ago";
                    break;
                case 10:
                    returnStatement = "10 months ago";
                    break;
                case 11:
                    returnStatement = "11 months ago";
                    break;
                case 12:
                    returnStatement = "12 months ago";
                    break;
                default:
                    returnStatement = "1 year ago";
                    break;
            }
        }
        return returnStatement;
    }
}