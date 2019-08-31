/**
 * This script is for sorting the tables
 * @param n the number of the collumn, starting with 0 as the first collumn
 * @param kind is the kind of comparing the sorter is going to take
 */
function sortTable(n,kind="default") {
    var maand = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    var maand_klein = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Oktober", "November", "December"];
    var month_small = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "oktober", "november", "december"];
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
                        var dayY = (y.innerHTML.slice(1,2)===" ")?parseInt(y.innerHTML.slice(0,1)):parseInt(y.innerHTML.slice(0,2));
                        var dayX = (x.innerHTML.slice(1,2)===" ")?parseInt(x.innerHTML.slice(0,1)):parseInt(x.innerHTML.slice(0,2));
                        var monthX = (dayX.toString().length===1)?x.innerHTML.slice(2,x.innerHTML.length-5):x.innerHTML.slice(3,x.innerHTML.length-5);
                        var mX,mY;
                        var monthY = (dayY.toString().length===1)?y.innerHTML.slice(2,y.innerHTML.length-5):y.innerHTML.slice(3,y.innerHTML.length-5);
                        for(var j=0; i < (maand_klein.length-1);j++){
                            if(monthX.toLowerCase()===maand_klein[j]){
                                mX=j+1;
                            }
                            if(monthY.toLowerCase()===maand_klein[j]){
                                mY=j+1;
                            }
                        }
                        x= new Object({
                            year:parseInt(x.innerHTML.slice(x.innerHTML.length-4)),
                            month:mX,
                            day:dayX
                        });
                        y = new Object({
                            year:parseInt(y.innerHTML.slice(y.innerHTML.length-4)),
                            month:mY,
                            day:dayY
                        });
                        if(x.year===y.year){
                            if(x.month===y.month){
                                if(x.day>y.day){
                                  shouldSwitch = true;
                                  break;
                                }
                            }else if(x.month > x.month){
                                shouldSwitch = true;
                                break;
                            }
                        }else if(x.year > y.year){
                            shouldSwitch= true;
                            break;
                        }
                        break;
                    case "facturen":
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
                    default:
                        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                            shouldSwitch= true;
                            break;
                        }
                        break;
                }
            } else if (dir == "desc") {
                switch(kind.toLowerCase()){
                    case "date":
                        var dayY = (y.innerHTML.slice(1,2)===" ")?parseInt(y.innerHTML.slice(0,1)):parseInt(y.innerHTML.slice(0,2));
                        var dayX = (x.innerHTML.slice(1,2)===" ")?parseInt(x.innerHTML.slice(0,1)):parseInt(x.innerHTML.slice(0,2));
                        var monthX = (dayX.toString().length===1)?x.innerHTML.slice(2,x.innerHTML.length-5):x.innerHTML.slice(3,x.innerHTML.length-5);
                        var mX,mY;
                        var monthY = (dayY.toString().length===1)?y.innerHTML.slice(2,y.innerHTML.length-5):y.innerHTML.slice(3,y.innerHTML.length-5);
                        for(var j=0; i < (maand_klein.length-1);j++){
                            if(monthX.toLowerCase()===maand_klein[j]){
                                mX=j+1;
                            }
                            if(monthY.toLowerCase()===maand_klein[j]){
                                mY=j+1;
                            }
                        }
                        x= new Object({
                            year:parseInt(x.innerHTML.slice(x.innerHTML.length-4)),
                            month:mX,
                            day:dayX
                        });
                        y = new Object({
                            year:parseInt(y.innerHTML.slice(y.innerHTML.length-4)),
                            month:mY,
                            day:dayY
                        });
                        if(x.year===y.year){
                            if(x.month===y.month){
                                if(x.day<y.day){
                                    shouldSwitch = true;
                                    break;
                                }
                            }else if(x.month < x.month){
                                shouldSwitch = true;
                                break;
                            }
                        }else if(x.year < y.year){
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
                    default:
                        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                            shouldSwitch= true;
                            break;
                        }
                        break;
                }
            }
        }
        if (shouldSwitch) {
            /*If a switch has been marked, make the switch
            and mark that a switch has been done:*/
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
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