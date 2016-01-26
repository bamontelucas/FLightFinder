var xmlaeroporto = null;
var xmlsvoos = {
    gol: null,
    azul: null,
    tam: null
};
var conditions = '';
var aeroportos_origem = [];
var aeroportos_destino = [];
var par = {};
var result;

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

function xpath_in(tag, values) {
    return '(' + tag + '="' + values.join('" or ' + tag + '="') + '")';
}

function array_voos_to_xml_voos(arr) {
    arr.forEach(function(i) {
        var el = result.createElement('operadora');
        el.textContent = i.cia;
        i.node.appendChild(el);
        result.documentElement.appendChild(i.node);
    });
}

function search(){    
    result = document.implementation.createDocument("", "voos", null);
    var arr = [];
    var xpath = '//voo[' + conditions + ' and ' + xpath_in('origem', aeroportos_origem) + ' and ' + xpath_in('destino', aeroportos_destino) + ']';  
    var voos, voo, xml;
    
    for(var cia in xmlsvoos) {
        xml = xmlsvoos[cia];
        voos = document.evaluate(xpath, xml.documentElement, null, XPathResult.ANY_TYPE, null);
        while(voo = voos.iterateNext()) {
            arr.push({
                node: voo,
                cia: cia 
            });
        }     
    }
    array_voos_to_xml_voos(arr);
    var pesquisa = result.createElement('pesquisa');
    pesquisa.innerHTML = '<origem>'+par.origem+'</origem><destino>'+par.destino+'</destino>';
    result.documentElement.appendChild(pesquisa);
    
    var html = xslt_apply();
    var ifrm = document.getElementById('resultado');
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(html.documentElement.outerHTML);
    ifrm.document.close();
    //console.log(html.documentElement.outerHTML);
    //arr = search_escala(aeroportos_origem.concat(aeroportos_destino));
    //array_voos_to_xml_voos(arr);
}

function xslt_apply() {
    var processor = new XSLTProcessor();
    var xsl;
    $.ajax({
        url: 'resultados/xsl/voos.xsl',
        async: false,
        type: "GET",
        success: function(data) {
            xsl = data;
        }
    });
    processor.importStylesheet(xsl);
    return processor.transformToDocument(result);
}

function search_escala(aeroportos) {
    var arr = [];
    var xpath = '//voo[' + conditions + ' and ' + xpath_in('origem', aeroportos_origem) + ' and not' + xpath_in('destino', aeroportos) + ']';  
    var voos, voo, xml;
    
    for(var cia in xmlsvoos) {
        xml = xmlsvoos[cia];
        voos = document.evaluate(xpath, xml.documentElement, null, XPathResult.ANY_TYPE, null);
        while(voo = voos.iterateNext()) {
            arr.push({
                node: voo,
                cia: cia 
            });
        }     
    }
}

function begin() {
    get_param();
    conditions = 'datasaida="'+par.ida+'" and passagens>="'+par.pessoas+'"';
    if(par['tipo-origem'] == 'A') {
        aeroportos_origem.push(par.origem);
    } else {
        aeroportos_origem = busca_aeroporto(par.origem);
    }
    if(par['tipo-destino'] == 'A') {
        aeroportos_destino.push(par.destino);
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