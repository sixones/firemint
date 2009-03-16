function firemint_call()
{
	this.url;
	this.method;
	this.callback;
	this.view_callback;
	
	this.exposure_method;
	this.exposure_name;
	
	this.exposure_url = function()
	{
		if (this.exposure_name != '')
		{
			return this.url + "&method=" + this.exposure_name + ":" + this.exposure_method;
		}
		else
		{
			return this.url;
		}
	};
}