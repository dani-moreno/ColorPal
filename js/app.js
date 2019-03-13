/*Copiar al portapapeles*/
var clip = new Clipboard('.copy');
clip.on('success', function(e) {
  nativeToast({
    message: 'Copied to the clipboard!',
    timeout: 5000,
    position: 'south'
  })
});

clip.on('error', function(e) {
  nativeToast({
    message: 'Error, try again.',
    timeout: 5000,
    position: 'south'
  })
});

function cambiarValor(input,maximo,cssv,pc) {
  $nuevo = input.val();
  if ($nuevo.length===0) { $nuevo=0; }
  $perc = "";
  if (pc) { $perc="%"; }
  if ($nuevo >= maximo) { $nuevo = maximo; }
  $(':root').css(cssv,$nuevo + $perc);
  input.val($nuevo);
}

function crearColores(num,h,s,l) {
  if (isNaN(h)) { h=0; }
  if (isNaN(s)) { s=0; }
  if (isNaN(l)) { l=0; }
  
  for (var i=num; i>0; i--) {
    $new_h = Math.max(0,parseInt($("#hue").val()) + (h*i));
    $new_s = Math.max(0,parseInt($("#sat").val()) - (s*i));
    $new_l = Math.max(0,parseInt($("#lig").val()) + (l*i));
    
    $(".color").before("<div class='l-color' id='l-"+i+"'></div>");
    
    $bg = "hsl("+$new_h+","+$new_s+"%,"+$new_l+"%)";
    $("#l-"+i).attr("style","background:"+$bg);
  }
}

function crearColoresC(num,h,s,l) {
  if (isNaN(h)) { h=0; }
  if (isNaN(s)) { s=0; }
  if (isNaN(l)) { l=0; }
  
  for (var i=num; i>0; i--) {
    $new_h = Math.max(0,parseInt($("#hue").val()) + (h*i));
    $new_s = Math.max(0,parseInt($("#sat").val()) - (s*i));
    $new_l = Math.max(0,parseInt($("#lig").val()) - (l*i));
    
    $(".color").after("<div class='d-color' id='d-"+i+"'></div>");
    
    $bg = "hsl("+$new_h+","+$new_s+"%,"+$new_l+"%)";
    $("#d-"+i).attr("style","background:"+$bg);
  }
}

function crearClaros() {
  $miv = $("#l-amount").val();
  if ($miv>10) { $miv=10; }
  if ($miv>0) {
    $(".l-color").remove();
    crearColores($miv,parseInt($("#l-hue").val()),parseInt($("#l-sat").val()),parseInt($("#l-lig").val()));
  }
  else {
    $(".l-color").remove();
  }
}

function crearOscuros() {
  $miv = $("#d-amount").val();
  if ($miv>10) { $miv=10; }
  if ($miv>0) {
    $(".d-color").remove();
    crearColoresC($miv,parseInt($("#d-hue").val()),parseInt($("#d-sat").val()),parseInt($("#d-lig").val()));
  }
  else {
    $(".d-color").remove();
  }
}

//Initial color
$("#hue").on('keydown keyup mousewheel', function() {
  cambiarValor($("#hue"),360,"--i-hue",0);
  crearClaros();
  crearOscuros();
  cerrarModal();
});

$("#sat").on('keydown keyup mousewheel', function() {
  cambiarValor($("#sat"),100,"--i-sat",1);
  crearClaros();
  crearOscuros();
  cerrarModal();
});

$("#lig").on('keydown keyup mousewheel', function() {
  cambiarValor($("#lig"),100,"--i-lig",1);
  crearClaros();
  crearOscuros();
  cerrarModal();
});

function cerrarModal() {
  $(".colores > div").removeClass("active");
  $(".modal").removeClass("abierto");
}


//Light colors
$("#l-amount").on('keydown keyup mousewheel', function() { crearClaros(); cerrarModal(); });

$("#l-hue").on('keydown keyup mousewheel', function() { crearClaros(); cerrarModal(); });

$("#l-sat").on('keydown keyup mousewheel', function() { crearClaros(); cerrarModal(); });

$("#l-lig").on('keydown keyup mousewheel', function() { crearClaros(); cerrarModal(); });


//Dark colors
$("#d-amount").on('keydown keyup mousewheel', function() { crearOscuros(); cerrarModal(); });

$("#d-hue").on('keydown keyup mousewheel', function() { crearOscuros(); cerrarModal(); });

$("#d-sat").on('keydown keyup mousewheel', function() { crearOscuros(); cerrarModal(); });

$("#d-lig").on('keydown keyup mousewheel', function() { crearOscuros(); cerrarModal(); });


/*Click en los colores*/
$('.colores').on('click', 'div', function(e) {
  $(".colores > div").removeClass("active");
  $(this).addClass("active");
  $(".modal").addClass("abierto");
  $offs = $(this).offset();
  $wid = $(this).width()*1.1;
  $(".modal").css({
    top: $offs.top+96,
    left: $offs.left+($wid/2)-(242/2)
  });
  
  //Poner los valores de HSL
  $cog_h=parseInt($("#hue").val());
  if (isNaN($cog_h)) { $cog_h=0; }
  $ph=Math.max(0,$cog_h);
  
  $cog_s=parseInt($("#sat").val());
  if (isNaN($cog_s)) { $cog_s=0; }
  $ps=Math.max(0,$cog_s)+"%";
  
  $cog_l=parseInt($("#lig").val());
  if (isNaN($cog_l)) { $cog_l=0; }
  $pl=Math.max(0,$cog_l)+"%";

  if (!$(this).hasClass("color")) {
    $estilo=$(this).attr("style");
    $("#btn-hsl").attr("data-clipboard-text",$estilo);
    $estilo=$estilo.substring(15);
    $valores=$estilo.split(",");
    $ph=$valores[0];
    $ps=$valores[1];
    $pl=$valores[2].replace(")","");
  }else{
    $("#btn-hsl").attr("data-clipboard-text","hsl("+$ph+","+$ps+","+$pl+")");
  }
  
  $("#m_h").text($ph); $("#m_h").addClass("copy"); $("#m_h").attr("data-clipboard-text",$ph);
  $("#m_s").text($ps); $("#m_s").addClass("copy"); $("#m_s").attr("data-clipboard-text",$ps.replace("%",""));
  $("#m_l").text($pl); $("#m_l").addClass("copy"); $("#m_l").attr("data-clipboard-text",$pl.replace("%",""));
  
  $color_rgb = hslToRgb(parseInt($ph)/360,parseInt($ps.replace("%",""))/100,parseInt($pl.replace("%",""))/100);
  
  $("#m_r").text($color_rgb[0]); $("#m_r").addClass("copy"); $("#m_r").attr("data-clipboard-text",$color_rgb[0]);
  $("#m_g").text($color_rgb[1]); $("#m_g").addClass("copy"); $("#m_g").attr("data-clipboard-text",$color_rgb[1]);
  $("#m_b").text($color_rgb[2]); $("#m_b").addClass("copy"); $("#m_b").attr("data-clipboard-text",$color_rgb[2]);

  $("#btn-rgb").attr("data-clipboard-text","rgb("+$color_rgb[0]+","+$color_rgb[1]+","+$color_rgb[2]+")");
});


/*Cerrar modal al hacer click en la cruz*/
$(".modal .close").on("click", function() {
  cerrarModal();
});


/*Cerrar modal al cambiar pantalla*/
$(window).on('resize', function(){ cerrarModal(); });


/*Botones de copiar HSL y RGB*/
$("#btn-hsl").on("click", function(e) { e.preventDefault(); });
$("#btn-rgb").on("click", function(e) { e.preventDefault(); });


/*Crear colores al inicio*/
$(function() {
  crearColores(3,parseInt($("#l-hue").val()),parseInt($("#l-sat").val()),parseInt($("#l-lig").val()));
  crearColoresC(3,parseInt($("#d-hue").val()),parseInt($("#d-sat").val()),parseInt($("#d-lig").val()));
});


/*Abrir menu exportar*/
$(".export").on("click", function(e) {
  $(".overlay").addClass("show");
  $(".menu").addClass("show");
  cerrarModal();
  if ($("#format-css").hasClass("active")) { escribirCSS(0); }
  if ($("#format-scss").hasClass("active")) { escribirCSS(1); }
  e.preventDefault();
});


/*Cerrar menu si se pulsa en el overlay*/
$(".overlay").on("click", function() {
  $(".overlay").removeClass("show");
  $(".menu").removeClass("show");
});


/*Cerrar menu con la cruz*/
$(".menu .close").on("click", function() {
  $(".overlay").removeClass("show");
  $(".menu").removeClass("show");
});


/*Switch de codigo (hsl o rgb)*/
$("#code-hsl").on("click", function(){
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    $("#code-rgb").removeClass("active");
    if ($("#format-css").hasClass("active")) { escribirCSS(0); }
    if ($("#format-scss").hasClass("active")) { escribirCSS(1); }
  }
});
$("#code-rgb").on("click", function(){
  if (!$(this).hasClass("active")) {
    $(this).addClass("active");
    $("#code-hsl").removeClass("active");
    if ($("#format-css").hasClass("active")) { escribirCSS(0); }
    if ($("#format-scss").hasClass("active")) { escribirCSS(1); }
  }
});


/*Switch de formato (css o scss)*/
$("#format-css").on("click", function(){
  if (!$(this).hasClass("active")) { $(this).addClass("active"); $("#format-scss").removeClass("active"); $(".c-css").css("display","block"); $(".c-scss").css("display","none"); escribirCSS(0); }
});
$("#format-scss").on("click", function(){
  if (!$(this).hasClass("active")) { $(this).addClass("active"); $("#format-css").removeClass("active"); $(".c-scss").css("display","block"); $(".c-css").css("display","none"); escribirCSS(1); }
});


/*Escribir el codigo con el nombre*/
function escribirCSS(o) {
  if (o==0) {
    $cvar = $("#css-var");
    $clas = $("#css-clas");
    $vtxt = ":root {\n";
    $ini = "  --";
    $csi = "var(--";
    $csf = ")";
  }
  else {
    $cvar = $("#scss-var");
    $clas = $("#scss-clas");
    $vtxt = "";
    $ini = "$";
    $csi = "$";
    $csf = "";
  }

  $name = $("#nombre").val();
  if ($name.length===0) { $name="color-name"; }
  $name=$name.toLowerCase().replace(" ","").replace("%","");

  $f=0; /*0 = hsl, 1 = rgb */
  if ($("#code-rgb").hasClass("active")) { $f=1; }

  /*Escribimos las variables*/
  /*Color inicial*/
  $cog_h=$("#hue").val();
  $cog_s=$("#sat").val();
  $cog_l=$("#lig").val();
  if ($f==0) { $vtxt += $ini+$name+":hsl("+$cog_h+","+$cog_s+"%,"+$cog_l+"%);"; }
  else {
    $c = hslToRgb(parseInt($cog_h)/360,parseInt($cog_s)/100,parseInt($cog_l)/100);
    $vtxt += $ini+$name+":rgb("+$c[0]+","+$c[1]+","+$c[2]+");";
  }

  /*Colores claros*/
  $lamount=parseInt($("#l-amount").val())
  if (isNaN($lamount)) { $lamount=0; }
  if ($lamount!=0) {
    $vtxt += "\n\n";
    for (var i=1; i<=$lamount; i++) {
      $min="#l-"+i;
      $estilo=$($min).attr("style");
      if ($f==0) {
        $estilo=$estilo.replace("background:","");
        $vtxt += $ini+$name+"-light-"+i+":"+$estilo+";";
      }
      else {
        $estilo=$estilo.substring(15);
        $valores=$estilo.split(",");
        $ph=$valores[0];
        $ps=$valores[1];
        $pl=$valores[2];
        $c = hslToRgb(parseInt($ph)/360,parseInt($ps.replace("%",""))/100,parseInt($pl.replace("%)",""))/100);
        $vtxt += $ini+$name+"-light-"+i+":rgb("+$c[0]+","+$c[1]+","+$c[2]+");";
      }
      if (i!=$lamount) { $vtxt += "\n"; }
    }
  }

  /*Colores oscuros*/
  $damount=parseInt($("#d-amount").val());
  if (isNaN($damount)) { $damount=0; }
  if ($damount!=0) {
    $vtxt += "\n\n";
    for (var i=1; i<=$damount; i++) {
      $min="#d-"+i;
      $estilo=$($min).attr("style");
      if ($f==0) {
        $estilo=$estilo.replace("background:","");
        $vtxt += $ini+$name+"-dark-"+i+":"+$estilo+";";
      }
      else {
        $estilo=$estilo.substring(15);
        $valores=$estilo.split(",");
        $ph=$valores[0];
        $ps=$valores[1];
        $pl=$valores[2];
        $c = hslToRgb(parseInt($ph)/360,parseInt($ps.replace("%",""))/100,parseInt($pl.replace("%)",""))/100);
        $vtxt += $ini+$name+"-dark-"+i+":rgb("+$c[0]+","+$c[1]+","+$c[2]+");";
      }
      if (i!=$damount) { $vtxt += "\n"; }
    }
  }

  if (o==0) { $vtxt += "\n}"; }
  $cvar.text($vtxt);


  /*Despues, escribimos las clases*/
  /*Color inicial*/
  $ctxt = "/* Backgrounds */\n";
  $ttxt = "\n/* Text color */\n";
  $ctxt += ".bg-"+$name+" { background: "+$csi+$name+$csf+"; }";
  $ttxt += ".text-"+$name+" { color: "+$csi+$name+$csf+"; }";

  /*Colores claros*/
  $lamount=parseInt($("#l-amount").val())
  if (isNaN($lamount)) { $lamount=0; }
  if ($lamount!=0) {
    $ctxt += "\n\n";
    $ttxt += "\n\n";
    for (var i=1; i<=$lamount; i++) {
      $nomb = $name+"-light-"+i;
      $ctxt += ".bg-"+$nomb+" { background: "+$csi+$nomb+$csf+"; }";
      $ttxt += ".text-"+$nomb+" { color: "+$csi+$nomb+$csf+"; }";
      if (i!=$lamount) { $ctxt += "\n"; $ttxt += "\n"; }
    }
  }


  /*Colores oscuros*/
  $damount=parseInt($("#d-amount").val())
  if (isNaN($damount)) { $damount=0; }
  if ($damount!=0) {
    $ctxt += "\n\n";
    $ttxt += "\n\n";
    for (var i=1; i<=$damount; i++) {
      $nomb = $name+"-dark-"+i;
      $ctxt += ".bg-"+$nomb+" { background: "+$csi+$nomb+$csf+"; }";
      $ttxt += ".text-"+$nomb+" { color: "+$csi+$nomb+$csf+"; }";
      if (i!=$damount) { $ctxt += "\n"; $ttxt += "\n"; }
    }
  }

  $clas.text($ctxt + "\n\n" + $ttxt);
}


/*Actualizar al cambiar el nombre del color*/
$("#nombre").on("change keyup", function() {
  if ($("#format-scss").hasClass("active")) { escribirCSS(1); } else { escribirCSS(0); }
});


/*Enlace del logo*/
$("#logo").on("click", function(e) {
  e.preventDefault();
});


/*Funcion HSL a RGB*/
function hslToRgb(h, s, l)
{
    var r, g, b;

    if (s == 0)
    {
        r = g = b = l; // achromatic
    }
    else
    {
        function hue2rgb(p, q, t)
        {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;

        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [
         Math.max(0, Math.min(Math.round(r * 255), 255)) 
        ,Math.max(0, Math.min(Math.round(g * 255), 255)) 
        ,Math.max(0, Math.min(Math.round(b * 255), 255)) 
    ];
}