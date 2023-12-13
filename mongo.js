const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('provide name and number please!')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstackdata:${password}@cluster0.tpglgnu.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})


if (process.argv.length == 3) {
    Person
      .find({})
      .then(persons => {
        console.log('phonebook:')
        persons
          .forEach(person => {
            console.log(person.name, person.number)
          })
        mongoose.connection.close()
      })

} else {
    person.save().then(res => {
    console.log(`added ${person.name} number ${person.number} to the phonebook`)
    mongoose.connection.close()
})}

