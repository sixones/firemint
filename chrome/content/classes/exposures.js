function firemint_exposures()
{
	this.req;
	
	this.run_for_mints = function()
	{
		for (var i = 0; i < f.settings.mints.length; i++)
		{
			this.run_for_mint(f.settings.mints[i]);
		}
		
		// also we want to;
		// check for external services (like feedburner stats)
		
		// check for expose + firemint update!
		this.load('', '', null, f.parse.expose_update, f.view.expose_update, 'https://84degrees.com/builds/update.xml');
	};
	
	this.run_for_mint = function(mint)
	{
		//this.exposures.load('update', 'has', this.parse.expose_update, this.view.expose_update, 'https://84degrees.com/builds/expose/update.php?min');
		this.load('mint', 'info', mint, f.parse.mint_info, f.view.mint_menu);
		this.load('visits', 'fetch', mint, f.parse.visits_data, f.view.visits_menu);
		this.load('peppers', 'fetch', mint, f.parse.peppers_info, f.view.peppers_menu);
	};
	
	this.load = function(exposure, method, mint, callback, view_callback, url)
	{
		this.req = new XMLHttpRequest();
		
		debug('fetching ' + exposure + '->' + method);

		if (!url)
		{
			url = mint.api_url;
		}

		var call = new firemint_call;

		call.mint = mint;
		call.url = url;
		call.method = "GET";
		call.callback = callback;
		call.view_callback = view_callback;
		
		call.exposure_method = method;
		call.exposure_name = exposure;

		f.request.new(call);

		/*
		this.req.open("GET", f.mint.settings.api_url, true);
		this.req.overrideMimeType('text/xml');
		this.req.send(null);
		
		debug('reached here');
		
		if (this.req.readyState == 4)
		{
			debug('status reached 4');
			if (this.req.status == 200)
			{
				debug('api request succesful for ' + exposure + '->' + method);
				debug('callback is; ' + callback + ' view: ' + view_callback);
				callback(this.req.responseXML.documentElement, view_callback);
				debug('wtff?');
			}
		}
		*/
	};
}