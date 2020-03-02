( function( factory ) {
    if ( typeof define === "function" && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [ "." ], factory );
    } else {

        // Browser globals
        factory( jQuery.datepicker );
    }
}( function( datepicker ) {

    datepicker.regional.nl = {
        closeText: "Sluiten",
        prevText: "Vorige",
        nextText: "Volgende",
        currentText: "Vandaag",
        monthNames: [ "januari", "februari", "maart", "april", "mei", "juni",
            "juli", "augustus", "september", "oktober", "november", "december" ],
        monthNamesShort: [ "jan.", "feb.", "maart", "apr.", "mei", "juni",
            "juli", "aug", "sept.", "okt.", "nov.", "dec." ],
        dayNames: ["zondag","maandag", "dinsdag", "woensdag", "donderdag", "vrijdag", "zaterdag"],
        dayNamesShort: [ "zo.", "ma.", "di.", "woe.", "do.", "vrij.", "za." ],
        dayNamesMin: [ "Z","M","D","W","D","V","Z" ],
        weekHeader: "Sem.",
        dateFormat: "dd/mm/yy",
        firstDay: 1,
        isRTL: false,
        showMonthAfterYear: false,
        yearSuffix: "" };
    datepicker.setDefaults( datepicker.regional.nl );

    return datepicker.regional.nl;

} ) );
