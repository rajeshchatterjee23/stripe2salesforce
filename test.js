var stripe = require("stripe")(
 "sk_test_bY22es5dN0RpWmJoJ5VlBQ5E"
);



// app.get('/', function(req, res) {

// });


// app.post('/webhook', function(request, response){


// 	____________________________________________________________________
// ***************BELOW HERE IS A WOKRING COPY OF UGLY CODE BUT IT WORKS*************************
// 	____________________________________________________________________
	// // parse post type, TODO: OTHER POST TRANSACTIONS
	// if (request.body.type === 'charge.succeeded') {
	// 	// fetches customer information (email address: customer.email)
	//   stripe.customers.retrieve(request.body.data.object.customer, function(err, customer) {
	//   	// finds specific SalesForce contact matching stripe customer id
 //      conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : request.body.data.object.customer}, function(err, res) {
      
 //      	// tests whether user exists in SalesForce DB
 //        if ( res.length == 0 ) {
 //        	// if new customer, a record is created:
 //          if (request.body.data.object.card.name !== null) {
 //            var cus_name_array = request.body.data.object.card.name.split(" ")
 //            var first_name = cus_name_array[0]
 //            var last_name = cus_name_array[cus_name_array.length-1]
 //          } else {
 //            var first_name = "N/A"
 //            var last_name = "N/A"
 //          }

 //    	    conn.sobject("Contact").create({ FirstName : first_name, LastName: last_name, Stripe_Customer_Id__c: request.body.data.object.customer, Email: customer.email }, function(err, ret) {
 //    	      if (err || !ret.success) { return console.error(err, ret); }
 //    	      console.log("Created record id: " + ret.id);
    	      
 //      	  });
 //        } else {
 //          // if user exists then we update their email address
 //          conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : request.body.data.object.customer }, function(err, res) {
 //            if (err) { return console.error(err); }

 //            console.log("Fetched SF id:", res[0].Id);

 //            var sf_cust_id = res[0].Id;
 //            conn.sobject("Contact").update({
 //              Id: sf_cust_id,
 //              Email: customer.email
 //            }, function (err, ret) {
 //              if (err || !ret.success) { return console.error(err, ret); }
 //              console.log('Updated Email Successfully:' + customer.email);
              
 //            });
 //          });
 //        } 
 //      });

	//   });


	// 	// on post from stripe webhook, dump json transaction in mongodb
	// 	mongo.Db.connect(mongoUri, function(err, db) {
	// 		// may be viewed at bash$ heroku addons:open mongolab
	// 		db.collection('stripeLogs', function(er, collection) {
	// 			collection.insert({'stripeReq':request.body}, function(err, result){
	// 				console.log(err);

	// 			});
	// 		});
	// 	});
//}
// 	____________________________________________________________________
// ***************ABOVE HERE IS A WOKRING COPY OF UGLY CODE BUT IT WORKS*************************
// 	____________________________________________________________________
 


// app.get('/salesforce/read', function(request, response) {

// ====================================================
// STATIC LOCAL VARIABLES FOR TESTING:

// 	var stripe_customer_id = 'cus_3oi2355bxj2',
// 			name = 'isaac woodruff',
// 			no_name = null,
// 			email = 'isaac@familiar-studio.com';

// // ====================================================

// 	var checkName = function(){
// 		// ========================
// 		// LOCAL VARIABLE: NAME
// 		if (name !== null) {
// 			var name_array = name.split(' ');
// 		// ========================
// 			return {
// 				first_name: name_array[0], 
// 				last_name: name_array[name_array.length - 1]
// 			};
// 		} else {
// 			return {
// 				first_name: 'no name listed',
// 				last_name: 'no name listed'
// 			};
// 		};
// 	};

// 	var createNewContact = function(){
// 		conn.sobject("Contact").create({ FirstName : checkName().first_name, LastName: checkName().last_name, Stripe_Customer_Id__c: stripe_customer_id, Email: email }, function(err, ret) {
//       if (err || !ret.success) { return console.error(err, ret); }
//       console.log("Created Contact With ID: " + ret.id);
// 	  });
// 	};

// 	var updateContactEmail = function(sf_id){
// 		conn.sobject('Contact').update({
// 			Id: sf_id,
// 			// ==============
// 			// LOCAL VARIABLE
// 			Email: email
// 			// ==============
// 		}, function(error, result){
// 			if (error || !ret.success) { return console.error(err, ret); }
// 			console.log('Updated Contact Email to:' + email);
// 		});
// 	};

// 	conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : stripe_customer_id }, function(err, res) {
// 		if (res.length == 0) {
// 			createNewContact();
// 		} else {
// 			console.log('Current User, ID: ' + res[0].Id)
// 			updateContactEmail(res[0].Id);
// 		};
// 	});
// });


// app.get('/salesforce/read', function(request, response) {
	// logic for debugging
	// var real = 'cus_3oiBOE7BELbxj2'
	// var fake = 'cus_3oiBOE7XYZbxj6'

	// getSfId: function(){
	// 	return conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : real }, function(err, res) {
	// 	  if (err) { return console.error(err); }
	// 	  return res[0].Id
	// 	  // if the Stripe ID exists, we'll be in this closure, will grab the account ID, and then update  
	// 	});
	// }

  // conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : fake }, function(err, res) {

  //   name = "Meghann PLunkett"
  //   if ( res.length == 0 ) {
  //   	console.log(res)
  //   	// customer does not exist
  //   	if (name !== null) {
  //   		var cus_name_array = name.split(' ')
  //   		var first_name = cus_name_array[0]
  //   		var last_name = cus_name_array[cus_name_array.length-1]
  //       console.log("FIRST NAME", first_name)
  //       console.log("LAST NAME", last_name)
  //   	} else {
  //       var first_name = "N/A"
  //       var last_name = "N/A"
  //   	}

  //   	conn.sobject("Contact").create({ FirstName : first_name  , LastName: last_name, Stripe_Customer_Id__c: real, Email: 'hedgehog@gmail.com'}, function(err, ret) {
  //   	  if (err || !ret.success) { return console.error(err, ret); }
  //   	  console.log("-----Created record id------ : " + ret.id);
    	  
  //   	});
  //   } else {
  //   	console.log(getSfId())

  //   } 
    // if (res.isArray()) {

    // 	// customer exists
    // 	// update customer
    // } else {

    // 	//customer doesnt exist

    // 	// if email is in salesforce

    // 	// update customer

    // 	// else create new customer
    // }

    // if the Stripe ID exists, we'll be in this closure, will grab the account ID, and then update  
  // });

// });

// app.get('/salesforce/insert', function(request, response) {
//   console.log('Insert!' );
//   conn.sobject("Contact").create({ FirstName : 'Test2', LastName: 'Faker', Stripe_Customer_Id__c: 'cus_3oiBOE7BELbxj2' }, function(err, ret) {
//     if (err || !ret.success) { return console.error(err, ret); }
//     console.log("Created record id : " + ret.id);
//     // ...
//   });

// });
