const workermodel = require('../model/workermodel');
const bcrypt = require('bcrypt');
const session =require('express-session')
async function validateWorker(data) {
    if (data.email && data.password) {
        const user = await workermodel.findOne({ email: data.email });

        if (user) {
            const isMatch = await bcrypt.compare(data.password, user.password);
            if (isMatch) {
                return { success: true, user,redirectTo: '/home' };
            } else {
                return { success: false, message: 'Invalid password' };
            }
        } else {
            return { success: false, message: 'Worker not found' };
        }
    } else {
        return { success: false, message: 'email and password are required' };
    }
}

module.exports = { validateWorker };
