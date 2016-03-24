/**
* Language.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
	//_title: 'Language',
	id: {
		//description: 'Id',
		//hide: true,
		type: "integer",
		primaryKey: true,
		autoIncrement: true,
		unique: true
	},
	language: {
		//description: 'Language',
		type: 'string',
		enum: ['en', 'es', 'pt', 'fr', 'de']
		//,enumdes: ['English', 'Spanish', 'Portuguese', 'Francaise', 'Deutch']
	},
	word: {
		//description: 'Word',
		type: 'string',
		required: true
	},
	translate: {
		//description: 'Translate',
		type: 'string'
	}
  }
};

