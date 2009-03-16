function firemint_settings()
{
	//this.api_key = null;
	//this.url = null;
	//this.api_url = null;
	this.mints = new Array();
	this.meta_string = null;
	this.update_tick = 5;
	this.debug = false;

	this.pref_manager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefService);
	this.pref_branch = this.pref_manager.getBranch("extensions.firemint.");
	
	this.old_settings = new Array();
	this.is_updating = false;
	
	this.init = function()
	{
		this.load();
		this.register();
	};
	
	this.set_pref = function(key, val)
	{
		switch (typeof(val))
		{
			case 'object':
				this.pref_branch.setCharPref(key, serialize(val));
				break;
			case 'string':
				this.pref_branch.setCharPref(key, val);
				break;
			case 'int':
				this.pref_branch.setIntPref(key, val);
				break;
			case 'boolean':
				this.pref_branch.setBoolPref(key, val);
				break;
		}
	};
	
	this.save_mints = function()
	{
		var mints_to_save = new Array();
		
		// sort mints!
		this.mints.sort(function(obj1, obj2)
		{
			return (obj1 - obj2);
		});
		
		for (var i = 0; i < this.mints.length; i++)
		{
			var obj = new firemint_stdobj;
			obj.url = this.mints[i].url;
			obj.api_key = this.mints[i].api_key;
			obj.is_default = this.mints[i].is_default;
			
			mints_to_save.push(obj);
		}
		
		this.set_pref('mints', mints_to_save);
	};
	
	this.reload_mints = function()
	{
		if (this.pref_branch.prefHasUserValue("mints"))
		{	
			var a = unserialize(this.pref_branch.getCharPref('mints'));
			
			if (a != null)
			{
				this.mints = new Array();
				
				for (var i = 0; i < a.length; i++)
				{
					//var current_mint = a[i];
					
					var current_mint = new firemint_mint;
					current_mint.url = a[i].url;
					current_mint.api_key = a[i].api_key;
					current_mint.is_default = a[i].is_default;
					current_mint.api_url = a[i].url + "pepper/84degrees/expose/api.php?errors&api=" + current_mint.api_key;
					
					this.mints.push(current_mint);
				}
			}
		}
	};
	
	this.load = function()
	{
		this.meta_string = this.pref_branch.prefHasUserValue("meta_string") ? this.pref_branch.getCharPref('meta_string') : "U -> %vs_u T -> %vs_t";
		this.update_tick = this.pref_branch.prefHasUserValue("update_tick") ? this.pref_branch.getIntPref('update_tick') : 5;
		this.debug = this.pref_branch.prefHasUserValue("debug") ? this.pref_branch.getBoolPref('debug') : false;
		
		this.reload_mints();
		
		//this.api_key = this.pref_branch.prefHasUserValue("api_key") ? this.pref_branch.getCharPref('api_key') : null;
		//this.url = this.pref_branch.prefHasUserValue("url") ? this.pref_branch.getCharPref('url') : null;
		//this.api_url = this.url + "pepper/84degrees/expose/api.php?errors&api=" + this.api_key;
	};
	
	this.has_one = function()
	{
		if (this.mints.length > 0) 
		{
			for (var i = 0; i < this.mints.length; i++)
			{
				if (!(!this.mints[i].url) && !(!this.mints[i].api_key))
				{
					return true;
				}
			}
			
			return false;
		}
		
		return !(!this.url) && !(!this.api_key);
	};
	
	this.should_repopulate = function()
	{
		if (!this.is_updating)
		{
			if (this.old_settings['api_url'] != this.api_key
				|| this.old_settings['meta_string'] == this.meta_string)
			{
				this.is_updating = true;
				
				var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);
				var windowEnumerator = windowMediator.getEnumerator("navigator:browser");
				var isFirstWindow = (windowEnumerator.getNext() == window);

				if (isFirstWindow) {
					f.load_data();
				}
			}
		}
	};
	
	this.get_meta = function(obj)
	{
		var meta = this.meta_string;
		
		meta = meta.replace('%vs_u', obj.visits_since.unique).replace('%vs_t', obj.visits_since.total);
		meta = meta.replace('%vph_u', obj.visits_since.unique).replace('%vph_t', obj.visits_since.total);
		
		return meta;
	};
	
	// preference observer code ...
	this.register = function()
	{
		this.pref_branch.QueryInterface(Components.interfaces.nsIPrefBranch2);
		this.pref_branch.addObserver("", this, false);
	};
	
	this.unregister = function()
	{
		if (!this.pref_branch) return;
		this.pref_branch.removeObserver("", this);
	}
	
	this.observe = function(subject, topic, data)
	{
		if (topic != "nsPref:changed") return;
		
		this.old_settings['api_key'] = this.api_key;
		this.old_settings['url'] = this.url;
		this.old_settings['api_url'] = this.api_url;
		this.old_settings['meta_string'] = this.meta_string;
		this.old_settings['update_tick'] = this.update_tick;
		this.old_settings['debug'] = this.debug;
		
		this.load();
		this.should_repopulate();
	}
};

/** FROM http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_serialize/ **/

function serialize( inp ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Arpad Ray (mailto:arpad@php.net)
    // *     example 1: serialize(['Kevin', 'van', 'Zonneveld']);
    // *     returns 1: 'a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}'
 
    var getType = function( inp ) {
        var type = typeof inp, match;
        if(type == 'object' && !inp)
        {
            return 'null';
        }
        if (type == "object") {
            if(!inp.constructor)
            {
                return 'object';
            }
            var cons = inp.constructor.toString();
            if (match = cons.match(/(\w+)\(/)) {
                cons = match[1].toLowerCase();
            }
            var types = ["boolean", "number", "string", "array"];
            for (key in types) {
                if (cons == types[key]) {
                    type = types[key];
                    break;
                }
            }
        }
        return type;
    };
 
    var type = getType(inp);
    var val;
    switch (type) {
        case "undefined":
            val = "N";
            break;
        case "boolean":
            val = "b:" + (inp ? "1" : "0");
            break;
        case "number":
            val = (Math.round(inp) == inp ? "i" : "d") + ":" + inp;
            break;
        case "string":
            val = "s:" + inp.length + ":\"" + inp + "\"";
            break;
        case "array":
            val = "a";
        case "object":
            if (type == "object") {
                var objname = inp.constructor.toString().match(/(\w+)\(\)/);
                if (objname == undefined) {
                    return;
                }
                objname[1] = serialize(objname[1]);
                val = "O" + objname[1].substring(1, objname[1].length - 1);
            }
            var count = 0;
            var vals = "";
            var okey;
            for (key in inp) {
                okey = (key.match(/^[0-9]+$/) ? parseInt(key) : key);
                vals += serialize(okey) +
                        serialize(inp[key]);
                count++;
            }
            val += ":" + count + ":{" + vals + "}";
            break;
    }
    if (type != "object" && type != "array") val += ";";
    return val;
}

/** FROM http://kevin.vanzonneveld.net/techblog/article/javascript_equivalent_for_phps_unserialize/ **/

function unserialize( inp ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Arpad Ray (mailto:arpad@php.net)
    // +   improved by: Pedro Tainha (http://www.pedrotainha.com)
    // +   bugfixed by: dptr1988
    // *     example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}');
    // *     returns 1: ['Kevin', 'van', 'Zonneveld']
 
    error = 0;
    if (inp == "" || inp.length < 2) {
        errormsg = "input is too short";
        return;
    }
    var val, kret, vret, cval;
    var type = inp.charAt(0);
    var cont = inp.substring(2);
    var size = 0, divpos = 0, endcont = 0, rest = "", next = "";
 
    switch (type) {
    case "N": // null
        if (inp.charAt(1) != ";") {
            errormsg = "missing ; for null";
        }
        // leave val undefined
        rest = cont;
        break;
    case "b": // boolean
        if (!/[01];/.test(cont.substring(0,2))) {
            errormsg = "value not 0 or 1, or missing ; for boolean";
        }
        val = (cont.charAt(0) == "1");
        rest = cont.substring(2);  //changed...
        break;
    case "s": // string
        val = "";
        divpos = cont.indexOf(":");
        if (divpos == -1) {
            errormsg = "missing : for string";
            break;
        }
        size = parseInt(cont.substring(0, divpos));
        if (size == 0) {
            if (cont.length - divpos < 4) {
                errormsg = "string is too short";
                break;
            }
            rest = cont.substring(divpos + 4);
            break;
        }
        if ((cont.length - divpos - size) < 4) {
            errormsg = "string is too short";
            break;
        }
        if (cont.substring(divpos + 2 + size, divpos + 4 + size) != "\";") {
            errormsg = "string is too long, or missing \";";
        }
        val = cont.substring(divpos + 2, divpos + 2 + size);
        rest = cont.substring(divpos + 4 + size);
        break;
    case "i": // integer
    case "d": // float
        var dotfound = 0;
        for (var i = 0; i < cont.length; i++) {
            cval = cont.charAt(i);
            if (isNaN(parseInt(cval)) && !(type == "d" && cval == "." && !dotfound++)) {
                endcont = i;
                break;
            }
        }
        if (!endcont || cont.charAt(endcont) != ";") {
            errormsg = "missing or invalid value, or missing ; for int/float";
        }
        val = cont.substring(0, endcont);
        val = (type == "i" ? parseInt(val) : parseFloat(val));
        rest = cont.substring(endcont + 1);
        break;
    case "a": // array
        if (cont.length < 4) {
            errormsg = "array is too short";
            return;
        }
        divpos = cont.indexOf(":", 1);
        if (divpos == -1) {
            errormsg = "missing : for array";
            return;
        }
        size = parseInt(cont.substring(1*divpos, 0));  //changed...
        cont = cont.substring(divpos + 2);
        val = new Array();
        if (cont.length < 1) {
            errormsg = "array is too short";
            return;
        }
        for (var i = 0; i + 1 < size * 2; i += 2) {
            kret = unserialize(cont, 1);
            if (error || kret[0] == undefined || kret[1] == "") {
                errormsg = "missing or invalid key, or missing value for array";
                return;
            }
            vret = unserialize(kret[1], 1);
            if (error) {
                errormsg = "invalid value for array";
                return;
            }
            val[kret[0]] = vret[0];
            cont = vret[1];
        }
        if (cont.charAt(0) != "}") {
            errormsg = "missing ending }, or too many values for array";
            return;
        }
        rest = cont.substring(1);
        break;
    case "O": // object
        divpos = cont.indexOf(":");
        if (divpos == -1) {
            errormsg = "missing : for object";
            return;
        }
        size = parseInt(cont.substring(0, divpos));
        var objname = cont.substring(divpos + 2, divpos + 2 + size);
        if (cont.substring(divpos + 2 + size, divpos + 4 + size) != "\":") {
            errormsg = "object name is too long, or missing \":";
            return;
        }
        var objprops = unserialize("a:" + cont.substring(divpos + 4 + size), 1);
        if (error) {
            errormsg = "invalid object properties";
            return;
        }
        rest = objprops[1];
        var objout = "function " + objname + "(){";
        for (key in objprops[0]) {
            objout += "this['" + key + "']=objprops[0]['" + key + "'];";
        }
        objout += "}val=new " + objname + "();";
        eval(objout);
        break;
    default:
        errormsg = "invalid input type";
    }
    return (arguments.length == 1 ? val : [val, rest]);
}