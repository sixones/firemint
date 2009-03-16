var s = new firemint_settings_pane;

function firemint_settings_pane()
{
	this.current_mint;
	
	this.init = function()
	{
		f.init(true);
		
		s.setup();
	};
	
	this.load_debug_pane = function()
	{
		var str = '';
		
		debug(firemint_logs.length + ' log messages to load.');
		
		for (var i = 0; i < firemint_logs.length; i++)
		{
			var log = firemint_logs[i];
			
			str += '@' + log.date.toString() + '\n' + log.message + '\n\n';
		}
		
		$('firemint_settings_debug_text').setAttribute('value', str);
	};
	
	this.setup = function()
	{
		debug('removing child ...' + document.getElementById('firemint_mints_list').childNodes.length);
		
		f.settings.reload_mints();
		
		// clear the list first
		if (f.settings.mints.length > 0)
		{
			while ($('firemint_mints_list').firstChild)
			{
			    $('firemint_mints_list').removeChild($('firemint_mints_list').firstChild);
			}
		
			// now populate
			for (var i = 0; i < f.settings.mints.length; i++)
			{
				var mint = f.settings.mints[i];
			
				debug(f.settings.mints.length);
				debug(mint);
			
				var row = document.createElement('row');
				row.setAttribute('onclick', 's.edit_mint(this, ' + i + ');');
				row.setAttribute('api', mint.api_key);
			
				var checkbox = document.createElement('checkbox');
				checkbox.setAttribute('checked', 'true');
			
				var spacer = document.createElement('spacer');
			
				var label = document.createElement('label');
				label.setAttribute('value', mint.url);
			
				row.appendChild(checkbox);
				row.appendChild(spacer);
				row.appendChild(label);
			
				if (mint.is_default)
				{
					var default_label = document.createElement('label');
					default_label.setAttribute('value', '(default)');
					default_label.setAttribute('style', 'color: #ED008C')
				
					row.appendChild(default_label);
				}
			
				debug('adding mint with url -> ' + mint.url + ' api -> ' + mint.api_key + ' default -> ' + mint.is_default);
			
				$('firemint_mints_list').appendChild(row);
			}
		}
		
		this.load_debug_pane();
	};
	
	this.get_current_values = function()
	{
		var obj = new firemint_mint;
		
		obj.api_key = $('api_key').value;
		obj.url = $('url').value;
		obj.is_default = $('default').checked;
		
		return obj;
	};
	
	this.clear_mint = function()
	{
		$('add_mint_button').style.display = 'block';
		$('save_mint_button').style.display = 'none';
		
		$('api_key').value = '';
		$('url').value = '';
		$('default').setAttribute('checked', '');
		
		if (this.current_mint != null && this.current_mint.el != null)
		{
			this.current_mint.el.className = this.current_mint.el.className = '';
		}
		
		this.current_mint = null;
	};
	
	this.clear_default = function()
	{
		var new_mints = new Array();
		
		for (var i = 0; i < f.settings.mints.length; i++)
		{
			var mint = f.settings.mints[i];
			
			mint.is_default = false;
			new_mints.push(mint);
		}
		
		f.settings.mints = new_mints;
	};
	
	this.edit_mint = function(el, index)
	{
		$('add_mint_button').style.display = 'none';
		$('save_mint_button').style.display = 'block';
		
		if (this.current_mint != null && this.current_mint.el != null)
		{
			this.current_mint.el.className = this.current_mint.el.className = '';
		}
		
		this.current_mint = f.settings.mints[index];
		this.current_mint.i = index;
		this.current_mint.el = el;
		
		this.current_mint.el.className = 'selected';
		
		$('api_key').value = this.current_mint.api_key;
		$('url').value = this.current_mint.url;
		$('default').checked = this.current_mint.is_default ? 'checked' : '';
	};
	
	this.save_mint = function()
	{
		$('add_mint_button').style.display = 'block';
		$('save_mint_button').style.display = 'none';
		
		var mint = this.get_current_values();
		var new_mints = new Array();
		
		if (mint.is_default)
		{
			this.clear_default();
		}
		
		for (var i = 0; i < f.settings.mints.length; i++)
		{
			if (this.current_mint.i != i)
			{
				new_mints.push(f.settings.mints[i]);
			}
		}
		
		new_mints.push(mint);
		
		f.settings.mints = null;
		f.settings.mints = new_mints;
		f.settings.save_mints();
		
		this.clear_mint();
		
		this.setup();
	};
	
	this.add_mint = function()
	{
		var mint = this.get_current_values();
		
		if (mint.is_default)
		{
			this.clear_default();
		}
		
		f.settings.mints.push(mint);
		f.settings.save_mints();
		
		this.setup();
	};
}

window.addEventListener("load", function()
{
	s.init();
}, false);
