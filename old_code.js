var stripeCheckName = function(){
		//adding swtich case
		var name = request.body.data.object.metadata.Name;
		if (typeof name == 'string') {
			var name_array = name.split(' ');
			return {
				first_name: name_array[0], 
				last_name: name_array[name_array.length - 1]
			};
		} else {
			return {
				first_name: 'no first name listed',
				last_name: 'no last name listed'
			};
		};
		// TODO: get name from card for createOpportunity Invocation
	}


	var getStripeCustomer = function(option, stripe_id, sf_id) {
		stripe.customers.retrieve(stripe_id, function(err, customer){
			console.log('EMAIL OBJECT', customer)
			if (option === 0){
				createNewSFContact(stripe_id, customer)
				// exit
			} else if (option === 1) {
				updateSFContactEmail(sf_id, stripe_id, customer)
				// exit
			}

		});
	}

	var createNewSFContact = function(stripe_id, customer){
		conn.sobject("Contact").create({ FirstName : stripeCheckName().first_name, LastName: stripeCheckName().last_name,  Stripe_Customer_Id__c: stripe_id, Email: customer.email }, function(err, ret) {
	      if (err || !ret.success) { return console.error(err, ret); }
	      console.log("Created Contact With ID: " + ret.id, 'And Email:' + customer.email);

	      checkCharge()
	  });
	}


// this function is anachronistic since identity validation will occur by parallels in email address
	var updateSFContactEmail = function(sf_id, stripe_id, customer){
		conn.sobject('Contact').update({
			Id: sf_id,
			Email: customer.email
		}, function(error, result){
			if (error || !ret.success) { return console.error(err, ret); }
			console.log('Updated Contact Email to:' + email);

			checkCharge()
		});
	}


	var createSFSubscriptionOpportunity = function(charge, contract_num){
		var date = moment.unix(charge.created).format("YYYY-MM-DDTHH:mm:ss:ZZ")

		console.log('ohei!', contract_num)

		conn.sobject("Opportunity").create({ 
			Amount: (charge.amount/100), 
			Stripe_Charge_Id__c: charge.id, 
			// TODO: add charge logic to checkName func
			Name: "isaac's test",
			StageName: "Closed Won",
			CloseDate: date,
			Contract__c: contract_num
		
		}, function(error, ret){
			if (err || !ret.success) { return console.error(err, ret); }
			console.log('worked?')
		});

	}

	var createSFOpportunity = function(stripe_info){
		var stripe_id = request.body.data.object.id
		var amount = request.body.data.object.amount
		var date = moment.unix(charge.created).format("YYYY-MM-DDTHH:mm:ss:ZZ")
		// console.log('THIS IS THE AMOUT *********************', request.body.data.object.amount)
		// console.log('THIS IS THE id *********************', request.body.data.object.customer)

		conn.sobject("Opportunity").create({ 
			Amount: amount, 
			Stripe_Charge_Id__c: stripe_id, 
			Name: "OUR Stripe Charge",
			StageName: "Closed Won",
			CloseDate: date
		
		}, function(error, ret){
			if (err || !ret.success) { return console.error(err, ret); }
			console.log("created!!!!!!!!!!!! record id :" + ret.id);
		});
	}
 	
 	var findStripeSubscription = function(charge){
 		stripe.invoices.retrieve( charge.invoice, function(err, response){
 			findSFSubscription(charge, response.subscription);
 		});
 	}
//make one func 
 	var findSFSubscription = function(charge, subscription_id){
 		conn.sobject('Contract').find({ Stripe_Subscription_Id__c : subscription_id }).limit(1).execute(function(err, res){
 		  if (res.length === 0) {
 		  	console.log('Moving to create subscription')
 		  	findSFAccount(charge, subscription_id)
 		  } else {
 		  	console.log('Subscription for' + res[0].Id + 'Exists');
 		  };
 		});
 	}


 	conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : stripe_id }).limit(1).execute(function(err, res) {
 	  conn.sobject('Contract').create({ AccountId : res[0].AccountId, Stripe_Subscription_Id__c : sub_id }, function(err, ret){
 	  	conn.sobject('Contract').find({ 'Id' : ret.id }).limit(1).execute(function(err, ret) { 
 	  		createSFSubscriptionOpportunity(charge, ret[0].ContractNumber);
 	  	});
 	  });
 	});



 	var findSFAccount = function(charge, subscription_id){
 		// At this point, we need the contact to already be created so we can find the AccountId
		conn.sobject('Contact').find({ 'Stripe_Customer_Id__c' : charge.customer }).limit(1).execute(function(err, res) {
		  console.log(res[0].AccountId)
		  createNewSFContract(charge, res[0].AccountId, subscription_id) 
		});
 	} 	

 	var createNewSFContract = function(charge, account_id, subscription_id){
 		conn.sobject('Contract').create({ AccountId : account_id, Stripe_Subscription_Id__c : subscription_id }, function(err, ret){
 			if (err || !ret.success) { return console.error(err, ret); }
 			// if the Contract field of the Opportunity needs simply a pointer to this contract's ID, use this function
 			// createSFOpportunity(charge, ret.id)
 			// Otherwise, invoke the below:
 			findSFContract(charge, ret.id)
 		});
 	}

 	var findSFContract = function(charge, contract_id) {
 		conn.sobject('Contract').find({ 'Id' : contract_id }).limit(1).execute(function(err, ret) { 
 			createSFSubscriptionOpportunity(charge, ret[0].ContractNumber)
 		})
 	}


 	// var checkCharge = function() {
 	// 	console.log('CHECKING CHARGE TYPE', request.body.type)
 		if (request.body.type === 'charge.succeeded') {
 			// WAIT UNTIL INVOKED BY CUSTOMER VALIDATION
 			var charge = request.body.data.object;
 			if (charge.invoice !== null) {
 				findStripeSubscription(charge)
 			} else {
 				createSFOpportunity(charge);
 			};
 		};
 	// }

 	// a problem which I'm too burnt-out to currently unwrap: when called from UrbanGlass, many different request types will be sent at the same time. If a customer does not yet exist, the checkCharge must wait until creation before it can properly run (a non-existant customer cannot have a contract). However, I assume there will be some cases in which a customer will already exist and therefore neither creation nor updates will fire. The question then is, how do we signal checkCharge to invocate if it's waiting for a customer validation?

 	if (request.body.type === 'customer.created' || request.body.type === 'customer.updated') {
 		var customer = request.body.data.object

 		console.log('BROKEN CUSTOMER EXISTENCE CHECK -- YOU NEED TO VALIDATE BY EMAIL')



 		conn.sobject('Contact').find({ Stripe_Customer_Id__c : customer.id }).limit(1).execute(function(err, res) {
 			if (res.length == 0) {
 				createNewSFContact(customer.id, customer);
 			} else {
 				updateSFContactEmail(res[0].Id, customer.id, customer);
 			};
 		});
 	};

	// on post from stripe webhook, dump json transaction in mongodb
	mongo.Db.connect(mongoUri, function(err, db) {
		// may be viewed at bash$ heroku addons:open mongolab
		db.collection('stripeLogs', function(er, collection) {
			collection.insert({'stripeReq':request.body}, function(err, result){
				console.log(err);

			});
		});
	});