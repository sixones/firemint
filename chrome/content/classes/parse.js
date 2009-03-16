function firemint_parse()
{
	this.expose_update = function(xml, call)
	{
		f.apps = new Array(); // reset apps list
		
		// get firemint update info
	 	var firemint_app = new firemint_stdobj;
		firemint_app.name = 'firemint';
		firemint_app.version = $node_value($get_node(xml, 'firemint'), 'version');
		firemint_app.download_link = $node_value($get_node(xml, 'firemint'), 'update_download_link');
		firemint_app.direct_link = $node_value($get_node(xml, 'firemint'), 'update_direct_link');
		f.apps.push(firemint_app);
		
		// get expose update info
		var expose_app = new firemint_stdobj;
		expose_app.name = 'expose';
		expose_app.version = $node_value($get_node(xml, 'expose'), 'version');
		expose_app.download_link = $node_value($get_node(xml, 'expose'), 'update_download_link');
		expose_app.direct_link = $node_value($get_node(xml, 'expose'), 'update_direct_link');
		f.apps.push(expose_app);
		
		call.view_callback(call);
	};
	
	this.mint_info = function(xml, call)
	{
		debug('starting parsing mint info');
		
		call.mint.expose_version = $node_value(xml, 'expose_version');
		call.mint.version = $node_value(xml, 'version');
		call.mint.name = $node_value(xml, 'sitedisplay');
		call.mint.full_url = $node_value(xml, 'installfull');

		var date = new Date($node_value(xml, 'installdate') * 1000);
		call.mint.install_date = $convert_month(date.getMonth()) + ' \'' + date.getFullYear().toString().substr(2);
		

		debug('finished parsing mint info');
		
		call.view_callback(call);
	};
	
	this.visits_data = function(xml, call)
	{
		var visits_since = $get_children(xml, 'visits').item(0).firstChild;
		
		call.mint.visits_since = new firemint_visit;
		call.mint.visits_since.total = $node_value(visits_since, 'total');
		call.mint.visits_since.unique = $node_value(visits_since, 'unique');
		
		call.view_callback(call);
	};
	
	this.peppers_info = function(xml, call)
	{
		for (var i = 0; i < $get_all(xml, 'object').length; i++)
		{
			var pepper = $get_all(xml, 'object').item(i);
			
			var pepper_info = $get_node(pepper, 'info');
			var pepper_obj = new firemint_pepper;
			
			pepper_obj.name = $node_value(pepper_info, 'peppername');
			pepper_obj.version = $node_value(pepper, 'version');
			pepper_obj.url = $node_value(pepper_info, 'pepperurl');
			pepper_obj.description = $node_value(pepper_info, 'pepperdesc');
			pepper_obj.developer_name = $node_value(pepper_info, 'developername');
			pepper_obj.developer_url = $node_value(pepper_info, 'developerurl');

			pepper_obj.unique_name = pepper_obj.name.replace(' ', '_').toLowerCase();

			call.mint.peppers.push(pepper_obj);
		}
		
		call.view_callback(call);
	};
}