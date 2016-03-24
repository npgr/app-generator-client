/**
* ProfileResource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	//migrate: 'alter',

  attributes: {
	//_card_width: '60em',
	//_btn_left: '30px',
	//_ga: 'enabled',
	id: {
		//description: 'Id',
		type: "integer",
		primaryKey: true,
		autoIncrement: true,
		unique: true
	},
	profile: {
		//description: 'Profile',
		//key: id,
		//key_type: 'integer',
		//display: 'name',
		//type: 'string',
		model: 'Profile'
	},
	resource: {
		//description: 'Resource',
		//key: id,
		//key_type: 'integer',
		//display: 'name',
		//type: 'string',
		model: 'Resource'
	},
	order: {
		//description: 'Order',
		type: 'integer'
	},
	Group: {
		//description: 'Group',
		type: 'string'
	}
//End Attributes
  }
};

