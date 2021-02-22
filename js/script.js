function start() {
    

    $("#start").hide();

    $("#gamer-background").append("<div id='player' class='anima1'></div>");
    $("#gamer-background").append("<div id='enemy1' class='anima2'></div>");
    $("#gamer-background").append("<div id='enemy2'></div>");
    $("#gamer-background").append("<div id='friend' class='anima3'></div>");
    $("#gamer-background").append("<div id='score'></div>");
    $("#gamer-background").append("<div id='energy'></div>");


//Principais variáveis do jogo
var podeAtirar = true;
var fimDeJogo = false;
var pontos = 0;
var salvos = 0;
var perdidos = 0;
var energiaAtual = 3;
var jogo = {};
var velocidade = 5;
var posicaoY = parseInt(Math.random() * 334);
var TECLA = {
    W: 87,
    S: 83,
    D: 68
};

jogo.pressionou = [];

var somDisparo = document.getElementById("shootingSound");
var somExplosao = document.getElementById("explosionSound");
var musica = document.getElementById("music");
var somGameover = document.getElementById("gameoverSound");
var somPerdido = document.getElementById("lostSound");
var somResgate = document.getElementById("rescueSound");


//Musica em loop

musica.addEventListener("ended", function() { musica.currentTime = 0; musica.play(); }, false);
musica.play();


//Verifica se o usuário pressionou alguma tecla
$(document).keydown(function(e) {
    jogo.pressionou[e.which] = true;
});

$(document).keyup(function(e) {
    jogo.pressionou[e.which] = false;
});


// Game Loop
jogo.timer = setInterval(loop, 30);

function loop() {
    
    movefundo();
    movejogador();
    moveinimigo1();
    moveinimigo2();
    moveamigo();
    colisao();
    placar();
    energia();

}; 
 //Fim Game Loop


// Função que movimenta o fundo do jogo
function movefundo() {
    
    esquerda = parseInt($("#gamer-background").css("background-position"));
    $("#gamer-background").css("background-position", esquerda-1);
} 
// fim movefundo()


function movejogador() {

    if(jogo.pressionou[TECLA.W])  {
        var topo = parseInt($("#player").css("top"));
        $("#player").css("top", topo-10);

        if (topo <= 0) {
        $("#player").css("top", topo+10);
        }

    }

    if (jogo.pressionou[TECLA.S]) {      
        var topo = parseInt($("#player").css("top"));
        $("#player").css("top",topo+10)

        if (topo >= 434) {
        $("#player").css("top", topo-10);
        }
    }

    if (jogo.pressionou[TECLA.D]) {
        //chama função disparo
        disparo();
    }
} 
// fim movejogador()


function moveinimigo1() {

    posicaoX = parseInt($("#enemy1").css("left"));
    $("#enemy1").css("left", posicaoX - velocidade);
    $("#enemy1").css("top", posicaoY);

    if (posicaoX <= 0) {
        posicaoY = parseInt(Math.random() * 334);
        $("#enemy1").css("left", 694);
        $("#enemy").css("top", posicaoY);

    }
} // fim moveinimigo1()


function moveinimigo2() {

    posicaoX = parseInt($("#enemy2").css("left"));
    $("#enemy2").css("left", posicaoX - 3);

    if (posicaoX <= 0) {
        $("#enemy2").css("left", 775);
    }
}  // Fim movejogador2()


function moveamigo() {

    posicaoX = parseInt($("#friend").css("left"));
    $("#friend").css("left", posicaoX + 1);

    if (posicaoX > 906) {
        $("#friend").css("left", 0);
    }
} // fim moveamigo()


function disparo() {

    if (podeAtirar == true) {

        somDisparo.play();
        podeAtirar = false;

        topo = parseInt($("#player").css("top"))
        posicaoX = parseInt($("#player").css("left"))
        tiroX = posicaoX + 190;
        topoTiro = topo + 37;
        $("#gamer-background").append("<div id='firing'></div>");
        $("#firing").css("top", topoTiro);
        $("#firing").css("left", tiroX);

        var tempoDisparo = window.setInterval(executaDisparo, 30);

    } // fecha podeAtirar

    function executaDisparo() {
        posicaoX = parseInt($("#firing").css("left"));
        $("#firing").css("left", posicaoX + 15);

        if(posicaoX > 900) {

            window.clearInterval(tempoDisparo);
            tempoDisparo = null;
            $("#firing").remove();
            podeAtirar = true;

        } 
    } // fecha executaDisparo()
} // fecha disparo()


function colisao() {
    
    var colisao1 = ($("#player").collision($("#enemy1")));
    var colisao2 = ($("#player").collision($("#enemy2")));
    var colisao3 = ($("#firing").collision($("#enemy1")));
    var colisao4 = ($("#firing").collision($("#enemy2")));
    var colisao5 = ($("#player").collision($("#friend")));
    var colisao6 = ($("#enemy2").collision($("#friend")));
    
    //jogador com o inimigo 1
    if (colisao1.length > 0) {

        energiaAtual--;
        inimigo1X = parseInt($("#enemy1").css("left"));
        inimigo1Y = parseInt($("#enemy1").css("top"));
        explosao1(inimigo1X, inimigo1Y);

        posicaoY = parseInt(Math.random() * 334 );
        $("#enemy1").css("left", 694);
        $("#enemy1").css("top", posicaoY);
        }

    //jogador com o inimigo2
    if (colisao2.length > 0) {

        energiaAtual--;
        inimigo2X = parseInt($("#enemy2").css("left"));
        inimigo2Y = parseInt($("#enemy2").css("top"));
        explosao2(inimigo2X, inimigo2Y);

        $("#enemy2").remove();

        reposicionaInimigo2();

    }

    //Disparo com o inimigo1
    if (colisao3.length > 0) {

        velocidade = velocidade + 0.3;
        pontos = pontos + 100;
        inimigo1X = parseInt($("#enemy1").css("left"));
        inimigo1Y = parseInt($("#enemy1").css("top"));
        
        explosao1(inimigo1X, inimigo1Y);
        $("#firing").css("left", 950);

        posicaoY = parseInt(Math.random() * 334);
        $("#enemy1").css("left", 694);
        $("#enemy1").css("top", posicaoY);

    }    

    
    //Disparo com o inimigo2
    if (colisao4.length > 0) {

        pontos = pontos + 50;
        inimigo2X = parseInt($("#enemy2").css("left"));
        inimigo2Y = parseInt($("#enemy2").css("top"));
        $("#enemy2").remove();

        explosao2(inimigo2X, inimigo2Y);
        $("#firing").css("left", 950);

        reposicionaInimigo2();

    }  

    //jogador com o amigo
    if(colisao5.length > 0) {

        salvos++;
        somResgate.play();
        reposicionaAmigo();
        $("#friend").remove();
    }

    //Inimigo2 com o amigo

    if(colisao6.length > 0) {

        perdidos++;
        amigoX = parseInt($("#friend").css("left"));
        amigoY = parseInt($("#friend").css("top"));
        explosao3(amigoX, amigoY);
        $("#friend").remove();

        reposicionaAmigo();
        
    }


} // fim colisao()

//Explosao 1
function explosao1(inimigo1X, inimigo1Y) {

    somExplosao.play();
    $("#gamer-background").append("<div id='explosion1'></div>");
    $("#explosion1").css("background-image", "url(imgs/explosao.png)");
    var div = $("#explosion1");
    div.css("top", inimigo1Y);
    div.css("left", inimigo1X);
    div.animate({width: 200, opacity: 0}, "slow");

    var tempoExplosao = window.setInterval(removeExplosao, 1000);

    function removeExplosao() {

        div.remove();
        window.clearInterval(tempoExplosao);
        tempoExplosao = null;
    }
}


//Reposiciona Inimigo2
function reposicionaInimigo2() {

    var tempoColisao4 = window.setInterval(reposiciona4, 5000);

    function reposiciona4() {
        window.clearInterval(tempoColisao4);
        tempoColisao4 = null;

        if (fimDeJogo == false) {
            $("#gamer-background").append("<div id='enemy2'></div>");
        }
    }
}


//Explosao2
function explosao2(inimigo2X, inimigo2Y) {

    somExplosao.play();
    $("#gamer-background").append("<div id='explosion2'></div>");
    $("#explosion2").css("background-image", "url(imgs/explosao.png)");
    var div2 = $("#explosion2");
    div2.css("top", inimigo2Y);
    div2.css("left", inimigo2X);
    div2.animate({width: 200, opacity: 0}, "slow");

    var tempoExplosao2 = window.setInterval(removeExplosao2, 1000);

    function removeExplosao2() {

        div2.remove();
        window.clearInterval(tempoExplosao2);
        tempoExplosao2 = null;
    }
} // fim Explosao2()


//Reposiciona Amigo
function reposicionaAmigo() {
    var tempoAmigo = window.setInterval(reposiciona6, 6000);

    function reposiciona6() {
        window.clearInterval(tempoAmigo);
        tempoAmigo = null;

        if (fimDeJogo == false) {
            $("#gamer-background").append("<div id='friend' class='anima3'></div>")
        }
    }
} // Fim reposicionaAmigo()


//Explosao 3 
function explosao3(amigoX, amigoY) {

    somPerdido.play();
    $("#gamer-background").append("<div id='explosion3' class='anima4' ></div>");
    $("#explosion3").css("top", amigoY);
    $("#explosion3").css("left", amigoX);

    var tempoExplosao3 = window.setInterval(resetaExplosao3, 1000)

    function resetaExplosao3() {
        $("#explosion3").remove();
        window.clearInterval(tempoExplosao3);
        tempoExplosao3 = null;
    }
} //fim explosao3


function placar() {

    $("#score").html("<h2> Pontos: " + pontos + " Salvos: " + salvos + " Perdidos: " + perdidos + "</h2>");
} // fim placar()


function energia() {

    if (energiaAtual == 3) {
        $("#energy").css("background-image", "url(imgs/energia3.png)");
    }
    if (energiaAtual == 2) {
        $("#energy").css("background-image", "url(imgs/energia2.png)");
    }
    if (energiaAtual == 1) {
        $("#energy").css("background-image", "url(imgs/energia1.png)");
    }
    if (energiaAtual == 0) {
        $("#energy").css("background-image", "url(imgs/energia0.png)");
        //Game Over
        gameOver();
    }
} //fim energia()


function gameOver() {
    
    fimDeJogo = true;
    musica.pause();
    somGameover.play();

    window.clearInterval(jogo.timer);
    jogo.timer = null;

    $("#player").remove();
    $("#enemy1").remove();
    $("#enemy2").remove();
    $("#friend").remove();

    $("#gamer-background").append("<div id='end'></div>");

    $("#end").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=restartGame()><h3>Jogar Novamente</h3></div>");
} // fim gameOver()


}; //fim start()

function restartGame() {
    var somGameover = document.getElementById("gameoverSound");

    somGameover.pause();
    $("#end").remove();
    start();
}// fim reiniciaJogo()


