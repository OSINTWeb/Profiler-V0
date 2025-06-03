const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, address } = req.body

    // Validate required fields
    if (!name || !email) {
      return res.status(400).json({
        error: 'Name and email are required'
      })
    }

    // Create customer with Stripe
    const customer = await stripe.customers.create({
      name,
      email,
      phone,
      address: {
        line1: address.line1,
        line2: address.line2 || undefined,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country
      },
      metadata: {
        created_via: 'payment_gateway',
        country: address.country,
        is_international: address.country !== 'IN' ? 'true' : 'false'
      }
    })

    res.json({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      created: customer.created
    })

  } catch (error) {
    console.error('Error creating customer:', error)
    res.status(500).json({
      error: 'Failed to create customer',
      details: error.message
    })
  }
})

module.exports = router 