/**
* Account.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	//migrate: "alter",

  attributes: {
	//_ga: 'enabled',
	//_card_width: '60em',
	//_btn_left: '30px',
	id: {
		//description: 'Id',
		type: "integer",
		primaryKey: true,
		autoIncrement: true,
		unique: true
	},
	name: {
		//description: 'Name',
		type: "string"
	},
	users: {
		//description: "Users",
		type: "integer"
	}
//End Attributes
  }
};

