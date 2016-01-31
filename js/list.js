var xmlaeroporto = null;
var xmlcidade = null;
var xsl = null;
var xmlsvoos = {
    gol: null,
    azul: null,
    tam: null
};
var conditions = '';
var aeroportos_origem = [];
var aeroportos_destino = [];
var par = {};
var result = document.implementation.createDocument('', 'resultado', null);

$.ajaxSetup({
    error: function(xhr, status, error) {
        console.error("An AJAX error occured: " + status + "\nError: " + error + "\nError detail: " + xhr.responseText);
    } 
});

$.get('data/aeroportos.xml', function(data){
    xmlaeroporto = data;
});
$.get('data/cidades.xml', function(data){
    xmlcidade = data;
});
$.get('../voos.xsl', function(data){
    xsl = data;    
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
    var aeroportos = [];
    (new XMLSelect(xmlaeroporto, '//aeroporto[cidade="'+cidade+'"]/sigla/text()')).run(function(a){
        aeroportos.push(a.data);
    });
    return aeroportos;
}

function nome_cidade(ibge) {
    var cid;
    (new XMLSelect(xmlcidade, '//cidade[ibge="'+ibge+'"]')).run(function(c) {
        cid = c.querySelector('nome').textContent + ' - ' + c.querySelector('uf').textContent;
    });
    return cid;
}

function nomes(sigla, serialized) {
    var obj = {};
    (new XMLSelect(xmlaeroporto, '//aeroporto[sigla="'+sigla+'"]')).run(function(a){
        obj.aeroporto = a.querySelector('nome').textContent    
        obj.cidade = nome_cidade(a.querySelector('cidade').textContent);    
    });
    
    if(!serialized) return obj;
    
    var s = obj.aeroporto + '<br/>' + obj.cidade;
    return s;
}

function voos_ready() {
    return !(xmlsvoos.gol === null || xmlsvoos.azul === null || xmlsvoos.tam === null);
}

function xpath_in(tag, values, notin) {
    return (notin?'not ':'') + '(' + tag + '="' + values.join('" or ' + tag + '="') + '")';
}

function new_node(tag, content) {
    var node = result.createElement(tag);
    node.textContent = content || '';
    return node;
}

function array_voos_to_xml_voos(escalas) {
    escalas.forEach(function(esc) {
        var escala = result.createElement('escala');
        escala.setAttribute('escalas', (esc.voos.length-1)+'');
        escala.setAttribute('companhia', esc.cia);
        esc.voos.forEach(function(v){
            var el = result.createElement('operadora');
            el.textContent = v.cia;
            v.appendChild(el);
            
            var o = nomes(v.querySelector('origem').textContent);
            var d = nomes(v.querySelector('destino').textContent);
            
            v.appendChild(new_node('aeroportoorigem', o.aeroporto));
            v.appendChild(new_node('cidadeorigem', o.cidade));
            v.appendChild(new_node('aeroportodestino', d.aeroporto));
            v.appendChild(new_node('cidadedestino', d.cidade));    
            
            escala.appendChild(v);     
        });
        
        var attr = ['origem', 'aeroportoorigem', 'cidadeorigem'];
        attr.forEach(function(a) {
            escala.setAttribute(a, escala.firstChild.querySelector(a).textContent);
        });
        
        attr = ['destino', 'aeroportodestino', 'cidadedestino'];
        attr.forEach(function(a) {
            escala.setAttribute(a, escala.lastChild.querySelector(a).textContent);
        });   
        
        result.documentElement.appendChild(escala);     
    });
}


function NotFoundInXml() {};

function XMLSelect(xml, xpath) {
	this.xml = xml;
	this.xpath = xpath;
	this.run = function(closure) {
        var r;
		var registros = document.evaluate(xpath, xml.documentElement, null, XPathResult.ANY_TYPE, null);
		var idx = 0;
		while(r = registros.iterateNext()) {
			closure(r, idx, registros);
			idx++;
		}
	}
}

function search(origem, path, companhia) {
    var escalas = new Array();
    var xpath = '//voo[' + conditions + ' and ' + xpath_in('origem', origem) + ' and ' + xpath_in('destino', path, true) +']';
    for(var cia in xmlsvoos) {
        if(companhia === undefined || cia === companhia) {
            (new XMLSelect(xmlsvoos[cia], xpath)).run(function(voo) {
                var destino = voo.querySelector('destino').textContent;
                if(aeroportos_destino.indexOf(destino) != -1) {
                    escalas.push({
                        cia: cia,
                        voos: [voo]
                    });
                } else {
                    var next = search([destino], path.concat(destino), cia);
                    if(!(next instanceof NotFoundInXml)){
                        var aux;
                        for(var i=0, e; e=next[i]; i++) {
                            aux = e.voos.slice(0);
                            aux.splice(0, 0, voo);
                            escalas.push({
                                voos: aux,
                                cia: cia
                            });
                        };
                    }
                }
            });
        }
    }
    if(path.length != 0) {
        if(escalas.length == 0) {
            return new NotFoundInXml();
        }
    }
    return escalas;
}

function prepare_result(arr) {
    array_voos_to_xml_voos(arr);	
    var pesquisa = new_node('pesquisa');
    var origem = new_node('origem');
    var destino = new_node('destino');
    
    if(par['tipo-origem'] == 'A') {
        origem.appendChild(new_node('name1', par.origem));    
        origem.appendChild(new_node('name2', nomes(par.origem, true)));    
    } else {
        origem.appendChild(new_node('name1', nome_cidade(par.origem)));    
        origem.appendChild(new_node('name2', ''));
    }
    if(par['tipo-destino'] == 'A') {
        destino.appendChild(new_node('name1', par.destino));    
        destino.appendChild(new_node('name2', nomes(par.destino, true)));    
    } else {
        destino.appendChild(new_node('name1', nome_cidade(par.destino)));    
        destino.appendChild(new_node('name2', ''));
    }    
    
    pesquisa.appendChild(origem);
    pesquisa.appendChild(destino);
    
    result.documentElement.appendChild(pesquisa);
}

function xslt_apply() {
    var processor = new XSLTProcessor();
    processor.importStylesheet(xsl);
    var html = processor.transformToDocument(result);
    var ifrm = document.getElementById('resultado');
    ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
    ifrm.document.open();
    ifrm.document.write(html.documentElement.outerHTML);
    ifrm.document.close();
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

    prepare_result(search(aeroportos_origem, []));
    xslt_apply();
}

function testxml(callback) {
    if (xmlaeroporto === null || xmlcidade === null || xsl === null || xmlsvoos.tam === null || xmlsvoos.azul === null || xmlsvoos.gol === null) {
        setTimeout(testxml, 100, callback);
        return;
    }
    callback();
}

testxml(begin);