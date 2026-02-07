// Follow this setup guide to deploy: 
// https://supabase.com/docs/guides/functions/deploy

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
    httpClient: Stripe.createFetchHttpClient(),
})
const cryptoProvider = Stripe.createSubtleCryptoProvider()

serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature')
    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    let event
    try {
        event = await stripe.webhooks.constructEventAsync(
            body,
            signature!,
            webhookSecret!,
            undefined,
            cryptoProvider
        )
    } catch (err) {
        return new Response(err.message, { status: 400 })
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        const userId = session.client_reference_id

        // Determine plan based on amount (using subtotal to handle coupons)
        const amount = session.amount_subtotal || session.amount_total
        let newPlan = ''

        // Preços Ajustados (em centavos):
        if (amount === 1000) newPlan = 'monthly' // R$ 10,00
        if (amount === 10000) newPlan = 'yearly' // R$ 100,00
        if (amount === 30000) newPlan = 'lifetime' // R$ 300,00

        console.log(`Processing payment: Amount=${amount} (Subtotal=${session.amount_subtotal}), Plan=${newPlan}, User=${userId}`)

        if (!newPlan) {
            console.error('Unknown plan amount:', amount)
            return new Response('Unknown plan amount', { status: 400 })
        }

        if (userId) {
            const supabase = createClient(
                Deno.env.get('SUPABASE_URL') ?? '',
                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
            )

            const { error } = await supabase
                .from('profiles')
                .update({
                    plan_tier: newPlan,
                    stripe_customer_id: session.customer
                })
                .eq('id', userId)

            if (error) console.error('Error updating profile:', error)
            else console.log(`User ${userId} upgraded to ${newPlan}`)
        }
    }

    return new Response(JSON.stringify({ received: true }), {
        headers: { 'Content-Type': 'application/json' },
    })
})
