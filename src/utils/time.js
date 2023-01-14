export const time = (t) => {
    const d = new Date(t);
    let months = d.getMonth() + 1;
    switch (months) {
        case 1:
            months = "Jan";
            break;
        case 2:
            months = "Feb";
            break;
        case 3:
            months = "Mar";
            break;
        case 4:
            months = "Apr";
            break;
        case 5:
            months = "May";
            break;
        case 6:
            months = "Jun";
            break;
        case 7:
            months = "Jul";
            break;
        case 8:
            months = "Aug";
            break;
        case 9:
            months = "Sep";
            break;
        case 10:
            months = "Oct";
            break;
        case 11:
            months = "Nov";
            break;
        case 12:
            months = "Dec";
            break;
    }
    let datestring = ("0" + d.getDate()).slice(-2) + "/" + months;
    if (d.getFullYear() !== new Date().getFullYear()) {
        datestring = datestring + "/" + d.getFullYear();
    }
    datestring = datestring + " " + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);
    return datestring;
}