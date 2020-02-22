module.exports.maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
module.exports.maandKlein = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
module.exports.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
const monthSmall = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "oktober", "november", "december"];
const year = new Date().getFullYear();

module.exports.getRangeDates = (start,end) => {
    let s = new Date(Date.parse(start));
    let e = new Date(Date.parse(end));
    let n = new Date(s);
    let day = s.getDate();
    let month = s.getMonth();
    let dayRanges = [];
    let isRunning = true;
    let TIMEOUT_COUNT = 0;
    while(isRunning){
        dayRanges.push(n.toDateString().substring(4,n.toDateString().length-5));
        if (n.getFullYear()==e.getFullYear() && n.getMonth() === e.getMonth() && n.getDate() === e.getDate()) {
            isRunning = false;
        }
else{
            day++;
            n.setDate(day);
            if(n.getMonth() != month){
                month = n.getMonth();
                day = 1;
            }
            TIMEOUT_COUNT++;
        }
        if(TIMEOUT_COUNT === 1000){
            isRunning = false;
        }
    }
    return dayRanges;
};


module.exports.sameDay = (d1_, d2_) => {
    let d1 = new Date(d1_);
    let d2 = new Date(d2_);
    return     d1.getMonth() === d2.getMonth() &&
        d1.getDate() === d2.getDate();
};

module.exports.daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
};

module.exports.getDatum = (lang) =>{
    let date = new Date();
    if(lang==="nl"){
        return date.getDate() + " " + maand[date.getMonth()] + " " + date.getFullYear().toString();
    }
else{
        return date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear().toString();
    }
};

module.exports.parseDateDDMMYYYY = (dateString) =>{
    let arrayOfDate = dateString.split("/"); //0 DAY , 1 MONTH , 2 YEAR
    let date = new Date(Number(arrayOfDate[2]),Number(arrayOfDate[0])-1,Number(arrayOfDate[1]));
    return date;
};
module.exports.parseDateSwapDayMonth = (dateString) => {
    let arrayOfDate = dateString.split("/");
    return arrayOfDate[1]+"/"+arrayOfDate[0]+"/"+arrayOfDate[2];
};