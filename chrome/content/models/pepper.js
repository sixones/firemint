function firemint_pepper()
{
	this.name;
	this.version;
	this.url;
	this.description;
	this.developer_name;
	this.developer_url;
	
	this.unique_name;
	
	this.nice_version = function()
	{
		return this.version.substr(0, 1) + '.' + this.version.substr(1);
	};
}