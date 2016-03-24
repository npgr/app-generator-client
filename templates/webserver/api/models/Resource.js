/**
* Resource.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	//migrate: 'safe',

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
	name: {
		//description: "Name",
		type:'string',
		required: true
	},
	method: {
		//description: 'Method',
		type: "string",
		enum: ["get","post","put","delete","all"]
		//,enumdes: ["GET","POST","PUT","DELETE","ALL"]
	},
	path: {
		//description: "Path",
		type:'string',
		required: true
	},
	type: {
		//description: 'Type',
		type: "string",
		enum: ["page","data","api","option","component"]
		//,enumdes: ["Page","Data","Api", "Option","Component"]
	},
	requireaut: {
		//description: 'Require Aut',
		type: 'string',
		enum: ["Yes", "No"]
		//,enumdes: ["Yes", "No"]
	}
//End Attributes
  }
};

