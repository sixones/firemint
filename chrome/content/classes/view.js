function firemint_view()
{
	this.last_checked_date = new Date();

	this.expose_update = function(call)
	{
		// check if any of the expose peppers on the mints need an update
		for (var i = 0; i < f.settings.mints.length; i++)
		{
			var mint = f.settings.mints[i];
			
			debug('-- checking ' + mint.name + ' expose v: ' + mint.expose_version + ' latest v: ' + f.get_app('expose').version);
			
			if (mint.expose_version < f.get_app('expose').version)
			{
				var msg = new firemint_stdobj;
				msg.identifier = 'update:expose:' + mint.name;
				msg.app = 'expose';
				msg.text = 'New version of Expose is available for ' + mint.name; //+ '. Currently using v' + mint.expose_version + ', new version is v' + f.get_app('expose').version;
				msg.direct_link = f.get_app('expose').direct_link;
				msg.download_link = f.get_app('expose').download_link;
				
				f.add_notification(msg);
			}
		}
		
		debug('-- checking firemint v: ' + firemint_version + ' latest v: ' + f.get_app('firemint').version);
		
		// check firemint version
		if (firemint_version < f.get_app('firemint').version)
		{
			var msg = new firemint_stdobj;
			msg.identifier = 'update:firemint';
			msg.app = 'firemint';
			msg.text = 'Firemint v' + f.get_app('firemint').version + ' is available';
			msg.direct_link = f.get_app('firemint').direct_link;
			msg.download_link = f.get_app('firemint').download_link;
			
			f.add_notification(msg);
		}
	};

	this.update_notifications_menu = function()
	{
		// clear the menu
		while ($('firemint_menu_notifications').firstChild)
		{
			$('firemint_menu_notifications').removeChild($('firemint_menu_notifications').firstChild);
		}
		
		$('firemint_menu_notifications_label').setAttribute('label', 'Notifications (' + f.notifications.length + ')');
		
		for (var i = 0; i < f.notifications.length; i++)
		{
			var notification = f.notifications[i];
			
			if (notification.type == 'firemint')
			{
				f.gui.add_menu_item('firemint_menu_notifications', notification.text, function() { f.launcher.installExtension(notification.direct_link) });
			}
			else
			{
				f.gui.add_menu_item('firemint_menu_notifications', notification.text, function() { f.launcher.goTo(notification.download_link) });
			}
		}
		
		if (f.notifications.length == 1)
		{
			f.gui.set_meta(f.notifications.length + ' notification requires your attention', true);
		}
		else
		{
			f.gui.set_meta(f.notifications.length + ' notifications require your attention', true);
		}
	};

	this.mint_menu = function(call)
	{
		f.view.clear_mint_menu(call);
		
		f.gui.add_menu_menu('firemint_menu', 'mint_' + $clean(call.mint.name), call.mint.name, true);
		
		f.gui.add_menu_menu('mint_' + $clean(call.mint.name), 'mint_' + $clean(call.mint.name) + '_mint', 'Mint');
		
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_mint', 'Install Date: ' + call.mint.install_date);
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_mint', 'Url: ' + call.mint.full_url);
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_mint', 'Version: ' + call.mint.nice_version());
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_mint', 'Name: ' + call.mint.name);
	};
	
	this.visits_menu = function(call)
	{
		f.gui.add_menu_menu('mint_' + $clean(call.mint.name), 'mint_' + $clean(call.mint.name) + '_visits', 'Visits');
		
		f.gui.add_menu_menu('mint_' + $clean(call.mint.name) + '_visits', 'mint_' + $clean(call.mint.name) + '_visits_since', 'Since ' + call.mint.install_date);
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_visits_since', 'Total: ' + call.mint.visits_since.total);
		f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_visits_since', 'Unique: ' + call.mint.visits_since.unique);
	};
	
	this.peppers_menu = function(call)
	{	
		f.gui.add_menu_menu('mint_' + $clean(call.mint.name), 'mint_' + $clean(call.mint.name) + '_peppers', 'Peppers');
		
		for (var i = 0; i < call.mint.peppers.length; i++)
		{
			var pepper = call.mint.peppers[i];
			f.gui.add_menu_menu('mint_' + $clean(call.mint.name) + '_peppers', 'mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), pepper.name);
			
			f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), 'Developer Url: ' + pepper.developer_url);
			f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), 'Developer: ' + pepper.developer_name);
			f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), 'Url: ' + pepper.url);
			f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), 'Version: ' + pepper.nice_version());
			f.gui.add_menu_item('mint_' + $clean(call.mint.name) + '_peppers_' + $clean(pepper.name), 'Name: ' + pepper.name);
		}
	};
	
	this.clear_mint_menu = function(call)
	{
		if ($('mint_' + $clean(call.mint.name)))
		{
			call.mint.clear_data();
			
			$('mint_' + $clean(call.mint.name)).parentNode.parentNode.removeChild($('mint_' + $clean(call.mint.name)).parentNode);
		}
	};
	
	this.show_meta = function(call)
	{
		var mint = f.get_default_mint();
		f.gui.set_meta(f.settings.get_meta(mint));
	};
	
	this.update_last_checked = function(call)
	{
		var time = (this.last_checked_date.getHours().toString().length == 1 ? '0' : '') + this.last_checked_date.getHours();
		time += ':' + (this.last_checked_date.getMinutes().toString().length == 1 ? '0' : '') + this.last_checked_date.getMinutes();
		
		if($('firemint_menu_last_update_label'))
		{
			$('firemint_menu_last_update_label').setAttribute('value', 'Last Checked: ' + time);
			//$('firemint_menu_last_update_split').parentNode.removeChild($('firemint_menu_last_update_split'));
			//$('firemint_menu_last_update_label').parentNode.removeChild($('firemint_menu_last_update_label'));
		}
		else
		{
			f.gui.add_menu_split('firemint_menu', true, 'firemint_menu_last_update_split');
			f.gui.add_menu_item('firemint_menu', 'Last Checked: ' + time, null, true, 'firemint_menu_last_update_label');
		}
	};
	
	this.update_finished = function(call)
	{
		f.timer_setup();
		f.gui.set_meta('up2date');
		f.view.update_last_checked(call);
		f.view.show_meta(call);
		f.settings.is_updating = false;
	};
	
	this.update_started = function(call)
	{
		f.gui.set_meta('updating ...');
	};
}