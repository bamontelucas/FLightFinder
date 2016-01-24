$('#datepicker').datepicker({
    format: "dd/mm/yyyy",
    startDate: "-Date()",
    maxViewMode: 0,
    todayBtn: "linked",
    language: "pt-BR",
    keyboardNavigation: false,
    autoclose: true
});

var xmlaeroporto = null,
    xmlcidade = null;    

$.get("data/aeroportos.xml", function(data){
    xmlaeroporto = data;
});
$.get("data/cidades.xml", function(data){
    xmlcidade = data;
});

var result = {};
var resultInput = undefined;

function anycase(who){
	return 'translate('+who+', \'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÓÚÀÈÌÒÙÃÕÇÂÊÎÔÛÄËÏÖÜáéíóúàèìòùãõçâêîôûäëïöü\', \'abcdefghijklmnopqrstuvwxyzaeiouaeiouaocaeiouaeiouaeiouaeiouaocaeiouaeiou\')';
}

function busca_cidade(key, needed){
    if(!key || key == "") return;
    var xpath;	
    if(isNaN(key)){
        xpath = '//cidade['+anycase('uf')+'="'+key.trim().toLowerCase()+'" or contains('+anycase('nome')+', "'+key.trim().toLowerCase()+'")]'; 	
    } else {
        xpath = '//cidade[ibge="'+parseInt(key)+'"]';
    }
	//console.log(xpath);
    var cid = xmlcidade.evaluate(xpath, xmlcidade.documentElement, null, XPathResult.ANY_TYPE, null);
    var r, ibge;
    while(r = cid.iterateNext()){
        ibge = r.querySelector("ibge").textContent.trim();
        if(result.hasOwnProperty(ibge)){
            if(!needed){
                result[ibge].matchedCity = true;
            }
        } else {
            result[ibge] = {
                nome: r.querySelector("nome").textContent.trim(),
                uf: r.querySelector("uf").textContent.trim(),
                aeroportos: {},
                matchedCity: (!needed)
            };
            if(!needed){
                busca_aeroporto(ibge, true);   
            }
        }
    }
}

function busca_aeroporto(key, bycity){
    if(!key || key == "") return;
    var chave = key.trim().toLowerCase();
    var xpath;
    
    if(bycity){
        xpath = '//aeroporto[cidade="'+chave+'"]';	
    } else {
        xpath = '//aeroporto['+anycase('sigla')+'="'+chave+'" or contains('+anycase('nome')+', "'+chave+'")]';	
    }
    //console.log(xpath);
    var aero = xmlaeroporto.evaluate(xpath, xmlaeroporto.documentElement, null, XPathResult.ANY_TYPE, null);
    var r, a, sigla, ibge;
    while(r = aero.iterateNext()){
        sigla = r.querySelector("sigla").textContent.trim();
        if(bycity){
            if(!result[key].aeroportos.hasOwnProperty(sigla)){
                result[key].aeroportos[sigla] = {
                    nome: r.querySelector("nome").textContent.trim(),
                    matchedAirport: (bycity)?true:false	// faço isso porque pode vir undefined
                }
            }	
        } else {
            ibge = r.querySelector("cidade").textContent.trim();
            if(!result.hasOwnProperty(ibge)){
                busca_cidade(ibge, true);
            }
            if(result[ibge].aeroportos.hasOwnProperty(sigla)){
                result[ibge].aeroportos[sigla].matchedAirport = true;
            } else {
                result[ibge].aeroportos[sigla] = {
                    nome: r.querySelector("nome").textContent.trim(),
                    matchedAirport: true
                }
            }
        }
    }
}

function render(){
    if(Object.keys(result).length == 0) return;
    //console.clear();
    //console.log(result);
    //console.log(JSON.stringify(result));
    
    var str = '<div style="white-space: nowrap; cursor: pointer;"><ul style="list-style-type: none; padding-left: 0px;">';
    for(var c in result){
        str+= '<li class="cidade-aeroporto" data-tipo="C" data-cod="'+c+'"'+((result[c].matchedCity)?' onclick="selecionar(this);"':'')+'>' + result[c].nome  + '</li>';// ((result[c].matchedCity)?"onclick='selecionar(this);'> (todos os aeroportos)":">") + "</li>";
        for (var a in result[c].aeroportos){
            str+= '<li class="cidade-aeroporto" data-tipo="A" data-cod="'+a+'" onclick="selecionar(this);">&nbsp;&nbsp;&nbsp;&nbsp;('+a+') '+ result[c].aeroportos[a].nome + '</li>';
        }
        str+= "";
    }
    str+= "</ul></div>";
    console.log(str);
    $(resultInput).attr("title", str).popover("show");
	
	//$('.cidade-aeroporto[data-matched=1]').click(function(){ selecionar(this) });
}

var __stackcall = 0;

function busca(obj){
    __stackcall++;
    result = {};
	resultInput = obj;
    //$(obj).popover("destroy");
    setTimeout(doBusca, 500, __stackcall, obj.value);
	$("[name='tipo-"+resultInput.id+"']").val("");
	$("[name='"+resultInput.id+"']").val("");
}

function doBusca(stack, key){
    if(stack < __stackcall) return;
    
    busca_cidade(key, false);
    busca_aeroporto(key, false);
    render();
}

$("#origem, #destino").bind("input", function(){
    busca(this);
});

function selecionar(obj){
    console.log(obj);
	var tipo = obj.dataset.tipo;
	var cod = obj.dataset.cod;
	var txt = obj.textContent.trim();
    console.log(txt);
    console.log(resultInput);
	$(resultInput).val(txt).popover("destroy");	
	$("[name='tipo-"+resultInput.id+"']").val(tipo);
	$("[name='"+resultInput.id+"']").val(cod);	
}

$("[name=tipo]").change(function(){
	if (this.value == 1){
		$("#destino").prop("disabled",true);
		$("#volta").prop("disabled",true);
		$("#destino").prop("required",true);
		$("#volta").prop("required",true);		
	}
	else{
		$("#destino").prop("disabled",false);
		$("#volta").prop("disabled",false);
		$("#destino").prop("required",false);
		$("#volta").prop("required",false);	
	}

});

function validar(){
	if ($("[name='origem']").val() == ""){
		return false;
	}
	if ($("[name='tipo-origem']").val() == ""){
		return false;
	}	
	if (($("[name='destino']").val() == "") && ($("[name='destino']").val() == "1")){
		return false;
	}
	if (($("[name='tipo-destino']").val() == "") && ($("[name='destino']").val() == "1")){
		return false;
	}	
	if (($("[name='destino']").val() == "") && ($("[name='destino']").val() == "1")){
		return false;
	}
	if (($("#volta").val() == "") && ($("[name='destino']").val() == "1")){
		return false;
	}	
	return true;
}