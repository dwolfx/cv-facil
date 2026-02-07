
// Setup type definitions for Deno environment
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

console.log("Hello from delete-user 2.0")

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Check strict CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        console.log("Request received")

        // 1. Init Client with Auth Header
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 2. Get User
        const {
            data: { user },
            error: userError
        } = await supabaseClient.auth.getUser()

        if (userError || !user) {
            console.error("Auth Failed", userError)
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 401,
            })
        }

        console.log("User identified:", user.id)

        // 3. Init Admin Client
        const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
        if (!serviceKey) {
            throw new Error('Missing Service Role Key')
        }

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            serviceKey
        )

        // 4. Perform Deletion (Resumes only, let's keep profile for a second to verify partial success if needed, but actually user wants everything gone)
        // We try to delete everything.
        await supabaseAdmin.from('resumes').delete().eq('user_id', user.id)
        await supabaseAdmin.from('profiles').delete().eq('id', user.id)

        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id)

        if (deleteError) {
            console.error("Delete Error", deleteError)
            return new Response(JSON.stringify({ error: deleteError.message }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            })
        }

        console.log("Deletion successful")
        return new Response(JSON.stringify({ message: 'Deleted' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })

    } catch (error) {
        console.error("Critical Error", error)
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        })
    }
})
