function firemint_mint()
{
	this.req = null;
	
	this.settings;
	this.current_stats = new Array();
	
	this.expose_version;
	this.version;
	this.name;
	this.is_default = false;
	this.install_date;
	this.full_url;
	
	this.peppers = new Array();
	this.visits_since;
	this.visits;
	
	this.last_checked;
	
	this.init = function()
	{
		//this.settings.init();
		this.visits_since = new firemint_visit;
	};
	
	this.nice_version = function()
	{
		return this.version.substr(0, 1) + '.' + this.version.substr(1);
	};
	
	this.clear_data = function()
	{
		this.visits = null;
		this.visits_since = new firemint_visit;
		this.peppers = new Array();
		this.current_stats = new Array();
	};
	
	/*
	// load data from expose
	this.load = function()
	{
		this.req = new XMLHttpRequest();
		this.req.onreadystatechange = f.mint.load_data;
		this.req.open("GET", f.mint.settings.api_url, true);
		this.req.overrideMimeType('text/xml');
		this.req.send(null);
	};
	
	this.load_data = function(e)
	{
		if (f.mint.req.readyState == 4)
		{
			if (f.mint.req.status == 200)
			{
				var doc = f.mint.req.responseXML.documentElement;

				f.mint.version = $node_value(doc, 'version');
				
				var date = new Date($node_value(doc, 'installdate') * 1000);
				f.mint.install_date = $convert_month(date.getMonth()) + ' \'' + date.getFullYear().toString().substr(2);
				
				
				var visits_since = $get_children($get_node(doc, 'data'), 'visits').item(0).firstChild;
				
				f.mint.visits_since = new firemint_visit;
				f.mint.visits_since.total = $node_value(visits_since, 'total');
				f.mint.visits_since.unique = $node_value(visits_since, 'unique');
				
				/*
				var visits_since = $get_children($get_node('doc', 'data'), 'visits')).item(0).firstChild;
				
				for (var i = 0; i < $get_children($get_node('doc', 'data'), 'visits')).length i++)
				{
					var visit = 
					
					if (i == 0)
					
					f.gui.set_meta('found: ' + i);
				}*/
				
				//f.gui.set_meta('found mint v' + f.mint.version.substr(0, 1) + '.' + f.mint.version.substr(1) + ' with ' + f.mint.peppers.length + ' peppers installed. u: ' + f.mint.visits_since.unique + ' h: ' + f.mint.visits_since.total);
				//f.load_view();
				/*
				return;
			}
		}
	};
	*/
}