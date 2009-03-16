function firemint_request()
{
	this.queue = new Array();
	this.waiting = false;
	this.req;
	
	this.next = function()
	{
		if (this.queue.length == 1)
		{
			f.view.update_started();
		}
		
		if(!this.waiting)
		{
			var call = this.queue.shift();
			
			if (call != undefined)
			{
				this.waiting = true;
				this.req = new XMLHttpRequest();
				
				setTimeout
				(
					function()
					{
						if (f.request.req.readyState != 4)
						{
							f.request.req.abort();
							f.request.waiting = false;
							f.request.has_finished(call);
							f.request.next();
						}
					},
					7000
				);
				
				if (call.callback)
				{
					this.req.onreadystatechange = function()
					{
						if (f.request.req.readyState == 4)
						{
							if (f.request.req.status == 200)
							{
								debug('reached callback for request.' + f.request.req.responseXML);
								
								f.request.check_data(f.request.req.responseXML, call);
								
								f.request.waiting = false;
								f.request.has_finished(call);
								f.request.next();
							}
						}
					}
				}
				
				debug('setting up request to ' + call.exposure_url());
				
				this.req.open(call.method, call.exposure_url(), true);
				this.req.overrideMimeType('text/xml');
				this.req.send(null);
			}
		}
	};
	
	this.check_data = function(xml, call)
	{
		//debug($node_value(xml, 'message', true));
		call.callback(xml, call);
	}
	
	this.done_finished = false;
	
	this.has_finished = function(call)
	{
		if (f.request.queue.length == 0 && !f.view.done_finished)
		{
			setTimeout(function()
			{
				if (f.request.queue.length == 0 && !f.view.done_finished)
				{
					f.request.done_finished = true;
					f.view.update_finished(call);
				}
			}, 2000);
		}
	};
	
	this.new = function(call)
	{
		this.done_finished = false;
		this.queue.push(call);
		this.next();
	};
	
	this.reload = function()
	{
		
	};
	
	this.init = function()
	{
		
	};
	
	this.step = function()
	{
		
	};
}