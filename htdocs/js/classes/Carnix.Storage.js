
/*	@name			StorageAPI
 *	@author			Michael Langford
 *	@namespace 		Carnix.Classes
 *	@description	Implements a local and session storage API
 *	@requires		jQuery 2+
 */

Carnix.StorageAPI = function(config){
	this.static = {};
	this.config = {};
	this.config = $.extend(true,this.config,config);
	this.config = $.extend(true,this.config,this.static);
	this.config.this = this;
};

Carnix.StorageAPI.prototype.Get = function(arguments){
	context = (context!="session"?"local":context);
	return eval(context+"Storage["+variable+"]");
}

Carnix.StorageAPI.prototype.Set = function(arguments){
	context = (context!="session"?"local":context);
	eval(context+"Storage["+variable+"] = "+variable);
}

//var Storage = new Carnix.Classes.StorageAPI({});
