function firemint_gui()
{
	this.mint;
	this.last_message = '';
	
	this.set_meta = function(str, isNotification)
	{
		if ($('firemint_meta').className.indexOf('has_notification') != -1 && !isNotification)
		{
			this.last_message = str;
			return;
		}
		
		$('firemint_meta').setAttribute('value', str);
		
		if (isNotification)
		{
			$('firemint_meta').setAttribute('class', 'has_notification');
		}
	};
	
	this.toggle_meta = function()
	{
		if (this.last_message != '' && $('firemint_meta').className.indexOf('has_notification') != -1)
		{
			$('firemint_meta').setAttribute('value', this.last_message);
		}
	};
	
	this.add_menu_split = function(menu, before, id)
	{
		var el = document.createElement('menuseparator');
		
		if (id)
		{
			el.setAttribute('id', id);
		}
		
		if (before)
		{
			$(menu).appendChild(el);
		}
		else
		{
			$(menu).insertBefore(el, $(menu).childNodes[0]);
		}
	};
	
	this.add_menu_item = function(menu, label, callback, before, id)
	{
		var el = document.createElement('menuitem');
		el.setAttribute('label', label);
		
		if (callback)
		{
			el.onclick = callback;
		}

		if (id)
		{
			el.setAttribute('id', id);
		}

		if (before)
		{
			$(menu).appendChild(el);
		}
		else
		{
			$(menu).insertBefore(el, $(menu).childNodes[0]);
		}
	};
	
	this.add_menu_menu = function(menu, id, label, before)
	{
		if (menu == null) { alert('menu is null!? ' + id); return; }
		var el = document.createElement('menu');
		el.setAttribute('label', label);
		
		var elPopup = document.createElement('menupopup');
		elPopup.setAttribute('id', id);
		
		el.appendChild(elPopup);
		
		if (before)
		{
			$(menu).insertBefore(el, $(menu).childNodes[0]);
		}
		else
		{
			$(menu).appendChild(el);
		}

	};
}