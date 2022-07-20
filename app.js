const express = require('express');
const { randomUUID } = require('crypto');
const fs = require('fs');

const app = express();

app.use(express.json());

let customers = [];

fs.readFile("customers.json", "utf-8", (err, data) => {
  if(err) {
    console.log(err);
  }else {
    customers = JSON.parse(data);
  }
});

app.post('/customers', (request, response) => {
  const { status, name, contacts } = request.body;
  
  const customer = {
    status,
    name,
    contacts,
    id: randomUUID()
  }
  
  customers.push(customer);

  customerFile();
  
  return response.json(customer)
});

app.get('/customers', (request, response) => {
  return response.json(customers);
});

app.get('/customers/:id', (request, response) => {
  const { id } = request.params;
  const customer = customers.find(customer => customer.id === id);
  return response.json(customer);
});

app.put('/customers/:id', (request, response) => {
  const { id } = request.params;
  const { status, name, contacts } = request.body;

  const customerIndex = customers.findIndex(customer => customer.id === id);

  customers[customerIndex] = {
    ...customers[customerIndex],
    status,
    name,
    contacts,
  }

  customerFile()

  return response.json({ message: 'Client successfully changed !' });
});

app.delete('/customers/:id', (request, response) => {
  const { id } = request.params;

  const customerIndex = customers.findIndex(customer => customer.id === id);
  
  customers.splice(customerIndex, 1);

  customerFile();

  return response.json({ message: 'Client successfully removed !' });
});

function customerFile() {
  fs.writeFile("customers.json", JSON.stringify(customers), (err) => {
    if(err) {
      console.log(err);
    }else {
      console.log('Customer added');
    }
  });
}

app.listen(4002, () => console.log('The server is running on port 4002.'));