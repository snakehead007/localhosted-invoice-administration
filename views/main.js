//- V1.6
c = [0, 0];
Pfirma = "#{profile.firma}";
Pnaam = "#{profile.naam}";
Pstraat = "#{profile.straat}";
PstraatNr = "#{profile.straatNr}";
Ppostcode = "#{profile.postcode}";
Pplaats = "#{profile.plaats}";
PbtwNr = "#{profile.btwNr}";
Piban = "#{profile.iban}";
Pbic = "#{profile.bic}";
firma = "#{contact.firma}";
contactPersoon = "#{contact.contactPersoon}";
straat = "#{contact.straat}";
straatNr = "#{contact.straatNr}";
postcode = "#{contact.postcode}";
plaats = "#{contact.plaats}";
btwNr = "#{contact.btwNr}";
factuurNr = "#{factuur.factuurNr}";
datum = "#{factuur.datum}";
voorschot = Number(#{
  factuur.voorschot
});
var doc = new jsPDF();
console.log(doc.getFontList());
doc.setFont(doc.getFontList()[0]);
doc.setProperties({
  title: 'MDSART factuur #{factuur.factuurNr}',
  subject: 'Factuur van MDSART',
  author: 'MDSART',
  keywords: 'MDSART ,factuur ,#{factuur.factuurNr}',
  creator: 'MDSART FactuurBeheer',
});
/**HEADER**/
doc.setFontType("bold");
doc.setFontSize(22);
doc.text(20, 35, Pfirma);
doc.setFontSize(36);
doc.setTextColor(194, 194, 194);
doc.text(140, 35, "Factuur");

/**bedrijfgegevens**/
doc.setTextColor(0, 0, 0);
doc.setFontSize(12);
doc.setFontType("courier");
c = [20, 50];
doc.text(c[0], c[1], Pnaam);

doc.setFontType("bold");
c[1] += 10;
doc.text(c[0], c[1], "Bedrijfgegevens");
doc.setFontType("courier");
c[1] += 5;
doc.text(c[0], c[1], Pnaam);
c[1] += 5;
doc.text(c[0], c[1], Pstraat + " " + PstraatNr);
c[1] += 5;
doc.text(c[0], c[1], "BTW nr: " + PbtwNr);

doc.setFontType("bold");
c[1] += 10;
doc.text(c[0], c[1], "Bankgegevens");
doc.setFontType("courier");
c[1] += 5;
doc.text(c[0], c[1], "IBAN: " + Piban);
c[1] += 5;
doc.text(c[0], c[1], "BIC: " + Pbic);

/**factuur info**/
doc.setFontType("bold");
c = [120, 60];
doc.text(c[0], c[1], "Datum:");
c[1] += 5;
doc.text(c[0], c[1], "FactuurNr:");
doc.setFontType("courier");
c[0] += 30;
c[1] -= 5;
doc.text(c[0], c[1], datum);
c[1] += 5;
doc.text(c[0], c[1], factuurNr);

/**factuur gegevens**/
c = [120, 75];
doc.setFontType("bold");
doc.text(c[0], c[1], "FactuurGegevens");
c[1] += 5;
doc.setFontType("courier");
if (firma) {
  doc.text(c[0], c[1], firma);
  c[1] += 5;
}
doc.text(c[0], c[1], contactPersoon);
c[1] += 5;
doc.text(c[0], c[1], straat + " " + straatNr);
c[1] += 5;
if (plaats) {
  if (postcode) {
    doc.text(c[0], c[1], postcode + " " + plaats);
  } else {
    doc.text(c[0], c[1], plaats);
  }
  c[1] += 5;
}
if (btwNr) {
  doc.text(c[0], c[1], "BTW nr: " + btwNr);

}
/**Beschrijvingen**/

var unusable_json_data = "#{bestellingen}";
var current = JSON.parse(unusable_json_data.replace(/(&quot\;)/g, "\""));
var bestellingen = [];
var aantal = Number(#{
  lengte
});
var totaalEx = 0;
var btw;
var totaalInc;
for (var i = 0; i <= aantal - 1; i++) {
  bestellingen.push([current[i].beschrijving, current[i].aantal, current[i].bedrag, current[i].totaal]);
}
for (var i = 0; i <= bestellingen.length - 1; i++) {
  console.log(bestellingen[i][3]);
  totaalEx += bestellingen[i][3];
}

var bestellingenPrint = [];
for (var i = 0; i <= aantal - 1; i++) {
  bestellingenPrint.push([current[i].beschrijving, current[i].aantal, current[i].bedrag.toFixed(2) + " €", current[i].totaal.toFixed(2) + " €"]);
}

doc.autoTable({
  theme: 'grid',
  columnStyles: {
    0: {
      fillColor: [255, 255, 255]
    },
    1: {
      fillColor: [255, 255, 255],
      halign: 'right'
    },
    2: {
      fillColor: [255, 255, 255],
      halign: 'right'
    },
    3: {
      fillColor: [255, 255, 255],
      halign: 'right'
    }
  },
  styles: {
    fillColor: [200, 200, 200]
  },
  startY: 110,
  head: [
    ['Beschrijving', 'Aantal', 'Bedrag', 'Totaal']
  ],
  body: bestellingenPrint
});
btw = Math.round((totaalEx - voorschot) * 0.21 * 100) / 100;
totaalExSub = totaalEx - voorschot;
totaalInc = totaalExSub + btw;
if (voorschot == 0) {

  doc.autoTable({
    theme: 'plain',
    startX: 200,
    columnStyles: {
      0: {
        fillColor: [255, 255, 255]
      },
      1: {
        fillColor: [255, 255, 255]
      },
      2: {
        fillColor: [255, 255, 255],
        halign: 'right'
      },
      3: {
        fillColor: [230, 230, 230],
        halign: 'right'
      }
    },
    styles: {
      fillColor: [200, 200, 200]
    },
    body: [
      [
        [""],
        ["                               "],
        ["subtotaal"],
        [totaalEx.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["btw 21%"],
        [btw.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["totaal"],
        [totaalInc.toFixed(2) + " €"]
      ]
    ]
  })
} else {
  doc.autoTable({
    theme: 'plain',
    startX: 200,
    columnStyles: {
      0: {
        fillColor: [255, 255, 255]
      },
      1: {
        fillColor: [255, 255, 255]
      },
      2: {
        fillColor: [255, 255, 255],
        halign: 'right'
      },
      3: {
        fillColor: [230, 230, 230],
        halign: 'right'
      }
    },
    styles: {
      fillColor: [200, 200, 200]
    },
    body: [
      [
        [""],
        ["                               "],
        ["subtotaal"],
        [totaalEx.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["voorschot"],
        ["-" + voorschot.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["subtotaal"],
        [totaalExSub.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["btw 21%"],
        [btw.toFixed(2) + " €"]
      ],
      [
        [""],
        ["                               "],
        ["totaal"],
        [totaalInc.toFixed(2) + " €"]
      ]
    ]
  })
}
/**Footer & Disclaimer**/
doc.setFontType("courier");
doc.setFontSize(10);
doc.text(20, 200, "U wordt verzocht het vermelde bedrag ten laatste binnen de 14 dagen na factuurdatum over te maken op bovenstaand");
doc.text(20, 205, "rekeningnummer, onder vermelding van het factuurnummer.");
doc.text(20, 210, "Neem bij vragen over deze factuur contact op met Merijn De Smet, 0488146678, merijndesmet@live.be");
doc.setFontType("bold");
doc.text(70, 220, "Wij danken u voor uw vertrouwen.");
/**EINDE FACTUUR GENERATIE**/
doc.save(factuurNr + '.pdf');