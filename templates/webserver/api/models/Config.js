/**
* Config.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	migrate: 'alter',

  attributes: {
	//_title: 'Configuration',
	//_dialog_width: '30em',
	//_card_width: '60em',  
	//_btn_left: '20px', 		
	//_columns: 'disabled', 	
	//_new: 'enabled',
	//_edit: 'enabled',
	//_display: 'disabled',
	//_delete: 'enabled',
	//_print: 'enabled',
	//_download: 'enabled',
	//_ga: 'disabled',
	id: {
		//description: 'Id',
		//hide: true,
		type: "integer",
		primaryKey: true,
		autoIncrement: true,
		unique: true
	},
	item: {
		//description: 'Item',
		type: 'string',
		required: true
	},
	description: {
		//description: 'Description',
		type: 'string',
		required: true
	},
	value: {
		//description: 'Value',
		type: 'string',
		required: true
	}
//End Attributes
  }
  ,afterCreate: function (created, next) { 
	sails.config.appConfig[created.item] = created.value
	next()
  }
  ,afterUpdate: function (updated, next) { 
	
	sails.config.appConfig[updated.item] = updated.value
	next()
  }
  ,afterDestroy: function (deleted, next) { 
	delete sails.config.appConfig[deleted[0].item]
	next()
  }
};

