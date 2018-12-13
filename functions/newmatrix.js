var db = require( '../db.js' );
var newfeeder = require( './newfeederspill.js' );
exports.matrix = function(username, sponsor, res){
	//get the person he or she should be under.
	db.query('SELECT parent.sponsor, parent.user FROM user_tree AS node, user_tree AS parent WHERE node.lft BETWEEN parent.lft AND parent.rgt AND node.user = ? AND parent.feeder is not null ORDER BY parent.lft', [username], function(err, results, fields){
		if ( err ) throw err;
		var last = results.slice( -2)[0];
		var user = last.user;
		db.query('SELECT * FROM feeder_tree WHERE user = ?', [user], function(err, results, fields){
			if (err) throw err;
			var feeder = {
				a: results[0].a,
				b: results[0].b,
				c: results[0].c
			}
			if(feeder.a === null){
				//get the stuffs to do
				db.query('UPDATE feeder_tree SET a = ? WHERE user = ?', [username, user], function(err, results, fields){
					if(err) throw err;
					//call the procedure for adding
					db.query('CALL leafadd(?,?)', [user, username], function(err, results, fields){
						if (err) throw err;
						//get the account details of the user
						db.query('SELECT * FROM profile WHERE user = ?', [user], function(err, results, fields){
							if ( err ) throw err;
							var bank = {
								bank: results[0].bank,
								account_name: results[0].account_name,
								account_number: results[0].account_number
							}
							//get the phone number of the user
							db.query('SELECT full_name, phone, code FROM user WHERE username = ?', [user], function(err, results, fields){
								if ( err ) throw err;
								//get the user details
								var contact = {
									full_name: results[0].full_name,
									phone: results[0].phone,
									code: results[0].code
								}
								//enter it into the order table
								db.query('INSERT INTO orders (fullname, payer, receiver, accountName, bank, accountNumber, status, purpose,code, phone) VALUES( ?,?,?,?,?,?,?,?,?,? )', ['ADMINISTRATOR', username, 'Admin', 'The account Name', 'ACCESS', '1234567890', 'pending', 'admin fee', 234, 8061179366], function( err, results, fields ){
										if( err ) throw err
										db.query('INSERT INTO orders (fullname, payer, receiver, accountName, bank, accountNumber, status, purpose,code, phone) VALUES( ?,?,?,?,?,?,?,?,?,? ) ', [contact.full_name, username, user, bank.account_name, bank.bank, bank.account_number, 'pending', 'matrix', contact.code, contact.phone], function( err, results, fields ){
										if( err ) throw err
										res.redirect('dashboard');
									});	
								});
							});
						});
					});
				});
			}
			if(feeder.a !== null && feeder.b === null){
				//get the stuffs to do
				db.query('UPDATE feeder_tree SET b = ? WHERE user = ?', [username, user], function(err, results, fields){
					if(err) throw err;
					//call the procedure for adding
					db.query('CALL leafadd(?,?)', [user, username], function(err, results, fields){
						if (err) throw err;
						//check for the sponsor of the boss which is user.
						db.query('SELECT sponsor FROM user WHERE username = ?', [sponsor], function(err, results, fields){
							if ( err ) throw err;
							var spon = results[0].sponsor;
							//check if the sponsor has a valid matrix.
							db.query('SELECT a, b, c FROM feeder_tree WHERE user = ?', [spon], function(err, results, fields){
								if( err ) throw err;
								if(results.length === 0){
									var sponinherit = 'miracle0403';
									//rest of the matrix
									//get the account details of the user
									db.query('SELECT * FROM profile WHERE user = ?', [sponinherit], function(err, results, fields){
										if ( err ) throw err;
										var bank = {
											bank: results[0].bank,
											account_name: results[0].account_name,
											account_number: results[0].account_number
										}
										//get the phone number of the user
										db.query('SELECT full_name, phone, code FROM user WHERE username = ?', [sponinherit], function(err, results, fields){
											if ( err ) throw err;
											//get the user details
											var contact = {
												full_name: results[0].full_name,
												phone: results[0].phone,
												code: results[0].code
											}
											//enter it into the order table
											db.query('CALL earnings(?,?,?,?,?,?,?,?)', [user, contact.full_name, contact.phone, contact.code, bank.bank, bank. account_name, bank.account_number], function(err, results, fields){
												if (err) throw err;
												res.redirect('dashboard');
											});
										});
									});
								}else{
									//get the variables for the sponinherit
									
									var last = results.slice(-1)[0];
									var use  = {
										a: last.a,
										b: last.b,
										c: last.c
									}
									if (use.a === null || use.b === null || use.c === null){
										//what to do... rest of the matrix.
										var sponinherit = spon;
										//get the account details of the user
										db.query('SELECT * FROM profile WHERE user = ?', [sponinherit], function(err, results, fields){
											if ( err ) throw err;
											var bank = {
												bank: results[0].bank,
												account_name: results[0].account_name,
												account_number: results[0].account_number
											}
											//get the phone number of the user
											db.query('SELECT full_name, phone, code FROM user WHERE username = ?', [sponinherit], function(err, results, fields){
												if ( err ) throw err;
												//get the user details
												var contact = {
													full_name: results[0].full_name,
													phone: results[0].phone,
													code: results[0].code
												}
												//enter it into the order table
												db.query('CALL earnings(?,?,?,?,?,?,?,?)', [user, contact.full_name, contact.phone, contact.code, bank.bank, bank. account_name, bank.account_number], function(err, results, fields){
													if (err) throw err;
													res.redirect('dashboard');
												});
											});
										});
									}else{
										//take back to the admin.
										var sponinherit = 'miracle0403';
										//rest of the matrix
										//get the account details of the user
										db.query('SELECT * FROM profile WHERE user = ?', [sponinherit], function(err, results, fields){
											if ( err ) throw err;
											var bank = {
												bank: results[0].bank,
												account_name: results[0].account_name,
												account_number: results[0].account_number
											}
											//get the phone number of the user
											db.query('SELECT full_name, phone, code FROM user WHERE username = ?', [sponinherit], function(err, results, fields){
												if ( err ) throw err;
												//get the user details
												var contact = {
													full_name: results[0].full_name,
													phone: results[0].phone,
													code: results[0].code
												}
												//enter it into the order table
												db.query('CALL earnings(?,?,?,?,?,?,?,?)', [user, contact.full_name, contact.phone, contact.code, bank.bank, bank. account_name, bank.account_number], function(err, results, fields){
													if (err) throw err;
													res.redirect('dashboard');
												});
											});
										});
									}
								}
							});
						});
					});
				});
			}
			if(feeder.a !== null && feeder.b !== null && feeder.c === null){
				//get the stuffs to do
				db.query('UPDATE feeder_tree SET c = ? WHERE user = ?', [username, user], function(err, results, fields){
					if(err) throw err;
					//call the procedure for adding
					db.query('CALL leafadd(?,?)', [user, username], function(err, results, fields){
						if (err) throw err;
						//get the account details of the user
						db.query('SELECT * FROM profile WHERE user = ?', [user], function(err, results, fields){
							if ( err ) throw err;
							var bank = {
								bank: results[0].bank,
								account_name: results[0].account_name,
								account_number: results[0].account_number
							}
							//get the phone number of the user
							db.query('SELECT full_name, phone, code FROM user WHERE username = ?', [user], function(err, results, fields){
								if ( err ) throw err;
								//get the user details
								var contact = {
									full_name: results[0].full_name,
									phone: results[0].phone,
									code: results[0].code
								}
								//enter it into the order table
								db.query('CALL orders(?,?,?,?,?,?,?,?)', [user, username,  contact.full_name, contact.phone, contact.code, bank.bank, bank. account_name, bank.account_number], function(err, results, fields){
									if (err) throw err;
									res.redirect('dashboard');
								});
							});
						});
					});
				});
			}
			if(feeder.a !== null && feeder.b !== null && feeder.c !== null){
			
				//get spillovers
				newfeeder.feederspill( username, user, sponsor, res);
			}
		});
	});
}