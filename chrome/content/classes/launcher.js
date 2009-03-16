function firemint_launcher()
{
	this.settings = function()
	{
		var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"]
		                   .getService(Components.interfaces.nsIWindowMediator);
		var win = wm.getMostRecentWindow('firemint_settings_window');
		
		if (win)
		{
			win.focus();
		}
		else
		{
			window.openDialog("chrome://firemint/content/settings.xul", "firemint - settings", "chrome,centerscreen,height=340,width=550,resizable,scrollbars=yes"); // modal
		}
	};
	
	this.goTo = function(url)
	{
		gBrowser.selectedTab = gBrowser.addTab(url);
	};
	
	this.installExtension = function(url)
	{
		InstallTrigger.install({ "Firemint": { URL: url, IconURL: 'http://84degrees.com/builds/firemint/mint_icon_48.png', toString: function () { return this.URL; } } }); return false;
	};
	
	this.my_mint = function()
	{
		if (f.mint.has_one())
		{
			openUILink(f.mint.url, null, false, true);
		}
	};
	
	this.update_stats = function()
	{
		f.load_data();
	};
}