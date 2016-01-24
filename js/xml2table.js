function initCap(str){
   return str.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
   });
}

function dotable(columns, data){
	var t = document.createElement("table");
	t.classList.add("table");		
	t.classList.add("table-responsive");		
	t.classList.add("table-striped");
	t.classList.add("table-bordered");
	
	var h = document.createElement("thead");
	var r = document.createElement("tr");
	
	var c;		
	columns.forEach(function(col){
		c = document.createElement("th");
		c.textContent = initCap(col);
		r.appendChild(c);
	});
	h.appendChild(r);
	t.appendChild(h);
	
	var b = document.createElement("tbody");
	data.forEach(function(row){
		r = document.createElement("tr");
		columns.forEach(function(col){
			c = document.createElement("td");
			if(row.hasOwnProperty(col)){
                
				c.textContent = row[col];
			}
			r.appendChild(c);
		});
		b.appendChild(r);
	});
	t.appendChild(b);
	return t;
}

function xml2table(xml, record_tag){
	var columns = [];
	var data = [];
	var recorddata;
	var r = xml.evaluate("//"+record_tag, xml.documentElement, null, XPathResult.ANY_TYPE, null);
	var i;
	while(i = r.iterateNext()){
		if(i.children){
			recorddata = {};
            //dbg = i.children;
            for(var j = 0, c; c = i.children[j]; j++){
			//i.chidren.forEach(function(c){
				if(columns.indexOf(c.tagName) == -1){
					columns.push(c.tagName);
				}
				recorddata[c.tagName] = c.textContent;
			}	
			data.push(recorddata);
		} else {
			if(columns.indexOf(record_tag) == -1){
				columns.push(record_tag);
			}
			data.push(i.textContent);
		}
	}
	return dotable(columns, data);
}