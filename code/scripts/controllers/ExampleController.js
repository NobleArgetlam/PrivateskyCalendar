const { Controller } = WebCardinal.controllers;

export default class ExampleController extends Controller {
    constructor(...props) {
        super(...props);

        this.model = {
            name: "WebCardinal"
        }


        const opendsu = require("opendsu");

        const keyssispace = opendsu.loadApi("keyssi");


        const db = opendsu.loadApi("db");

        let storageSSI = keyssispace.parse("BBudGH6ySHG6GUHN8ogNrTWc9R4cpfjzWmqnViwH83w4oppnmwvdzw8w8cv5txGW6GPY9E7x24T5UhtvRetYrSuQK");

        let mydb = db.getWalletDB(storageSSI, "mydb");

        let self = this;

        mydb.writeKey("e1",JSON.stringify({1: 'Ziua de azi'}));

        setTimeout(function () {
            mydb.readKey("e1", function (err, r) {
                console.log("r is ", JSON.parse(r));
                self.data = JSON.parse(r);

                self.createCalendar(document.getElementById("calendar1"), 2012, 9, self.data);

            });
        }, 3000)


        setTimeout(function () {
            self.initListeners(mydb, self.data, self);
        }, 5000);
    }


    initListeners(mydb, data, self) {
        $("body").on('click', '.setEvent', function () {
            let evName = prompt("Event name");
            console.log("The value on click is", parseInt($(this)[0].innerText));
            let day = parseInt($(this)[0].innerText);

            if (evName === '-clear') {
                delete data[day];
            } else {
                data[day] = evName;
            }

            mydb.writeKey("e1", JSON.stringify(data));

            setTimeout(function (){
                self.createCalendar(calendar, 2021, 6, self.data);
            }, 2000);

        });
    }


    createCalendar(elem, year, month, data) {

        let mon = month - 1; // months in JS are 0..11, not 1..12
        let d = new Date(year, mon);

        let table = '<table id="calendar">' +
            '<caption>June 2021</caption>' +
            '<tr class="weekdays">' +
                '<th scope="col">Sunday</th>'+
                '<th scope="col">Monday</th>' +
                '<th scope="col">Tuesday</th>' +
                '<th scope="col">Wednesday</th>' +
                '<th scope="col">Thursday</th>' +
                '<th scope="col">Friday</th>' +
                '<th scope="col">Saturday</th>' +
            '</tr><tr class="days">';

        // spaces for the first row
        // from Monday till the first day of the month
        // * * * 1  2  3  4
        for (let i = 0; i < this.getDay(d); i++) {
            table += '<td></td>';
        }

        // <td> with actual dates
        while (d.getMonth() == mon) {

            if (data[d.getDate()] !== undefined) {
                table += '<td class="day"><div class="setEvent date">' + d.getDate() + '</div><br/><div class="event"><div class="event-desc">'
                    + data[d.getDate()] + '</div></div></td>';
                console.log(data);
                console.log(data[d.getDate()], d.getDate());
            } else {
                table += '<td><div class="setEvent date">' + d.getDate() + '</div></td>';

            }


            if (this.getDay(d) % 7 == 6) { // sunday, last day of week - newline
                table += '</tr><tr class="days">';
            }

            d.setDate(d.getDate() + 1);
        }

        // add spaces after last days of month for the last row
        // 29 30 31 * * * *
        if (this.getDay(d) != 0) {
            for (let i = this.getDay(d); i < 7; i++) {
                table += '<td></td>';
            }
        }

        // close the table
        table += '</tr></table>';

        elem.innerHTML = table;
    }

    getDay(date) { // get day number from 0 (monday) to 6 (sunday)
        let day = date.getDay();
        if (day == 0) day = 7; // make Sunday (0) the last day
        return day - 1;
    }
}
