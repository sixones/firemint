var f = new firemint;
var firemint_logs = new Array();
var firemint_version = '2.0.1.9';

function firemint()
{
	this.mint;
	this.gui;
	this.exposures;
	this.parse;
	this.settings;
	this.view;
	this.launcher;
	this.request;
	this.logs = new Array();
	this.apps = new Array();
	this.notifications = new Array();
	
	this.timers_are_setup = false;
	
	this.init = function(manualDataLoad)
	{
		this.mint = new firemint_mint;
		this.gui = new firemint_gui;
		this.exposures = new firemint_exposures;
		this.request = new firemint_request;
		
		this.settings = new firemint_settings;
		
		this.launcher = new firemint_launcher;
		
		this.parse = new firemint_parse;
		this.view = new firemint_view;
		
		this.gui.mint = this.mint;
		
		this.settings.init();
		this.mint.settings = this.settings;
		
		this.mint.init();
		
		if (!manualDataLoad)
		{
			if (f.settings.debug)
			{
				f.gui.set_meta('setting up for debug ...');
				debug('debug mode enabled.');
			}
			else
			{
				f.gui.set_meta('waiting ...');
			}
			
			setTimeout(function()
			{
				f.load_data();
			}, 2000);
		}
	};
	
	this.timer_setup = function(alreadyDone)
	{
		alreadyDone = (alreadyDone == null ? !this.timers_are_setup : alreadyDone);
		debug('setting up timer -> ' + alreadyDone);
		if (this.settings.has_one() && alreadyDone)
		{
			this.timers_are_setup = true;
			
			setTimeout(function()
			{
				f.timer_setup(true);
				f.timer_tick();
			}, this.settings.update_tick * 60 * 1000);
			
			debug('timer set for: ' + f.settings.update_tick * 60 * 1000);
		}
	};
	
	this.add_notification = function(msg)
	{
		for (var i = 0; i < this.notifications.length; i++)
		{
			if (this.notifications[i].identifier == msg.identifier)
			{
				return;
			}
		}
		
		this.notifications.push(msg);
		
		this.view.update_notifications_menu();
	}
	
	this.get_app = function(name)
	{
		for (var i = 0; i < this.apps.length; i++)
		{
			if (this.apps[i].name == name)
			{
				return this.apps[i];
			}
		}
		
		return null;
	};
	
	this.timer_tick = function()
	{
		debug('TIMER TICK');
		
		this.load_data();
	};
	
	this.load_data = function()
	{
		if (navigator.onLine == true)
		{
			if (this.settings.has_one())
			{
				//this.view.clear_mint_menu();
				this.exposures.run_for_mints();

				this.gui.set_meta('updating ...');
			}
			else
			{
				this.gui.set_meta('please define a mint installation ...');
			}
		}
		else
		{
			this.gui.set_meta('network offline');
		}
	};
	
	this.get_default_mint = function()
	{
		if (this.settings.mints.length > 0)
		{
			for (var i = 0; i < this.settings.mints.length; i++)
			{
				if (this.settings.mints[i].is_default)
				{
					return this.settings.mints[i];
				}
			}
		
			return this.settings.mints[0];
		}
		else
		{
			return null;
		}
	};
	
	/*
	this.load_view = function()
	{
		this.gui.add_menu_menu('mint_84degrees', 'mint_84degrees_referrers', 'Referrers');
		this.gui.add_menu_menu('mint_84degrees', 'mint_84degrees_searches', 'Searches');
		this.gui.add_menu_menu('mint_84degrees', 'mint_84degrees_user_agents', 'User Agents');
		this.gui.add_menu_menu('mint_84degrees', 'mint_84degrees_pages', 'Pages');
		
		this.gui.add_menu_menu('mint_84degrees', 'mint_84degrees_visits', 'Visits');
		this.gui.add_menu_menu('mint_84degrees_visits', 'mint_84degrees_visits_since', 'Since ' + this.mint.install_date);
		this.gui.add_menu_item('mint_84degrees_visits_since', 'Total: ' + this.mint.visits_since.total);
		this.gui.add_menu_item('mint_84degrees_visits_since', 'Unique: ' + this.mint.visits_since.unique);
	};
	*/
};

function $(id)
{
	return document.getElementById(id);
};

function $convert_month(i)
{
	var a = new Array("Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec");
	
	return a[i];
}

function $node_value(el, tagName, notFirstChild)
{
	debug('reached node_value; el: ' + el + ' tagName: ' + tagName);
	
	if (notFirstChild)
	{
		return el.getElementsByTagName(tagName).item(0).nodeValue;
	}
	
	if (el.getElementsByTagName(tagName).item(0).firstChild == null)
	{
		return '';
	}
	
	return el.getElementsByTagName(tagName).item(0).firstChild.nodeValue;
}

function $get_children(el, tagName, itemDepth)
{
	itemDepth = itemDepth == undefined ? 0 : itemDepth;
	
	if (!tagName)
	{
		return el.childNodes;
	}
	
	return el.getElementsByTagName(tagName).item(itemDepth).childNodes;
}

function $get_all(el, tagName)
{
	return el.getElementsByTagName(tagName);
}

function $clean(str)
{
	return str.replace(' ', '_').toLowerCase();
}

function $get_node(el, tagName)
{
	return el.getElementsByTagName(tagName).item(0);
}

function debug(aMsg) {
	if (f.settings.debug)
	{
		var obj = new firemint_stdobj;
		obj.message = aMsg;
		obj.date = new Date();
		
		firemint_logs.push(obj);
		
		setTimeout(function() { throw new Error("[debug] " + aMsg); }, 0);
	}
}