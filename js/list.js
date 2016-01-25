var xmlaeroporto = null;
var xmlsvoos = {
    gol: null,
    azul: null,
    tam: null
};
var conditions = '';
var condition_destino = '';
var aeroportos_origem = [];
var aeroportos_destino = [];
var origem_ready = false;
var destino_ready = false;
var par = {};

$.get('data/aeroportos.xml', function(data){
    xmlaeroporto = data;
});
$.get('data/voosAZUL.xml', function(data){
    xmlsvoos.azul = data;
});
$.get('data/voosGOL.xml', function(data){
    xmlsvoos.gol = data;
});
$.get('data/voosTAM.xml', function(data){
    xmlsvoos.tam = data;
});

function get_param(){
    var qry = window.location.search.substring(1).split("&");
    qry.forEach(function(i){
        var p = i.split("=");
        par[p[0]] = decodeURIComponent(p[1]);
    });
}

function monta_origem(aeroportos){
    if(aeroportos.length == 0) return;
    conditions.push('(origem="' + aeroportos.join('" or origem="') + '")');
    origem_ready = true;
}

function monta_destino(aeroportos){
    if(aeroportos.length == 0) return;
    condition_destino = ' and (destino="' + aeroportos.join('" or destino="') + '")';
    destino_ready = true;
}

function busca_aeroporto(cidade){
    var aero = document.evaluate('//aeroporto[cidade="'+cidade+'"]/sigla/text()', xmlaeroporto.documentElement, null, XPathResult.ANY_TYPE, null);
    var a;
    var aeroportos = [];
    while(a = aero.iterateNext()) {
        aeroportos.push(a.data);
    }
    return aeroportos;
}

function voos_ready() {
    return !(xmlsvoos.gol === null || xmlsvoos.azul === null || xmlsvoos.tam === null);
}

function search(){
    if(!(origem_ready && destino_ready && voos_ready())){
        setTimeout(search, 100);
        return;   
    }
    
    var voos = document.implementation.createDocument("", "voos", null);
    var arr = [];
    var r, voo, xml;
    
    for(var cia in xmlsvoos) {
        xml = xmlsvoos[cia];
        r = document.evaluate('//voo['+conditions.join(' and ')+condition_destino+']', xml.documentElement, null, XPathResult.ANY_TYPE, null);
        while(voo = r.iterateNext()) {
            arr.push({
                node: voo,
                cia: cia 
            });
        }     
    }
    arr.forEach(function(i) {
        var el = voos.createElement('operadora');
        el.textContent = i.cia;
        i.node.appendChild(el);
        voos.documentElement.appendChild(i.node);
    });
    
    search_escala([]);
}

function search_escala(aeroportos) {
    
}

function begin() {
    get_param();
    conditions = 'datasaida="'+par.ida+'" and passagens>="'+par.pessoas+'"';
    if(par['tipo-origem'] == 'A') {
        aeroportos_origem.push(par.origem);
        origem_ready = true;
    } else {
        aeroportos_origem = busca_aeroporto;
    }
    if(par['tipo-destino'] == 'A') {
        aeroportos_destino.push(par.destino);
        destino_ready = true;
    } else {
        aeroportos_destino = busca_aeroporto(par.destino);
    }

    search();
}

function testxml(callback) {
    if (xmlaeroporto === null || xmlsvoos.tam === null || xmlsvoos.azul === null || xmlsvoos.gol === null) {
        setTimeout(callback, 100);
        return;
    }
    callback();
}

testxml(begin);