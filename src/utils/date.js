module.exports.maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
module.exports.maand_klein = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
module.exports.month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
module.exports.month_small = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "oktober", "november", "december"];
module.exports.year = new Date().getFullYear();
module.exports.getCurrentTime =(d) => {
    let str ="";
    if(d.getHours().toString().length==1){
        str+="0"+d.getHours();
    }else{
        str+=d.getHours();
    }
    if(d.getMinutes().toString().length==1){
        str+=":0"+d.getMinutes();
    }else{
        str+=":"+d.getMinutes();
    }
    return str;
};
module.exports.getCurrentTime = (time) => {
    let str ="";
    let d=time;
    if(d.getHours().toString().length==1){
        str+="0"+d.getHours();
    }else{
        str+=d.getHours();
    }
    if(d.getMinutes().toString().length==1){
        str+=":0"+d.getMinutes();
    }else{
        str+=":"+d.getMinutes();
    }
    return str;
};
/**
 *
 * */
module.exports.hoursMinutesToHoursFloat = (m,h) => {
    return Number(h)+(Number(m)/60.0);
};

module.exports.hoursFloatToHoursMinutes = (time) => {
    let hours = Math.trunc(time);
    let minutes = Math.trunc((time%1.0)*100);
    let sHours = "";
    let sMinutes = "";
    if(hours.toString().length ===1){
        sHours = "0"+hours+"u";
    }else if(hours.toString().length === 0){
        sHours = "00u";
    }else if(hours.toString().length > 1){
        sHours = hours+"u";
    }
    if(minutes.toString().length ===1){
        sMinutes = "0"+minutes+"m";
    }else if(minutes.toString().length === 0){
        sMinutes = "00m";
    }else if(minutes.toString().length === 2){
        sMinutes = minutes+"m";
    }
    return sHours+sMinutes;
};

module.exports.hourMinToString = (h,m) => {
    let hours = Math.trunc(h);
    let minutes = Math.trunc(m);
    let sHours = "";
    let sMinutes = "";
    if(hours.toString().length ===1){
        sHours = "0"+hours+"u";
    }else if(hours.toString().length === 0){
        sHours = "00u";
    }else if(hours.toString().length > 1){
        sHours = hours+"u";
    }
    if(minutes.toString().length ===1){
        sMinutes = "0"+minutes+"m";
    }else if(minutes.toString().length === 0){
        sMinutes = "00m";
    }else if(minutes.toString().length === 2){
        sMinutes = minutes+"m";
    }
    return sHours+sMinutes;
};

module.exports.formatDate = (date,lang) => {
    let monthNames;
    if(lang==="nl"){
        monthNames = maand_klein;
    }else if(lang==="eng"){
        monthNames = month_small;
    }
    let day = date.getDate();
    let monthIndex = date.getMonth();
    let year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year+"\n"+getCurrentTime(date);
};
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
        if (n.getFullYear()==e.getFullYear() && n.getMonth() == e.getMonth() && n.getDate() == e.getDate()) {
            isRunning = false;
        }else{
            day++;
            n.setDate(day);
            console.log("CHANGE OF MONTHS "+month+" / "+ n.getMonth());
            if(n.getMonth() != month){
                console.log("day "+day);
                month = n.getMonth();
                day = 1;
            }
            TIMEOUT_COUNT++;
        }
        if(TIMEOUT_COUNT === 1000){
            console.error("Error: timeout, project time exceeded 1000 days");
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
    }else{
        return date.getDate() + " " + month[date.getMonth()] + " " + date.getFullYear().toString();
    }
};