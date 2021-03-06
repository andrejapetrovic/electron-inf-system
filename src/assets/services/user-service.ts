import { IpcMain } from 'electron';

export class UserService {

    constructor(db, ipcMain: IpcMain) {

        const bcrypt = require('bcryptjs');
        
        //const users = db.collection('users');
        const users = db;

        ipcMain.on('addUser', (event, arg) => {
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(arg.password, salt, (err, hash) => {
                    arg.password = hash;
                    users.insert(arg,  (error, response) => {  
                        if (error) event.sender.send('newUser', {added: false});    
                        event.sender.send('newUser', {added: true, user: response});
                      });
                });
            });
            
        })
        
        ipcMain.on('login', (event, arg) => {
            users.findOne({username: arg.username}, (error, user) => {
                if (error) throw error
                if(!user) {
                    event.sender.send('loginResponse', {logged: false, msg:'Nepostojeći username'});
                } else {
                    bcrypt.compare(arg.password, user.password, (err, res) => {
                        res === true ? event.sender.send('loginResponse', {logged: true, user: user})
                            : event.sender.send('loginResponse', {logged: false, msg:'Pogrešan password'});
                        });                                 
                }
            })
        })

        ipcMain.on('changePassword', (event, arg) => {
            users.findOne({username: arg.user.username}, (error, user) => {
                if (error) throw error
                bcrypt.compare(arg.pass.password, user.password, (err, res) => {
                    if (res) {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(arg.pass.newPassword, salt, (err, hash) => {
                                if (error) throw error           
                                 
                                    users.update({username: user.username}, 
                                        { $set: { password: hash } }, {}, (err, res) => {
                                            event.sender.send('passwordUpdate', {updated: true});  
                                        })
                                  
                            });
                        });
                    } else {
                        event.sender.send('passwordUpdate', {updated: false, msg:"Pogrešan password"});
                    }                             
                });
            });
        })

        ipcMain.on('getUsers', (event, arg) => {
            users.find({}, (error, docs) => {
                if (error) throw error     
                event.sender.send('sendUsers', docs);
              });          
        })

        ipcMain.on('deleteUser', (event, arg) => {

            users.remove({ username: arg }, {}, (err, res) => {
              if (err) throw err;
              event.sender.send('deleted', arg);
            });       
        })


    }

}