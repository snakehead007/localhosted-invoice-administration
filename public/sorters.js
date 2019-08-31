/**
 * This script is for sorting the tables
 * @param n the number of the collumn, starting with 0 as the first collumn
 * @param kind is the kind of comparing the sorter is going to take
 */



// TODO: break problems, only breaks the switch, needs to break the whole for loop and redo everything when found something to switch. currenlty not working.
function sortTable(n,kind="default") {
    //parameter 'n':
    //0 => first row
    //1 => second row
    //...
    //parameter 'kind': (this parameter isnt captials
    //"DATE" : sorts on date (dd fullmonth yyyy)
    //"FACTUREN" ; tailored to the program
    //"KOST": tailored to the program
    //numbers and string will be sorted by default, by using the function only with the 'n' parameter (example: sortTable(0) )
    var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    table = document.getElementById("hoofdTabel");
    switching = true;
    //Set the sorting direction to ascending:
    dir = "asc";
    /*Make a loop that will continue until
    no switching has been done:*/
    console.log("!!!"+dir);
    while (switching) {
        //start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /*Loop through all table rows (except the
        first, which contains table headers):*/
        for (i = 1; i < (rows.length - 1); i++) {
            //start by saying there should be no switching:
            shouldSwitch = false;
            /*Get the two elements you want to compare,
            one from current row and one from the next:*/
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];
            /*check if the two rows should switch place,
            based on the direction, asc or desc:*/
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
                        //If this includes "offerte" and the next is a normal factuur, then switch
                        if(x.innerHTML.includes("Offerte")&& (!(y.innerHTML.includes("Offerte")) || !(y.innerHTML.includes("Creditnota"))  )){
                            shouldSwitch = true;
                            break;
                        //if this includes "Creditnota" and the next is a normal factuur, then switch
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
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            console.log(switchcount);
            //Each time a switch is done, increase this count by 1:
            switchcount ++;
        } else {
            /*If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again.*/
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}

/**
 *  This will change a string in format dd month yyyy (example 10 july 1999) into an Object {month,year,day} as numbers.
 *  This are the languages checks: English > Dutch > ... (rest will be added later)
 */
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