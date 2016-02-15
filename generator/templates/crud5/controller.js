
/************  Routes:  config/routes.js ************/

"/Prueba6/exist/:id": "Prueba6Controller.exist",
"/Prueba6/list": "Prueba6Controller.list"

/********** Controller: api/controllers/<<model_name>>Controller.js *******/

	exist: function(req, res, next) {
		var id = req.param("id")
		 Prueba6.findOne(id)
			.exec(function(err, data) {
				if(err) res.json({ "exist": "error"})
				  else if (!data) res.json({ "exist": false})
					else res.json({ "exist": true})
			})
	}
	/*, display: function(req, res) {
		res.view("Prueba6/display")
	},
	new: function (req, res) {
		res.view("Prueba6/new")
	},
	edit: function (req, res) {
		res.view("Prueba6/edit")
	},
	delete: function (req, res) {
		res.view("Prueba6/delete")
	},
	columns: function (req, res) {
		res.view("Prueba6/columns")
	},*/
	list : function (req, res) {
		//Prueba6.find()
		//	.exec(function(err, data){
				res.locals.resources = req.session.resources
				res.locals.user = {user: req.session.user, name: req.session.username}
		//		res.locals.data = JSON.stringify(data)
				res.locals.data = []
				res.view("Prueba6/list")
		//	})
	}
	/*,byfield: function(req, res) {
		Prueba6.query('SELECT field, count(*) FROM Prueba6 group by field order by count desc', function(err, data) {
			if (err) return res.serverError(err);
			//return res.ok(results);
			return res.json(data.rows)
		});
	}*/
