var fs = require('fs');

//var jsonic = require('jsonic')
var _ = require('lodash');

function getInputType(type) {
  switch (type) {
    case 'string':
      return 'text';
      break;
    case 'boolean':
      return 'boolean';
      break;
    case 'integer':
      return 'number';
      break;
    case 'float':
      return 'float';
      break;
    case 'date':
      return 'date';
      break;
    default:
      return 'text';
  }
}

function generate_app_config(app_path) {
  var APP_CONFIG = fs.readFileSync('./templates/crud5/app-config.template', 'utf8');
  if (!fs.existsSync(app_path + '\\assets\\components\\app-config'))
  {
    fs.mkdirSync(app_path + '\\assets\\components\\app-config');
    fs.writeFile(app_path + '\\assets\\components\\app-config\\app-config.js', APP_CONFIG, function (err) {
      if (err) console.log(err);
      console.log('Created file assets/components/app-config/app-config.js');
    });
  }  else console.log('File assets/components/app-config/app-config.js already exist');
}

function generate_app_util(app_path) {
  var APP_UTIL = fs.readFileSync('./templates/crud5/app-util.template', 'utf8');
  if (!fs.existsSync(app_path + '\\assets\\components\\app-util'))
  {
    fs.mkdirSync(app_path + '\\assets\\components\\app-util');
    fs.writeFile(app_path + '\\assets\\components\\app-util\\app-util.js', APP_UTIL, function (err) {
      if (err) console.log(err);
      console.log('Created file assets/components/app-util/app-util.js');
    });
  }  else console.log('File assets/components/app-util/app-util.js already exist');
}

function generate_controller(model, key, crud, app_path) {
  var CONTROLLER_TEMPLATE = fs.readFileSync('./templates/crud5/controller.template', 'utf8');
  var compiled_Controller = _.template(CONTROLLER_TEMPLATE);

  var controller = compiled_Controller({ model: model, key: key, crud: crud });

  fs.writeFile(app_path + '\\templates\\crud5\\controller.js', controller, function (err) {
    if (err) console.log(err);
    console.log('Created file templates/crud5/controller.js');
  });
}

function generate_language(title, keys, jsondata, app_path) {
  var LANGUAGE_TEMPLATE = fs.readFileSync('./templates/crud5/language.template', 'utf8');
  var compiled_Language = _.template(LANGUAGE_TEMPLATE);

  var language = compiled_Language({ title: title, keys: keys, jsondata: jsondata });

  fs.writeFile(app_path + '\\templates\\crud5\\language.json', language, function (err) {
    if (err) console.log(err);
    console.log('Created file templates/crud5/language.json');
  });
}

function srv(crud, word) {
  if (crud == 'crud6')
  return ">%= lng('" + word + "')%<";
  else
  return word;
}

function set_jsondata_lines(crud, keys) {
  var line_c = ''; var line_r = ''; var line_u = ''; var line_d = ''; var type = '';

  for (i = 0; i < keys.length; i++)
    {
    if (keys[i].substring(0, 1) != '_')
    {
      if (jsondata[keys[i]].enum)
      {
        // <select>
        line_c = '<select id="' + keys[i] + '" name="' + keys[i] + '">\n';
        line_u = line_c;
        line_r = '<select id="' + keys[i] + '" name="' + keys[i] + '" disabled>\n';
        line_d = line_r;

        // <option>
        for (j = 0; j < jsondata[keys[i]].enum.length; j++)
        {
          line_c += '\t\t\t\t\t\t<option value="' + jsondata[keys[i]].enum[j] + '">' + srv(crud, jsondata[keys[i]].enumdes[j]) + '</option>\n';
          line_r += '\t\t\t\t\t\t<option value="' + jsondata[keys[i]].enum[j] + '">' + srv(crud, jsondata[keys[i]].enumdes[j]) + '</option>\n';
          line_u += '\t\t\t\t\t\t<option value="' + jsondata[keys[i]].enum[j] + '">' + srv(crud, jsondata[keys[i]].enumdes[j]) + '</option>\n';
          line_d += '\t\t\t\t\t\t<option value="' + jsondata[keys[i]].enum[j] + '">' + srv(crud, jsondata[keys[i]].enumdes[j]) + '</option>\n';
        }

        line_c += '\t\t\t\t\t</select>';
        line_r += '\t\t\t\t\t</select>';
        line_u += '\t\t\t\t\t</select>';
        line_d += '\t\t\t\t\t</select>';
      }      else // <input>
		{
  type = getInputType(jsondata[keys[i]].type);

  // input field
  if (jsondata[keys[i]].textarea_cols)
  line_c = '<textarea id="' + keys[i] + '" name="' + keys[i] + '" rows="' + jsondata[keys[i]].textarea_rows + '" cols="' + jsondata[keys[i]].textarea_cols + '"';
  else
  line_c = '<input id="' + keys[i] + '" type="' + type + '" name="' + keys[i] + '"';
  if (jsondata[keys[i]].type == 'float')
  line_c = '<input id="' + keys[i] + '" type="number" step="0.01" name="' + keys[i] + '"';
  line_r = line_c;
  line_u = line_c;
  line_d = line_c;

  // input values for rud
  if (!jsondata[keys[i]].model)
  {
    line_r += ' value="{{item.' + keys[i] + '}}"';
    line_u += ' value="{{item.' + keys[i] + '}}"';
    line_d += ' value="{{item.' + keys[i] + '}}"';
  }  else // model
			{
  if (jsondata[keys[i]].key_type != 'integer' && jsondata[keys[i]].key_type != 'float')
				{
    line_c += ' key=""';
    line_u += ' key="{{item.' + keys[i] + '_id}}"';
  }  else
				{
  line_c += ' key=0';
  line_u += ' key={{item.' + keys[i] + '_id}}';
				}

  line_r += ' value="{{item.' + keys[i] + '_' + jsondata[keys[i]].display + '}}"';
  line_u += ' value="{{item.' + keys[i] + '_' + jsondata[keys[i]].display + '}}"';
  line_d += ' value="{{item.' + keys[i] + '_' + jsondata[keys[i]].display + '}}"';
			}

  // maxLength
  if (jsondata[keys[i]].maxLength)
  {
    line_c += ' maxlength=' + jsondata[keys[i]].maxLength;
    line_u += ' maxlength=' + jsondata[keys[i]].maxLength;
  }

  // min
  if (jsondata[keys[i]].min)
  {
    line_c += ' min=' + jsondata[keys[i]].min;
    line_u += ' min=' + jsondata[keys[i]].min;
  }

  //max
  if (jsondata[keys[i]].max)
  {
    line_c += ' max=' + jsondata[keys[i]].max;
    line_u += ' max=' + jsondata[keys[i]].max;
  }

  // required
  if (jsondata[keys[i]].required)
  {
    line_c += ' required';
    line_u += ' required';
  }

  // DefaultTo (Fixed Value)
  if (jsondata[keys[i]].defaultsTo)
  {
    line_c += ' value="' + jsondata[keys[i]].defaultsTo + '" disabled';
    line_u += ' value="' + jsondata[keys[i]].defaultsTo + '" disabled';
  } else {
    if (jsondata[keys[i]].primaryKey) {
      line_u += ' disabled';
      if (jsondata[keys[i]].autoIncrement)
      line_c += ' disabled';
    }
  }

  //end of input field
  line_r += ' disabled';
  line_d += ' disabled';
  if (jsondata[keys[i]].ref_model)
  {
    line_c += ' on-click="select_field" readonly';
    line_u += ' on-click="select_field" readonly';
  }

  line_c += '>';
  line_r += '>';
  line_u += '>';
  line_d += '>';
  if (jsondata[keys[i]].textarea_cols)
  {
    line_c += '</textarea>';
    line_r += '</textarea>';
    line_u += '</textarea>';
    line_d += '</textarea>';
  }
		}

      jsondata[keys[i]].line_c = line_c;
      jsondata[keys[i]].line_r = line_r;
      jsondata[keys[i]].line_u = line_u;
      jsondata[keys[i]].line_d = line_d;

      //console.log(jsondata[keys[i]].line_u)
    }
  }
}

function generate_new_form(model, keys, key, title, crud) {
  var NEW_FORM_TEMPLATE = fs.readFileSync('./templates/crud5/new-form.template', 'utf8');
  var compiled_New_Form = _.template(NEW_FORM_TEMPLATE);

  // crud = crud6 : Server Side (views/.ejs)) else client side (assets/components/.html)
  var new_form = compiled_New_Form({ title:title, model:model, key:key, keys:keys, jsondata:jsondata, crud: crud });

  new_form = new_form.replace(/>%/g, '<%');
  new_form = new_form.replace(/%</g, '%>');

  // Create Folder if not exist
  //if (crud == 'crud6')
  NEW_FORM = new_form;
  /*else {
  		var path = 'assets/components/'+model+'-new'

  		if (!fs.existsSync(path))  fs.mkdirSync(path)

  		path += '/'+model+'-new.html'

  		fs.writeFile(path, new_form, function (err) {
  			if (err) console.log(err);
  			console.log('Created file '+path)
  		})
  	}*/
}

function generate_display_form(model, keys, key, title, crud) {
  var DISPLAY_FORM_TEMPLATE = fs.readFileSync('./templates/crud5/display-form.template', 'utf8');
  var compiled_Display_Form = _.template(DISPLAY_FORM_TEMPLATE);

  var display_form = compiled_Display_Form({ title:title, model:model, key:key, keys:keys, jsondata:jsondata, crud: crud });

  display_form = display_form.replace(/>%/g, '<%');
  display_form = display_form.replace(/%</g, '%>');

  // Create Folder if not exist

  //if (crud == 'crud6')
  DISPLAY_FORM = display_form;
  /*else {
  		var path = 'assets/components/'+model+'-display'

  		if (!fs.existsSync(path))  fs.mkdirSync(path)

  		path += '/'+model+'-display.html'

  		fs.writeFile(path, display_form, function (err) {
  			if (err) console.log(err);
  			console.log('Created file '+path)
  		})
  	}*/
}

function generate_delete_form(model, keys, key, title, crud) {
  var DELETE_FORM_TEMPLATE = fs.readFileSync('./templates/crud5/delete-form.template', 'utf8');
  var compiled_Delete_Form = _.template(DELETE_FORM_TEMPLATE);

  var delete_form = compiled_Delete_Form({ title:title, model:model, key:key, keys:keys, jsondata:jsondata, crud: crud });

  delete_form = delete_form.replace(/>%/g, '<%');
  delete_form = delete_form.replace(/%</g, '%>');

  // Create Folder if not exist
  //if (crud == 'crud6')
  DELETE_FORM = delete_form;
  /*else {
  		var path = 'assets/components/'+model+'-delete'

  		if (!fs.existsSync(path))  fs.mkdirSync(path)

  		path += '/'+model+'-delete.html'

  		fs.writeFile(path, delete_form, function (err) {
  			if (err) console.log(err);
  			console.log('Created file '+path)
  		})
  	}*/
}

function generate_edit_form(model, keys, key, title, crud) {
  var EDIT_FORM_TEMPLATE = fs.readFileSync('./templates/crud5/edit-form.template', 'utf8');
  var compiled_Edit_Form = _.template(EDIT_FORM_TEMPLATE);

  var edit_form = compiled_Edit_Form({ title:title, model:model, key:key, keys:keys, jsondata:jsondata, crud: crud });

  edit_form = edit_form.replace(/>%/g, '<%');
  edit_form = edit_form.replace(/%</g, '%>');

  // Create Folder if not exist
  //if (crud == 'crud6')
  EDIT_FORM = edit_form;
  /*else {
  		var path = 'assets/components/'+model+'-edit'

  		if (!fs.existsSync(path))  fs.mkdirSync(path)

  		path += '/'+model+'-edit.html'

  		fs.writeFile(path, edit_form, function (err) {
  			if (err) console.log(err);
  			console.log('Created file '+path)
  		})
  	}*/
}

function generate_list_columns(keys, title, crud) {
  var LIST_COLUMNS_TEMPLATE = fs.readFileSync('./templates/crud5/columns-form.template', 'utf8');
  var compiled_List_Columns = _.template(LIST_COLUMNS_TEMPLATE);

  var list_columns = compiled_List_Columns({ title:title, keys:keys, crud: crud });

  list_columns = list_columns.replace(/>%/g, '<%');
  list_columns = list_columns.replace(/%</g, '%>');

  // Create Folder if not exist
  //if (crud == 'crud6')
  COLUMNS_FORM = list_columns;
  /*else {
  		var path = 'assets/components/'+model+'-list-columns'

  		if (!fs.existsSync(path))  fs.mkdirSync(path)

  		path += '/'+model+'-list-columns.html'

  		fs.writeFile(path, list_columns, function (err) {
  			if (err) console.log(err);
  			console.log('Created file '+path)
  		})
  	}*/
}

function generate_model_select(model, display, key, description, crud) {
  //if (!fs.existsSync('assets/components/'+model+'-select/'+model+'-select.html'))
  //{
  var SELECT_MODEL_TEMPLATE = fs.readFileSync('./templates/crud5/select-model.template', 'utf8');
  var compiled_Select_Model = _.template(SELECT_MODEL_TEMPLATE);

  var select_model = compiled_Select_Model({ model:model, display:display, key:key, description:description, crud: crud });

  select_model = select_model.replace(/>%/g, '<%');
  select_model = select_model.replace(/%</g, '%>');

  // Create Folder if not exist
  SELECT_FORMS += '\n' + select_model;

  /*var path = 'assets/components/'+model+'-select'
    		if (crud == 'crud6')  path = 'views/'+model

    		if (!fs.existsSync(path))	fs.mkdirSync(path)

    		if (crud == 'crud6')
    			path += '/select.ejs'
    		  else
    			path += '/'+model+'-select.html'

    		fs.writeFile(path, select_model, function (err) {
    			if (err) console.log(err);
    			console.log('Created file '+path)
    		})*/

  //}
  //else  console.log('File '+path+' already Exist')
}

function get_user_points(model, app_path) {
  user_point = {
    list_style: '<!--USER POINT - List Style-->\n' +
    '<!--END USER POINT - List Style-->',
    list_header: '<!--USER POINT - List Header-->\n' +
    '<!--END USER POINT - List Header-->',
    list_detail_menu: '<!--USER POINT - List Detail Menu-->\n' +
    '<!--END USER POINT - List Detail Menu-->',
    list_start_ready: '//USER POINT - List Start Ready\n' +
    '//END USER POINT - List Start Ready',
    list_end_ready: '//USER POINT - List End Ready\n' +
    '//END USER POINT - List End Ready',
    list_functions: '//USER POINT - List Functions\n' +
    '//END USER POINT - List Functions',
  };

  if (fs.existsSync(app_path + '\\views\\' + model + '\\list.ejs'))
    {
    var list_file = fs.readFileSync(app_path + '\\views\\' + model + '\\list.ejs', 'utf8');

    var start = list_file.indexOf('<!--USER POINT - List Style-->');
    var end = list_file.indexOf('<!--END USER POINT - List Style-->');
    if (end != -1)
        user_point.list_style = list_file.substring(start, end + 34);

    var start = list_file.indexOf('<!--USER POINT - List Header-->');
    var end = list_file.indexOf('<!--END USER POINT - List Header-->');
    if (end != -1)
        user_point.list_header = list_file.substring(start, end + 35);

    var start = list_file.indexOf('<!--USER POINT - List Detail Menu-->');
    var end = list_file.indexOf('<!--END USER POINT - List Detail Menu-->');
    if (end != -1)
        user_point.list_detail_menu = list_file.substring(start, end + 40);

    start = list_file.indexOf('//USER POINT - List Start Ready');
    end = list_file.indexOf('//END USER POINT - List Start Ready');
    if (end != -1)
    user_point.list_start_ready = list_file.substring(start, end + 35);

    start = list_file.indexOf('//USER POINT - List End Ready');
    end = list_file.indexOf('//END USER POINT - List End Ready');
    if (end != -1)
    user_point.list_end_ready = list_file.substring(start, end + 33);

    start = list_file.indexOf('//USER POINT - List Functions');
    end = list_file.indexOf('//END USER POINT - List Functions');
    if (end != -1)
    user_point.list_functions = list_file.substring(start, end + 33);
  }
}

function generate_list_page(model, keys, key, title, crud, card_width, dialog_width, btn_left, columns, download, print, new_reg, edit, delete_reg, display, ga, app_path) {
  var LIST_TEMPLATE = fs.readFileSync('./templates/crud5/list.template', 'utf8');
  var compiled_List = _.template(LIST_TEMPLATE);

  var first = true;
  var attrs = '';

  // get_attrs function
  for (i = 0; i < keys.length; i++)
  {
    if (keys[i].substring(0, 1) != '_')
    {
      if (!first)
      attrs += '\t\t\t\t';
      else	first = false;
      if (jsondata[keys[i]].enum)
      {
        var enumdes = JSON.stringify(jsondata[keys[i]].enumdes);
        if (crud == 'crud6')
        {
          enumdes = enumdes.replace(/","/g, '")%>","<%= lng("');
          enumdes = enumdes.replace(/\["/g, '["<%= lng("');
          enumdes = enumdes.replace(/"\]/g, '")%>"]');
        }

        attrs += '{column: "' + keys[i] + '", enum: ' + JSON.stringify(jsondata[keys[i]].enum) + ', enumdes: ' + enumdes + ', display: ';
        if (!jsondata[keys[i]].hide) attrs += 'true}';
        else attrs += 'false}';
      }      else
			if (!jsondata[keys[i]].model)
			{
  attrs += '{column: "' + keys[i] + '", type: "' + jsondata[keys[i]].type + '", display: ';
  if (!jsondata[keys[i]].hide) attrs += 'true}';
  else attrs += 'false}';
			}      else
			{
  attrs += '{column: "' + keys[i] + '_' + jsondata[keys[i]].key + '", type: "' + jsondata[keys[i]].key_type + '", model: "' + jsondata[keys[i]].model + '", display: false},\n\t\t\t\t';
  attrs += '{column: "' + keys[i] + '_' + jsondata[keys[i]].display + '", type: "' + jsondata[keys[i]].type + '", model: "' + jsondata[keys[i]].model + '", display: ';
  if (!jsondata[keys[i]].hide) attrs += 'true}';
  else attrs += 'false}';
			}

      if (i < keys.length - 1)
      attrs += ',\n';
      else
      attrs += '\n';
    }
  }

  var IMPORT_FORM = fs.readFileSync('./templates/crud5/import-form.template', 'utf8');

  var TOPBAR = fs.readFileSync('./templates/crud5/topBar.template', 'utf8');

  var list_template = compiled_List({ title: title, attrs: attrs, model: model, import_form: IMPORT_FORM, topBar: TOPBAR, columns_form: COLUMNS_FORM, new_form: NEW_FORM, display_form: DISPLAY_FORM, edit_form: EDIT_FORM, delete_form: DELETE_FORM, select_forms: SELECT_FORMS, key: key, keys: keys, jsondata: jsondata, crud: crud, card_width: card_width, dialog_width: dialog_width, btn_left: btn_left, columns: columns, download: download, print: print, new_reg: new_reg, edit: edit, delete_reg: delete_reg, display: display, ga: ga, user_point: user_point });

  //list_template = list_template.replace('>%', '<%')
  //list_template = list_template.replace('%<', '%>')
  list_template = list_template.replace(/>%/g, '<%');
  list_template = list_template.replace(/%</g, '%>');

  // Create Folder if not exist
  var path = 'assets/' + model;
  if (crud == 'crud6')  path = app_path + '\\views\\' + model;

  if (!fs.existsSync(path))	fs.mkdirSync(path);

  if (crud == 'crud6')
  path += '\\list.ejs';
  else
  path += '\\list.html';

  fs.writeFile(path, list_template, function (err) {
    if (err) console.log(err);
    console.log('Created file ' + path);
  });
}

exports.generate_function_list = function (app, model, attrs, mfunction, app_path)
{
  app_path = app_path + '\\' + app;
  jsondata = attrs;  /* include mfunction */
  for (i = 0; i < jsondata.length; i++)
  {
    if (jsondata[i].enum == '')
			{
      delete jsondata[i].enum; delete jsondata[i].enumdes;
    }

    if (jsondata[i].model == 0) delete jsondata[i].model;
    if (jsondata[i].maxLength == 0) delete jsondata[i].maxLength;
    if (jsondata[i].min == 0) delete jsondata[i].min;
    if (jsondata[i].max == 0) delete jsondata[i].max;

    //if (jsondata[i].defaultTo == '') delete jsondata[i].defaultTo
    if (jsondata[i].textarea_cols == 0)
			{
      delete jsondata[i].textarea_cols; delete jsondata[i].textarea_rows;
    }
  }

  var keys = Object.keys(attrs);
  keys.unshift('id'); // insert at beginning of array
  var crud = 'crud6';  // crud5 or crud6
  var title = mfunction.model.title;
  var card_width = mfunction.list.card_width;
  var dialog_width = mfunction.list.dialog_width;
  var btn_left = mfunction.list.btn_left;

  var columns = true;
  var print = true;
  var download = true;
  var new_reg = true;
  var edit = true;
  var delete_reg = true;
  var display = true;
  var ga = false;  // Google Analytics

  if (mfunction.list.columns != 'e') columns = false;
  if (mfunction.list.print != 'e') print = false;
  if (mfunction.list.download != 'e') download = false;
  if (mfunction.list.new != 'e') new_reg = false;
  if (mfunction.list.edit != 'e') edit = false;
  if (mfunction.list.delete != 'e') delete_reg = false;
  if (mfunction.list.display != 'e') display = false;
  if (mfunction.list.ga == 'e') ga = true;

  // Key
  /*var key= {}
  	for (k=0; k < keys.length; k++ ) {
  		if (jsondata[keys[k]].primaryKey) {
  			key = jsondata[keys[k]]
  			key.name = keys[k]
  			break
  		}
  	}*/
  var key =
		{
  description: 'Id',
  type: 'integer',
  primaryKey: true,
  autoIncrement: true,
  unique: true,
		};
  jsondata.id = key;
  key.name = 'id';

  // Omit Fields
  for (k = 0; k < keys.length; k++) {
    if (jsondata[keys[k]].omit) {
      delete jsondata[keys[k]];
      keys.splice(k, 1);
    }
  }

  // Relations
  var relation = [];
  var i = 0;
  for (k = 0; k < keys.length; k++) {
    if (typeof jsondata[keys[k]].ref_model !== 'undefined') {
      relation[i] = {};
      relation[i].model = jsondata[keys[k]].ref_model.name;
      relation[i].description = jsondata[keys[k]].description;
      relation[i].key = 'id';
      relation[i].display = jsondata[keys[k]].ref_model.title;
      i++;
    }
  }

  // input fields on form
  set_jsondata_lines(crud, keys);  /*ready pending test */

  // Models: User, Profile, Resources
  // Login Form, userController.login, user.controller.validateLogin, policy Authorized
  // TopBar

  //generate_controller(model, key, crud, app_path)
  //generate_language(model, keys, jsondata, app_path)
  //generate_app_config(app_path)
  //generate_app_util(app_path)

  NEW_FORM = '';
  DISPLAY_FORM = '';
  DELETE_FORM = '';
  EDIT_FORM = '';
  COLUMNS_FORM = '';

  get_user_points(model, app_path);

  if (mfunction.list.new == 'e') generate_new_form(model, keys, key, title, crud);
  if (mfunction.list.display == 'e') generate_display_form(model, keys, key, title, crud);
  if (mfunction.list.delete == 'e') generate_delete_form(model, keys, key, title, crud);
  if (mfunction.list.edit == 'e') generate_edit_form(model, keys, key, title, crud);

  //return 'before generate_list_columns'
  //if (columns) generate_list_columns(keys, title, crud)

  SELECT_FORMS = '';

  //return 'before generate_model_select'
  for (i = 0; i < relation.length; i++)
  generate_model_select(model, relation[i].model, relation[i].display, relation[i].key, relation[i].description, crud);

  //return 'after generate_model_select'

  generate_list_page(model, keys, key, title, crud, card_width, dialog_width, btn_left, columns, download, print, new_reg, edit, delete_reg, display, ga, app_path);

  return 'Generated Function List';

  // resume-bar ??
};

