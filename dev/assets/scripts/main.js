// Variáveis "Globais"
var EXAM = {};
EXAM.idRC = [];

//Handler dos botões
function addEvent(obj, evType, fn){
    if (obj.addEventListener){
        obj.addEventListener(evType, fn, true);
    }
    if (obj.attachEvent){
        obj.attachEvent("on"+evType, fn);
    }
}

EXAM.GerarNumero = function(resposta,operador){
	var numero,
		sinal,
		n;

	//Gerador de Sinal
	Math.random() > 0.5 ? sinal = 1 : sinal = -1;
	switch (operador){
		//Número 1 evita repetição do processo para somas.
		case "+":
			numero = Math.abs(Math.round(Math.random()*10) + resposta * sinal + 1);
		break;
		case "-":
			numero = Math.round(Math.random()*10) + resposta + 1;
		break;
		case "X":
			numero = Math.abs(Math.round(Math.random()*10) + resposta * sinal + 1);
		break;
		default:
			n = Math.random() + resposta * sinal + 1;
			numero = Math.abs(n.toFixed(1));
	}
	return ( numero===0 || numero===resposta) ? EXAM.GerarNumero(resposta,operador) : numero;
};

//Array de Respostas Erradas
EXAM.CriarArray = function (resposta,numeroItens,operador){
	// numeroItens = Número de itens do array
	// maxNum = Número máximo do número aleatório que será gerado para cada item
	// ArrayRandom = O objeto Array.
	var ArrayRandom = [],
		contador = 0,
		i,
		temp,
		testResult;

	// Enquanto contador ofr menor ou igual a numeroItens, continua o processo de gerar os itens ...
	do {
		// Obtêm um número aleatório diferente de 0
		temp = EXAM.GerarNumero(resposta,operador);

		// Testa se esse valor ainda não existe no Array
		testResult = 0;

		// Varre item por item do Array para testar o valor de temp já existe

		for (i=0; i <= ArrayRandom.length; i++){
			if (temp === ArrayRandom[i]){
				testResult = 1;
			}
		}
		// Se testResult é igual a 0, então pode adicionar esse número ao Array
		if ( testResult===0 ){
		  ArrayRandom.push(temp); // Push(), adiciona um novo elemento ao Array
		  contador++;
		}
	} while ( contador <= numeroItens - 1); // Teste do While
	// Tudo Ok. Retorna o Array.
	return ArrayRandom;
};

EXAM.CriarQuestao = function(numalternativas,operador){
	var resposta,
		num1,
		num2,
		i,
		idValue,
		nameValue,
		labelValue,
		j,
		r,
		element,
		obj,
		alternativas = [];

//Valor da Resposta Certa
	switch (operador){
		case "+":
			num1 = Math.ceil(Math.random()*100);
			num2 = Math.ceil(Math.random()*100);
			resposta = num1+num2;
			break;
		case "-":
			num1 = Math.ceil(Math.random()*100);
			num2 = Math.ceil(Math.random()*100);
			resposta = num1-num2;
			break;
		case "X":
			num1 = Math.ceil(Math.random()*100);
			num2 = Math.ceil(Math.random()*10);
			resposta = num1*num2;
			break;
		default:
			num1 = Math.ceil(Math.random()*100);
			num2 = Math.ceil(Math.random()*10);
			r = num1/num2;
			resposta = Math.abs(r.toFixed(1));
	}

	alternativas = EXAM.CriarArray(resposta,numalternativas,operador);

//@Índice da Resposta Certa
	do j = Math.round( Math.random() * 10 );
		while( j > numalternativas - 1)
//@Pergunta

	element = document.createElement("div");
	element.setAttribute("id","P"+ EXAM.nQuestao);
	element.setAttribute("class","perguntas");
	obj = document.getElementById("content-B");
	obj.appendChild(element);

	obj = document.getElementById("P" + EXAM.nQuestao);
	idValue = "AS" + EXAM.nQuestao;
	obj.innerHTML = "<div class='num-pergunta'>" + (EXAM.nQuestao + 1) + "</div>"+
					"<h3>" + num1 + " " + operador + " " + num2 + "</h3>"+
					"<div class='alternativas-wrap' id=" + idValue + "></div>";

//@Alternativas
	for(i=0;i<numalternativas;i++){
		//Guardar a resposta certa
		if(j===i){
			EXAM.idRC[EXAM.nQuestao]=	"" + EXAM.nQuestao + j;
			alternativas[j] = resposta;
		}
		//<div id="RA(X)" class="radios"> -> filho de <div id="AS(X)"class="alternativas-wrap">
		element = document.createElement("div");
		element.setAttribute("id","RA"+ EXAM.nQuestao + i);
		element.setAttribute("class","radios");
		obj = document.getElementById("AS" + EXAM.nQuestao);
		obj.appendChild(element);

		obj = document.getElementById("RA"+ EXAM.nQuestao + i);
		idValue = "R" + EXAM.nQuestao + i;
		nameValue = "R" + EXAM.nQuestao;
		labelValue = idValue;
		obj.innerHTML = "<input type='radio' id=" + idValue + " name=" + nameValue + ">"+
						"<label for=" + labelValue + ">" + alternativas[i] + "</label>";
	}
};

EXAM.ChecarResposta = function (){
	var i,
		element,
		valorClasse,
		porcentagemRC,
		numeroRC = 0; //número de respostas certas

	for(i=0;i<EXAM.numquestoes;i++){
		element = document.getElementById("R"+EXAM.idRC[i]);
		if (element.checked){
			valorClasse = "radios RC";
			numeroRC++;

		}else{
			valorClasse = "radios RE";
		}
		element = document.getElementById("RA"+EXAM.idRC[i]);
		element.setAttribute("class",valorClasse);
	}

	//@Quadro de Respostas
	element = document.getElementById("resultado-acertos");
	element.innerHTML = numeroRC;

	element = document.getElementById("resultado-erros");
	element.innerHTML = EXAM.numquestoes - numeroRC;

	porcentagemRC = (numeroRC/EXAM.numquestoes) * 100;
	element = document.getElementById("resultado-desempenho");
	element.innerHTML = porcentagemRC.toFixed() + "%";

	element = document.getElementById("resultado-texto");
	element.setAttribute("style","display:block");

	//@Botão Respostas
	element = document.getElementById("btnRespostas");
	element.setAttribute("style","display:none");
};

//@Função associada ao botão Novo Exercício
EXAM.CriarExercicio = function (){
	var operador,
		eloperador,
		i,
		element,
		numalternativas;

	element = document.getElementById("nquest");
	EXAM.numquestoes = element.options[element.selectedIndex].value;
	for(i=0;i<4;i++){
		eloperador = document.getElementById("opr0" + i);
		if (eloperador.checked){
			operador = eloperador.value;
			break;
		}
	}
	numalternativas = 5;

	//@Montagem do Exercício
	element = document.getElementById("content-B");
	element.innerHTML = "";
	for(EXAM.nQuestao = 0;EXAM.nQuestao<EXAM.numquestoes;EXAM.nQuestao++){
		EXAM.CriarQuestao(numalternativas,operador);
	}
	//Event Listener
	element =document.getElementById("btnRespostas");
	element.setAttribute("style","display:block");
	addEvent(element,"click",EXAM.ChecarResposta);

	element = document.getElementById("content-B-anexo");
	element.setAttribute("style","display:block");

	element = document.getElementById("resultado-texto");
	element.setAttribute("style","display:none");
};

EXAM.btnExercicios=document.getElementById("btnExercicios");
addEvent(EXAM.btnExercicios,"click",EXAM.CriarExercicio);