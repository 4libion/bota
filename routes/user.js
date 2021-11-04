exports.login = function(req, res){
   var message = '';

   if(req.method == "POST") {
      var email = req.body.email;
      var password = req.body.password;
    
      var sql=`SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;                           
      db.query(sql, function(err, results){
         if (results.length != 0) { 
            req.session.status = results[0].status;
            req.session.userId = results[0].id;
            req.session.email = results[0].email;
            var hour = 3600000
            req.session.cookie.expires = new Date(Date.now() + hour)
            req.session.cookie.maxAge = 100 * hour
            res.redirect('/home/dashboard');
         }
         else {
            message = 'You have entered invalid email or password.';

            res.render('index.ejs', {
               status: req.session.status,
               userId: req.session.userId,
               message: message,
               data: '',
            });
         }
                  
      });
   } else {
      res.render('index.ejs', {
         userId: req.session.userId,
         message: message
      });
   }
          
};


exports.signup = function(req, res){
   message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var email = post.email;
      var name = post.name;
      var password = post.password;
      if(email !='' && password!='') {
         var sql = `SELECT email FROM users WHERE email = '${email}'`; 
         var query = db.query(sql, function (err, result) {
            if (result != null && result.length != 0) {
               res.render('signup.ejs', {
                  userId: req.session.userId,
                  message: 'This email is already registered!'
               });
            } else {
               sql = `INSERT INTO users (name, email, password) VALUES ('${name}', '${email}', '${password}')`;
               query = db.query(sql, function(err, result) {
                  message = "Your account has been created succesfully.";
                  res.render('signup.ejs', {
                     userId: req.session.userId,
                     message: message
                  });
               });
            }
         });
      } else {
         message = "Username and password is mandatory field.";
         res.render('signup.ejs', {
            userId: req.session.userId,
            message: message
         });
      }

   } else {
         res.render('signup', {
            userId: req.session.userId
         });
   }
};


exports.profile = function(req, res){

  var userId = req.session.userId;
   if(userId == null){
      res.redirect("/login");
      return;
   }

  var sql="SELECT * FROM users WHERE id='"+ userId +"'";          
  db.query(sql, function(err, result){  
      res.render('profile.ejs', {
         userId: req.session.userId,
         status: req.session.status,
         data: result
      });
  });
};

exports.dashboard = function (req, res) {
   var email = req.session.email;
   var userId = req.session.userId;
   if (userId == null) {
      res.render('index', {
         userId: req.session.userId,
         message: 'First, you have to login!'
      });
   }

   var sql = `SELECT * FROM users WHERE id = '${userId}'`;
   
   db.query(sql, function(err, results) {
      res.render('dashboard', {
         userId: req.session.userId,
         status: req.session.status,
         user: req.session.userId
      });
   });
};


exports.classes = function (req, res) {
   sql = `SELECT * FROM classes`;
   db.query(sql, function (error, results) {
      if (error) throw error;
      else {
         res.render('classes', {
            userId: req.session.userId,
            status: req.session.status,
            results: results
         });
      }
   });
   if (req.session.userId == null) {
      res.render('index', {
         userId: req.session.userId,
         message: 'First, you have to login!'
      });
   }
};


exports.class = function (req, res) {
   sql = `SELECT id, name, long_description FROM classes WHERE id = ${req.body.classId}`;
   db.query(sql, function (err, result) {
      res.render('class', {
         message: '',
         userId: req.session.userId,
         status: req.session.status,
         result: result[0]
      });
   });
};

exports.add = function (req, res) {
   res.render('add', {
      action: 'add',
      title: 'New Class',
      classId: req.body.classId,
      status: req.session.status,
      userId: req.session.userId,
   })
}

exports.edit = function (req, res) {
   res.render('edit', {
      action: 'edit',
      title: 'Edit',
      classId: req.body.classId,
      status: req.session.status,
      userId: req.session.userId,
   })
}

exports.crudSuccess = function (req, res) {
   var sql = '';
   if (req.body.value == 'edit') {
      sql = `UPDATE classes SET name = '${req.body.name}',
      short_description = '${req.body.short_description}',
      long_description = '${req.body.long_description}'
      WHERE id = '${req.body.classId}'`;
      message = 'Successfully updated!';
   } else if (req.body.value == 'add') {
      sql = `INSERT INTO classes (name, short_description, long_description)
      VALUES('${req.body.name}', '${req.body.short_description}', '${req.body.long_description}')`;
      message = 'Successfully added!';
   } else {
      sql = `DELETE FROM classes WHERE id = '${req.body.classId}'`;
      message = 'Successfully deleted!';
   }
   db.query(sql, function (err, result) {
      res.render('success', {
         status: req.session.status,
         userId: req.session.userId,
         message: message
      })
   });
}


exports.logout = function (req,res) {
   req.session.destroy(function(err) {
      res.redirect("/login");
   });
};