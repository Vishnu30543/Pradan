const mongoose = require('mongoose')
const Admin = require('./models/Admin')
const Executive = require('./models/Executive')
const Farmer = require('./models/Farmer')

// Replace with your MongoDB URI from .env or use the one from addAdmin.js
const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.p36yabw.mongodb.net/pradan1?retryWrites=true&w=majority&appName=Cluster0'

async function addDemoData() {
    try {
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        console.log('Connected to MongoDB')

        // 1. Add Demo Admin
        const adminName = 'admin1'
        const adminPassword = 'admin@543'

        const existingAdmin = await Admin.findOne({ adminname: adminName })
        if (!existingAdmin) {
            // Pass plain password, let the model pre-save hook hash it
            const admin = new Admin({ adminname: adminName, password: adminPassword })
            await admin.save()
            console.log('Demo Admin created: admin1 / admin1')
        } else {
            console.log('Demo Admin already exists')
        }

        // 2. Add Demo Executive
        const execEmail = 'executive1@gmail.com'
        const execPassword = 'exe@123'

        const existingExec = await Executive.findOne({ email: execEmail })
        if (!existingExec) {
            const executive = new Executive({
                name: 'Demo Executive',
                email: execEmail,
                password: execPassword, // Plain password
                phno: 9876543210,
                region: 'Demo Region',
                employeeId: 'DEMO001',
                designation: 'Field Officer',
                address: {
                    street: '123 Demo St',
                    city: 'Demo City',
                    district: 'Demo District',
                    state: 'Demo State',
                    pincode: '123456'
                },
                assignedAreas: []
            })
            await executive.save()
            console.log('Demo Executive created: demo@executive.com / password123')
        } else {
            console.log('Demo Executive already exists')
        }

        // 3. Add Demo Farmer
        const farmerMobile = '9898989898'
        const farmerPassword = 'frm@123'

        const existingFarmer = await Farmer.findOne({ mobileNo: farmerMobile })
        if (!existingFarmer) {
            const farmer = new Farmer({
                name: 'Demo Farmer',
                fatherOrHusbandName: 'Demo Father',
                mobileNo: farmerMobile,
                password: farmerPassword, // Plain password
                villageName: 'Demo Village',
                panchayatName: 'Demo Panchayat',
                gender: 'male',
                address: {
                    district: 'Demo District',
                    state: 'Demo State',
                    pincode: '123456'
                }
            })
            await farmer.save()
            console.log('Demo Farmer created: 9999999999 / password123')
        } else {
            console.log('Demo Farmer already exists')
        }

        console.log('Demo data added successfully')
        process.exit(0)
    } catch (error) {
        console.error('Error adding demo data:', error)
        process.exit(1)
    }
}

addDemoData()
