//************************************************************************************************************************************************
//        SKANOWANIE STRON W WYSZUKIWARCE GOOGLE-WYNIKI WYSZUKIWARKI PO WSTAWIENIU SZUKANEJ FRAZY
// AUTOR: PATRYK PAWLICKI, ZADANIE NA PRAKTYKACH.
//
// POPRAWNY UKLAD SCIEZKI W KONSOLI:
// phantomjs nazwa_pliku.js www.google.pl "szukana fraza w google" "user agent"
// wymagane podanie jest url, i szukanej frazy ktore jesli sa zdaniem powinny byc w "" (tworza jeden argument)
// w przypadku niepodania user-agenta bedzie on dodany z urzedu automatycznie
//
//
// z proxy:
// np:phantomjs --proxy=1.2.3.4:1 --proxy-auth=user:***** google.js www.google.pl "szukana fraza" "Mozilla/5.0 (Windows NT 6.1; WOW64)" 
//
// bez proxy:
// np:phantomjs google.js www.google.pl "szukana fraza" "Mozilla/5.0 (Windows NT 6.1; WOW64)" 
// 
// phantomjs to przegladarka dzialajaca z konsoli, kod ma za zadanie odpalic podana mu strone, ustawic userAgenta, wyszukac podana fraze w google
// i poczekac na zaladowanie strony, sciagnac dom z wykonanym js
//
//
//
//************************************************************************************************************************************************

//dodanie bibliotek
var page = require('webpage').create();             
var fs = require('fs');                              
var system = require('system');                     

//czytanie agrunemtów sciezki z konsoli
var args = system.args;
var JestemAgentem = page.settings.userAgent = "Mozilla/5.0 (X11; Linux i686; rv:8.0) Gecko/20100101 Firefox/8.0";


//====================//
// walidacja sciezki  //
//====================//

if (args.length === 3) {
 var url = "http://"+args[1];// adres url
 console.log("adres url : "+url);
   console.log("Agent przydzielony z urzedu: \n"+JestemAgentem); 
  if(args[2] === ""){
    console.log("szukana fraza musi byc slowem");
    phantom.exit();
  }else{
    var szukane = args[2];
    console.log("szukana fraza: "+szukane);
  }
}else if(args.length > 3) {

 var url = "http://"+args[1];// adres url
 console.log("adres url : "+url);
  if(args[3] === ""){
   console.log("agent przydzielony z urzedu: \n"+JestemAgentem);
  }else{
    JestemAgentem =  page.settings.userAgent = args[3];
  }
 
  if(args[2] === ""){
    console.log("szukana fraza musi byc slowem, zdaniem lub liczba");
    phantom.exit();
  }else{
    var szukane = args[2];
    console.log("szukana fraza: "+szukane);
  }

}else{
    console.log('Podales za malo argumentow');
    phantom.exit();
}


function googlarka(szukana){
  page.evaluate(function(szukana){
       //frazowanie w googlarce 
       //tworzy event klikniecia myszka
       var evt = document.createEvent("MouseEvents");
       // lapie input do wpisania tekstu ["szuakana"      ][szukaj w google]
        var inp = document.querySelector('input#lst-ib');
        //przypisuje szukana fraze do inputu
        document.querySelector('#lst-ib').value = szukana;
        // klikniecie z opcja focus inaczej nie mozna zaczac szukac nic w google 
        evt.initMouseEvent("focus", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        //dla pewnosci wysylamy 2x event pierwszy czasem ignoruje
       // inp.dispatchEvent(evt);
        inp.dispatchEvent(evt);
      setTimeout(function(){
           document.querySelector('button.lsb').click();
         },100);
   },szukana);
}

page.onConsoleMessage = function(msg) {
  console.log(msg);
};

function msgs(slowo){
  console.log(slowo);
}
// dla pewnosci ustawia true dla wlaczonej javascript
page.settings.javascriptEnabled = true;

//funkcja czysci ciasteczka ale nie mam ich nazwy
//phantom.clearCookies();


page.open(url, function (status) {
    
    if (status !== 'success') {
      msgs("Error opening url \"" + page.reason_url + "\": " + page.reason);
    }
// lapanie czasu do obliczenia czasu pracy
var time = page.evaluate(function () {
      var time = Date.now();
      //poczatkowy czas zeby zliczyc ile zajmuje ladowanie strony
      //console.log('czas: '+time);
   return time;
});
var i=1;
function ReadyState() {
   
        setTimeout(function () {
            var readyState = page.evaluate(function () {
                return document.readyState;
            });

            if ("complete" === readyState) {
                var URLx  = page.evaluate(function () {
                   return document.URL;
                });
            
               var nr1 = URLx.search("www");
               var urlpage = URLx.slice(nr1,nr1+11);
               var pathpage = URLx.slice(nr1);
               msgs(pathpage);
               var path = pathpage.split(".");
               if(urlpage === "www.google."){
                  googlarka(szukane);//    :)
                    setTimeout(function(){
                        //jesli jest zaladowana strona kopiuje jej DOM
                         var htmlContent = page.evaluate(function () {
                            return document.documentElement.outerHTML;
                           });
                          //fs.write("test1/plik.html", htmlContent, 'w');
                         //msgs(htmlContent
                        page.render('test1/' +path[1]+ '.png');
                        time = Date.now() - time;
                        msgs('operacja trwala: '+ time + ' milisekund');
                        msgs("sukces");
                  phantom.exit();
                  },2000);
               }else{
                setTimeout(function(){
                        //jesli jest zaladowana strona kopiuje jej DOM
                         var htmlContent = page.evaluate(function () {
                            return document.documentElement.outerHTML;
                           });
                          //fs.write("test1/plik.html", htmlContent, 'w');
                         //msgs(htmlContent
                        page.render('test1/' +path[1]+ '.png');
                        time = Date.now() - time;
                        msgs('operacja trwala: '+ time + ' milisekund');
                        msgs("sukces");
                  phantom.exit();
                  },2000);
               }
                           
              

                
                
            } else {
                //odczekam 100ms przed ponownym ladowaniem niech ma chwile zeby odsapnac
                setTimeout(function(){
                  msgs('czekam...'+i*200+"ms");i++;
                  ReadyState();
                },200);
            }
        });
    } ReadyState();
     
});
 
