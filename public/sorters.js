
//This funciton let
function sortTable(n,kind="default") {
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("hoofdTabel");
    switching = true;
    dir = "asc";
    console.log("!!!"+dir);
    while (switching) {
        switching = false;
        rows = table.rows;
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            if (dir == "asc") {
                switch(kind.toLowerCase()){
                    case "date":
                        xObj = toDateObject(x.innerHTML);
                        yObj = toDateObject(y.innerHTML);
                        console.log(xObj);
                        console.log(yObj);
                        if(xObj.year===yObj.year){
                            if(xObj.month===yObj.month){
                                if(x.day>yObj.day){
                                    console.log("switching because of day");
                                    console.log(xObj.day+"   |   "+yObj.day);
                                    shouldSwitch = true;
                                    break;
                                }
                            }else if(xObj.month > yObj.month){
                                console.log("switching because of month");
                                console.log(xObj.month+"   |   "+yObj.month);
                                shouldSwitch = true;
                                break;
                            }
                        }else if(xObj.year > yObj.year){
                            console.log("switching because of year");
                            console.log(xObj.year+"   |   "+yObj.year);
                            shouldSwitch= true;
                            break;
                        }
                    case "facturen":
                        if(x.innerHTML.includes("Offerte")&& (!(y.innerHTML.includes("Offerte")) || !(y.innerHTML.includes("Creditnota"))  )){
                            shouldSwitch = true;
                            break;
                        }else if(x.innerHTML.includes("Creditnota")&& (!(y.innerHTML.includes("Creditnota")) || (y.innerHTML.includes("Offerte")) )){
                            shouldSwitch = true;
                            break;
                        }else if(x.innerHTML.includes("Offerte") && (y.innerHTML.includes("Creditnota"))){
                            shouldSwitch = true;
                            break;
                        }
                        break;
                    case "kost":
                        if(y.innerHTML.includes("openstaand") && x.innerHTML.includes("betaald")){
                            shouldSwitch = true;
                            break;
                        }else if( y.innerHTML.includes("openstaand") && x.innerHTML.includes("/") ){
                            shouldSwitch = true;
                            break;
                        }else if( y.innerHTML.includes("betaald") && x.innerHTML.includes("/")){
                            shouldSwitch = true;
                            break;
                        }
                        break;
                    case "default":
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch= true;
                            break;
                        }
                        break;
                }
                break;
            } else if (dir == "desc") {
                switch(kind.toLowerCase()){
                    case "date":
                        xObj = toDateObject(x.innerHTML);
                        yObj = toDateObject(y.innerHTML);
                        console.log(xObj);
                        console.log(yObj);
                        if(xObj.year===yObj.year){
                            if(xObj.month===yObj.month){
                                if(xObj.day<yObj.day){
                                    console.log("switching because of day");
                                    console.log(xObj.day+"   |   "+yObj.day);
                                    shouldSwitch = true;
                                    break;
                                }
                            }else if(xObj.month < yObj.month){
                                console.log("switching because of month");
                                console.log(xObj.month+"   |   "+yObj.month);
                                shouldSwitch = true;
                                break;
                            }
                        }else if(xObj.year < yObj.year){
                            console.log("switching because of year");
                            console.log(xObj.year+"   |   "+yObj.year);
                            shouldSwitch= true;
                            break;
                        }
                        break;
                    case "facturen":
                        break;
                    case "kost":
                        if(x.innerHTML.includes("openstaand") && y.innerHTML.includes("betaald")){
                            shouldSwitch = true;
                            break;
                        }else if( x.innerHTML.includes("openstaand") && y.innerHTML.includes("/") ){
                            shouldSwitch = true;
                            break;
                        }else if( y.innerHTML.includes("betaald") && x.innerHTML.includes("/")){
                            shouldSwitch = true;
                            break;
                        }
                        break;
                    case "default":
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch= true;
                            break;
                        }
                        break;
                }
            }
        }
        console.log(shouldSwitch);
        if (shouldSwitch) {
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            console.log(switchcount);
            switchcount ++;
        } else {
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

function toDateObject(str) {
    var maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
    var dayX = (str.slice(1,2)===" ")?parseInt(str.slice(0,1)):parseInt(str.slice(0,2));
    var monthX = (dayX.toString().length===1)?str.slice(2,str.length-5):str.slice(3,str.length-5);
    var monthNumber;
    for(var j=0; j < (maand.length-1);j++){
        if(monthX.toUpperCase()===month[j].toUpperCase()){
            monthNumber=j+1;
        } else if(monthX.toUpperCase()===maand[j].toUpperCase()){
            monthNumber=j+1;
        }
    }
    return (new Object({
        year:parseInt(str.slice(str.length-4)),
        month:monthNumber,
        day:dayX
    }));
}