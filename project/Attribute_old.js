/**
* Attribute.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  //migrate: 'safe',

  attributes: {
	//_title: 'Atributo',
	//_unique: ['model', 'attribute'],
	id: {
		//description: 'Id',
		//hide: true,
		type: 'integer',
		primaryKey: true,
		unique: true,
		autoIncrement: true
	},
	pos: {
		//description: 'Pos',
		//omit: true,
		type: 'integer'
	},
	model: {
		//description: 'Model',
		//key: id,
		//key_type: 'integer',
		//display: 'name',
		//type: 'string',
		//hide: true,
		model: 'Model'
	},
	attribute: {
		//description: 'Attribute',
		type: "string",
		required: true
	},
	description: {
		//description: 'Description',
		type: "string",
		//textarea_cols: 60,
		//textarea_rows: 2
	},
	type: {
		//description: 'Type',
		type: 'string',
		enum: ['integer', 'string', 'float', 'date', 'boolean']
		//,enumdes: ['integer', 'string', 'float', 'date', 'boolean']
	},
	required: {
		//description: 'Required',
		type: 'boolean',
		enum: [true, false]
		//,enumdes: ['Yes', 'No']
	},
	hide: {
		//description: 'Hide',
		type: 'boolean',
		enum: [true, false]
		//,enumdes: ['Yes', 'No']
	},
	width: {
		//description: 'Width',
		//omit: true,
		type: 'string'
	},
	textarea_cols:{
		//description: 'Textarea Cols',
		//hide: true,
		type: 'integer'
	},
	textarea_rows:{
		//description: 'Textarea Rows',
		//hide: true,
		type: 'integer'
	},
	enum: {
		//description: 'Enum',
		type: 'string'
	},
	enumdes: {
		//description: 'EnumDes',
		type: 'string'
	},
	omit: {
		//description: 'Omit',
		type: 'boolean',
		enum: [true, false]
		//,enumdes: ['Yes', 'No']
	},
	ref_model: {
		//description: 'Reference Model',
		//key: id,
		//key_type: 'integer',
		//display: 'name',
		//type: 'string',
		model: 'Model'
	},
	model_key: {
		//description: 'Mdl Key',
		//hide: true,
		type: 'string'
	},
	key_type: {
		//description: 'Key Type',
		//hide: true,
		type: 'string',
		enum: ['integer', 'string', 'float', 'date', 'boolean']
		//,enumdes: ['integer', 'string', 'float', 'date', 'boolean']
	},
	model_display: {
		//description: 'mdl Display',
		//key: id,
		//key_type: 'integer',
		//display: 'name',
		//type: 'string',
		//hide: true,
		model: 'Attribute'
	},
	top_label: {
		//description: 'Top Label',
		//omit: true,
		type: 'string'
	},
	left_label: {
		//description: 'Left Label',
		//omit: true,
		type: 'string'
	},
	maxLength: {
		//description: 'Max Length',
		type: 'integer'
	},
	min: {
		//description: 'Min Value',
		type: 'integer'
	},
	max: {
		//description: 'Max Value',
		type: 'integer'
	},
	filter: {
		//description: 'Filter',
		//omit: true,
		type: 'boolean',
		enum: [true, false]
		//,enumdes: ['Yes', 'No']
	},
	list: {
		//description: 'List',
		//omit: true,
		type: 'boolean',
		enum: [true, false]
		//,enumdes: ['Yes', 'No']
	},
	display: {
		//description: 'Display',
		//omit: true,
		type: 'string',
		enum: ['s', 'h']
		//,enumdes: ['Show', 'Hide']
	},
	create: {
		//description: 'Create',
		//omit: true,
		type: 'string',
		enum: ['c', 'r', 'h']
		//,enumdes: ['Create', 'Readonly', 'Hide']
	},
	update: {
		//description: 'Update',
		//omit: true,
		type: 'string',
		enum: ['u', 'r', 'h']
		//,enumdes: ['Update', 'Readonly', 'Hide']
	},
	delete: {
		//description: 'Delete',
		//omit: true,
		type: 'string',
		enum: ['s', 'h']
		//,enumdes: ['Show', 'Hide']
	},
	help: {
		//description: 'Help Text',
		//omit: true,
		type: 'string'
	}
//End Attributes
  },
	afterCreate: function (attr, next) {
		errorx = function errorx(err, data) {
			if (err) {
				console.log('Error After Create Model: ', err)
				return next(err);
			}
			//res.redirect("<%= model%>/list")
		}
		ModelFunction.find({model: attr.model})
			.exec(function(err, func) {
				//console.log('function: ',func)
				var funcAttr = {}
				for (i=0; i < func.length; i++) {
				  if (func[i].type != "download" && func[i].type != "columns")
				  {
					funcAttr = {model: func[i].model, functionx: func[i].id, attribute: attr.id, display:'Yes'}
					FunctionAttribute.create(funcAttr, errorx)
				  }
				}
				next()
		})
	}
};

