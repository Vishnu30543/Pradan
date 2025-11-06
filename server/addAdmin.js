const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Replace with your actual Admin model path
const Admin = require('./models/Admin')

// Replace with your MongoDB URI from .env
const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.p36yabw.mongodb.net/pradan1?retryWrites=true&w=majority&appName=Cluster0'

async function addAdmin() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })

  const adminname = 'admin1' // Change as needed
  const password = 'admin1' // Change as needed

  // Check if admin already exists
  const existing = await Admin.findOne({ adminname })
  if (existing) {
    console.log('Admin already exists.')
    process.exit(0)
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const admin = new Admin({ adminname, password: hashedPassword })
  await admin.save()
  console.log('Admin created successfully!')
  process.exit(0)
}

addAdmin().catch(err => {
  console.error(err)
  process.exit(1)
})