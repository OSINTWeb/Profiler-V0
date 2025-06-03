const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const router = express.Router()

// Create a payment intent
router.post('/', async (req, res) => {
  try {
    const { 
      amount, 
      currency, 
      customer, 
      description, 
      shipping, 
      payment_method_types = ['card']
    } = req.body

    // Validate required fields
    if (!amount || !currency || !customer || !description) {
      return res.status(400).json({
        error: 'Amount, currency, customer, and description are required'
      })
    }

    // Determine if this is an international payment
    const isInternational = currency !== 'inr'
    
    // Base payment intent parameters
    const paymentIntentParams = {
      amount: Math.round(amount), // Ensure amount is in smallest currency unit
      currency: currency.toLowerCase(),
      customer,
      description,
      payment_method_types,
      metadata: {
        transaction_type: isInternational ? 'export' : 'domestic',
        currency_original: currency,
        description_export: isInternational ? description : undefined
      }
    }

    // Add shipping for international physical goods
    if (shipping) {
      paymentIntentParams.shipping = {
        name: shipping.name,
        address: {
          line1: shipping.address.line1,
          line2: shipping.address.line2 || undefined,
          city: shipping.address.city,
          state: shipping.address.state,
          postal_code: shipping.address.postalCode,
          country: shipping.address.country
        }
      }
      
      // Add metadata for export goods
      paymentIntentParams.metadata.has_shipping = 'true'
      paymentIntentParams.metadata.shipping_country = shipping.address.country
    }

    // For international payments, enable 3D Secure
    if (isInternational) {
      paymentIntentParams.payment_method_options = {
        card: {
          request_three_d_secure: 'automatic'
        }
      }
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create(paymentIntentParams)

    res.json({
      client_secret: paymentIntent.client_secret,
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      metadata: paymentIntent.metadata
    })

  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message
    })
  }
})

// Confirm a payment intent (for additional processing if needed)
router.post('/:id/confirm', async (req, res) => {
  try {
    const { id } = req.params
    const { payment_method } = req.body

    const paymentIntent = await stripe.paymentIntents.confirm(id, {
      payment_method
    })

    res.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      payment_method: paymentIntent.payment_method
    })

  } catch (error) {
    console.error('Error confirming payment intent:', error)
    res.status(500).json({
      error: 'Failed to confirm payment intent',
      details: error.message
    })
  }
})

// Get payment intent details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    
    const paymentIntent = await stripe.paymentIntents.retrieve(id)

    res.json({
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status,
      description: paymentIntent.description,
      shipping: paymentIntent.shipping,
      metadata: paymentIntent.metadata
    })

  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    res.status(500).json({
      error: 'Failed to retrieve payment intent',
      details: error.message
    })
  }
})

module.exports = router 